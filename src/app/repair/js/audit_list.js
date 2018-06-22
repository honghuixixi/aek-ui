angular.module('app')
    .controller('auditListController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', function($rootScope, $scope, $stateParams, $localStorage, $state) {
     $rootScope.currentmodule = "维修管理";
        $scope.tabIndex = 1;//tab切换的index
        $scope.loading = true;//loading加载
        $scope.keywords = '';//关键字
        $scope.pageSize = 16;//每页16条默认
        $scope.orgTypeId = '';//类型的选择id
        $scope.statusId = 1;
        // tab切换的方法
        $scope.tabClick = function(index){
            if(index==1){
                $scope.statusId= 1
            }else{
                $scope.statusId= 4
            }
            $scope.orgType=''
            $scope.orgTypeId=''
            $scope.statusType=''
            $scope.keywords =''
            $scope.devshow1 = false
            $scope.devshow2 = false;
            $scope.tabIndex = index;
            $scope.pageNo = 1;
            $scope.pageSize = 16;
            if($scope.tabIndex == 2){
                $scope.table1(1,$scope.pageSize)
            }else{
                $scope.table2(1,$scope.pageSize)
            }

        }
        // 点击搜索部分
        $scope.hideAll = function() {
            $scope.devshow = false;
            $scope.devshow1 = false;
            $scope.devshow2 = false;
        };
        $scope.focus = function() {
            $scope.hideAll();
            $scope.devshow = true;
            $scope.devshow1 = true;
        };
        $scope.focus2 = function() {
            $scope.hideAll();
            $scope.devshow = true;
            $scope.devshow2 = true;
        };
        // 点击子菜单
        $scope.click = function($event) {
            $scope.devshow = false;
            $scope.devshow1 = false;
            $scope.orgType = $($event.target).html();//费用类型
            $scope.orgTypeId = $($event.target).attr('data-id');//费用类型的id
            if($scope.tabIndex == 2){
                $scope.table1(1,$scope.pageSize)
            }else{
                $scope.table2(1,$scope.pageSize)
            }
        };
        $scope.click2 = function($event) {
            $scope.devshow = false;
            $scope.devshow2 = false;
            $scope.statusType = $($event.target).html();//状态类型
            $scope.statusId = $($event.target).attr('data-id');//状态类型的id
            $scope.table1(1,$scope.pageSize)
        };
        $scope.tenantType = [
            {id:'',name:'全部类型'},
            {id: 2,name: '配件采购'},
            {id: 1,name: '外修费用'}];
        $scope.statusListType =[
            {id: 4,name:'全部'},
            {id: 2,name: '审批通过'},
            {id: 3,name: '审批未通过'}
        ]
        // 列表接口我已审批
        $scope.table1 =  function(pageNo,pageSize){
            $.ajax({
                type: 'get',
                url: '/newrepair/bill/approved',
                data: {"pageNo":pageNo,"pageSize":pageSize,"type":$scope.orgTypeId,"status":$scope.statusId,"keyword":$scope.keywords},
                complete: function(res) {
                    var data = res.responseJSON.data
                    $scope.tableList = data.records;
                    $scope.pageInfo = data;
                    $scope.allInfo = $scope.pageInfo.total;
                    $scope.pageInfo.pstyle = 2;
                    $scope.loading = false;
                    if($scope.tableList.length==0){
                        $scope.noData = true
                    }else{
                        $scope.noData = false
                    }
                    $rootScope.$apply();
                }
            })
        };
        // 列表接口待我审批审批
        $scope.table2 =  function(pageNo,pageSize){
            $.ajax({
                type: 'get',
                url: '/newrepair/bill/waitApprove',
                data: {"pageNo":pageNo,"pageSize":pageSize,"type":$scope.orgTypeId,"status":$scope.statusId,"keyword":$scope.keywords},
                complete: function(res) {
                    var data = res.responseJSON.data
                    $scope.tableList = data.records;
                    $scope.pageInfo = data;
                    $scope.allInfo = $scope.pageInfo.total;
                    $scope.pageInfo.pstyle = 2;
                    $scope.loading = false;
                    if($scope.tableList.length==0){
                        $scope.noData = true
                    }else{
                        $scope.noData = false
                    }
                    $rootScope.$apply();
                }
            })
        };
        // 点击搜索
        $scope.search　= function(){
            if($scope.tabIndex == 2){
                $scope.table1(1,$scope.pageSize)
            }else{
                $scope.table2(1,$scope.pageSize)
            }

        };
        // 分页加载
        $scope.pagination = function (page,pageSize) {
            $scope.pageNo = page;
            $scope.pageSize = pageSize;
            if($scope.tabIndex == 2){
                $scope.table1($scope.pageNo,$scope.pageSize)
            }else{
                $scope.table2($scope.pageNo,$scope.pageSize)
            }
        };
        // 首页加载
        $scope.table2(1,$scope.pageSize)
    }]);