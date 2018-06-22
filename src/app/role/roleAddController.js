'use strict';

angular.module('app')

.controller('roleAddController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
    $rootScope.userOr = true;
    $rootScope.currentmodule = "角色管理";

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
    $scope.stateModel = {name:'所在机构所有数据',id:1};
    $scope.operateModel = '更多操作';
    $scope.option = function(list,value,item){
        $rootScope.fixWrapShow = false;
        $scope.selfDeptShow=false;
        $scope[list] = false;
        $scope[value] = item.name;
        $scope.stateModel = item;
        (item.id!=4)&&($scope.depts='');
        (item.id==4)&&$scope.addSelfDept();
    }
    //ajax detail
        $.ajax({
            type:'get',
            url:'/sys/role/baseRole/'+($stateParams.id||$localStorage.userInfo.tenantId||1),
            contentType:'application/json;charset=UTF-8',
            complete:function (res) {
                if(res.responseJSON.code == 200){
                    $rootScope.role=res.responseJSON.data;
                    $rootScope.$apply();
                }
            }
        });
    // input check
    $scope.inputSelect = function(second,$event){
        var allCheck=$('#check'+second.menuId);
        allCheck[0].checked=true;
        if(!allCheck.parents('.menuList').next().find('input:checked').length){
            allCheck[0].checked=false;
        }
    }
    $scope.inputAllSelect=function(second){
        var allCheck=$('#check'+second.menuId);
        var input = allCheck.parents('.menuList').next().find('input');
        var val = allCheck[0].checked;
        for (var i = 0; i < input.length; i++) {
            input.eq(i)[0].checked=val;
        };
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
    $scope.optionState = [{name:'所在机构所有数据',id:1}, {name:'所在部门及下级部门数据',id:2}, {name:'所在部门数据',id:3}, {name:'自定义部门',id:4}];
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
    $scope.roleNameNone = false;
    $scope.newSubmit=function(){
        if(!$scope.roleName){
            $scope.roleNameNone = true;
            return;
        }
        if(!$scope.depts&&($scope.stateModel.id==4)){
            var msg = layer.msg('<div class="toaster"><span>'+自定义部门为空+'</span></div>', {
                area: ['100%', '60px'],
                time: 3000,
                offset: 'b',
                shadeClose: true,
                shade: 0
            });
            return;
        }
        var checked = $('.roleDetailSectionContent input:checked');
        var arr=[];
        for (var i = 0; i < checked.length; i++) {
            arr.push(checked.eq(i).attr('data-mid'));
        }
        var depts = [];
        if ($scope.stateModel.id==4) {
            for (var i = $scope.nodes.length - 1; i >= 0; i--) {
                depts.push({deptId:$scope.nodes[i].id,deptName:$scope.nodes[i].name});
            };
        };
        $.ajax({
            type:'post',
            url:'/sys/role/add',
            data:JSON.stringify({
                "dataScope":$scope.stateModel.id,
                "permissionIds":arr,
                "roleCustom": {
                    depts: depts
                },
                "name":$scope.roleName,
                "tenantId": $stateParams.id ||$localStorage.userInfo.tenantId ||1,
                "createBy": $localStorage.userInfo.id
            }),
            contentType:'application/json;charset=UTF-8',
            complete:function (res) {
                if(res.responseJSON.code == 200){
                    $state.go('role.index');
                    var msg = layer.msg('<div class="toaster"><span>创建成功</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                }else{
                    var msg = layer.msg('<div class="toaster"><span>'+res.responseJSON.msg+'</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                }
            }
        })
    }
    // 自定义部门
    var setting = {
        data: {
            key: {
                children: "subDepts"
            }
        },
        check: {
            enable: true,
            chkboxType: { "Y": "", "N": "" }
        },
        callback: {
            beforeCheck: function () {
                console.log("checked");
            }
        }
    }

    var nodes = null,
        treeObj = null;

    
    $scope.getTreeData = function () {
        $.ajax({
            type: "get",
            async:false,
            url: "/sys/dept/tree/tenant/" + $localStorage.userInfo.nowOrgId,
            complete: function(res) {
                if(res.responseJSON.code == 200) {
                    nodes = res.responseJSON.data;
                    treeObj = $.fn.zTree.init($("#treeDemo"), setting, res.responseJSON.data);
                    treeObj.expandAll(true);
                }else{
                    var msg = layer.msg('<div class="toaster"><span>'+res.responseJSON.msg+'</span></div>', {
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
    $scope.addSelfDept=function(){
        var index=layer.open({
            time: 0 //不自动关闭
            ,type: 1
            ,content: $('#treeDemo')
            ,title: ['提示','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
            ,closeBtn: 1
            ,shade: 0.3
            ,shadeClose: true
            ,btn: ['确定','取消']
            ,success: function(){
                if(nodes){
                    if($scope.depts){
                        for (var i=0, l=$scope.nodes.length; i < l; i++) {
                            treeObj.checkNode($scope.nodes[i], true, false);
                            treeObj.updateNode($scope.nodes[i]);
                        }
                    }
                }else{
                     $scope.getTreeData();
                 }               
            }
            ,yes: function(index){
                layer.close(index);
                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                console.log(treeObj.getNodes());
                $scope.nodes = treeObj.getCheckedNodes(true);
                var arr = [];
                for (var i = $scope.nodes.length - 1; i >= 0; i--) {
                    arr.push($scope.nodes[i].name);
                };
                $scope.depts=arr.join(';');
                $rootScope.$apply();
            }
            ,cancel: function(index) {
            }
            ,area: ['650px','540px']
        });
    }
}]);