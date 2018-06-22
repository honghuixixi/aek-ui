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
    .service('trainingDbService', function () {
        // 培训记录检索
        this.getList = function (param, success, fail) {
            ajax('get', '/sys/sysTrain/search', param, success, fail);
        };
        // 获取培训详情
        this.getTrainingInfo = function (id, success, fail) {
            ajax('get', '/sys/sysTrain/' + id, {}, success, fail);
        };
        // 添加培训
        this.addTraining = function(param, success, fail) {
            ajax('post', '/sys/sysTrain/add', JSON.stringify(param), success, fail);
        };
        // 编辑培训
        this.editTraining = function(param, success, fail) {
            ajax('post', '/sys/sysTrain/edit', JSON.stringify(param), success, fail);
        };
        // 删除培训
        this.deleteTraining = function(id, success, fail) {
            ajax('delete', '/sys/sysTrain/' + id, {}, success, fail);
        };
    });