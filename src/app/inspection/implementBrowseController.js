angular.module('app')
    .controller('implementBrowseController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'implementService', function($rootScope, $scope, $stateParams, $localStorage, $state, implementService) {
        $scope.data = implementService.data(1);
        $scope.data.isSave = false;
        // 分页
        $scope.pageInfo = implementService.pageInfo();

        // 分页
        $scope.pagination = function(page, pagesize) {
            implementService.getList($scope, page, pagesize);
        };

        // tab切换
        $scope.changeConType = function(type) {
            $scope.data.conType = type;
        }

        // 开始巡检
        $scope.doImplement = function() {
            $scope.data.isSave = true;
            layer.open({
                title: ["提示", implementService.layerStyle],
                content: "<div style='text-align:center;'><img src='../../../res/img/wh.png' style='margin-bottom:20px;'><p style='font-size:14px;'>确定要开始巡检吗</p></div>",
                area: ['450px', '220px'],
                btn: ['确定', '取消'],
                yes: function(index, layero) {
                    if($scope.data.isSave){
                        $scope.data.isSave = false;
                        var result = $scope.getStatus();
                        result.id = $scope.data.id;
                        implementService.startImplement(result, function() {
                            layer.close(index);
                            $state.go('inspection.implement.execute', { id: $scope.data.id });
                        }, function(msg, code) {
                            layer.close(index);
                            layer.msg('<div class="toaster"><span>' + msg + '</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0,
                                end: function () {
                                    if(code === 'Q_010'){
                                        $state.go('inspection.implement.list', {tenantId: $stateParams.tenantId || $localStorage.userInfo.tenantId});
                                    }else if(code === 'Q_006'){
                                        $state.go('inspection.implement.execute', {id: $scope.data.id});
                                    }
                                }
                            });
                        });
                    }
                }
            });

        };

        // 打印预览
        $scope.showPrint = implementService.showPrint($scope, implementService.layerStyle);

        // 页面初始化
        implementService.init($scope, +$stateParams.id, null, function (data) {
            if(data.status && data.status > 1){
                $state.go('inspection.implement.execute', {id: $scope.data.id});
            }
        });

        // 获取答案状态和默认答案
        $scope.getStatus = function() {
            var status = 2,
                list = $scope.data.templates,
                item = null,
                options = null,
                hasDefault = false,
                answer = {};
            if (list && list.length) {
                status = 2;
                for (var i = 0, len = list.length; i < len; i++) {
                    item = list[i].projects;
                    hasDefault = false
                    if(item && item.length){
                        for(var j=0,len2=item.length; j<len2; j++){
                            if(item[j].isDefault){
                                hasDefault = true;
                                answer[list[i].id] = item[j]; 
                                break;
                            }
                        }
                    }
                    if(!hasDefault){
                        status = 1;
                    }
                }
            }
            return {resultStatus: status, answers: JSON.stringify(answer)};
        }
    }]);