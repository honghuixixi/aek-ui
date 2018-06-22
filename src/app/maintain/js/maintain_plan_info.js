angular.module('app')
    .controller('maintainPlanInfoController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'maintainDbService', 'maintainUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, maintainDbService, maintainUtilService) {
        $scope.$parent.checkLimit('plan', function() {
            var dt = new Date();
            dt.setDate(dt.getDate() - 29)
            $scope.data = {
                limit: {
                    edit: true, // $rootScope.userInfo.authoritiesStr.indexOf('PM_PLAN_NEW_EDIT') != -1,
                    disable: true // $rootScope.userInfo.authoritiesStr.indexOf('PM_PLAN_DISABLE_ENABLE') != -1
                },
                condition: {
                    startDt: dt.getTime(),
                    endDt: (new Date()).getTime()
                },
                hasInit: false,
                // nextDt: '',
                plan: {
                    no: '',
                    name: '',
                    model: '',
                    departmentName: '',
                    cycle: 0, // PM周期
                    level: 1, // PM等级
                    directorName: '',
                    createTime: 0, // 创建时间（时间戳）
                    prevDate: 0, // 上次实施日期（时间戳）
                    nextDate: 0, // 下次实施日期（时间戳）
                    equipmentStatus: '',
                    actualStartDate: 0, // 实际开始日期（时间戳）
                    actualEndDate: 0, // 实际结束日期（时间戳）
                    template: [],
                    reportNo: '',
                    live: 0, //设备现状1：正常工作 2：小问题不影响使用 3：有故障需要维修 4：不能使用
                    workTime: 0, //工时
                    files: [0],
                    remarks: ''
                },
                report: {},
                reportMuilty: {},
                tabIndex: 1,
                hasChange: false,
                list: [],
                loading: true,
                empty: false,
                err: '',
                edit: {
                    nextDate: '',
                    user: '',
                    err: ''
                },
                isSave: true
            };

            // 分页数据
            $scope.pageInfo = {
                pages: 0,
                total: 0,
                size: 8,
                current: 1,
                pstyle: 2
            };

            // 分页事件
            $scope.pagination = function(page, pageSize) {
                $scope.pageInfo.size = pageSize;
                $scope.getPlanImplements(page, pageSize);
            }

            // Tab切换
            $scope.changeTab = function(index) {
                $scope.data.tabIndex = index;
                if (index === 2 && !$scope.data.hasChange) {
                    $scope.data.hasChange = true;
                    setStartDatepicker(null, new Date(), dt, null);
                    setEndDatepicker(new Date(dt).Format("yyyy-MM-dd") + " 00:00:00", null);

                    $scope.getPlanImplements(1, $scope.pageInfo.size);
                }
            };

            // 编辑计划
            $scope.editPlan = function() {
                $scope.data.edit.nextDate = $scope.data.plan.nextImplementTime;
                $scope.data.edit.user = $scope.data.plan.administrator;
                $scope.data.edit.err = "";
                openDialog2('#template_edit', function(index) {
                    if ($scope.data.edit.user == '') {
                        $scope.data.edit.err = "请输入使用管理人";
                        $scope.$apply();
                    } else {
                        var param = {
                            id: $stateParams.id,
                            nextImplementTime: $scope.data.edit.nextDate,
                            administrator: $scope.data.edit.user
                        };
                        if ($scope.data.isSave) {
                            $scope.data.isSave = false;
                            maintainDbService.editPlan(param, function(data) {
                                $scope.data.plan.nextImplementTime = $scope.data.edit.nextDate;
                                $scope.data.plan.administrator = $scope.data.edit.user;
                                $scope.$apply();
                                maintainUtilService.tost("保存成功");
                                layer.close(index);
                                $scope.data.isSave = true;
                            }, function(msg) {
                                maintainUtilService.tost(msg);
                                layer.close(index);
                                $scope.data.isSave = true;
                            });
                        }
                    }
                });
            };

            // 停用计划
            $scope.disablePlan = function() {
                openDialog2('#template_disable', function(index) {
                    maintainDbService.disablePlan($stateParams.id, function() {
                        layer.close(index);
                        $scope.getPlanInfoForBrowse();
                    });
                });
            };

            // 获取实施内容
            $scope.getPlanInfoForBrowse = function() {
                maintainDbService.getPlanInfoForBrowse($stateParams.id, function(data) {
                    data.assetsName = data.mtAssets[0].assetsName;
                    data.assetsNum = data.mtAssets[0].assetsNum;
                    data.assetsSpec = data.mtAssets[0].assetsSpec;
                    data.assetsDeptName = data.mtAssets[0].deptName;
                    data.enable = data.enable ? 1 : 2;
                    $scope.data.plan = data;
                    if (!$scope.data.hasInit) {
                        $scope.data.hasInit = true;
                        var min = new Date(data.createTime);
                        min.setDate(min.getDate() - 1);
                        maintainUtilService.setDatepicker('#nextDt', new Date($scope.data.plan.nextImplementTime), null, min, new Date("2050-01-01"), function(b) {
                            $scope.data.edit.nextDate = new Date(b.startDate).getTime();
                        });
                    }
                    $scope.$apply();
                })
            };

            // 保养记录查询
            $scope.getPlanImplements = function(pageNo, pageSize) {
                var param = {
                    planId: $stateParams.id,
                    pageNo: pageNo,
                    pageSize: pageSize,
                    startDate: new Date($scope.data.condition.startDt).Format("yyyy-MM-dd") + " 00:00:00",
                    endDate: new Date($scope.data.condition.endDt).Format("yyyy-MM-dd") + " 23:59:59"
                };
                $scope.data.loading = true;
                $scope.data.list = [];
                maintainDbService.getPlanImplements(param, function(data) {
                    $scope.data.loading = false;
                    $scope.pageInfo.current = pageNo;
                    $scope.pageInfo.total = data.total;
                    $scope.data.list = data.records;
                    $scope.data.empty = data.records.length < 1;
                    $scope.$apply();
                });
            };

            // 打印
            $scope.print = function(id) {
                maintainDbService.getPlanReport(id, $scope, maintainUtilService, '查看');
            };

            // 批量打印
            $scope.printMuilty = function() {
                var dis = ($scope.data.condition.endDt - $scope.data.condition.startDt) / (24 * 60 * 60 * 1000);
                if (dis > 365) {
                    maintainUtilService.tost('建议打印周期最多为一年');
                } else {
                    var param = {
                        planId: $stateParams.id,
                        startDate: new Date($scope.data.condition.startDt).Format("yyyy-MM-dd") + " 00:00:00",
                        endDate: new Date($scope.data.condition.endDt).Format("yyyy-MM-dd") + " 23:59:59"
                    };
                    maintainDbService.getPlanReportMuilty(param, $scope, maintainUtilService, '查看');
                }
            };

            // 方法
            function openDialog2(id, fun, h) {
                layer.open({
                    type: 1,
                    title: ['提示', maintainUtilService.layerStyle],
                    content: $(id),
                    area: ['480px', h ? h : '230px'],
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {
                        fun(index);
                    }
                });
            }

            function setStartDatepicker(min, max, st, en) {
                maintainUtilService.setDatepicker('#startDt', st, en, min, max, function(b) {
                    $scope.data.condition.startDt = new Date(b.startDate).getTime();
                    setEndDatepicker(new Date(b.startDate), new Date("2050-01-01"), new Date($scope.data.condition.endDt));
                });
            }

            function setEndDatepicker(min, max, st, en) {
                maintainUtilService.setDatepicker('#endDt', st, en, min, max, function(b) {
                    $scope.data.condition.endDt = new Date(b.startDate).getTime();
                    setStartDatepicker(null, new Date(b.startDate), new Date($scope.data.condition.startDt));
                });
            }

            // 页面初始化
            $scope.getPlanInfoForBrowse()
        })
    }]);