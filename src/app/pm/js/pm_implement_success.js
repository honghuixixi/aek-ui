angular.module('app')
    .controller('pmImplementSuccessController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'pmDbService', 'pmUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, pmDbService, pmUtilService) {
        $scope.$parent.checkLimit('implement', function() {
            $scope.data = {
                implement: {
                    no: '',
                    name: '',
                    model: '',
                    departmentName: '',
                    cycle: 0, // PM周期
                    level: 1, // PM等级
                    directorName: '',
                    createTime: 0, // 创建时间（时间戳）
                    prevDate: 0, // 上次实施日期（时间戳）
                    nextDate: 0, // 下次实施日期（时间戳）
                    equipmentStatus: '',
                    actualStartDate: 0, // 实际开始日期（时间戳）
                    actualEndDate: 0, // 实际结束日期（时间戳）
                    template: [],
                    reportNo: '',
                    live: 0, //设备现状1：正常工作 2：小问题不影响使用 3：有故障需要维修 4：不能使用
                    workTime: 0, //工时
                    files: [0],
                    remarks: ''
                },
                report: {}
            };

            // 获取实施内容
            $scope.getImplementInfo = function() {
                pmDbService.getImplementInfo($stateParams.id, function(data) {
                    data.files = data.files || [];
                    for(var i=0,len=data.files.length; i<len; i++){
                        data.files[i].url = encodeURI(encodeURI('/api/download?path=' + data.files[i].url));
                    }
                    $scope.data.implement = data;
                    $scope.data.implement.table = pmUtilService.convertToTable(data.items || []);
                    $scope.$apply();
                })
            };

            // 打印实施报告
            $scope.print = function() {
                pmDbService.getPlanReport($stateParams.id, $scope, pmUtilService, '查看');
            };


            // 页面初始化
            $scope.getImplementInfo()
        })
    }]);