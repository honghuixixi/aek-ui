angular.module('app')

    .controller('treeDetailController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
        $rootScope.currentmodule = "监管树";
        $rootScope.tenantId=$stateParams.tenantId;
        $scope.index = 0;
        $scope.statusId = '';
        $scope.statusArr=[
            {id:'',name:'全部状态'},
            {id:8,name:'验收通过'},
            {id:1,name:'在库'},
            {id:2,name:'在用'},
            {id:4,name:'维修中'},
            {id:6,name:'已报废'},

        ];
        // 获取状态
        $scope.getStatus=function(){
            $.ajax({
                type: "get",
                url: "/assets/assetsInfo/getAssetsVerifyStatus",
                complete: function (res) {
                    $scope.statusArr=res.responseJSON.data;
                    for (var i = $scope.statusArr.length - 1; i >= 0; i--) {
                        $scope.statusArr[i].name=$scope.statusArr[i].statusName;
                        $scope.statusArr[i].id=$scope.statusArr[i].status;
                    };
                    $scope.statusArr.unshift({id:'',name:'全部状态'});
                }
            });
        }
        $scope.getStatus();
        $scope.keywords ='';
        $scope.noData = false;
        $scope.loading =true;
        $scope.list = [];
        $scope.pageSize = 16;
        $scope.pageNo = 1;
        $scope.navChange = function (index) {
            $scope.index = index;
            if(index==1){
                $scope.listAjax();
            }
        };
        $scope.msg = '';
        // 点击搜索部分
        $scope.hideAll = function() {
            $scope.devshow = false;
            $scope.devshow1 = false;
        }

        $scope.focus = function() {
            $scope.hideAll();
            $scope.devshow = true;
            $scope.devshow1 = true;
        }

        // 点击子菜单
        $scope.click = function($event) {
            $scope.devshow = false;
            $scope.devshow1 = false;
            $scope.orgType = $($event.target).html();
            $scope.statusId = $($event.target).attr('data-id');
        }
        // 首页加在请求
        $scope.loadAjax = function(){
            $.ajax({
                type: "get",
                url: "/sys/tenant/viewTreeTable/" + $rootScope.tenantId,
                complete: function (res) {
                    if(res.responseJSON.code == 200){
                        $scope.msg = res.responseJSON.data;
                        var customData = res.responseJSON.data.tenant.hplTenant;
                        $scope.category = $scope.getTypeName(customData.category, $localStorage.baseOrg.tenantCategory);
                        $scope.hierarchy = $scope.getTypeName(customData.hierarchy, $localStorage.baseOrg.tenantHierarchy);
                        $scope.grade = $scope.getTypeName(customData.grade, $localStorage.baseOrg.tenantGrade);
                        $rootScope.$apply();
                    }
                }
            })
        };
        //类型处理
        $scope.getTypeName = function(id, arr) {
            if(!arr || arr.length == 0) {
                return;
            }
            for(var i = 0; i < arr.length; i++) {
                if(id == arr[i].id) {
                    return arr[i].name;
                }
            }
        }
        $scope.loadAjax();
        // 列表接口
        $scope.listAjax = function(page, pageSize){
            //console.log($scope.pageSize)
            page = page ? page : 1;
            pageSize = pageSize ? pageSize : 16;
            $.ajax({
                type: "get",
                url: "/assets/assetsInfo/getPageAssets",
                data:{
                    status:$scope.statusId,tenantId:$rootScope.tenantId,'page.size': pageSize,keyword: $scope.keywords,'page.current': page
                },
                complete: function (res) {
                    if(res.responseJSON.code == 200){
                        $scope.loading = false;
                        $scope.list = res.responseJSON.data.records;
                        $scope.pageInfo = res.responseJSON.data;
                        $scope.allInfo = $scope.pageInfo.total;
                        $scope.pageInfo.pstyle = 2;
                        if($scope.list.length==0){
                            $scope.noData = true;
                        }else{
                            $scope.noData = false;
                        }
                        $rootScope.$apply();
                    }
                }
            })
        }
        // 点击搜索
        $scope.search = function(){
            $scope.listAjax();
        };
        // 分页加载
        $scope.pagination = function (page,pageSize) {
            $scope.listAjax(page, pageSize);
        };
    }])


