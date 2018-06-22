angular.module('app')
    .service('qualityUtilService', function () {
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

        // 操作确认对话框
        this.confirm = function (txt, isAsk, fun) {
            layer.open({
                type: 1,
                title: ['提示', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                content: '<div style="text-align: center; color: #666;"><div class="inspectionLayerImg m-t-lg m-b-md"><img src="../../res/img/' + (isAsk ? 'wh' : 'icon20') + '.png"></div><div>' + txt + '</div></div>',
                area: ['480px', '230px'],
                btn: ['确定', '取消'],
                yes: fun
            });
        }

        // 设置日历控件
        this.setDatepicker = function (id, st, et, min, max, fun, el, time) {
            var option = {
                format: 'YYYY-MM-DD',
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
                        } else {
                            angular.element(domId).val('');
                        }
                    }
                }
            });
        };

        // 宜昌字符串两端空格
        this.myTrim = function (x) {
            if (x && x.length > 0) {
                return x.replace(/(^\s*)|(\s*$)/g, ''); ///(^\s*)|(\s*$)/g
            }
            return '';
        };

        // 获取当前选中项 
        this.getCurrentOption = function (list, val, key) {
            var result = {};
            var key = key || 'id';
            for (var i = 0, len = list.length; i < len; i++) {
                if (list[i][key] == val) {
                    result = list[i];
                    break;
                }
            }
            return result;
        };

        // 质控模板格式转换
        this.getMaxColumn = function (list) {
            var max = 1,
                temp = 0,
                txtItems = [];
            if (list && list.length > 0) {
                function getColumn(arr) {
                    var col = 0,
                        remark = 0;
                    for (var i = 0, len = arr.length; i < len; i++) {
                        if (arr[i].type == 1) {
                            col = arr[i].columns;
                        } else {
                            remark++;
                        }
                    }
                    return col + remark;
                }
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].inputType == 1) {
                        list[i].answer = '';
                        txtItems.push(list[i]);
                        temp = getColumn(list[i].childItems || []);
                        if (temp > max) {
                            max = temp;
                        }
                    }
                }
            }
            return {
                max: max,
                txtItems: txtItems
            };
        };
        this.convertToTable = function (list, max) {
            var rows = [],
                ONE = 1,
                TYPE_NUM = 1,       // 序号
                TYPE_ITEM_NAME = 2, // 项目名称
                TYPE_ITEM_TYPE = 3, // 项目类型
                TYPE_SINGLE = 4,    // 单选
                TYPE_MUILTY = 5,    // 多选
                TYPE_OPERATE = 6,   // 操作
                TYPE_INPUT = 7,     // 输入框
                TYPE_REMARK = 8;    // 项目备注

            if (list && list.length > 0) {
                /**
                 * 
                 * @param {*} table_row 行
                 * @param {*} type 单元格类型
                 * @param {*} row 行数
                 * @param {*} col 列数
                 * @param {*} txt 单元格文本
                 * @param {*} data 单元格数据
                 */
                function fillTd(table_row, type, row, col, txt, data, width) {
                    table_row.push({
                        type: type,
                        row: row,
                        col: col,
                        txt: txt,
                        data: data,
                        width: width ? width : 'auto'
                    });
                }
                /**
                 * 
                 * @param {*} item 项目
                 * @param {*} row 行数
                 * @param {*} num 序号
                 * @param {*} data 项目数据
                 * @param {*} fun 
                 */
                function fillRemark(item, row, num, data, fun) {
                    if (item.remarks && item.remarks.length > 0) {
                        var table_row = [];
                        rows.push(table_row);
                        row++;
                        fillTd(table_row, TYPE_NUM, row, ONE, num);                 // 序号
                        fillTd(table_row, TYPE_REMARK, ONE, max + 3, item.remarks);  // 项目备注
                        fillTd(table_row, TYPE_OPERATE, row, ONE, '', data);        // 操作
                        table_row = [];
                        rows.push(table_row);
                        fun(table_row)
                    } else {
                        var table_row = [];
                        rows.push(table_row);
                        fillTd(table_row, TYPE_NUM, row, ONE, num, null);       // 序号
                        fun(table_row);                                         // 第一行内容
                        fillTd(table_row, TYPE_OPERATE, row, ONE, '', data);    // 操作

                    }
                }
                function getRow(item) {
                    var row = [],
                        col = [];
                    for (var i = 0, len = item.length; i < len; i++) {
                        if (item[i].type == 1) {
                            row.push(item[i]);
                        } else {
                            col.push(item[i]);
                        }
                    }
                    return {
                        row: row,
                        col: col
                    };
                }
                function getInputData(item, index) {
                    return { id: item.id, sort: index, answer: '' }
                }
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].inputType == 1) { // 文本
                        var obj = getRow(list[i].childItems || []),
                            row = obj.row.length,
                            col = row + obj.col.length;
                        // 输出备注行
                        fillRemark(list[i], row, i + ONE, list[i], function (first_row) {
                            var inputData = null;
                            // 第一行-列-项目名称
                            fillTd(first_row, TYPE_ITEM_NAME, row, ONE, list[i].name, null, '120px');
                            // 第一行-列-项目类型
                            fillTd(first_row, TYPE_ITEM_TYPE, row, ONE, '文本');
                            // 第一行-列-子项目名称
                            fillTd(first_row, TYPE_ITEM_NAME, ONE, ONE, obj.row[0].name);
                            // 第一行-列-子项目-列（空列）需要根据最大列数合并单元格，合并到最后一列
                            for (var j = 0, len2 = obj.row[0].columns; j < len2; j++) {
                                inputData = getInputData(obj.row[0], j + ONE);
                                if (j == len2 - 1) {
                                    var dis = max - obj.row[0].columns - obj.col.length;
                                    fillTd(first_row, TYPE_INPUT, ONE, ONE + dis, inputData.answer, inputData);
                                } else {
                                    fillTd(first_row, TYPE_INPUT, ONE, ONE, inputData.answer, inputData);
                                }
                            }
                            // 第一行-列-子项目备注
                            for (var j = 0, len2 = obj.col.length; j < len2; j++) {
                                fillTd(first_row, TYPE_ITEM_NAME, ONE, ONE, obj.col[j].name);
                            }
                            // 第二行开始，子项目循环输出
                            if (row > 1) {
                                for (var j = 1; j < row; j++) {
                                    // 插入行
                                    var brr = [];
                                    rows.push(brr);
                                    // 列-子项目名称
                                    fillTd(brr, TYPE_ITEM_NAME, ONE, ONE, obj.row[j].name);
                                    // 列-子项目-列（空列）需要根据最大列数合并单元格，合并到最后一列
                                    for (var k = 0; k < obj.row[j].columns; k++) {
                                        inputData = getInputData(obj.row[j], k + ONE);
                                        if (k == obj.row[j].columns - 1) {
                                            var dis = max - obj.row[0].columns - obj.col.length;
                                            fillTd(brr, TYPE_INPUT, ONE, ONE + dis, inputData.answer, inputData);
                                        } else {
                                            fillTd(brr, TYPE_INPUT, ONE, ONE, inputData.answer, inputData);
                                        }
                                    }
                                    // 列-子项目备注
                                    for (var k = 0, len3 = obj.col.length; k < len3; k++) {
                                        inputData = getInputData(obj.col[k], j);
                                        // 判断是否跨行，若跨行则第一行合并单元格
                                        if (j == 1 && obj.col[k].crossRow) {
                                            fillTd(brr, TYPE_INPUT, row - ONE, ONE, inputData.answer, inputData);
                                        }
                                        // 非跨行，输出每一行
                                        if (!obj.col[k].crossRow) {
                                            fillTd(brr, TYPE_INPUT, ONE, ONE, inputData.answer, inputData);
                                        }
                                    }
                                }
                            }
                        });

                    } else { // 选择
                        // 输出备注行
                        fillRemark(list[i], ONE, i + ONE, list[i], function (table_row) {
                            // 列-项目名称
                            fillTd(table_row, TYPE_ITEM_NAME, ONE, ONE, list[i].name, null, '120px');
                            // 列-项目类型
                            fillTd(table_row, TYPE_ITEM_TYPE, ONE, ONE, '选择');
                            // 列-选项
                            if (list[i].selectType == 1) {
                                fillTd(table_row, TYPE_SINGLE, ONE, max + ONE, '', { id: list[i].id, options: list[i].childItemOptions, answer: '' });
                            } else {
                                var tempList = list[i].childItemOptions;
                                for(var t=0,len4=tempList.length; t<len4; t++){
                                    tempList[t].checked = false;
                                }
                                fillTd(table_row, TYPE_MUILTY, ONE, max + ONE, '', { id: list[i].id, options: list[i].childItemOptions, answer: [] });
                            }
                        });
                    }
                }
            }
            return rows;
        }
    });