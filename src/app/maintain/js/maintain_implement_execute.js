angular.module('app')
    .controller('maintainImplementExecuteController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'maintainDbService', 'maintainUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, maintainDbService, maintainUtilService) {
        $scope.$parent.checkLimit('implement', function() {
            $scope.data = {
                lives: [
                    { id: 1, name: '正常工作' },
                    { id: 2, name: '小问题，不影响使用' },
                    { id: 3, name: '有故障，需要维修' },
                    { id: 4, name: '不能使用' }
                ],
                selectLive: { id: 1, name: '正常工作' },
                nextDt: 0, // 下次实施日期
                actualEndDate: (new Date()).getTime(), // 实际日期
                implement: {}
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
                maintainDbService.getImplementInfo($stateParams.id, function(data) {
                    data.files = data.files || [];
                    for (var i = 0, len = data.templateItems.length; i < len; i++) {
                        data.templateItems[i].answer = 1; // 选项默认正常
                        data.templateItems[i].remarks = '';
                    }
                    data.attention = maintainUtilService.getAttention(data.nextImplementTime);
                    $scope.data.implement = data;
                    $scope.$apply();
                    // 日历控件初始化
                    maintainUtilService.setDatepicker('#startDt', new Date($scope.data.actualEndDate), null, null, new Date("2050-01-01"), function(b) {
                        $scope.data.actualEndDate = new Date(b.startDate).getTime();
                        console.log($scope.data.actualEndDate);
                    });
                    maintainUtilService.setDatepicker('#nextDt', new Date($scope.data.nextDt), null, null, new Date("2050-01-01"), function(b) {
                        $scope.data.nextDt = new Date(b.startDate).getTime();
                    });
                }, function(msg) {
                    maintainUtilService.tost(msg, function() {
                        $state.go('maintain.menu.plan');
                    });
                })
            };

            // 提交实施报告
            $scope.submit = function() {
                var dt = new Date($scope.data.implement.nextImplementTime);
                dt.setDate(dt.getDate() + ($scope.data.implement.rate > 1 ? 7 : 1));
                $scope.data.nextDt = dt.getTime();
                $('#nextDt').val((new Date($scope.data.nextDt)).Format("yyyy-MM-dd"));
                $('#nextDt').on('show.daterangepicker', function(a, b) {
                    b.setStartDate(new Date($scope.data.nextDt))
                });
                layer.open({
                    type: 1,
                    title: ['提示', maintainUtilService.layerStyle],
                    content: $('#template_submit'),
                    area: ['450px', '270px'],
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {
                        maintainDbService.submitImplement(getParam(), function(data) {
                            layer.close(index);
                            $state.go('maintain.menu.implementsuccess', { id: data.id });
                        }, function(msg) {
                            layer.close(index);
                            maintainUtilService.tost(msg, function() {
                                $state.go('maintain.menu.plan');
                            });
                        });
                    }
                });
            };

            // 打印
            $scope.print = function() {
                layer.open({
                    type: 1,
                    title: ["打印预览", maintainUtilService.layerStyle],
                    content: $('#template_report'),
                    area: ['1000px', '600px'],
                    btn: ['打印', '关闭'],
                    yes: function(index, layero) {
                        $("#template_report").jqprint();
                    }
                });
            };

            // 方法
            function getParam() {
                var param = {
                    "endDate": (new Date($scope.data.actualEndDate)).Format("yyyy-MM-dd"),
                    "files": [],
                    "nextImplementTime": (new Date($scope.data.nextDt)).Format("yyyy-MM-dd"),
                    "planId": $scope.data.implement.planId,
                    "planImplementId": $stateParams.id,
                    "assetsStatus": $scope.data.selectLive.id,
                    "remarks": $scope.data.implement.remarks,
                    "templateItemResults": []
                }
                for (var i = 0, len = $scope.data.implement.templateItems.length; i < len; i++) {
                    param.templateItemResults.push({
                        "itemRemarks": $scope.data.implement.templateItems[i].remarks,
                        "itemResult": $scope.data.implement.templateItems[i].answer,
                        "planTemplateId": $scope.data.implement.templateItems[i].planTemplateId,
                        "planTemplateItemId": $scope.data.implement.templateItems[i].id,
                        "planTemplateItemName": $scope.data.implement.templateItems[i].itemName
                    });
                }
                for (var i = 0, len = $scope.data.implement.files.length; i < len; i++) {
                    param.files.push({ fileName: $scope.data.implement.files[i].name, filePath: $scope.data.implement.files[i].url });
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
                                shade: 0
                            });
                        }
                        $scope.upload(e.currentTarget.files[0]);
                    }
                });
            }, 100);
        })
    }]);