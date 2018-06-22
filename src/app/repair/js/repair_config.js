angular.module('app')
    .controller('repairConfigController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'applyDbService', function($rootScope, $scope, $stateParams, $localStorage, $state, applyDbService) {
        var layerStyle = 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;';
        // 数据
        $scope.data = {
            height: document.body.clientHeight - 130,
            limit: {
                edit: true //$rootScope.userInfo.authoritiesStr.indexOf('PM_PLAN_NEW_EDIT') != -1
            },
            list: [],
            loading: true,
            empty: false,
            modalLeftList: [],
            modalRightList: [],
            keyword: ''
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
        $scope.pagination = function(page, pageSize) {
            $scope.pageInfo.size = pageSize;
            $scope.getList(page, pageSize);
        }

        // 维修配置列表查询
        $scope.getList = function(pageNo, pageSize) {
            var param = {
                pageNo: pageNo,
                pageSize: pageSize
            };

            $scope.data.loading = true;
            $scope.data.list = [];
            applyDbService.getRepairConfigList(param, function(data) {
                $scope.data.loading = false;
                $scope.pageInfo.current = pageNo;
                $scope.pageInfo.total = data.total;
                $scope.data.list = data.records;
                $scope.data.empty = data.records.length < 1;
                $scope.$apply();
            });
        };

        // 搜索可用科室
        $scope.search = function() {
            var param = {
                keyword: $scope.data.keyword
            };
            applyDbService.getRepairDeps(param, function(data) {
                $scope.data.modalLeftList = $scope.getFillList(data, $scope.data.modalRightList);
                $scope.$apply();
            });
        };

        // 显示配置对话框
        $scope.showConfigModal = function(id) {
            $scope.data.modalLeftList = [];
            $scope.data.modalRightList = [];
            $scope.data.keyword = '';
            // 获取用户接单科室及所有可用科室
            applyDbService.getUserRepairConfig({
                id: id
            }, function(data) {
                $scope.data.modalRightList = $scope.convertData(data.ownDepts);
                $scope.data.modalLeftList = $scope.getFillList($scope.convertData(data.allDepts), $scope.data.modalRightList);
                layer.open({
                    type: 1,
                    title: ['选择部门', layerStyle],
                    content: $('#template_config'),
                    area: ['660px', '500px'],
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {
                        layer.close(index);
                        // 保存配置
                        applyDbService.saveUserRepairConfig({
                            repairId: id,
                            depts: $scope.data.modalRightList
                        }, function(data) {
                            $scope.getList(1, $scope.pageInfo.size);
                            layer.msg('<div class="toaster"><span>保存成功</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0
                            });
                        }, function(msg, obj) {
                            $scope.getList(1, $scope.pageInfo.size);
                            layer.msg('<div class="toaster"><span>' + msg + '</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0
                            });
                        });
                    }
                });
                $scope.$apply();
            }, function(msg, obj) {
                $scope.getList(1, $scope.pageInfo.size);
                layer.msg('<div class="toaster"><span>' + msg + '</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
            });
        };


        // 添加科室
        $scope.chooseDep = function(dep) {
            if (!$scope.isContain($scope.data.modalRightList, dep.id)) {
                $scope.data.modalRightList.push(dep);
            }
            $scope.removeItem($scope.data.modalLeftList, dep.id);
        }

        // 移除科室
        $scope.removeDep = function(dep) {
            if (!$scope.isContain($scope.data.modalLeftList, dep.id)) {
                $scope.data.modalLeftList.push(dep);
            }
            $scope.removeItem($scope.data.modalRightList, dep.id);
        }

        // 科室全选
        $scope.chooseAllDep = function() {
            var list = $scope.data.modalLeftList;
            for (var i = 0, len = list.length; i < len; i++) {
                if (!$scope.isContain($scope.data.modalRightList, list[i].id)) {
                    $scope.data.modalRightList.push(list[i]);
                }
            }
            $scope.data.modalLeftList = [];
        };

        // 科室清空
        $scope.removeAllDep = function() {
            var list = $scope.data.modalRightList;
            for (var i = 0, len = list.length; i < len; i++) {
                if (!$scope.isContain($scope.data.modalLeftList, list[i].id)) {
                    $scope.data.modalLeftList.push(list[i]);
                }
            }
            $scope.data.modalRightList = [];
        };

        $scope.getFillList = function(list, outLIst) {
            var result = [];
            if (list && list.length > 0) {
                for (var i = 0, len = list.length; i < len; i++) {
                    if (!$scope.isContain(outLIst, list[i].id)) {
                        result.push(list[i]);
                    }
                }
            }
            return result;
        };

        $scope.isContain = function(list, id) {
            var contain = false;

            for (var j = 0, len2 = list.length; j < len2; j++) {
                if (list[j].id === id) {
                    contain = true;
                    break;
                }
            }

            return contain;
        };

        $scope.removeItem = function(list, id) {
            for (var j = 0, len2 = list.length; j < len2; j++) {
                if (list[j].id === id) {
                    list.splice(j, 1);
                    break;
                }
            }
        }

        $scope.convertData = function(list) {
            var arr = [];
            if (list && list.length > 0) {
                for (var i = 0, len = list.length; i < len; i++) {
                    arr.push({
                        id: list[i].takeOrderDeptId,
                        name: list[i].takeOrderDeptName
                    });
                }
            }
            return arr;
        };

        // 初始化
        $scope.getList(1, $scope.pageInfo.size);
    }]);