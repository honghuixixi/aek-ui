angular.module('app')
    .directive('modelDetail', function () {
        return {
            restrict: "E",
            scope: {
                isEditModel: "=",
                modelSelect: "=",
                userInfo: '=',
                getModelDetail: '='
            },
            templateUrl: 'src/tpl/modelDetail.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$scope", function ($scope) {
                $scope.projectCon = false;
                $scope.projectErr = false;
                $scope.editProject = function (a, b, c) {
                    if (c) {
                        return $scope.projectOperate(a, b, c);
                    }
                    $scope.projectCon = true;
                    $scope.projectErr = false;
                    if (a) {
                        $scope.project = JSON.stringify(a);
                        $scope.project = JSON.parse($scope.project);
                        for (var i = 0; i < $scope.project.results.length; i++) {
                            $scope.project.results[i].time = new Date().getTime() + i;
                        };
                    } else {
                        $scope.project = {
                            name: '',
                            results: [{
                                name: '',
                                time: new Date().getTime() - 1,
                                err: false,
                                isDefault: false
                            }, {
                                name: '',
                                time: new Date().getTime(),
                                err: false,
                                isDefault: false
                            }]
                        };
                    }
                    var index = layer.open({
                        time: 0
                        , type: 1
                        , content: $('#theProjectWrap')
                        , title: [a ? '编辑项目' : '新建项目', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                        , closeBtn: 1
                        , shade: 0.3
                        , shadeClose: true
                        , end: function (index) {
                            $scope.projectCon = false;
                        }
                        , yes: function () {
                            if ($scope.projectErr) {
                                return;
                            }
                            if (!$scope.project.name) {
                                $scope.projectErr = true;
                                $scope.projectErrTxt = '请输入';
                                return $scope.$apply();
                            }
                            for (var i = 0, len = $scope.project.results.length; i < len; i++) {
                                if (!$scope.project.results[i].name) {
                                    $scope.project.results[i].err = true;
                                    return $scope.$apply();
                                }
                                if ($scope.project.results[i].err) {
                                    return;
                                }
                            };
                            $scope.projectOperate(a, b);
                            layer.closeAll();
                        }
                        , btn: ['确定', '取消']
                        , area: ['616px', '423px'] // 423px
                    });
                }
                $scope.projectOperate = function (a, b, c) {
                    c && $.ajax({
                        type: 'delete',
                        url: '/qc/qcProject/delete/' + a.id,
                        contentType: "application/json;charset=UTF-8",
                        complete: function (res) {
                            if (res.responseJSON.code == 200) {
                                $scope.getModelDetail();
                            } else {
                                var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
                                    area: ['100%', '60px'],
                                    time: 3000,
                                    offset: 'b',
                                    shadeClose: true,
                                    shade: 0
                                });
                            }
                        }
                    });
                    !c && $.ajax({
                        type: 'post',
                        url: a ? '/qc/qcProject/edit' : '/qc/qcProject/add',
                        contentType: "application/json;charset=UTF-8",
                        data: JSON.stringify({
                            name: $scope.project.name,
                            id: a ? $scope.project.id : $scope.modelSelect.id,
                            list: $scope.project.results
                        }),
                        complete: function (res) {
                            if (res.responseJSON.code == 200) {
                                $scope.getModelDetail();
                            } else {
                                var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
                                    area: ['100%', '60px'],
                                    time: 3000,
                                    offset: 'b',
                                    shadeClose: true,
                                    shade: 0
                                });
                            }
                        }
                    });
                }
            }]
        };
    })
    .directive('projectOperate', function () {
        return {
            restrict: "E",
            scope: {
                projectErr: "=",
                projectCon: "=",
                modelSelect: "=",
                project: "="
            },
            templateUrl: 'src/tpl/projectOperate.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$scope", function ($scope) {
                $scope.addSelect = function () {
                    if ($scope.project.results.length > 4) {
                        return;
                    }
                    $scope.project.results.push({
                        name: '',
                        time: new Date().getTime(),
                        err: false,
                        isDefault: false
                    });
                }
                $scope.delProject = function (a) {
                    $scope.project.results.splice(a, 1);
                }
                $scope.nameLimit = function (a) {
                    a.name = a.name.substring(0, 4);
                    a.err = false;
                }
                $scope.nameAdjust = function (a) {
                    if (!a.name) {
                        return a.err = true;
                    }
                    for (var i = 0, len = $scope.project.results ? $scope.project.results.length : 0; i < len; i++) {
                        if ($scope.project.results[i].name && ($scope.project.results[i].time != a.time) && ($scope.project.results[i].name == a.name)) {
                            return a.err = true;
                        }
                    };
                }
                $scope.projectLimit = function () {
                    $scope.project.name = $scope.project.name.substring(0, 40);
                    $scope.projectErr = false;
                }
                $scope.projectAdjust = function () {
                    if (!$scope.project.name) {
                        $scope.projectErrTxt = '请输入';
                        return $scope.projectErr = true;
                    }
                    for (var i = 0, len = $scope.modelSelect.projects ? $scope.modelSelect.projects.length : 0; i < len; i++) {
                        if ($scope.modelSelect.projects[i].name == $scope.project.name) {
                            $scope.projectErrTxt = '已存在';
                            $scope.projectErr = true;
                            if ($scope.project.id && ($scope.project.id == $scope.modelSelect.projects[i].id)) {
                                $scope.projectErrTxt = '已存在';
                                $scope.projectErr = false;
                            }
                            return;
                        }
                    };
                }
                $scope.changeChecked = function (a) {
                    if (a.isDefault) {
                        a.isDefault = false;
                        return;
                    }
                    for (var i = $scope.project.results.length - 1; i >= 0; i--) {
                        $scope.project.results[i].isDefault = false;
                    };
                    a.isDefault = true;
                }
            }]
        };
    })
    .directive('implementSummary', function () {
        return {
            restrict: "E",
            scope: {
                type: "=",
                obj: "="
            },
            templateUrl: 'src/tpl/implementSummary.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$scope", function ($scope) {

            }]
        };
    })
    .directive('implementDetail', function () {
        return {
            restrict: "E",
            scope: {
                type: "=",
                obj: "=",
                no: "="
            },
            templateUrl: 'src/tpl/implementDetail.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$scope", function ($scope) {

            }]
        };
    })
    .directive('inspectionPlan', function () {
        return {
            restrict: "E",
            scope: {
                type: "=",
                obj: "="
            },
            templateUrl: 'src/tpl/inspectionPlan.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$scope", function ($scope) {

            }]
        };
    })
    .directive('implementTemplateQ', function () {
        return {
            restrict: "E",
            scope: {
                type1: "@",    // 1：只显示选项；2：显示选项和勾选框；3：只显示答案
                type2: "@",     // 1：不显示备注；2：备注可编辑；3：备注只读; 4:备注为空
                page: "=",  // 当前页码
                pageSize: "=",  // 每页记录数
                equipments: "=",
                templates: "="
            },
            templateUrl: 'src/tpl/implementTemplateQ.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$scope", function ($scope) {
                // 获取单元格宽度
                $scope.getW = function (obj, v, type) {
                    var count = v.projects.length - 1,
                        fontWidth = 15,
                        radioWidth = 20,
                        optionCount = v.projects.length;
                    for (var index in v.projects) {
                        count += v.projects[index].name.length;
                    }
                    if (type === 3) {
                        return obj.answer ? obj.answers[v.id]['name'].length * fontWidth : 50;
                    } else {
                        if (type === 2) {
                            return count * fontWidth + radioWidth * optionCount;
                        } else {
                            return count * fontWidth;
                        }
                    }
                };

                // 选择答案
                $scope.chooseAnswer = function (v, item, option) {
                    v.answers[item.id] = option;
                    v.status = Object.keys(v.answers).length === this.templates.length ? 2 : 1;
                };
            }]
        };
    });

// 巡检验收人
angular.module('app').filter('inspectionCheckMan', function () {
    return function (list) {
        var names = [];
        if(list && list.length > 0){
            for(var i=0,len=list.length; i<len; i++){
                names.push(list[i].name);
            }
        }
        return names.join("； ");
    };
});

