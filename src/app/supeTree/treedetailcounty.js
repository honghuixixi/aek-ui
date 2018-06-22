angular.module('app')

    .controller('treeDetailcountyController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
        $rootScope.currentmodule = "监管树";
        $rootScope.tenantId=$stateParams.tenantId;
        console.log($rootScope.tenantId)
        $scope.index = 0;
        $scope.hospitalArr=[
            {id:1,name:'hah1'},
            {id:2,name:'hah2'},
            {id:3,name:'hah3'},
            {id:4,name:'hah4'}
        ];
        $scope.navChange = function (index) {
            $scope.index = index
        }
        // 点击搜索部分
        $scope.hideAll = function() {
            $scope.devshow = false;
            $scope.devshow1 = false;
        }

        $scope.focus = function() {
            console.log('llll')
            $scope.hideAll();
            $scope.devshow = true;
            $scope.devshow1 = true;
        }

        // 点击子菜单
        $scope.click = function($event) {
            $scope.devshow = false;
            $scope.devshow1 = false;
            $scope.orgType = $($event.target).html();
            $scope.orgTypeId = $($event.target).attr('data-id');
        }
    }])


