angular.module('app')
    .controller('trainingAddController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'trainingDbService', 'trainingUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, trainingDbService, trainingUtilService) {
        $scope.$parent.checkLimit('plan', function () {
            $scope.data = {
                server: {

                },
                local: {
                    id: $stateParams.id,
                    isEdit: $stateParams.id ? true : false,
                    types: [
                        { id: 1, name: '岗位基础培训' },
                        { id: 2, name: '设备操作培训' },
                        { id: 3, name: '科室业务培训' },
                        { id: 4, name: '继续教育' }
                    ],
                    record: {
                        theme: '',
                        type: { id: 0, name: '请选择' },
                        time: '',
                        teacher: '',
                        place: '',
                        obj: '',
                        content: '',
                        attachments: []
                    },
                    err: {},
                    isSave: false
                }
            };

            $scope.methods = {
                changeType: function (item) {
                    $scope.data.local.record.type = item;
                    $scope.methods.removeErr('type');
                },
                uploadFile: function () {
                    angular.element('#training-add-upload').click();
                },
                removeFile: function (index) {
                    $scope.data.local.record.attachments.splice(index, 1);
                },
                resetErr: function () {
                    $scope.data.local.err = {
                        theme: '',
                        type: '',
                        time: '',
                        teacher: '',
                        place: '',
                        obj: ''
                    };
                },
                removeErr: function (key) {
                    $scope.data.local.err[key] = '';
                },
                checkParam: function () {
                    var result = true;
                    if($scope.data.local.record.theme == ''){
                        $scope.data.local.err.theme = '请输入培训主题';
                        result = false;
                    }
                    if($scope.data.local.record.type.id < 1){
                        $scope.data.local.err.type = '请选择培训类型';
                        result = false;
                    }
                    if(($scope.data.local.record.time + '').length < 1){
                        $scope.data.local.err.time = '请选择培训时间';
                        result = false;
                    }
                    if($scope.data.local.record.teacher == ''){
                        $scope.data.local.err.teacher = '请输入培训讲师';
                        result = false;
                    }
                    if($scope.data.local.record.place == ''){
                        $scope.data.local.err.place = '请输入培训地点';
                        result = false;
                    }
                    if($scope.data.local.record.obj == ''){
                        $scope.data.local.err.obj = '请输入培训对象';
                        result = false;
                    }
                    return result;
                },
                save: function () {
                    if($scope.methods.checkParam()){
                        var param = {                            
                            content: $scope.data.local.record.content,
                            files: JSON.stringify($scope.data.local.record.attachments),
                            lecturer: $scope.data.local.record.teacher,
                            locale: $scope.data.local.record.place,
                            subject: $scope.data.local.record.theme,
                            target: $scope.data.local.record.obj,
                            trainTime: $scope.data.local.record.time,                            
                            type: $scope.data.local.record.type.id,
                            tenantId: $rootScope.userInfo.tenantId
                        }
                        if ($stateParams.id) { // 编辑记录
                            param.id = +$stateParams.id;
                            if(!$scope.data.local.isSave){
                                $scope.data.local.isSave = true;
                                trainingDbService.editTraining(param, function (json) {
                                    trainingUtilService.tost('保存成功', function () {
                                        $state.go("training.menu.info", {id: param.id, type: 1});
                                    });
                                }, function (msg) {
                                    trainingUtilService.tost(msg, function () {
                                        $state.go("training.menu.plan");
                                    })
                                });
                            }
                        } else { // 新增记录
                            if(!$scope.data.local.isSave){
                                $scope.data.local.isSave = true;
                                trainingDbService.addTraining(param, function (json) {
                                    trainingUtilService.tost('保存成功', function () {
                                        $state.go("training.menu.plan");
                                    });
                                }, function (msg) {
                                    trainingUtilService.tost(msg, function () {
                                        $state.go("training.menu.plan");
                                    })
                                });
                            }
                        }
                    }
                },
                setDatepicker: function (st) {
                    trainingUtilService.setDatepicker('#training-add-time', st, null, null, null, function (b) {
                        $scope.data.local.record.time = new Date(b.startDate).getTime();
                        $scope.methods.removeErr('time');
                        $scope.$apply();
                    }, null, true);
                },
                getTypeName: function (id) {
                    var list = $scope.data.local.types;
                    for(var i=0,len=list.length; i<len; i++) {
                        if(list[i].id == id) {
                            return list[i];
                        }
                    }
                    return { id: 0, name: '请选择' };
                }
            };

            $scope.init = function () {
                if ($stateParams.id) {
                    trainingDbService.getTrainingInfo($stateParams.id, function (json) {
                        $scope.data.local.record = {
                            theme: json.subject,
                            type: $scope.methods.getTypeName(json.type),
                            time: json.trainTime,
                            teacher: json.lecturer,
                            place: json.locale,
                            obj: json.target,
                            content: json.content,
                            attachments: JSON.parse(json.files)
                        };
                        $('#training-add-time').val((new Date(json.trainTime)).Format('yyyy-MM-dd hh:mm'));
                        $scope.$apply();
                        $scope.methods.setDatepicker(new Date(json.trainTime));
                    });
                } else {
                    setTimeout(function () {
                        $scope.methods.setDatepicker(new Date());
                    }, 200);
                }
                // 文件上传
                trainingUtilService.bindUploadEvent('#training-add-upload', 10, trainingUtilService.tost, function (obj) {
                    $scope.data.local.record.attachments.push({ fileName: obj.fileName, fileUrl: obj.uploadUrl });
                    $scope.$apply();
                });
            };

            $scope.init();
        })
    }]);