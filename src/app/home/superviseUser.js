'use strict';

angular.module('app')

.controller('huserController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {

    //底部高度设置，使其占满剩余全部
    $scope.resetBottomHeight = function () {
        var height = angular.element('.org-body .sectionWrap').css('height','100%').height();
        var topHighe = angular.element('.org-title').height();
        var middleHighe = angular.element('.org-body .headWrap').height();

        angular.element('.org-body .sectionWrap').css('height','inherit');
        angular.element('.org-body .sectionWrap').css('min-height',height-134-middleHighe);
    }

    $scope.resetBottomHeight();

	$rootScope.userOr = true;
    $rootScope.currentmodule = "平台首页";
	$rootScope.sections = {
		model: false,
		child: false,
		operate: false,
		user: true
	};

	//下拉框筛选
	$scope.optionBar = [{
		id: '',
		name: '用户状态'
	}, {
		id: true,
		name: '启用中'
	}, {
		id: false,
		name: '已停用'
	}];
	$scope.optionUserOpt = [{
		name: '修改密码'
	}, {
		name: '删除账号'
	}, {
		name: '停用账号'
	}];
	$scope.tdData = [];

	$scope.modelId = '';

	//修改密码
	$scope.userPwd = '';
	$scope.userPwdAgain = '';

	$scope.getList = function() {
		$scope.loading2 = true;
		$.ajax({
			type: 'get',
			url: '/sys/user/users/tenantId',
			contentType: "application/json;charset=UTF-8",
			data: {
				tenantId: $stateParams.id,
				enable: $scope.modelId,
				pageNo: $scope.pageNo || 1,
				pageSize: $scope.pageSize || 8
			},
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					$scope.loading2 = false;
					var data = res.responseJSON.data.records;
					// $scope.pageInfo = res.responseJSON.data;
					$scope.pageInfo = res.responseJSON.data;
					$scope.pageInfo.pstyle = 2;
					for(var i = 0; i < data.length; i++) {
						data[i].lastLoginTime && (data[i].lastLoginTime = $scope.disposeTime(data[i].lastLoginTime));
						data[i].createTime && (data[i].createTime = data[i].createTime.slice(0, 10));
					}
					$scope.tdData = data;

					$scope.$apply();
				}
			}
		})
	};

	$scope.getList();
	$scope.pagination = function(page, pageSize) {
		$scope.pageNo = page;
		$scope.pageSize = pageSize;
		$scope.getList();
	};

	//时间处理
	$scope.disposeTime = function(t) {
		var date = new Date(t);
		return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	}

	$scope.pswMod = false;
	$scope.optionList = false;
	$scope.model = '用户状态';
	$scope.alertChildCon = false;
	$scope.userId = 0;
	$scope.orgName = "浙江省第一人民医院";
	$scope.layerImg = "../../../res/img/wh.png";
	$scope.operate = ["修改", "停用", "删除", '恢复'];
	$scope.orgOperate = "停用";
	// $scope.tips = ["删除机构后,下级机构将一并删除且无法恢复，请谨慎操作！","  "];
	$scope.orgTip = "删除用户后无法恢复，请谨慎操作！";

	$scope.option = function(item) {
		$rootScope.fixWrapShow = false;
		$scope.optionList = false;
		$scope.model = item.name;
		$scope.modelId = item.id;
        $scope.pageNo = 1;
		$scope.getList();
	}

	$scope.alertLayer = function(i, item, n) {
		$rootScope.fixWrapShow = false;
		$scope['operateList' + i] = false;
		$scope.orgOperate = $scope.operate[n];
		// $scope.orgTip = $scope.tips[n];
		$scope.userId = item.id;
		$scope.orgName = item.name;
		var content = $('#alertOrgChild');
		var alertTip = $('.alertTip');
		if(n == 0) {
			$scope.pswMod = true;
			$scope.layerImg = "../../../res/img/icon20.png";
			alertTip.find('span').css('textAlign', "center");
			var index = layer.open({
				time: 0, //不自动关闭
				type: 1,
				content: $('#modifyPsw'),
				title: ['修改密码', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
				closeBtn: 1,
				shade: 0.3,
				shadeClose: true,
				btn: 0,
				area: ['616px', '258px']
			});

			//修改用户密码
			$scope.changePwd = function() {
				if(!$scope.userPwd) {
					$scope.pwdNull = true;
					$scope.userPwdMsg = '不能为空';
					return;
				} else if($scope.userPwd.length < 8 || $scope.userPwd.length > 16) {
					$scope.pwdNull = true;
					$scope.userPwdMsg = '密码长度为8-16位字符';
					return;
				} else {
					$scope.pwdNull = false;
				}

				if(!$scope.userPwdAgain) {
					$scope.pwd2Null = true;
					$scope.userPwd2Msg = '不能为空';
					return;
				} else if($scope.userPwd != $scope.userPwdAgain) {
					$scope.pwd2Null = true;
					$scope.userPwd2Msg = '两次密码不一致';
					return;
				} else {
					$scope.pwd2Null = false;
				}

				$.ajax({
					type: 'post',
					url: '/sys/user/' + item.id + '/changePwd',
					data: $scope.userPwd,
					contentType: "application/json;charset=UTF-8",
					complete: function(res) {
						if(res.responseJSON.code == 200) {
							layer.msg('<div class="toaster"><span>修改成功</span></div>', {
								area: ['100%', '60px'],
								time: 3000,
								offset: 'b',
								shadeClose: true,
								shade: 0
							});
							layer.close(index);
							$scope.getList();
						}
					}
				});
			}
			return;
		} else if(n == 2) {
			$scope.alertChildCon = true;
			$scope.layerImg = "../../../res/img/icon20.png";
			alertTip.css('height', '50px');
			$scope.orgTip = "删除用户后无法恢复，请谨慎操作！";
			alertTip.find('span').css('textAlign', "center");
		} else {
			$scope.alertChildCon = true;
			$scope.orgTip = '';
			alertTip.css('height', '12px');
			$scope.layerImg = "../../../res/img/wh.png";
		}
		var index = layer.open({
			time: 0 //不自动关闭
				,
			type: 1,
			content: content,
			title: ['提示', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
			closeBtn: 1,
			shade: 0.3,
			shadeClose: true,
			btn: 0,
			area: ['540px', n == 1 || n == 3 ? '250px' : '287px']
		});

		//停用或删除机构
		$scope.operateOrg = function() {
			var url = '',
				type = 'post';

			switch(n) {
				case 1:
					url = '/sys/user/disable/' + item.id;
					break;
				case 2:
					url = '/sys/user/delete/' + item.id;
					type = 'delete';
					break;
				case 3:
					url = '/sys/user/recover/' + item.id;
					break;
			}

			$.ajax({
				type: type,
				url: url,
				contentType: "application/json;charset=UTF-8",
				complete: function(res) {
					if(res.responseJSON.code == 200) {
						layer.msg('<div class="toaster"><span>' + $scope.operate[n] + '成功</span></div>', {
							area: ['100%', '60px'],
							time: 3000,
							offset: 'b',
							shadeClose: true,
							shade: 0
						});
						layer.close(index);
						$scope.getList();
					}
				}
			});
		}
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

		$scope.optionList = false;
		$scope.operateList = false;

		for(var i = 0, len = $scope.tdData.length; i < len; i++) {
			$scope['operateList' + i] = false;
		};
	}

}]);