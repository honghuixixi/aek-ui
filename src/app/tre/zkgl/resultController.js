'use strict';

angular.module('app')
    .controller('ZKGlresultController', ['$scope','$stateParams', '$rootScope', '$state', '$timeout', 'browseService',
        function($scope,$stateParams,$rootScope, $state, $timeout, browseService) {
            $rootScope.currentmodule = "资产管理";
            $scope.getBill = function(key) {
                $.ajax({
                    type: "get",
                    url: "/assets/assAssetsTransfer/getTransfer",
                    data: {
                        id: $stateParams.billId,
                        status: 0
                    },
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {
                            $scope.billObj=res.responseJSON.data;
                            $scope.billObj.billInfo.txt='转科单号：';
                            $scope.$apply();
                        }
                    }
                });
            }
            $scope.getBill();
            $scope.data = {
                loading: true,
                empty: false,
                list: []
            };
            $scope.toAssets = function() {
                browseService.getZkPrint($stateParams.billId, function(data) {
                    $scope.data.print = data;
                    layer.open({
                        type: 1,
                        title: ["打印预览", browseService.layerStyle],
                        content: $('#template_print'),
                        area: ['1000px', '600px'],
                        btn: ['打印', '关闭'],
                        yes: function(index, layero) {
                            $("#template_print").jqprint();
                        },
                        success: function () {
                            $scope.$apply();
                        }
                    });
                });
            };
        }]);