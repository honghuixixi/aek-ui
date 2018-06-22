angular.module('app')
    .controller('qualityAddController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'qualityDbService', 'qualityUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, qualityDbService, qualityUtilService) {
        $scope.$parent.checkLimit('apply', function () {
            $scope.data = {
                server: {},
                local: {
                    type: $stateParams.type || 0,
                    applyId: $stateParams.id || 0,
                    tenantName: $rootScope.userInfo.tenantName,
                    templateList: [],
                    typeOptions: [{ id: 1, name: '验收监测' }, { id: 2, name: '状态性监测' }, { id: 3, name: '稳定性监测' }],
                    currentTemplate: { id: 0, name: '请选择' },
                    currentType: { id: 0, name: '请选择' },
                    form: {
                        contactNumber: '',  // 联系电话
                        checkAccording: '', // 检测依据
                        environmentCondition: '', // 环境条件
                        checkInstrumentName: '', // 标准器-设备名称
                        checkInstrumentSpec: '', // 标准器-规格型号
                        checkInstrumentProducer: '', // 标准器-生产商
                        appearanceWorkCheck: '', // 外观及工作正常性检查
                        checkResult: '', // 检测结论 0：不合格 1：合格
                        deviationRecord: '' // 偏离情况记录
                    },
                    assetsList: [],
                    assetsName: '',
                    assets: {
                        assetsName: ''
                    },
                    showResult: false
                }
            };

            $scope.methods = {
                changeTemplate: function (item) {
                    $scope.data.local.currentTemplate = item;
                    $scope.methods.getTemplateInfo();
                    $scope.data.local.assetsName = '';
                    $scope.data.local.assets = {assetsName: ''};
                    for (var key in $scope.data.local.form) {
                        $scope.data.local.form[key] = '';
                    }
                },
                changeType: function (item) {
                    $scope.data.local.currentType = item;
                },
                // 作废
                drop: function () {
                    qualityUtilService.confirm('作废后，单据即从列表中删除，确定要作废吗？', false, function (index) {
                        layer.close(index);
                        qualityDbService.applyDrop($scope.data.local.applyId, function (json) {
                            qualityUtilService.tost('作废成功', function () {
                                $state.go('quality.menu.apply');
                            });
                        }, function (msg) {
                            qualityUtilService.tost(msg, function () {
                                $state.go('quality.menu.apply');
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
                // 暂存
                saveTemp: function () {
                    var param = $scope.methods.getParam();
                    param.status = 1;
                    var fun = 'applySaveTemp';
                    if ($scope.data.local.type == 2) {
                        fun = 'applySaveTempAgain';
                    }
                    qualityDbService[fun](param, function (json) {
                        qualityUtilService.tost('暂存成功', function () {
                            $state.go('quality.menu.add', { id: json, type: 0 }, {reload:true});
                        });
                    }, function (msg, code) {
                        qualityUtilService.tost(msg, function () {
                            if(code == 'MDR_003'){
                                $state.go('quality.menu.apply');
                            }else if(code == 'MDR_014'){
                                // $state.go('quality.menu.add', { id: 0, type: 0 }, {reload:true});
                                $scope.methods.getTemplates();
                            }
                        });
                    });
                },
                // 提交
                submit: function () {
                    if ($scope.methods.checkParam()) {
                        qualityUtilService.confirm('提交后单据不可再修改，确定要提交吗？', false, function (index) {
                            layer.close(index);
                            var param = $scope.methods.getParam();
                            param.status = 2;
                            var fun = 'applySubmit';
                            if ($scope.data.local.type == 2) {
                                fun = 'applySubmitAgain';
                            }
                            qualityDbService[fun](param, function () {
                                qualityUtilService.tost('提交成功', function () {
                                    $state.go('quality.menu.apply', {}, {reload:true});
                                });
                            }, function (msg, code) {
                                qualityUtilService.tost(msg, function () {
                                    if(code == 'MDR_003'){
                                        $state.go('quality.menu.apply');
                                    }else if(code == 'MDR_014'){
                                        // $state.go('quality.menu.add', { id: 0, type: 0 }, {reload:true});
                                        $scope.methods.getTemplates();
                                    }
                                });
                            });
                        });
                    } else {
                        qualityUtilService.tost('请先完善报告内容');
                    }
                },
                getAssets: function () {
                    $scope.data.local.showResult = true;
                    qualityDbService.getAssets({ assetsName: $scope.data.local.assets.assetsName }, function (json) {
                        $scope.data.local.assetsList = json;
                        $scope.$apply();
                    });
                },
                chooseAssets: function (v) {
                    $scope.data.local.assetsName = v.assetsName;
                    $scope.data.local.assets = v;
                    $scope.data.local.showResult = false;
                },
                blur: function () {
                    $scope.data.local.assets.assetsName = $scope.data.local.assetsName;
                    setTimeout(function () {                        
                        $scope.data.local.showResult = false;
                        $scope.$apply();
                    }, 500);
                },
                // 获取模板详情
                getTemplateInfo: function () {
                    qualityDbService.getTemplateinfo({ id: $scope.data.local.currentTemplate.id }, function (json) {
                        var obj = qualityUtilService.getMaxColumn(json.items);
                        $scope.data.server.template = json;
                        $scope.data.server.col = obj.max;
                        $scope.data.server.txtItems = obj.txtItems;
                        $scope.data.server.items = qualityUtilService.convertToTable(json.items, obj.max, obj.txtItems);
                        $scope.$apply();
                    });
                },
                getParam: function () {
                    var param = {
                        id: null,
                        reportTemplateId: $scope.data.local.currentTemplate.id,
                        checkType: $scope.data.local.currentType.id,
                        contactNumber: null,
                        checkAccording: null,
                        environmentCondition: null,
                        checkInstrumentName: null,
                        checkInstrumentSpec: null,
                        checkInstrumentProducer: null,
                        appearanceWorkCheck: null,
                        checkResult: null,
                        deviationRecord: null,
                        maximumAllowableErrorList: [],
                        mdAsset: null,
                        mdItemResultList: []
                    };

                    if ($scope.data.local.applyId > 0) {
                        param.id = $scope.data.local.applyId;
                    }
                    if ($scope.data.local.type == 2) {
                        param.id = null;
                    }

                    if ($scope.data.local.assets.assetsId && $scope.data.local.assets.assetsId > 0) {
                        param.mdAsset = $scope.data.local.assets;
                    }
                    for (var key in $scope.data.local.form) {
                        if (($scope.data.local.form[key] + '').length > 0) {
                            param[key] = $scope.data.local.form[key];
                        }
                    }
                    for (var i = 0, len = $scope.data.server.txtItems.length; i < len; i++) {
                        if ($scope.data.server.txtItems[i].answer.length > 0) {
                            param.maximumAllowableErrorList.push({ itemName: $scope.data.server.txtItems[i].name, desc: $scope.data.server.txtItems[i].answer });
                        }
                    }
                    var list = $scope.data.server.items,
                        subList = [];
                    for (var i = 0, len = list.length; i < len; i++) {
                        subList = list[i];
                        for (var j = 0, len2 = subList.length; j < len2; j++) {
                            if (subList[j].type == 7 && subList[j].data.answer.length > 0) {
                                // 填空
                                param.mdItemResultList.push({ itemId: subList[j].data.id, sort: subList[j].data.sort, result: subList[j].data.answer });
                            } else if (subList[j].type == 4 && subList[j].data.answer.length > 0) {
                                // 单选
                                param.mdItemResultList.push({ itemId: subList[j].data.id, sort: 1, result: subList[j].data.answer });
                            } else if (subList[j].type == 5) {
                                // 多选
                                for (var k = 0, len3 = subList[j].data.options.length; k < len3; k++) {
                                    if(subList[j].data.options[k].checked){
                                        param.mdItemResultList.push({ itemId: subList[j].data.id, sort: k + 1, result: subList[j].data.options[k].id });
                                    }
                                }
                            }
                        }
                    }
                    return param;
                },
                checkParam: function () {
                    if (!($scope.data.local.assets.assetsId && $scope.data.local.assets.assetsId > 0)) {
                        return false;
                    }
                    for (var key in $scope.data.local.form) {
                        if (!(($scope.data.local.form[key] + '').length > 0)) {
                            return false;
                        }
                    }
                    for (var i = 0, len = $scope.data.server.txtItems.length; i < len; i++) {
                        if (!($scope.data.server.txtItems[i].answer.length > 0)) {
                            return false;
                        }
                    }
                    var list = $scope.data.server.items,
                        subList = [];
                    for (var i = 0, len = list.length; i < len; i++) {
                        subList = list[i];
                        for (var j = 0, len2 = subList.length; j < len2; j++) {
                            if (subList[j].type == 4 || subList[j].type == 7) {
                                if (!(subList[j].data.answer.length > 0)) {
                                    return false;
                                }
                            }else if(subList[j].type == 5){
                                var flag = false,
                                    tempList = subList[j].data.options;
                                for(var t=0,len4=tempList.length; t<len4; t++){
                                    if(tempList[t].checked){
                                        flag = true;
                                        break;
                                    }
                                }
                                if(!flag) {
                                    return false;
                                }
                            }
                        }
                    }
                    return true;
                },
                getTemplates: function () {
                    qualityDbService.getApplyTemplates(function (json) {
                        $scope.data.local.templateList = json;
                    }); 
                }
            };

            $scope.init = function () {
                if ($scope.data.local.applyId > 0) {
                    qualityDbService.getApplyDetail($scope.data.local.applyId, qualityUtilService, $scope);
                } else {
                    // qualityDbService.getApplyTemplates(function (json) {
                    //     $scope.data.local.templateList = json;
                    // });
                    $scope.methods.getTemplates();
                }
            };

            $scope.init();
        })
    }]);