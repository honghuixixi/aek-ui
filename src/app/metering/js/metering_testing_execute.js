angular.module('app')
    .controller('meteringTestingExecuteController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'meteringDbService', 'meteringUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, meteringDbService, meteringUtilService) {
        $scope.$parent.checkLimit('testing', function () {
            $scope.data = {
                server: {
                    reportId: 0,
                    reportNum: 'JLBG52413523125',
                    report: {}
                },
                local: {
                    isExecute: true,
                    methodOptions: [
                        { id: 0, name: '请选择' }, 
                        { id: 1, name: '院内' }, 
                        { id: 2, name: '外包' }
                    ],
                    typeOptions: [
                        { id: 0, name: '请选择' }, 
                        { id: 1, name: '首次检定' }, 
                        { id: 2, name: '随后检定' }, 
                        { id: 3, name: '使用中检定' }, 
                        { id: 4, name: '周期检定' }, 
                        { id: 5, name: '仲裁检定' }
                    ],
                    resultOptions: [
                        { id: 1, name: '合格' }, 
                        { id: 2, name: '准用' }, 
                        { id: 3, name: '限用' }, 
                        { id: 4, name: '禁用' }
                    ],
                    record: {},
                    err: {}
                },
                showDownload: true,
            };

            $scope.methods = {
                changeMethod: function (item) {
                    $scope.data.local.record.method = item;
                    if (item.id > 0) {
                        $scope.methods.removeErr('method');
                    }
                },
                changeType: function (item) {
                    $scope.data.local.record.type = item;
                    if (item.id > 0) {
                        $scope.methods.removeErr('type');
                    }
                },
                changeResult: function (item) {
                    $scope.data.local.record.result = item;
                },
                checkParam: function (flag, key, msg) {
                    if (!flag) {
                        $scope.data.local.err[key] = msg;
                    }
                    return flag;
                },
                removeErr: function (key) {
                    $scope.data.local.err[key] = '';
                },
                removeFile: function (obj) {
                    var len = $scope.data.local.record.files.length;
                    for(var i=0; i<len; i++){
                        if($scope.data.local.record.files[i].url == obj.url){
                            $scope.data.local.record.files.splice(i, 1);
                            break;
                        }
                    }
                },
                getParam: function () {
                    if ($scope.data.local.record.files.length) {
                        var list = $scope.data.local.record.files;
                        for (var i = 0, len = list.length; i < len; i++) {
                            delete list[i].$$hashKey;
                        }
                    }
                    return {
                        "auditor": $scope.data.local.record.shr,
                        "certificateNum": $scope.data.local.record.zsbh,
                        "checkFee": $scope.data.local.record.jdfy,
                        "checkForm": $scope.data.local.record.type.id,
                        "checkMode": $scope.data.local.record.method.id,
                        "checkOrganization": $scope.data.local.record.jdjg,
                        "checkResultStatus": $scope.data.local.record.result.id,
                        "checkUserName": $scope.data.local.record.jdr,
                        "currentCheckTime": $scope.data.local.record.currentDate,
                        "files": JSON.stringify($scope.data.local.record.files),
                        "msCheckId": +$stateParams.id,
                        "nextCheckTime": $scope.data.local.record.nextDate,
                        "remarks": $scope.data.local.record.remark,
                        "measureAssetsId": $scope.data.server.record.assetsId

                    };
                },
                saveTemp: function () {
                    meteringDbService.saveTepTesting($scope.methods.getParam(), function (json) {
                        meteringUtilService.tost("暂存成功");
                    });
                },
                submit: function () {
                    var flag = $scope.methods.checkParam($scope.data.local.record.method.id > 0, 'method', '请选择实际检定方式');
                    flag = $scope.methods.checkParam($scope.data.local.record.zsbh.length > 0, 'zsbh', '请输入证书编号') && flag;
                    flag = $scope.methods.checkParam(($scope.data.local.record.currentDate + '').length > 0, 'currentDate', '请选择本次检定日期') && flag;
                    flag = $scope.methods.checkParam(($scope.data.local.record.nextDate + '').length > 0, 'nextDate', '请选择下次检定日期') && flag;
                    flag = $scope.methods.checkParam($scope.data.local.record.type.id > 0, 'type', '请选择检定形式') && flag;
                    flag = $scope.methods.checkParam($scope.data.local.record.jdr.length > 0, 'jdr', '请输入检定人') && flag;
                    flag = $scope.methods.checkParam($scope.data.local.record.shr.length > 0, 'shr', '请输入审核人') && flag;
                    if (flag) {
                        meteringDbService.submitTesting($scope.methods.getParam(), function (json) {
                            meteringUtilService.tost("提交成功");
                            $scope.data.server.reportNum = json.checkReportNo;
                            $scope.data.server.reportId = json.id;
                            $scope.data.local.isExecute = false;
                            $scope.$apply();
                        });
                    }
                    console.log($scope.data.local);
                },
                getAndDisReport: function () {
                    meteringDbService.getReport($scope.data.server.reportId, function (json) {
                        json.msCheckResultInfo.files = JSON.parse(json.msCheckResultInfo.files);
                        $scope.data.server.report = json;
                        $scope.data.server.report.showDownload = true;
                        $scope.$apply();
                        meteringUtilService.openDialog("查看计量报告单", $("#template_report"), ['900px', '600px'], ['打印', '关闭'], function (index) {
                            $scope.data.server.report.showDownload = false;
                            $scope.$apply();
                            $("#template_report").jqprint();
                            $scope.data.server.report.showDownload = true;
                            $scope.$apply();
                        });
                    });
                },
                getAssetsTestingInfo: function () {
                    meteringDbService.getAssetsTestingInfo($stateParams.id, function (json) {
                        if (json.msCheck) {
                            $scope.data.server.record = json.msCheck;
                            $scope.data.server.record.attention = json.attention;
                            if (json.msCheckStorage) {
                                $scope.data.local.record = {
                                    method: getOption($scope.data.local.methodOptions, json.msCheckStorage.checkMode),
                                    zsbh: json.msCheckStorage.certificateNum,
                                    currentDate: json.msCheckStorage.currentCheckTime,
                                    nextDate: json.msCheckStorage.nextCheckTime,
                                    type: getOption($scope.data.local.typeOptions, json.msCheckStorage.checkForm),
                                    result: getOption($scope.data.local.resultOptions, json.msCheckStorage.checkResultStatus),
                                    jdjg: json.msCheckStorage.checkOrganization,
                                    jdfy: json.msCheckStorage.checkFee,
                                    jdr: json.msCheckStorage.checkUserName,
                                    shr: json.msCheckStorage.auditor,
                                    remark: json.msCheckStorage.remarks,
                                    files: JSON.parse(json.msCheckStorage.files)
                                };
                            }
                            $scope.$apply();
                        } else {
                            meteringUtilService.tost("计量检测已提交", function () {
                                $state.go("metering.menu.testing");
                            });
                        }
                    });
                }
            };

            $scope.init = function () {
                $scope.data.local.record = {
                    method: { id: 0, name: '请选择' },
                    zsbh: '',
                    currentDate: '',
                    nextDate: '',
                    type: { id: 0, name: '请选择' },
                    result: { id: 1, name: '合格' },
                    jdjg: '',
                    jdfy: '',
                    jdr: '',
                    shr: '',
                    remark: '',
                    files: []
                };
                $scope.data.local.err = {
                    method: '',
                    zsbh: '',
                    currentDate: '',
                    nextDate: '',
                    type: '',
                    jdr: '',
                    shr: ''
                };
                $scope.methods.getAssetsTestingInfo();
                setTimeout(function () {
                    meteringUtilService.setDatepicker('#currentDate', null, null, null, null, function (b) {
                        $scope.data.local.record.currentDate = new Date(b.startDate).getTime();
                        $scope.methods.removeErr('currentDate');
                        $scope.$apply();
                    });
                    meteringUtilService.setDatepicker('#nextDate', null, null, null, null, function (b) {
                        $scope.data.local.record.nextDate = new Date(b.startDate).getTime();
                        $scope.methods.removeErr('nextDate');
                        $scope.$apply();
                    });
                    angular.element('#uploadId').change(function (e) {
                        if (e.currentTarget.files.length) {
                            var _size = e.currentTarget.files[0].size / (1024 * 1024),
                                msg;
                            if (_size > 5) {
                                angular.element('#uploadId').val('');
                                return msg = layer.msg('<div class="toaster"><span>' + '文件大于5M，上传失败' + '</span></div>', {
                                    area: ['100%', '60px'],
                                    time: 3000,
                                    offset: 'b',
                                    shadeClose: true,
                                    shade: 0
                                });
                            }
                            $scope.upload(e.currentTarget.files[0]);
                        }
                    });
                }, 100);
            };

            // 文件上传
            $scope.uploadFile = function () {
                angular.element('#uploadId').click();
            };
            $scope.upload = function (a) {
                var formData = new FormData();
                formData.append("files", a);
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/zuul/api/upload3');
                xhr.send(formData);
                xhr.onreadystatechange = function () {
                    var res = xhr.response;
                    $scope.imgLoading = false;
                    var resmsg = '网络故障，上传失败，请重试';
                    if (xhr.readyState == 4) {
                        if (JSON.parse(res).code == '200') {
                            resmsg = '上传成功';
                            var obj = JSON.parse(res).data[0];
                            $scope.data.local.record.files.push({ name: obj.fileName, url: obj.uploadUrl });//encodeURI(encodeURI('/api/download?path=' + obj.uploadUrl)) });
                            $scope.$apply();
                            angular.element('#uploadId').val('');
                        }
                        meteringUtilService.tost(resmsg);
                    }
                }
            }

            $scope.init();

            $scope.checkNum = function() {
                if (($scope.data.local.record.jdfy + '').length > 0) {
                    var val = parseFloat($scope.data.local.record.jdfy);
                    if (!(val >= 0 && val <= 100000)) {
                        $scope.data.local.record.jdfy = '';
                    }
                }
            };

            function getOption(list, id) {
                var result = {};
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].id == id) {
                        result = list[i];
                        break;
                    }
                }
                return result;
            }
        })
    }]);