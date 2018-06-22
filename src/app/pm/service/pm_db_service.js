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
    .service('pmDbService', function() {
        /******************** PM模板 *****************************/
        // 新建PM模板
        this.addTemplate = function(param, success, fail) {
            ajax('post', '/pm/pmTemplate/add', JSON.stringify(param), success, fail);
        };
        // 编辑PM模板
        this.editTemplate = function(param, success, fail) {
            ajax('post', '/pm/pmTemplate/edit', JSON.stringify(param), success, fail);
        };
        // PM列表查询
        this.getTemplates = function(param, success) {
            ajax('GET', '/pm/pmTemplate/search', param, success);
        };
        // PM模板详情（无权限）
        this.getTemplateInfoNoLimit = function(id, success) {
            ajax('GET', '/pm/pmTemplate/change/' + id, {}, success);
        };
        // PM模板详情（有权限）
        this.getTemplateInfoWithLimit = function(id, success) {
            ajax('GET', '/pm/pmTemplate/' + id, {}, success);
        };
        // 停用PM模板
        this.disableTemplate = function(id, success) {
            ajax('GET', '/pm/pmTemplate/disable/' + id, {}, success);
        };
        // 启用PM模板
        this.enableTemplate = function(id, success) {
            ajax('GET', '/pm/pmTemplate/enable/' + id, {}, success);
        };
        // 删除PM模板
        this.deleteTemplate = function(id, success) {
            ajax('DELETE', '/pm/pmTemplate/delete/' + id, {}, success);
        };
        // 添加模板项目
        this.addTemplateItem = function(param, success) {
            ajax('POST', '/pm/pmProject/add', JSON.stringify(param), success);
        };
        // 编辑模板项目
        this.editTemplateItem = function(param, success) {
            ajax('POST', '/pm/pmProject/edit', JSON.stringify(param), success);
        };
        // 删除模板项目
        this.deleteTemplateItem = function(id, success) {
            ajax('DELETE', '/pm/pmProject/delete/' + id, {}, success);
        };
        /******************** PM计划 *****************************/
        // 部门查询
        this.getDepartments = function(id, success) {
            ajax('GET', '/sys/dept/search/tenant/' + id, {}, success);
        };
        // 设备查询
        this.getEquipments = function(param, success) {
            ajax('GET', '/assets/assetsInfo/getPmAssetsPage', param, success);
        };
        // 模板查询（新建PM计划）
        this.getTemplatesForPlan = function(param, success) {
            ajax('GET', '/pm/pmTemplate/changeSearch', param, success);
        };
        // 负责人查询
        this.getUsersForPlan = function(success) {
            ajax('GET', '/sys/user/getPmUserList', {}, success);
        };
        // 验收人查询
        this.getCheckUsersForPlan = function(success) {
            ajax('GET', '/sys/restAPI/getPmCheckUserList', {}, success);
        };
        // 新建PM计划
        this.addPlan = function(param, success) {
            ajax('POST', '/pm/pmPlan/add', JSON.stringify(param), success);
        };
        // 编辑PM计划
        this.editPlan = function(param, success) {
            ajax('POST', '/pm/pmPlan/edit', JSON.stringify(param), success);
        };
        // PM计划详情（查看）
        this.getPlanInfoForBrowse = function(id, success) {
            ajax('GET', '/pm/pmPlan/' + id, {}, success);
        };
        // PM详情记录查询
        this.getPlanImplements = function(param, success) {
            ajax('GET', '/pm/pmImplement/getRecord', param, success);
        };
        // 停用PM计划
        this.disablePlan = function(id, success) {
            ajax('GET', '/pm/pmPlan/disable/' + id, {}, success);
        };
        // 启用PM计划
        this.enablePlan = function(param, success, fail) {
            ajax('POST', '/pm/pmPlan/enable', JSON.stringify(param), success, fail);
        };
        // 查看PM实施报告单
        this.getPlanReport = function(id, $scope, pmUtilService, title, acceptanceFun) {
            ajax('GET', '/pm/pmImplement/getImplementReport/' + id, {}, function(data) {
                if(data.files){
                    for(var i=0,len=data.files.length; i<len; i++){
                        data.files[i].url = encodeURI(encodeURI('/api/download?path=' + data.files[i].url));
                    }
                }
                $scope.data.report = data;
                $scope.data.report.table = pmUtilService.convertToTable(data.items);
                $scope.data.showDownload = true;
                $scope.$apply();
                var option = {
                    type: 1,
                    title: [title, pmUtilService.layerStyle],
                    content: $('#template_report'),
                    area: ['1000px', '600px'],
                    btn: ['打印', '关闭'],
                    yes: function(index, layero) {
                        // layer.close(index);
                        $scope.data.showDownload = false;
                        $scope.$apply();
                        $("#template_report").jqprint();
                        $scope.data.showDownload = true;
                        $scope.$apply();
                    }
                };
                if(typeof acceptanceFun == 'function' && $scope.data.report.status && $scope.data.report.status == 1){
                    option.btn = ['确定验收', '打印', '关闭'];
                    option.btn2 = option.yes;
                    option.yes = acceptanceFun;
                }
                layer.open(option);
            });
        };
        // PM计划列表
        this.getPlans = function(param, success) {
            ajax('GET', '/pm/pmPlan/search', param, success);
        };
        // PM计划详情（编辑）
        this.getPlanInfoForEdit = function(id, success) {
            ajax('GET', '/pm/pmPlan/edit/' + id, {}, success);
        };
        /******************** PM实施 *****************************/
        // PM实施列表
        this.getImplements = function(param, success) {
            ajax('GET', '/pm/pmPlanImplementHelp/search', param, success);
        };
        // PM实施检测
        this.implementCheck = function(id, success) {
            ajax('GET', '/pm/pmPlanImplementHelp/check/' + id, {}, success);
        };
        // 停用PM计划
        this.disableImplementPlan = function(id, success) {
            ajax('GET', '/pm/pmPlan/disableImplementId/' + id, {}, success);
        };
        // PM实施详情
        this.getImplementInfo = function(id, success) {
            ajax('GET', '/pm/pmPlanImplementHelp/' + id, {}, success);
        };
        // 打印PM实施内容
        this.getImplementPrint = function(id, success) {
            ajax('GET', '/pm/pmPlanImplementHelp/printImplementSheet/' + id, {}, success);
        };
        // PM实施暂存+提交
        this.saveOrSubmitImplement = function(param, success) {
            ajax('POST', '/pm/pmPlanImplementHelp/saveOrSubmit', JSON.stringify(param), success);
        };
        /******************** PM验收 *****************************/
        // PM验收列表查询
        this.getAccepttReport = function(param, success) {
            ajax('GET', '/pm/pmPlanImplement/searchReport', param, success);
        };
        // PM确认验收
        this.acceptance = function (id, success, fail) {
            ajax('GET', '/pm/pmImplement/check/' + id, {}, success, fail);
        };
        /******************** PM查询 *****************************/
        // PM报告列表查询
        this.getImplementReport = function(param, success) {
            ajax('GET', '/pm/pmPlanImplement/search_Report', param, success);
        };
    });