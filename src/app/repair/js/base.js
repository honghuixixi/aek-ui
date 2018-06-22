angular.module('app')
    .directive('pmSelect', function() {
        return {
            restrict: "E",
            scope: {
                item: "=",
                list: "=",
                change: "="
            },
            templateUrl: 'src/app/pm/html/directive_select.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$rootScope", "$scope", function($rootScope, $scope) {
                $scope.showOptions = false;
                $scope.displayOption = function() {
                    $scope.showOptions = true;
                };
                $scope.chooseItem = function(item) {
                    $scope.item = item;
                    $scope.menuHide();
                    $scope.change(item);
                };

                $scope.menuHide = function() {
                    $scope.showOptions = false;
                };
            }]
        };
    })
    .controller('baseController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', function($rootScope, $scope, $stateParams, $localStorage, $state) {
        $rootScope.currentmodule = "维修管理";
    }]);