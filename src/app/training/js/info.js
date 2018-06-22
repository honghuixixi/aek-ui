angular.module('app')
    .controller('trainingInfoController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'trainingDbService', 'trainingUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, trainingDbService, trainingUtilService) {
        $scope.$parent.checkLimit($stateParams.type == 1 ? 'plan' : 'archives', function () {
            $scope.data = {
                server: {},
                local: {
                    type: $stateParams.type
                }
            };

            $scope.methods = {
                disPrint: function () {
                    trainingUtilService.openDialog("打印培训单", $("#training-plan-print"), ['800px', '550px'], ['打印', '关闭'], function (index) {
                        $scope.data.server.showDownload = false;
                        $scope.$apply();
                        $("#training-plan-print").jqprint();
                        $scope.data.server.showDownload = true;
                        $scope.$apply();
                    });
                },
                edit: function () {
                    $state.go('training.menu.add', {id: $stateParams.id});
                },
                del: function () {
                    trainingUtilService.openDialog('提示', $('#trainDelTpl'), ['480px','230px'], null, function (index) {
                        layer.close(index);
                        trainingDbService.deleteTraining($stateParams.id, function (json) {
                            trainingUtilService.tost('删除成功', function () {
                                $state.go('training.menu.plan');
                            });
                        }, function (msg) {
                            trainingUtilService.tost(msg, function () {
                                $state.go('training.menu.plan');
                            });
                        });
                    });
                }
            };

            $scope.init = function () {
                trainingDbService.getTrainingInfo($stateParams.id, function (json) {
                    json.files = JSON.parse(json.files);
                    $scope.data.server = json;
                    $scope.data.server.showDownload = true;
                    $scope.$apply();
                });
            };

            $scope.init();
        })
    }]);