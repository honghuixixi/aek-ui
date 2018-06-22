angular.module('app')
    .controller('appController', [ '$rootScope', '$scope', '$http', '$state','$localStorage','$stateParams',
        function($rootScope, $scope, $http, $state,$localStorage,$stateParams) {
            // $scope.orgId = $stateParams.id;
            $rootScope.userInfo= $localStorage.userInfo;
} ]);
