angular.module('app')
    .controller('maintainImplementController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'maintainDbService', 'maintainUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, maintainDbService, maintainUtilService) {
        $scope.$parent.checkLimit('implement', function() {
            // 数据
            $scope.data = {
                height: document.body.clientHeight - 130,
                departments: [],
                condition: {
                    departmentId: 0,
                    keyword: ''
                },
                selectItem: { id: 0, name: '选择部门' },
                list: [],
                loading: true,
                empty: false,
                msg: '',
                hasTag: false
            };
            // 分页数据
            $scope.pageInfo = {
                pages: 0,
                total: 0,
                size: 16,
                current: 1,
                pstyle: 2
            };

            $scope.changeItem = function(item) {
                $scope.data.selectItem = item;
                $scope.search();
            };

            // 分页事件
            $scope.pagination = function(page, pageSize) {
                $scope.pageInfo.size = pageSize;
                $scope.getImplements(page, pageSize);
            }

            // 获取部门列表
            $scope.getDepartments = function() {
                maintainDbService.getDepartments($rootScope.userInfo.tenantId, function(data) {
                    $scope.data.departments = [{ id: 0, name: '选择部门' }].concat(data);
                    $scope.$apply();
                });
            };

            // 实施列表查询
            $scope.getImplements = function(pageNo, pageSize) {
                var param = {
                    pageNo: pageNo,
                    pageSize: pageSize
                };
                if ($scope.data.selectItem.id > 0) {
                    param.departmentId = $scope.data.selectItem.id;
                }
                maintainUtilService.concatParam(param, 'keyword', $scope.data.condition.keyword);

                $scope.data.loading = true;
                $scope.data.list = [];
                maintainDbService.getImplements(param, function(data) {
                    $scope.data.loading = false;
                    $scope.data.hasTag = false;
                    for (var i = 0, len = data.records.length; i < len; i++) {
                        data.records[i].attention = maintainUtilService.getAttention(data.records[i].nextImplementTime);
                        if (data.records[i].attention && data.records[i].attention.length > 0) {
                            $scope.data.hasTag = true;
                        }
                    }
                    $scope.pageInfo.current = pageNo;
                    $scope.pageInfo.total = data.total;
                    $scope.data.list = data.records;
                    $scope.data.empty = data.records.length < 1;                    
                    $scope.$apply();
                    console.log(data);
                });
            };

            // 搜索
            $scope.search = function() {
                $scope.getImplements(1, $scope.pageInfo.size);
            };

            // 实施检测
            $scope.implementCheck = function(id) {
                maintainDbService.getImplementInfo(id, function(data) {
                    $state.go('maintain.menu.doimplement', { id: id });
                }, function (msg) {
                    maintainUtilService.tost(msg);
                    $scope.getImplements(1, $scope.pageInfo.size);
                });
            };

            function getAttention(time) {
                var now = (new Date()).getTime();
                if(time < now){
                    return '已过期';
                }
                return '';
            }

            // 初始化
            $scope.getDepartments();
            $scope.getImplements($scope.pageInfo.current, $scope.pageInfo.size);
        })
    }]);