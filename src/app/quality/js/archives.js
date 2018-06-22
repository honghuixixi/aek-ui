angular.module('app')
    .controller('qualityArchivesController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'qualityDbService', 'qualityUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, qualityDbService, qualityUtilService) {
        $scope.$parent.checkLimit('archives', function () {
            $scope.data = {
                server: {
                    list: []
                },
                local: {
                    typeOptions: []
                }
            };
        })
    }]);