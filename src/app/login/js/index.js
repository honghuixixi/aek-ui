'use strict';
angular.module('app')
	.controller('loginController', ['$rootScope', '$scope', '$http', '$state', '$localStorage', '$location', '$interval', function($rootScope, $scope, $http, $state, $localStorage, $location, $interval) {
		var time = new Date().getTime();
		if($localStorage["X-AEK56-Token"]) {
			var time = new Date().getTime();
			if($localStorage["expire"] > time) {
				$state.go('home.use')
			} else {
				$localStorage["X-AEK56-Token"] = '';
				$localStorage["TOKEN_TYPE"] = '';
				$localStorage["expire"] = '';
			}
		}
		$scope.first = true
		$scope.two = false
		$scope.resetPassword = false
		$scope.userlogin = true
		$scope.msg = ''
		$scope.msg2 = ''
		$scope.countdown = '获取验证码'
		$scope.countdown2 = '获取验证码'
		$scope.isdaojishi = false
		$scope.isdaojishi2 = false
		$scope.notexit = false
		$scope.notexit2 = false
		$scope.shixiao = false
		$scope.error = false;
		//暂时 代替 设备id
		$scope.S4 = function() {
			return(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
		$scope.getUid = function() {
			return($scope.S4() + $scope.S4() + "-" + $scope.S4() + "-" + $scope.S4() + "-" + $scope.S4() + "-" + $scope.S4() + $scope.S4() + $scope.S4());
		}
		$scope.user = {
			username: '',
			password: '',
			deviceId: $scope.getUid() //生成唯一标识
		};
		// 短信表单
		$scope.messageInfo = {
			message: '',
			mobile: '',
			deviceId: $scope.getUid() //生成唯一标识
		}
		$scope.resetInfo = {
			newphone: '',
			newpassword: '',
			newmessage: '',
			deviceId: $scope.getUid() //生成唯一标识
		}
		$scope.telEmail = /(^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$)|(^1[3|4|5|8|7]\d{9}$)/;
		// 切换密码和短信效果
		$scope.change = function($event) {
			$scope.first = true;
			$scope.two = false;
			$scope.msg = false;
			angular.element('.line').animate({
				'left': '100px'
			})
			angular.element($event.target).css('color', '#666')
			angular.element('.two').css('color', '#999')
			$scope.user.username = '';
			$scope.user.password = '';
			$scope.resetInfo.newphone = '';
			$scope.resetInfo.newpassword = '';
			$scope.resetInfo.newmessage = '';
		};
		$scope.message = function($event) {
			$scope.first = false
			$scope.two = true
			$scope.notexit = false
			$scope.msg2 = false
			angular.element('.line').animate({
				'left': '200px'
			})
			angular.element($event.target).css('color', '#666')
			angular.element('.first').css('color', '#999')
			$scope.messageInfo.message = '';
			$scope.messageInfo.mobile = '';
		};
		// 重置密码跟登录切换效果
		$scope.reset = function() {
			$scope.userlogin = false
			$scope.resetPassword = true
			$scope.user.username = '';
			$scope.user.password = '';
			$scope.resetInfo.newphone = '';
			$scope.resetInfo.newpassword = '';
			$scope.resetInfo.newmessage = '';
			$scope.notexit2 = false
			$scope.shixiao = false
		};
		$scope.return = function() {
			$scope.userlogin = true
			$scope.resetPassword = false
			$scope.msg = false
		}

		// 密码登录
		$scope.login = function() {
				var _data = JSON.stringify($scope.user);
				$.ajax({
					url: '/oauth/auth',
					contentType: "application/json;charset=UTF-8",
					data: _data,
					type: 'post'
				}).then(function(result) {
					var time = new Date().getTime();
					var code = result.code;
					// 已登录
					if(code == 402) {
						$state.go('home.use');
						return null;
					} else if(code == 200) {
						// 登录成功
						var rep = result.description;
						$localStorage["X-AEK56-Token"] = result.token;
						// $localStorage["X-AEK56-Token"] = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzU2NjY2NjY2NiIsImF1ZCI6IndlYiIsImlzcyI6ImFlazU2IiwiZXhwIjoxNDk4MjAzODA4LCJkZXZpY2VJZCI6IjExMDMzMzMzMzM0NDQ0In0.0dBc17SxsF9F0IPJlvtO2IjHhhkqzgPaBwd2ZyF5cucdG7h0iCxqUTjicNkFCMK07TvWWdxBsKNTVsw5z__Okw';
						$localStorage["TOKEN_TYPE"] = result.token_type;
						$localStorage["expire"] = result.expire;
						$.ajax({
							// url: '/apis/perms',
							url: '/oauth/cache/permission/list',
							async:false,
							type: 'post'
						}).then(function(res) {
							//解决无权限时该字段为null，无法使用indexOf方法进行权限判断的问题
							if(!res.authoritiesStr){
								res.authoritiesStr = '无';
							}
							$localStorage.userInfo = res;
							//登录时记录当前机构id和机构名，提供全局使用并切换
							$localStorage.userInfo.nowOrgId = $localStorage.userInfo.tenantId;
							$localStorage.userInfo.nowOrgName = $localStorage.userInfo.tenantName;
                            $localStorage.userInfo.nowOrgType = $localStorage.userInfo.tenantType;

							$rootScope.userInfo = $localStorage.userInfo;
							$rootScope.meau = $rootScope.userInfo.modules.length ? true : false;

							$scope.getBaseOrg();
							$state.go('home.use', {
								id: $rootScope.userInfo.tenantId
							});
							$rootScope.$apply();
						})

						return null;
					} else {
						// 密码错误
						$scope.msg = result.msg;
					}
					$rootScope.$apply();
				});
			}
			// 发送验证码
		$scope.code = function($event) {
				var _data = {
					"mobile": $scope.messageInfo.mobile,
					"deviceId": $scope.messageInfo.deviceId
				};
				$.ajax({
					url: '/oauth/sendLoginPwd',
					contentType: "application/x-www-form-urlencoded",
					data: _data,
					type: 'post'
				}).then(function(data) {
					if(data.code == 409) {
						// 用户不存在
						$scope.notexit = data.msg
					} else if(data.code == 200) {
						angular.element($event.target).prop('disabled', true)
							// 发送成功以后，颜色变灰
						$scope.isdaojishi = true
						$scope.countdown = 59
						$interval(
							function() {
								$scope.countdown--
									if($scope.countdown == 0) {
										$scope.countdown = '获取验证码'
										$scope.isdaojishi = false
										angular.element($event.target).prop('disabled', false)
									}
							}, 1000, 59)
					} else {
						$scope.msg2 = data.msg
					}
					$rootScope.$apply();
				});
			}
			// 短信登录
		$scope.submit2 = function() {
				var message = {
					username: $scope.messageInfo.mobile,
					deviceId: $scope.messageInfo.deviceId,
					password: $scope.messageInfo.message
				};
				var _data = JSON.stringify(message)
				$.ajax({
					url: '/oauth/auth',
					contentType: "application/json;charset=UTF-8",
					data: _data,
					type: 'post'
				}).then(function(result) {
					var time = new Date().getTime();
					var code = result.code;
					if(code == 402) {
						$state.go('home.use');
						return null;
					} else if(code == 200) {
						var rep = result.description;
						$localStorage["X-AEK56-Token"] = result.token;
						$localStorage["TOKEN_TYPE"] = result.token_type;
						$localStorage["expire"] = result.expire;
						$.ajax({
							// url: '/apis/perms',
							url: '/oauth/cache/permission/list',
							type: 'post'
						}).then(function(res) {
                            //解决无权限时该字段为null，无法使用indexOf方法进行权限判断的问题
                            if(!res.authoritiesStr){
                                res.authoritiesStr = '无';
                            }
							$localStorage.userInfo = res
							$rootScope.userInfo = $localStorage.userInfo;
                            $localStorage.userInfo.nowOrgId = $localStorage.userInfo.tenantId;
                            $localStorage.userInfo.nowOrgName = $localStorage.userInfo.tenantName;
                            $localStorage.userInfo.nowOrgType = $localStorage.userInfo.tenantType;

                            $rootScope.userInfo = $localStorage.userInfo;
                            $rootScope.meau = $rootScope.userInfo.modules.length ? true : false;


							$scope.getBaseOrg();
							$state.go('home.use', {
								id: $rootScope.userInfo.tenantId
							});
							$rootScope.$apply()
						})

						return null;
					} else {
						$scope.msg2 = result.msg;
					}
				});
			}
			// 重置密码
			//获取验证码
		$scope.code2 = function($event) {
				var _data = {
					"account": $scope.resetInfo.newphone
				};
				$.ajax({
					url: '/sys/index/sendCode',
					data: _data,
					type: 'get'
				}).then(function(data) {
					if(data.code == "U_009") {
						// 用户不存在
						$scope.notexit2 = data.msg
					} else if(data.code == 200) {
						// 发送成功
						angular.element($event.target).prop('disabled', true)
							// 发送成功以后，颜色变灰
						$scope.isdaojishi2 = true
						$scope.countdown2 = 59
						$interval(
							function() {
								$scope.countdown2--
									if($scope.countdown2 == 0) {
										$scope.countdown2 = '获取验证码'
										$scope.isdaojishi2 = false
										angular.element($event.target).prop('disabled', false)
									}
							}, 1000, 59)
					} else {
						$scope.shixiao = data.msg
					}
					$rootScope.$apply();
				});
			}
			// 重置密码请求
		$scope.submit3 = function($event) {
				var _data = {
					"account": $scope.resetInfo.newphone,
					"code": $scope.resetInfo.newmessage,
					"password": $scope.resetInfo.newpassword
				};
				$.ajax({
					url: '/sys/index/resetPassword',
					contentType: "application/x-www-form-urlencoded",
					data: _data,
					type: 'get'
				}).then(function(data) {
					// 重置密码成功跳到密码登录
					if(data.code == 200) {
						$scope.resetPassword = false;
						$scope.userlogin = true;
					} else {
						$scope.shixiao = data.msg
					}
					$rootScope.$apply();
				});
			}
			// 重置密码的时候，提示消失
			// 用户不存在
		$scope.change2 = function() {
				$scope.notexit2 = false
			}
			// 验证码失效提示
		$scope.change3 = function() {
				$scope.shixiao = false
			}
			// 密码登录的时候，密码提示消失
		$scope.change1 = function() {
				$scope.msg = false
			}
			// 短信登录的提示消失
			// 用户不存在
		$scope.change4 = function() {
				$scope.notexit = false
			}
			// 验证码不对
		$scope.change5 = function() {
			$scope.msg2 = false
		}
	}]);