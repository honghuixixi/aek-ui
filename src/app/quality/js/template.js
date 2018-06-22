angular.module('app')
    .controller('qualityTemplateController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'qualityDbService', 'qualityUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, qualityDbService, qualityUtilService) {
        $scope.$parent.checkLimit('template', function () {
            $scope.data = {
                server: {
                    list: []
                },
                local: {
                    typeOptions: [
                        { id: 0, name: '全部' },
                        { id: 2, name: '已发布' },
                        { id: 1, name: '待发布' }
                    ],
                    keyword: '',
                    currentType: { id: 0, name: '全部' }
                },
                limit: {
                    isAek: $rootScope.userInfo.tenantId == 1
                },
                form: {},
                loading: true,
                empty: false
            };
            // 分页数据
            $scope.pageInfo = {
                pages: 0,
                total: 0,
                size: 16,
                current: 1,
                pstyle: 2
            };

            // 分页事件
            $scope.pagination = function (page, pageSize) {
                $scope.pageInfo.size = pageSize;
                $scope.methods.getList(page, pageSize);
            }

            $scope.methods = {
                changeType: function (item) {
                    $scope.data.local.currentType = item;
                    $scope.methods.search();
                },
                search: function () {
                    $scope.methods.getList(1, $scope.pageInfo.size);
                },
                // 模板列表查询
                getList: function (pageNo, pageSize) {
                    var param = {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        type: $rootScope.userInfo.tenantId == 1 ? 0 : 1
                    };

                    if($scope.data.limit.isAek){
                        if($scope.data.local.currentType.id > 0){
                            param.releaseFlag = $scope.data.local.currentType.id - 1;
                        }
                    }else{
                        param.releaseFlag = 1;
                    }
                    if($scope.data.local.keyword.length > 0){
                        param.keyword = $scope.data.local.keyword;
                    }

                    $scope.data.server.list = [];
                    $scope.data.loading = true;
                    qualityDbService.getTemplateList(param, function (json) {
                        $scope.data.loading = false;
                        $scope.data.server.list = json.records;
                        $scope.pageInfo.current = pageNo;
                        $scope.pageInfo.total = json.total;
                        $scope.data.empty = json.records.length < 1;
                        $scope.$apply();
                    });
                },
                removeErr: function () {
                    $scope.data.form.err = '';
                    $scope.data.form.err2 = '';
                },
                openDialog: function (title, form, fun) {
                    qualityUtilService.openDialog(title, $('#template_add_quality'), ['570px', '340px'], null, function (index) {
                        if($scope.data.form.name == ''){
                            $scope.data.form.err = '请输入模板名称';
                            $scope.$apply();
                            return;
                        }
                        fun(form, index);
                    }, null, function () {
                        $scope.data.form = form;
                    });
                },
                addOpen: function () {
                    this.openDialog('新建模板', {
                        name: '',
                        remarks: '',
                        err: ''
                    }, function (form, index) {
                        qualityDbService.addTemplate(form, function () {
                            layer.close(index);
                            qualityUtilService.tost('新建成功');
                            $scope.methods.search();
                        }, function (msg) {
                            // layer.close(index);
                            // qualityUtilService.tost(msg);
                            $scope.data.form.err = msg;
                            $scope.$apply();
                        });
                    })
                },
                editOpen: function (v) {
                    this.openDialog('编辑模板', {
                        id: v.id,
                        name: v.name,
                        remarks: v.remarks,
                        err: ''
                    }, function (form, index) {
                        qualityDbService.editTemplate(form, function () {
                            layer.close(index);
                            qualityUtilService.tost('编辑成功');
                            $scope.methods.search();
                        }, function (msg) {
                            // layer.close(index);
                            // qualityUtilService.tost(msg);
                            $scope.data.form.err = msg;
                            $scope.$apply();
                        });
                    })
                }
            };

            $scope.init = function () {
                $scope.methods.search();
            };

            $scope.init();
        })
    }]);