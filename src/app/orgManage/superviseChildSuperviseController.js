'use strict';

angular.module('app')

.controller('superviseChildController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
	$rootScope.userOr = true;
	$rootScope.currentmodule = "监管机构管理";
	$rootScope.sections = {
		model: false,
		child: true,
		operate: false,
		user: false
	};
	$scope.localStorageHad=function(){
		if(!$localStorage.userInfo){
			return $state.go('website.home');
		}
	}
	$scope.localStorageHad();
	$scope.option = function($event, num, type) {
		$rootScope.fixWrapShow = false;
		$scope[type + 'List'] = false;
		$scope[type] = $($event.target).html();
		$scope[type + 'Id'] = $($event.target).attr('data-id');
		$scope.getList();
	}

	$scope.accountTypeId = "";
	$scope.openId = "";
	$scope.testId = "";
	$scope.keywords = "";
	$scope.pageNo = 1;
	$scope.pageSize = 8;

	$scope.getList = function() {
        $scope.loading2 = true;
		var data = {
			commercialUse: $scope.accountTypeId,
			enable: $scope.openId,
			trial: $scope.testId,
			keyword: $scope.keywords,
			tenantId: $stateParams.id,
            tenantType:2,
			pageNo: $scope.pageNo,
			pageSize: $scope.pageSize,
		}

		$.ajax({
			type: 'get',
			url: '/sys/tenant/index/list',
			contentType: "application/json;charset=UTF-8",
			data: data,
			complete: function(res) {
				if(res.responseJSON.code == 200) {
                    $scope.loading2 = false;
					var data = res.responseJSON.data.records;
					$scope.pageInfo = res.responseJSON.data;
                    $scope.pageInfo.pstyle = 2;
					for(var i = 0;i<data.length;i++){
                        if(data[i].expireTime){
                            data[i].expireTime = data[i].expireTime.slice(0,10);
                        }else{
                            data[i].expireTime = '永久有效';
                        }
                        // data[i].expireTime && (data[i].expireTime = data[i].expireTime.slice(0,10));
                        data[i].createTime && (data[i].createTime = data[i].createTime.slice(0,10));
					}
                    $scope.tdData = data;

					$scope.$apply();
				}
			}
		})
	};

	$scope.pagination = function(page, pageSize) {
		$scope.pageNo = page;
		$scope.pageSize = pageSize;
		$scope.getList();
	};

	$scope.getList();

	$scope.optionList = false;

	$scope.alertChildCon = false;
	$scope.orgId = 235;
	$scope.orgName = "浙江省第一人民医院";
	$scope.layerImg = "../../../res/img/wh.png";
	$scope.operate = ["删除", "停用", '恢复'];
	$scope.orgOperate = "停用";
	$scope.tips = ["删除机构后,下级机构将一并删除且无法恢复，请谨慎操作！", "停用机构将导致机构对应后台用户均不可登陆，该机构及下级机构后台页面不可访问，请谨慎操作。"];
	$scope.orgTip = "停用机构将导致机构对应后台用户均不可登陆，该机构及下级机构后台页面不可访问，请谨慎操作。";

	$scope.accountTypeList = false;
	$scope.testList = false;
	$scope.openList = false;
	$scope.operateList = false;
	$scope.accountType = '账户类型';
	$scope.open = '开通状态';
	$scope.test = '是否测试';
	$scope.operateModel = '更多操作';
	$scope.model = '快速延期';

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
						$scope.getList();
					}
				}
			});
		}

	};

	$scope.lookDetail = function (e) {
        var id = $(e.target).attr("data-id");
        var url = $state.href('org.superviseDetail', {id: id});
        window.open(url, '_blank');
	}

	$scope.showMoreOpt = function(i) {
		$scope.menuHide();
		$scope['operateList' + i] = !$scope['operateList' + i];
		$rootScope.fixWrapShow = true;
	}
	$scope.listShow = function(str) {
			$scope.menuHide();
			$scope[str] = true;
			$rootScope.fixWrapShow = true;
		}
		/*遮罩*/
	$rootScope.fixWrapShow = false;
	$scope.menuHide = function() {
		$rootScope.fixWrapShow = false;

		$scope.accountTypeList = false;
		$scope.testList = false;
		$scope.openList = false;
		$scope.operateList = false;

		for(var i = 0, len = $scope.tdData.length; i < len; i++) {
			$scope['operateList' + i] = false;
		};
	}
	$scope.optionType = $localStorage.baseOrg.tenantAccountType;
	$scope.optionState = [{
		id: 1,
		name: '启用中'
	}, {
		id: 0,
		name: '已停用'
	}];
	$scope.optionTest = $localStorage.baseOrg.tenantTrial;
	$scope.tdData = [

	];
}]);