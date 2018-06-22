angular.module('app')
    .controller('pmAcceptanceController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'pmDbService', 'pmUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, pmDbService, pmUtilService) {
        $scope.$parent.checkLimit('acceptance', function () {
            // 数据
            $scope.data = {
                height: document.body.clientHeight - 130,
                departments: [{ id: 0, name: '全部' }, { id: 1, name: '待验收' }, { id: 2, name: '已验收' }],
                condition: {
                    startDt: '',
                    endDt: '',
                    keyword: ''
                },
                selectItem: { id: 0, name: '全部' },
                list: [],
                loading: true,
                empty: false,
                report: null
            };

            // 分页数据
            $scope.pageInfo = {
                pages: 0,
                total: 0,
                size: 16,
                current: 1,
                pstyle: 2
            };

            $scope.changeItem = function (item) {
                $scope.data.selectItem = item;
                $scope.search();
            };

            // 分页事件
            $scope.pagination = function (page, pageSize) {
                $scope.pageInfo.size = pageSize;
                $scope.getImplementReport(page, pageSize);
            }

            // 查看报告
            $scope.browse = function (id) {
                pmDbService.getPlanReport(id, $scope, pmUtilService, '查看详情', function (index) {
                    pmDbService.acceptance(id, function () {
                        layer.close(index);
                        pmUtilService.tost('验收成功', function () {
                            $scope.search();
                        });
                    }, function (msg) {
                        layer.close(index);
                        pmUtilService.tost(msg, function () {
                            $scope.search();
                        });
                    });
                });
            };

            // 报告查询
            $scope.getImplementReport = function (pageNo, pageSize) {
                var param = {
                    pageNo: pageNo,
                    pageSize: pageSize,
                    userId: $rootScope.userInfo.id
                };
                if ($scope.data.selectItem.id > 0) {
                    param['status'] = $scope.data.selectItem.id;
                }
                if (($scope.data.condition.startDt + '').length > 0) {
                    param.startDate = new Date($scope.data.condition.startDt).Format("yyyy-MM-dd") + " 00:00:00";
                }
                if (($scope.data.condition.endDt + '').length > 0) {
                    param.endDate = new Date($scope.data.condition.endDt).Format("yyyy-MM-dd") + " 23:59:59";
                }
                pmUtilService.concatParam(param, 'keyword', $scope.data.condition.keyword);

                $scope.data.loading = true;
                $scope.data.list = [];
                pmDbService.getAccepttReport(param, function (data) {
                    $scope.data.loading = false;
                    $scope.pageInfo.current = pageNo;
                    $scope.pageInfo.total = data.total;
                    $scope.data.list = data.records;
                    $scope.data.empty = data.records.length < 1;
                    $scope.$apply();
                });
            };

            // 搜索
            $scope.search = function () {
                $scope.getImplementReport(1, $scope.pageInfo.size);
            };

            // 方法
            function setStartDatepicker(min, max, st, en) {
                pmUtilService.setDatepicker('#startDt', st, en, min, max, function (b) {
                    var st = new Date();
                    if (($scope.data.condition.endDt + '').length > 0) {
                        st = new Date($scope.data.condition.endDt);
                    }
                    $scope.data.condition.startDt = new Date(b.startDate).getTime();
                    setEndDatepicker(new Date(b.startDate), new Date("2050-01-01"), st);
                });
            }

            function setEndDatepicker(min, max, st, en) {
                pmUtilService.setDatepicker('#endDt', st, en, min, max, function (b) {
                    var st = new Date();
                    if (($scope.data.condition.startDt + '').length > 0) {
                        st = new Date($scope.data.condition.startDt);
                    }
                    $scope.data.condition.endDt = new Date(b.startDate).getTime();
                    setStartDatepicker(null, new Date(b.startDate), st);
                });
            }

            // 初始化
            for (var i = 0, len = $scope.data.departments.length; i < len; i++) {
                if ($scope.data.departments[i].id == $stateParams.status) {
                    $scope.data.selectItem = $scope.data.departments[i];
                    break;
                }
            }
            $scope.getImplementReport($scope.pageInfo.current, $scope.pageInfo.size);
            setTimeout(function () {
                setStartDatepicker(null, null, null, null);
                setEndDatepicker(null, null, null, null);
            }, 200);
        })
    }]);