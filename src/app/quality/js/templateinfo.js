angular.module('app')
    .controller('qualityTemplateinfoController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'qualityDbService', 'qualityUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, qualityDbService, qualityUtilService) {
        $scope.$parent.checkLimit('template', function () {
            $scope.data = {
                server: {
                    template: {},
                    col: 0,
                    items: []
                },
                local: {
                    tenantName: $rootScope.userInfo.tenantName,
                    id: $stateParams.id,
                    type: $stateParams.type,
                    form: {},
                    err: {},
                    count: 2, // 生成选项id
                    columnOptions: [
                        { id: 1, name: '1' },
                        { id: 2, name: '2' },
                        { id: 3, name: '3' },
                        { id: 4, name: '4' },
                        { id: 5, name: '5' },
                        { id: 6, name: '6' }
                    ]
                },
                limit: {
                    isAek: $rootScope.userInfo.tenantId == 1
                }
            };

            $scope.methods = {
                // 发布模板
                publish: function () {
                    qualityUtilService.confirm('发布后，模板内容将不能修改，确定要发布吗？', true, function (index) {
                        layer.close(index);
                        qualityDbService.publishTemplate({ id: $scope.data.local.id }, function (json) {
                            $scope.init();
                            qualityUtilService.tost('发布成功');
                        });
                    });
                },
                // 启用模板
                enable: function () {
                    qualityDbService.enableTemplate({ id: $scope.data.local.id, enable: 1 }, function (json) {
                        $scope.init();
                        qualityUtilService.tost('启用成功');
                    });
                },
                // 停用模板
                disable: function () {
                    qualityUtilService.confirm('停用后，该模板将无法被使用，确定要停用吗？', true, function (index) {
                        layer.close(index);
                        qualityDbService.enableTemplate({ id: $scope.data.local.id, enable: 0 }, function (json) {
                            $scope.init();
                            qualityUtilService.tost('停用成功');
                        });
                    });
                },
                // 删除模板
                del: function () {
                    qualityUtilService.confirm('删除模板后不可恢复，确定要删除吗？', true, function (index) {
                        layer.close(index);
                        qualityDbService.delTemplate({ id: $scope.data.local.id }, function (json) {
                            qualityUtilService.tost('删除成功', function () {
                                $state.go('quality.menu.template');
                            });
                        });
                    });
                },
                // 打印模板
                print: function () {
                    qualityUtilService.openDialog('打印预览', $('#template_quality_report'), ['1340px', '700px'], ['打印', '关闭'], function () {
                        $("#template_quality_report").jqprint();
                    });
                },
                // 添加项目
                openAdd: function () {
                    $scope.data.local.form = {
                        isEdit: false,
                        id: 0,
                        name: '',
                        remarks: '',
                        inputType: 1, // 1：文本 2：选择
                        selectType: 1, // 1：单选 2：多选
                        childItems: [],
                        childItemOptions: [{ id: 1, name: '' }],
                        currentCol: { id: 1, name: '1' },
                        rows: [{ id: 1, name: '' }],
                        cols: []
                    };
                    $scope.methods.resetErr();
                    qualityUtilService.openDialog('新增项目', $('#template_item_quality'), ['700px', '600px'], null, function (index) {
                        if ($scope.methods.checkForm()) {                            
                            qualityDbService.addTemplateItem($scope.methods.getParam(), function (json) {
                                layer.close(index);
                                $scope.init();
                                qualityUtilService.tost('添加成功');
                            });
                        } else {
                            $scope.$apply();
                        }
                    });
                },
                // 编辑项目
                openEdit: function (v) {
                    v = v.data;
                    $scope.data.local.form = {
                        isEdit: true,
                        id: v.id,
                        name: v.name,
                        remarks: v.remarks,
                        inputType: v.inputType, // 1：文本 2：选择
                        selectType: v.selectType, // 1：单选 2：多选
                        rows: [],
                        cols: [],
                        currentCol: { id: 1, name: '1' },
                        childItemOptions: []
                    };
                    $scope.methods.resetErr();
                    if(v.inputType == 1){
                        var columns = 1;
                        for(var i=0,len=v.childItems.length; i<len; i++){
                            if(v.childItems[i].type == 1){
                                $scope.data.local.form.rows.push({ id: $scope.data.local.count++, name: v.childItems[i].name });
                                columns = v.childItems[i].columns;
                            }else{
                                $scope.data.local.form.cols.push({ id: $scope.data.local.count++, name: v.childItems[i].name, crossRow: v.childItems[i].crossRow });
                            }
                        }
                        $scope.data.local.form.currentCol = {id: columns, name: columns + ''};
                    }else if (v.inputType == 2) {
                        for (var i = 0, len = v.childItemOptions.length; i < len; i++) {
                            $scope.data.local.form.childItemOptions.push({ id: $scope.data.local.count++, name: v.childItemOptions[i].name });
                        }
                    }
                    qualityUtilService.openDialog('编辑项目', $('#template_item_quality'), ['700px', '600px'], null, function (index) {
                        if ($scope.methods.checkForm()) {                            
                            qualityDbService.editTemplateItem($scope.methods.getParam(), function (json) {
                                layer.close(index);
                                $scope.init();
                                qualityUtilService.tost('编辑成功');
                            });
                        } else {
                            $scope.$apply();
                        }
                    });
                },
                // 删除项目
                removeItem: function (v) {
                    qualityUtilService.confirm('删除项目后不可恢复，确定要删除吗？', true, function (index) {
                        layer.close(index);
                        qualityDbService.delTemplateItem({ id: v.data.id }, function (json) {
                            $scope.init();
                            qualityUtilService.tost('删除成功');
                        });
                    });
                },
                getParam: function () {
                    var param = {
                        templateId: $scope.data.local.id,
                        name: $scope.data.local.form.name,
                        remarks: $scope.data.local.form.remarks,
                        inputType: $scope.data.local.form.inputType,
                        selectType: $scope.data.local.form.selectType
                    };
                    if ($scope.data.local.form.id > 0) {
                        param.id = $scope.data.local.form.id;
                    }
                    if ($scope.data.local.form.inputType == 1) {
                        param.columns = $scope.data.local.form.currentCol.id;
                        var list = $scope.data.local.form.rows;
                        param.childItems = [];
                        for (var i = 0, len = list.length; i < len; i++) {
                            param.childItems.push({name: list[i].name, columns: $scope.data.local.form.currentCol.id });
                        }
                        if ($scope.data.local.form.cols.length > 0) {
                            list = $scope.data.local.form.cols;
                            param.childItemRemarks = [];
                            for (var i = 0, len = list.length; i < len; i++) {
                                param.childItemRemarks.push({ name: list[i].name, crossRow: list[i].crossRow });
                            }
                        }
                    } else if ($scope.data.local.form.inputType == 2) {
                        var list = $scope.data.local.form.childItemOptions;
                        param.childItemOptions = [];
                        for (var i = 0, len = list.length; i < len; i++) {
                            param.childItemOptions.push({ name: list[i].name });
                        }
                    }
                    return param;
                },
                checkForm: function () {
                    var result = true;
                    if ($scope.data.local.form.name == '') {
                        $scope.data.local.err.name = '请输入项目名称';
                        result = false;
                    }
                    if ($scope.data.local.form.inputType == 1) {
                        result = $scope.methods.checkListEmptyAndRepeat($scope.data.local.form.rows, 'rows', result, '子项目') && result;
                        if ($scope.data.local.form.cols.length > 0) {
                            result = $scope.methods.checkListEmptyAndRepeat($scope.data.local.form.cols, 'cols', result, '子项目备注') && result;
                        }
                    } else if ($scope.data.local.form.inputType == 2) {
                        result = $scope.methods.checkListEmptyAndRepeat($scope.data.local.form.childItemOptions, 'option', result, '选项') && result;
                    }
                    return result;
                },
                checkListEmptyAndRepeat: function (list, key, result, msg) {
                    for (var i = 0, len = list.length; i < len; i++) {
                        if (list[i].name == '') {
                            $scope.data.local.err[key] = '请输入' + msg + '内容';
                            result = false;
                            break;
                        } else {
                            for (var j = i + 1; j < len; j++) {
                                if (list[i].name == list[j].name) {
                                    $scope.data.local.err[key] = msg + '内容重复';
                                    result = false;
                                    break;
                                }
                            }
                        }
                    }
                    return result;
                },
                // 切换项目类型（清空数据）
                chengeInputType: function (type) {
                    $scope.data.local.form.inputType = type;
                    $scope.data.local.form.childItems = [];
                    $scope.data.local.form.childItemOptions = [{ id: 1, name: '' }];
                    $scope.data.local.form.selectType = 1;
                    $scope.data.local.form.rows = [{ id: 1, name: '' }];
                    $scope.data.local.form.cols = [];
                    $scope.data.local.form.currentCol = { id: 1, name: '1' };
                },
                // 切换选择类型
                changeSelectType: function (type) {
                    $scope.data.local.form.selectType = type;
                },
                resetErr: function () {
                    $scope.data.local.err = {
                        name: '',
                        option: '',
                        rows: '',
                        cols: ''
                    };
                },
                removeErr: function (key) {
                    $scope.data.local.err[key] = '';
                },
                addOption: function () {
                    $scope.data.local.form.childItemOptions.push({ id: $scope.data.local.count++, name: '' });
                    $scope.methods.removeErr('option');
                },
                delOption: function (index) {
                    $scope.data.local.form.childItemOptions.splice(index, 1);
                    $scope.methods.removeErr('option');
                },
                changeCol: function (item) {
                    $scope.data.local.form.currentCol = item;
                },
                addRow: function () {
                    $scope.data.local.form.rows.push({ id: $scope.data.local.count++, name: '' });
                },
                delRow: function (index) {
                    $scope.data.local.form.rows.splice(index, 1);
                    $scope.methods.removeErr('rows');
                },
                addCols: function () {
                    $scope.data.local.form.cols.push({ id: $scope.data.local.count++, name: '', crossRow: 0 });
                },
                delCols: function (index) {
                    $scope.data.local.form.cols.splice(index, 1);
                    $scope.methods.removeErr('cols');
                }
            };

            $scope.init = function () {
                // 获取模板详情
                qualityDbService.getTemplateinfo({ id: $scope.data.local.id }, function (json) {
                    var obj = qualityUtilService.getMaxColumn(json.items);
                    $scope.data.server.template = json;
                    $scope.data.server.col = obj.max;
                    $scope.data.server.txtItems = obj.txtItems;
                    $scope.data.server.items = qualityUtilService.convertToTable(json.items, obj.max, obj.txtItems);
                    $scope.$apply();
                }, function (msg) {
                    qualityUtilService.tost(msg, function () {
                        $state.go('quality.menu.template');
                    })
                });
            };

            $scope.init();
        })
    }]);