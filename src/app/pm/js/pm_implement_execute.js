angular.module('app')
    .controller('pmImplementExecuteController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'pmDbService', 'pmUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, pmDbService, pmUtilService) {
        $scope.$parent.checkLimit('implement', function() {
            $scope.data = {
                lives: [
                    { id: 1, name: '正常工作' },
                    { id: 2, name: '小问题，不影响使用' },
                    { id: 3, name: '有故障，需要维修' },
                    { id: 4, name: '不能使用' }
                ],
                selectLive: { id: 1, name: '正常工作' },
                nextDt: (new Date()).getTime(),
                nextDt2: (new Date()).getTime(),
                implement: {
                    no: '',
                    name: '',
                    model: '',
                    departmentName: '',
                    cycle: 0, // PM周期
                    level: 0, // PM等级
                    directorName: '',
                    createTime: 0, // 创建时间（时间戳）
                    prevDate: 0, // 上次实施日期（时间戳）
                    nextDate: 0, // 下次实施日期（时间戳）
                    equipmentStatus: '',
                    actualStartDate: 0, // 实际开始日期（时间戳）
                    actualEndDate: 0, // 实际结束日期（时间戳）
                    template: [],
                    live: 1, //设备现状1：正常工作 2：小问题不影响使用 3：有故障需要维修 4：不能使用
                    workTime: '', //工时
                    files: [],
                    remarks: ''
                },
                print: {
                    hospital: '',
                    no: '',
                    name: '',
                    model: '',
                    departmentName: '',
                    directorName: '',
                    items: []
                },
                acceptUsers: [],
                currentUser: {id: 0, name: '请选择'}
            };

            $scope.uploadFile = function() {
                angular.element('#uploadId').click();
            };

            $scope.removeFile = function(index) {
                $scope.data.implement.files.splice(index, 1);
            };

            // 选择设备现状
            $scope.changeLive = function(item) {
                $scope.data.selectLive = item;
                $scope.data.implement.live = item.id;
            };

            // 选择答案
            $scope.chooseAnswer = function(v, id) {
                v.answer = id;
            };

            // 移除错误提示
            $scope.removeErr = function() {
                $scope.data.err = "";
            };

            // 获取实施内容
            $scope.getImplementInfo = function() {
                pmDbService.getImplementInfo($stateParams.id, function(data) {
                    data.workTime = data.workTime ? data.workTime : '';
                    data.live = data.live ? data.live : 1;
                    data.level = data.level ? data.level : 0;
                    data.remarks = data.remarks || '';
                    data.actualEndDate = data.actualEndDate ? data.actualEndDate : (new Date()).getTime();
                    data.files = data.files || [];
                    if (data.live) {
                        $scope.data.selectLive = {
                            id: data.live,
                            name: {
                                '1': '正常工作',
                                '2': '小问题，不影响使用',
                                '3': '有故障，需要维修',
                                '4': '不能使用'
                            }[data.live]
                        };
                    }
                    if(data.checkId && +data.checkId > 0){
                        $scope.data.currentUser = {id: data.checkId, name: data.checkName, realName: data.checkName};
                    }
                    $scope.data.implement = data;
                    $scope.data.implement.table = pmUtilService.convertToTable(data.items);
                    $scope.$apply();
                    var dt = new Date(data.nextDate);
                    dt.setMonth(dt.getMonth() + data.cycle);
                    $scope.data.nextDt = dt.getTime();
                    $scope.data.nextDt2 = dt.getTime();
                    setStartDatepicker(null, new Date($scope.data.implement.actualEndDate), new Date($scope.data.implement.actualStartDate));
                    setEndDatepicker(new Date(pmUtilService.getMinDateStr($scope.data.implement.actualStartDate)), new Date("2050-01-01"), new Date($scope.data.implement.actualEndDate));
                    pmUtilService.setDatepicker('#nextDt', new Date($scope.data.nextDt), null, null, new Date("2050-01-01"), function(b) {
                        $scope.data.nextDt = new Date(b.startDate).getTime();
                    });
                })
            };

            // 暂存
            $scope.saveTemp = function() {
                var temp = getParam(1);
                pmDbService.saveOrSubmitImplement(temp, function() {
                    pmUtilService.tost('保存成功');
                });
            };

            // 提交实施报告
            $scope.submit = function() {
                // console.log($scope.data.implement);
                var flag = true;
                for (var i = 0, len = $scope.data.implement.table.length; i < len; i++) {
                    if (!($scope.data.implement.table[i].answer && +$scope.data.implement.table[i].answer > 0)) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    if ($scope.data.implement.workTime === "") {
                        pmUtilService.tost('请输入工时');
                        return;
                    }
                    if (!(+$scope.data.implement.workTime > 0)) {
                        $scope.data.implement.workTime = '';
                        pmUtilService.tost('请输入工时');
                        return;
                    }
                    $scope.data.nextDt = $scope.data.nextDt2;
                    $('#nextDt').val((new Date($scope.data.nextDt)).Format("yyyy-MM-dd"));
                    // angular.element('#nextDt').setStartDate(new Date($scope.data.nextDt))
                    $('#nextDt').on('show.daterangepicker', function(a, b) {
                        b.setStartDate(new Date($scope.data.nextDt))
                    });
                    layer.open({
                        type: 1,
                        title: ['提示', pmUtilService.layerStyle],
                        content: $('#template_submit'),
                        area: ['500px', '400px'],
                        btn: ['确定', '取消'],
                        yes: function(index, layero) {
                            var temp = getParam(2);
                            temp.nextDate = $scope.data.nextDt;
                            if($scope.data.currentUser.id > 0){
                                temp.checkMan = {id: $scope.data.currentUser.id, name: $scope.data.currentUser.realName};
                            }
                            pmDbService.saveOrSubmitImplement(temp, function() {
                                layer.close(index);
                                $state.go('pm.menu.implementsuccess', { id: $stateParams.id });
                            });
                        },
                        success: function () {
                            pmDbService.getCheckUsersForPlan(function(data) {
                                data = data || [];
                                if(data.length > 0){
                                    for(var i=0,len=data.length; i<len; i++){
                                        data[i].name = data[i].realName + ' ' + data[i].mobile;
                                        if($scope.data.currentUser.id == data[i].id) {
                                            $scope.data.currentUser.name = data[i].realName + ' ' + data[i].mobile;
                                        }
                                    }
                                }
                                $scope.data.acceptUsers = [{id: 0, name: '请选择'}].concat(data);
                                $scope.$apply();
                            });
                        }
                    });
                } else {
                    pmUtilService.tost('实施内容未完成，请检查后提交');
                }

            };

            $scope.changeUser = function (item) {
                $scope.data.currentUser = item;
            };

            // 打印
            $scope.print = function() {
                pmDbService.getImplementPrint($stateParams.id, function(data) {
                    $scope.data.print = data;
                    $scope.data.print.table = pmUtilService.convertToTableForPrint(data.items);
                    $scope.$apply();
                    layer.open({
                        type: 1,
                        title: ["打印预览", pmUtilService.layerStyle],
                        content: $('#template_report'),
                        area: ['1000px', '600px'],
                        btn: ['打印', '关闭'],
                        yes: function(index, layero) {
                            //layer.close(index);
                            $("#template_report").jqprint();
                        }
                    });
                });
            };

            // 方法
            function setStartDatepicker(min, max, st, en) {
                pmUtilService.setDatepicker('#startDt', st, en, min, max, function(b) {
                    $scope.data.implement.actualStartDate = new Date(b.startDate).getTime();
                    setEndDatepicker(new Date(b.startDate), new Date("2050-01-01"), new Date($scope.data.implement.actualEndDate));
                });
            }

            function setEndDatepicker(min, max, st, en) {
                pmUtilService.setDatepicker('#endDt', st, en, min, max, function(b) {
                    $scope.data.implement.actualEndDate = new Date(b.startDate).getTime();
                    setStartDatepicker(null, new Date(b.startDate), new Date($scope.data.implement.actualStartDate));
                });
            }

            function getParam(type) {
                var param = {
                    id: $stateParams.id, //实施id
                    type: type, //1:暂存 2：提交
                    template: [],
                    live: $scope.data.implement.live, //设备现状1：正常工作 2：小问题不影响使用 3：有故障需要维修 4：不能使用
                    workTime: $scope.data.implement.workTime || 0, //工时
                    files: [],
                    remarks: pmUtilService.myTrim($scope.data.implement.remarks),
                    actualStartDate: $scope.data.implement.actualStartDate, // 实际开始日期（时间戳）
                    actualEndDate: $scope.data.implement.actualEndDate // 实际结束日期（时间戳）
                };
                var obj = {};
                for (var i = 0, len = $scope.data.implement.table.length; i < len; i++) {
                    obj[$scope.data.implement.table[i].itemId + '-' + $scope.data.implement.table[i].id] = $scope.data.implement.table[i];
                }
                var temp = null;
                for (var i = 0, len = $scope.data.implement.items.length; i < len; i++) {
                    temp = {
                        id: $scope.data.implement.items[i].id,
                        name: $scope.data.implement.items[i].name,
                        options: []
                    };
                    for (var j = 0, len2 = $scope.data.implement.items[i].options.length; j < len2; j++) {
                        temp.options.push({
                            id: obj[$scope.data.implement.items[i].id + '-' + $scope.data.implement.items[i].options[j].id].id,
                            name: obj[$scope.data.implement.items[i].id + '-' + $scope.data.implement.items[i].options[j].id].name,
                            answer: obj[$scope.data.implement.items[i].id + '-' + $scope.data.implement.items[i].options[j].id].answer,
                            setnum: pmUtilService.myTrim(obj[$scope.data.implement.items[i].id + '-' + $scope.data.implement.items[i].options[j].id].setnum),
                            measure: pmUtilService.myTrim(obj[$scope.data.implement.items[i].id + '-' + $scope.data.implement.items[i].options[j].id].measure),
                            remarks: pmUtilService.myTrim(obj[$scope.data.implement.items[i].id + '-' + $scope.data.implement.items[i].options[j].id].remarks)
                        });
                    }
                    param.template.push(temp);
                }
                for (var i = 0, len = $scope.data.implement.files.length; i < len; i++) {
                    param.files.push({ name: $scope.data.implement.files[i].name, url: $scope.data.implement.files[i].url });
                }
                return param;
            }

            // 文件上传
            $scope.upload = function(a) {
                var formData = new FormData();
                formData.append("files", a);
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/zuul/api/upload3');
                xhr.send(formData);
                xhr.onreadystatechange = function() {
                    var res = xhr.response;
                    $scope.imgLoading = false;
                    var resmsg = '网络故障，上传失败，请重试';
                    if (xhr.readyState == 4) {
                        if (JSON.parse(res).code == '200') {
                            resmsg = '上传成功';
                            var obj = JSON.parse(res).data[0];
                            $scope.data.implement.files.push({ name: obj.fileName, url: obj.uploadUrl });
                            $scope.$apply();
                        }
                        var msg = layer.msg('<div class="toaster"><span>' + resmsg + '</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                }
            }

            // 页面初始化
            $scope.getImplementInfo();
            setTimeout(function() {
                angular.element('#uploadId').change(function(e) {
                    if (e.currentTarget.files.length) {
                        var _size = e.currentTarget.files[0].size / (1024 * 1024),
                            msg;
                        if (_size > 5) {
                            return msg = layer.msg('<div class="toaster"><span>' + '文件大于5M，上传失败' + '</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0,
                                end: function () {
                                    angular.element('#uploadId').val('');
                                }
                            });
                        }
                        $scope.upload(e.currentTarget.files[0]);
                    }
                });
            }, 100);
        })
    }]);