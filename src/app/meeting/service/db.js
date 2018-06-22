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
    .service('meetingDbService', function () {
        // 会议记录检索
        this.getList = function (param, success, fail) {
            ajax('get', '/sys/sysMeeting/search', param, success, fail);
        };
        // 获取会议详情
        this.getMeetingInfo = function (id, success, fail) {
            ajax('get', '/sys/sysMeeting/' + id, {}, success, fail);
        };
        // 添加会议
        this.addMeeting = function(param, success, fail) {
            ajax('post', '/sys/sysMeeting/add', JSON.stringify(param), success, fail);
        };
        // 编辑会议
        this.editMeeting = function(param, success, fail) {
            ajax('post', '/sys/sysMeeting/edit', JSON.stringify(param), success, fail);
        };
        // 删除会议
        this.deleteMeeting = function(id, success, fail) {
            ajax('delete', '/sys/sysMeeting/' + id, {}, success, fail);
        };
    });