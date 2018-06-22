angular.module('app')
    .controller('pmPlanInfoController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'pmDbService', 'pmUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, pmDbService, pmUtilService) {
        $scope.$parent.checkLimit('plan', function() {
            $scope.data = {
                limit: {
                    edit: $rootScope.userInfo.authoritiesStr.indexOf('PM_PLAN_NEW_EDIT') != -1,
                    disable: $rootScope.userInfo.authoritiesStr.indexOf('PM_PLAN_DISABLE_ENABLE') != -1
                },
                nextDt: '',
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
                tabIndex: 1,
                hasChange: false,
                list: [],
                loading: true,
                empty: false,
                err: ''
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
                    $scope.getPlanImplements(1, $scope.pageInfo.size);
                }
            };

            // 编辑计划
            $scope.editPlan = function() {
                $state.go('pm.menu.planedit', { id: $stateParams.id });
            };

            // 停用计划
            $scope.disablePlan = function() {
                openDialog2('#template_disable', function(index) {
                    pmDbService.disablePlan($stateParams.id, function() {
                        layer.close(index);
                        $scope.getPlanInfoForBrowse();
                    });
                });
            };

            // 启用计划
            $scope.enablePlan = function() {
                $scope.data.nextDt = '';
                $('#nextDt').val('');
                $scope.data.err = '';
                openDialog2('#template_enable', function(index) {
                    var param = {
                        id: $stateParams.id,
                        nextDate: $scope.data.nextDt
                    };
                    if (param.nextDate === '') {
                        $scope.data.err = '请选择下次实施日期';
                        $scope.$apply();
                        return;
                    }
                    pmDbService.enablePlan(param, function(data) {
                        layer.close(index);
                        $scope.data.nextDt = '';
                        $('#nextDt').val('');
                        if (data.status > 1) {
                            pmUtilService.tost("该设备状态处在" + data.msg + "中，不能被启用，请到资产列表中确认");
                        } else {
                            $scope.getPlanInfoForBrowse();
                        }

                    }, function(msg) {
                        layer.close(index);
                        pmUtilService.tost(msg);
                    });
                }, '275px');
            };

            // 获取实施内容
            $scope.getPlanInfoForBrowse = function() {
                pmDbService.getPlanInfoForBrowse($stateParams.id, function(data) {
                    $scope.data.plan = data;
                    $scope.data.plan.table = pmUtilService.convertToTableForPrint(data.template);
                    $scope.$apply();
                })
            };

            // PM记录查询
            $scope.getPlanImplements = function(pageNo, pageSize) {
                var param = {
                    id: $stateParams.id,
                    pageNo: pageNo,
                    pageSize: pageSize
                };
                $scope.data.loading = true;
                $scope.data.list = [];
                pmDbService.getPlanImplements(param, function(data) {
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
                pmDbService.getPlanReport(id, $scope, pmUtilService, '查看');
            };

            // 方法
            function openDialog2(id, fun, h) {
                layer.open({
                    type: 1,
                    title: ['提示', pmUtilService.layerStyle],
                    content: $(id),
                    area: ['480px', h ? h : '230px'],
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {
                        fun(index);
                    }
                });
            }

            // 页面初始化
            $scope.getPlanInfoForBrowse()
            setTimeout(function() {
                pmUtilService.setDatepicker('#nextDt', null, null, null, new Date("2050-01-01"), function(b) {
                    $scope.data.nextDt = new Date(b.startDate).getTime();
                    $scope.data.err = '';
                    $scope.$apply();
                });
            }, 1000);
        })
    }]);