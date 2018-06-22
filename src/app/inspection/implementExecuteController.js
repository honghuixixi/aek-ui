angular.module('app')
    .controller('implementExecuteController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'implementService', function ($rootScope, $scope, $stateParams, $localStorage, $state, implementService) {
        // 页面数据
        $scope.data = implementService.data(2);
        $scope.saveList = {};

        // 分页
        $scope.pageInfo = implementService.pageInfo();

        // 分页
        $scope.pagination = function (page, pagesize) {
            copyData();
            //implementService.saveTemp($scope);
            $scope.pageInfo.size = pagesize;
            implementService.getList($scope, page, pagesize, function () {
                copyData2();
                $scope.$apply();
            });
        };

        // 选项页切换
        $scope.changeConType = function (type) {
            $scope.data.conType = type;
            if (type === 1) {
                setTimeout($scope.initcalendar, 1000);
            }
        };

        // 暂存
        $scope.saveTemp = function () {
            copyData();
            for (var key in $scope.saveList) {
                checkStatus($scope.saveList[key]);
            }
            implementService.saveTemp($scope, function () {
                layer.msg('<div class="toaster"><span>保存成功</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
            }, displayMsg);
        };

        // 提交   
        $scope.clearAcceptUsers = function () {
            var data = $scope.data.acceptUserList;
            $scope.data.chooseUserList = [];
            for (var i = 0, len = data.length; i < len; i++) {
                data[i].checked = $scope.isChecked($scope.data.chooseUserList, data[i].id);
            }
        };    
        $scope.changeNextUser = function (item) {
            $scope.data.currentNextUser = item;
        };
        $scope.chooseUserFun = function (user) {
            user.checked = !user.checked;
            for (var i = 0, len = $scope.data.chooseUserList.length; i < len; i++) {
                if ($scope.data.chooseUserList[i].id == user.id) {
                    $scope.data.chooseUserList.splice(i, 1);
                    break;
                }
            }
            if (user.checked) {
                $scope.data.chooseUserList.push(user);
            }
        };
        $scope.isChecked = function (list, id) {
            var result = false;
            if (list.length > 0) {
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].id == id) {
                        result = true;
                        break;
                    }
                }
            }
            return result;
        };
        $scope.save = function () {
            copyData();
            var check = checkParam();
            if (check.flag) {
                $scope.data.nextDt = $scope.data.nextDt2;
                $('#nextDt').val((new Date($scope.data.nextDt)).Format("yyyy-MM-dd"));
                $('#nextDt').on('show.daterangepicker', function (a, b) {
                    b.setStartDate(new Date($scope.data.nextDt))
                });
                layer.open({
                    type: 1,
                    title: ["提示", implementService.layerStyle],
                    content: $('#template_submit'),
                    area: '650px',
                    btn: ['确定', '取消'],
                    yes: function (index, layero) {
                        layer.close(index);
                        implementService.save($scope, function (id) {
                            $state.go('inspection.implement.success', { planId: $scope.data.id, id: id });
                        }, function (msg) {
                            displayMsg(msg, function () {
                                $state.go('inspection.implement.list');
                            });
                        });
                    },
                    success: function () {
                        $scope.data.showAccept = false;
                        $scope.data.chooseUserList = [];
                        if ($scope.data.plan.checkMan && $scope.data.plan.checkMan.length > 0) {
                            for (var i = 0, len = $scope.data.plan.checkMan.length; i < len; i++) {
                                $scope.data.chooseUserList.push({
                                    id: $scope.data.plan.checkMan[i].id,
                                    name: $scope.data.plan.checkMan[i].name,
                                    realName: $scope.data.plan.checkMan[i].name
                                });
                            }
                        }
                        $.ajax({
                            type: 'get',
                            url: '/sys/restAPI/getQcUserList',
                            complete: function (res) {
                                if (res.responseJSON.code == 200) {
                                    var data = res.responseJSON.data || [];
                                    if (data.length > 0) {
                                        for (var i = 0, len = data.length; i < len; i++) {
                                            data[i].name = data[i].realName + ' ' + data[i].mobile;
                                        }
                                    }
                                    $scope.data.nextUserList = data;
                                    $scope.$apply();
                                }
                            }
                        });
                        $.ajax({
                            type: 'get',
                            url: '/sys/restAPI/getQcCheckUserList',
                            complete: function (res) {
                                if (res.responseJSON.code == 200) {
                                    var data = res.responseJSON.data || [];
                                    if (data.length > 0) {
                                        for (var i = 0, len = data.length; i < len; i++) {
                                            data[i].checked = $scope.isChecked($scope.data.chooseUserList, data[i].id);
                                        }
                                    }
                                    $scope.data.acceptUserList = data;
                                    $scope.$apply();
                                }
                            }
                        });
                    }
                });
            } else {
                displayMsg(check.msg);
            }
        };

        // 打印预览
        $scope.showPrint = implementService.showPrint($scope, implementService.layerStyle);

        //初始化日历
        function setDatepicker(id, min, max, fun, st, en) {
            var option = {
                format: 'YYYY-MM-DD',
                startDate: st ? st : new Date(),
                endDate: en ? en : new Date(),
                drops: 'up',
                // minDate: min,
                maxDate: max,
                isCotrScollEl: '.supper_detail',
                opens: 'left',
                timePicker: false,
                singleDatePicker: true
            };
            if (min) {
                option.minDate = min;
            }
            angular.element(id).daterangepicker($.extend({}, option, {}), function (date, enddate, el) { });
            $(id).on('apply.daterangepicker', function (a, b) {
                fun(b);
            });
        }
        function setStartDatepicker(min, max, st, en) {
            setDatepicker('#startDt', min, max, function (b) {
                $scope.data.plan.actualStartDate = new Date(b.startDate).getTime();
                setEndDatepicker(new Date(b.startDate), new Date("2050-01-01"), new Date($scope.data.plan.actualEndDate));
            }, st, en);
        }
        function setEndDatepicker(min, max, st, en) {
            setDatepicker('#endDt', min, max, function (b) {
                $scope.data.plan.actualEndDate = new Date(b.startDate).getTime();
                setStartDatepicker(null, new Date(b.startDate), new Date($scope.data.plan.actualStartDate));
            }, st, en);
        }
        $scope.initcalendar = function () {
            setStartDatepicker(null, new Date("2050-01-01"));
            setEndDatepicker(null, new Date("2050-01-01"));
            setDatepicker('#nextDt', null, new Date("2050-01-01"), function (b) {
                $scope.data.nextDt = new Date(b.startDate).getTime();
            });
        };

        // 页面初始化
        implementService.init($scope, +$stateParams.id, function () {
            $scope.data.nextUserList = [];
            $scope.data.currentNextUser = { id: $rootScope.userInfo.id, name: $rootScope.userInfo.realName + ' ' + $rootScope.userInfo.mobile, realName: $rootScope.userInfo.realName };
            $scope.data.acceptUserList = [];
            $scope.data.chooseUserList = [];
            $scope.data.showAccept = false;
            setTimeout($scope.initcalendar, 1000);
        }, function (data) {
            if (!(data.status && data.status === 2)) {
                displayMsg('该巡检已提交', function () {
                    $state.go('inspection.implement.list');
                });
            }
        });

        // 数据暂存
        function copyData() {
            for (var i = 0, len = $scope.data.equipments.length; i < len; i++) {
                $scope.saveList[$scope.data.equipments[i].id] = $scope.data.equipments[i];
            }
        }

        // 数据还原
        function copyData2() {
            for (var i = 0, len = $scope.data.equipments.length; i < len; i++) {
                if ($scope.saveList[$scope.data.equipments[i].id]) {
                    $scope.data.equipments[i] = $scope.saveList[$scope.data.equipments[i].id]
                }
            }
        }

        // 数据完整性检测
        function checkParam() {
            var msg = "",
                flag = $scope.data.plan.actualStartDate > 0;
            if (flag) {
                flag = $scope.data.plan.actualEndDate > 0;
                if (flag) {
                    for (var key in $scope.saveList) {
                        if (!(checkStatus($scope.saveList[key]))) {
                            flag = false;
                            msg = "巡检内容未完成，请检查后提交。";
                            break;
                        }
                    }
                } else {
                    msg = "请选择实际结束日期";
                }
            } else {
                msg = "请选择实际开始日期";
            }
            return { flag: flag, msg: msg };
        }

        function checkStatus(eq) {
            var flag = false;
            if (!eq.status) {
                eq.status = Object.keys(eq.answers).length === $scope.data.templates.length ? 2 : 1;
            }
            return eq.status > 1;
        }

        function displayMsg(msg, fun) {
            layer.msg('<div class="toaster"><span>' + msg + '</span></div>', {
                area: ['100%', '60px'],
                time: 3000,
                offset: 'b',
                shadeClose: true,
                shade: 0,
                end: fun
            });
        }
    }]);