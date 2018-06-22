'use strict';

angular.module('app')

.controller('supplierDetailController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage','$filter', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage,$filter) {
	$rootScope.userOr = true;
	$rootScope.currentmodule = "供应商管理";
	$scope.paramsHad=function(){
		if(!$stateParams.tenantId){
			$state.go($state.current.name, {
                supplierId: $stateParams.supplierId,
                tenantId: $stateParams.tenantId||$localStorage.userInfo.tenantId
            },{reload:true});
		}
	}
	$scope.paramsHad();
	$rootScope.closeIndex = function() {
		layer.closeAll();
	}
	//底部高度设置，使其占满剩余全部
	$scope.resetBottomHeight = function() {
		var height = angular.element('.org-body').css('height', '100%').height();
		var topHighe = angular.element('.org-body').height();
		angular.element('.org-body').css('height', height - 130);
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
			url: '/sys/supplier/operate/' + $stateParams.supplierId +'/'+a,
			contentType: "application/json;charset=UTF-8",
			complete: function(res) {
				if(res.responseJSON.code&&res.responseJSON.code == 200) {
					$state.go('supplier.list', {
                        tenantId: $stateParams.tenantId,
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

	$scope.resetBottomHeight();

	//获取机构详情
	$scope.getDetail = function(id) {
        if($localStorage.userInfo&&($localStorage.userInfo.authoritiesStr.indexOf('SYS_SUPPLIER_TENANT_NEW') == -1)){
            $state.go('supplier.list',{tenantId: $stateParams.tenantId},{reload: true});
            return
        }
		$.ajax({
			type: 'get',
			url: '/sys/supplier/view/' + id,
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					$scope.nowOrgEnable = res.responseJSON.data.tenant.enable;
                    $scope.orgId = res.responseJSON.data.tenant.id;
                    $scope.orgName = res.responseJSON.data.tenant.name;

					if(res.responseJSON.data.tenant.createTime) {
						res.responseJSON.data.tenant.createTime = res.responseJSON.data.tenant.createTime.slice(0, -3);
					}
					$scope.data = res.responseJSON.data;
					$scope.imgSrc=$scope.data.tenant.logo?('/api/file'+$scope.data.tenant.logo):'../../res/img/name.png';
					$scope.imageUrl=$scope.data.logo;
					$rootScope.$apply();
				}
			}
		});
	}

	$scope.getDetail($stateParams.supplierId);

	//机构设置
	$scope.orgSet = function() {
		$state.go('supplier.add', {
			supplierId: $stateParams.supplierId,
            tenantId: $stateParams.tenantId 
		});
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
	$scope.tips = ["删除供应商后，数据将无法恢复，请谨慎操作！", "停用供应商将导致供应商对应后台用户均不可登录，请谨慎操作。"];
	$scope.orgTip = "停用供应商将导致供应商对应后台用户均不可登陆，请谨慎操作。";
	$scope.delayList = false;
	$scope.delayModel = '快速延期';
	$scope.models = [];

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
			url: '/sys/tenantModule/canAddModule/tenant/' + $stateParams.supplierId,
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
			if($scope.modeNull){
				return layer.close(index);
			}
			var modelArr = [];
			$($('input[name="checkModel"]:checked')).each(function() {
				modelArr.push($(this).attr('data-mid'));
			})

			$.ajax({
				type: 'post',
				url: '/sys/tenantModule/add',
				data: JSON.stringify({
					moduleIds: modelArr,
					tenantId: $stateParams.supplierId
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
            url: '/sys/supplier/delete/' + $stateParams.supplierId + "?forceDel=false",
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
                $scope.expireStrDate = new Date(new Date(new Date(b.startDate).toLocaleDateString()).getTime()+24*60*60*1000-1000);;
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
			$scope.layerImg = "../../../res/img/wh.png";
		} else {
			$scope.layerImg = "../../../res/img/icon20.png";
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
				url = '/sys/supplier/stop/' + $stateParams.supplierId;
			} else if(n == 0) {
				url = '/sys/supplier/delete/' + $stateParams.supplierId+ "?force=true";
				type = 'delete'
			} else {
				url = '/sys/supplier/recover/' + $stateParams.supplierId;
			}


            if(n == 2){
                layer.close(index);
                    $.ajax({
                        type: 'post',
                        url: '/sys/supplier/recover/' + $stateParams.supplierId,
                        complete: function(res) {
                            if(res.responseJSON.code == 200) {
                                $state.go('supplier.detail.model', {
                                    supplierId: $stateParams.supplierId,
                                    tenantId: $stateParams.tenantId,
                                    isOpMsg: '恢复成功',
                                    isOp:true
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
                    });
            }else{
                $.ajax({
                    type: type,
                    url: url,
                    contentType: "application/json;charset=UTF-8",
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {

                            var msg = ['删除', '停用', '恢复'];
                            if(n != 0) {
                                var msg1 = layer.msg('<div class="toaster"><span>' + msg[n] + '成功</span></div>', {
                                    area: ['100%', '60px'],
                                    time: 3000,
                                    offset: 'b',
                                    shadeClose: true,
                                    shade: 0
                                });
                            }

                            if(n == 0) {
                                layer.close(index);
                                $state.go('supplier.list', {
                                    tenantId: $stateParams.tenantId,
                                    isOpMsg: msg[n]+'成功',
                                    isOp:true
                                });
                            } else if(n == 1) {
                                layer.close(index);
                                $scope.getDetail($stateParams.supplierId);
                            } else {
                                layer.close(index);
                                $scope.getDetail($stateParams.supplierId);
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
		}

	}

    //到期时间
    $scope.expireState = 0;

    //到期时间
    $scope.expireStr = '';
    $scope.expireStrDate = new Date();
    $scope.expireDate = true;
    $scope.expireDateFn = function (e) {
        var v = e.target.value;
        v == '0'?($scope.expireDate=true,$scope.expireStr = null,$scope.expireStrDate = null):($scope.expireDate=false);
    }

    $scope.initialDate = function (str) {
        if(!str){
            $scope.expireStr = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.expireStrDate = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1000);
        }
    }

    //上传预览事件
    $scope.setImagePreview = function(arg) {
    	var file = arg.files;
        // var imgObjPreview = document.getElementById('headImg');
        if(arg.files && arg.files[0]) {
            var typeArr = ['jpg', 'jpeg', 'gif', 'png', 'tiff', 'bmp','PNG','JPG'],
                type = file[0].name.split('.')[file[0].name.split('.').length-1].toLocaleLowerCase();
            // console.log(file[0].name.split('.')[file[0].name.split('.').length-1]);
            if(!$scope.contains(typeArr, type)) {
                // alert('选择文件格式有误，请重新选择！');
                var msg = layer.msg('<div class="toaster"><span>选择文件格式有误，请重新选择！</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
                arg.value = '';
                return;
            }

            var size = file[0].size / (1024 * 1024);
            if(size>2){
                // alert('选择文件过大，请重新选择！');
                var msg = layer.msg('<div class="toaster"><span>选择文件过大，请重新选择！</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
                arg.value = '';
                return;
            }

            //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
            $scope.imgSrc = window.URL.createObjectURL(arg.files[0]);
            var file = arg.files[0];

            var formData = new FormData();
            formData.append("files", file);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/upload/');
            xhr.setRequestHeader("X-AEK56-Token", $localStorage["X-AEK56-Token"]);
            xhr.send(formData);
            xhr.onreadystatechange = function () {
                var res = xhr.response;
                if((xhr.readyState == 4)&&res){
                    if(JSON.parse(res).code == '200'){
                        $scope.imageUrl = JSON.parse(res).data[0];
                        $scope.editSupplier();
                    }
                }
            }
            $rootScope.$apply();
        } else {

        }
    }
    $scope.editSupplier=function(){
    	$.ajax({
			type: 'put',
			url: '/sys/supplier/edit',
			contentType: "application/json;charset=UTF-8",
			data: JSON.stringify({
				id: $stateParams.supplierId,
				updateBy: $localStorage.userInfo.id,
				logo: $scope.imageUrl
			}),
			complete: function(res) {
				if(res.responseJSON.code&&res.responseJSON.code == 200) {
					$state.go('supplier.detail.model', {
						supplierId: $stateParams.supplierId,
                        tenantId: $stateParams.tenantId,
		                isOp: true,
		                isOpMsg: '保存成功'
					}, {
		                reload: true
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
		});
    }
    $scope.contains = function(arr, obj) {
        var i = arr.length;
        while(i--) {
            if(arr[i] === obj) {
                return true;
            }
        }
        return false;
    }
}]);