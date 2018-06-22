angular.module('app')
    .controller('archivesSearchController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'archivesDbService', 'archivesUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, archivesDbService, archivesUtilService) {
        $scope.$parent.checkLimit('search', function () {
            var dt = new Date();
            dt.setDate(dt.getDate() - 29);
            $scope.data = {
                server: {
                    list: [],
                    report: {}
                },
                local: {
                    typeOptions: [
                        { id: 0, name: '所有' },
                        { id: 1, name: '公开级' },
                        { id: 2, name: '内部级' },
                        { id: 3, name: '秘密级' },
                        { id: 4, name: '机密级' },
                        { id: 5, name: '绝密级' }
                    ],
                    keyword: '',
                    nextDateStart: dt.getTime(),
                    nextDateEnd: (new Date()).getTime(),
                    currentType: { id: 0, name: '所有' }
                },
                loading: true,
                empty: false
            };
            // 分页数据
            $scope.pageInfo = {
                pages: 0,
                total: 0,
                size: 16,
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
                search: function () {
                    $scope.methods.getAssets(1, $scope.pageInfo.size);
                },
                getAssets: function (pageNo, pageSize) {
                    var param = {
                        pageNo: pageNo,
                        pageSize: pageSize,
                    };
                    if ($scope.data.local.currentType.id > 0) {
                        param.secretLevel = $scope.data.local.currentType.id;
                    }
                    if ($scope.data.local.keyword.length > 0) {
                        param.keyword = $scope.data.local.keyword;
                    }
                    if (($scope.data.local.nextDateStart + '').length > 0) {
                        param.filingTimeStart = new Date($scope.data.local.nextDateStart).Format("yyyy-MM-dd") + " 00:00:00";
                    }
                    if (($scope.data.local.nextDateEnd + '').length > 0) {
                        param.filingTimeEnd = new Date($scope.data.local.nextDateEnd).Format("yyyy-MM-dd") + " 23:59:59";
                    }
                    $scope.data.server.list = [];
                    $scope.data.loading = true;
                    archivesDbService.getArchives(param, function (json) {
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
                setTimeout(function () {
                    var st = new Date(new Date($scope.data.local.nextDateStart).Format("yyyy-MM-dd") + " 00:00:00");
                    var en = new Date(new Date($scope.data.local.nextDateEnd).Format("yyyy-MM-dd") + " 00:00:00");
                    setStartDatepicker(null, en, st, null);
                    setEndDatepicker(st, null, en, null);
                }, 100);
            };

            $scope.init();

            function setStartDatepicker(min, max, st, en) {
                archivesUtilService.setDatepicker('#nextDateStart', st, en, min, max, function (b) {
                    $scope.data.local.nextDateStart = new Date(b.startDate).getTime();
                    setEndDatepicker(new Date(b.startDate), new Date("2050-01-01"));
                });
            }

            function setEndDatepicker(min, max, st, en) {
                archivesUtilService.setDatepicker('#nextDateEnd', st, en, min, max, function (b) {
                    $scope.data.local.nextDateEnd = new Date(b.startDate).getTime();
                    setStartDatepicker(null, new Date(b.startDate));
                });
            }
        })
    }]);