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
    .service('applyDbService', function() {
        /******************** 单据申请 *****************************/
        // 获取单据申请列表
        this.getApplyList = function(param, success, fail) {
            ajax('get', '/newrepair/bill/getRepairBillPage', param, success, fail);
        };
        // 获取单据申请详情
        this.getApplyDetail = function(param, success, fail) {
            ajax('get', '/newrepair/bill/getBillDetails/'+param.id, param, success, fail);
        };
        this.getApplyDetail2 = function(param, success, fail) {
            ajax('get', '/newrepair/bill/getBillDetails2/'+param.id, param, success, fail);
        };
        // 撤销单据申请
        this.getApplyCancle = function(param, success, fail) {
            ajax('post', '/newrepair/bill/revoke/'+param.id, param, success, fail);
        };
        // 获取单据申请审核详情
        this.getApplyListDetail = function(param, success, fail) {
            ajax('get', '/newrepair/bill/getCheckFlowDetails/'+param.id, param, success, fail);
        };
        // 审批单据申请
        this.getApplyCheck = function(param, success, fail) {
            ajax('post', '/newrepair/bill/check', param, success, fail);
        };
        
        // 打印申请单
        this.getApplyPrint = function(id, $scope) {
            ajax('GET', '/newrepair/bill/getBillPrintDetails/' + id, {}, function(data) {
                if(data.billFiles){
                    for(var i=0,len=data.billFiles.length; i<len; i++){
                        data.billFiles[i].url = encodeURI(encodeURI('/api/download?path=' + data.billFiles[i].url));
                    }
                }
                $scope.print = data;
                // // $scope.data.report.table = pmUtilService.convertToTable(data.items);
                // $scope.data.showDownload = true;
                // $scope.$apply();
                $scope.showDownload = true;
                layer.open({
                    type: 1,
                    title: ['打印预览', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    content: $('#template_report'),
                    area: ['1000px', '600px'],
                    btn: ['打印', '关闭'],
                    yes: function(index, layero) {
                        // layer.close(index);
                        $scope.showDownload = false;
                        $scope.$apply();
                        $("#template_report").jqprint();
                        $scope.showDownload = true;
                        $scope.$apply();
                    }
                });
                $scope.$apply();
            });
        };

        /******************** 单据审批 *****************************/

        /******************** 维修配置 *****************************/
        // 获取维修配置列表
        this.getRepairConfigList = function(param, success, fail) {
            ajax('get', '/newrepair/repRepairConfig/repairConfigPage', param, success, fail);
        };

        // 获取指定用户的接单科室及所有可用接单科室
        this.getUserRepairConfig = function(param, success, fail) {
            ajax('get', '/newrepair/repRepairConfig/getConfigDetail', param, success, fail);
        };

        // 接单科室检索
        this.getRepairDeps = function(param, success, fail) {
            ajax('get', '/newrepair/repRepairConfig/selectDept', param, success, fail);
        };

        // 保存用户接单科室
        this.saveUserRepairConfig = function(param, success, fail) {
            ajax('post', '/newrepair/repRepairConfig/repConfig', JSON.stringify(param), success, fail);
        };

        /******************** 工作流配置 *****************************/
        // 获取工作流配置
        this.getFlowConfigs = function(param, success, fail) {
            ajax('get', '/newrepair/bill/getWorkflow', param, success, fail);
        };
        
        // 获取审批人
        this.getAuditUsers = function(param, success, fail) {
            ajax('get', '/sys/user/getcheckUserList', param, success, fail);
        };

        // 保存工作流配置
        this.saveFlowConfig = function(param, success, fail) {
            ajax('post', '/newrepair/bill/saveWorkflow', JSON.stringify(param), success, fail);
        };
    });