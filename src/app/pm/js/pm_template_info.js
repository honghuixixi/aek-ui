angular.module('app')
    .controller('pmTemplateInfoController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'pmDbService', 'pmUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, pmDbService, pmUtilService) {
        $scope.$parent.checkLimit('template', function() {
            // 数据
            $scope.data = {
                height: document.body.clientHeight - 130,
                limit: {
                    edit: $rootScope.userInfo.authoritiesStr.indexOf('PM_TEMPLATE_EDIT') != -1,
                    delete: $rootScope.userInfo.authoritiesStr.indexOf('PM_TEMPLATE_DELETE') != -1,
                    disable: $rootScope.userInfo.authoritiesStr.indexOf('PM_TEMPLATE_DISABLE_ENABLE') != -1
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
                templateItem: {
                    id: 0,
                    name: '',
                    options: [{ id: 1, name: '' }, { id: 2, name: '' }]
                },
                err: ''
            };

            // 移除错误提示
            $scope.removeErr = function() {
                $scope.data.err = "";
            };

            // 添加模板项目
            $scope.addItemOption = function() {
                $scope.data.templateItem.options.push({ id: (new Date()).getTime(), name: '' });
            };

            // 删除模板项目
            $scope.delItemOption = function(index) {
                $scope.data.templateItem.options.splice(index, 1);
            };

            // 新建模板项目
            $scope.addTemplateItem = function() {
                $scope.data.templateItem = {
                    id: 0,
                    name: '',
                    options: [{ id: 1, name: '' }, { id: 2, name: '' }]
                };
                $scope.data.err = '';
                openDialog('新增项目', -1, function(index) {
                    pmDbService.addTemplateItem(getSaveParam($scope.data.template.id), function() {
                        layer.close(index);
                        pmUtilService.tost('新建成功');
                        $scope.getTemplateInfoWithLimit();
                    }, function(msg) {
                        $scope.data.err = msg;
                        $scope.$apply();
                    });
                });
            };

            // 编辑模板项目
            $scope.editTemplateItem = function(tem, index) {
                $scope.data.templateItem = {
                    id: tem.id,
                    name: tem.name,
                    options: JSON.parse(JSON.stringify(tem.options))
                };
                $scope.data.err = '';
                openDialog('编辑项目', index, function(index) {
                    pmDbService.editTemplateItem(getSaveParam($scope.data.templateItem.id), function() {
                        layer.close(index);
                        pmUtilService.tost('保存成功');
                        $scope.getTemplateInfoWithLimit();
                    }, function(msg) {
                        $scope.data.err = msg;
                        $scope.$apply();
                    });
                });
            };

            // 删除模板项目
            $scope.delTemplateItem = function (id) {
                pmDbService.deleteTemplateItem(id, function () {
                    pmUtilService.tost("删除成功");
                    $scope.getTemplateInfoWithLimit();
                });
            };

            // 删除模板
            $scope.delTemplate = function () {
                openDialog2('#template_delete', function (index) {
                    pmDbService.deleteTemplate($stateParams.id, function () {
                        layer.close(index);
                        $state.go('pm.menu.template');
                    });
                });                
            };

            // 停用模板
            $scope.disableTemplate = function () {
                openDialog2('#template_disable', function (index) {
                    pmDbService.disableTemplate($stateParams.id, function () {
                        layer.close(index);
                        $scope.getTemplateInfoWithLimit();
                    });
                }); 
            };

            // 启用模板
            $scope.enableTemplate = function () {
                openDialog2('#template_enable', function (index) {
                    pmDbService.enableTemplate($stateParams.id, function () {
                        layer.close(index);
                        $scope.getTemplateInfoWithLimit();
                    });
                });  
            };

            // 模板详情查询
            $scope.getTemplateInfoWithLimit = function() {
                $scope.data.loading = true;
                $scope.data.list = [];
                pmDbService.getTemplateInfoWithLimit($stateParams.id, function(data) {
                    $scope.data.loading = false;
                    $scope.data.template = data;
                    $scope.data.empty = data.items.length < 1;
                    $scope.$apply();
                });
            };

            // 方法
            function openDialog(title, itemIndex, fun) {
                layer.open({
                    type: 1,
                    title: [title, pmUtilService.layerStyle],
                    content: $('#template_add_template_item'),
                    area: ['570px', '440px'],
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {
                        for (var i = 0, len = $scope.data.templateItem.options.length; i < len; i++) {
                            if ($scope.data.templateItem.options[i].name === "") {
                                angular.element("#option_" + i).val("");
                            }
                        }
                        if ($scope.data.templateItem.name === "") {
                            angular.element("#templateItemName").val("");
                            $scope.data.err = "请输入项目名称";
                            $scope.$apply();
                            return;
                        }
                        var isEmpty = false;
                        for (var i = 0, len = $scope.data.templateItem.options.length; i < len; i++) {
                            if ($scope.data.templateItem.options[i].name === "") {
                                isEmpty = true;
                                break;
                            }
                        }
                        if (isEmpty) {
                            $scope.data.err = "请输入项目内容";
                            $scope.$apply();
                            return;
                        }
                        var isRepeat = false;
                        for (var i = 0, len = $scope.data.template.items.length; i < len; i++) {
                            if (i !== itemIndex && $scope.data.templateItem.name === $scope.data.template.items[i].name) {
                                isRepeat = true;
                                break;
                            }
                        }
                        if (isRepeat) {
                            $scope.data.err = "项目名称已存在";
                            $scope.$apply();
                            return;
                        }
                        isRepeat = false;
                        for (var i = 0, len = $scope.data.templateItem.options.length - 1; i < len; i++) {
                            for (var j = i + 1, len2 = len + 1; j < len2; j++) {
                                if ($scope.data.templateItem.options[i].name === $scope.data.templateItem.options[j].name) {
                                    isRepeat = true;
                                    break;
                                }
                            }
                            if (isRepeat) {
                                break;
                            }
                        }
                        if (isRepeat) {
                            $scope.data.err = "项目内容有重复";
                            $scope.$apply();
                            return;
                        }

                        fun(index);
                    },
                    success: function () {
                        setTimeout(function () {
                            $scope.$apply();
                        }, 500);
                    }
                });
            }

            function openDialog2(id, fun) {
                layer.open({
                    type: 1,
                    title: ['提示', pmUtilService.layerStyle],
                    content: $(id),
                    area: ['480px','230px'],
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {
                        fun(index);
                    }
                });
            }

            function getSaveParam(id) {
                var param = {
                    id: id,
                    name: $scope.data.templateItem.name,
                    options: []
                };
                for (var i = 0, len = $scope.data.templateItem.options.length; i < len; i++) {
                    param.options.push($scope.data.templateItem.options[i].name);
                }
                return param;
            }

            // 初始化
            $scope.getTemplateInfoWithLimit();
        })
    }]);