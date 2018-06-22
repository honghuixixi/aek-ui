angular.module('app')
    .controller('meetingAddController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'meetingDbService', 'meetingUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, meetingDbService, meetingUtilService) {
        $scope.$parent.checkLimit('plan', function () {
            $scope.data = {
                server: {

                },
                local: {
                    id: $stateParams.id,
                    isEdit: $stateParams.id ? true : false,
                    record: {
                        theme: '',
                        initiator: '',
                        time: '',
                        place: '',
                        attendee: '',
                        content: '',
                        attachments: []
                    },
                    err: {}
                }
            };

            $scope.methods = {
                changeType: function (item) {
                    $scope.data.local.record.type = item;
                    $scope.methods.removeErr('type');
                },
                uploadFile: function () {
                    angular.element('#meeting-add-upload').click();
                },
                removeFile: function (index) {
                    $scope.data.local.record.attachments.splice(index, 1);
                },
                resetErr: function () {
                    $scope.data.local.err = {
                        theme: '',
                        initiator: '',
                        time: '',
                        place: '',
                        attendee: ''
                    };
                },
                removeErr: function (key) {
                    $scope.data.local.err[key] = '';
                },
                checkParam: function () {
                    var result = true;
                    if ($scope.data.local.record.theme == '') {
                        $scope.data.local.err.theme = '请输入会议主题';
                        result = false;
                    }
                    if ($scope.data.local.record.initiator == '') {
                        $scope.data.local.err.initiator = '请输入发起人';
                        result = false;
                    }
                    if (($scope.data.local.record.time + '').length < 1) {
                        $scope.data.local.err.time = '请选择会议时间';
                        result = false;
                    }
                    if ($scope.data.local.record.place == '') {
                        $scope.data.local.err.place = '请输入会议地点';
                        result = false;
                    }
                    if ($scope.data.local.record.attendee == '') {
                        $scope.data.local.err.attendee = '请输入参会人';
                        result = false;
                    }
                    return result;
                },
                save: function () {
                    if ($scope.methods.checkParam()) {
                        var param = {
                            attendee: $scope.data.local.record.attendee,
                            content: $scope.data.local.record.content,
                            files: JSON.stringify($scope.data.local.record.attachments),
                            locale: $scope.data.local.record.place,
                            meetingTime: $scope.data.local.record.time,
                            originator: $scope.data.local.record.initiator,
                            subject: $scope.data.local.record.theme,
                            tenantId: $rootScope.userInfo.tenantId
                        }
                        if ($stateParams.id) { // 编辑记录
                            param.id = +$stateParams.id;
                            if(!$scope.data.local.isSave){
                                $scope.data.local.isSave = true;
                                meetingDbService.editMeeting(param, function (json) {
                                    meetingUtilService.tost('保存成功', function () {
                                        $state.go("meeting.menu.info", {id: param.id, type: 1});
                                    });
                                }, function (msg) {
                                    meetingUtilService.tost(msg, function () {
                                        $state.go("meeting.menu.plan");
                                    })
                                });
                            }
                        } else { // 新增记录
                            if(!$scope.data.local.isSave){
                                $scope.data.local.isSave = true;
                                meetingDbService.addMeeting(param, function (json) {
                                    meetingUtilService.tost('保存成功', function () {
                                        $state.go("meeting.menu.plan");
                                    });
                                }, function (msg) {
                                    meetingUtilService.tost(msg, function () {
                                        $state.go("meeting.menu.plan");
                                    })
                                });
                            }
                        }
                    }
                },
                setDatepicker: function (st) {
                    meetingUtilService.setDatepicker('#meeting-add-time', st, null, null, null, function (b) {
                        $scope.data.local.record.time = new Date(b.startDate).getTime();
                        $scope.methods.removeErr('time');
                        $scope.$apply();
                    }, null, true);
                }
            };

            $scope.init = function () {
                if ($stateParams.id) {
                    meetingDbService.getMeetingInfo($stateParams.id, function (json) {
                        $scope.data.local.record = {
                            theme: json.subject,
                            initiator: json.originator,
                            time: json.meetingTime,
                            place: json.locale,
                            attendee: json.attendee,
                            content: json.content,
                            attachments: JSON.parse(json.files)
                        };
                        $('#meeting-add-time').val((new Date(json.meetingTime)).Format('yyyy-MM-dd hh:mm'));
                        $scope.$apply();
                        $scope.methods.setDatepicker(new Date(json.meetingTime));
                    });
                } else {
                    setTimeout(function () {
                        $scope.methods.setDatepicker(new Date());
                    }, 200);
                }
                // 文件上传
                meetingUtilService.bindUploadEvent('#meeting-add-upload', 10, meetingUtilService.tost, function (obj) {
                    $scope.data.local.record.attachments.push({ fileName: obj.fileName, fileUrl: obj.uploadUrl });
                    $scope.$apply();
                });
            };

            $scope.init();
        })
    }]);