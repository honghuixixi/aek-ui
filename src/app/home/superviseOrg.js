angular.module('app')
	.controller('organController', ['$rootScope', '$scope', '$http', '$state', '$localStorage','$stateParams',
		function($rootScope, $scope, $http, $state, $localStorage,$stateParams	) {
            //处理小屏幕下多个滚动条问题
            angular.element('body').css('overflow-y','hidden');

			$rootScope.userOr = true;
			// $rootScope.currentmodule = "机构管理";
			$rootScope.userInfo = $localStorage.userInfo;
			if($rootScope.userInfo && !$rootScope.userInfo.authoritiesStr) {
                $rootScope.userInfo.authoritiesStr = '';
            }
			$rootScope.closeIndex = function() {
				layer.closeAll();
			}

            //根据id匹配值返回name
            $scope.getAreaName = function (id, arr) {
                if(!arr || arr.length == 0){
                    return;
                }
                for(var i = 0; i<arr.length;i++){
                    if(id == arr[i].id){
                        return arr[i].name;
                    }
                }
            }

            $scope.superiorUnitArr = [];

            //获取上级行政机构
            $scope.getManageTenant = function () {
                $.ajax({
                    type:'get',
                    async:false,
                    url:'/sys/tenant/all/manageTenant',
                    complete:function (res) {
                        if(res.responseJSON.code == 200){
                            $scope.superiorUnitArr = res.responseJSON.data;
                        }
                    }
                })
            }

			//获取机构详情
			$scope.getDetail = function(id) {
				$.ajax({
					type: 'get',
					url: '/sys/tenant/view/' + id,
					contentType: "application/json;charset=UTF-8",
					complete: function(res) {
						if(res.responseJSON.code == 200) {
							$scope.nowOrgEnable = res.responseJSON.data.tenant.enable;
							// if(res.responseJSON.data.tenant.customData) {
							// 	var customData = JSON.parse(res.responseJSON.data.tenant.customData);
							// 	$scope.category = $scope.getTypeName(customData.category, $localStorage.baseOrg.tenantCategory);
							// 	$scope.economicType = $scope.getTypeName(customData.economicType, $localStorage.baseOrg.tenantEconomicType);
							// 	$scope.grade = $scope.getTypeName(customData.grade, $localStorage.baseOrg.tenantManageType);
							// 	$scope.hierarchy = $scope.getTypeName(customData.hierarchy, $localStorage.baseOrg.tenantHierarchy);
							// 	$scope.manageType = $scope.getTypeName(customData.manageType, $localStorage.baseOrg.tenantGrade);
							// }

							if(res.responseJSON.data.tenant.createTime) {
								res.responseJSON.data.tenant.createTime = res.responseJSON.data.tenant.createTime.slice(0, -3);
							}
							if(res.responseJSON.data.tenant.expireTime) {
								res.responseJSON.data.tenant.expireTime = res.responseJSON.data.tenant.expireTime.slice(0, 10);
							} else {
								res.responseJSON.data.tenant.expireTime = '永久有效';
							}

                            $scope.getManageTenant();

                            //上级行政机构
                            res.responseJSON.data.tenant.manageTenantName = $scope.getAreaName( res.responseJSON.data.tenant.manageTenantId,$scope.superiorUnitArr);
                            $scope.data = res.responseJSON.data;

							$scope.data = res.responseJSON.data;
							$localStorage.orgData = res.responseJSON.data;
							// $localStorage.nowId = res.responseJSON.data.tenant.id;

							//默认加载第一个模块
							$state.go('home.superviseOrg.model', {
								id: $stateParams.id
							});

							$scope.$apply();
						}
					}
				})
			}

			$scope.id = $stateParams.id || $localStorage.userInfo.tenantId;

			// if($scope.id != 0){
			//         $scope.getDetail($scope.id);
			// }else{
			//         $scope.getDetail($stateParams.id);
			// }
			$scope.getDetail($scope.id)
				//机构设置
			$scope.orgSet = function() {
				if($scope.nowOrgEnable) {
					$state.go('org.add', {
						id: $scope.id
					});
				} else {
					layer.msg('<div class="toaster"><span>当前机构已被停用</span></div>', {
						area: ['100%', '60px'],
						time: 3000,
						offset: 'b',
						shadeClose: true,
						shade: 0
					});
				}
			}

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

			$scope.addModel = true;
			$scope.alertCon = false;
			$scope.alertMod = false;
			$scope.orgId = 235;
			$scope.orgName = "浙江省第一人民医院";
			$scope.orgState = "维修中";
			$scope.layerImg = "../../../res/img/wh.png";
			$scope.operate = ["删除", "停用", "恢复"];
			$scope.orgOperate = "停用";
			$scope.tips = ["删除机构后,下级机构将一并删除且无法恢复，请谨慎操作！", "停用机构将导致机构对应后台用户均不可登陆，该机构及下级机构后台页面不可访问，请谨慎操作。"];
			$scope.orgTip = "停用机构将导致机构对应后台用户均不可登陆，该机构及下级机构后台页面不可访问，请谨慎操作。";
			$scope.delayList = false;
			$scope.delayModel = '快速延期';
			$scope.models = [];
			$scope.optionIt = function(item) {
				$scope.fixdWrapShow = false;
				$scope.delayList = false;
				$scope.delayModel = item.name;

				$.ajax({
					type: 'delete',
					url: '/sys/tenant/delay/tenant/' + $stateParams.id + '?days=' + parseInt(item.name) + '&updateBy=' + 1,
					contentType: "application/json;charset=UTF-8",
					complete: function(res) {
						if(res.responseJSON.code == 200) {
							var data = res.responseJSON;
							$scope.getDetail($stateParams.id);
						}
					}
				});

			}
			$scope.listShow = function(str) {
					$scope.delayList = true;
					$scope.fixdWrapShow = true;
				}
				/*遮盖*/
			$scope.fixdWrapShow = false;
			$scope.menuHide = function() {
				$scope.fixdWrapShow = false;

				$scope.delayList = false;
			}
			$scope.optionDelay = [{
				name: '3天'
			}, {
				name: '7天'
			}, {
				name: '15天'
			}, {
				name: '30天'
			}];

			$scope.tdData = [{
				id: 1,
				name: 'zhang1',
				code: 'asdf1',
				type: 'string1',
				createTime: 'time1',
				updateTime: 'timer1',
				source: 'source1'
			}, {
				id: 2,
				name: 'zhang2',
				code: 'asdf2',
				type: 'string2',
				createTime: 'time2',
				updateTime: 'timer2',
				source: 'source2'
			}, {
				id: 3,
				name: 'zhang3',
				code: 'asdf3',
				type: 'string3',
				createTime: 'time3',
				updateTime: 'timer3',
				source: 'source3'
			}];

			$scope.alertModel = function() {
				$.ajax({
					type: 'get',
					async: false,
					url: '/sys/tenantModule/canAddModule/tenant/' + $stateParams.id,
					contentType: "application/json;charset=UTF-8",
					complete: function(res) {
						if(res.responseJSON.code == 200) {
							var data = res.responseJSON.data;
							if(data.length == 0) {
								$scope.modeNull = true;
							} else {
								$scope.modeNull = false;
							}
							$scope.models = data;

						}
					}
				});
				$scope.alertMod = true;
				var index = layer.open({
					time: 0 //不自动关闭
						,
					type: 1,
					content: $('#alertModel'),
					title: ['提示', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
					closeBtn: 1,
					shade: 0.3,
					shadeClose: true,
					btn: 0,
					area: ['540px', '272px']
				});

				$scope.toChild = function() {
					var modelArr = [];
					$($('input[name="checkModel"]:checked')).each(function() {
						modelArr.push($(this).attr('data-mid'));
					})

					$.ajax({
						type: 'post',
						url: '/sys/tenantModule/add',
						data: JSON.stringify({
							moduleIds: modelArr,
							tenantId: $stateParams.id
						}),
						contentType: "application/json;charset=UTF-8",
						complete: function(res) {
							if(res.responseJSON.code == 200) {
								$scope.$broadcast("FromSelf", {
									code: res.responseJSON.code
								});
								layer.close(index);
							}
						}
					})
				};

			}

			$scope.alertContent = function(n) {
				$scope.alertCon = true;
				$scope.orgOperate = $scope.operate[n];
				$scope.orgTip = $scope.tips[n];
				if(n) $scope.layerImg = "../../../res/img/icon20.png";
				else $scope.layerImg = "../../../res/img/wh.png";
				var index = layer.open({
					time: 0 //不自动关闭
						,
					type: 1,
					content: $('#alertOrg'),
					title: ['提示', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
					closeBtn: 1,
					shade: 0.3,
					shadeClose: true,
					btn: 0,
					area: ['540px', n == 2 ? '250px' : '287px']
				});

				//停用或删除机构
				$scope.operateOrg = function() {
					var url = '',
						type = 'post';
					if(n == 1) {
						url = '/sys/tenant/stop/' + $stateParams.id;
					} else if(n == 0) {
						url = '/sys/tenant/delete/' + $stateParams.id;
						type = 'delete'
					} else {
						url = '/sys/tenant/recover/' + $stateParams.id;
					}

					$.ajax({
						type: type,
						url: url,
						contentType: "application/json;charset=UTF-8",
						complete: function(res) {
							if(res.responseJSON.code == 200) {

								var msg = ['删除', '停用', '恢复'];
								var msg = layer.msg('<div class="toaster"><span>' + msg[n] + '成功</span></div>', {
									area: ['100%', '60px'],
									time: 3000,
									offset: 'b',
									shadeClose: true,
									shade: 0
								});

								if(n == 0) {
									layer.close(index);
									$state.go('org.index', {
										id: 1
									});
								} else if(n == 1) {
									layer.close(index);
									$scope.getDetail($stateParams.id);
								} else {
									layer.close(index);
									$scope.getDetail($stateParams.id);
								}

							}
						}
					});
				}

			}

			//	跳转至机构首页
			$scope.toOrgList = function() {
				/*var url = $state.href('home.use', {
					id: $stateParams.id
				});*/
				var url=$state.href('home.general',{
									tenantId: $stateParams.id,
									id:$stateParams.id
							})
				// $state.go('home.use', {id: $stateParams.id});
				window.open(url);
			}
		}
	]);