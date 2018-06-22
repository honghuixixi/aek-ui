angular.module('app')

    .controller('accessoryController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
        $rootScope.currentmodule = "维修管理";
    }])

