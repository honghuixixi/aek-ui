angular.module('app')
    .service('maintainUtilService', function() {
        // 弹出框title样式
        this.layerStyle = 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;';
        // tost提示
        this.tost = function(msg, fun) {
            layer.msg('<div class="toaster"><span>' + msg + '</span></div>', {
                area: ['100%', '60px'],
                time: 3000,
                offset: 'b',
                shadeClose: true,
                shade: 0,
                end: function () {
                    if(typeof fun === 'function'){
                        fun();
                    }
                }
            });
        };
        // 拼接字符串可选参数
        this.concatParam = function(param, key, val) {
            if (val && val.length > 0) {
                param[key] = val;
            }
        };

        this.myTrim = function(x) {
            if (x && x.length > 0) {
                return x.replace(/(^\s*)|(\s*$)/g, ''); ///(^\s*)|(\s*$)/g
            }
            return '';
        };

        this.getMinDateStr = function (timer) {
            return (new Date()).Format("yyyy-MM-dd") + " 00:00:00";
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

        // this.fillDefault = function (list, val) {
        //     for (var i = 0, len = list.length; i < len; i++) {
        //         for (var j = 0, len2 = list[i].options.length; j < len2; j++) {
        //             list[i].options[j].answer = val
        //         }
        //     }
        // }

        // this.convertToTable = function(list) {
        //     var arr = [],
        //         temp = null;
        //     for (var i = 0, len = list.length; i < len; i++) {
        //         for (var j = 0, len2 = list[i].options.length; j < len2; j++) {
        //             temp = JSON.parse(JSON.stringify(list[i].options[j]));
        //             temp.itemName = list[i].name;
        //             temp.itemId = list[i].id;
        //             temp.rowSpan = len2;
        //             temp.hasRowSpan = j < 1;
        //             temp.index = i + 1;
        //             arr.push(temp);
        //         }
        //     }
        //     return arr;
        // };

        // this.convertToTableForPrint = function(list) {
        //     var arr = [],
        //         temp = null;
        //     for (var i = 0, len = list.length; i < len; i++) {
        //         for (var j = 0, len2 = list[i].options.length; j < len2; j++) {
        //             temp = { name: list[i].options[j] };
        //             temp.itemName = list[i].name;
        //             temp.rowSpan = len2;
        //             temp.hasRowSpan = j < 1;
        //             temp.index = i + 1;
        //             arr.push(temp);
        //         }
        //     }
        //     return arr;
        // };
        this.getAttention = function (val) {
            var dt = new Date(val),
                now = new Date(),
                result = '';
            if(val){
                if(now.getFullYear() > dt.getFullYear()
                    || (now.getFullYear() == dt.getFullYear() && now.getMonth() > dt.getMonth())
                    || (now.getFullYear() == dt.getFullYear() && now.getMonth() == dt.getMonth() && now.getDate() > dt.getDate())){
                    result = '已过期';
                }
            }
            return result;
        }
    });