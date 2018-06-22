angular.module('app')
    .controller('trainingArchivesController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'trainingDbService', 'trainingUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, trainingDbService, trainingUtilService) {
        $scope.$parent.checkLimit('archives', function () {
            $scope.data = {
                server: {
                    list: []
                }
            };
        })
    }]);