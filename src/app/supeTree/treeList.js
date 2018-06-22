angular.module('app')

    .controller('treeListController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
        $rootScope.currentmodule = "监管树";
        $rootScope.userInfo = $localStorage.userInfo;
        $scope.provinceIndex = true;
        $scope.treeIndex = -1;
        $scope.countyIndex = -1;
        $scope.slide = true;
        $scope.countyShow = false;
        $scope.isCounty = false;//是否是县级
        $scope.hospitalArr=[];
        $scope.proShow = false;//是否是省
        $scope.cityShow = false;//是否是市
        $scope.couShow = false;//是否是县
        $scope.prolist = [];
        $scope.coulist = [];
        $scope.loading = true;
        $scope.tenantType = [
            {id:'',name:'选择机构类别'},{
                id: 1,
                name: '医疗机构'
            },{
                id: 2,
                name: '基层医疗卫生机构'
            },{
                id: 3,
                name: '疾病预防控制中心'
            }
        ];
        $scope.pageSize = 16;
        $scope.pageNo = 1;
        $scope.keywords = '';
        $scope.tenantIdnow = '';
        $scope.spaliTndex = false;
        // 点击省份
        $scope.provinceClick = function(){
            $scope.devshow = false;
            $scope.devshow1 = false;
            $scope.orgType = '';
            $scope.keywords = '';
            $scope.orgTypeId = '';
            $scope.pageNo = 1;
            $scope.provinceIndex = true;
            $scope.treeIndex = -1;
            $scope.countyIndex = -1;
            $scope.countyShow = false;
            $scope.table($scope.pageNo,$scope.pageSize,$scope.orgTypeId,$rootScope.userInfo.tenantId,$scope.keywords)
        };
        // 本身是市
        $scope.cityClicks = function(){
            $scope.pageNo = 1;
            $scope.countyIndex = -1;
            $scope.table($scope.pageNo,$scope.pageSize,$scope.orgTypeId,$rootScope.userInfo.tenantId,$scope.keywords)
        };
        // 点击市下边的
        $scope.cityClick = function(index,name,tenantId,place){
            $scope.devshow = false;
            $scope.devshow1 = false;
            $scope.countyIndex = -1;
            $scope.orgType = '';
            $scope.keywords = '';
            $scope.orgTypeId = '';
            $scope.spaliTndex = true;
            $scope.pageNo = 1;
            $scope.countyIndex = -1;
            $scope.placecity = place;
            $scope.provinceIndex = false;
            $scope.treeIndex = index;
            $scope.county = name;
            $scope.countyShow = true;
            $scope.cityId = tenantId;
            $scope.tenantIdnow = tenantId;
            $scope.treeAjax(tenantId);
            $scope.table($scope.pageNo,$scope.pageSize,$scope.orgTypeId,tenantId,$scope.keywords);
            console.log($scope.devshow1)
        };
        // 点击区县下边的
        $scope.countyClick = function(index,name,tenantId,place){
            $scope.devshow = false;
            $scope.devshow1 = false;
            $scope.countyIndex = -1;
            $scope.keywords = '';
            $scope.orgTypeId = '';
            $scope.orgType = '';
            $scope.spaliTndex = false;
            $scope.pageNo = 1;
            $scope.placecounty = place;
            $scope.countyName = name;
            $scope.countyId = tenantId;
            $scope.provinceIndex = false;
            $scope.countyIndex = index;
            $scope.tenantIdnow = tenantId;
            $scope.table($scope.pageNo,$scope.pageSize,$scope.orgTypeId,tenantId,$scope.keywords)
            console.log($scope.devshow1)
        };
        $scope.spali = function(){
            $scope.spaliTndex = true
            $scope.devshow = false;
            $scope.devshow1 = false;
            $scope.orgType = '';
            $scope.countyIndex = -1;
            $scope.keywords = '';
            $scope.orgTypeId = '';
            $scope.pageNo = 1;
            $scope.countyIndex = -1;
            $scope.tenantIdnow = $scope.cityId
            $scope.table($scope.pageNo,$scope.pageSize,$scope.orgTypeId,$scope.cityId,$scope.keywords)
        }
        // 点击搜索部分
        $scope.hideAll = function() {
            $scope.devshow = false;
            $scope.devshow1 = false;
        };

        $scope.focus = function() {
            $scope.hideAll();
            $scope.devshow = true;
            $scope.devshow1 = true;
        };

        // 点击子菜单
        $scope.click = function($event) {
            $scope.devshow = false;
            $scope.devshow1 = false;
            $scope.orgType = $($event.target).html();
            $scope.orgTypeId = $($event.target).attr('data-id');
        };
        // // 点击下方县区域消失
        // $scope.dispaly = function(){
        //     $scope.keywords = '';
        //     $scope.orgTypeId = '';
        //     $scope.orgType = '';
        //     $scope.countyIndex = -1;
        //     $scope.countyShow = false;
        //     $scope.table($scope.pageNo,$scope.pageSize,$scope.orgTypeId,$scope.cityId,$scope.keywords)
        // };

        var ajax = {
            ajax: function (type, url, data, success) {
                var options = {
                    type: type,
                    url: url,
                    complete: function (res) {
                        if(res.responseJSON.code == 200){
                            success(res.responseJSON.data)
                        }else{
                            // todo
                        }
                    }
                };
                if(data){
                    options.data = data;
                }
                $.ajax(options);
            },
            get: function (url, data, success) {
                ajax.ajax('get', url, data, success);
            },
            post: function (url, data, success) {
                ajax.ajax('post', url, data, success);
            },
            del: function (url, data, success) {
                ajax.ajax('delete', url, data, success);
            },
            put: function (url, data, success) {
                ajax.ajax('put', url, data, success);
            },
            getTreeNodes: function (tenantId, success) {
                ajax.get("/sys/tenant/manageTree", {'tenantId':tenantId}, success)
            }
        };

        // 监管树树形图
        $scope.treeAjax = function(tenantId){
            ajax.getTreeNodes(tenantId, function (data) {
                $scope.coulist = data
                $rootScope.$apply();
            });
        };
// 首页的树
        ajax.getTreeNodes($rootScope.userInfo.tenantId, function (data) {
            //检测机构等级[0爱怡康,1为省级医疗装备监管中心,2为市级医疗装备监管机构,3为区/县级医疗装备监管机构]
            if(data[0].parentTenantRank==0){
                $scope.super = true
            }
            if(data[0].parentTenantRank==1){
                $scope.proShow = true;//本身是省级单位
                $scope.prolist = data;
            }
            if(data[0].parentTenantRank==2){
                $scope.cityShow  = true;//本身是市级单位
                $scope.coulist = data;
            }
            if(data[0].parentTenantRank==3){
                $scope.couShow = true;//本身是县级
                $scope.placeName = data[0].placeName
            }
            $rootScope.$apply();
        });
        // table的请求
        $scope.table = function(pageNo,pageSize,category,tenantId,keyword){
            ajax.get('/sys/tenant/manageTreeTable',{"pageNo":pageNo,"pageSize":pageSize,"category":category,"tenantId":tenantId,"keyword":keyword},function (data) {
                $scope.hospitalArr = data.records;
                $scope.pageInfo = data;
                $scope.allInfo = $scope.pageInfo.total;
                $scope.pageInfo.pstyle = 2;
                $scope.loading = false;
                if($scope.hospitalArr.length==0){
                    $scope.noData = true
                }else{
                    $scope.noData = false
                }
                $rootScope.$apply();
            })
        }
        // 首页加载
        $scope.table('',16,'',$rootScope.userInfo.tenantId,'')

        // 点击搜索
        $scope.search = function(){
            // 如果点击的是省传登录的机构id
            $scope.pageNo = 1;
            if($scope.treeIndex == -1 && $scope.countyIndex == -1){
                $scope.table($scope.pageNo,$scope.pageSize,$scope.orgTypeId,$rootScope.userInfo.tenantId,$scope.keywords)
            }else{
                $scope.table($scope.pageNo,$scope.pageSize,$scope.orgTypeId,$scope.tenantIdnow,$scope.keywords)
            }
        }
        // 分页加载
        $scope.pagination = function (page,pageSize) {
            $scope.pageNo = page;
            $scope.pageSize = pageSize;
            if($scope.treeIndex == -1 && $scope.countyIndex == -1){
                $scope.table($scope.pageNo,$scope.pageSize,$scope.orgTypeId,$rootScope.userInfo.tenantId,$scope.keywords)
            }else{
                $scope.table($scope.pageNo,$scope.pageSize,$scope.orgTypeId,$scope.tenantIdnow,$scope.keywords)
            }
        };
        $scope.search();
    }]);


