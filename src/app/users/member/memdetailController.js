'use strict';

angular.module('app')

.controller('memdetailController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', '$compile', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage, $compile) {
	$rootScope.currentmodule = "成员用户管理";
	$scope.localStorageHad=function(){
		if(!$localStorage.userInfo){
			return $state.go('website.home');
		}
	}
	$scope.localStorageHad();
	$scope.userid = $stateParams.userId; //用户ID	
	$scope.currentOrgId = $localStorage.userInfo.tenantId;
	$scope.currentUserInfo = {}; //用户信息
	$scope.userInfo = $localStorage.userInfo;
	$scope.isEditBaseInfo = false;
	$scope.isAddRoles = false;
	$scope.orgRolesList = [];
	$scope.allRolesIds = [];
	$scope.deptarr = [];
	$scope.searchListShow = false;
	$scope.depetshow = false;
	$scope.keyword = {
		nameSearch: ''
	}
	
	
	$scope.userPwd = {
		"id": $scope.userid
	}; //用户密码
	/*获取用户详情 */

	$scope.getUserDetail = function(param,callback) {
		$.ajax({
			type: "get",
			url: "/sys/user/" + $scope.userid,
			async: false,
			complete: function(res) {
				if(res.responseJSON.code = 200) {
					$scope.currentUserInfo = res.responseJSON.data;
					$scope.memberuser = res.responseJSON.data;
					$scope.updataUser = {
						"deptId": $scope.memberuser.deptId,
						"email": $scope.memberuser.email,
						"id": $scope.memberuser.id,
						"mobile": $scope.memberuser.mobile,
						"realName": $scope.memberuser.realName,
						"tenantId": $scope.memberuser.tenantId,
						"jobName": $scope.memberuser.jobName,
						"updateBy": $localStorage.userInfo.id
					}
					$scope.currentdept = $scope.memberuser.deptId;
					$scope.depetName = $scope.memberuser.deptName;
					callback && callback();
					
				}

			}
		});

	}

	/*搜索部门*/
	$scope.showdeptList = function() {
			$scope.searchListShow = true;
			$scope.depetshow = true;
			$(".member-deptWrap").empty();

		}
		//隐藏list
	$scope.hideSearchlist = function() {
			$scope.searchListShow = false;
			$scope.depetshow = false;
		}
		//ng-repeat失效 暂时使用jq处理

	$("body").on("click", ".label-item", function(e) {
		$scope.depetshow = false;
		$scope.depetName = e.target.innerText;
		$scope.parentDept = e.target.innerText; //编辑部门的父级名称
		$scope.currentParentDept = e.target.id; //编辑部门的父级id
		$scope.memberuser.deptId = e.target.id;
		$rootScope.$apply();

	})
	$scope.$watch('deptarr', function(newValue, oldValue, scope) {
		var $label = '';
		angular.forEach($scope.deptarr, function(item) {
			$label += '<label class="label-item"  id=' + item.id + '>' + item.name + '</label>'
		});
		$(".member-deptWrap").empty().append($label);

	});
	$scope.searchList = function() {

		$.ajax({
			type: "get",
			url: "/sys/dept/search/tenant/" + ($stateParams.tenantId || $localStorage.userInfo.tenantId),
			data: {
				keyword: $scope.keyword.nameSearch
			},
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					$scope.deptarr = res.responseJSON.data;
					$rootScope.$apply();
				}

			}
		});

	}
	$scope.getUserDetail({
		async: false
	});
	/*切换部门 */
	$scope.changeDept = function(depId) {
			$scope.memberuser.deptId = depId;

		}
		/*编辑用户*/
	$scope.editBaseInfo = function() {
			$scope.updataUser.deptId = $scope.memberuser.deptId;
			$.ajax({
				type: "post",
				url: "/sys/user/edit",
				contentType: "application/json;charset=UTF-8",
				data: JSON.stringify($scope.updataUser),
				complete: function(res) {
					if(res.responseJSON.code == 200) {
						$scope.toastMsg({
							msg: "修改成功"
						});
						// $scope.getUserDetail({
						// 	async: false
						// });
						$state.go('usermain.detail.roleset',{tenantId: $stateParams.tenantId,userId: $stateParams.userId},{reload: true});
					} else {
						$scope.toastMsg({
							msg: res.responseJSON.msg
						});
					}
				}

			});

		}
		/*修改密码*/
	$scope.updataPassword = function() {
		if($scope.updataPwd_form.$invalid) {
			angular.forEach($scope.updataPwd_form.$error.required, function(data, index, currentArr) {
				data.$dirty = true; //必填选项
			})
			$rootScope.$apply();
			return;
		}

		$.ajax({
			type: "post",
			contentType: "application/json;charset=UTF-8",
			url: "/sys/user/" + $scope.userid + "/changePwd",
			data:JSON.stringify({
						"password":$scope.userPwd.password		
					}),
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					$scope.toastMsg({
						msg: "修改成功",
						callback: function() {
							$scope.getUserDetail();
						}
					});
				} else {
					$scope.toastMsg({
						msg: "修改失败"
					});
				}

			}
		});

	}

	/*修改密码弹出框*/
	$scope.updataPassDialog = function() {
			$scope.userPwd.password=''
		$scope.userPwd.password2=''
			$scope.openDialog({
				elId: "updataPassword",
				title: "修改密码",
				id:'changePwd',
				width: "635px",
				height: "260px",
				successCallBack: function() {

				},
				callback: function() {
					$scope.updataPassword();
				}
			})
		}
		//查询机构下的部门
	$scope.getDeptList = function(params) {
		$.ajax({
			type: "get",
			url: "/sys/dept/search/tenant/" + $scope.currentOrgId,
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					$scope.deptList = res.responseJSON.data;
					$rootScope.$apply();

				}

			}
		});

	}
	$scope.getDeptList();
	/*编辑用户所有角色*/
	$scope.editAllRole = function() {
		$scope.allRolesIds = [];

		angular.element(".addRoleInModel:checked").each(function(index, el) {
			$scope.allRolesIds.push(angular.element(el).val());
		});
		var allRoles = [{
			"roleIds": $scope.allRolesIds,
			"tenantId": $scope.currentOrgId,
			"userId": $scope.userid
		}]
		$.ajax({
			type: "post",
			url: "/sys/roleUser/edit/all",
			contentType: "application/json;charset=UTF-8",
			data: JSON.stringify(allRoles),
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					$scope.toastMsg({
						msg: "添加成功"
					});
					$scope.$broadcast("changeRoleList");

				} else {
					$scope.toastMsg({
						msg: "添加失败"
					});
				}
			}

		});

	}

	/*编辑基本信息弹出框*/
	$scope.editBaseInfoDialog = function() {
		$scope.getUserDetail({
			async: false
		})
		$scope.isEditBaseInfo = true;
		var index = layer.open({
			time: 0, //不自动关闭,
			type: 1,
			content: $('.editMember'),
			title: ['编辑基本信息', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
			closeBtn: 1,
			id:'userEdit',
			shade: 0.3,
			shadeClose: true,
			btn: ['确定', '取消'],
			btnAlign: 'r',
			yes: function(index) {
				$scope.editBaseInfo();
				layer.close(index);
			},
			area: ['635px', '445px']
		});
	}

	//改变角色列表
	$scope.changeList = function(roleOrg) {
			$scope.roleList = [];
			$scope.currentOrgId = roleOrg; //改变当前机构
			/*var list_length = $scope.orgRolesList.length;
			//机构角色数据数据判断，改变roleList
			for(var i = 0; i < list_length; i++) {
				if($scope.orgRolesList[i].tenantId == roleOrg) {
					$scope.roleList = $scope.orgRolesList[i].roles;
					//$rootScope.$apply();
					break;
				}
			}*/

			 $.ajax({
			 	type: "get",
			 	url: "/sys/roleUser/user/" + $scope.currentUserInfo.id + "/tenant/" + roleOrg,
			 	complete: function(res) {
			 		if(res.responseJSON.code == 200) {
			 			$scope.roleList = res.responseJSON.data.roles;
			 			$rootScope.$apply();
		
					}
			 	}
			 });

		}

//添加角色弹出框

	$scope.addroleDialog = function() {
        var index = layer.open({
            time: 0, //不自动关闭,
            type: 1,
            content: $('.addRoles'),
            title: ['添加角色', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
            closeBtn: 1,
            shade: 0.3,
            shadeClose: true,
            btn: ['确定', '取消'],
            btnAlign: 'r',
            yes: function(index) {
                $scope.editAllRole();
                layer.close(index);
            },
            area: ['635px', '600px']
        });

        $scope.allRoles = [];
        $scope.currentOrgId =$scope.currentUserInfo.tenantId||$stateParams.tenantId || $localStorage.userInfo.tenantId;

		$.ajax({
			type: "get",
			url: "/sys/roleUser/all/user/" + $stateParams.userId, //获取当前用户的所有角色
			// async: false,
			complete: function(res) {

				if(res.responseJSON.code == 200) {
					$scope.orgRolesList = res.responseJSON.data;
					$scope.roleOrg = res.responseJSON.data[0].tenantId;
					$scope.roleOrgList = [];
					$scope.allRoles = [];
					angular.forEach(res.responseJSON.data, function(data, index, array) {
						$scope.roleOrgList.push({
							"name": res.responseJSON.data[index].tenantName,
							"id": res.responseJSON.data[index].tenantId,
							"index": index
						});
						$scope.allRoles.push(res.responseJSON.data[index].roles);
					});
					$scope.roleList = res.responseJSON.data[0].roles;
					$rootScope.$apply();
				}

			}
		});

		$scope.isAddRoles = true;
		// var index = layer.open({
		// 	time: 0, //不自动关闭,
		// 	type: 1,
		// 	content: $('.addRoles'),
		// 	title: ['添加角色', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
		// 	closeBtn: 1,
		// 	shade: 0.3,
		// 	shadeClose: true,
		// 	btn: ['确定', '取消'],
		// 	btnAlign: 'r',
		// 	yes: function(index) {
		// 		$scope.editAllRole();
		// 		layer.close(index);
		// 	},
		// 	area: ['635px', '600px']
		// });

	}

	/* 停用\启用  账号*/
	$scope.setAccnumDialog = function(state) {
			var stateMsg = state == 'stop' ? '停用' : '启用';
			var accNumUrl = state == 'stop' ? '/sys/user/disable/' : '/sys/user/recover/';
			$scope.tipMsg = "确定" + stateMsg + "用户  (" + $scope.userid + ") " + $scope.currentUserInfo.realName + "吗?";
			$scope.openDialog({
				elId: "msgTip",
				isTip: true,
				title: stateMsg + '账号',
				width: "500px",
				height: "250px",
				successCallBack: function() {
					$scope.tipMsg = "确定" + stateMsg + "用户  (" + $scope.userid + ") " + $scope.currentUserInfo.realName + "吗?";
				},
				callback: function() {
					$.ajax({
						type: "post",
						contentType: "application/json;charset=UTF-8",
						url: accNumUrl + $scope.userid,
						complete: function(res) {
							if(res.responseJSON.code == 200) {
								$scope.toastMsg({
									msg: stateMsg + "成功",
									callback: function() {
										$scope.getUserDetail({},function(){
											$rootScope.$apply();
										});
									}
								});

							} else {
								$scope.toastMsg({
									msg: stateMsg + "失败"
								});
							}

						}
					});

				}

			})

		}
		/*删除角色权限*/
	$scope.delRoleDialog = function(params) {
		$scope.tipMsg = "确定删除用户  (" + $scope.userid + ") " + $scope.currentUserInfo.realName + " " + params.tenantName + " 所有权限 吗?";
		$scope.openDialog({
			elId: "msgTip",
			isTip: true,
			title: '提示',
			width: "540px",
			height: "250px",
			successCallBack: function() {
				$scope.tipMsg = "确定删除用户  (" + $scope.userid + ") " + $scope.currentUserInfo.realName + " " + params.tenantName + " 所有权限 吗?";
			},
			callback: function() {
				$.ajax({
					type: "delete",
					url: "/sys/roleUser/user/" + $scope.userid + "/tenant/" + params.tenantId,
					complete: function(res) {
						var delMsg = '';
						var isSuccess = false;
						if(res.responseJSON.code = 200) {
							delMsg = '删除成功';
							isSuccess = true;
							$scope.$broadcast("changeRoleList");

						} else {
							delMsg = '删除失败';
						}
						$scope.toastMsg({
							msg: delMsg,
							callback: function() {
								isSuccess && $scope.getUserDetail();
							}
						});

					}
				});

			}

		})

	}

	/*删除账号*/
	$scope.delAccnumDialog = function() {
		$scope.tipMsg = "确定删除用户  (" + $scope.userid + ") " + $scope.currentUserInfo.realName + "吗?";
		$scope.openDialog({
			isTip: true,
			isDel: true,
			elId: "msgTip",
			title: '删除账号',
			width: "540px",
			height: "285px",
			successCallBack: function() {
				$scope.tipMsg = "确定删除用户  (" + $scope.userid + ") " + $scope.currentUserInfo.realName + "吗?";
			},
			callback: function() {
				$.ajax({
					type: 'delete',
					contentType: "application/json;charset=UTF-8",
					url: "/sys/user/delete/" + $scope.userid,
					complete: function(res) {
						var delMsg = '';
						var isSuccess = false;
						if(res.responseJSON.code = 200) {
							delMsg = '删除成功';
							isSuccess = true;

						} else {
							delMsg = '删除失败';
						}
						$scope.toastMsg({
							msg: delMsg,
							callback: function() {
								isSuccess && $state.go('main.member.list');
							}
						});

					}
				});

			}

		})

	}

	//toaster
	$scope.toastMsg = function(params) {

		layer.msg('<div class="toaster"><span>' + params.msg + '</span></div>', {
			area: ['100%', '60px'],
			time: 1000,
			offset: 'b',
			shadeClose: true,
			shade: 0,
			end: function() {
				params.callback && params.callback();
			}
		});

	}

	//弹框
	$scope.openDialog = function(params) {
		var content = '';
		if(params.isTip) {
			content = "<div id='msgTip' style='margin-top:10px;'><div class='msgIcon'><span></span></div><div class='msgTxt'>" + $scope.tipMsg + "</div></div>";
		} else {
			content = angular.element("#" + params.elId)[0].outerHTML;
		}
		if(params.isDel) {
			content = "<div id='msgTipDel'><div class='msgIcon'><span></span></div><div class='msgTxt'>" + $scope.tipMsg + "</div><div style='text-align: center;' class='acolorred'>删除用户后无法恢复，请谨慎操作！</div></div>";
		}

		layer.open({
			time: 0, //不自动关闭			
			content: content,
			title: [params.title || '提示', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
			closeBtn: 1,
			shade: 0.3,
			id:params.id,
			shadeClose: true,
			btn: ['确定', '取消'],
			area: [params.width, params.height],
			btnAlign: 'r',
			success: function(el) {
				var $dom = $(el).find("#" + params.elId).html();
				$(el).find("#" + params.elId).html($compile($dom)($scope));
				if(params.elId == "addmemberdept") {
					$scope.iseditDept = true;
				}
				params.successCallBack && params.successCallBack();
			},
			yes: function(index) {
				params.callback && params.callback(index);
			},
			cancel: function(index) {
				layer.close(index);

			},
			end: function() {
				$scope.iseditDept = false;
			}
		})

	}
}]);