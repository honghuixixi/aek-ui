angular.module('app')
    .service('meteringUtilService', function() {
        // 弹出框title样式
        this.layerStyle = 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;';
        // tost提示
        this.tost = function(msg, endFun) {
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
                yes: function(index, layero) {
                    fun(index);
                },
                end: endFun,
                success: successFun
            });
        };

        // 去除空格
        this.myTrim = function(x) {
            if (x && x.length > 0) {
                return x.replace(/(^\s*)|(\s*$)/g, ''); ///(^\s*)|(\s*$)/g
            }
            return '';
        };

        // 设置日历控件
        this.setDatepicker = function(id, st, et, min, max, fun, el) {
            var option = {
                format: 'YYYY-MM-DD',
                startDate: st ? st : new Date(),
                endDate: et ? et : new Date(),
                drops: el ? 'up' : 'down',
                isCotrScollEl: el ? el : '.app-content-body',
                // parentEl: 'body',
                opens: 'left',
                timePicker: false,
                singleDatePicker: true
            };
            if (min) {
                option.minDate = min;
            }
            if (max) {
                option.maxDate = max;
            }
            angular.element(id).daterangepicker($.extend({}, option, {}), function(date, enddate, el) {});
            $(id).on('apply.daterangepicker', function(a, b) {
                fun(b);
            });
        };
    });