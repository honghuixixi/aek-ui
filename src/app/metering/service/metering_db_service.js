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
    .service('meteringDbService', function() {
        /**************** 计量台账 **********************/
        // 部门查询
        this.getDepartments = function(id, success) {
            ajax('GET', '/sys/dept/search/tenant/' + id, {}, success);
        };
        // 获取具有计量检测权限的用户
        this.getMeteringUsers = function (success, fail) {
            ajax('get', '/sys/user/getMeasureUserList', {}, success, fail);
        };
        // 计量台账检索
        this.getAssets = function(param, success, fail) {
            ajax('get', '/qc/msAssets/search', param, success, fail);
        };
        // 新建非固定资产台账
        this.addAssets = function (param, success, fail) {
            ajax('post', '/qc/msAssets/add', JSON.stringify(param), success, fail);
        };
        // 编辑计量台账
        this.editAssets = function (param, success, fail) {
            ajax('post', '/qc/msAssets/edit', JSON.stringify(param), success, fail);
        };
        /**************** 计量检测 **********************/
        // 计量检测查询
        this.getAssetsTesting = function(param, success, fail) {
            ajax('get', '/qc/msAssets/search_check', param, success, fail);
        };
        // 计量检测详情
        this.getAssetsTestingInfo = function (id, success, fail) {
            ajax('get', '/qc/msAssets/getAllById/' + id, {}, success, fail);
        };
        // 获取暂存数据
        this.getAssetsTestingData = function (id, success, fail) {
            ajax('get', '/qc/msAssets/getSavingById/' + id, {}, success, fail);
        };
        // 计量暂存
        this.saveTepTesting = function (param, success, fail) {
            ajax('post', '/qc/msAssets/saving', JSON.stringify(param), success, fail);
        };
        // 计量提交
        this.submitTesting = function (param, success, fail) {
            ajax('post', '/qc/msAssets/saved', JSON.stringify(param), success, fail);
        };
        /**************** 计量档案 **********************/
        // 计量档案检索
        this.getArchives = function(param, success, fail) {
            ajax('get', '/qc/msAssets/search_record', param, success, fail);
        };
        // 计量检测报告查询
        this.getReport = function(id, success, fail) {
            ajax('get', '/qc/msAssets/getMsAssetsAllRecordById/' + id, {}, success, fail);
        };
    });