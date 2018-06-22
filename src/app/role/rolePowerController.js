'use strict';

angular.module('app')

.controller('rolePowerController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
	$rootScope.userOr = true;
	$rootScope.currentmodule = "角色管理";
	$rootScope.sections = {
		model: false,
		child: true,
		operate: false,
		user: false
	};

	$rootScope.lookOrEdit = true;
	$rootScope.defineNew = false;
	$scope.defineEditCon = function() {
		$rootScope.lookOrEdit = !$rootScope.lookOrEdit;
	}

	$scope.list = [{
		moduleName: '资产管理',
		permissions: [{
			name: '资产台账',
			third: [{
				id: 1,
				name: '查看资产台账列表',
				logo: 'third001'
			}, {
				id: 2,
				name: '导入资产台账',
				logo: 'third002'
			}]
		}, {
			name: '资产台账',
			third: [{
				id: 1,
				name: '查看资产台账列表',
				logo: 'third003'
			}, {
				id: 2,
				name: '导入资产台账',
				logo: 'third004'
			}]
		}]
	}, {
		name: '资产管理',
		second: [{
			name: '资产台账',
			third: [{
				id: 1,
				name: '查看资产台账列表',
				logo: 'third005'
			}, {
				id: 2,
				name: '导入资产台账',
				logo: 'third006'
			}]
		}, {
			name: '资产台账',
			third: [{
				id: 1,
				name: '查看资产台账列表',
				logo: 'third007'
			}, {
				id: 2,
				name: '导入资产台账',
				logo: 'third008'
			}]
		}]
	}];
	function paddingFullSrc(){
		var clientHeight=0;
		if(document.body.clientHeight&&document.documentElement.clientHeight)
		{
			clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
		}
		else
		{
			clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
		}
		$('.roleDetailSectionContent').css('min-height',(clientHeight-385)+'px');
	}
	paddingFullSrc();
	$scope.optionList = false;

	$scope.alertChildCon = false;
	$scope.orgId = 235;
	$scope.orgName = "浙江省第一人民医院";
	$scope.layerImg = "../../../res/img/wh.png";
	$scope.tips = ["删除机构后,下级机构将一并删除且无法恢复，请谨慎操作！", "停用机构将导致机构对应后台用户均不可登陆，该机构及下级机构后台页面不可访问，请谨慎操作。"];
	$scope.orgTip = "停用机构将导致机构对应后台用户均不可登陆，该机构及下级机构后台页面不可访问，请谨慎操作。";

	$scope.stateList = false;
	$scope.typeList = false;
	$scope.operateList = false;
	$scope.typeModel = '角色类型';
	$scope.operateModel = '更多操作';
	$scope.option = function(list, value, a) {
		$rootScope.fixWrapShow = false;
		$scope[list] = false;
		$rootScope[value] = a;
		(a.id!=4)&&($rootScope.depts='');
        (a.id==4)&&$scope.addSelfDept();
	}
	$scope.alertLayer = function(i, item, n) {
		$rootScope.fixWrapShow = false;
		$scope['operateList' + i] = false;
		$scope.alertChildCon = true;
		$scope.orgOperate = $scope.operate[n];
		$scope.orgTip = $scope.tips[n];
		$scope.orgId = item.id;
		$scope.orgName = item.name;
		if(n) $scope.layerImg = "../../../res/img/icon20.png";
		else $scope.layerImg = "../../../res/img/wh.png";
		var index = layer.open({
			time: 0 //不自动关闭
				,
			type: 1,
			content: $('#alertOrgChild'),
			title: ['提示', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
			closeBtn: 1,
			shade: 0.3,
			shadeClose: true,
			btn: 0,
			area: ['540px', '287px']
		});
	}

	$scope.showMoreOpt = function(i) {
		$scope.menuHide();
		$scope['operateList' + i] = !$scope['operateList' + i];
		$rootScope.fixWrapShow = true;
	}
	$scope.listShow = function(str) {
			if($rootScope.fixWrapShow)
				return $scope.menuHide();
			$scope[str] = true;
			$rootScope.fixWrapShow = true;
		}
		/*遮罩*/
	$rootScope.fixWrapShow = false;
	$scope.menuHide = function() {
		$rootScope.fixWrapShow = false;

		$scope.stateList = false;
		$scope.typeList = false;
		$scope.operateList = false;

		for(var i = 0, len = $scope.tdData.length; i < len; i++) {
			$scope['operateList' + i] = false;
		};
	}
	$scope.optionType = [{
		name: '预设角色'
	}, {
		name: '自定义'
	}];
	$scope.optionState = [{name:'所在机构所有数据',id:1}, {name:'所在部门及下级部门数据',id:2}, {name:'所在部门数据',id:3}, {name:'自定义部门',id:4}];
	// input check
	$scope.inputSelect = function(second, $event) {
		var allCheck = $('#check' + second.menuId);
		allCheck[0].checked = true;
		if(!allCheck.parents('.menuList').next().find('input:checked').length) {
			allCheck[0].checked = false;
		}
	}
	$scope.inputAllSelect = function(second) {
		var allCheck = $('#check' + second.menuId);
		var input = allCheck.parents('.menuList').next().find('input');
		var val = allCheck[0].checked;
		for(var i = 0; i < input.length; i++) {
			input.eq(i)[0].checked = val;
		};
	}
	$scope.menuShow = function(second) {
		for(var i = 0; i < second.permissions.length; i++) {
			if(second.permissions[i].enable) {
				return true;
			}
		};
	}
	$scope.moduleShow = function(first) {
		for(var i = 0; i < first.menus.length; i++) {
			if($scope.menuShow(first.menus[i])) {
				return true;
			}
		};
		for(var i = 0; i < first.permissions.length; i++) {
			if(first.permissions[i].enable) {
				return true;
			}
		};
	}

	$rootScope.submitEdit = function() {
		if(!$rootScope.depts&&($rootScope.stateModel.id==4)){
            var msg = layer.msg('<div class="toaster"><span>'+'自定义部门为空'+'</span></div>', {
                area: ['100%', '60px'],
                time: 3000,
                offset: 'b',
                shadeClose: true,
                shade: 0
            });
            return;
        }
		var checked = $('.roleDetailSectionContent input:checked');
		var arr = [];
		for(var i = 0; i < checked.length; i++) {
			arr.push(checked.eq(i).attr('data-mid'));
		}
		var depts = [];
        if ($rootScope.stateModel.id==4) {
            for (var i = $rootScope.selDepts.length - 1; i >= 0; i--) {
                depts.push({deptId:$rootScope.selDepts[i].id,deptName:$rootScope.selDepts[i].name});
            };
        };
		$.ajax({
			type: 'put',
			url: '/sys/role/update',
			data: JSON.stringify({
				"dataScope": $rootScope.stateModel.id,
				"id": $stateParams.roleId,
				"permissionIds": arr,
				"roleCustom": {
                    depts: depts
                },
				"name": $rootScope.role.name,
				"tenantId": $localStorage.userInfo.tenantId,
				"updateBy": $localStorage.userInfo.id
			}),
			contentType: 'application/json;charset=UTF-8',
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					$state.go('role.detail.power', null, {
						reload: true
					});
				}
			}
		});
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
        }
    }

    
    $scope.getTreeData = function () {
        $.ajax({
            type: "get",
            async:false,
            url: "/sys/dept/tree/tenant/" + $localStorage.userInfo.nowOrgId,
            complete: function(res) {
                if(res.responseJSON.code == 200) {
                    $.fn.zTree.init($("#treeDemo"), setting, res.responseJSON.data);
                    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                    treeObj.expandAll(true);
                    if($rootScope.depts){
                    	$scope.selfDeptShow=true;
                    	var temp,arr=[];
						for (var i=0, l=$rootScope.selDepts.length; i < l; i++) {
							temp = treeObj.getNodeByParam("id", $rootScope.selDepts[i].id, null);
							treeObj.checkNode(temp, true, false);
							treeObj.updateNode(temp);
							arr.push($rootScope.selDepts[i].name);
						}
		                $rootScope.depts=arr.join(';');
                    }
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
    	$scope.getTreeData();
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
                
            }
            ,yes: function(index){
                layer.close(index);
                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                $scope.selfDeptShow=true;
                $rootScope.selDepts = treeObj.getCheckedNodes(true);
                var arr = [];
                for (var i = $rootScope.selDepts.length - 1; i >= 0; i--) {
                    arr.push($rootScope.selDepts[i].name);
                };
                $rootScope.depts=arr.join(';');
                $rootScope.$apply();
            }
            ,cancel: function(index) {
                
            }
            ,end: function(){
            	$.fn.zTree.destroy("treeDemo");
            }
            ,area: ['650px','540px']
        });
    }
}]);