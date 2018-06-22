angular.module('app')
    .controller('meteringTestingController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'meteringDbService', 'meteringUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, meteringDbService, meteringUtilService) {
        $scope.$parent.checkLimit('testing', function() {
            var dt = new Date();
            dt.setDate(dt.getDate() - 29);
            $scope.data = {
                server: {
                    list: []
                },
                local: {
                    typeOptions: [{ id: 0, name: '全部类别' }, { id: 1, name: '非强制性计量设备' }, { id: 2, name: '强制性计量设备' }],
                    departOptions: [{ id: 0, name: '选择部门' }],                    
                    keyword: '',
                    nextDateStart: dt.getTime(),
                    nextDateEnd: (new Date()).getTime(),
                    currentType: { id: 0, name: '全部类别' },
                    currentDepart: { id: 0, name: '选择部门' },
                },
                loading: true,
                empty: false
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
            $scope.pagination = function (page, pageSize) {
                $scope.pageInfo.size = pageSize;
                $scope.methods.getAssets(page, pageSize);
            }

            $scope.methods = {
                changeType: function (item) {
                    $scope.data.local.currentType = item;
                    $scope.methods.getAssets(1, $scope.pageInfo.size);
                },
                changeDepart: function (item) {
                    $scope.data.local.currentDepart = item;
                    $scope.methods.getAssets(1, $scope.pageInfo.size);
                },
                search: function () {
                    $scope.methods.getAssets(1, $scope.pageInfo.size);
                },
                getDeparts: function () {
                    meteringDbService.getDepartments($rootScope.userInfo.tenantId, function (data) {
                        $scope.data.local.departOptions = [{ id: 0, name: '选择部门' }].concat(data);
                        var st = new Date(new Date($scope.data.local.nextDateStart).Format("yyyy-MM-dd") + " 00:00:00");
                        var en = new Date(new Date($scope.data.local.nextDateEnd).Format("yyyy-MM-dd") + " 00:00:00");
                        setStartDatepicker(null, en, st, null);
                        setEndDatepicker(st, null, en, null);
                        $scope.$apply();
                    });
                },
                getAssets: function (pageNo, pageSize) {
                    var param = {
                        pageNo: pageNo,
                        pageSize: pageSize,
                    };
                    if ($scope.data.local.currentType.id > 0) {
                        param.measureManageType = $scope.data.local.currentType.id;
                    }
                    if ($scope.data.local.currentDepart.id > 0) {
                        param.assetsDeptId = $scope.data.local.currentDepart.id;
                    }
                    if ($scope.data.local.keyword.length > 0) {
                        param.keyword = $scope.data.local.keyword;
                    }
                    if (($scope.data.local.nextDateStart + '').length > 0) {
                        param.startDate = new Date($scope.data.local.nextDateStart).Format("yyyy-MM-dd") + " 00:00:00";
                    }
                    if (($scope.data.local.nextDateEnd + '').length > 0) {
                        param.endDate = new Date($scope.data.local.nextDateEnd).Format("yyyy-MM-dd") + " 23:59:59";
                    }
                    $scope.data.server.list = [];
                    $scope.data.loading = true;
                    meteringDbService.getAssetsTesting(param, function (json) {
                        $scope.data.loading = false;
                        $scope.data.server.list = json.records;
                        $scope.pageInfo.current = pageNo;
                        $scope.pageInfo.total = json.total;
                        $scope.data.empty = json.records.length < 1;
                        $scope.$apply();
                    });
                }
            };

            $scope.init = function () {
                $scope.methods.getAssets(1, $scope.pageInfo.size);
                $scope.methods.getDeparts();
            };

            $scope.init();

            function setStartDatepicker(min, max, st, en) {
                meteringUtilService.setDatepicker('#nextDateStart', st, en, min, max, function (b) {
                    $scope.data.local.nextDateStart = new Date(b.startDate).getTime();
                    setEndDatepicker(new Date(b.startDate), new Date("2050-01-01"));
                });
            }

            function setEndDatepicker(min, max, st, en) {
                meteringUtilService.setDatepicker('#nextDateEnd', st, en, min, max, function (b) {
                    $scope.data.local.nextDateEnd = new Date(b.startDate).getTime();
                    setStartDatepicker(null, new Date(b.startDate));
                });
            }
        })
    }]);