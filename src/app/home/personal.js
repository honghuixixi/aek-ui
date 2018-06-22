angular.module('app')
    .controller('personalController', [ '$rootScope', '$scope', '$http', '$state','$localStorage','$stateParams',
        function($rootScope, $scope, $http, $state,$localStorage,$stateParams) {
            // $scope.orgId = $stateParams.id;
            // $rootScope.userInfo= $localStorage.userInfo;
        } ]);
