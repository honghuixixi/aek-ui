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
    .service('browseService', function() {
        // 弹出框title样式
        this.layerStyle = 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;';

        // 获取转科列表
        this.getZklist = function(param, success) {
            ajax("GET", "/assets/assAssetsTransfer/getTransferPageList", param, success);
        };

        // 获取报损列表
        this.getBslist = function(param, success) {
            ajax("GET", "/assets/assDiscard/searchApply", param, success);
        };

        // 获取转科打印单
        this.getZkPrint = function (id, success) {
            ajax('GET', '/assets/assAssetsTransfer/getTransferPrint', {id: id}, success);
        };

        // 获取报损打印单
        this.getBsPrint = function (id, success) {
            ajax('GET', '/assets/assDiscard/' + id, {}, success);
        };

        // 列表数据转换
        this.convertBrowseList = function(list, isZk) {
            var arr = [];
            for (var i = 0, len = list.length; i < len; i++) {
                arr.push({
                    first: true,
                    num: list[i].num,
                    name: list[i].name,
                    time: list[i].time
                });
                for (var j = 0, len2 = list[i].list.length; j < len2; j++) {
                    arr.push({
                        first: false,
                        id: list[i].id,
                        assetsImg: list[i].list[j].assetsImg,       // 设备图片
                        assetsName: list[i].list[j].assetsName,     // '设备名称', 
                        assetsNum: list[i].list[j].assetsNum,       // '设备编号', 
                        factoryName: list[i].list[j].factoryName,   // '生产商', 
                        assetsSpec: list[i].list[j].assetsSpec,     // '规格型号', 
                        deptFrom: isZk ? list[i].list[j].deptFrom : list[i].list[j].deptName, // '所在部门', 
                        deptTo: isZk ? list[i].list[j].deptTo : list[i].type,   // '转入部门、报损类型', 
                        status: list[i].status,
                        rowSpan: j === 0 ? len2 : 0
                    });
                }
            }
            return arr;
        };
    });