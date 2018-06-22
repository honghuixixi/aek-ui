angular.module('app')
    .controller('maintainPlanEditController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'maintainDbService', 'maintainUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, maintainDbService, maintainUtilService) {
        $scope.$parent.checkLimit('plan', function() {
            $scope.data = {
                departments: [],
                users: [],
                limit: {
                    edit: $rootScope.userInfo.authoritiesStr.indexOf('PM_PLAN_NEW_EDIT') != -1,
                    disable: $rootScope.userInfo.authoritiesStr.indexOf('PM_PLAN_DISABLE_ENABLE') != -1
                },
                status: [
                    { id: 1, name: '一级' },
                    { id: 2, name: '二级' },
                    { id: 3, name: '三级' }
                ],
                chooseUser: { id: 0, realName: '', mobile: '' },
                chooseTemplate: { id: 0, name: '' },
                selectStatus: { id: 1, name: '一级' },
                plan: {
                    no: '',
                    name: '',
                    model: '',
                    departmentName: '',
                    cycle: 0, // PM周期
                    level: 1, // PM等级
                    director: { id: 0, realName: '', mobile: '' },
                    createTime: 0, // 创建时间（时间戳）
                    prevDate: 0, // 上次实施日期（时间戳）
                    nextDate: 0, // 下次实施日期（时间戳）
                    equipmentStatus: '',
                    actualStartDate: 0, // 实际开始日期（时间戳）
                    actualEndDate: 0, // 实际结束日期（时间戳）
                    template: { id: 0, name: '' },
                    reportNo: '',
                    live: 0, //设备现状1：正常工作 2：小问题不影响使用 3：有故障需要维修 4：不能使用
                    workTime: 0, //工时
                    files: [0],
                    remarks: ''
                },
                err: {
                    template: false,
                    cycle: false,
                    level: false,
                    director: false
                }
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

            // 移除错误提示
            $scope.removeErr = function() {
                $scope.data.err = {
                    template: false,
                    cycle: false,
                    level: false,
                    director: false
                };
            };

            // 选择等级
            $scope.changeStatus = function(item) {
                $scope.data.selectStatus = item;
                $scope.data.plan.level = item.id;
            };

            // 选项负责人
            $scope.chooseUser = function(v) {
                $scope.data.chooseUser = v;
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
                maintainDbService.getTemplatesForPlan({}, function(data) {
                    $scope.data.templates = data || [];
                    if ($scope.data.chooseTemplate.id < 1 && data.length > 0) {
                        $scope.data.chooseTemplate = data[0];
                    }
                    $scope.getTemplateInfoNoLimit();
                    $scope.$apply();
                    layer.open({
                        type: 1,
                        title: ['选择模板', maintainUtilService.layerStyle],
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
                maintainDbService.getUsersForPlan(function(data) {
                    $scope.data.users = data || [];
                    $scope.$apply();
                    layer.open({
                        type: 1,
                        title: ['选择负责人', maintainUtilService.layerStyle],
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

            // 获取模板列表
            $scope.getTemplatesForPlan = function() {
                var param = {};
                maintainUtilService.concatParam(param, 'keyword', $scope.data.templateName);
                maintainDbService.getTemplatesForPlan(param, function(data) {
                    $scope.data.templates = data;
                    $scope.$apply();
                });
            };

            // 获取模板详情
            $scope.getTemplateInfoNoLimit = function() {
                if ($scope.data.chooseTemplate.id > 0) {
                    maintainDbService.getTemplateInfoNoLimit($scope.data.chooseTemplate.id, function(data) {
                        $scope.data.templateInfo = data;
                        $scope.$apply();
                    });
                }
            }

            // 获取计划详情
            $scope.getPlanInfoForEdit = function() {
                maintainDbService.getPlanInfoForEdit($stateParams.id, function(data) {
                    data.level2 = data.level;
                    data.cycle2 = data.cycle;
                    data.director = { id: data.directorName.id, realName: data.directorName.name };
                    $scope.data.selectStatus = { id: data.level, name: { '1': '一级', '2': '二级', '3': '三级' }[data.level] };
                    $scope.data.plan = data;
                    $scope.$apply();
                });
            };

            // 保存
            $scope.save = function() {
                var flag = true;
                if ($scope.data.plan.template.id < 1) {
                    flag = false;
                    $scope.data.err.template = true;
                }
                if ($scope.data.plan.cycle === '') {
                    flag = false;
                    $scope.data.err.cycle = true;
                }
                if ($scope.data.plan.level < 1) {
                    flag = false;
                    $scope.data.err.level = true;
                }
                if ($scope.data.plan.director.id < 1) {
                    flag = false;
                    $scope.data.err.director = true;
                }
                if (flag) {
                    layer.open({
                        type: 1,
                        title: ['提示', maintainUtilService.layerStyle],
                        content: $('#template_sure'),
                        area: ['400px', '240px'],
                        btn: ['确定', '取消'],
                        yes: function(index, layero) {
                            var param = {
                                id: +$stateParams.id,
                                templateId: $scope.data.plan.template.id,
                                cycle: +$scope.data.plan.cycle,
                                level: $scope.data.plan.level, // PM等级 1：一级 2：二级 3：三级
                                director: {
                                    id: $scope.data.plan.director.id,
                                    name: $scope.data.plan.director.realName
                                }
                            };
                            maintainDbService.editPlan(param, function() {
                                $state.go("maintain.menu.planinfo", { id: $stateParams.id });
                            });
                            layer.close(index);
                        }
                    });
                }
            };

            // 取消
            $scope.cancle = function() {
                $state.go("maintain.menu.planinfo", { id: $stateParams.id });
            };

            // 页面初始化
            $scope.getPlanInfoForEdit();
        });
    }]);