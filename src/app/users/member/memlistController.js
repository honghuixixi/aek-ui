'use strict';
angular.module('app')
	.controller('memlistController', ['$rootScope', '$stateParams', '$scope', '$http', '$state', '$localStorage', '$compile',
		function($rootScope, $stateParams, $scope, $http, $state, $localStorage, $compile) {
			$rootScope.currentmodule = "成员用户管理";
			$scope.topStyle = {
					top: "42px"
				}
		//底部高度设置，使其占满剩余全部
			$scope.resetBottomHeight = function() {
				var height = angular.element('.memberwrap').css('height', '100%').height();
				var topHighe = angular.element('.membertop').height();

				angular.element('.memberwrap').css('height', 'inherit');
				//angular.element('.memberwrap').css('min-height', height - 130);

			}

			$scope.resetBottomHeight();

			$rootScope.membernav = true;
			$rootScope.userOr = false;
			$scope.memberuser = {}; //用户信息
			$scope.currentUserId = $localStorage.userInfo.id;
			$scope.currentOrgId = $stateParams.tenantId || $localStorage.userInfo.nowOrgId;
			$scope.currentOrgName = $localStorage.userInfo.tenantName;
			$scope.preset = $stateParams.preset || 'true';
			$scope.currentDeptId = $stateParams.deptId; //当前部门id
			$scope.editDeptId = $stateParams.deptId || 0; //当前编辑Id
			$scope.currentdept = $stateParams.deptId;
			$scope.currentdeptName = $stateParams.deptName;
			$scope.parentDept = $stateParams.deptName; //新增部门弹框的父级部门
			$scope.currentParentDept = $stateParams.parentDeptId; //父级id
			$scope.currentParentDeptName = $stateParams.parentDeptName; //父级name
			$scope.batcop = false; //是否需要批量操作
			$scope.searchKeyword = {
				keyvalue: 'ID/用户姓名/手机号',
				keyword: ''
			};

			$scope.keyfocus = function() {
				if($scope.searchKeyword.keyvalue == 'ID/用户姓名/手机号') {
					$scope.searchKeyword.keyvalue = '';
				} else {
					$scope.searchKeyword.keyword = $scope.searchKeyword.keyvalue;
				}
			}
			$scope.keyblur = function() {
				if($scope.searchKeyword.keyvalue.trim() == '') {
					$scope.searchKeyword.keyvalue = 'ID/用户姓名/手机号';
					$scope.searchKeyword.keyword = '';
				} else {
					$scope.searchKeyword.keyword = $scope.searchKeyword.keyvalue;
				}
			}

			$scope.searchListShow = false;
			$scope.enableList = false;
			$scope.enableOpList = false;
			$scope.deptarr = []
			$scope.dept_form = {};
			$scope.userList = []; //用户列表
			$scope.deptList = [] //当前机构下的部门列表
			$scope.currEnable = '全部';
			$scope.currEnableId = '';
			$scope.fixWrapShow = false;
			$scope.currentIndex = 0; //当前出现的下标
			$scope.tipMsg = "";
			$scope.currEnable2 = '批量操作';
			$scope.keyword = {
				nameSearch: ''
			}
			$scope.enableArr2 = [{
				id: '',
				name: '批量操作'
			}/*, {
				id: 'del',
				name: '删除用户'
			}*/, {
				id: 'enable',
				name: '启用用户'
			}, {
				id: 'stop',
				name: '停用用户'
			}];

			$scope.enableArr = [{
				id: '',
				name: '全部'
			}, {
				id: true,
				name: '启用中'
			}, {
				id: false,
				name: '已停用'
			}];
			/*搜索部门*/
			$scope.showdeptList = function() {
					$scope.searchListShow = !$scope.searchListShow;
					$scope.depetshow = !$scope.depetshow;
					$(".member-deptWrap").empty();

				}
				//隐藏list
			$scope.hideSearchlist = function() {
				$scope.searchListShow = !$scope.searchListShow;
				$scope.depetshow =!$scope.depetshow;
			}

			//ng-repeat失效 暂时使用jq处理

			$("body").on("click", ".label-item", function(e) {
				$scope.depetshow =!$scope.depetshow;
				$scope.searchListShow=!$scope.searchListShow;
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
					url: "/sys/dept/search/tenant/" + ($stateParams.tenantId || $localStorage.userInfo.nowOrgId),
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

			$scope.opEnable2 = function() {
				if($scope.enableOpList) {
					$scope.menuHide();
				} else {
					$scope.menuHide();
					$scope.enableOpList = true;
					$scope.fixWrapShow = true;
				}
			}
			$scope.opEnable = function() {
				if($scope.enableList) {
					$scope.menuHide();
				} else {
					$scope.menuHide();
					$scope.enableList = true;
					$scope.fixWrapShow = true;
				}
			}

			$scope.changeEnable = function(name, id) {
				$scope.enableList = false;
				$scope.currEnable = name;
                $scope.currEnableId = id;
				$scope.getUserList({
					enable: id
				});

			}
			$scope.showMoreOpt = function(index) {
				$scope.menuHide();
				$scope.currentIndex = index;
				$scope['operateList' + index] = !$scope['operateList' + index];
				$scope.fixWrapShow = true;

			}
			$scope.menuHide = function() {
				$scope.fixWrapShow = false;
				$scope.enableList = false;
				$scope.enableOpList = false;
				// $scope['operateList' + $scope.currentIndex] = !$scope['operateList' + $scope.currentIndex];
				for(var i = 0, len = $scope.userList.length; i < len; i++) {
					$scope['operateList' + i] = false;
				};

			}

			$scope.alertOpUser = function(index, user, opIndex) {
					var _width = "440px";
					var _height = "225px";
					var _elId = "msgTip";
					var _isTip = true;
					var _id = "";
					var _title = "提示";
					if(opIndex == 3) {
						_width = "635px";
						_height = "260px";
						_elId = "updataPassword";
						_isTip = false;
						_id = "changePwd";
						_title = "修改密码";

					}

					$scope.openDialog({
						elId: _elId,
						isTip: _isTip,
						id: _id,
						title: _title,
						width: _width,
						height: _height,
						successCallBack: function() {
							$scope.menuHide();
							if(opIndex == 0) {
								$scope.tipMsg = "确认删除用户" + user.realName + "(" + user.id + ")吗?";

							} else if(opIndex == 1) {
								$scope.tipMsg = "确认停用用户" + user.realName + "(" + user.id + ")吗?";
							} else if(opIndex == 2) {
								$scope.tipMsg = "确认启用用户" + user.realName + "(" + user.id + ")吗?";
							}
						},
						callback: function(index) {
							//layer.close(index);
							if(opIndex == 0) {
								$scope.delUserById(user.id);
							} else if(opIndex == 1 || opIndex == 2) {
								$scope.setAccnum(opIndex, user);

							} else if(opIndex == 3) {
								$scope.updataPassword(user.id);

							}

						}

					})

				}
				/*修改密码*/
			$scope.updataPassword = function(id) {

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
					url: "/sys/user/" + ($scope.userid || id) + "/changePwd",
					data: JSON.stringify({
						"password": $scope.userPwd.password
					}),
					complete: function(res) {
						if(res.responseJSON.code == 200) {
							$scope.toastMsg({
								msg: "修改成功",
								callback: function() {
									$scope.getUserList();
								}
							});
						} else {
							$scope.toastMsg({
								msg: "修改失败"
							});
						}
                        $scope.getUserList();

					}
				});

			}

			/*起停用用户*/
			$scope.setAccnum = function(opIndex, user) {
				var accountUrl = opIndex == 1 ? '/sys/user/disable/' : '/sys/user/recover/';
				var stateMsg = opIndex == 1 ? '停用' : '启用';
				$.ajax({
					type: "post",
					contentType: "application/json;charset=UTF-8",
					url: accountUrl + user.id,
					complete: function(res) {
						if(res.responseJSON.code == 200) {
							$scope.toastMsg({
								msg: stateMsg + "成功",
								callback: function() {
									$scope.getUserList();
								}
							});

						} else {
							$scope.toastMsg({
								msg: stateMsg + "失败"
							});
						}
                        $scope.getUserList();

					}
				});

			}

			/*删除用户*/
			$scope.delUserById = function(id) {

				$.ajax({
					type: "delete",
					url: "sys/user/delete/" + id,
					complete: function(res) {
						if(res.responseJSON.code == 200) {
							$scope.toastMsg({
								msg: "删除成功"
							});

						} else {
							$scope.toastMsg({
								msg: "删除失败"
							});
						}
                        $scope.getUserList();
					}
				});

			}

			$scope.changeDept = function(currentId) {
				$scope.memberuser.deptId = currentId;

			}

			$scope.memberuser = {
				"createBy": $scope.currentUserId, //创建人Id 当前用户Id,
				/*"tenantId":$scope.currentOrgId     //当前机构Id */
				tenantId: $scope.currentOrgId
			}

			//根据状态查询 机构用户

			$scope.getUserByState = function(params) {}

			//查询机构下的用户列表
			$scope.getUserList = function(params) {
				params = params || {};
				$.ajax({
					type: "get",
					data: {
						"tenantId": $scope.currentOrgId,
						"deptId": $scope.currentDeptId,
						"keyword": $scope.searchKeyword.keyword,
						"pageNo": params.pageNo || 1,
						"pageSize": params.pageSize || 16,
						"enable": params.enable || $scope.currEnableId
					},
					url: "/sys/user/search",
					complete: function(res) {
						if(res.responseJSON.code == 200) {
							var data = res.responseJSON.data.records;
							$scope.pageInfo = res.responseJSON.data;
							// $scope.pageInfo.pstyle = 2;

							for(var i = 0; i < data.length; i++) {
								if(data[i].createTime) {
									data[i].createTime = data[i].createTime.slice(0, 10);
								}
							}

							$scope.userList = res.responseJSON.data.records;
							$rootScope.$apply();
							$scope.setUpdown(".memberwrap","-70px","42px");

						}

					}
				});
			}
			$scope.setUpdown = function(slecter,up,down) {
				$(slecter).scrollTop(10); //控制滚动条下移10px
				if($(slecter).scrollTop() > 0) {
					$scope.topStyle = {
						top: up
					}
				} else {
					$scope.topStyle = {
						top: down
					}
				}
				$(slecter).scrollTop(0);

			}

			$scope.pagination = function(page, pagesize) {
				$scope.getUserList({
					"tenantId": $scope.currentOrgId,
					"deptId": $scope.currentDeptId,
					"pageNo": page,
					"pageSize": pagesize
				});
			}

			//查询机构下的部门
			$scope.getDeptList = function(params) {
				$.ajax({
					type: "get",
					url: "/sys/dept/search/tenant/" + $scope.currentOrgId,
					complete: function(res) {
						if(res.responseJSON.code == 200) {
							$scope.currentdept=$scope.currentdept?$scope.currentdept:res.responseJSON.data[0].id;
							$scope.currentdeptName=$scope.currentdeptName?$scope.currentdeptName:res.responseJSON.data[0].name;
							$scope.deptList = res.responseJSON.data;
							$rootScope.$apply();

						}

					}
				});

			}

			//获取用户
			$scope.getUserList();
			$scope.getDeptList();

			/*创建用户*/
			$scope.depetNameNone = false;
			$scope.creatUser = function(index) {

				if($scope.addmember.$invalid) {
					angular.forEach($scope.addmember.$error.required, function(data, index, currentArr) {
						data.$dirty = true; //必填选项
					})
					$rootScope.$apply();
					return;
				}
				layer.close(index);
				$.ajax({
					type: "post",
					url: "/sys/user/add",
					contentType: "application/json;charset=UTF-8",
					data: JSON.stringify($scope.memberuser),
					complete: function(res) {
						var tipMsg = "";
						if(res.responseJSON.code == 200) {
							tipMsg = "创建成功";
							$scope.getUserList();

						} else {
							tipMsg = res.responseJSON.msg;
						}
						$scope.toastMsg({
							msg: tipMsg
						});

					}
				});

			}

			/*保存部门*/

			$scope.saveDept = function(index) {
					if(!$scope.dept_form.name) {
						$scope.dept_form.err=true;
						$rootScope.$apply();
						return;
					}
					$scope.dept_form.id = +$scope.currentdept;
					$scope.dept_form.parentId = $scope.currentParentDept; //父级id 
					$scope.dept_form.tenantId = $scope.currentOrgId; //所在机构id
					$scope.dept_form.updateBy = $scope.currentUserId;
					$.ajax({
						type: "post",
						url: "/sys/dept/edit",
						contentType: "application/json;charset=UTF-8",
						data: JSON.stringify($scope.dept_form),
						complete: function(res) {
							$scope.parentDept = $scope.currentdeptName;
							if(res.responseJSON.code == 200) {
								$scope.toastMsg({
									msg: '更新成功'
								});
								// $state.reload();
								$state.go('main.member.list', {
									deptId: '',
									deptName: '',
									preset: true
								}, {
									reload: true
								});
							} else {
								$scope.toastMsg({
									msg: res.responseJSON.msg
								});
							}

						}
					});

				}
				/*删除部门*/
			$scope.delDept = function() {

					$.ajax({
						type: "delete",
						url: "/sys/dept/delete/" + $scope.currentDeptId + "?forceDel=true",
						contentType: "application/json;charset=UTF-8",
						complete: function(res) {
							if(res.responseJSON.code == 200) {
								layer.closeAll();
								$scope.toastMsg({
									msg: "删除成功"
								});
								// $state.reload();
								$state.go('main.member.list', {
									deptName: $localStorage.userInfo.nowDeptName || $localStorage.userInfo.deptName,
									deptId: '',
									preset: true
								}, {
									reload: true
								});

							} else {
								$scope.toastMsg({
									msg: res.responseJSON.msg
								});
								var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
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
				/*批量操作*/
			$scope.changeOp = function(name, opStr) {
				$scope.enableOpList = false;
				$scope.currEnable2 = name;
				var opIds = [];
				var opUrl = '';
				angular.element(".memchildren-checkbox").each(function(index, el) {
					if(angular.element(el).prop("checked")) {
						opIds.push(angular.element(el).val());

					}

				})
				if(!opIds.length || opStr == "") return;

				if(opStr == "del") {
					opUrl = "/sys/user/batch/delete";

				} else if(opStr == "stop") {

					opUrl = "/sys/user/batch/disable";

				} else if(opStr == "enable") {
					opUrl = "/sys/user/batch/enable";
				}

				$.ajax({
					type: "post",
					url: opUrl,
					contentType: "application/json;charset=UTF-8",
					data: JSON.stringify(opIds),
					complete: function(res) {
						if(res.responseJSON.code == 200) {
							$scope.toastMsg({
								msg: "操作成功"
							});
							$scope.getUserList();
							angular.element(".mem-parent-checkbox").prop("checked", false);

							$rootScope.$apply();

						} else {
							$scope.toastMsg({
								msg: res.responseJSON.msg
							});
						}

					}
				});

			}

			/*全选 */
			$scope.changeCheckAll = function() {
				angular.element(".child-checkbox").each(function(index, el) {
					if(!angular.element(el).prop("checked")) {
						angular.element(".all-checkbox").removeAttr("checked");
						return false;
					} else {
						angular.element(".all-checkbox").prop("checked", "checked");
					}

				})

			}
			$scope.checkALl = function() {
				if(angular.element(".all-checkbox").prop("checked")) {
					angular.element(".child-checkbox").prop("checked", "checked");
				} else {
					angular.element(".child-checkbox").removeAttr("checked");
				}

			}

			$scope.editDeptDialog = function() {
				$scope.depetshow = false;
				$scope.parentDept = $scope.currentParentDeptName;
				$scope.dept_form.name = $scope.currentdeptName;
				$scope.dept_form.err = false;
				$scope.openDialog({
					elId: "addmemberdept",
					title: "编辑部门",
					width: "620px",
					id: 'editDept',
					height: "260px",
					successCallBack: function() {
						$scope.deptLength = function() {
							if($scope.dept_form.name){
								$scope.dept_form.err = false;
								if($scope.dept_form.name.length > 40) {
									$scope.dept_form.name = $scope.dept_form.name.slice(0, 40);
								}
							}
						}

						$scope.hideAll = function() {
							$scope.depetshow = false;
						}

					},
					callback: function(index) {
						$scope.saveDept(index);
					}
				});

			}

			$scope.phoneRepeat = false;
            $scope.emailRepeat = false;

			//新建用户手机号邮箱地址验重
			$scope.checkRepeat = function (type) {
				var val = '';
				if(type == 1){
					val = $scope.memberuser.mobile;
				}else{
					val = $scope.memberuser.email;
				}

				if(!val){
					return;
				}

				$.ajax({
					type:'get',
					url:'/sys/user/info/checkRepeat?value='+val+'&type='+type,
                    contentType: "application/json;charset=UTF-8",
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {
							if(type == 1 && !res.responseJSON.data){
                                $scope.phoneRepeat = true;
							}
                            if(type == 2 && !res.responseJSON.data){
                                $scope.emailRepeat = true;
                            }
                            $rootScope.$apply();
						}
					}
				})
            }

            //验重，输入时重置状态
			$scope.checkChange = function (type) {
                if(type == 1){
                    $scope.phoneRepeat = false;
                }else{
                    $scope.emailRepeat = false;
                }
            }

            $scope.getTreeData = function () {
				var obj = {};
                $.ajax({
                    type: "get",
					async:false,
                    url: "/sys/dept/tree/tenant/" + $localStorage.userInfo.nowOrgId,
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {
                        	$scope.currentdept=$scope.currentdept?$scope.currentdept:res.responseJSON.data.id;
                        	$scope.currentdeptName=$scope.currentdeptName?$scope.currentdeptName:res.responseJSON.data.name;
							obj.id = res.responseJSON.data.id;
							obj.name = res.responseJSON.data.name;
                        }
                    }
                });
                return obj;
            }

			/*添加部门用户对话框*/
			$scope.addeptUserDialog = function() {
                $scope.depetName = $stateParams.deptName;//默认为当前节点选中部门
                $scope.memberuser = {};
                $scope.memberuser = {
                    "createBy": $scope.currentUserId, //创建人Id 当前用户Id,
                    tenantId: $scope.currentOrgId,
                    deptId: $stateParams.deptId//默认为当前节点选中部门
                }

                //解决没有点击节点时未触发beforeClick时新建用户无默认选中部门的问题
                if(!$stateParams.deptName && !$stateParams.deptId){
                    $scope.depetName = $scope.getTreeData().name;
                    $scope.memberuser.deptId = $scope.getTreeData().id;
                }

					$scope.openDialog({
						elId: "memberform",
						title: "新建用户",
						width: "620px",
						height: "520px",
						successCallBack: function() {
							$scope.getDeptList({
								orgId: $scope.currentOrgId
							});
						},
						callback: function(index) {
							if($scope.memberuser.email){
                                if(!$scope.emailRepeat && !$scope.phoneRepeat){
                                    $scope.creatUser(index);
                                }else{
                                	return;
								}
							}else if(!$scope.phoneRepeat){
                                $scope.creatUser(index);
							}else{
								return;
							}
						},
						endCallback: function() {
							$scope.depetshow = false;
							$scope.searchListShow = false;

						}
					});
				}
				/*删除部门对话框*/

			$scope.delDeptDialog = function() {
				var notAllowDel = false;

				$.ajax({
					type: "delete",
					url: "/sys/dept/delete/" + $scope.currentDeptId + "?forceDel=false",
					contentType: "application/json;charset=UTF-8",
					async: false,
					complete: function(res) {
						if(res.responseJSON.code != 200) {
							layer.open({
								type: 1,
								time: 0, //不自动关闭
								content: "<div style='margin-top:25px;' id='msgTip'><div class='msgIcon'><span></span></div><div class='msgTxt'>" + res.responseJSON.msg + "</div></div>",
								title: ['提示', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
								shade: 0.3,
								shadeClose: true,
								btn: ['确定', '取消'],
								area: ['420px', '240px'], //宽高
                                yes: function() {
									if(res.responseJSON.code !=200){
                                        $scope.delDept();
										layer.closeAll();
									}else{
                                        layer.closeAll();
									}
                                }
							});

							notAllowDel = true;
						} else {
							notAllowDel = false;
						}

					}

				});

				if(notAllowDel) return;
				var msg = "确认删除部门" + $scope.currentdeptName + "吗?";
				layer.open({

					type: 1,
					time: 0, //不自动关闭
					content: "<div style='margin-top:25px;' id='msgTip'><div class='msgIcon'><span></span></div><div class='msgTxt'>" + msg + "</div></div>",
					title: ['提示', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
					shade: 0.3,
					shadeClose: true,
					btn: ['确定', '取消'],
					area: ['420px', '220px'], //宽高
					yes: function() {
						$scope.delDept();
					}

				});

				/*$scope.openDialog({
					elId: "msgTip",
					title: '提示',
					isTip: true,
					width: "440px",
					height: "225px",
					successCallBack: function() {
						$scope.tipMsg = "确认删除部门" + $scope.currentdeptName + "(" + $scope.currentDeptId + ")吗?";
					},
					callback: function() {
						$scope.delDept();
					}

				})*/

			}

			//toaster
			$scope.toastMsg = function(params) {

				layer.msg('<div class="toaster"><span>' + params.msg + '</span></div>', {
					area: ['100%', '60px'],
					time: 3000,
					offset: 'b',
					shadeClose: true,
					shade: 0,
					end: function() {
						params.callback && params.callback();
					}
				});

			}

			$scope.openDialog = function(params) {
				layer.open({
					time: 0, //不自动关闭			
					content: params.isTip ? "<div id='msgTip'><div class='msgIcon'><span></span></div><div class='msgTxt'>{{tipMsg}}</div></div>" : angular.element("#" + params.elId)[0].outerHTML,
					title: [params.title || '提示', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
					closeBtn: 1,
					id: params.id,
					shade: 0.3,
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
						//layer.close(index);
					},
					cancel: function(index) {
						// layer.close(index);
					},
					end: function() {
						$scope.iseditDept = false;
						$scope.parentDept = $scope.currentdeptName;
						params.endCallback && params.endCallback();
					}
				})

			}
		}
	]);