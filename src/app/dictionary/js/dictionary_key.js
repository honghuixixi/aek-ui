angular.module('app').controller('dicFieldController', ['$rootScope', '$scope', '$stateParams', function($rootScope, $scope, $stateParams) {
    var titleStyle = 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;',
        Field = function(obj) {
            this.id = 0;
            this.name = "";
            this.isDefault = false;
            if (obj) {
                this.id = obj.id;
                this.name = obj.name;
                this.isDefault = obj.defFlag;
            }
        },
        Ctrl = {
            ajax: function(type, url, param, success, err) {
                var option = {
                    type: type,
                    contentType: "application/json;charset=UTF-8",
                    url: url,
                    complete: function(res) {
                        $scope.data.loading = false;
                        if (+res.responseJSON.code === 200) {
                            success(res.responseJSON.data);
                        } else {
                            // TODO
                            if (err) {
                                err(res.responseJSON.msg);
                            }
                        }
                    }
                };

                if (param) {
                    option.data = JSON.stringify(param);
                }

                $.ajax(option);
            },
            post: function(url, param, success, err) {
                Ctrl.ajax('post', url, param, success, err);
            },
            put: function(url, param, success, err) {
                Ctrl.ajax('put', url, param, success, err);
            },
            delete: function(url, success, err) {
                Ctrl.ajax('delete', url, {}, success, err);
            },
            get: function(url, success, err) {
                Ctrl.ajax('get', url, null, success, err);
            },
            // 获取字典表详情
            getTableInfo: function(id) {
                Ctrl.get("/sys/dict/" + id, function(json) {
                    $scope.data.table.name = json.name;
                    $scope.data.table.type = json.manageType > 1 ? "自定义" : "基础";
                    if(json.manageType > 1){
                        $scope.data.limit.manager = ($rootScope || $localStorage).userInfo.authoritiesStr.indexOf('SYS_DICT_MANAGE') >= 0
                    }
                    $scope.$apply();
                })
            },
            // 获取字典值集合
            getFields: function(id) {
                $scope.data.list = [];
                $scope.data.loading = true;
                //$scope.$apply();
                Ctrl.get("/sys/dictValue/list/" + id, function(json) {
                    $scope.data.empty = json.length < 1;
                    $scope.data.list = json;
                    $scope.$apply();
                });
            },
            // 添加、编辑字典值
            saveField: function(fun, err) {
                var url = "/sys/dictValue/save",
                    param = {
                        name: $scope.data.field.name,
                        defFlag: $scope.data.field.isDefault,
                        dictId: $stateParams.id
                    };
                if ($scope.data.field.id > 0) {
                    url = "/sys/dictValue/edit";
                    param.id = $scope.data.field.id;
                    Ctrl.put(url, param, fun, err);
                } else {
                    Ctrl.post(url, param, fun, err);
                }
            },
            // 批量添加字典值
            addFields: function(fields, fun) {
                var param = {
                    dictId: $stateParams.id,
                    dictValueNames: fields
                };
                Ctrl.post("/sys/dictValue/batch/save", param, fun);
            },
            // 删除字典值
            delField: function(id, fun) {
                Ctrl.delete("/sys/dictValue/delete/" + id, fun);
            },
            init: function() {
                $("#dic-content-body").css("min-height", ($("body").height() - 120) + "px");
                var id = $stateParams.id;
                Ctrl.getTableInfo(id);
                Ctrl.getFields(id);
            }
        };

    $scope.data = {
        table: {
            name: "",
            type: ""
        },
        fields: "",
        fieldCount: 0,
        field: new Field(),
        err: "",
        list: [],
        empty: false,
        loading: true,
        limit: {
            browse: ($rootScope || $localStorage).userInfo.authoritiesStr.indexOf('SYS_DICT_LIST_VIEW') >= 0,
            manager: ($rootScope || $localStorage).userInfo.authoritiesStr.indexOf('SYS_DICT_MANAGE') >= 0 && ($rootScope || $localStorage).userInfo.tenantType < 1
        }
    };

    Ctrl.init();

    // 添加或编辑字典值
    $scope.showAddKey = function(obj) {
        $scope.removeErr();
        $scope.data.field = new Field(obj);
        layer.open({
            type: 1,
            title: [obj ? "编辑字典值" : "新增字典值", titleStyle],
            content: $("#template_add_key"),
            area: ['570px', '240px'],
            btn: ['确定', '取消'],
            yes: function(index, layero) {
                if ($scope.data.field.name === "") {
                    $scope.data.err = "字典值不能为空";
                    $scope.$apply();
                    return false;
                }
                Ctrl.saveField(function() {
                    layer.close(index);
                    Ctrl.getFields($stateParams.id);
                }, function(msg) {
                    $scope.data.err = msg;
                    $scope.$apply();
                });
            }
        });
    };

    // 批量新增字典值
    $scope.showAddKeys = function() {
        $scope.removeErr();
        $scope.data.fields = "";
        $scope.data.fieldCount = 0;
        layer.open({
            type: 1,
            title: ["批量新增", titleStyle],
            content: $("#template_add_keys"),
            area: ['600px', '440px'],
            btn: ['确定', '取消'],
            yes: function(index, layero) {
                var arr = $scope.data.fields.split('\n'),
                    fields = [],
                    hasOut = false;
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i].length) {
                        if (arr[i].length > 40) {
                            hasOut = true;
                        }
                        fields.push(arr[i]);
                    }
                }
                if (fields.length) {
                    if (hasOut) {
                        $scope.data.err = "字典值长度不能超过40个字符";
                        $scope.$apply();
                    } else {
                        Ctrl.addFields(fields, function() {
                            layer.close(index);
                            Ctrl.getFields($stateParams.id);
                        });
                    }
                } else {
                    $scope.data.err = "请输入字典值";
                    $scope.$apply();
                }
            }
        });
    };

    // 删除字典值
    $scope.delField = function(obj) {
        layer.open({
            title: ["提示", titleStyle],
            content: "<div style='text-align:center;'><img src='../../../res/img/wh.png' style='margin-bottom:20px;'><p style='font-size:14px;'>确定要删除 " + obj.name + " 吗</p></div>",
            area: ['500px', '220px'],
            btn: ['确定', '取消'],
            yes: function(index, layero) {
                Ctrl.delField(obj.id, function() {
                    layer.close(index);
                    Ctrl.getFields($stateParams.id);
                });
            }
        });
    };

    // 移除错误提示
    $scope.removeErr = function() {
        $scope.data.err = "";
    };

    $scope.calcFields = function() {
        var arr = $scope.data.fields.split('\n'),
            count = 0;
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i].length) {
                count++;
            }
        }
        $scope.data.fieldCount = count;
        $scope.removeErr();
    };
}]);