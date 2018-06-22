angular.module('app')
    .controller('pmPlanController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'pmDbService', 'pmUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, pmDbService, pmUtilService) {
        $scope.$parent.checkLimit('plan', function() {
            // 数据
            $scope.data = {
                height: document.body.clientHeight - 130,
                status: [
                    { id: 0, name: '全部状态' },
                    { id: 1, name: '启用' },
                    { id: 2, name: '停用' }
                ],
                departments: [],
                condition: {
                    keyword: ''
                },
                selectStatus: {id: 0, name: '全部状态'},
                selectDepart: {id: 0, name: '选择部门' },
                limit: {
                    edit: $rootScope.userInfo.authoritiesStr.indexOf('PM_PLAN_NEW_EDIT') != -1
                },
                list: [],
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

            $scope.changeStatus = function (item) {
                $scope.data.selectStatus = item;
                $scope.search();
            };

            $scope.changeDepart = function (item) {
                $scope.data.selectDepart = item;
                $scope.search();
            };

            // 分页事件
            $scope.pagination = function(page, pageSize) {
                $scope.pageInfo.size = pageSize;
                $scope.getPlans(page, pageSize);
            }

            // 新建PM计划
            $scope.addPlan = function() {
                $state.go('pm.menu.planadd');
            };

            // 获取部门
            $scope.getDepartments = function() {
                pmDbService.getDepartments($rootScope.userInfo.tenantId, function(data) {
                    $scope.data.departments = [{ id: 0, name: '选择部门' }].concat(data);
                    $scope.$apply();
                });
            };

            // PM计划列表查询
            $scope.getPlans = function(pageNo, pageSize) {
                var param = {
                    pageNo: pageNo,
                    pageSize: pageSize,
                    status: $scope.data.selectStatus.id
                };
                if ($scope.data.selectDepart.id > 0) {
                    param['departmentId'] = $scope.data.selectDepart.id;
                }
                pmUtilService.concatParam(param, 'keyword', $scope.data.condition.keyword);

                $scope.data.loading = true;
                $scope.data.list = [];
                pmDbService.getPlans(param, function(data) {
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
                $scope.getPlans(1, $scope.pageInfo.size);
            };

            // 初始化
            $scope.getDepartments();
            $scope.getPlans($scope.pageInfo.current, $scope.pageInfo.size);
        })
    }]);