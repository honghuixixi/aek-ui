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
    .controller('pmMenuController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
        $rootScope.currentmodule = "PM管理";
        $scope.data = {
            limit: {
                dashbord: {
                    hasView: true,
                    next: 'pm.menu.plan'
                },
                plan: {
                    hasView: $rootScope.userInfo.authoritiesStr.indexOf('PM_PLAN_VIEW') != -1,
                    next: 'pm.menu.implement'
                },
                implement: {
                    hasView: $rootScope.userInfo.authoritiesStr.indexOf('PM_PLAN_IMPLEMENT') != -1,
                    next: 'pm.menu.template'
                },
                template: {
                    hasView: $rootScope.userInfo.authoritiesStr.indexOf('PM_TEMPLATE_VIEW') != -1,
                    next: 'pm.menu.acceptance'
                },
                acceptance: {
                    hasView: $rootScope.userInfo.authoritiesStr.indexOf('PM_CHECK_MANAGE') != -1,
                    next: 'pm.menu.report'
                },
                report: {
                    hasView: $rootScope.userInfo.authoritiesStr.indexOf('PM_REPORT_VIEW') != -1,
                    next: 'home.general'
                }
            },
            menu: ''
        };

        if($scope.data.limit.dashbord.hasView){
            $scope.data.limit.report.next = 'pm.menu.dashbord';
        } else if ($scope.data.limit.plan.hasView) {
            $scope.data.limit.report.next = 'pm.menu.plan';
        } else if ($scope.data.limit.implement.hasView) {
            $scope.data.limit.report.next = 'pm.menu.implement';
        } else if ($scope.data.limit.acceptance.hasView) {
            $scope.data.limit.report.next = 'pm.menu.acceptance';
        }else if ($scope.data.limit.template.hasView) {
            $scope.data.limit.report.next = 'pm.menu.template';
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