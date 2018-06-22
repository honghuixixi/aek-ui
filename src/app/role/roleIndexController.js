'use strict';


angular.module('app')

.controller('roleIndexController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
    $scope.localStorageHad=function(){
		if(!$localStorage.userInfo){
			return $state.go('website.home');
		}
	}
	$scope.localStorageHad();
    $.ajax({
        type: 'get',
        url: '/sys/tenant/view/tenant/' +( $stateParams.id || $localStorage.userInfo.tenantId) + '/user/' + $rootScope.userInfo.id,
        contentType: "application/json;charset=UTF-8",
        complete: function(res) {
            if(res.responseJSON.code == 200) {
                $localStorage.userInfo.nowOrgName = res.responseJSON.data;
            }
        }
    })
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

	$scope.optionList = false;

	$scope.alertChildCon = false;
	$scope.orgId = 235;
	$scope.orgName = "浙江省第一人民医院";
	$scope.layerImg = "../../../res/img/wh.png";
	$scope.operate = ["删除", "停用", '恢复'];
	$scope.orgOperate = "停用";
	$scope.tips = ["删除机构后,下级机构将一并删除且无法恢复，请谨慎操作！", "停用角色后,拥有该角色的用户将无法使用被停用角色所包含的权限。请谨慎操作!"];
	$scope.orgTip = "停用角色后,拥有该角色的用户将无法使用被停用角色所包含的权限。请谨慎操作!";

	$scope.stateList = false;
	$scope.typeList = false;
	$scope.operateList = false;
	$scope.typeModel = '全部类型';
	$scope.typeModelId = '';
	$scope.stateModel = '全部状态';
	$scope.stateModelId = '';
	$scope.operateModel = '更多操作';
	$scope.option = function(list, value, item) {
		$rootScope.fixWrapShow = false;
		$scope[list] = false;
		$scope[value] = item.name;
		$scope[value + 'Id'] = item.id;
		$scope.getList();
	}
	$scope.lookDetail = function(td) {
		$localStorage.roleId = td.id;
		var url = $state.href('role.detail.power', {
			roleId: td.id
		});
		window.open(url, '_blank');
	}
	$scope.newRole = function() {
		var url = $state.href('role.add');
		window.open(url, '_blank');
	}
	$scope.stopBtn = {
		tip: "停用角色后，拥有该角色身份的用户将无法使用被停用角色所包含的权限。请谨慎操作！",
		img: "../../../res/img/wh.png",
		info: "确定停用角色（235）xxx模块管理员 吗？",
		btn: null,
		id: "alertRoleStop",
		height: "287px"
	};
	$scope.startBtn = {
		tip: "停用角色后，拥有该角色身份的用户将无法使用被停用角色所包含的权限。请谨慎操作！",
		img: "../../../res/img/wh.png",
		info: "确定启用角色（235）xxx模块管理员 吗？",
		btn: null,
		id: "alertRoleStop",
		height: "287px"
	};
	$scope.delBtn = {
		tip: "",
		img: "../../../res/img/wh.png",
		info: "确定删除角色（23）xxx管理员吗？",
		btn: null,
		id: "alertRoleDel",
		height: "250px"
	};
	$scope.failBtn = {
		tip: "",
		img: "../../../res/img/icon23.png",
		info: "该角色下还有启用中的用户，请勿删除。",
		btn: null,
		id: "alertRoleDel",
		height: "250px"
	};
	//第一次停用进行提醒
	$scope.alertStop = true;
	$scope.closeIndex = function() {
		layer.closeAll();
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
		if(n == 2) {
			var url = '/sys/role/recover/' + item.id,
				type = "put";
			$.ajax({
				type: type,
				url: url,
				contentType: 'application/json;charset=UTF-8',
				complete: function(res) {
					if(res.responseJSON.code == 200) {
						$scope.bottomMsg($scope.operate[n] + '成功');
					} else {
						$scope.bottomMsg($scope.operate[n] + '失败');
					}
					$state.go('role.index', null, {
						reload: true
					});
				}
			});
			return
		}
		var index = layer.open({
			time: 0,//不自动关闭
			type: 1,
			content: $('#alertOrgChild'),
			title: ['提示', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
			closeBtn: 1,
			shade: 0.3,
			shadeClose: true,
			btn: 0,
			area: ['540px', '287px']
		});
		$scope.operateRole = function() {
			var url = '',
				type = "put";
			if(n == 1) {
				if($scope.alertStop)
					url = '/sys/role/stop/' + item.id;
			} else if(n == 2) {
				url = '/sys/role/recover/' + item.id;
			} else {
				url = '/sys/role/delete/' + item.id + '?orgId=37'; //暂时写死37
				type = "delete";
			}

			$.ajax({
				type: type,
				url: url,
				contentType: 'application/json;charset=UTF-8',
				complete: function(res) {
					if(res.responseJSON.code == 200) {
						layer.close(index);
						$state.go('role.index', null, {
							reload: true
						});
						$scope.bottomMsg($scope.operate[n] + '成功！');
						// layer.close(index);
						// $scope.getList();
					} else {
						layer.close(index);
						if(n == 1) {
							//不需要提示已存在用户
							$.ajax({
									type: 'put',
									url: '/sys/role/stop/' + item.id + '?isForced=true',
									contentType: 'application/json;charset=UTF-8',
									complete: function(res) {
										if(res.responseJSON.code == 200) {
											$scope.bottomMsg('停用成功');
											$scope.getList();
										} else {
											$scope.bottomMsg(res.responseJSON.msg);
										}
									}
								})
								/*var index2 = layer.open({
									time: 0 //不自动关闭
										,
									content: '<div style="text-align: center;margin-top:30px;" class="pad-fifty2"><img style="margin-right:15px;" src="../../../res/img/icon20.png">' + res.responseJSON.msg + '</div>',
									title: ['提示', 'font-size: 14px;color: #fff;background-color: rgb(74, 178, 155);line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
									closeBtn: 1,
									shade: 0.3,
									shadeClose: true,
									btn: ['确定', '取消'],
									yes: function(index) {
										$.ajax({
											type: 'put',
											url: '/sys/role/stop/' + item.id + '?isForced=true',
											contentType: 'application/json;charset=UTF-8',
											complete: function(res) {
												if(res.responseJSON.code == 200) {
													$scope.bottomMsg('停用成功');
													$scope.getList();
												} else {
													$scope.bottomMsg(res.responseJSON.msg);
												}
											}
										})
										layer.close(index2);
									},
									area: ['500px', '220px'],
									btnAlign: 'c'
								});*/
						} else {
							$scope.bottomMsg(res.responseJSON.msg);
						}
					}
				}
			});
		}
	}

	//底部提示
	$scope.bottomMsg = function(msg) {
		var msg = layer.msg('<div class="toaster"><span>' + msg + '</span></div>', {
			area: ['100%', '60px'],
			time: 3000,
			offset: 'b',
			shadeClose: true,
			shade: 0
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
		id: '',
		name: '全部类型'
	}, {
		id: 1,
		name: '预设角色'
	}, {
		id: 2,
		name: '自定义'
	}];
	$scope.optionState = [{
		id: '',
		name: '全部状态'
	}, {
		id: false,
		name: '已停用'
	}, {
		id: true,
		name: '启用中'
	}];
	$scope.tdData = [];
	// $scope.data = {
	// 	loading: true,
    //     empty: false
	// };
	// 分页数据
	$scope.pageInfo = {
		pages: 0,
		total: 0,
		size: 16,
		current: 1,
		pstyle: 2
	};

	// 分页事件
	$scope.pagination = function(page, pageSize) {
		$scope.pageInfo.size = pageSize;
		$scope.getList(page);
	}

	//列表参数
	// $scope.pageNo = 1;
	// $scope.pageSize = 999;
	$scope.nocontent = false;
	$scope.onloading = false;
	$scope.getList = function(page) {
		var data = {
			pageNo: page || 1,
			pageSize: $scope.pageInfo.size,
			tenantId: $stateParams.id || $rootScope.userInfo.tenantId, //暂时写死37机构
			enable: $scope.stateModelId,
			roleType: $scope.typeModelId,
			keyword: ''
		}
		$scope.onloading = true;
		$scope.nocontent = false;
		// $scope.data.loading = true;
        $scope.tdData = [];
		$.ajax({
			type: 'get',
			// async: false,
			url: '/sys/role/page',
			data: data,
			contentType: 'application/json;charset=UTF-8',
			complete: function(res) {
				$scope.onloading = false;
				// $scope.data.loading = false;
				if(res.responseJSON.code == 200) {
					var data = res.responseJSON.data;
					$scope.pageInfo.current = page;
                    $scope.pageInfo.total = data.total;
                    $scope.tdData = data.records;
                    $scope.nocontent = data.records.length < 1;
                    $scope.$apply();
					// var data = res.responseJSON.data;
					// $scope.tdData = res.responseJSON.data.records;
					// $scope.nocontent = false;
					// if(!$scope.tdData.length) {
					// 	$scope.nocontent = true;
					// }
					//$rootScope.$apply();
				}
			}
		})
	}

	$scope.getList();
}]);