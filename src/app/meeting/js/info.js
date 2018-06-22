angular.module('app')
    .controller('meetingInfoController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'meetingDbService', 'meetingUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, meetingDbService, meetingUtilService) {
        $scope.$parent.checkLimit($stateParams.type == 1 ? 'plan' : 'archives', function () {
            $scope.data = {
                server: {},
                local: {
                    type: $stateParams.type
                }
            };

            $scope.methods = {
                disPrint: function () {
                    meetingUtilService.openDialog("打印培训单", $("#meeting-plan-print"), ['800px', '550px'], ['打印', '关闭'], function (index) {
                        $scope.data.server.showDownload = false;
                        $scope.$apply();
                        $("#meeting-plan-print").jqprint();
                        $scope.data.server.showDownload = true;
                        $scope.$apply();
                    });
                },
                edit: function () {
                    $state.go('meeting.menu.add', {id: $stateParams.id});
                },
                del: function () {
                    meetingUtilService.openDialog('提示', $('#meetDelTpl'), ['480px','230px'], null, function (index) {
                        layer.close(index);
                        meetingDbService.deleteMeeting($stateParams.id, function (json) {
                            meetingUtilService.tost('删除成功', function () {
                                $state.go('meeting.menu.plan');
                            });
                        }, function (msg) {
                            meetingUtilService.tost(msg, function () {
                                $state.go('meeting.menu.plan');
                            });
                        });
                    });
                }
            };

            $scope.init = function () {
                meetingDbService.getMeetingInfo($stateParams.id, function (json) {
                    json.files = JSON.parse(json.files);
                    $scope.data.server = json;
                    $scope.data.server.showDownload = true;
                    $scope.$apply();
                });
            };

            $scope.init();
        })
    }]);