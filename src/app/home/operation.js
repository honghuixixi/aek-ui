angular.module('app')
	.controller('operationController', ['$rootScope', '$scope', '$http', '$state', '$localStorage','$stateParams',
		function($rootScope, $scope, $http, $state, $localStorage,$stateParams) {
            $scope.data = {
                height: document.body.clientHeight - 130
            };
        }	
	]);