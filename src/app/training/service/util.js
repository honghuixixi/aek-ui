angular.module('app')
    .service('trainingUtilService', function () {
        // tost提示
        this.tost = function (msg, endFun) {
            layer.msg('<div class="toaster"><span>' + msg + '</span></div>', {
                area: ['100%', '60px'],
                time: 3000,
                offset: 'b',
                shadeClose: true,
                shade: 0,
                end: endFun
            });
        };
        // 打开对话框
        this.openDialog = function (title, content, area, btn, fun, endFun, successFun) {
            layer.open({
                type: 1,
                title: [title, 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                content: content,
                area: area || ['570px', '340px'],
                btn: btn || ['确定', '取消'],
                yes: function (index, layero) {
                    fun(index);
                },
                success: successFun,
                end: endFun
            });
        };

        // 设置日历控件
        this.setDatepicker = function (id, st, et, min, max, fun, el, time) {
            var option = {
                format: time ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD',
                startDate: st ? st : new Date(),
                endDate: et ? et : new Date(),
                drops: el ? 'up' : 'down',
                isCotrScollEl: el ? el : '.app-content-body',
                // parentEl: 'body',
                opens: 'left',
                timePicker: time || false,
                timePicker12Hour: false,
                singleDatePicker: true
            };
            if (min) {
                option.minDate = min;
            }
            if (max) {
                option.maxDate = max;
            }
            angular.element(id).daterangepicker($.extend({}, option, {}), function (date, enddate, el) { });
            $(id).on('apply.daterangepicker', function (a, b) {
                fun(b);
            });
        };

        // 指定dom绑定上传事件
        this.bindUploadEvent = function (domId, fileSize, tost, success, checkType) {
            angular.element(domId).change(function (e) {
                if (e.currentTarget.files.length) {
                    var _size = e.currentTarget.files[0].size / (1024 * 1024),
                        msg;
                    if (_size > fileSize) {
                        angular.element(domId).val('');
                        tost('文件大于' + fileSize + 'M，上传失败');
                    } else {
                        var file = e.currentTarget.files[0];
                        var flag = true;
                        if (typeof checkType == 'function') {
                            flag = checkType(file);
                        }
                        if (flag) {
                            var formData = new FormData();
                            formData.append("files", file);
                            var xhr = new XMLHttpRequest();
                            xhr.open('POST', '/zuul/api/upload3');
                            xhr.send(formData);
                            xhr.onreadystatechange = function () {
                                var res = xhr.response;
                                var resmsg = '网络故障，上传失败，请重试';
                                if (xhr.readyState == 4) {
                                    if (JSON.parse(res).code == '200') {
                                        resmsg = '上传成功';
                                        success(JSON.parse(res).data[0]);
                                        angular.element(domId).val('');
                                    }
                                    tost(resmsg);
                                }
                            }
                        }else{
                            angular.element(domId).val('');
                        }
                    }
                }
            });
        };

        // 宜昌字符串两端空格
        this.myTrim = function(x) {
            if (x && x.length > 0) {
                return x.replace(/(^\s*)|(\s*$)/g, ''); ///(^\s*)|(\s*$)/g
            }
            return '';
        };

        // 获取当前选中项 
        this.getCurrentOption = function (list, val, key) {
            var result = {};
            var key = key || 'id';
            for(var i=0,len=list.length; i<len; i++){
                if(list[i][key] == val){
                    result = list[i];
                    break;
                }
            }
            return result;
        };
    });