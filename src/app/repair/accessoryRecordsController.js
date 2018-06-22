angular.module('app')

    .controller('accessoryRecordsController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
        $scope.localStorageHad=function(){
            if(!$localStorage.userInfo){
                return $state.go('website.home');
            }
        }
        $scope.localStorageHad();
        // 下拉框
        $scope.optionType = [{id:'',name:'全部类型'},{id:1,name:'领用'},{id:2,name:'购买'}];
        $scope.optionTime = [{
            id: '',
            name: '全部时间'
        },{
            id: 1,
            name: '最近七天'
        }, {
            id: 2,
            name: '最近一个月'
        }, {
            id: 3,
            name: '最近三个月'
        }];
        $scope.typeList = false;
        $scope.timeList = false;
        $scope.timeModel = $scope.optionTime[0];
        $scope.typeModel = $scope.optionType[0];
        $scope.assetsDeptName = "";
        $scope.assetsName = '';
        $scope.option = function(list, value, item) {
            $rootScope.fixWrapShow = false;
            $scope[list] = false;
            $scope[value] = item;
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
            $scope.timeList = false;
            $scope.typeList = false;
        }
        // 下拉框 END
        // 分页
        $scope.pageInfo = {
            pages: 3,
            total: 30,
            size: 16,
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
            $scope.nocontent = false;
            var data = {
                pageNo: page||$scope.pageInfo.current,
                pageSize: size||$scope.pageInfo.size,
                status: $scope.typeModel.id,
                orderByField: 'operation_time',
                isAsc: false,
                partName: $scope.kindName,
                tenantId: $stateParams.tenantId||$localStorage.userInfo.tenantId
                // status: 0 //启用状态（0未启用 1启用）
            };
            (!data.status)&&(delete data.status);
            $.ajax({
                type: 'get',
                url: '/newrepair/repPartsRecord/search',
                data: data,
                complete: function(res) {
                    $scope.onloading = false;
                    if(res.responseJSON.code == 200) {
                        $scope.accessoryContent = res.responseJSON.data.records;
                        $scope.pageInfo=res.responseJSON.data;
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

