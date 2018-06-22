'use strict';

angular.module('app')

.controller('superviseDetailController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage','$filter', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage,$filter) {
	$rootScope.userOr = true;
	$rootScope.currentmodule = "监管机构管理";
	$rootScope.closeIndex = function() {
			layer.closeAll();
		}
		//底部高度设置，使其占满剩余全部
	$scope.resetBottomHeight = function() {
		var height = angular.element('.org-body').css('height', '100%').height();
		var topHighe = angular.element('.org-body').height();
		angular.element('.org-body').css('height', height - 130);
		//angular.element('.org-body').css('min-height', height - 130);

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

    $scope.operateAudit=function(a){
		$.ajax({
			type: 'post',
			url: '/sys/tenant/operate/' + $scope.data.tenant.id+'/'+a,
			contentType: "application/json;charset=UTF-8",
			complete: function(res) {
				if(res.responseJSON.code&&res.responseJSON.code == 200) {
					$state.go('org.supervise', {
						id: $stateParams.id,
		                isOp: true,
		                isOpMsg: '操作成功'
					}, {
		                reload: true
		            });
				}
			}
		});
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



	$scope.resetBottomHeight();

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

                    $scope.orgId = res.responseJSON.data.tenant.id;
                    $scope.orgName = res.responseJSON.data.tenant.name;

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

					// $scope.currentOrg=;

					$localStorage.orgData = res.responseJSON.data;
					// $localStorage.nowId = res.responseJSON.data.tenant.id;

					//默认加载第一个模块
					$state.go('org.superviseDetail.model');

					$scope.$apply();
				}
			}
		})
	}

	$scope.id = $stateParams.id;
	if($scope.id != 0) {
		$scope.getDetail($scope.id);
	} else {
		$scope.getDetail($stateParams.id);
	}

	//机构设置
	$scope.orgSet = function() {
		$state.go('org.superviseAdd', {
				id: $scope.id,
                loginId:$stateParams.loginId || $localStorage.userInfo.tenantId
			});
			
		//停用的机构不做校验
		/*if($scope.nowOrgEnable) {
			$state.go('org.superviseAdd', {
				id: $scope.id,
                loginId:$stateParams.loginId
			});
		} else {
			layer.msg('<div class="toaster"><span>当前监管机构已被停用</span></div>', {
				area: ['100%', '60px'],
				time: 3000,
				offset: 'b',
				shadeClose: true,
				shade: 0
			});
		}*/
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
	$scope.tips = ["删除监管机构后,下级监管机构将一并删除且无法恢复，请谨慎操作！", "停用监管机构将导致监管机构对应后台用户均不可登录，请谨慎操作。"];
	$scope.orgTip = "停用监管机构将导致监管机构对应后台用户均不可登陆，请谨慎操作。";
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
					$scope.toaster('延期成功', function() {
						window.location.reload();
					});
				} else {
					$scope.toaster(res.responseJSON.msg);
				}
			}
		});
	}

	//toaster提示
	$scope.toaster = function(msg, callback) {
		layer.msg('<div class="toaster"><span>' + msg + '</span></div>', {
			area: ['100%', '60px'],
			time: 3000,
			offset: 'b',
			shadeClose: true,
			shade: 0,
			end: function() {
				callback && callback();
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
			title: ['添加系统模块', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
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

    $scope.alertCon = false;

	$scope.delVerify = function () {

        $.ajax({
            type: "delete",
            url: '/sys/tenant/delete/' + $stateParams.id + "?forceDel=false",
            contentType: "application/json;charset=UTF-8",
            async: false,
            complete: function(res) {
                if(res.responseJSON.code == 200) {
                    $scope.alertContent(0);
                }else{
                	$scope.delVerifyMsg = res.responseJSON.msg;
                    $scope.alertCon2 = true;
                    var index = layer.open({
                        time: 0, //不自动关闭,
                        type: 1,
                        content: $('#alertOrg2'),
                        title: ['提示', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                        closeBtn: 1,
                        shade: 0.3,
                        shadeClose: true,
                        btn: 0,
                        area: ['540px','230px']
                    });
				}
            }
        })
    }

    $scope.recoverCon = false;
    //初始化日历
    $scope.initcalendar = function() {
        var option = {
            format: 'YYYY-MM-DD',
            startDate: '2017-01-01',
            endDate: new Date(),
            minDate:new Date(new Date()-24*60*60*1000),
            maxDate: new Date("2050-01-01"),
            timePicker: false,
            opens: "top",
			/*parentEl:'.org-initDate',*/
            isCotrScollEl:".org-content-detail",
            singleDatePicker: true
        };

        angular.element('.input-datepicker').daterangepicker($.extend({}, option, {
            startDate: new Date()
        }), function(date, enddate, el) {

        });

        $('#expireDate').on('apply.daterangepicker', function(a,b) {
            var currentel = b.element[0].name;
            if(currentel == "expireDate"){
                $scope.expireStr = b.startDate.format('YYYY-MM-DD');
                // $scope.expireStrDate = new Date(date);
                $scope.expireStrDate = new Date(new Date(new Date(b.startDate).toLocaleDateString()).getTime());//+24*60*60*1000-1000);;
            }
            $rootScope.$apply();
        });
    }

	$scope.alertContent = function(n) {
		$scope.alertCon = true;
		$scope.orgOperate = $scope.operate[n];
		$scope.orgTip = $scope.tips[n];

		var title = '提示';
		if(n) {
			$scope.layerImg = "../../../res/img/icon20.png";
		} else {
			$scope.layerImg = "../../../res/img/wh.png";
			title = '提示';



		}
		var index = layer.open({
			time: 0 //不自动关闭
				,
			type: 1,
			content: $('#alertOrg'),
			title: [title, 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
			closeBtn: 1,
			shade: 0.3,
			shadeClose: true,
			btn: 0,
			area: ['540px', n == 2 ? '250px' : '300px']
		});

		//停用或删除机构
		$scope.operateOrg = function() {
			var url = '',
				type = 'post';
			if(n == 1) {
				url = '/sys/tenant/stop/' + $stateParams.id;
			} else if(n == 0) {
				url = '/sys/tenant/delete/' + $stateParams.id+ "?force=true";
				type = 'delete'
			} else {
				url = '/sys/tenant/recover/' + $stateParams.id;
			}


            if(n == 2){
                layer.close(index);
                $scope.recoverCon = true;
                var index2 = layer.open({
                    time: 0 //不自动关闭
                    ,
                    type: 1,
                    content: $('#recoverTime'),
                    title: [title, 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    closeBtn: 1,
                    shade: 0.3,
                    shadeClose: true,
                    btn: 0,
                    area: ['440px','250px']
                });

                $scope.initcalendar();

                //判断当前机构被停用时到期时间是否大于当前时间，若大于，则将到期时间默认设为之前的到期时间
                if(new Date(new Date(new Date($scope.data.tenant.expireTime).toLocaleDateString()).getTime()+24*60*60*1000-1000) - new Date()>0){
                    $scope.expireState = 1;
                    $scope.expireStr = $scope.data.tenant.expireTime;
                    $scope.expireStrDate = new Date($scope.data.tenant.expireTime);
                    $scope.expireDate = false;
                }else{
                    $scope.expireState = 0;
                }

                $scope.setRecoverTime = function () {
                    var data = $scope.expireStrDate;
                    if($scope.expireState == 0){
                        $scope.expireStrDate = null;
                        data = JSON.stringify({expireTime:$scope.expireStrDate})
                    }else{
                    	if(!$scope.expireStrDate){
                    		var msg = layer.msg('<div class="toaster"><span>请选择日期</span></div>', {
                                    area: ['100%', '60px'],
                                    time: 3000,
                                    offset: 'b',
                                    shadeClose: true,
                                    shade: 0
                                });
                    		
                    		return;
                    	}

                        data = {expireTime:$scope.expireStrDate};
                    }
                    $.ajax({
                        type: 'post',
                        url: '/sys/tenant/recover/' + $stateParams.id,
                        data:data,
                        complete: function(res) {
                            if(res.responseJSON.code == 200) {
                                var msg = layer.msg('<div class="toaster"><span>恢复成功</span></div>', {
                                    area: ['100%', '60px'],
                                    time: 3000,
                                    offset: 'b',
                                    shadeClose: true,
                                    shade: 0
                                });
                                layer.close(index2);
                                $scope.getDetail($stateParams.id);
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

            }else{
                $.ajax({
                    type: type,
                    url: url,
                    contentType: "application/json;charset=UTF-8",
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {

                            var msg = ['删除', '停用', '恢复'];
                            if(n != 0) {
                                var msg = layer.msg('<div class="toaster"><span>' + msg[n] + '成功</span></div>', {
                                    area: ['100%', '60px'],
                                    time: 3000,
                                    offset: 'b',
                                    shadeClose: true,
                                    shade: 0
                                });
                            }

                            if(n == 0) {
                                layer.close(index);
                                $state.go('org.supervise', {
                                    id: 1,
                                    isOpMsg: msg[n]+'成功',
                                    isOp:true
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

			// $.ajax({
			// 	type: type,
			// 	url: url,
			// 	contentType: "application/json;charset=UTF-8",
			// 	complete: function(res) {
			// 		if(res.responseJSON.code == 200) {
            //
			// 			var msg = ['删除', '停用', '恢复'];
			// 			var msg = layer.msg('<div class="toaster"><span>' + msg[n] + '成功</span></div>', {
			// 				area: ['100%', '60px'],
			// 				time: 3000,
			// 				offset: 'b',
			// 				shadeClose: true,
			// 				shade: 0
			// 			});
            //
			// 			if(n == 0) {
			// 				layer.close(index);
			// 				$state.go('org.supervise', {
			// 					id: 1
			// 				});
			// 			} else if(n == 1) {
			// 				layer.close(index);
			// 				$scope.getDetail($stateParams.id);
			// 			} else {
			// 				layer.close(index);
			// 				$scope.getDetail($stateParams.id);
			// 			}
            //
			// 		}
			// 	}
			// });
		}

	}

    //到期时间
    $scope.expireState = 0;

    //到期时间
    $scope.expireStr = '';
    $scope.expireStrDate = null;
    $scope.expireDate = true;
    $scope.expireDateFn = function (e) {
        var v = e.target.value;
        v == '0'?($scope.expireDate=true,$scope.expireStr = null,$scope.expireStrDate = null):($scope.expireDate=false);
    }

    $scope.initialDate = function (str) {
        if(!str){
            $scope.expireStr = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.expireStrDate = new Date(new Date(new Date().toLocaleDateString()).getTime());//+24*60*60*1000-1000);
        }
    }

	//	跳转至机构首页
	$scope.toOrgList = function() {
		//获取当前机构对应机构名称，保存至缓存中供全局使用

        if($scope.nowOrgEnable) {
            $.ajax({
                type: 'get',
                async: false,
                url: '/sys/tenant/view/tenant/' + ($stateParams.id || $localStorage.userInfo.tenantId) + '/user/' + $rootScope.userInfo.id,
                contentType: "application/json;charset=UTF-8",
                complete: function(res) {
                    if(res.responseJSON.code == 200) {
                        $localStorage.userInfo.nowOrgName = res.responseJSON.data;
                        $localStorage.userInfo.tenantName = $scope.data.tenant.name;
                        var url=$state.href('home.general',{
									tenantId: $stateParams.id,
									id:$stateParams.id
							})
				      // $state.go('home.use', {id: $stateParams.id});
				      window.open(url);
                    }
                }
            })
        } else {
            layer.msg('<div class="toaster"><span>当前监管机构已被停用</span></div>', {
                area: ['100%', '60px'],
                time: 3000,
                offset: 'b',
                shadeClose: true,
                shade: 0
            });
        }
	}
}]);