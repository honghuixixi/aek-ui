function ajax(type, url, param, success, fail) {
    $.ajax({
        type: type,
        url: url,
        data: param,
        contentType: "application/json",
        complete: function(res) {
            if (+res.responseJSON.code === 200) {
                success(res.responseJSON.data);
            } else {
                if (+res.responseJSON.code === 302) {
                    // console.log('maintian--->302');
                    // console.log(res.responseJSON.msg);
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
        }
    });
}

angular.module('app')
    .service('maintainDbService', function() {
        /******************** 保养模板 *****************************/
        // 新建保养模板
        this.addTemplate = function(param, success, fail) {
            ajax('post', '/qc/mtTemplate/add', JSON.stringify(param), success, fail);
        };
        // 编辑保养模板
        this.editTemplate = function(param, success, fail) {
            ajax('POST', '/qc/mtTemplate/edit', JSON.stringify(param), success, fail);
        };
        // 保养模板列表查询
        this.getTemplates = function(param, success) {
            ajax('GET', '/qc/mtTemplate/getByPage', param, success);
        };
        // 模板列表及模板项目查询（无权限）
        this.getTemplatesForPlan = function(param, success) {
            ajax('GET', '/qc/mtTemplate/getList', param, success);
        };
        // 保养模板详情（有权限）
        this.getTemplateInfoWithLimit = function(id, success) {
            ajax('GET', '/qc/mtTemplate/getDetail', { id: id }, success);
        };
        // 停用保养模板
        this.disableTemplate = function(id, success, fail) {
            ajax('PUT', '/qc/mtTemplate/enableOnOff?enable=0&id=' + id, {}, success, fail);
        };
        // 启用保养模板
        this.enableTemplate = function(id, success, fail) {
            ajax('PUT', '/qc/mtTemplate/enableOnOff?enable=1&id=' + id, {}, success, fail);
        };
        // 删除保养模板
        this.deleteTemplate = function(id, success, fail) {
            ajax('DELETE', '/qc/mtTemplate/delete?id=' + id, {}, success, fail);
        };
        // 添加模板项目
        this.addTemplateItem = function(param, success, fail) {
            ajax('POST', '/qc/mtTemplate/addItem', JSON.stringify(param), success, fail);
        };
        // 编辑模板项目
        this.editTemplateItem = function(param, success, fail) {
            ajax('PUT', '/qc/mtTemplate/editItem', JSON.stringify(param), success, fail);
        };
        // 删除模板项目
        this.deleteTemplateItem = function(id, success, fail) {
            ajax('DELETE', '/qc/mtTemplate/deleteItem?itemId=' + id, { itemId: id }, success, fail);
        };
        this.getSysTemplateItem = function(success) {
            ajax('GET', '/qc/mtTemplate/getSysItems', {}, success);
        };
        /******************** 保养计划 *****************************/
        // 部门查询
        this.getDepartments = function(id, success) {
            ajax('GET', '/sys/dept/search/tenant/' + id, {}, success);
        };
        // 设备查询
        this.getEquipments = function(param, success) {
            ajax('GET', '/assets/restAPI/getMtAssetsPage', param, success);
        };
        // 新建保养计划
        this.addPlan = function(param, success, fail) {
            ajax('POST', '/qc/mtPlan/addPlan', JSON.stringify(param), success, fail);
        };
        // 编辑保养计划
        this.editPlan = function(param, success, fail) {
            ajax('POST', '/qc/mtPlan/editPlan', JSON.stringify(param), success, fail);
        };
        // 保养计划详情（查看）
        this.getPlanInfoForBrowse = function(id, success) {
            ajax('GET', '/qc/mtPlan/getPlanDetail/' + id, {}, success);
        };
        // 保养计划详情记录查询
        this.getPlanImplements = function(param, success) {
            ajax('GET', '/qc/mtImplementResult/getMtRecordPage', param, success);
        };
        // 停用保养计划
        this.disablePlan = function(id, success) {
            ajax('GET', '/qc/mtPlan/disablePlan/' + id, {}, success);
        };
        // 查看保养实施报告单
        this.getPlanReport = function(id, $scope, pmUtilService, title) {
            ajax('GET', '/qc/mtImplementResult/getResult', { resultId: id }, function(data) {
                if (data.files) {
                    for (var i = 0, len = data.files.length; i < len; i++) {
                        data.files[i].filePath = encodeURI(encodeURI('/api/download?path=' + data.files[i].filePath));
                    }
                }
                $scope.data.report = data;
                $scope.data.showDownload = true;
                $scope.$apply();
                layer.open({
                    type: 1,
                    title: [title, pmUtilService.layerStyle],
                    content: $('#template_report'),
                    area: ['1000px', '600px'],
                    btn: ['打印', '关闭'],
                    yes: function(index, layero) {
                        $scope.data.showDownload = false;
                        $scope.$apply();
                        $("#template_report").jqprint();
                        $scope.data.showDownload = true;
                        $scope.$apply();
                    }
                });
            });
        };
        // 查看保养实施报告单(批量)
        this.getPlanReportMuilty = function(param, $scope, pmUtilService, title) {
            ajax('GET', '/qc/mtImplementResult/getMtRecordBatchPrint', param, function(data) {
                $scope.data.reportMuilty = data;
                $scope.$apply();
                layer.open({
                    type: 1,
                    title: [title, pmUtilService.layerStyle],
                    content: $('#template_report_muilty'),
                    area: ['1000px', '600px'],
                    btn: ['打印', '关闭'],
                    yes: function(index, layero) {
                        $("#template_report_muilty").jqprint();
                    }
                });
            });
        };
        // 保养计划列表
        this.getPlans = function(param, success) {
            ajax('GET', '/qc/mtPlan/getPlanByPage', param, success);
        };
        // PM计划详情（编辑）
        this.getPlanInfoForEdit = function(id, success) {
            ajax('GET', '/qc/qcPlan/edit/' + id, {}, success);
        };
        /******************** 保养实施 *****************************/
        // 保养实施列表
        this.getImplements = function(param, success) {
            ajax('GET', '/qc/mtPlanImplement/list', param, success);
        };
        // 保养实施详情
        this.getImplementInfo = function(id, success, fail) {
            ajax('GET', '/qc/mtPlanImplement/detail?id=' + id, {}, success, fail);
        };
        // 保养实施提交
        this.submitImplement = function(param, success, fail) {
            ajax('POST', '/qc/mtPlanImplement/submit', JSON.stringify(param), success, fail);
        };
        // 保养实施结果
        this.getImplementResult = function(id, success, fail) {
            ajax('GET', '/qc/mtImplementResult/getResult', { resultId: id }, success, fail);
        };
        /******************** PM报告查询 *****************************/
        // 报告查询
        this.getImplementReport = function(param, success) {
            ajax('GET', '/qc/mtImplementResult/list', param, success);
        };
    });