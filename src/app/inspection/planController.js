angular.module('app')

    .controller('planController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
        $scope.localStorageHad=function(){
            if(!$localStorage.userInfo){
                return $state.go('website.home');
            }
        }
        $scope.localStorageHad();
        // 新建成功
        $scope.newPlanSuccess=function(){
            if($stateParams.success){
                var msg = layer.msg('<div class="toaster"><span>新建成功</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
            }
        }
        $scope.newPlanSuccess();
        // 下拉框
        $scope.optionType = [{id:0,name:'全部状态'},{id:1,name:'启用'},{id:2,name:'停用'}];
        $scope.typeList = false;
        $scope.typeModel = $scope.optionType[0];
        $scope.option = function(list, value, item) {
            $rootScope.fixWrapShow = false;
            $scope[list] = false;
            $scope[value] = item;
            $scope.pageInfo.current=1;
            $scope.getAccessoryList();
        }
        $scope.listShow = function(str) {
            if($rootScope.fixWrapShow)
                return $scope.menuHide();
            $scope[str] = true;
            $rootScope.fixWrapShow = true;
        }
        $rootScope.fixWrapShow = false;
        $scope.menuHide = function() {
            $rootScope.fixWrapShow = false;
            $scope.typeList = false;
        }
        // 下拉框 END
        // 分页
        $scope.pageInfo = {
            size: 8,
            current: 1
        };
        // 列表
        $scope.nocontent = false;
        $scope.onloading = false;
        $scope.accessoryContent = [];
        $scope.kindName = '';
        clientHeight();
        function clientHeight(){
            var clientHeight=0;
            if(document.body.clientHeight&&document.documentElement.clientHeight)
            {
                clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
            }
            else
            {
                clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
            }
            $('.fy_accessoryWrap').css('min-height',clientHeight-180+'px');
        }
        
        $scope.getAccessoryList = function(page,size){
            $scope.onloading = true;
            $scope.accessoryContent=[];
            $scope.nocontent = false;
            var data = {
                pageNo: page||$scope.pageInfo.current,
                pageSize: size||$scope.pageInfo.size,
                keyword: $scope.kindName,
                status: $scope.typeModel.id,
            };
            (!data.status)&&(delete data.status);
            $.ajax({
                type: 'get',
                url: '/qc/qcPlan/search',
                data: data,
                complete: function(res) {
                    $scope.onloading = false;
                    if(res.responseJSON.code == 200) {
                        $scope.accessoryContent = res.responseJSON.data.records;
                        $scope.pageInfo.total=res.responseJSON.data.total;
                        $scope.pageInfo.pstyle=2;
                        if(!$scope.accessoryContent.length){
                            $scope.nocontent = true;
                        }
                    }
                    $rootScope.$apply();
                }
            });
        }
        $scope.getAccessoryList();
        $scope.pagination = function(page,pageSize){
            $scope.getAccessoryList(page,pageSize);
        }

    }])

