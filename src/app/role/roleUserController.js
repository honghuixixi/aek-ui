'use strict';

angular.module('app')

.controller('roleUserController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
    $rootScope.userOr = true;
    $rootScope.currentmodule = "角色管理";
    $rootScope.sections = {
        model: false,
        child: true,
        operate: false,
        user: false
    };

    $scope.roleTitle = "角色管理";
    $scope.orgList = "/浙江省人民医院/浙江省人民医院附属2院";

    $scope.nocontent = false;
    $scope.onloading = false;
    $scope.userGet = function (status){
        $scope.onloading = true;
        $.ajax({
            type:'get',
            url:'/sys/roleUser/role/'+$stateParams.roleId,
            data:{status:status},
            contentType:'application/json;charset=UTF-8',
            complete:function (res) {
                $scope.onloading = false;
                if(res.responseJSON.code == 200){
                    $scope.tdData=res.responseJSON.data;
                    $scope.nocontent=false;
                    if(!$scope.tdData.length){
                        $scope.nocontent=true;
                    }
                    $rootScope.$apply();
                }
            }
        });
    }
    $scope.userGet('');


    $scope.lookDetail = function (td) {
        var url = $state.href('usermain.detail.roleset',{userId:td.id});
        window.open(url, '_blank');
    }





    $scope.optionList = false;

    $scope.alertChildCon = false;
    $scope.orgId = 235;
    $scope.orgName = "浙江省第一人民医院";
    $scope.layerImg = "../../../res/img/wh.png";
    $scope.operate = ["删除","停用"];
    $scope.orgOperate = "停用";
    $scope.tips = ["删除机构后,下级机构将一并删除且无法恢复，请谨慎操作！","停用机构将导致机构对应后台用户均不可登陆，该机构及下级机构后台页面不可访问，请谨慎操作。"];
    $scope.orgTip = "停用机构将导致机构对应后台用户均不可登陆，该机构及下级机构后台页面不可访问，请谨慎操作。";
    
    $scope.stateList = false;
    $scope.typeList = false;
    $scope.operateList = false;
    $scope.typeModel = '角色类型';
    $scope.stateModel = '全部状态';
    $scope.operateModel = '更多操作';
    $scope.option = function(list,value,item){
        $rootScope.fixWrapShow = false;
        $scope[list] = false;
        $scope[value] = item.name;
        $scope.userGet(item.value);
    }
    $scope.alertLayer = function(i,item,n){
        $rootScope.fixWrapShow = false;
        $scope['operateList'+i] = false;
        $scope.alertChildCon = true;
        $scope.orgOperate = $scope.operate[n];
        $scope.orgTip = $scope.tips[n];
        $scope.orgId = item.id;
        $scope.orgName = item.name;
        if(n)$scope.layerImg = "../../../res/img/icon20.png";
        else $scope.layerImg = "../../../res/img/wh.png";
        var index=layer.open({
            time: 0 //不自动关闭
            ,type: 1
            ,content: $('#alertOrgChild')
            ,title: ['提示','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
            ,closeBtn: 1
            ,shade: 0.3
            ,shadeClose: true
            ,btn: 0
            ,area: ['540px','287px']
        });
    }
    $scope.showMoreOpt = function(i){
        $scope.menuHide();
        $scope['operateList'+i]=!$scope['operateList'+i];
        $rootScope.fixWrapShow = true;
    }
    $scope.listShow = function(str){
        if($rootScope.fixWrapShow)
        return $scope.menuHide();
        $scope[str]=true;
        $rootScope.fixWrapShow = true;
    }
    /*遮罩*/
    $rootScope.fixWrapShow = false;
    $scope.menuHide = function(){
        $rootScope.fixWrapShow = false;

        $scope.stateList = false;
        $scope.typeList = false;
        $scope.operateList = false;

        for (var i = 0,len=$scope.tdData.length; i < len; i++) {
            $scope['operateList'+i] = false;
        };
    }
    $scope.optionType = [
        {name:'预设角色'},
        {name:'自定义'}
    ];
    $scope.optionState = [
        {name:'全部状态',value:''},
        {name:'停用',value:false},
        {name:'启用',value:true}
    ];
    $scope.tdData = [];
}]);