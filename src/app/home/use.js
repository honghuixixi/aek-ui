angular.module('app')
    .controller('useController', [ '$rootScope', '$scope', '$http', '$state','$localStorage','$sessionStorage','$stateParams',
        function($rootScope, $scope, $http, $state,$localStorage,$sessionStorage,$stateParams) {
            $rootScope.currentmodule = "平台首页";
            $rootScope.membernav=false;
            $scope.orgId = $stateParams.tenantId;
            $scope.initPage=function(){
                $rootScope.userInfo = $localStorage.userInfo
                $scope.sum=0
                var length=$rootScope.userInfo.modules.length
                for(var j=0;j<length;j++){
                    if($rootScope.userInfo.modules[j].moduleGroup==1){
                        $scope.sum++
                    }
                }
                // 如果有置顶应用
                if($scope.sum>=1){
                    $scope.hint=false
                    $scope.topuse=true
                    $scope.top=false
                }else{
                    $scope.hint=true
                    $scope.topuse=false
                }
            }
          	$.ajax({
                url: '/oauth/cache/permission/list',
                async:false,
                data:{tenantId:$stateParams.tenantId},
                type: 'post'
            }).then(function(res) {
                var oldOrgs = $localStorage.userInfo.orgs;
                var oldTenantName = $localStorage.userInfo.tenantName;
                var oldTenantId = $localStorage.userInfo.nowOrgId;
                $sessionStorage.currentPageTenantId=$stateParams.tenantId;
                
                $localStorage.userInfo = res;
                $sessionStorage.userInfo = res;
                $localStorage.userInfo.orgs = oldOrgs;
                $localStorage.userInfo.tenantName = oldTenantName;
                $localStorage.userInfo.nowOrgId = oldTenantId;
                $localStorage.userInfo.nowOrgType = $localStorage.userInfo.tenantType;
                $rootScope.userInfo = $localStorage.userInfo;
                if($rootScope.userInfo && !$rootScope.userInfo.authoritiesStr) {
                    $rootScope.userInfo.authoritiesStr = '';
                }
                $rootScope.meau = $rootScope.userInfo.modules.length ? true : false;
                $scope.initPage();
                // $rootScope.$apply();
            })
          	
          	
            

            //完善机构暂时去掉，目前无此功能
            $scope.chahao=false;

            $scope.nottop=false
            $scope.toggle=true
            $scope.sum=0;
            $scope.modules=true
            // $scope.top=true
            $rootScope.orgList = [{name:"123"}]
            // 如果模块空的
            if($rootScope.userInfo&&$rootScope.userInfo.modules.length){
                $scope.modules=true
            }else{
                $scope.modules=false
            }
            $scope.hidden=function(){
                $scope.chahao=false;
                angular.element('.wrap-head').css('height','85%');
            }
            $scope.addclick=function(){
                $scope.hint=false;
                $scope.topuse=true;
                $scope.nottop=true;
                $scope.toggle=false;
                $scope.top=true
            }
            $scope.remove=function($event,id){
                $scope.sum=0
                            var length=$rootScope.userInfo.modules.length
                            for(var j=0;j<length;j++){
                                if($rootScope.userInfo.modules[j].moduleGroup==1){
                                   $scope.sum++
                                }
                            }
                            if($scope.sum>7){
                                return;
                            }
                for(var i = 0 ;i<$localStorage.userInfo.modules.length;i++){
                    if($localStorage.userInfo.modules[i].moduleId == id){
                        $localStorage.userInfo.modules[i].moduleGroup = 1;
                    }
                }
                // $scope.sum+=1
                // // 点击下面，上面显示对应的index
                // angular.element('.over li').eq(angular.element($event.target).parent().parent('li').index()).css('display','inline-block')
                // angular.element($event.target).parent().parent('li').css('display','none');
                // if($scope.sum>=8){
                //     $scope.nottop=false
                // }
            }
            $scope.down=function($event,id){
                for(var i = 0 ;i<$localStorage.userInfo.modules.length;i++){
                    if($localStorage.userInfo.modules[i].moduleId == id){
                        $localStorage.userInfo.modules[i].moduleGroup = 2;
                    }
                }
                // $scope.sum-=1
                // angular.element('.down li').eq(angular.element($event.target).parent().parent('li').index()).css('display','inline-block')
                // angular.element($event.target).parent().parent('li').css('display','none');
                // if($scope.sum<8){
                //     $scope.nottop=true
                // }
            }
            $scope.go=function(){
                $state.go('org.add',{id:$rootScope.userInfo.id})
            }

            //模块跳转
            $scope.goModule = function (e) {
                if(!$scope.top && !$scope.nottop){
                    var url = $state.href(e, {
                        tenantId: $stateParams.tenantId,
                        id:$stateParams.tenantId
                    });
                    if(e=='inspection.plan.list'){
                        if($rootScope.userInfo.authoritiesStr.indexOf('QC_TEMPLATE_VIEW') != -1)
                            url = $state.href('inspection.model.list', {
                                tenantId: $stateParams.tenantId,
                                id:$stateParams.tenantId
                            });
                        if($rootScope.userInfo.authoritiesStr.indexOf('QC_PLAN_IMPLEMENT') != -1)
                            url = $state.href('inspection.implement.list', {
                                tenantId: $stateParams.tenantId,
                                id:$stateParams.tenantId
                            });
                        if($rootScope.userInfo.authoritiesStr.indexOf('QC_PLAN_VIEW') != -1)
                            url = $state.href('inspection.plan.list', {
                                tenantId: $stateParams.tenantId,
                                id:$stateParams.tenantId
                            });
                    }
                    window.open(url, '_blank');
                }
            }

            // 保存模块
            $scope.save=function(){
                var saveModel = [];

                for(var i=0;i<$localStorage.userInfo.modules.length;i++){

                    var obj = {
                        moduleId:$localStorage.userInfo.modules[i].moduleId,
                        moduleOrder:i,
                        userId: $rootScope.userInfo.id
                    }
                    if($localStorage.userInfo.modules[i].moduleGroup){
                        obj.moduleGroup = $localStorage.userInfo.modules[i].moduleGroup;
                    }else{
                        obj.moduleGroup = 2;
                    }
                    saveModel.push(obj);
                }

                $.ajax({
                    type: "post",
                    url: "/sys/user_module/sysUserModule/save_all" ,
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify(saveModel),
                    complete: function(res) {
                        if(res.responseJSON.code==200){
                            // 加号消失，变成应用设置
                            $scope.toggle=true;
                            $scope.nottop=false;
                            $scope.top=false;
                            
                            $scope.sum=0
                            var length=$rootScope.userInfo.modules.length
                            for(var j=0;j<length;j++){
                                if($rootScope.userInfo.modules[j].moduleGroup==1){
                                   $scope.sum++
                                }
                            }
                            // 如果有置顶应用
                            if($scope.sum>=1){
                                $scope.hint=false
                                $scope.topuse=true
                                $scope.top=false
                            }else{
                                $scope.hint=true
                                $scope.topuse=false
                            }
                            //$rootScope.$apply();
                            // 提示信息
                            var msg = layer.msg('<div class="toaster"><span>保存成功</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0
                            });
                            $scope.$apply();
                        }
                    }
                })
            }
        } ]);
