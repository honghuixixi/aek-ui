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
    .service('archivesDbService', function () {
        // 获取系统常量
        this.getArchiveConstantMap = function (success) {
            ajax('GET', '/assets/assArchive/getArchiveConstantMap', {}, success);
        };
        // 部门查询
        this.getDepartments = function (id, success) {
            ajax('GET', '/sys/dept/search/tenant/' + id, {}, success);
        };
        /**************** 档案管理 **********************/
        // 档案检索
        this.getArchives = function (param, success, fail) {
            ajax('get', '/assets/assArchive/getArchivePage', param, success, fail);
        };
        // 设备查询
        this.getEqupments = function (param, success) {
            ajax('GET', '/assets/assArchive/getNewArchiveAssetsList', param, success);
        };
        // 新建档案
        this.addArchive = function (param, success, fail) {
            ajax('POST', '/assets/assArchive/addArchive', JSON.stringify(param), success, fail);
        };
        // 获取档案详情(编辑使用)
        this.preEditArchive = function (id, success) {
            ajax('GET', '/assets/assArchive/preEditArchive', {id: id}, success);
        };
        // 编辑档案
        this.editArchive = function (param, success, fail) {
            ajax('POST', '/assets/assArchive/editArchive', JSON.stringify(param), success, fail);
        };
        /**************** 档案查询 **********************/
        // 获取档案信息
        this.getArchiveDetail = function (id, success) {
            ajax('GET', '/assets/assArchive/getArchiveDetail', {id: id}, success);
        };
        // 获取设备信息
        this.getAssetBasicInfo = function (id, success) {
            ajax('GET', '/assets/assArchive/getAssetBasicInfo', {assetId: id}, success);
        };
        // 获取采购信息
        this.getPurchase = function (param, success) {
            ajax('GET', '/assets/assArchivePurchaseInfo/getPurchase', param, success);
        };
        // 编辑采购信息
        this.editPurchase = function (param, success) {
            ajax('POST', '/assets/assArchivePurchaseInfo/editPurchase', JSON.stringify(param), success);
        };
        // 获取合同信息
        this.getHtObject = function (param, success){
            ajax('GET', '/assets/assArchiveContractInfo/getContract', param, success);
        };
        // 提交合同信息
        this.saveHt = function (param, success) {
            ajax('POST', '/assets/assArchiveContractInfo/editContract', JSON.stringify(param), success);
        },
        // 获取证件列表
        this.getCertificate = function (param, success) {
            ajax('GET', '/assets/assArchiveCertificateInfo/getCertificateInfo', param, success);
        };
        // 提交证件
        this.insertOrUpdateCertificateInfo = function (param, success) {
            ajax('POST', '/assets/assArchiveCertificateInfo/insertOrUpdateCertificateInfo', JSON.stringify(param), success);
        };
        // 删除证件
        this.deleteCertificateInfo = function (id, success) {
            ajax('GET', '/assets/assArchiveCertificateInfo/delete/' + id, {}, success);
        };
        // 获取文件列表
        this.getFiles = function(param, success){
            ajax('GET', '/assets/assArchiveFolder/getFolder', param, success);
        };
        // 新建文件
        this.addFolder = function (param, success) {
            ajax('POST', '/assets/assArchiveFolder/addFolder', JSON.stringify(param), success);
        };
        // 获取文件详情
        this.getFolderDetail = function (param, success) {
            ajax('GET', '/assets/assArchiveFolder/getFolderDetail', param, success);
        };
        // 编辑文件
        this.editFolder = function (param, success) {
            ajax('POST', '/assets/assArchiveFolder/editFolder', JSON.stringify(param), success);
        };
        // 删除文件
        this.deleteFolder = function (id, success) {
            ajax('GET', '/assets/assArchiveFolder/deleteFolder/' + id, {}, success);
        };
        // 获取维修列表
        this.getWxList = function (param, success){
           ajax('GET', '/newrepair/repRepairApply/repairRecord', param, success);
        };
        // 获取转科列表
        this.getZkList = function (param, success){
            ajax('GET', '/assets/assArchive/getArchiveTransferPage', param, success);
        };
        // 获取转科报告单
        this.getZkPrint = function (id, success) {
            ajax('GET', '/assets/assAssetsTransfer/getTransferPrint', {id: id}, success);
        };
        // 获取报损列表
        this.getBsList = function (param, success){
            ajax('GET', '/assets/assArchive/getArchiveDiscardPage', param, success);
        };
        // 获取报损报告单
        this.getBsPrint = function (id, success) {
            ajax('GET', '/assets/assDiscard/' + id, {}, success);
        };
    });