// config
/*全局配置*/

window.APP = { version: 'v=20170410' };

Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

angular.module('app')
    .config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
        function($controllerProvider, $compileProvider, $filterProvider, $provide) {
            // lazy controller, directive and service
            app.controller = $controllerProvider.register;
            app.directive = $compileProvider.directive;
            app.filter = $filterProvider.register;
            app.factory = $provide.factory;
            app.service = $provide.service;
            app.constant = $provide.constant;
            app.value = $provide.value;
        }
    ])
    .config(function() {

        //设置表单验证的默认样式
        jQuery.validator.setDefaults({
            errorClass: 'help-block animation-slideDown', // You can change the animation class for a different entrance animation - check animations page
            errorElement: 'div',
            errorPlacement: function(error, e) {
                var eleErrContains = e.parents('.tdgroup');
                if (eleErrContains.length == 0) {
                    eleErrContains = e.parents('.form-group > div');
                }
                eleErrContains.append(error);
            },
            highlight: function(e) {
                $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
                $(e).closest('.help-block').remove();
            },
            success: function(e) {
                e.closest('.form-group').removeClass('has-success has-error');
                e.closest('.help-block').remove();
            }
        });

        //扩展cookie
        $.extend({
            'cookie': function(name, value, options) {
                if (cookieIsEnable) {
                    if (typeof value != 'undefined') { // name and value given, set cookie
                        options = options || {};
                        if (value === null) {
                            value = '';
                            options.expires = -1;
                        }
                        var expires = '';
                        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                            var date;
                            if (typeof options.expires == 'number') {
                                date = new Date();
                                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                            } else {
                                date = options.expires;
                            }
                            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
                        }
                        var path = options.path ? '; path=' + options.path : '';
                        var domain = options.domain ? '; domain=' + options.domain : '';
                        var secure = options.secure ? '; secure' : '';
                        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
                    } else { // only name given, get cookie
                        var cookieValue = null;
                        if (document.cookie && document.cookie != '') {
                            var cookies = document.cookie.split(';');
                            for (var i = 0; i < cookies.length; i++) {
                                var cookie = jQuery.trim(cookies[i]);
                                // Does this cookie string begin with the name we want?
                                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                    break;
                                }
                            }
                        }
                        return cookieValue;
                    }
                } else {
                    alert('cookie 禁用');
                }

                function cookieIsEnable() {
                    return window.navigator.cookieEnabled;
                }
            }
        });
        jQuery.validator.addMethod('stringCheck', function(value, element) {
            return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5]*$/.test(value);
        }, '只能包含字母、数字和汉字');
        jQuery.validator.addMethod('isPhone', function(value, element) {
            var mobileRgx = /^1[3-8][0-9]\d{8}$/;
            var telRgx = /^(\d{3,4}-){0,1}\d{7,9}$/;
            return this.optional(element) || mobileRgx.test(value) || telRgx.test(value);
        }, '请输入正确格式的手机或电话号码');
        jQuery.validator.addMethod('isExist', function(value, element, params) {
            var isTrue = false;
            jQuery.ajax({
                url: params[0],
                type: 'GET',
                async: false,
                data: {
                    userId: params[1],
                    param: value
                },
                dataType: 'json',
                success: function(resData) {
                    isTrue = resData.success;
                }
            });
            return this.optional(element) || isTrue;
        });
        jQuery.validator.addMethod('maxLengthB', function(value, element, params) {
            var b = 0,
                l = value.length;
            for (var i = 0; i < l; i++) {
                if (value.charCodeAt(i) > 255) {
                    b += 2;
                } else {
                    b++;
                }
            }
            return this.optional(element) || b <= params[0];
        });
    })
    .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        // We configure ocLazyLoad to use the lib script.js as the async loader 异步加载
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: [{
                name: 'toaster',
                files: [
                    'lib/angular/toaster.js',
                    'lib/angular/toaster.css'
                ]
            }]
        });
    }])
    .filter('label', function() { // 显示为标签
        return function(input, s) {
            var l = input.split(s);
            var r = '';
            for (var i = 0; i < l.length; i++) {
                r += '<label class="label label-info">' + l[i] + '</label>\n';
            }
            return r;
        }
    })
    .filter('trustHtml', function($sce) { // 安全HTML
        return function(input) {
            return $sce.trustAsHtml(input);
        }
    })
    .filter('highlight', function() { // select 过滤
        function escapeRegexp(queryToEscape) {
            return ('' + queryToEscape).replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
        }

        return function(matchItem, query) {
            return query && matchItem ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="ui-select-highlight">$&</span>') : matchItem;
        };
    })
    .filter('stateFilter', function() {
        return function(value) {
            if (/暂存/.test(value)) {
                return '编辑';
            } else if (/待审核/.test(value)) {
                return '审核';
            } else if (/待记账/.test(value)) {
                return '记账';
            } else if (/待验收/.test(value)) {
                return '验收';
            } else {
                return '查看';
            }
        }
    })
    .filter('stateFilterN', function() {
        return function(value) {
            return value.substr(0, value.indexOf('('));
        }
    }).filter('filterZero', function() {
        return function(value) {
            return value = value == 0 ? '' : value;

        }

    }).filter('transfromData', function() {
        return function(value) {
            return value = value == 0 ? '否' : '是';

        }
    })
    .directive('uiNav', ['$timeout', function($timeout) {
        return {
            restrict: 'AC',
            link: function(scope, el, attr) {
                var _window = $(window),
                    _mb = 768,
                    wrap = $('.app-aside'),
                    next,
                    backdrop = '.dropdown-backdrop';
                // unfolded
                el.on('click', 'a', function(e) {

                    next && next.trigger('mouseleave.nav');
                    var _this = $(this);
                    _this.parent().siblings(".active").toggleClass('active');
                    _this.next().is('ul') && _this.parent().toggleClass('active') && e.preventDefault();
                    // mobile
                    _this.next().is('ul') || ((_window.width() < _mb) && $('.app-aside').removeClass('show off-screen'));
                });

                // folded & fixed
                el.on('mouseenter', 'a', function(e) {
                    next && next.trigger('mouseleave.nav');
                    $('> .nav', wrap).remove();
                    if (!$('.app-aside-fixed.app-aside-folded').length || (_window.width() < _mb) || $('.app-aside-dock').length) return;
                    var _this = $(e.target),
                        top, w_h = $(window).height(),
                        offset = 50,
                        min = 150;

                    !_this.is('a') && (_this = _this.closest('a'));
                    if (_this.next().is('ul')) {
                        next = _this.next();
                    } else {
                        return;
                    }

                    _this.parent().addClass('active');
                    top = _this.parent().position().top + offset;
                    next.css('top', top);
                    if (top + next.height() > w_h) {
                        next.css('bottom', 0);
                    }
                    if (top + min > w_h) {
                        next.css('bottom', w_h - top - offset).css('top', 'auto');
                    }
                    next.appendTo(wrap);

                    next.on('mouseleave.nav', function(e) {
                        $(backdrop).remove();
                        next.appendTo(_this.parent());
                        next.off('mouseleave.nav').css('top', 'auto').css('bottom', 'auto');
                        _this.parent().removeClass('active');
                    });

                    $('.smart').length && $('<div class="dropdown-backdrop"/>').insertAfter('.app-aside').on('click', function(next) {
                        next && next.trigger('mouseleave.nav');
                    });

                });

                wrap.on('mouseleave', function(e) {
                    next && next.trigger('mouseleave.nav');
                    $('> .nav', wrap).remove();
                });
            }
        };
    }])
    .service('printCodeService', function() {
        function _ajax(type, url, param, success, fail) {
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

        // function _fillTemplate(jdom, obj, id, width, height) {
        //     var fields = jdom.find(".print-feild");
        //     var temp = null;
        //     var key = null;
        //     for (var i = 0, len = fields.length; i < len; i++) {
        //         temp = $(fields[i]);
        //         key = temp.html();
        //         temp.html(obj[key]);
        //     }
        //     jdom.find('.print-code').each(function() {
        //         var that = $(this);
        //         that.attr('src', that.attr('src') + id);
        //     });
        //     jdom.css({ width: width + 'px', height: (height - 2) + 'px', padding: '10px 5px 5px 10px', 'margin': 'auto' });
        // }

        function _fillTemplate(jdom, obj, id, width, height) {
            var fields = jdom.find(".print-feild");
            var temp = null;
            var key = null;
            var keyArr = [];
            for (var i = 0, len = fields.length; i < len; i++) {
                temp = $(fields[i]);
                key = temp.html();
                if(key.indexOf('||') >= 0){
                    keyArr = key.split('||');
                    temp.html((obj[keyArr[0]] || '').substring(0, keyArr[1]));
                }else{
                    temp.html(obj[key]);
                }                
            }
            jdom.find('.print-code').each(function() {
                var that = $(this);
                that.attr('src', that.attr('src') + id);
            });
            jdom.css({ width: width + 'px', height: (height - 2) + 'px', padding: '10px 5px 5px 10px', 'margin': 'auto' });
        }

        // ajax
        this.ajax = _ajax;
        // 填充打印模板
        this.fillTemplate = _fillTemplate;
        // 打印标签
        this.print = function(id) {
            _ajax('GET', '/assets/assetsInfo/getAssetsPrintTag/' + id, {}, function(json) {
                var width = json.width * 5,
                    height = json.height * 5,
                    w = width + 200,
                    h = height + 200;
                layer.open({
                    type: 1,
                    title: ["打印标签", 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    content: '<div id="newPrintSwrap"></div>',
                    area: [w + 'px', h + 'px'],
                    btn: ['打印', '关闭'],
                    yes: function(index, layero) {
                        $("#print_swrap").jqprint();
                    },
                    success: function() {
                        // var html = [
                        //     '<div id="print_swrap">',
                        //     '<style>#print_swrap table {width: 100%; height: 100%;border-collapse: collapse;} #print_swrap td {padding: 0 2px;border: 1px solid #333;word-break: break-all;font-size: 12px;}</style>',
                        //     '<table>',
                        //     '<tr><td colspan="3" style="text-align:center;"><font style="width:1px;height:1px"><span class="print-feild">tenantName</span>-设备标签</font></td></tr>',
                        //     '<tr>',
                        //     '<td style="width: 70px; text-align: center;">设备编号</td>',
                        //     '<td class="print-feild" style="padding-left: 10px;">serialNum</td>',
                        //     '</tr>',
                        //     '<tr>',
                        //     '<td colspan="2" style="text-align: center;"><img class="print-code" style="margin-top:0px;" width="130px" height="130px" src="/api/assets/assetsInfo/getQRCode/" alt=""/></td>',
                        //     '</tr>',
                        //     '</table>',
                        //     '</div>'
                        // ];
                        // json.content = html.join("");

                        // var html ='<div id="print_swrap"><style>#print_swrap table {border-collapse: collapse;} #print_swrap td {padding: 0 2px;border: 1px solid #333;word-break: break-all;font-size: 14px;}</style><table style="width:100%;height:100%;"><tr><td colspan="3" style="text-align:center;"><font style="width:1px;height:1px;font-size:14px;"><span class="print-feild">tenantName</span>-固定资产标签</font></td></tr><tr><td style="width: 70px;">院内编码</td><td colspan="2" class="print-feild">serialNum||18</td></tr><tr><td>设备名称</td><td colspan="2" class="print-feild">assetsName||18</td> </tr><tr><td>规格/品牌</td><td colspan="2" class="print-feild">assetsSpec||18</td></tr><tr><td>出厂编号</td><td class="print-feild">factoryNum||12</td><td rowspan="3" align=center style="width:75px;"><img class="print-code" style="margin-top:0px;" width="75px" height="75px" src="/api/assets/assetsInfo/getQRCode/" alt=""/></td></tr><tr><td>所在部门</td><td class="print-feild">deptName||12</td></tr><tr><td>启用日期</td><td class="print-feild">startUseDate||12</td></tr></table></div>';
                        // json.content = html;


                        var jdom = $("#newPrintSwrap");
                        var dom = $(json.content);
                        _fillTemplate(dom, json.assetsData, id, width, height);
                        jdom.empty();
                        dom.appendTo(jdom);
                        jdom.css('margin-top', '50px');
                    }
                });
            });
            // id = 66;
            // id = id ? id : 0;
            // $.ajax({
            //     type: 'GET',
            //     url: '/assets/assetsInfo/getAssetsPrintTag/' + id,
            //     data: {},
            //     contentType: "application/json",
            //     complete: function(res) {
            //         if (+res.responseJSON.code === 200) {
            // var html = [
            //     '<div id="print_swrap">',
            //     '<style>#print_swrap table {width: 100%; height: 100%;border-collapse: collapse;} #print_swrap td {padding: 0 2px;border: 1px solid #333;word-break: break-all;font-size: 12px;}</style>',
            //     '<table>',
            //     '<tr><td colspan="3" style="text-align:center;"><font style="width:1px;height:1px"><span class="print-feild">tenantName</span>-设备标签</font></td></tr>',
            //     '<tr>',
            //     '<td style="width: 70px; text-align: center;">设备编号</td>',
            //     '<td class="print-feild" style="padding-left: 10px;">serialNum</td>',
            //     '</tr>',
            //     '<tr>',
            //     '<td colspan="2" style="text-align: center;"><img class="print-code" style="margin-top:0px;" width="150px" height="150px" src="/api/assets/assetsInfo/getQRCode/" alt=""/></td>',
            //     '</tr>',
            //     '</table>',
            //     '</div>'
            // ];
            //             // res.responseJSON.data = {
            //             //     width: 70,
            //             //     height: 50,
            //             //     assetsData: {
            //             //         tenantName: '爱医康',
            //             //         serialNum: 'DSSsdsd5556525525'
            //             //     },
            //             //     content: html.join('')
            //             // };
            //             var width = res.responseJSON.data.width * 5,
            //                 height = res.responseJSON.data.height * 5,
            //                 w = width + 200,
            //                 h = height + 200;
            //             layer.open({
            //                 type: 1,
            //                 title: ["打印标签", 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
            //                 content: '<div id="newPrintSwrap"></div>',
            //                 area: [w + 'px', h + 'px'],
            //                 btn: ['打印', '关闭'],
            //                 yes: function(index, layero) {
            //                     $("#print_swrap").jqprint();
            //                 },
            //                 success: function() {
            //                     var json = res.responseJSON.data;
            //                     var jdom = $("#newPrintSwrap");
            //                     var dom = $(json.content);
            //                     _fillTemplate(dom, json.assetsData, id, width, height);
            //                     jdom.empty();
            //                     dom.appendTo(jdom);
            //                     // jdom.html(json.content);
            //                     // var fields = jdom.find(".print-feild");
            //                     // var temp = null;
            //                     // var key = null;
            //                     // for (var i = 0, len = fields.length; i < len; i++) {
            //                     //     temp = $(fields[i]);
            //                     //     key = temp.html();
            //                     //     temp.html(json.assetsData[key]);
            //                     // }
            //                     // jdom.find('.print-code').each(function() {
            //                     //     var that = $(this);
            //                     //     that.attr('src', that.attr('src') + id);
            //                     // });
            //                     // $("#print_swrap").css('padding', '2px');
            //                     jdom.css('margin-top', '50px');
            //                     // $("#print_swrap").css({ width: width + 'px', height: (height - 2) + 'px', padding: '10px 5px 5px 10px', 'margin': 'auto' });
            //                 }
            //             });
            //         } else {
            //             layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
            //                 area: ['100%', '60px'],
            //                 time: 3000,
            //                 offset: 'b',
            //                 shadeClose: true,
            //                 shade: 0
            //             });
            //         }
            //     }
            // });
        }
    });