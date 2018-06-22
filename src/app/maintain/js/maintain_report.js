angular.module('app')
    .controller('maintainReportController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'maintainDbService', 'maintainUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, maintainDbService, maintainUtilService) {
        $scope.$parent.checkLimit('report', function() {
            // 数据
            var dt = new Date();
            dt.setDate(dt.getDate() - 29)
            $scope.data = {
                height: document.body.clientHeight - 130,
                departments: [],
                condition: {
                    startDt: dt.getTime(),
                    endDt: (new Date()).getTime(),
                    keyword: ''
                },
                selectItem: {id: 0, name: '选择部门'},
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
            $scope.pagination = function(page, pageSize) {
                $scope.pageInfo.size = pageSize;
                $scope.getImplementReport(page, pageSize);
            }

            // 查看报告
            $scope.browse = function(id) {
                maintainDbService.getPlanReport(id, $scope, maintainUtilService, '查看');
            };


            // 获取部门
            $scope.getDepartments = function() {
                maintainDbService.getDepartments($rootScope.userInfo.tenantId, function(data) {
                    $scope.data.departments = [{ id: 0, name: '选择部门' }].concat(data);
                    setStartDatepicker(null, new Date(), dt, null);
                    setEndDatepicker(new Date(dt).Format("yyyy-MM-dd") + " 00:00:00", null);
                    $scope.$apply();
                });
            };

            // 报告查询
            $scope.getImplementReport = function(pageNo, pageSize) {
                var param = {
                    pageNo: pageNo,
                    pageSize: pageSize,
                    startImplementDate: new Date($scope.data.condition.startDt).Format("yyyy-MM-dd") + " 00:00:00",
                    endImplementDate: new Date($scope.data.condition.endDt).Format("yyyy-MM-dd") + " 23:59:59"
                };
                if($scope.data.selectItem.id > 0) {
                    param['deptId'] = $scope.data.selectItem.id;
                }
                maintainUtilService.concatParam(param, 'keyword', $scope.data.condition.keyword);

                $scope.data.loading = true;
                $scope.data.list = [];
                maintainDbService.getImplementReport(param, function(data) {
                    $scope.data.loading = false;
                    $scope.pageInfo.current = pageNo;
                    $scope.pageInfo.total = data.total;
                    $scope.data.list = data.records;
                    $scope.data.empty = data.records.length < 1;
                    $scope.$apply();
                });
            };

            // 搜索
            $scope.search = function() {
                $scope.getImplementReport(1, $scope.pageInfo.size);
            };

            // 方法
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

            // 初始化
            $scope.getDepartments();
            $scope.getImplementReport($scope.pageInfo.current, $scope.pageInfo.size);
        })
    }]);