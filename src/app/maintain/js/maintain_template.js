angular.module('app')
    .controller('maintainTemplateController', ['$rootScope', '$scope', '$stateParams', '$localStorage', 'maintainDbService', 'maintainUtilService', function($rootScope, $scope, $stateParams, $localStorage, maintainDbService, maintainUtilService) {
        $scope.$parent.checkLimit('template', function() {
            // 数据
            $scope.data = {
                height: document.body.clientHeight - 130,
                status: [
                    { id: 2, name: '全部状态' },
                    { id: 1, name: '启用' },
                    { id: 0, name: '停用' }
                ],
                condition: {
                    keyword: ''
                },
                selectStatus: { id: 2, name: '全部状态' },
                limit: {
                    add: true, // $rootScope.userInfo.authoritiesStr.indexOf('PM_TEMPLATE_NEW') != -1,
                    edit: true // $rootScope.userInfo.authoritiesStr.indexOf('PM_TEMPLATE_EDIT') != -1
                },
                list: [],
                loading: true,
                empty: false,
                template: {
                    id: 0,
                    name: '',
                    remarks: ''
                },
                err: '',
                isSave: true
            };
            // 分页数据
            $scope.pageInfo = {
                pages: 0,
                total: 0,
                size: 16,
                current: 1,
                pstyle: 2
            };

            $scope.changeStatus = function(item) {
                $scope.data.selectStatus = item;
                $scope.search();
            };

            // 分页事件
            $scope.pagination = function(page, pageSize) {
                $scope.pageInfo.size = pageSize;
                $scope.getTemplates(page, pageSize);
            }

            // 移除错误提示
            $scope.removeErr = function() {
                $scope.data.err = "";
            };

            // 新建模板
            $scope.addTemplate = function() {
                $scope.data.template = {
                    id: 0,
                    name: '',
                    remarks: ''
                };
                $scope.data.err = '';
                openDialog('新建保养模板', function(index) {
                    var param = {
                        name: $scope.data.template.name,
                        remarks: $scope.data.template.remarks
                    };
                    if ($scope.data.isSave) {
                        $scope.data.isSave = false;
                        maintainDbService.addTemplate(param, function() {
                            $scope.data.isSave = true;
                            layer.close(index);
                            $scope.search();
                            maintainUtilService.tost('新建成功');
                        }, function(msg) {
                            $scope.data.isSave = true;
                            $scope.data.err = msg;
                            $scope.$apply();
                        });
                    }
                });
            };

            // 编辑模板
            $scope.editTemplate = function(tem) {
                $scope.data.template = {
                    id: tem.id,
                    name: tem.name,
                    remarks: tem.remarks
                };
                $scope.data.err = '';
                openDialog('编辑保养模板', function(index) {
                    var param = {
                        id: $scope.data.template.id,
                        name: $scope.data.template.name,
                        remarks: $scope.data.template.remarks
                    };
                    if ($scope.data.isSave) {
                        $scope.data.isSave = false;
                        maintainDbService.editTemplate(param, function() {
                            $scope.data.isSave = true;
                            layer.close(index);
                            $scope.getTemplates($scope.pageInfo.current, $scope.pageInfo.size);
                            maintainUtilService.tost('保存成功');
                        }, function(msg) {
                            $scope.data.isSave = true;
                            $scope.data.err = msg;
                            $scope.$apply();
                        });
                    }
                });
            };

            // 模板列表查询
            $scope.getTemplates = function(pageNo, pageSize) {
                var param = {
                    pageNo: pageNo,
                    pageSize: pageSize
                };
                maintainUtilService.concatParam(param, 'enable', $scope.data.selectStatus.id < 2 ? $scope.data.selectStatus.id + '' : '');
                maintainUtilService.concatParam(param, 'keyword', $scope.data.condition.keyword);

                $scope.data.loading = true;
                $scope.data.list = [];
                maintainDbService.getTemplates(param, function(data) {
                    $scope.data.loading = false;
                    $scope.pageInfo.current = pageNo;
                    $scope.pageInfo.total = data.total;
                    $scope.data.list = data.records;
                    $scope.data.empty = data.records.length < 1;
                    $scope.$apply();
                });
            };

            // 搜索
            $scope.search = function() {
                $scope.getTemplates(1, $scope.pageInfo.size);
            };

            // 方法
            function openDialog(title, fun) {
                layer.open({
                    type: 1,
                    title: [title, maintainUtilService.layerStyle],
                    content: $('#template_add_template'),
                    area: ['570px', '340px'],
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {
                        // $scope.data.template.name = maintainUtilService.myTrim($scope.data.template.name);
                        angular.element("#templateName").val($scope.data.template.name);
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
            $scope.getTemplates($scope.pageInfo.current, $scope.pageInfo.size);
        })
    }]);