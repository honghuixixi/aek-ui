angular.module('app')
	.controller('operationInfoController', ['$rootScope', '$scope', '$http', '$state', '$localStorage','$stateParams',
		function($rootScope, $scope, $http, $state, $localStorage,$stateParams) {
            $scope.data = {
                title: {
                    1: '1.如何创建角色？',
                    2: '2.如何新建用户？',
                    3: '3.如何新建资产台账及批量导入资产？',
                    4: '4.如何开展维修业务？',
                    5: '5.如何进行设备的巡检业务？',
                    6: '6.如何进行设备的PM业务？',
                    7: '7.如何进行设备的日常保养？',
                    8: '8.如何管理计量设备？',
                    9: '9.如何管理资产的档案？'
                },
                key: $stateParams.id
            };
        }	
	]);