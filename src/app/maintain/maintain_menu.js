angular.module('app')
    .directive('maintainSelect', function() {
        return {
            restrict: "E",
            scope: {
                item: "=",
                list: "=",
                change: "="
            },
            templateUrl: 'src/app/maintain/html/directive_select.html',
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
    .directive('maintainPlanInfo', function () {
        return {
            restrict: 'E',
            scope: {
                obj: "=",
                showState: "=",
                showTip: "="
            },
            templateUrl: 'src/app/maintain/html/directive_plan_info.html',
            replace: true,
            transclude: false
        };
    })
    .controller('maintainMenuController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
        $rootScope.currentmodule = "保养管理";
        $scope.data = {
            limit: {
                plan: {
                    hasView: $rootScope.userInfo.authoritiesStr.indexOf('MT_PLAN_MANAGE') != -1,
                    next: 'maintain.menu.implement'
                },
                implement: {
                    hasView: $rootScope.userInfo.authoritiesStr.indexOf('MT_PLAN_IMPLEMENT_MANAGE') != -1,
                    next: 'maintain.menu.template'
                },
                template: {
                    hasView: $rootScope.userInfo.authoritiesStr.indexOf('MT_TEMPLATE_MANAGE') != -1,
                    next: 'maintain.menu.report'
                },
                report: {
                    hasView: $rootScope.userInfo.authoritiesStr.indexOf('MT_REPORT_VIEW') != -1,
                    next: 'home.general'
                }
            },
            menu: ''
        };

        if ($scope.data.limit.plan.hasView) {
            $scope.data.limit.report.next = 'maintain.menu.plan';
        } else if ($scope.data.limit.implement.hasView) {
            $scope.data.limit.report.next = 'maintain.menu.implement';
        } else if ($scope.data.limit.template.hasView) {
            $scope.data.limit.report.next = 'maintain.menu.template';
        }

        $scope.checkLimit = function(key, fun) {
            if ($scope.data.limit[key].hasView) {
                $scope.data.menu = key;
                if (typeof fun === 'function') {
                    fun();
                }
            } else {
                $state.go($scope.data.limit[key].next);
            }
        }
    }])