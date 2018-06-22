angular.module('app')
    .directive('treUploadFile', function() {
        return {
            restrict: "E",
            scope: {                
                fileList: '=',
                state: '=',
                inputId: '@'
            },
            templateUrl: 'src/tpl/treUploadFileTp.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$scope", function($scope) {
                $scope.uploadFile=function(){
                    angular.element('#'+$scope.inputId).click();
                };

                setTimeout(function(){
                    angular.element('#'+$scope.inputId).change(function(e){
                        if(e.currentTarget.files.length){
                            var _size = e.currentTarget.files[0].size/(1024*1024),
                                msg;
                            if(_size>5){
                                angular.element('#'+$scope.inputId).val('');
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
                },100);

                $scope.fileListDel=function(a){
                    $scope.fileList.splice(a,1);
                    angular.element('#'+$scope.inputId).val('');
                };

                $scope.upload=function(a){
                    var formData = new FormData();
                    formData.append("files", a);
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/zuul/api/upload3');
                    // xhr.setRequestHeader("X-AEK56-Token", $localStorage["X-AEK56-Token"]);
                    xhr.send(formData);
                    xhr.onreadystatechange = function () {
                        var res = xhr.response;
                        $scope.imgLoading = false;
                        var resmsg = '网络故障，上传失败，请重试';
                        if(xhr.readyState == 4){
                            if(JSON.parse(res).code == '200'){
                                resmsg='上传成功';
                                $scope.fileList.push(JSON.parse(res).data[0]);
                                $scope.$apply();
                            }
                            var msg = layer.msg('<div class="toaster"><span>' + resmsg + '</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0
                            });
                        }
                    }
                };
            }]
        };
    })
    .directive('repairReportBill', function() {
        return {
            restrict: "E",
            scope: {                
                assetsInfo: '=', // 设备信息
                repairObj: '=', // 维修内容
                radio: '=', // 单选内容
                userInfo: '=', // 用户信息
                repairResultSwitch: '=', // 维修结果
                usualRepairPrint: '=', // 打印按钮
                usualLayerClose: '=', // 关闭弹框
                arrToString1: '=' // 维修内容拼接
            },
            templateUrl: 'src/tpl/repairReportBillTp.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$scope", function($scope) {
                
            }]
        };
    })
    .directive('repairBillDetail', function() {
        return {
            restrict: "E",
            scope: {
                billObj: "=",
                applyListDetail: '='
            },
            templateUrl: 'src/tpl/repairBillDetailTp.html',
            replace: true, // 使用模板替换原始标记 
            transclude: false, // 不复制原始HTML内容 
            controller: ["$scope", function($scope) {
                $scope.billListShow=false;
                $scope.billListChange=function(){
                    $scope.billListShow=!$scope.billListShow;
                };
            }]
        };
    })