angular.module('app')
    .controller('meetingPlanController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'meetingDbService', 'meetingUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, meetingDbService, meetingUtilService) {
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