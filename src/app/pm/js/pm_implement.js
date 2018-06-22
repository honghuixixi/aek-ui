angular.module('app')
    .controller('pmImplementController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'pmDbService', 'pmUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, pmDbService, pmUtilService) {
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
                pmDbService.getDepartments($rootScope.userInfo.tenantId, function(data) {
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
                pmUtilService.concatParam(param, 'keyword', $scope.data.condition.keyword);

                $scope.data.loading = true;
                $scope.data.list = [];
                pmDbService.getImplements(param, function(data) {
                    $scope.data.loading = false;
                    $scope.pageInfo.current = pageNo;
                    $scope.pageInfo.total = data.total;
                    $scope.data.list = data.records;
                    $scope.data.empty = data.records.length < 1;
                    $scope.data.hasTag = false;
                    for (var i = 0, len = data.records.length; i < len; i++) {
                        if (data.records[i].attention && data.records[i].attention.length > 0) {
                            $scope.data.hasTag = true;
                            break;
                        }
                    }
                    $scope.$apply();
                });
            };

            // 搜索
            $scope.search = function() {
                $scope.getImplements(1, $scope.pageInfo.size);
            };

            // 实施检测
            $scope.implementCheck = function(id) {
                pmDbService.implementCheck(id, function(data) {
                    if (data.status > 1) {
                        $scope.data.msg = "该设备状态处在" + data.msg + "中，无法实施PM，此条实施数据及关联的PM计划将被停用，确定停用吗？"; 
                        $scope.$apply();
                        layer.open({
                            type: 1,
                            title: ['提示', pmUtilService.layerStyle],
                            content: $('#template_unable_implement'),
                            area: ['550px', '300px'],
                            btn: ['确定', '取消'],
                            yes: function(index, layero) {
                                pmDbService.disableImplementPlan(id, function() {
                                    $scope.getImplements(1, $scope.pageInfo.size);
                                    layer.close(index);
                                });
                            },
                            btn2: function(index) {
                                $scope.getImplements($scope.pageInfo.current, $scope.pageInfo.size);
                            }
                        });
                    } else {
                        $state.go('pm.menu.doimplement', { id: id });
                    }
                });
            };

            // 初始化
            $scope.getDepartments();
            $scope.getImplements($scope.pageInfo.current, $scope.pageInfo.size);
        })
    }]);