angular.module('app')
    .controller('pmPlanAddController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'pmDbService', 'pmUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, pmDbService, pmUtilService) {
        $scope.$parent.checkLimit('plan', function() {
            // 数据
            $scope.data = {
                height: document.body.clientHeight - 130,
                departments: [],
                users: [],
                checkUsers: [],
                chooseUser: { id: 0, realName: '', mobile: '' },
                checkUser: {id: 0, realName: '', mobile: ''},
                chooseTemplate: { id: 0, name: '' },
                templateInfo: null,
                templateName: '',
                templates: [],
                condition: {
                    keyword: ''
                },
                status: [
                    { id: 1, name: '一级' },
                    { id: 2, name: '二级' },
                    { id: 3, name: '三级' }
                ],
                selectStatus: { id: 1, name: '一级' },
                selectDepart: { id: 0, name: '选择部门' },
                list: [],
                loading: true,
                empty: false,
                plan: {
                    equipments: [],
                    template: { id: 0, name: '' },
                    cycle: '',
                    level: 1,
                    startDate: '',
                    director: { id: 0, realName: '', mobile: '' },
                    checkMan: {id: 0, realName: '', mobile: ''}
                },
                checkAll: false,
                err: {
                    equipment: false,
                    template: false,
                    cycle: false,
                    level: false,
                    date: false,
                    director: false
                }
            };
            // 分页数据
            $scope.pageInfo = {
                pages: 0,
                total: 0,
                size: 8,
                current: 1,
                pstyle: 2
            };

            $scope.checkNum = function() {
                if ($scope.data.plan.cycle.length > 0) {
                    $scope.data.plan.cycle = parseInt($scope.data.plan.cycle);
                    if (!($scope.data.plan.cycle > 0 && $scope.data.plan.cycle <= 365)) {
                        $scope.data.plan.cycle = '';
                    } else {
                        $scope.removeErr();
                    }
                }
            };

            // 选择部门
            $scope.changeDepart = function(item) {
                $scope.data.selectDepart = item;
                $scope.search();
            };

            // 选择等级
            $scope.changeStatus = function(item) {
                $scope.data.selectStatus = item;
                $scope.data.plan.level = item.id;
                $scope.removeErr();
            };

            // 分页事件
            $scope.pagination = function(page, pageSize) {
                $scope.pageInfo.size = pageSize;
                $scope.getEquipments(page, pageSize);
            }

            // 搜索
            $scope.search = function() {
                $scope.data.plan.equipments = [];
                $scope.getEquipments(1, $scope.pageInfo.size);
            };

            // 移除错误提示
            $scope.removeErr = function() {
                $scope.data.err = {
                    equipment: false,
                    template: false,
                    cycle: false,
                    level: false,
                    date: false,
                    director: false
                };
            };

            // 全选
            $scope.chooseAll = function(flag) {
                $scope.data.checkAll = flag;
                for (var i = 0, len = $scope.data.list.length; i < len; i++) {
                    if ($scope.data.checkAll) {
                        $scope.data.list[i].checked = true;
                        addEquipment($scope.data.list[i]);
                    } else {
                        $scope.data.list[i].checked = false;
                        delEquipment($scope.data.list[i]);
                    }
                }
                $scope.removeErr();
            };

            // 选择设备
            $scope.chooseOne = function(v, flag) {
                v.checked = flag;
                if (v.checked) {
                    $scope.data.checkAll = isCheckAll();
                    addEquipment(v);
                } else {
                    $scope.data.checkAll = false;
                    delEquipment(v);
                }
                $scope.removeErr();
            };

            // 选项负责人
            $scope.chooseUser = function(v) {
                $scope.data.chooseUser = v;
            };

            // 选择验收人
            $scope.chooseCheckUser = function (v) {
                $scope.data.checkUser = v;
            };

            // 删除验收人
            $scope.removeCheckUser = function () {
                $scope.data.checkUser = {id: 0, realName: '', mobile: ''};
                $scope.data.plan.checkMan = {id: 0, realName: '', mobile: ''};
            };

            // 选择模板
            $scope.chooseTemplate = function(v) {
                $scope.data.chooseTemplate = v;
                $scope.getTemplateInfoNoLimit();
            };

            // 打开选择模板对话框
            $scope.showTemplateDialog = function() {
                $scope.data.templateName = '';
                $scope.data.chooseTemplate = $scope.data.plan.template;
                pmDbService.getTemplatesForPlan({}, function(data) {
                    $scope.data.templates = data || [];
                    if ($scope.data.chooseTemplate.id < 1 && data.length > 0) {
                        $scope.data.chooseTemplate = data[0];
                    }
                    $scope.getTemplateInfoNoLimit();
                    $scope.$apply();
                    layer.open({
                        type: 1,
                        title: ['选择模板', pmUtilService.layerStyle],
                        content: $('#template_templates'),
                        area: ['1000px', '600px'],
                        btn: ['确定', '取消'],
                        yes: function(index, layero) {
                            $scope.data.plan.template = $scope.data.chooseTemplate;
                            layer.close(index);
                            $scope.removeErr();
                            $scope.$apply();
                        },
                        success: function() {}
                    });
                });
            };

            // 打开选择负责人对话框
            $scope.showUserDialog = function() {
                $scope.data.chooseUser = $scope.data.plan.director;
                pmDbService.getUsersForPlan(function(data) {
                    $scope.data.users = data || [];
                    $scope.$apply();
                    layer.open({
                        type: 1,
                        title: ['选择负责人', pmUtilService.layerStyle],
                        content: $('#template_user'),
                        area: ['400px', '340px'],
                        btn: ['确定', '取消'],
                        yes: function(index, layero) {
                            $scope.data.plan.director = $scope.data.chooseUser;
                            layer.close(index);
                            $scope.removeErr();
                            $scope.$apply();
                        }
                    });
                });
            };

            // 打开选择验收人对话框
            $scope.showCheckUserDialog = function() {
                $scope.data.checkUser = $scope.data.plan.checkMan;
                pmDbService.getCheckUsersForPlan(function(data) {
                    $scope.data.checkUsers = data || [];
                    $scope.$apply();
                    layer.open({
                        type: 1,
                        title: ['选择验收人', pmUtilService.layerStyle],
                        content: $('#template_user_check'),
                        area: ['600px', '340px'],
                        btn: ['确定', '取消'],
                        yes: function(index, layero) {
                            $scope.data.plan.checkMan = $scope.data.checkUser;
                            layer.close(index);
                            $scope.removeErr();
                            $scope.$apply();
                        }
                    });
                });
            };

            // 获取模板列表
            $scope.getTemplatesForPlan = function() {
                var param = {};
                pmUtilService.concatParam(param, 'keyword', $scope.data.templateName);
                pmDbService.getTemplatesForPlan(param, function(data) {
                    $scope.data.templates = data;
                    $scope.$apply();
                });
            };

            // 获取模板详情
            $scope.getTemplateInfoNoLimit = function() {
                if ($scope.data.chooseTemplate.id > 0) {
                    pmDbService.getTemplateInfoNoLimit($scope.data.chooseTemplate.id, function(data) {
                        $scope.data.templateInfo = data;
                        $scope.$apply();
                    });
                }
            }

            // 获取部门
            $scope.getDepartments = function() {
                pmDbService.getDepartments($rootScope.userInfo.tenantId, function(data) {
                    $scope.data.departments = [{ id: 0, name: '选择部门' }].concat(data);
                    $scope.$apply();
                    pmUtilService.setDatepicker('#startDate', null, null, null, new Date("2050-01-01"), function(b) {
                        $scope.data.plan.startDate = new Date(b.startDate).getTime();
                        $scope.removeErr();
                        $scope.$apply();
                    }, ".app-content-body");
                });
            };

            // 设备查询
            $scope.getEquipments = function(pageNo, pageSize) {
                var param = {
                    "page.current": pageNo,
                    "page.size": pageSize
                };
                if ($scope.data.selectDepart.id > 0) {
                    param['departmentId'] = $scope.data.selectDepart.id;
                }
                pmUtilService.concatParam(param, 'keyword', $scope.data.condition.keyword);

                $scope.data.loading = true;
                $scope.data.list = [];
                $scope.data.checkAll = false;
                pmDbService.getEquipments(param, function(data) {
                    $scope.data.loading = false;
                    $scope.pageInfo.current = pageNo;
                    $scope.pageInfo.total = data.total;
                    $scope.data.list = data.records;
                    $scope.data.empty = data.records.length < 1;
                    copyData();
                    $scope.data.checkAll = isCheckAll();
                    $scope.$apply();
                });
            };

            // 新建PM计划
            $scope.addPlan = function() {
                var flag = false;
                if ($scope.data.plan.equipments.length < 1) {
                    $scope.data.err.equipment = true;
                    flag = true;
                }
                if ($scope.data.plan.template.id < 1) {
                    $scope.data.err.template = true;
                    flag = true;
                }
                if ($scope.data.plan.cycle === '') {
                    $scope.data.err.cycle = true;
                    flag = true;
                }
                if ($scope.data.plan.level < 1) {
                    $scope.data.err.level = true;
                    flag = true;
                }
                if ($scope.data.plan.startDate < 1) {
                    $scope.data.err.date = true;
                    flag = true;
                }
                if ($scope.data.plan.director.id < 1) {
                    $scope.data.err.director = true;
                    flag = true;
                }
                if (flag) {
                    return;
                }
                layer.open({
                    type: 1,
                    title: ['提示', pmUtilService.layerStyle],
                    content: $('#template_save'),
                    area: ['450px', '240px'],
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {
                        layer.close(index);
                        var arr = [];
                        for (var i = 0, len = $scope.data.plan.equipments.length; i < len; i++) {
                            arr.push({
                                id: $scope.data.plan.equipments[i].id, // 1178942, // 设备id
                                no: $scope.data.plan.equipments[i].no, // '设备编号',
                                name: $scope.data.plan.equipments[i].name, // '设备名称',
                                model: $scope.data.plan.equipments[i].model, // '规格型号',
                                serialNo: $scope.data.plan.equipments[i].serialNo, // '出厂编号',
                                departmentId: $scope.data.plan.equipments[i].departmentId, // 1, //所在部门id
                                departmentName: $scope.data.plan.equipments[i].departmentName, // '所在部门名称',
                                buyDate: $scope.data.plan.equipments[i].buyDate, // (new Date()).getTime(), // 购入日期（时间戳）,
                                equipmentStatusType: $scope.data.plan.equipments[i].equipmentStatusType, // 1,
                                equipmentStatusText: $scope.data.plan.equipments[i].equipmentStatusText, // '设备状态'
                            });
                        }
                        var param = {
                            equipmentIds: arr,
                            templateId: $scope.data.plan.template.id,
                            cycle: +$scope.data.plan.cycle,
                            level: $scope.data.plan.level, // PM等级 1：一级 2：二级 3：三级
                            startDate: $scope.data.plan.startDate, // 实施开始日期（时间戳）
                            director: {
                                id: $scope.data.plan.director.id,
                                name: $scope.data.plan.director.realName
                            }
                        };
                        if($scope.data.plan.checkMan.id > 0){
                            param.checkId = $scope.data.plan.checkMan.id;
                            param.checkName = $scope.data.plan.checkMan.realName; 
                        }
                        pmDbService.addPlan(param, function() {
                            $state.go('pm.menu.plan');
                        });
                    }
                });

            };

            // 方法
            function isCheckAll() {
                var flag = false;
                var len = $scope.data.list.length;
                if (len > 0) {
                    flag = true;
                    for (var i = 0, len = $scope.data.list.length; i < len; i++) {
                        if (!$scope.data.list[i].checked) {
                            flag = false;
                            break;
                        }
                    }
                }
                return flag;
            }

            function copyData() {
                for (var i = 0, len = $scope.data.list.length; i < len; i++) {
                    if (getIndex($scope.data.plan.equipments, $scope.data.list[i]) >= 0) {
                        $scope.data.list[i].checked = true;
                    }
                }
            }

            function getIndex(list, v) {
                var index = -1;
                for (var i = 0, len = list.length; i < len; i++) {
                    if (+list[i].id === +v.id) {
                        index = i;
                        break;
                    }
                }
                return index;
            }

            function addEquipment(v) {
                if (getIndex($scope.data.plan.equipments, v) < 0) {
                    $scope.data.plan.equipments.push(v);
                }
            }

            function delEquipment(v) {
                var index = getIndex($scope.data.plan.equipments, v);
                if (index >= 0) {
                    $scope.data.plan.equipments.splice(index, 1);
                }
            }

            function openDialog(title, fun) {
                layer.open({
                    type: 1,
                    title: [title, pmUtilService.layerStyle],
                    content: $('#template_add_template'),
                    area: ['570px', '340px'],
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {
                        if ($scope.data.template.name === "") {
                            $scope.data.err = "请输入模板名称";
                            $scope.$apply();
                        } else {
                            fun(index);
                        }
                    }
                });
            }

            // 初始化
            $scope.getDepartments();
            $scope.getEquipments($scope.pageInfo.current, $scope.pageInfo.size);
        });
    }]);