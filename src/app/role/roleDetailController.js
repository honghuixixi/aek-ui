'use strict';

angular.module('app')

.controller('roleDetailController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', "$compile", function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage, $compile) {
    $rootScope.userOr = true;
    $rootScope.currentmodule = "角色管理";

    $rootScope.lookOrEdit = true;
    $scope.defineEditCon = function () {
        $rootScope.lookOrEdit = !$rootScope.lookOrEdit;
        $scope.roleTitle="角色详情-编辑角色权限";
        $rootScope.nocontent = false;
    }

    $scope.roleTitle = "角色详情";
	$rootScope.role = {
		id: 1,
		name: '角色名称',
		status: '启用中',
		using: true,
		orgList: '/浙江省人民医院/浙江省人民医院附属2院',
		createDate: '0000-00-00 00:00',
		createByName: "系统预设",
		type: true
	};
    // del or not
        $.ajax({
            type:'get',
            url:'/sys/roleUser/role/'+$stateParams.roleId,
            data:{status:status},
            contentType:'application/json;charset=UTF-8',
            complete:function (res) {
                if(res.responseJSON.code == 200){
                    var userData=res.responseJSON.data;
                    if(userData.lenth==0){
                        $scope.canDel=true;
                    }else if(hadUse(userData)){
                        $scope.canDel=false;
                    }else{
                        $scope.canDel=true;
                    }
                }
            }
        });
    function hadUse(a){
        for (var i = 0; i < a.length; i++) {
            if(a[i].enable){
                return true;
            }
        };
    }

    function getYMD(t,s) {
        if(s==undefined) s = '-';
        var date = new Date(t);
        var y = date.getFullYear();
        var m = date.getMonth()+1;
        m = m>10?m:('0'+m);
        var d = date.getDate();
        d = d>10?d:('0'+d);
        var h = date.getHours();
        h = h>10?h:('0'+h);
        var min = date.getMinutes();
        min = min>10?min:('0'+min);
        return y+s+m+s+d+'  '+h+':'+min;
    }
    $rootScope.dateScopes = [{name:'所在机构所有数据',id:1}, {name:'所在部门及下级部门数据',id:2}, {name:'所在部门数据',id:3}, {name:'自定义部门',id:4}];
    $scope.menuShow = function(second) {
        for(var i = 0; i < second.permissions.length; i++) {
            if(second.permissions[i].enable) {
                return true;
            }
        };
    }
    $scope.menusNone = function(a){
        for (var i = 0; i < a.length; i++) {
            for(var j = 0; j < a[i].menus.length; j++) {
                if($scope.menuShow(a[i].menus[j])) {
                    return true;
                }
            };
            for(var k = 0; k < a[i].permissions.length; k++) {
                if(a[i].permissions[k].enable) {
                    return true;
                }
            };
        };
    }
    //ajax detail
    $rootScope.nocontent = false;
        $.ajax({
            type:'get',
            url:'/sys/role/query/'+$stateParams.roleId,
            contentType:'application/json;charset=UTF-8',
            complete:function (res) {
                if(res.responseJSON.code == 200){
                    $rootScope.role=res.responseJSON.data;
                    $rootScope.role.delFlag&&($state.go('role.index',{id:$stateParams.id}));
                    !$scope.menusNone($rootScope.role.moduleMenus)&&($rootScope.nocontent = true);
                    $rootScope.role.time = getYMD($rootScope.role.createTime);
                    $rootScope.role.newname = $rootScope.role.name;
                    $rootScope.stateModel = $rootScope.dateScopes[$rootScope.role.dataScope-1];
                    var arr=[];
                    if($rootScope.stateModel.id==4){
                        $rootScope.selDepts = res.responseJSON.data.roleCustom.depts;
                        for (var i=0, l=$rootScope.selDepts.length; i < l; i++) {
                            arr.push($rootScope.selDepts[i].deptName);
                            $rootScope.selDepts[i].id=$rootScope.selDepts[i].deptId;
                            $rootScope.selDepts[i].name=$rootScope.selDepts[i].deptName;
                        };
                    }
                    $rootScope.depts=arr.join(';');

                    $scope.delBtn.info="确定删除角色（"+$rootScope.role.id+"）"+$rootScope.role.name+" 吗？";
                    $scope.stopBtn.info="确定停用角色（"+$rootScope.role.id+"）"+$rootScope.role.name+" 吗？";
                    $rootScope.$apply();
                }
            }
        });

    $scope.stateList = false;
    $scope.typeList = false;
    $scope.operateList = false;
    $scope.typeModel = '角色类型';
    $scope.operateModel = '更多操作';
    $scope.stopBtn = {
        tip: "停用角色后，拥有该角色身份的用户将无法使用被停用角色所包含的权限。请谨慎操作！",
        img: "../../../res/img/wh.png",
        info: "确定停用角色（235）xxx模块管理员 吗？",
        btn: {yes:{name:'确定',id:1},no:{name:'取消',id:0},type:1},
        id: "alertRoleStop",
        height: "287px"
    };
    $scope.delBtn = {
        tip: "",
        img: "../../../res/img/wh.png",
        info: "确定删除角色（23）xxx管理员吗？",
        btn: {yes:{name:'确定',id:1},no:{name:'取消',id:0},type:0},
        id: "alertRoleDel",
        height: "250px"
    };
    $scope.failBtn = {
        tip: "",
        img: "../../../res/img/icon23.png",
        info: "该角色下还有启用中的用户，请勿删除。",
        btn: {yes:{name:'确定',id:1},no:{name:'确定',id:0},type:2},
        id: "alertRoleDelNot",
        height: "250px"
    };
    $scope.editBtn = {
        tip: "",
        img: "",
        info: "",
        btn: {yes:{name:'确定',id:1},no:{name:'取消',id:0}},
        id: "alertRoleEdit",
        height: "227px"
    };
    $scope.useRole=function(){
        $.ajax({
            type:'put',
            url:'/sys/role/recover/'+$stateParams.roleId,
            contentType:'application/json;charset=UTF-8',
            complete:function (res) {
                if(res.responseJSON.code == 200){
                    $state.go('role.detail.power',null,{reload: true});
                    var msg = layer.msg('<div class="toaster"><span>启用成功</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                }
            }
        });
    }
    $scope.editRoleClose=function(n){
    	
    	
        if(!n) {
        	layer.closeAll();
        	return;
        }
        if(!$('.roleName').val()) return;/* $('.roleName').focus();*/
        layer.closeAll();
        var checked = $('.roleDetailSectionContent input:checked');
        var arr = [];
        for(var i = 0; i < checked.length; i++) {
            arr.push(checked.eq(i).attr('data-mid'));
        }
        var data = {
                "dataScope":$scope.role.dataScope,
                "id":$stateParams.roleId,
                "isEditName": true,
                "name":$('.roleName').val(),
                "permissionIds": arr,
                "tenantId":$localStorage.userInfo.tenantId,
                "updateBy": $localStorage.userInfo.id
            };
        $.ajax({
            type:'put',
            url:'/sys/role/update',
            data:JSON.stringify(data),
            contentType:'application/json;charset=UTF-8',
            complete:function (res) {
                if(res.responseJSON.code == 200){
                    $state.go('role.detail.power',null,{reload: true});
                }
            }
        });
    }
    $scope.alertRoleClose=function(a,b){
        layer.closeAll();
        if(!a) return;
        if(b==2) return;
        var type,op,para;
        if(b==1){
            op='stop';
            type='put';
            para="?isForced=true";
        }else{
            if($scope.canDel){
                op='delete';
                para='';
                type='delete';
            }else{
                return $scope.alertLayer($scope.failBtn);
            }
            
        }
        $.ajax({
            type:type,
            url:'/sys/role/'+op+'/'+$stateParams.roleId+para,
            contentType:'application/json;charset=UTF-8',
            complete:function (res) {
                if(res.responseJSON.code == 200){
                    if(op=='stop'){
                        $state.go('role.detail.power',null,{reload: true});
                    }
                    else{
                        $state.go('role.index',{id:$stateParams.id});
                    }
                }else if(res.responseJSON.code=='R_005'){
                    layer.closeAll();
                    // $scope.alertLayer($scope.failBtn,2);
                    var obj = $scope.failBtn;
                    var content = $('#'+obj.id);
                    $scope.alertRoleTip = obj.tip;
                    $scope.alertRoleImg = obj.img;
                    $scope.alertRoleBtn = obj.btn;
                    $scope.alertRoleInfo = obj.info;
                    $scope.alertRoleEdit = obj.eidt;
                    $rootScope.$apply();
                    var index=layer.open({
                        time: 0 //不自动关闭
                        ,type: 1
                        ,content: content
                        ,title: ['提示','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                        ,closeBtn: 1
                        ,shade: 0.3
                        ,shadeClose: true
                        ,btn: 0
                        ,area: ['540px',obj.height]
                        ,success: function(){
                            $rootScope.$apply();
                        }
                    });
                }
            }
        });
    }
    $scope.canDel = false;
    $scope.alertLayer = function(obj){
        if(obj.btn.type==0 && !$scope.canDel){
            obj = $scope.failBtn;
        }
        var content = $('#'+obj.id);

        $scope.alertRoleTip = obj.tip;
        $scope.alertRoleImg = obj.img;
        $scope.alertRoleBtn = obj.btn;
        $scope.alertRoleInfo = obj.info;
        $scope.alertRoleEdit = obj.eidt;
        $scope.isEditName=obj.id=='alertRoleEdit'?'编辑名称':'提示';
        var index=layer.open({
            time: 0 //不自动关闭
            ,type: 1
            ,content: content
            ,title: [$scope.isEditName,'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
            ,closeBtn: 1
            ,shade: 0.3
            ,shadeClose: true
            ,btn: 0
            ,area: ['540px',obj.height]
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
        {name:'停用'},
        {name:'启用'}
    ];
    $scope.tdData = [
        {
        "id": 23,
        "name": "角色管理模块管理员",
        "presetId": 6,
        "descript": "角色管理模块所有可用权限\r\n",
        "userCount": 0
      },
      {
        "id": 24,
        "name": "机构管理模块管理员",
        "presetId": 7,
        "descript": " 机构管理模块所有可用权限",
        "userCount": 0,
        "stop": true
      },
      {
        "id": 25,
        "name": "字典表管理模块管理员",
        "presetId": 8,
        "descript": "字典表管理模块所有可用权限",
        "userCount": 0
      }
    ];
}]);