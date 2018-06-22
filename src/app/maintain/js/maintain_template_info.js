angular.module('app')
    .controller('maintainTemplateInfoController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'maintainDbService', 'maintainUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, maintainDbService, maintainUtilService) {
        $scope.$parent.checkLimit('template', function() {
            // 数据
            $scope.data = {
                height: document.body.clientHeight - 130,
                limit: {
                    edit: true, // $rootScope.userInfo.authoritiesStr.indexOf('PM_TEMPLATE_EDIT') != -1,
                    delete: true, // $rootScope.userInfo.authoritiesStr.indexOf('PM_TEMPLATE_DELETE') != -1,
                    disable: true // $rootScope.userInfo.authoritiesStr.indexOf('PM_TEMPLATE_DISABLE_ENABLE') != -1
                },
                list: [],
                loading: true,
                empty: false,
                template: {
                    id: 0,
                    name: '',
                    remarks: '',
                    status: 1,
                    type: 2,
                    items: []
                },
                err: '',
                sysItems: [],
                isEdit: true,
                selfName: '',
                editName: '',
                isSave: true
            };

            // 选择系统项目
            $scope.chooseSysItem = function(obj) {
                if ($scope.data.template.items.length < 10 && !isContain($scope.data.template.items, 'itemName', obj.itemName)) {
                    $scope.addTemplateItem(obj.itemName);
                }
            };

            // 添加自定义项目
            $scope.addSelfItem = function() {
                if ($scope.data.selfName == '') {
                    $scope.data.err = "请输入项目内容";
                    return;
                }
                if (!isContain($scope.data.template.items, 'itemName', $scope.data.selfName)) {
                    $scope.addTemplateItem($scope.data.selfName, function(msg) {
                        $scope.data.err = msg;
                        $scope.$apply();
                    });
                } else {
                    $scope.data.err = "项目已存在";
                }
            };

            // 清空输入框内容
            $scope.clearInput = function() {
                $scope.data.selfName = '';
                $scope.removeErr($scope.data);
            };

            // 模板项目显示编辑状态
            $scope.showEditItem = function(obj) {
                obj.isEdit = true;
                $scope.data.editName = obj.itemName;
            };

            // 模板项目关闭编辑状态
            $scope.closeEditItem = function(obj) {
                obj.isEdit = false;
                $scope.data.editName = '';
                $scope.removeErr(obj);
            }

            // 模板项目编辑保存
            $scope.editItem = function(obj) {
                if ($scope.data.editName == '') {
                    obj.err = "请输入项目内容";
                    return;
                }
                if (!isContain2($scope.data.template.items, 'id', obj.id, 'itemName', $scope.data.editName)) {
                    $scope.editTemplateItem(obj.id, $scope.data.editName, obj);
                } else {
                    obj.err = "项目已存在";
                }
            };

            // 移除错误提示
            $scope.removeErr = function(obj) {
                obj.err = "";
            };

            function resetSysItem() {
                for (var i = 0, len = $scope.data.sysItems.length; i < len; i++) {
                    $scope.data.sysItems[i].show = !isContain($scope.data.template.items, 'itemName', $scope.data.sysItems[i].itemName);
                }
            }


            function isContain(list, key, val) {
                var result = false;
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i][key] == val) {
                        result = true;
                        break;
                    }
                }
                return result;
            }

            function isContain2(list, key1, val1, key2, val2) {
                var result = false;
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i][key1] != val1 && list[i][key2] == val2) {
                        result = true;
                        break;
                    }
                }
                return result;
            }


            function openDialog2(id, fun) {
                layer.open({
                    type: 1,
                    title: ['提示', maintainUtilService.layerStyle],
                    content: $(id),
                    area: ['480px', '230px'],
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {
                        fun(index);
                    }
                });
            }

            // 模板详情查询
            $scope.getTemplateInfoWithLimit = function() {
                $scope.data.loading = true;
                $scope.data.list = [];
                maintainDbService.getTemplateInfoWithLimit($stateParams.id, function(data) {
                    data.status = data.enable ? 1 : 2;
                    $scope.data.loading = false;
                    $scope.data.template = data;
                    $scope.data.empty = data.items.length < 1;
                    $scope.$apply();
                    $scope.getSysItems();
                });
            };

            // 获取系统模板项目
            $scope.getSysItems = function() {
                maintainDbService.getSysTemplateItem(function(list) {
                    $scope.data.sysItems = list || [];
                    resetSysItem();
                    $scope.$apply();
                });
            };

            // 添加模板项目
            $scope.addTemplateItem = function(name, fail) {
                if ($scope.data.isSave) {
                    $scope.data.isSave = false;
                    maintainDbService.addTemplateItem({ templateId: $scope.data.template.id, items: [{ itemName: name }] }, function() {
                        $scope.data.isSave = true;
                        $scope.clearInput();
                        $scope.getTemplateInfoWithLimit();
                        maintainUtilService.tost("保存成功");
                    }, function(msg) {
                        $scope.data.isSave = true;
                        if (typeof fail === 'function') {
                            fail(msg);
                        }
                    });
                }
            };

            // 编辑模板项目
            $scope.editTemplateItem = function(id, name, obj) {
                if ($scope.data.isSave) {
                    $scope.data.isSave = false;
                    maintainDbService.editTemplateItem({ id: id, itemName: name }, function(json) {
                        $scope.data.isSave = true;
                        $scope.getTemplateInfoWithLimit();
                        maintainUtilService.tost("保存成功");
                    }, function(msg) {
                        $scope.data.isSave = true;
                        obj.err = msg;
                        $scope.$apply();
                    });
                }
            };

            // 删除模板项目
            $scope.deleteTemplateItem = function(id) {
                maintainDbService.deleteTemplateItem(id, function() {
                    maintainUtilService.tost("删除成功");
                    $scope.getTemplateInfoWithLimit();
                }, function(msg) {
                    maintainUtilService.tost(msg);
                });
            };

            // 停用模板
            $scope.disableTemplate = function() {
                openDialog2('#template_disable', function(index) {
                    maintainDbService.disableTemplate($stateParams.id, function() {
                        layer.close(index);
                        $scope.getTemplateInfoWithLimit();
                    }, function(msg) {
                        maintainUtilService.tost(msg);
                        layer.close(index);
                    });
                });
            };

            // 启用模板
            $scope.enableTemplate = function() {
                openDialog2('#template_enable', function(index) {
                    maintainDbService.enableTemplate($stateParams.id, function() {
                        layer.close(index);
                        $scope.getTemplateInfoWithLimit();
                    }, function(msg) {
                        maintainUtilService.tost(msg);
                        layer.close(index);
                    });
                });
            };

            // 删除模板
            $scope.delTemplate = function() {
                openDialog2('#template_delete', function(index) {
                    maintainDbService.deleteTemplate($stateParams.id, function() {
                        layer.close(index);
                        $state.go('maintain.menu.template');
                    }, function(msg) {
                        maintainUtilService.tost(msg);
                        layer.close(index);
                    });
                });
            };

            // 初始化            
            $scope.getTemplateInfoWithLimit();
        })
    }]);