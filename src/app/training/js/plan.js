angular.module('app')
    .controller('trainingPlanController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'trainingDbService', 'trainingUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, trainingDbService, trainingUtilService) {
        $scope.$parent.checkLimit('plan', function () {
            $scope.data = {
                server: {
                    list: []
                },
                local: {
                    userId: $rootScope.userInfo.id
                }
            };
        })
    }]);