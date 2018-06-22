var Ctrl = {
    ajax: function (type, url, param, success, fail) {
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
                    }
                }
            }
        });
    },
    setDefault: function ($scope, i) {
        $scope.data.equipments[i].answers = {};
        for (var j = 0, len2 = $scope.data.templates.length; j < len2; j++) {
            for (var k = 0, len3 = $scope.data.templates[j].projects.length; k < len3; k++) {
                if ($scope.data.templates[j].projects[k].isDefault) {
                    $scope.data.equipments[i].answers[$scope.data.templates[j].id] = $scope.data.templates[j].projects[k];
                }
            }
        }
    },
    searchContent: function ($scope, id, url, page, size, fun) {
        $scope.data.loading = true;
        $scope.data.equipments = [];
        var param = {
            id: id,
            pageNo: page,
            pageSize: size
        }
        Ctrl.ajax('get', url, param, function (data) {
            $scope.data.loading = false;
            $scope.pageInfo.total = data.total;
            $scope.pageInfo.current = page;
            $scope.data.equipments = data.records || [];
            for (var i = 0, len = $scope.data.equipments.length; i < len; i++) {
                if ($scope.data.equipments[i].answers && $scope.data.equipments[i].answers.length > 1) {
                    $scope.data.equipments[i].answers = JSON.parse($scope.data.equipments[i].answers);
                } else {
                    Ctrl.setDefault($scope, i);
                }
            }
            if ($scope.data.equipments.length < 1) {
                $scope.data.empty = true;
            }
            if (typeof fun === 'function') {
                fun()
            } else {
                $scope.$apply();
            }
        });
    },
    // 获取巡检计划详情
    getDetail: function ($scope, id, fun) {
        Ctrl.ajax('get', '/qc/qcImplement/' + id, {}, function (data) {
            var dt = new Date(data.nextDate),
                cycle = parseInt(data.cycle, 10),
                cycleType = data.cycle.substr(data.cycle.length - 1);
            if (cycleType === '天') {
                dt.setDate(dt.getDate() + cycle);
            } else {
                dt.setMonth(dt.getMonth() + cycle);
            }
            if (!data.actualEndDate) {
                data.actualEndDate = (new Date()).getTime();
            }

            $scope.data.plan = data;
            $scope.data.nextDt = dt.getTime();
            $scope.data.nextDt2 = dt.getTime();
            $scope.$apply();
            if (typeof fun === 'function') {
                fun(data);
            }
        })
    },
    // 获取巡检计划详情（巡检结束）
    getDetailImplement: function ($scope, id) {
        Ctrl.ajax('get', '/qc/qcImplement/getByImplement/' + id, {}, function (data) {
            $scope.data.plan = data;
            $scope.$apply();
        })
    },
    // 获取巡检模板
    getTemplate: function ($scope, id, fun) {
        Ctrl.ajax('get', '/qc/qcImplement/getImplementContent/' + id, {}, function (data) {
            $scope.data.templates = data.template;
            $scope.$apply();
            if (typeof fun === 'function') {
                fun();
            }
        });
    },
    // 获取巡检实施列表
    getList: function ($scope, page, size, fun) {
        Ctrl.searchContent($scope, $scope.data.id, '/qc/qcImplement/search_content', page, size, fun);
    },
    // 获取设备列表（巡检结束）
    getList2: function ($scope, page, size) {
        Ctrl.searchContent($scope, $scope.id, '/qc/qcImplement/search_content_ImplementId', page, size);
    },
    // 开始巡检
    startImplement: function (param, fun, fail) {
        Ctrl.ajax('post', '/qc/qcImplement/begin', JSON.stringify(param), fun, fail);
    },
    // 获取打印内容
    getPrint: function ($scope, id, fun) {
        Ctrl.ajax('get', '/qc/qcImplement/printImplementSheet/' + id, {}, function (data) {
            $scope.data.print = data;
            fun();
        });
    },
    // 获取打印报告单
    getPrintResult: function ($scope, id, fun) {
        Ctrl.ajax('get', '/qc/qcImplement/getImplementReport/' + id, {}, function (data) {
            if (data.records && data.records.length) {
                for (var i = 0, len = data.records.length; i < len; i++) {
                    if (data.records[i].answers && data.records[i].answers.length > 0) {
                        data.records[i].answers = JSON.parse(data.records[i].answers);
                    } else {
                        data.records[i].answers = {};
                    }
                }
            }
            $scope.data.print = data;
            fun();
        });
    },
    // 暂存
    saveTemp: function ($scope, fun, fail) {
        var param = {
            id: $scope.data.id,
            actualStartDate: $scope.data.plan.actualStartDate,
            actualEndDate: $scope.data.plan.actualEndDate,
            condition: $scope.data.plan.condition,
            analysis: $scope.data.plan.analysis,
            suggestion: $scope.data.plan.suggestion,
            records: []
        };
        for (var key in $scope.saveList) {
            param.records.push({
                id: $scope.saveList[key].id,
                status: $scope.saveList[key].status || 1,
                remarks: $scope.saveList[key].remarks,
                answers: JSON.stringify($scope.saveList[key].answers)
            });
        }
        Ctrl.ajax('post', '/qc/qcImplement/add', JSON.stringify(param), function (data) {
            if (typeof fun === 'function') {
                fun()
            }
        }, fail);
    },
    // 提交
    save: function ($scope, fun, fail) {
        Ctrl.saveTemp($scope, function () {
            var param = {
                id: $scope.data.id,
                nexDate: $scope.data.nextDt,
                actualEndDate: $scope.data.plan.actualEndDate,
                nextChargeMan: { id: $scope.data.currentNextUser.id, name: $scope.data.currentNextUser.realName },
                checkMan: []
            };
            if ($scope.data.chooseUserList.length > 0) {
                for (var i = 0, len = $scope.data.chooseUserList.length; i < len; i++) {
                    param.checkMan.push({ id: $scope.data.chooseUserList[i].id, name: $scope.data.chooseUserList[i].realName });
                }
            }
            Ctrl.ajax('post', '/qc/qcImplement/submitImplement', JSON.stringify(param), function (data) {
                fun(data);
            }, fail);
        }, fail)
    }
};

