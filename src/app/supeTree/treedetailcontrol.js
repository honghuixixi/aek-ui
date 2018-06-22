angular.module('app')

    .controller('treeDetailcController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
        $rootScope.currentmodule = "监管树";
        $rootScope.tenantId=$stateParams.tenantId;
        $scope.loadAjax = function(){
            $.ajax({
                type: "get",
                url: "/sys/tenant/view/" + $rootScope.tenantId,
                complete: function (res) {
                    if(res.responseJSON.code == 200){
                        $scope.msg = res.responseJSON.data
                        $rootScope.$apply();
                    }
                }
            })
        };
        $scope.loadAjax();
    }])


