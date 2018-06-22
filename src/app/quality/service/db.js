function ajax(type, url, param, success, fail) {
    $.ajax({
        type: type,
        url: url,
        data: param,
        contentType: "application/json",
        complete: function (res) {
            if (+res.responseJSON.code === 200) {
                success(res.responseJSON.data);
            } else {
                if (typeof fail === 'function') {
                    fail(res.responseJSON.msg, res.responseJSON.code)
                } else {
                    layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                }
            }
        }
    });
}

angular.module('app')
    .service('qualityDbService', function () {
        // 部门查询
        this.getDepartments = function (id, success) {
            ajax('GET', '/sys/dept/search/tenant/' + id, {}, success);
        };
        // =================================== 质控填报 ===============================================
        // 质控填报列表查询
        this.getApplyMdReportPage = function (param, success, fail) {
            ajax('GET', '/qc/mdReport/getApplyMdReportPage', param, success, fail);
        };
        // 获取质控填报质控模板列表
        this.getApplyTemplates = function (success, fail) {
            ajax('GET', '/qc/mdTemplate/list', {}, success, fail);
        };
        // 获取申请单详情
        this.getApplyDetail = function (id, qualityUtilService, scope) {
            ajax('GET', '/qc/mdReport/getMdReportDetail', { id: id }, function (json) {
                // 填充单元格答案
                function fillInputAnswer(list, data) {
                    for(var k=0,len3=list.length; k<len3; k++){
                        if(data.id == list[k].itemId && data.sort == list[k].sort){
                            data.answer = list[k].result;
                            break;
                        }
                    }
                }
                // 填充单选答案
                function fillSingleAnswer(list, data) {
                    for(var k=0,len3=list.length; k<len3; k++){
                        if(data.id == list[k].itemId){
                            data.answer = list[k].result;
                            break;
                        }
                    }
                }
                // 填充多选答案
                function fillMuiltyAnswer(list, data) {
                    for(var i=0,len=data.options.length; i<len; i++){
                        for(var k=0,len3=list.length; k<len3; k++){
                            if(data.id == list[k].itemId && data.options[i].id == list[k].result){
                                data.options[i].checked = true;
                                break;
                            }
                        }
                    }
                }

                var obj = qualityUtilService.getMaxColumn(json.templateDetail.items);
                scope.data.server.data = json;
                scope.data.server.template = json.templateDetail;
                scope.data.server.col = obj.max;
                scope.data.server.txtItems = obj.txtItems;
                scope.data.server.items = qualityUtilService.convertToTable(json.templateDetail.items, obj.max, obj.txtItems);
                // 模板
                scope.data.local.currentTemplate.id = json.templateDetail.id;
                scope.data.local.currentTemplate.name = json.templateDetail.name;
                // 类型
                for (var i = 0, len = scope.data.local.typeOptions.length; i < len; i++) {
                    if (scope.data.local.typeOptions[i].id == json.checkType) {
                        scope.data.local.currentType = scope.data.local.typeOptions[i];
                        break;
                    }
                }
                // 资产
                if (json.mdAsset) {
                    scope.data.local.assetsName = json.mdAsset.assetsName;
                    scope.data.local.assets = json.mdAsset;
                }
                //
                for (var key in scope.data.local.form) {
                    scope.data.local.form[key] = json[key] || '';
                }
                if (typeof json.checkResult == 'number') {
                    scope.data.local.form.checkResult = json.checkResult;
                }
                // 最大允差
                if (json.maximumAllowableErrorList && json.maximumAllowableErrorList.length > 0) {
                    var list = scope.data.server.txtItems;
                    for (var i = 0, len = list.length; i < len; i++) {
                        list[i].answer = '';
                        for (var j = 0, len2 = json.maximumAllowableErrorList.length; j < len2; j++) {
                            if (json.maximumAllowableErrorList[i].itemName == list[i].name) {
                                list[i].answer = json.maximumAllowableErrorList[i].desc;
                                break;
                            }
                        }
                    }
                }
                // 项目
                var list = scope.data.server.items,
                    subList = null,
                    answerList = json.templateDetail.results;
                for (var i = 0, len = list.length; i < len; i++) {
                    subList = list[i];
                    for (var j = 0, len2 = subList.length; j < len2; j++) {
                        if (subList[j].type == 7) {
                            fillInputAnswer(answerList, subList[j].data);
                        } else if (subList[j].type == 4) {
                            fillSingleAnswer(answerList, subList[j].data);
                        } else if (subList[j].type == 5) {
                            fillMuiltyAnswer(answerList, subList[j].data);
                        }
                    }
                }
                scope.$apply();
            });
        };
        // 根据设备名称检索设备
        this.getAssets = function (param, success, fail) {
            ajax('GET', '/assets/restAPI/getMdAssets', param, success, fail);
        };
        // 质控填报暂存
        this.applySaveTemp = function (param, success, fail) {
            ajax('POST', '/qc/mdReport/tempSave', JSON.stringify(param), success, fail);
        };
        // 质控填报提交
        this.applySubmit = function (param, success, fail) {
            ajax('POST', '/qc/mdReport/save', JSON.stringify(param), success, fail);
        };
        // 质控填报暂存-重新编辑
        this.applySaveTempAgain = function (param, success, fail) {
            ajax('POST', '/qc/mdReport/againTempSave', JSON.stringify(param), success, fail);
        };
        // 质控填报提交-重新编辑
        this.applySubmitAgain = function (param, success, fail) {
            ajax('POST', '/qc/mdReport/againSave', JSON.stringify(param), success, fail);
        };
        // 撤回申请
        this.applyBack = function (id, success, fail) {
            ajax('GET', '/qc/mdReport/recallMdReport', { id: id }, success, fail);
        };
        // 作废申请
        this.applyDrop = function (id, success, fail) {
            ajax('GET', '/qc/mdReport/deleteMdReport', { id: id }, success, fail);
        };
        // =================================== 质控审核 ===============================================
        // 质控审核列表查询 
        this.getVerifyMdReportPage = function (param, success, fail) {
            ajax('GET', '/qc/mdReport/getVerifyMdReportPage', param, success, fail);
        };
        // 质控审核
        this.audit = function (param, success, fail) {
            ajax('POST', '/qc/mdReport/verifyMdReport', JSON.stringify(param), success, fail);
        };
        // =================================== 质控档案 ================================================
        // 质控档案列表查询  
        this.getArchiveMdReportPage = function (param, success, fail) {
            ajax('get', '/qc/mdReport/getArchiveMdReportPage', param, success, fail);
        };
        // =================================== 质控模板 ================================================
        // 质控模板列表查询
        this.getTemplateList = function (param, success, fail) {
            ajax('GET', '/qc/mdTemplate/page', param, success, fail);
        };
        // 新建质控模板
        this.addTemplate = function (param, success, fail) {
            ajax('POST', '/qc/mdTemplate/save', JSON.stringify(param), success, fail);
        };
        // 编辑质控模板
        this.editTemplate = function (param, success, fail) {
            ajax('POST', '/qc/mdTemplate/edit', JSON.stringify(param), success, fail);
        };
        // 获取质控模板详情
        this.getTemplateinfo = function (param, success, fail) {
            ajax('GET', '/qc/mdTemplate/detail', param, success, fail);
        };
        // 删除模板
        this.delTemplate = function (param, success, fail) {
            ajax('DELETE', '/qc/mdTemplate/delete?id=' + param.id, {}, success, fail);
        };
        // 发布模板
        this.publishTemplate = function (param, success, fail) {
            ajax('PUT', '/qc/mdTemplate/release?id=' + param.id, {}, success, fail);
        };
        // 启用/停用模板
        this.enableTemplate = function (param, success, fail) {
            ajax('PUT', '/qc/mdTemplate/enableOrDisable?id=' + param.id + '&enable=' + param.enable, {}, success, fail);
        };
        // 添加模板项目
        this.addTemplateItem = function (param, success, fail) {
            ajax('POST', '/qc/mdTemplateItem/save', JSON.stringify(param), success, fail);
        };
        // 编辑模板项目
        this.editTemplateItem = function (param, success, fail) {
            ajax('POST', '/qc/mdTemplateItem/edit', JSON.stringify(param), success, fail);
        };
        // 删除模板项目
        this.delTemplateItem = function (param, success, fail) {
            ajax('DELETE', '/qc/mdTemplateItem/delete?id=' + param.id, {}, success, fail);
        };
    });