angular.module('app')
    .service('implementService', function () {
        // 对话框title样式
        this.layerStyle = 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;';
        // 页面数据
        this.data = function (type) {
            return {
                plan: {
                    checkMan: [], // 巡检验收人
                    name: '', // 巡检实施名称
                    status: 1, // 巡检实施状态1：待巡检；2：巡检中
                    createTime: 0, // 巡检实施创建时间
                    planNo: '', // 计划编号
                    type: '按科室巡检', // 巡检类型
                    cycle: '', // 巡检周期
                    preDate: 0, // 上次巡检日期
                    nextDate: 0, // 下次巡检日期
                    director: '', // 负责人
                    condition: '', // 临床使用情况
                    analysis: '', // 存在的问题及分析
                    suggestion: '', // 改进的问题及建议
                    attention: '', // 提示语
                    actualStartDate: '', // 实际开始时间
                    actualEndDate: '' // 实际结束时间
                },
                type: type, // 1:待巡检；2：巡检中；3：巡检结束
                conType: 1, // tab页1:巡检内容；2：巡检总结
                equipments: [], // 巡检设备
                templates: [], // 巡检模板
                nextDt: '', // 下次巡检日期（巡检提交时设置的日期）
                nextDt2: '',
                print: {
                    hospital: '', // 医院名称
                    planNo: '', // 计划编号
                    scope: '', // 巡检科室
                    director: '', // 负责人
                    records: [], // 巡检设备
                    reportCode: '', // 报告编号
                    firstDate: 0, // 开始日期
                    nextDate: 0, // 结束日期
                    condition: '', // 临床使用情况
                    analysis: '', // 存在的问题及分析
                    suggestion: '' // 改进的问题及建议
                },
                empty: false, // 列表为空
                loading: true // 列表数据加载
            };
        };
        // 分页数据
        this.pageInfo = function () {
            return {
                total: 0, // 总记录数
                current: 1, // 当前页码
                size: 8, // 每页记录数
                pstyle: 2 // 页码类型
            };
        };
        // 获取巡检详情
        this.getDetail = Ctrl.getDetail;
        // 获取巡检详情（巡检结束）
        this.getDetailImplement = Ctrl.getDetailImplement;
        // 获取巡检模板
        this.getTemplate = Ctrl.getTemplate;
        // 获取设备列表
        this.getList = Ctrl.getList;
        // 获取设备列表（巡检结束）
        this.getList2 = Ctrl.getList2;
        // 开始巡检
        this.startImplement = Ctrl.startImplement;
        // 获取打印内容（巡检记录单）
        this.getPrint = Ctrl.getPrint;
        // 获取打印报告单
        this.getPrintResult = Ctrl.getPrintResult;
        // 巡检暂存
        this.saveTemp = Ctrl.saveTemp;
        // 巡检提交
        this.save = Ctrl.save;
        // 打印预览（巡检内容）
        this.showPrint = function ($scope, title) {
            return function () {
                Ctrl.getPrint($scope, $scope.data.id, function () {
                    layer.open({
                        type: 1,
                        title: ["打印预览", title],
                        content: $('#template_ques'),
                        area: ['1000px', '700px'],
                        btn: ['打印', '关闭'],
                        yes: function (index, layero) {
                            $(".modal-tab").hide();
                            $("#template_ques").jqprint();
                            $(".modal-tab").show();
                        },
                        success: function () {
                            $scope.data.reportType = 1;
                            // $scope.$apply();
                        }
                    });
                });
            };
        };
        // 打印预览（巡检结果）
        this.showPrintResult = function ($scope, title) {
            return function () {
                layer.open({
                    type: 1,
                    title: ["打印预览", title],
                    content: $('#template_ques'),
                    area: ['1000px', '700px'],
                    btn: ['打印', '关闭'],
                    yes: function (index, layero) {
                        // $("#template_ques").jqprint();
                        $(".modal-tab").hide();
                        $("#template_ques").jqprint();
                        $(".modal-tab").show();
                    },
                    success: function () {
                        //$scope.$apply();
                        $scope.data.reportType = 1;
                    }
                });
            };
        };
        // 页面初始化
        this.init = function ($scope, id, fun, fun2) {
            $scope.data.id = id;
            Ctrl.getDetail($scope, id, fun2);
            Ctrl.getTemplate($scope, id, function () {
                Ctrl.getList($scope, $scope.pageInfo.current, $scope.pageInfo.size);
            });
            if (typeof fun === 'function') {
                fun();
            }
        };
    })