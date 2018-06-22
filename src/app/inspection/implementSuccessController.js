angular.module('app')
    .controller('implementSuccessController', ['$rootScope', '$scope', '$stateParams', '$localStorage', 'implementService', function($rootScope, $scope, $stateParams, $localStorage, implementService) {
        // 页面数据
        $scope.data = implementService.data(3);
        $scope.data.reportType = 1;
        // 巡检实施id
        $scope.id = 0;

        // 分页
        $scope.pageInfo = implementService.pageInfo();

        // 分页
        $scope.pagination = function(page, pagesize) {
            implementService.getList2($scope, page, pagesize);
        };

        // tab页切换
        $scope.changeConType = function(type) {
            $scope.data.conType = type;
        }

        $scope.changeReportType = function (type) {
            $scope.data.reportType = type;
        };

        // 打印预览
        $scope.showPrint = implementService.showPrintResult($scope, implementService.layerStyle);

        // 页面初始化
        $scope.data.id = +$stateParams.planId;
        $scope.id = +$stateParams.id;
        implementService.getDetailImplement($scope, +$stateParams.id);
        implementService.getTemplate($scope, +$stateParams.planId, function() {
            implementService.getList2($scope, $scope.pageInfo.current, $scope.pageInfo.size);
        });
        implementService.getPrintResult($scope, $scope.id, function () {
            $scope.data.plan.condition = $scope.data.print.condition;
            $scope.data.plan.analysis = $scope.data.print.analysis;
            $scope.data.plan.suggestion = $scope.data.print.suggestion;
        });
    }]);