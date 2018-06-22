angular.module('app')
    .controller('qualityAuditController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'qualityDbService', 'qualityUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, qualityDbService, qualityUtilService) {
        $scope.$parent.checkLimit('audit', function () {
            $scope.data = {
                server: {
                    list: []
                },
                local: {
                    STATUS: ['暂存', '暂存', '待审核', '审核通过', '审核未通过','已撤销'],
                    typeOptions: [
                        { id: 0, name: '全部' },
                        { id: 2, name: '待审核' },
                        { id: 3, name: '审核通过' },
                        { id: 4, name: '审核未通过' }
                    ],
                    statusParam: $stateParams.status || 0
                }
            };
        });
    }]);