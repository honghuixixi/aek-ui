// select option
angular.module('app').filter('selectOption', function () {
    return function (level, list) {
        var result = '';
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].id == level) {
                result = list[i].name;
                break;
            }
        }
        return result;
    };
});

angular.module('app').filter('selectOptionName', function () {
    return function (level, list) {
        var result = '';
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].name == level) {
                result = list[i].name;
                break;
            }
        }
        return result;
    };
});

angular.module('app')
    .directive('aekSelect', function () {
        return {
            restrict: "E",
            scope: {
                item: "=",
                list: "=",
                change: "="
            },
            templateUrl: 'src/directives/select/select.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$rootScope", "$scope", function ($rootScope, $scope) {
                $scope.showOptions = false;
                $scope.displayOption = function () {
                    $scope.showOptions = true;
                };
                $scope.chooseItem = function (item) {
                    $scope.item = item;
                    $scope.menuHide();
                    $scope.change(item);
                };

                $scope.menuHide = function () {
                    $scope.showOptions = false;
                };
            }]
        };
    });

angular.module('app')
    .directive('comSelect', function () {
        return {
            restrict: "E",
            scope: {
                id: "=",
                list: "="
            },
            templateUrl: 'src/directives/select/select2.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$rootScope", "$scope", function ($rootScope, $scope) {
                $scope.showOptions = false;
                $scope.displayOption = function () {
                    $scope.showOptions = true;
                };
                $scope.chooseItem = function (item) {
                    $scope.id = item.id;
                    $scope.menuHide();
                };

                $scope.menuHide = function () {
                    $scope.showOptions = false;
                };
            }]
        };
    });

    angular.module('app')
    .directive('comSelectName', function () {
        return {
            restrict: "E",
            scope: {
                id: "=",
                list: "="
            },
            templateUrl: 'src/directives/select/select3.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$rootScope", "$scope", function ($rootScope, $scope) {
                $scope.showOptions = false;
                $scope.displayOption = function () {
                    $scope.showOptions = true;
                };
                $scope.chooseItem = function (item) {
                    $scope.id = item.name;
                    $scope.menuHide();
                };

                $scope.menuHide = function () {
                    $scope.showOptions = false;
                };
            }]
        };
    });