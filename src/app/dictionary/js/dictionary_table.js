angular.module('app')
    .directive('mySelect', function() {
        return {
            restrict: "E",
            scope: {                
                options: "=",
                search: "&"
            },
            templateUrl: 'src/tpl/my_select.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$scope", function($scope) {
                $scope.showOptions = false;
                $scope.name  = $scope.options[0].name;
                $scope.displayOption = function () {
                    $scope.showOptions = true;
                };
                $scope.closeOption = function () {
                    $scope.showOptions = false;
                };
                $scope.chooseOption = function (v) {
                    $scope.showOptions = false;
                   
                    $scope.name  = v.name;
                    $scope.search({type: v.id});
                };
            }]
        };
    })
    .controller('dicController', ['$rootScope', '$scope', '$stateParams', '$localStorage', function($rootScope, $scope, $stateParams, $localStorage) {
        var titleStyle = 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;',
            Table = function(obj) {
                this.id = 0;
                this.name = "";
                this.type = 2;
                this.absc = "";
                if (obj) {
                    this.id = obj.id;
                    this.name = obj.name;
                    this.type = obj.cascadeStatus.toString();
                    this.absc = obj.remarks ? obj.remarks : "";
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
                                if(err){
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
                getOrgName: function () {
                    Ctrl.get('/sys/tenant/view/tenant/' + ($stateParams.id || $localStorage.userInfo.tenantId) + '/user/' + $rootScope.userInfo.id, function (json) {
                        $scope.data.orgName = json;
                        $scope.$apply();
                    });
                },
                addTable: function(fun, err) {
                    var param = {
                            tenantId: $stateParams.id || $localStorage.userInfo.tenantId,
                            name: $scope.data.record.name,
                            cascadeStatus: $scope.data.record.type,
                            remarks: $scope.data.record.absc
                        },
                        url = "/sys/dict/save";

                    if ($scope.data.record.id > 0) {
                        url = "/sys/dict/edit";
                        param.id = $scope.data.record.id;
                        Ctrl.put(url, param, fun, err);
                    } else {
                        Ctrl.post(url, param, fun, err);
                    }
                },
                delTable: function(id, fun) {
                    Ctrl.delete("/sys/dict/delete/" + id, fun);
                },
                getList: function(page, pageSize) {
                    var url = "/sys/dict/search?tenantId=" + ($stateParams.id || $localStorage.userInfo.tenantId) + "&pageNo=" + page + "&pageSize=" + (pageSize ? pageSize : 16);
                    $scope.data.list = [];
                    $scope.data.loading = true;
                    if ($scope.data.search.type) {
                        url = url + "&manageType=" + $scope.data.search.type;
                    }
                    if ($scope.data.search.keyword.length) {
                        url = url + "&keyword=" + $scope.data.search.keyword;
                    }
                    Ctrl.get(url, function(json) {
                        $scope.pageInfo = json;
                        $scope.data.list = json.records;
                        $scope.data.empty = json.records.length < 1;
                        $scope.$apply();
                    });
                },
                init: function() {
                    $("#dic-content-body").css("min-height", ($("body").height() - 130) + "px");
                    Ctrl.getOrgName();
                    Ctrl.getList(1);
                }
            };

        $scope.data = {
            orgName: "",
            record: new Table(),
            list: [],
            err: "",
            empty: false,
            loading: true,
            search: {
                type: 0,
                keyword: ""
            },
            typeShow: true,
            types: [
                { id: 0, name: "管理类别" },
                { id: 1, name: "基础" },
                { id: 2, name: "自定义" }
            ],
            limit: {
                browse: ($rootScope || $localStorage).userInfo.authoritiesStr.indexOf('SYS_DICT_LIST_VIEW') >= 0,
                manager: ($rootScope || $localStorage).userInfo.authoritiesStr.indexOf('SYS_DICT_MANAGE') >= 0
            }
        };

        Ctrl.init();

        // 新建字典表
        $scope.showAddTabke = function(obj) {
            $scope.removeErr();
            $scope.data.record = new Table(obj);
            layer.open({
                type: 1,
                title: [obj ? "编辑字典表" : "新建字典表", titleStyle],
                content: $('#template_add_table'),
                area: ['570px', '340px'],
                btn: ['确定', '取消'],
                yes: function(index, layero) {
                    if ($scope.data.record.name === "") {
                        $scope.data.err = "字典名称不能为空";
                        $scope.$apply();
                        return false;
                    }
                    Ctrl.addTable(function() {
                        layer.close(index);
                        if(obj){
                            obj.name = $scope.data.record.name;
                            obj.remarks = $scope.data.record.absc;
                            $scope.$apply();
                        }else{
                            Ctrl.getList(1);
                        }                        
                    }, function (msg) {
                        $scope.data.err = msg;
                        $scope.$apply();
                    });

                }
            });
        };

        // 删除字典表
        $scope.delTable = function(obj) {
            layer.open({
                title: ["提示", titleStyle],
                content: "<div style='text-align:center;'><img src='../../../res/img/wh.png' style='margin-bottom:20px;'><p style='font-size:14px;'>确定要删除 " + obj.name + " 吗</p></div>",
                area: ['500px', '220px'],
                btn: ['确定', '取消'],
                yes: function(index, layero) {
                    Ctrl.delTable(obj.id, function() {
                        layer.close(index);
                        Ctrl.getList(1);
                    });
                }
            });
        };

        // 搜索
        $scope.search = function() {
            Ctrl.getList(1);
        };

        // 分页
        $scope.pagination = function(page, pagesize) {
            Ctrl.getList(page, pagesize);
        };

        // 移除错误提示
        $scope.removeErr = function() {
            $scope.data.err = "";
        };

        $scope.changeType = function (type){
            $scope.data.search.type = type;
            Ctrl.getList(1);
        }
    }]);