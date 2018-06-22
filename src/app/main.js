'use strict';

var app = angular.module('app', ['ui.load', 'ui.router', 'ngStorage', 'brantwills.paging', 'ngSanitize', 'ui.select', 'cw.paging', 'oc.lazyLoad', 'ngImgCrop', 'ay.navlist', 'ngSanitize', 'angularFileUpload']);
// 下载链接编码
angular.module('app').filter('downloadUrlFilter', function () {
	return function (src) {
		return encodeURI(encodeURI('/api/download?path=' + src));
	};
});

/* Controllers */
angular.module('app')
	.controller('AppCtrl', ['$scope', '$localStorage', '$sessionStorage', '$window', '$http', '$state', '$rootScope', '$stateParams',
		function ($scope, $localStorage, $sessionStorage, $window, $http, $state, $rootScope, $stateParams) {
			// add 'ie' classes to html
			$scope.ishovero = false;
			$scope.ishovert = false;
			$scope.ishovere = false;
			$scope.ishoverf = false;
			$scope.ishoverr = false;
			// modules link limit power 
			$scope.modulesLink = function (a) {
				if (a.url == 'inspection.plan.list') {
					if ($localStorage.userInfo.authoritiesStr.indexOf('QC_PLAN_VIEW') != -1)
						return $state.go(a.url, { tenantId: $stateParams.tenantId || $localStorage.userInfo.tenantId }, { reload: true });
					if ($localStorage.userInfo.authoritiesStr.indexOf('QC_PLAN_IMPLEMENT') != -1)
						return $state.go('inspection.implement.list', { tenantId: $stateParams.tenantId || $localStorage.userInfo.tenantId }, { reload: true });
					if ($localStorage.userInfo.authoritiesStr.indexOf('QC_TEMPLATE_VIEW') != -1)
						return $state.go('inspection.model.list', { tenantId: $stateParams.tenantId || $localStorage.userInfo.tenantId }, { reload: true });
					if ($localStorage.userInfo.authoritiesStr.indexOf('QC_REPORT_VIEW') != -1)
						return $state.go('inspection.report', { tenantId: $stateParams.tenantId || $localStorage.userInfo.tenantId }, { reload: true });
				} else {
					return $state.go(a.url, { id: $stateParams.loginId, tenantId: $stateParams.tenantId || $localStorage.userInfo.tenantId }, { reload: true });
				}
			}
			$scope.localStorageHad = function () {
				if (!$localStorage.userInfo) {
					return $state.go('website.home');
				}
			}
			$scope.localStorageHad();
			var isIE = !!navigator.userAgent.match(/MSIE/i);
			isIE && angular.element($window.document.body).addClass('ie');
			isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
			// config
			$scope.app = {
				name: 'aek',
				version: '0.0.1',
				// for chart colors
				color: {
					primary: '#7266ba',
					info: '#23b7e5',
					success: '#27c24c',
					warning: '#fad733',
					danger: '#f05050',
					light: '#e8eff0',
					dark: '#3a3f51',
					black: '#1c2b36'
				},
				settings: {
					themeID: 1,
					navbarHeaderColor: 'bg-black-only',
					navbarCollapseColor: 'bg-dark-blue-only',
					asideColor: 'bg-black',
					headerFixed: true,
					asideFixed: true,
					asideFolded: false,
					asideDock: false,
					container: false,
					PIC_URL: "http://dev.aek.com:8087"
					// API_URL: 'http://192.168.3.134:8081/'
				}
			}
			$scope.defaultAvatar = $rootScope.defaultAvatar = 'res/img/np.png';
			$rootScope.userInfo = $localStorage.userInfo;
			if ($rootScope.userInfo && !$rootScope.userInfo.authoritiesStr) {
				$rootScope.userInfo.authoritiesStr = '';
			}
			//  scroll to 
			$scope.scrollTO = function () {
				if ($state.current.name.search('website.home') < 0) {
					$localStorage.websitego = true;
					return $state.go('website.home');
				}
				$stateParams.booleans && window.scrollTo(0, 1550);
			}
			// head msg 
			$scope.msgSession = 0;
			$scope.session0 = [];
			$scope.session1 = [];
			$rootScope.statusList = [];
			$rootScope.msgList = [];
			$rootScope.msgAlertShow = false;
			$rootScope.msgManageShow = false;
			$scope.msgSessionC = function (a) {
				$scope.msgSession = a;
				(a == 0) && $scope.waitDoGet();
				(a == 1) && $scope.msgGet();
			}
			$scope.msgHrefGoMore = function () {
				var url = $state.href('info.things', { status: $scope.msgSession, tenantId: ($stateParams.tenantId || $localStorage.userInfo.tenantId) });
				window.open(url, '_blank');
			}
			$scope.msgHrefGo = function (a, b) {
				$rootScope.msgAlertShow = false;
				$rootScope.msgManageShow = false;
				$scope.adjustMsg(a, b);
			}
			$scope.msgManageAlert = function () {
				$rootScope.msgManageShow = true;
				$rootScope.msgAlertShow = true;
				$scope.msgSession = 0;
				$scope.waitDoList = [];
				$scope.waitDoGet();
			}
			$scope.msgWrapClick = function () {
				$rootScope.msgAlertShow = false;
				$rootScope.msgManageShow = false;
			}
			$scope.waitDoTxtList = [{
				title: '维修管理-待接单',
				des: '个维修单需要接单',
				moduleId: 5,
				module: '维修管理'
			}, {
				title: '维修管理-维修中',
				des: '个维修单需要维修',
				moduleId: 5,
				module: '维修管理'
			}, {
				title: '维修管理-待验收',
				des: '个维修单需要验收',
				moduleId: 5,
				module: '维修管理'
			}, {
				title: '维修管理-单据审批',
				des: '条维修单据需要审批',
				moduleId: 5,
				module: '维修管理'
			}, {
				title: '巡检管理-待巡检',
				des: '条巡检计划需要巡检',
				moduleId: 6,
				module: '巡检管理'
			}, {
				title: 'PM管理-待实施',
				des: '条PM实施需要实施',
				moduleId: 7,
				module: 'PM管理'
			}, {
				title: '转科管理-待审核',
				des: '条转科单需要审核',
				moduleId: 4,
				module: '资产管理'
			}, {
				title: '报损管理-待审核',
				des: '条报损单需要审核',
				moduleId: 4,
				module: '资产管理'
			}, {
				title: '巡检管理-待验收',
				des: '条报告单需要验收',
				moduleId: 6,
				module: '巡检管理'
			}, {
				title: 'PM管理-待验收',
				des: '条报告单需要验收',
				moduleId: 7,
				module: 'PM管理'
			}, {
				title: '质控管理-待审核',
				des: '条质控申报单需要审核',
				moduleId: 15,
				module: '质控管理'
			}];
			// 根据实施ID获取计划ID
			$scope.getPlanId = function (a) {
				$.ajax({
					type: 'get',
					url: '/qc/qcImplement/getPlanId/' + a.moduleId,
					complete: function (res) {
						if (res.responseJSON.code == 200) {
							var url = $state.href(a.url, { tenantId: ($stateParams.tenantId || $localStorage.userInfo.tenantId), id: a.moduleId, planId: res.responseJSON.data });
							window.open(url, '_blank');
						} else {
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
			// 代办/消息/公告 验证
			$scope.adjustMsg = function (a, b) {
				$.ajax({
					type: 'get',
					url: '/sys/user/checkAll',
					data: {
						tab: a,
						permissionId: b.status
					},
					complete: function (res) {
						if (res.responseJSON.code == 200) {
							var url;
							if (a == 2) {
								$.ajax({
									type: 'get',
									url: '/newrepair/repMessageReceive/read/' + b.id,
									complete: function (res) {
										if (res.responseJSON.code == 200) {
											var obj = {
												tenantId: ($stateParams.tenantId || $localStorage.userInfo.tenantId)
											};
											(b.status == 1) && (obj.applyId = b.moduleId) && (obj.status = 4);
											(b.status == 2) && (obj.billApplyId = b.moduleId);
											(b.status == 3) && (obj.planId = b.moduleId);
											if (b.status == 4) {
												return $scope.getPlanId(b);
											}
											(b.status == 5) && (obj.id = b.moduleId);
											(b.status == 6) && (obj.id = b.moduleId);
											(b.status == 7) && (obj.billId = b.moduleId);
											(b.status == 8) && (obj.billId = b.moduleId);
											(b.status == 9) && (obj.id = b.moduleId);
											url = $state.href(b.url, obj);
											// console.log(b, obj);
											window.open(url, '_blank');
										} else {
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
							} else {
								url = $state.href(b.url, { status: b.cs, tenantId: ($stateParams.tenantId || $localStorage.userInfo.tenantId), msgIndex: b.cs });
								// console.log(url);
								window.open(url, '_blank');
							}
						} else {
							var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
								area: ['100%', '60px'],
								time: 3000,
								offset: 'b',
								shadeClose: true,
								shade: 0
							});
							if (res.responseJSON.code == 202) {
								setTimeout(function () {
									// 跳转登录页
									$localStorage.$reset();
									$state.go('access.login', null, { reload: true });
								}, 3000);
							}
						}
						$rootScope.$apply();
					}
				});
			}
			$scope.waitDoGet = function () {
				$.ajax({
					type: 'get',
					url: '/newrepair/repRepairApply/waitToDo',
					complete: function (res) {
						if (res.responseJSON.code == 200) {
							$scope.waitDoList = [];
							for (var i = 0; i < res.responseJSON.data.length; i++) {
								$scope.waitDoList.push($.extend($scope.waitDoTxtList[res.responseJSON.data[i].status - 1], res.responseJSON.data[i]));
							};
						} else {
							var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
								area: ['100%', '60px'],
								time: 3000,
								offset: 'b',
								shadeClose: true,
								shade: 0
							});
						}
						$rootScope.$apply();
					}
				});
			}
			$scope.msgGet = function () {
				$.ajax({
					type: 'get',
					url: '/newrepair/repMessageReceive/search',
					data: {
						pageSize: 10,
						messageStatus: 0
					},
					complete: function (res) {
						if (res.responseJSON.code == 200) {
							$rootScope.msgList = res.responseJSON.data.records;
						} else {
							var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
								area: ['100%', '60px'],
								time: 3000,
								offset: 'b',
								shadeClose: true,
								shade: 0
							});
						}
						$rootScope.$apply();
					}
				});
			}
			$scope.readAll = function () {
				$.ajax({
					type: 'get',
					url: '/newrepair/repMessageReceive/readAll',
					complete: function (res) {
						if (res.responseJSON.code == 200) {
							$.ajax({
								type: 'get',
								url: '/newrepair/repMessageReceive/search',
								data: {
									pageSize: 10,
									messageStatus: 0
								},
								complete: function (res) {
									if (res.responseJSON.code == 200) {
										$rootScope.msgList = res.responseJSON.data.records;
									} else {
										var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
											area: ['100%', '60px'],
											time: 3000,
											offset: 'b',
											shadeClose: true,
											shade: 0
										});
									}
									$rootScope.$apply();
								}
							});
						} else {
							var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
								area: ['100%', '60px'],
								time: 3000,
								offset: 'b',
								shadeClose: true,
								shade: 0
							});
						}
						$rootScope.$apply();
					}
				});
			}

			$scope.width1024pxFc = function () {
				var clientWidth = 0;
				if (document.body.clientWidth && document.documentElement.clientWidth) {
					clientWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
				}
				else {
					clientWidth = (document.body.clientWidth > document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
				}
				(clientWidth < 1366) && ($rootScope.width1024px = true);
			}
			$scope.width1024pxFc(0)

			$scope.enterback = function () {
				(!$localStorage.userInfo) && ($state.go('access.login', null, { reload: true }));
				$localStorage.userInfo && ($state.go('home.general', { tenantId: $localStorage.userInfo.tenantId }));
			}
			$rootScope.meau = true;
			$scope.NewLogout = function () {
				$.ajax({
					type: 'post',
					//url: '/oauth/logout',
					url: '/oauth/logout-success',
					contentType: "application/json;charset=UTF-8"
				}).then(function (result) {
					if (result.code == 200) {
						$localStorage.$reset();
						delCookie('X-AEK56-Token');
						$state.go('website.home');
					}
				});
				// 鼠标经过变换
				$scope.over = function ($event) {
					// angular.element($event.target)
				}

				function deleteUserInfo() {
					$.cookie('_ihome_uid', null);
				}
			}

			$localStorage.settings = $scope.app.settings;

			//弹框提示
			$scope.layerWinOpen = function (type, data, callback, content) {
				var msg = '';
				switch (type) {
					case 'submit':
						msg = '提交后不可再修改，您确定提交吗？';
						break;
					case 'save':
						msg = '是否保存？';
						break;
					case 'delete':
						msg = '是否删除？';
						break;
					case 'print':
						msg = '是否打印？';
						break;
					case 'remind':
						msg = '是否提醒？';
						break;
					case 'pass':
						msg = '是否通过？';
						break;
					case 'noPass':
						msg = '是否不通过？';
						break;
					case 'again':
						msg = '是否重新操作？';
						break;
					case 'account':
						msg = '是否记账？';
						break;
					case 'audit':
						msg = '是否审核？';
						break;
					case 'alert':
						msg = content;
						break;
				}

				var index = layer.open({
					time: 0 //不自动关闭
					,
					content: '<div class="pad-fifty">' + msg + '</div>',
					title: ['提示', 'font-size: 14px;color: #fff;background-color: #000;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
					closeBtn: 1,
					shade: 0.3,
					shadeClose: true,
					btn: ['确定', '取消'],
					yes: function (index) {
						callback && callback(data);
						layer.close(index);
					},
					area: ['500px', '220px'],
					btnAlign: 'c'
				});
				layer.style(index, {
					fontSize: '16px',
					backgroundColor: '#fff',
				});
			}

			$localStorage.settings = $scope.app.settings;

			$scope.$watch('app.settings', function () {
				if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
					// aside dock and fixed must set the header fixed.
					$scope.app.settings.headerFixed = true;
				}
				// save to local storage
				$localStorage.settings = $scope.app.settings;
			}, true);

			function isSmartDevice($window) {
				// Adapted from http://www.detectmobilebrowsers.com
				var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
				// Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
				return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
			}

			/*全局配置*/

			$.ajaxSetup({
				type: "POST",
				beforeSend: function (evt, request) {
					//var currModule=  request.url.split("/")[1];
					//request.url = currModule=='api_v3' ? "/api" + request.url: "/api/" +currModule+ request.url;
					request.url = "/api" + request.url;
					var authToken = $localStorage["X-AEK56-Token"] || '';
					if (authToken) {
						evt.setRequestHeader("X-AEK56-Token", authToken);
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					//判断
					if (!$localStorage["X-AEK56-Token"]) {
						$localStorage.$reset();
						$state.go('access.login', null, { reload: true });
					}
					switch (jqXHR.status) {
						case (404):
							alert("未找到请求的资源");
							break;
						// case(500):
						// 	var msg = jqXHR.responseJSON.message;
						// 	if(msg == 'EXIT') {
						// 		$localStorage.$reset();
						// 		$state.go('access.login');
						// 	} else if(msg == 'LOAD') {
						// 		$.ajax({
						// 			url: '/api_v3/cache/permission/list',
						// 			type: 'post'
						// 		}).then(function(res) {
						// 			//重新拉取权限
						// 			$localStorage.userInfo = res;
						// 			$rootScope.userInfo = $localStorage.userInfo;
						// 			$rootScope.meau = $rootScope.userInfo.modules.length ? true : false;
						// 			$localStorage.userInfo.nowOrgName = $localStorage.userInfo.tenantName;
						// 			$rootScope.$apply();
						// 		})
						// 	}
						// 	break;
						default:
							layer.closeAll();
							var msg = layer.msg('<div class="toaster"><span>网络连接故障，请刷新重试</span></div>', {
								area: ['100%', '60px'],
								time: 3000,
								offset: 'b',
								shadeClose: true,
								shade: 0
							});
							break;
					}

				}
			});

			$scope.getPerMissionlist = function (tenantId, callback) {
				$.ajax({
					url: '/oauth/cache/permission/list',
					data: {
						"tenantId": tenantId || '',
					},
					async: false,
					type: 'post',
					complete: function (res) {
						if (res.status == 200) {
							$localStorage.userInfo.authoritiesStr = res.responseJSON.authoritiesStr;
							$localStorage.userInfo.modules = res.responseJSON.modules;
							/*当前页面的权限*/
							$sessionStorage.authoritiesStr = res.responseJSON.authoritiesStr;
							$sessionStorage.modules = res.responseJSON.modules;


							//解决无权限时该字段为null，无法使用indexOf方法进行权限判断的问题
							if (!$localStorage.userInfo.authoritiesStr) {
								$localStorage.userInfo.authoritiesStr = '无';
							}
							$rootScope.userInfo = $localStorage.userInfo;
							callback && callback();
						}
					}
				})

			}

			// diaowen
			$scope.diaowen = function (a) {
				window.location.href = a;
			}

			function mainGetMsg() {
				timerOut = setTimeout(function () {
					clearTimeout(timerOut);
					$.ajax({
						url: '/newrepair/repMessageReceive/find',
						type: 'get',
						complete: function (res) {
							if (res.responseJSON) {
								if (res.responseJSON.code == 200) {
									$rootScope.unreadMsg = res.responseJSON.data;
									$rootScope.unreadMsg > 9 ? $rootScope.repairMsgEven = true : ($rootScope.unreadMsg == 0 ? $rootScope.unreadMsg = null : 1);
								}
							}
						}
					});
					mainGetMsg();
				}, 180000);
			};
			if ((location.href.indexOf('#/access/login') <= -1) && (location.href.indexOf('#/website/') <= -1 && $state.current.name)) {
				// $scope.waitDoGet();
				$.ajax({
					url: '/oauth/cache/permission/list',
					async: false,
					data: {
						tenantId: $sessionStorage.currentPageTenantId || ''
					},
					type: 'post',
					complete: function (res) {
						if (res.responseJSON) {

							$sessionStorage.authoritiesStr = res.responseJSON.authoritiesStr;
							$sessionStorage.modules = res.responseJSON.modules;

							$localStorage.userInfo.authoritiesStr = res.responseJSON.authoritiesStr;
							$localStorage.userInfo.modules = res.responseJSON.modules;
							/*标签页面存储信息*/


							// $localStorage.userInfo.orgs = res.responseJSON.orgs;
							//解决无权限时该字段为null，无法使用indexOf方法进行权限判断的问题
							if (!$localStorage.userInfo.authoritiesStr) {
								$localStorage.userInfo.authoritiesStr = '无';
							}

							$rootScope.userInfo = $localStorage.userInfo;
						}
					}
				});
				// 未读消息数量
				$rootScope.repairMsgEven = false;
				$.ajax({
					url: '/newrepair/repMessageReceive/find',
					type: 'get',
					complete: function (res) {
						if (res.responseJSON) {
							if (res.responseJSON.code == 200) {
								$rootScope.unreadMsg = res.responseJSON.data;
								$rootScope.unreadMsg > 9 ? $rootScope.repairMsgEven = true : ($rootScope.unreadMsg == 0 ? $rootScope.unreadMsg = null : 1);
							}
						}
					}
				});
				var timerOut;
				// mainGetMsg();
			}

			$scope.headReload = function (item) {

				$.ajax({
					type: 'get',
					url: '/sys/tenant/view/tenant/' + (item.id || $localStorage.userInfo.tenantId) + '/user/' + $rootScope.userInfo.id,
					async: false,
					contentType: "application/json;charset=UTF-8",
					complete: function (res) {
						if (res.responseJSON.code == 200) {
							$localStorage.userInfo.nowDeptName = item.name;
							$localStorage.userInfo.nowOrgName = item.name || res.responseJSON.data;
							$localStorage.userInfo.tenantName = item.name;
							$localStorage.userInfo.nowOrgId = item.id;
							$localStorage.userInfo.nowOrgType = item.tenant_type;
							$localStorage.userInfo.tenantId = item.id; //切换机构Id
							$rootScope.userInfo = $localStorage.userInfo;
							$sessionStorage.currentPageTenantId = item.id;
							// $rootScope.$apply();
							$scope.getPerMissionlist(item.id || $localStorage.userInfo.tenantId, null);

							var currentUrl = '';
							// 机构切换后，跳转至当前模块首页
							$rootScope.currentmodule = '平台首页';
							switch ($rootScope.currentmodule) {
								case '医疗机构管理':
									currentUrl = 'org.index';
									break;
								case '监管机构管理':
									currentUrl = 'org.supervise';
									break;
								case '角色管理':
									currentUrl = 'role.index';
									break;
								case '维修管理':
									currentUrl = 'repair.index';
									break;
								case '资产管理':
									currentUrl = 'main.tre.zctz.list';
									break;
								case '成员用户管理':
									currentUrl = 'main.member.list';
									break;
								case '平台首页':
									currentUrl = 'home.general';
									break;
							}
							$state.go(currentUrl, {
								id: item.id,
								tenantId: item.id
							}, {
									reload: true
								});
						}
					}
				})
			}

			//处理键对值
			$scope.disposeObj = function (obj) {
				var _arr = [];
				for (var i in obj) {
					if (obj.hasOwnProperty(i)) {
						var o = {
							id: +i,
							name: obj[i]
						};
						_arr.push(o);
					}
				}
				return _arr;
			}

			$scope.getBaseOrg = function () {
				//获取基础数据
				$.ajax({
					type: 'get',
					async: false,
					url: '/sys/basedata/staticVariable',
					contentType: 'application/json;charset=UTF-8',
					complete: function (res) {
						if (res.responseJSON.code == 200) {
							var data = res.responseJSON.data;
							$localStorage.baseOrg = {
								clientType: $scope.disposeObj(data.clientType),
								moduleSource: $scope.disposeObj(data.moduleSource),
								moduleType: $scope.disposeObj(data.moduleType),
								roleDataScope: $scope.disposeObj(data.roleDataScope),
								tanentOrigin: $scope.disposeObj(data.tanentOrigin),
								tenantAccountType: $scope.disposeObj(data.tenantAccountType),
								tenantAuditStatus: $scope.disposeObj(data.tenantAuditStatus),
								tenantEconomicType: $scope.disposeObj(data.tenantEconomicType),
								tenantGrade: $scope.disposeObj(data.tenantGrade),
								tenantHierarchy: $scope.disposeObj(data.tenantHierarchy),
								tenantManageType: $scope.disposeObj(data.tenantManageType),
								tenantTrial: $scope.disposeObj(data.tenantTrial),
								tenantType: $scope.disposeObj(data.tenantType),
								tenantCategory: $scope.disposeObj(data.tenantCategory)
							}
						}
					}
				})
			}

			function getCookie(name) {
				var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

				if (arr = document.cookie.match(reg))

					return (arr[2]);
				else
					return null;
			}
			function delCookie(name) {
				var exp = new Date();
				exp.setTime(exp.getTime() - 1);
				var cval = getCookie(name);
				if (cval != null)
					document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";domain=.aek.com;path=/";
			}
			$(document).ajaxSuccess(function (event, xhr, settings) {
				// if(xhr.responseText.search('tenantType')!=-1){
				// 	return
				// }
				if (xhr.responseJSON && xhr.responseJSON.code == 401) {
					$localStorage.$reset();
					delCookie('X-AEK56-Token');
					$state.go('access.login', null, { reload: true });
				} else if (xhr.responseJSON && xhr.responseJSON.code == 403) {
					return null;
				} else if (xhr.responseJSON && xhr.responseJSON.code == 450) {
					$localStorage["X-AEK56-Token"] = '';
					delCookie('X-AEK56-Token');
					$state.go('access.login', null, { reload: true }); //token失效

				} else if (xhr.responseJSON && xhr.responseJSON.code == 302) {
					// $localStorage.err302=$localStorage.err302?++$localStorage.err302:1;
					// if($localStorage.err302>5){
					// 	$localStorage.$reset();
					// 	delCookie('X-AEK56-Token');
					// 	$state.go('access.login',null,{reload: true});
					// 	return;
					// }
					// $scope.getPerMissionlist('',function(){
					// 	settings.url = settings.url.substr(4);
					// 	settings.success = function () {
					// 		$state.reload();					
					// 	}
					// 	$.ajax(settings);

					// });
					$localStorage.$reset();
					delCookie('X-AEK56-Token');
					$state.go('access.login', {code: 302}, {reload: true });
					// return ;
				} else if (xhr.responseJSON && xhr.responseJSON.code != 200) {

				}
				return event;
			});
		}
	]);