'use strict';

angular.module('app').controller('supplierListController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {

	/*操作成功后的弹出框 */
    if($stateParams.isOp) {
        var msg = layer.msg('<div class="toaster"><i></i><span>' + $stateParams.isOpMsg + '</span></div>', {
            area: ['100%', '60px'],
            time: 3000,
            offset: 'b',
            shadeClose: true,
            shade: 0
        });
    }
    $scope.localStorageHad=function(){
		if(!$localStorage.userInfo){
			return $state.go('website.home');
		}
	}
	$scope.localStorageHad();

	$.ajax({
			type: 'get',
			url: '/sys/tenant/view/tenant/' + ($stateParams.id || $localStorage.userInfo.tenantId) + '/user/' + $rootScope.userInfo.id,
			contentType: "application/json;charset=UTF-8",
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					$localStorage.userInfo.nowOrgName = res.responseJSON.data;
				}
			}
		})
		//底部高度设置，使其占满剩余全部
	$scope.resetBottomHeight = function() {
		var Maxheight = angular.element('.app-content-body').height();
		var topHighe = angular.element('.head-top').height();

		angular.element('.org-panel').css('height', Maxheight - 70);
	}
	$scope.resetBottomHeight();

	// $rootScope.userOr = true;
	$rootScope.currentmodule = "供应商管理";
	$scope.keywords = 'ID/供应商名称';
	$scope.key = '';

	$scope.clearKey = function() {
		if($scope.keywords == 'ID/供应商名称') {
			$scope.keywords = '';
			$scope.key = '';
		} else {
			$scope.key = $scope.keywords;
		}
	}

	$scope.addKey = function() {
		if(!$scope.keywords) {
			$scope.keywords = 'ID/供应商名称';
			$scope.key = '';
		}
	}

	$scope.operateTenant=function(a,b){
		$.ajax({
			type: 'post',
			url: '/sys/tenant/operate/' + b.id+'/'+a,
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

	$localStorage.orgData = null;
	// $localStorage.nowId = null;

	//来源
	$scope.source = '来源';
	$scope.sourceId = "";
	$scope.sourceArr = [{id:1,name:'后台创建'},{id:2,name:'前台注册'}];
	//审核状态
	$scope.status = '审核状态';
	$scope.statusId = "";
	$scope.statusArr = [{id:1,name:'待审核'},{id:2,name:'自动通过'},{id:3,name:'人工通过'},{id:4,name:'已拒绝'}];
	//账户类型
	$scope.accountType = '服务类型';
	$scope.accountTypeId = "";
	$scope.accountTypeArr = [{id:'1',name:'维修商'},{id:'2',name:'供货商'},{id:'3',name:'配件供应商'},{id:'4',name:'综合服务商'},{id:'5',name:'其他'}];
	//开通状态
	$scope.open = '开通状态';
	$scope.openId = "";
	$scope.openArr = [{
		id: 1,
		name: '启用中'
	}, {
		id: 0,
		name: '已停用'
	}];

	$scope.devshow = false;
	$scope.devshow1 = false;
	$scope.devshow2 = false;
	$scope.devshow3 = false;
	$scope.devshow4 = false;
	$scope.devshow5 = false;
	$scope.devshow6 = false;

	$scope.fixWrapShow = false;

	$scope.hideAll = function() {
		$scope.devshow = false;
		$scope.devshow1 = false;
		$scope.devshow2 = false;
		$scope.devshow3 = false;
		$scope.devshow4 = false;
		$scope.devshow5 = false;
		$scope.devshow6 = false;
	}

	$scope.focus = function(num) {
		$scope.hideAll();
		$scope.devshow = true;
		$scope['devshow' + num] = true;
	}

	// 点击子菜单
	$scope.click = function($event, num, type) {
		$scope['devshow' + num] = false;
		$scope.devshow = false;
		$scope[type] = $($event.target).html();
		$scope[type + 'Id'] = $($event.target).attr('data-id');
		$scope.search('search');
	}

	//获取当前机构详情
	$scope.getDetail = function(id) {
		$.ajax({
			type: 'get',
			url: '/sys/tenant/view/' + id,
			contentType: "application/json;charset=UTF-8",
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					// $scope.nowOrgName = res.responseJSON.data.tenant.name;
					$scope.nowOrgEnable = res.responseJSON.data.tenant.enable;
					// var customData = JSON.parse(res.responseJSON.data.tenant.customData);
					$scope.$apply();
				}
			}
		})
	}

	if($stateParams.id) {
		$scope.getDetail($stateParams.id);
	} else {
		$scope.getDetail($localStorage.userInfo.tenantId);
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

	//模拟数据
	$scope.res = {};
    $scope.noData = false;

	$scope.pageNo = 1;
	$scope.pageSize = 16;

	$scope.search = function(type) {
		//loading状态
        $scope.res = [];
        $scope.noData = false;
		$scope.loading2 = true;
		var keyword = '';
		if($scope.keywords != 'ID/供应商名称') {
			keyword = $scope.keywords;
		} else {
			keyword = $scope.key;
		}

		var data = {
			origin: $scope.sourceId,
			auditStatus: $scope.statusId,
			serviceType: $scope.accountTypeId,
			enable: $scope.openId,
			keyword: keyword,
			pageNo: $scope.pageNo,
			pageSize: $scope.pageSize,
		}

		type == 'search' && (data.pageNo = 1);

		$.ajax({
			type: 'get',
			url: '/sys/supplier/list',
			contentType: "application/json;charset=UTF-8",
			data: data,
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					$scope.loading2 = false;
					$scope.pageInfo = res.responseJSON.data;
					$scope.pageInfo.pstyle = 1;
					var data = res.responseJSON.data.records;
					if(data.length == 0){
						$scope.noData = true;
					}else{
                        $scope.noData = false;
					}
					var areaMsg;
					for(var i = 0; i < data.length; i++) {
						areaMsg = [];
						data[i].province && (areaMsg.push(data[i].province));
                        data[i].city && (areaMsg.push(data[i].city));
                        data[i].county && (areaMsg.push(data[i].county));
                        data[i].areaMsg = areaMsg.join("-");
					}
					$scope.res = data;
					$scope.$apply();
				}
			}
		})
	}

	$scope.search();

	$scope.showMoreOpt = function(i) {
		$scope.menuHide();
		$scope.fixWrapShow = true;

		$scope['operateList' + i] = !$scope['operateList' + i];
	}

	$scope.menuHide = function() {
		$scope.fixWrapShow = false;
		for(var i = 0, len = $scope.res.length; i < len; i++) {
			$scope['operateList' + i] = false;
		};
	}

	$scope.alertChildCon = false;
	$scope.orgId = 235;
	$scope.orgName = "浙江省第一人民医院";
	$scope.layerImg = "../../../res/img/wh.png";
	$scope.operate = ["删除", "停用", "恢复"];
	$scope.orgOperate = "停用";
	$scope.tips = ["删除机构后,下级机构将一并删除且无法恢复，请谨慎操作！", "停用机构将导致机构对应后台用户均不可登陆，该机构及下级机构后台页面不可访问，请谨慎操作。"];
	$scope.orgTip = "停用机构将导致机构对应后台用户均不可登陆，该机构及下级机构后台页面不可访问，请谨慎操作。";

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

		$scope.closeIndex = function() {
			layer.close(index);
		}

		//停用或删除机构
		$scope.operateOrg = function() {
			var url = '',
				type = 'post';

			if(n == 1) {
				url = '/sys/tenant/stop/' + item.id;
			} else if(n == 0) {
				url = '/sys/tenant/delete/' + item.id;
				type = 'delete'
			} else {
				url = '/sys/tenant/recover/' + item.id;
			}

			$.ajax({
				type: type,
				url: url,
				contentType: "application/json;charset=UTF-8",
				complete: function(res) {
					if(res.responseJSON.code == 200) {
						layer.close(index);
						$scope.search();
					}
				}
			});
		}

	};

	$scope.pagination = function(page, pageSize) {
		$scope.pageNo = page;
		$scope.pageSize = pageSize;
		$scope.search();
	};

	$scope.pageInfo = $scope.res;
	$scope.toAssets = function() {
        var url = $state.href('supplier.add',{tenantId:$stateParams.tenantId});
        window.open(url,'_blank');
	}

	$scope.goDetail = function(id) {
		$state.go('supplier.detail.model', {
			supplierId: id,
			tenantId: $stateParams.tenantId
		});
	}

}]);