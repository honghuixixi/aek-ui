angular.module('app')
    .controller('maintainImplementSuccessController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'maintainDbService', 'maintainUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, maintainDbService, maintainUtilService) {
        $scope.$parent.checkLimit('implement', function() {
            $scope.data = {
                implement: {},
                report: {}
            };

            // 获取实施内容
            $scope.getImplementInfo = function() {
                maintainDbService.getImplementResult($stateParams.id, function(data) {
                    data.files = data.files || [];
                    for(var i=0,len=data.files.length; i<len; i++){
                        data.files[i].filePath = encodeURI(encodeURI('/api/download?path=' + data.files[i].filePath));
                    }
                    data.enable = 3;
                    $scope.data.implement = data;
                    $scope.$apply();
                })
            };

            // 打印实施报告
            $scope.print = function() {
                maintainDbService.getPlanReport($stateParams.id, $scope, maintainUtilService, '查看');
            };


            // 页面初始化
            $scope.getImplementInfo()
        })
    }]);