angular.module('app')
    .controller('meetingArchivesController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'meetingDbService', 'meetingUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, meetingDbService, meetingUtilService) {
        $scope.$parent.checkLimit('archives', function () {
            $scope.data = {
                server: {
                    list: []
                }
            };
        })
    }]);