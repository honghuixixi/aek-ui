angular.module('app')
    .directive('assetList', function() {
        return {
            restrict: "E",
            scope: {
                trData: "=",
                checkAll: "=",
                all: '=',
                checked: '=',
                type: '@' // 1:报损，2:转科
            },
            templateUrl: 'src/tpl/assetList.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$scope", function($scope) {
                
            }]
        };
    })
    .directive('billDetail', function() {
        return {
            restrict: "E",
            scope: {
                billObj: "=",
                assetCancle: '=',
                power: '=',
                type: '@' // 1:报损，2:转科
            },
            templateUrl: 'src/tpl/billDetail.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$scope", function($scope) {
                $scope.billListShow=false;
                $scope.billListChange=function(){
                    $scope.billListShow=!$scope.billListShow;
                }
            }]
        };
    })
    .directive('browseList', function () {
        return {
            restrict: "E",
            scope: {
                col: "@",
                header: '@',
                link: "@",
                list: '='
            },
            templateUrl: 'src/app/tre/zkgl/template/browse.html',
            replace: true, 
            transclude: false, 
            controller: ["$scope", function($scope) {
                
            }]
        };
    })
    .directive('browsePrint', function () {
        return {
            restrict: "E",
            scope: {
                title: "@",
                title2: "@",
                title3: "@",
                iszk: "=",
                obj: "=" 
            },
            templateUrl: 'src/app/tre/zkgl/template/print.html',
            replace: true, 
            transclude: false, 
            controller: ["$scope", function($scope) {
                
            }]
        };
    });