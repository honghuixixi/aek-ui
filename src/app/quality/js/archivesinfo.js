angular.module('app')
    .controller('qualityArchivesinfoController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'qualityDbService', 'qualityUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, qualityDbService, qualityUtilService) {
        $scope.$parent.checkLimit('archives', function () {
            $scope.data = {
                server: {},
                local: {
                    applyId: $stateParams.id,
                    tenantName: $rootScope.userInfo.tenantName,
                    typeOptions: [{ id: 1, name: '验收监测' }, { id: 2, name: '状态性监测' }, { id: 3, name: '稳定性监测' }],
                    currentTemplate: { id: 0, name: '请选择' },
                    currentType: { id: 0, name: '请选择' },
                    form: {
                        contactNumber: '',  // 联系电话
                        checkAccording: '', // 检测依据
                        environmentCondition: '', // 环境条件
                        checkInstrumentName: '', // 标准器-设备名称
                        checkInstrumentSpec: '', // 标准器-规格型号
                        checkInstrumentProducer: '', // 标准器-生产商
                        appearanceWorkCheck: '', // 外观及工作正常性检查
                        checkResult: '', // 检测结论 0：不合格 1：合格
                        deviationRecord: '' // 偏离情况记录
                    },
                    assets: {}
                }
            };

            $scope.methods = {
                disPrint: function () {
                    qualityUtilService.openDialog("打印预览", $("#template_quality_browse_archives"), ['1340px', '700px'], ['打印', '关闭'], function (index) {
                        $("#template_quality_browse_archives").jqprint();
                    });
                }
            };

            $scope.init = function () {
                qualityDbService.getApplyDetail($scope.data.local.applyId, qualityUtilService, $scope);
            };

            $scope.init();
        })
    }]);