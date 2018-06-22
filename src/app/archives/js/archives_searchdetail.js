angular.module('app')
    .controller('archivesSearchdetailController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'archivesDbService', 'archivesUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, archivesDbService, archivesUtilService) {
        $scope.$parent.checkLimit('search', function () {
            $scope.data = {
                server: {},
                local: {
                    archivesId: $stateParams.id,
                    tabIndex: 1,
                    showEdit: false,
                    showSubmit: false,
                    isEdit: false,
                    isHtSubmit: false,
                    isCgSubmit: false,
                    htObj: {},
                    cgObj: []
                }
            };

            $scope.methods = {
                showEdit: function () {
                    $scope.data.local.isEdit = true;
                    $scope.data.local.isHtSubmit = false;
                    $scope.data.local.isCgSubmit = false;
                },
                cancle: function () {
                    $scope.data.local.isEdit=false;
                    $scope.data.local.isHtSubmit = false;
                    $scope.data.local.isCgSubmit = false;
                },
                changeTab: function (index, showEdit, showSubmit) {
                    $scope.data.local.tabIndex = index;
                    $scope.data.local.showEdit = showEdit;
                    $scope.data.local.showSubmit = showSubmit;
                    $scope.data.local.isEdit = false;
                },
                cgSubmit: function () {
                    var param = $scope.data.local.cgObj;
                    param.archiveId = $scope.data.server.id;
                    param.assetsId = $scope.data.server.assetsId;
                    param.listFundSources = [];
                    if(+param.listFundSourcesType > 0){                        
                        if(+param.listFundSourcesType == 4) {
                            param.listFundSources.push({
                                type: +param.listFundSourcesType,
                                subType: 1,
                                money: param.listFundSourcesMoney1 
                            });
                            param.listFundSources.push({
                                type: +param.listFundSourcesType,
                                subType: 2,
                                money: param.listFundSourcesMoney2 
                            });
                        }else{
                            param.listFundSources.push({
                                type: +param.listFundSourcesType,
                                money: param.listFundSourcesMoney1 
                            });
                        }
                    }
                    archivesDbService.editPurchase(param, function () {
                        archivesUtilService.tost('提交成功！');
                        $scope.data.local.isEdit = false;
                        $scope.data.local.isCgSubmit = true;
                        $scope.$apply();
                    });
                },
                htSubmit: function () {
                    var param = $scope.data.local.htObj;
                    param.archiveId = $scope.data.server.id;
                    param.assetsId = $scope.data.server.assetsId;
                    archivesDbService.saveHt(param, function () {
                        archivesUtilService.tost('提交成功！');
                        $scope.data.local.isEdit = false;
                        $scope.data.local.isHtSubmit = true;
                        $scope.$apply();
                    });
                },
                init: function () {
                    archivesDbService.getArchiveDetail($scope.data.local.archivesId, function (json) {
                        $scope.data.server = json;
                        $scope.$apply();
                    })
                }
            };

            $scope.methods.init();
        })
    }]);