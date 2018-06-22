'use strict';

var app = angular.module('app')
	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
		// 默认地址
		$urlRouterProvider.otherwise('/website/home');
		// 状态配置
		$stateProvider
			.state('main', {
				abstract: true,
				url: '',
				templateUrl: 'src/tpl/app.html'
			})
			.state('access', {
				url: '/access',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			// 字典表管理---start
			.state('dictionary', {
				abstract: true,
				url: '/dictionary/{tenantId}',
				templateUrl: 'src/tpl/dictionary.html'
			})
			// 字典管理表菜单视图
			.state('dictionary.menu', {
				url: '/menu',
				templateUrl: 'src/app/dictionary/html/dictionary.html',
				controller: 'dicMenuController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/dictionary/js/dictionary_menu.js']);
					}]
				}
			})
			// 字典管理-字典表管理
			.state('dictionary.menu.table', {
				url: '/table',
				templateUrl: 'src/app/dictionary/html/dictionary_table.html',
				controller: 'dicController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/dictionary/js/dictionary_table.js', 'src/app/dictionary/css/dictionary_table.css']);
					}]
				}
			})
			// 字典表管理-字典值管理
			.state('dictionary.menu.field', {
				url: '/{id}/field',
				templateUrl: 'src/app/dictionary/html/dictionary_key.html',
				controller: 'dicFieldController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/dictionary/js/dictionary_key.js', 'src/app/dictionary/css/dictionary_table.css']);
					}]
				}
			})
			// 字典表管理---end
			.state('access.login', {
				url: '/login/{code}',
				templateUrl: 'src/app/loginnew/index.html',
				controller: 'loginController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/loginnew/js/index.js', 'src/app/loginnew/css/index.css', 'res/css/website.css']);
					}]
				}
			})
			.state('website', {
				url: '/website',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('website.home', {
				url: '/home',
				templateUrl: 'src/app/website/home.html',
				controller: 'homeController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/website/homeController.js', 'res/css/website.css', 'lib/swiper-3.4.2.jquery.js']);
					}]
				}
			})
			.state('website.type', {
				url: '/type',
				templateUrl: 'src/app/website/type.html',
				controller: 'typeController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/website/typeController.js', 'res/css/website.css']);
					}]
				}
			})
			.state('website.success', {
				url: '/success',
				templateUrl: 'src/app/website/success.html',
				controller: 'successController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/website/successController.js', 'res/css/website.css']);
					}]
				}
			})
			.state('website.reg', {
				url: '/reg',
				templateUrl: 'src/app/website/reg.html',
				controller: 'regController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/website/regController.js', 'res/css/website.css']);
					}]
				}
			})
			// .state('access.login',{
			//     url: '/login',
			//     templateUrl: 'src/app/sys/login/login.html',
			//     controller: 'loginController',
			//     resolve: {
			//     	deps: ['uiLoad', '$ocLazyLoad', function(uiLoad, $ocLazyLoad) {
			//             return uiLoad.load('src/app/sys/login/loginController.js');
			//         }]
			//       }
			// }) // 忘记密码
			.state('access.wjmm', {
				url: '/wjmm',
				templateUrl: 'src/app/sys/login/wjmm.html',
				controller: 'wjmmController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/login/wjmmController.js');
					}]
				}
			})
			//用户成员管理
			.state('main.member', {
				url: '/member',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.member.list', {
				url: '/list/{id}/{tenantId}/{preset}/',
				templateUrl: 'src/app/users/member/memberlist.html',
				params: {
					deptId: null,
					orgId: null,
					deptName: null,
					parentDeptId: null,
					parentDeptName: null
				},
				controller: 'memlistController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/detail.css', 'src/app/users/member/memlistController.js']);
					}]
				}
			})
			.state('usermain', {
				abstract: true,
				url: '/usermain',
				templateUrl: 'src/tpl/member.html'

			})
			.state('usermain.detail', {
				url: '/detail/{userId}/{id}/{tenantId}',
				templateUrl: 'src/app/users/member/memberdetail.html',
				controller: 'memdetailController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['res/css/detail.css', 'src/app/users/member/memdetailController.js']);

					}]
				}
			})
			.state('usermain.detail.roleset', {
				url: '/roleset/{userId}/{loginId}',
				templateUrl: 'src/app/users/member/roleset.html',
				controller: 'roleController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {

						return uiLoad.load(['src/app/users/member/roleController.js']);

					}]
				}
			})
			// 基本信息
			.state('main.users.jbxx', {
				url: '/jbxx',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.users.jbxx.jbxx', {
				url: '/jbxx',
				templateUrl: 'src/app/users/jbxx/jbxx.html',
				controller: 'jbxxController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/users/jbxx/jbxxController.js');
					}]
				}
			}) // 资质认证
			.state('main.users.zzrz', {
				url: '/zzrz',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.users.zzrz.zzrz', {
				url: '/zzrz',
				templateUrl: 'src/app/users/zzrz/zzrz.html',
				controller: 'zzrzController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/users/zzrz/zzrzController.js');
					}]
				}
			}) // 我的设置
			.state('main.users.wdsz', {
				url: '/wdsz',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			}) // 安全设置
			.state('main.users.wdsz.aqsz', {
				url: '/aqsz',
				templateUrl: 'src/app/users/wdsz/aqsz.html',
				controller: 'aqszController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/users/wdsz/aqszController.js');
					}]
				}
			}) // 密码设置
			.state('main.users.wdsz.mmsz', {
				url: '/mmsz',
				templateUrl: 'src/app/users/wdsz/mmsz.html',
				controller: 'mmszController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/users/wdsz/mmszController.js');
					}]
				}
			}) // 初始密码设置
			.state('main.users.wdsz.csmmsz', {
				url: '/csmmsz',
				templateUrl: 'src/app/users/wdsz/csmmsz.html',
				controller: 'csmmszController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/users/wdsz/csmmszController.js');
					}]
				}
			}) // 改绑手机
			.state('main.users.wdsz.gbsj', {
				url: '/gbsj',
				templateUrl: 'src/app/users/wdsz/gbsj.html',
				controller: 'gbsjController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/users/wdsz/gbsjController.js');
					}]
				}
			}) // 改绑邮箱
			.state('main.users.wdsz.gbyx', {
				url: '/gbyx',
				templateUrl: 'src/app/users/wdsz/gbyx.html',
				controller: 'gbyxController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/users/wdsz/gbyxController.js');
					}]
				}
			}) // 组织机构
			.state('main.users.zzjg', {
				url: '/zzjg',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.users.zzjg.zzjg', {
				url: '/zzjg',
				templateUrl: 'src/app/users/zzjg/zzjg.html',
				controller: 'zzjgController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/users/zzjg/zzjgController.js', 'src/app/users/jsqx/newZtree.css']);
					}]
				}
			}) // 添加子机构
			.state('main.users.zzjg.tjzjg', {
				url: '/tjzjg',
				templateUrl: 'src/app/users/zzjg/tjzjg.html',
				controller: 'tjzjgController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/users/zzjg/tjzjgController.js', 'src/app/users/jsqx/newZtree.css']);
					}]
				}
			}) // 角色权限
			.state('main.users.jsqx', {
				url: '/jsqx',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.users.jsqx.jsqx', {
				url: '/jsqx',
				templateUrl: 'src/app/users/jsqx/jsqx.html',
				controller: 'jsqxController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/users/jsqx/jsqxController.js', 'src/app/users/jsqx/newZtree.css']);
					}]
				}
			}) // 添加成员
			.state('main.users.zzjg.tjcy', {
				url: '/tjcy',
				templateUrl: 'src/app/users/zzjg/tjcy.html',
				controller: 'tjcyController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/users/zzjg/tjcyController.js', 'src/app/users/jsqx/newZtree.css']);
					}]
				}
			})
			.state('main.sys', {
				url: '/sys',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			}) // 用户
			.state('main.sys.user', {
				url: '/user',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.tre', {
				url: '/tre',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			}) // 临床科室
			.state('main.lcks', {
				url: '/lcks',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.lcks.zkgl', {
				url: '/zkgl',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			}) // 转科管理
			.state('main.lcks.zkgl.zkgl', {
				url: '/zkgl',
				templateUrl: 'src/app/lcks/zkgl/zkgl.html',
				controller: 'lckszkglController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/lcks/zkgl/zkglController.js');
					}]
				}
			})
			.state('main.lcks.zkgl.new', {
				url: '/new',
				templateUrl: 'src/app/lcks/zkgl/new.html',
				params: {
					state: null
				},
				controller: 'lckszkglController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/lcks/zkgl/zkglController.js');
					}]
				}
			})
			.state('main.lcks.bfgl', {
				url: '/bfgl',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			}) // 报废管理
			.state('main.lcks.bfgl.bfgl', {
				url: '/bfgl',
				templateUrl: 'src/app/lcks/bfgl/bfgl.html',
				controller: 'lcksbfglController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/lcks/bfgl/bfglController.js');
					}]
				}
			})
			.state('main.lcks.bfgl.new', {
				url: '/new',
				params: {
					state: null
				},
				templateUrl: 'src/app/lcks/bfgl/new.html',
				controller: 'lcksbfglController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/lcks/bfgl/bfglController.js');
					}]
				}
			})
			.state('main.lcks.kstz', {
				url: '/kstz',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			}) // 科室台账
			.state('main.lcks.kstz.list', {
				url: '/list',
				templateUrl: 'src/app/lcks/kstz/ytz.html',
				controller: 'lcksytzController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/lcks/kstz/ytzController.js']);
					}]
				}
			})
			.state('main.lcks.kstz.assets', {
				url: '/assets',
				templateUrl: 'src/app/lcks/kstz/assets.html',
				controller: 'lcksassetsController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/lcks/kstz/assetsController.js', 'res/css/ytz.css']);
					}]
				}
			})
			.state('main.lcks.kstz.purchase', {
				url: '/purchase',
				templateUrl: 'src/app/lcks/kstz/purchase.html',
				controller: 'lcksassetsController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/lcks/kstz/assetsController.js', 'res/css/ytz.css']);
					}]
				}
			})
			// 入库
			.state('main.tre.rkgl', {
				url: '/rkgl',
				params: {
					"state": null
				},
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.tre.rkgl.new', {
				url: '/new',
				params: {
					state: null
				},
				templateUrl: 'src/app/tre/rkgl/new.html',
				controller: 'rkglController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/tre/rkgl/rkglController.js');
					}]
				}
			})
			.state('main.tre.rkgl.rkgl', {
				url: '/rkgl',
				templateUrl: 'src/app/tre/rkgl/rkgl.html',
				controller: 'rkglController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/tre/rkgl/rkglController.js');
					}]
				}
			}) // 出库
			.state('main.tre.ckgl', {
				url: '/ckgl',
				params: {
					"state": null
				},
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.tre.ckgl.new', {
				url: '/new',
				templateUrl: 'src/app/tre/ckgl/new.html',
				controller: 'ckglController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/tre/ckgl/ckglController.js');
					}]
				}
			})
			.state('main.tre.ckgl.list', {
				url: '/ckgl',
				templateUrl: 'src/app/tre/ckgl/ckgl.html',
				controller: 'ckglController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/tre/ckgl/ckglController.js');
					}]
				}
			}) // 报废
			.state('main.tre.bfgl', {
				url: '/bfgl',
				params: {
					state: null
				},
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.tre.bfgl.new', {
				url: '/new',
				params: {
					state: null
				},
				templateUrl: 'src/app/tre/bfgl/new.html',
				controller: 'bfglController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/tre/bfgl/bfglController.js');
					}]
				}
			})
			.state('main.tre.bfgl.list', {
				url: '/bfgl',
				params: {
					state: null
				},
				templateUrl: 'src/app/tre/bfgl/bfgl.html',
				controller: 'bfglController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/tre/bfgl/bfglController.js');
					}]
				}
			}) // 冲红
			.state('main.tre.chgl', {
				url: '/chgl',
				params: {
					"state": null
				},
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.tre.chgl.new', {
				url: '/new',
				templateUrl: 'src/app/tre/chgl/new.html',
				controller: 'chglController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/tre/chgl/chglController.js');
					}]
				}
			})
			.state('main.tre.chgl.list', {
				url: '/chgl',
				templateUrl: 'src/app/tre/chgl/chgl.html',
				controller: 'chglController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/tre/chgl/chglController.js');
					}]
				}
			}) // 转科
			.state('main.tre.zkgl', {
				url: '/zkgl',
				template: '<div ui-view class="fade-in-right-big smooth"></div>',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/zkgl/template.js', 'res/css/zctz.css', 'res/css/zkgl.css']);
					}]
				}
			})
			.state('main.tre.zkgl.asset', {
				url: '/asset',
				templateUrl: 'src/app/tre/zkgl/asset.html',
				controller: 'ZKGlassetController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/tre/zkgl/assetController.js');
					}]
				}
			})
			.state('main.tre.zkgl.detail', {
				url: '/detail/{billId}',
				templateUrl: 'src/app/tre/zkgl/detail.html',
				controller: 'ZKGldetailController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/tre/zkgl/detailController.js');
					}]
				}
			})
			.state('main.tre.zkgl.result', {
				url: '/result/{billId}',
				templateUrl: 'src/app/tre/zkgl/result.html',
				controller: 'ZKGlresultController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/zkgl/resultController.js', 'src/app/tre/zkgl/service/browse_service.js']);
					}]
				}
			})
			.state('main.tre.zkgl.list', {
				url: '/list/{status}',
				templateUrl: 'src/app/tre/zkgl/list.html',
				controller: 'ZKGllistController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/zkgl/service/browse_service.js', 'src/app/tre/zkgl/listController.js']);
					}]
				}
			})
			// 报损
			.state('main.tre.bsgl', {
				url: '/bsgl',
				template: '<div ui-view class="fade-in-right-big smooth"></div>',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/zkgl/template.js', 'res/css/zctz.css', 'res/css/zkgl.css']);
					}]
				}
			})
			.state('main.tre.bsgl.asset', {
				url: '/asset',
				templateUrl: 'src/app/tre/bsgl/html/asset.html',
				controller: 'BSGLassetController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/tre/bsgl/js/assetController.js');
					}]
				}
			})
			.state('main.tre.bsgl.detail', {
				url: '/detail/{billId}',
				templateUrl: 'src/app/tre/bsgl/html/detail.html',
				controller: 'BSGLdetailController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/tre/bsgl/js/detailController.js');
					}]
				}
			})
			.state('main.tre.bsgl.result', {
				url: '/result/{billId}',
				templateUrl: 'src/app/tre/bsgl/html/result.html',
				controller: 'BSGLresultController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/bsgl/js/resultController.js', 'src/app/tre/zkgl/service/browse_service.js']);
					}]
				}
			})
			.state('main.tre.bsgl.browse', {
				url: '/browse/{status}',
				templateUrl: 'src/app/tre/bsgl/html/browse.html',
				controller: 'bsglListController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/zkgl/service/browse_service.js', 'src/app/tre/bsgl/js/browseController.js']);
					}]
				}
			}) // 预台账
			.state('main.tre.ytz', {
				url: '/ytz',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.tre.ytz.null', {
				url: '/null',
				templateUrl: 'src/app/tre/ytz/null.html',
				controller: 'assetsController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/ytz/assetsController.js', 'res/css/ytz.css']);
					}]
				}
			})
			.state('main.tre.ytz.list', {
				url: '/ytz/{id}',
				controller: 'ytzController',
				params: {
					isOpMsg: null,
					isOp: false
				},
				templateUrl: 'src/app/tre/ytz/ytz.html',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/ytz/ytzController.js']);
					}]
				}
			})
			.state('main.tre.ytz.assets', {
				url: '/assets/{id}/{state}/{assetId}/{currentState}',
				templateUrl: 'src/app/tre/ytz/assets.html',
				controller: 'assetsController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/ytz/assetsController.js', 'res/css/ytz.css']);
					}]
				}
			})
			.state('main.tre.ytz.purchase', {
				url: '/purchase/{id}/{state}/{assetId}/{currentState}',
				templateUrl: 'src/app/tre/ytz/purchase.html',
				controller: 'treYtzPurchaseController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/ytz/trePurchaseController.js', 'res/css/ytz.css', 'res/css/zctz.css']);
					}]
				}
			})
			.state('main.tre.ytz.repair', {
				url: '/repair/{id}/{state}/{assetId}/{currentState}',
				templateUrl: 'src/app/tre/ytz/repair.html',
				controller: 'repairController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/ytz/repairController.js', 'src/app/tre/zctz/treUploadFile.js', 'res/css/repair.css', 'res/css/zctz.css', 'res/css/ytz.css']);
					}]
				}
			})
			// 资产概览
			.state('main.tre.dashbord', {
				url: '/dashbord',
				controller: 'treDashbordController',
				templateUrl: 'src/app/tre/dashbord.html',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['res/css/general.css', 'lib/echarts/echarts.min.js', 'src/app/tre/dashbordController.js', 'res/css/zctz.css']);
					}]
				}
			})
			// 资产台账
			.state('main.tre.zctz', {
				url: '/zctz',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.tre.zctz.list', {
				url: '/list/{id}',
				params: {
					isOpMsg: null,
					isOp: false
				},
				controller: 'zctzController',
				templateUrl: 'src/app/tre/zctz/ytz.html',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/zctz/ytzController.js', 'lib/jquery/jquery.jqprint.js', 'res/css/ytz.css', 'res/css/zctz.css']);
					}]
				}
			})
			.state('main.tre.zctz.assets', {
				url: '/assets/{id}/{state}/{assetId}',
				templateUrl: 'src/app/tre/zctz/assets.html',
				controller: 'treAssetsController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/zctz/treAssetsController.js', 'lib/jquery/jquery.jqprint.js', 'res/css/zctz.css', 'res/css/ytz.css']);
					}]
				}
			})
			.state('main.tre.zctz.purchase', {
				url: '/purchase/{id}/{state}/{assetId}',
				templateUrl: 'src/app/tre/zctz/purchase.html',
				controller: 'trePurchaseController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/zctz/trePurchaseController.js', 'src/app/tre/zctz/treUploadFile.js', 'lib/jquery/jquery.jqprint.js', 'res/css/ytz.css', 'res/css/zctz.css']);
					}]
				}
			})
			.state('main.tre.zctz.contract', {
				url: '/contract/{id}/{state}/{assetId}',
				templateUrl: 'src/app/tre/zctz/contract.html',
				controller: 'treContractController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/zctz/treContractController.js', 'src/app/tre/zctz/treUploadFile.js', 'lib/jquery/jquery.jqprint.js', 'res/css/ytz.css', 'res/css/zctz.css']);
					}]
				}
			})
			.state('main.tre.zctz.credentials', {
				url: '/credentials/{id}/{state}/{assetId}',
				templateUrl: 'src/app/tre/zctz/credentials.html',
				controller: 'credentialsController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/zctz/credentialsController.js', 'lib/jquery/jquery.jqprint.js', 'res/css/supplier.css', 'res/css/zctz.css', 'res/css/ytz.css']);
					}]
				}
			})
			.state('main.tre.zctz.repair', {
				url: '/repair/{id}/{state}/{assetId}',
				templateUrl: 'src/app/tre/zctz/repair.html',
				controller: 'trerepairController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/zctz/trerepairController.js', 'src/app/tre/zctz/treUploadFile.js', 'res/css/repair.css', 'res/css/zctz.css', 'res/css/ytz.css']);
					}]
				}
			})
			// 操作记录
			.state('main.tre.zctz.operate', {
				url: '/operate/{id}/{state}/{assetId}',
				templateUrl: 'src/app/tre/zctz/operate.html',
				controller: 'treoperateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/tre/zctz/treOperateController.js', 'res/css/repair.css', 'res/css/zctz.css', 'res/css/ytz.css', 'src/app/pm/service/pm_util_service.js']);
					}]
				}
			})
			.state('main.sys.user.list', {
				url: '/list',
				templateUrl: 'src/app/sys/user/user.html',
				controller: 'userController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/user/userController.js');
					}]
				}
			})
			.state('main.sys.user.create', {
				url: '/create',
				templateUrl: 'src/app/sys/user/update.html',
				controller: 'userUpdateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/user/updateController.js');
					}]
				}
			})
			.state('main.sys.user.update', {
				url: '/update/{id}?params',
				templateUrl: 'src/app/sys/user/update.html',
				controller: 'userUpdateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/user/updateController.js');
					}]
				}
			}) // 部门
			.state('main.sys.dept', {
				url: '/dept',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.sys.dept.list', {
				url: '/list',
				templateUrl: 'src/app/sys/dept/dept.html',
				controller: 'deptController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/dept/deptController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			})
			.state('main.sys.dept.create', {
				url: '/create',
				templateUrl: 'src/app/sys/dept/update.html',
				controller: 'deptUpdateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/dept/updateController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			})
			.state('main.sys.dept.update', {
				url: '/update/{id}?params',
				templateUrl: 'src/app/sys/dept/update.html',
				controller: 'deptUpdateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/dept/updateController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			}) // 菜单
			.state('main.sys.menu', {
				url: '/menu',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.sys.menu.list', {
				url: '/list',
				templateUrl: 'src/app/sys/menu/menu.html',
				controller: 'menuController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/menu/menuController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			})
			.state('main.sys.menu.create', {
				url: '/create',
				templateUrl: 'src/app/sys/menu/update.html',
				controller: 'menuUpdateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/menu/updateController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			})
			.state('main.sys.menu.update', {
				url: '/update/{id}?params',
				templateUrl: 'src/app/sys/menu/update.html',
				controller: 'menuUpdateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/menu/updateController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			}) // 角色
			.state('main.sys.role', {
				url: '/role',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.sys.role.list', {
				url: '/list',
				templateUrl: 'src/app/sys/role/role.html',
				controller: 'roleController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/role/roleController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			})
			.state('main.sys.role.create', {
				url: '/create',
				templateUrl: 'src/app/sys/role/update.html',
				controller: 'roleUpdateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/role/updateController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			})
			.state('main.sys.role.update', {
				url: '/update/{id}?params',
				templateUrl: 'src/app/sys/role/update.html',
				controller: 'roleUpdateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/role/updateController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			}) // 会话
			.state('main.sys.session', {
				url: '/session',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.sys.session.list', {
				url: '/list',
				templateUrl: 'src/app/sys/session/session.html',
				controller: 'sessionController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/session/sessionController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			}) // 字典
			.state('main.sys.dic', {
				url: '/dic',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.sys.dic.list', {
				url: '/list',
				templateUrl: 'src/app/sys/dic/dic.html',
				controller: 'dicController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/dic/dicController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			})
			.state('main.sys.dic.create', {
				url: '/create',
				templateUrl: 'src/app/sys/dic/update.html',
				controller: 'dicUpdateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/dic/updateController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			})
			.state('main.sys.dic.update', {
				url: '/update/{id}?params',
				templateUrl: 'src/app/sys/dic/update.html',
				controller: 'dicUpdateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/dic/updateController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			}) // 参数
			.state('main.sys.param', {
				url: '/param',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.sys.param.list', {
				url: '/list',
				templateUrl: 'src/app/sys/param/param.html',
				controller: 'paramController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/param/paramController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			})
			.state('main.sys.param.create', {
				url: '/create',
				templateUrl: 'src/app/sys/param/update.html',
				controller: 'paramUpdateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/param/updateController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			})
			.state('main.sys.param.update', {
				url: '/update/{id}?params',
				templateUrl: 'src/app/sys/param/update.html',
				controller: 'paramUpdateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/param/updateController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			}) // 调度
			.state('main.task', {
				url: '/task',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.task.scheduled', {
				url: '/scheduled',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.task.scheduled.list', {
				url: '/list',
				templateUrl: 'src/app/task/scheduled/scheduled.html',
				controller: 'taskScheduledController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/task/scheduled/scheduledController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			})
			.state('main.task.scheduled.create', {
				url: '/update',
				templateUrl: 'src/app/task/scheduled/update.html',
				controller: 'scheduledUpdateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/task/scheduled/updateController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			})
			.state('main.task.scheduled.update', {
				url: '/update',
				params: {
					'taskGroup': null,
					'taskName': null,
					'taskCron': null,
					'taskDesc': null,
					'taskType': null,
					'jobType': null,
					'targetObject': null,
					'targetMethod': null
				},
				templateUrl: 'src/app/task/scheduled/update.html',
				controller: 'scheduledUpdateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/task/scheduled/updateController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			})
			.state('main.task.log', {
				url: '/log',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.task.log.list', {
				url: '/list',
				templateUrl: 'src/app/task/scheduled/log.html',
				controller: 'scheduledLogController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/task/scheduled/logController.js').then(function () {
							return $ocLazyLoad.load('toaster');
						});
					}]
				}
			}) //数据可视化
			.state('main.chart', {
				url: '/chart',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			}) // 用户
			.state('main.chart.look', {
				url: '/look',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('main.chart.look.list', {
				url: '/list',
				templateUrl: 'src/app/sys/charts/echarts.html',
				controller: 'echartsController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load('src/app/sys/charts/echartsController.js').then(function () {
							return $ocLazyLoad.load(['toaster']);
						});
					}]
				}
			})
			// 供应商管理
			.state('supplier', {
				abstract: true,
				url: '/supplier/{tenantId}',
				templateUrl: 'src/tpl/supplier.html'
			})
			// 供应商新建
			.state('supplier.add', {
				url: '/add/{supplierId}?params',
				templateUrl: 'src/app/supplier/supplierAdd.html',
				params: {
					id: 0,
					loginId: 0
				},
				controller: 'supplierAddController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/supplier/supplierAddController.js', 'res/css/org.css', 'res/css/supplier.css']);
					}]
				}
			})
			// 供应商列表
			.state('supplier.list', {
				url: '/list',
				params: {
					isOpMsg: null,
					isOp: false
				},
				templateUrl: 'src/app/supplier/supplierList.html',
				controller: 'supplierListController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/supplier/supplierListController.js', 'res/css/org.css']);
					}]
				}
			})
			// 供应商详情
			.state('supplier.detail', {
				url: '/detail/{supplierId}',
				templateUrl: 'src/app/supplier/supplierDetail.html',
				params: {
					isOpMsg: null,
					isOp: false
				},
				controller: 'supplierDetailController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/detail.css', 'src/app/supplier/supplierDetailController.js', 'res/css/supplier.css']);
					}]
				}
			})
			.state('supplier.detail.model', {
				url: '/model',
				templateUrl: 'src/app/supplier/supplierModel.html',
				controller: 'supplierModelController',
				params: {
					isOpMsg: null,
					isOp: false
				},
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('src/app/supplier/supplierModelController.js');
					}]
				}
			})
			.state('supplier.detail.user', {
				url: '/user',
				templateUrl: 'src/app/supplier/supplierUser.html',
				controller: 'supplierUserController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('src/app/supplier/supplierUserController.js');
					}]
				}
			})
			.state('supplier.detail.seller', {
				url: '/seller',
				templateUrl: 'src/app/supplier/supplierSeller.html',
				controller: 'supplierSellerController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('src/app/supplier/supplierSellerController.js');
					}]
				}
			})
			.state('supplier.detail.credentials', {
				url: '/credentials',
				templateUrl: 'src/app/supplier/supplierCredentials.html',
				controller: 'supplierCredentialsController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('src/app/supplier/supplierCredentialsController.js');
					}]
				}
			})
			// 机构管理
			.state('org', {
				abstract: true,
				url: '/org',
				templateUrl: 'src/tpl/org.html'
			})
			.state('org.index', {
				url: '/index/{id}?params',
				params: {
					isOpMsg: null,
					isOp: false
				},
				templateUrl: 'src/app/orgManage/orgList.html',
				controller: 'orgListController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/orgManage/orgListController.js', 'res/css/org.css']);
					}]
				}
			})
			.state('org.supervise', {
				url: '/supervise/{id}?params',
				params: {
					isOpMsg: null,
					isOp: false
				},
				templateUrl: 'src/app/orgManage/superviseList.html',
				controller: 'superviseListController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/orgManage/superviseListController.js', 'res/css/org.css']);
					}]
				}
			})
			.state('org.add', {
				url: '/add/{id}/{loginId}?params',
				templateUrl: 'src/app/orgManage/orgAdd.html',
				params: {
					id: 0,
					loginId: 0
				},
				controller: 'orgAddController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/orgManage/orgAddController.js', 'res/css/org.css']);
					}]
				}
			})
			.state('org.new', {
				url: '/new/{id}/{loginId}?params',
				templateUrl: 'src/app/orgManage/orgNew.html',
				params: {
					id: 0,
					loginId: 0
				},
				controller: 'orgNewController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/orgManage/orgNewController.js', 'res/css/org.css']);
					}]
				}
			})
			.state('org.superviseNew', {
				url: '/superviseNew/{id}/{loginId}?params',
				templateUrl: 'src/app/orgManage/superviseOrgNew.html',
				params: {
					id: 0,
					loginId: 0
				},
				controller: 'superviseOrgNewController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/orgManage/superviseOrgNewController.js', 'res/css/org.css']);
					}]
				}
			})
			.state('org.superviseAdd', {
				url: '/superviseAdd/{id}/{loginId}?params',
				templateUrl: 'src/app/orgManage/superviseOrgAdd.html',
				params: {
					id: 0,
					loginId: 0
				},
				controller: 'superviseOrgAddController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/orgManage/superviseOrgAddController.js', 'res/css/org.css']);
					}]
				}
			})//医疗机构详情
			.state('org.detail', {
				url: '/detail/{id}/{loginId}',
				templateUrl: 'src/app/orgManage/detail.html',
				params: {
					isOpMsg: null,
					isOp: false
				},
				controller: 'detailController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/detail.css', 'src/app/orgManage/detailController.js']);
					}]
				}
			})//监管机构详情
			.state('org.superviseDetail', {
				url: '/superviseDetail/{id}/{loginId}',
				templateUrl: 'src/app/orgManage/superviseDetail.html',
				params: {
					isOpMsg: null,
					isOp: false
				},
				controller: 'superviseDetailController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/detail.css', 'src/app/orgManage/superviseDetailController.js']);
					}]
				}
			})
			.state('org.detail.model', {
				url: '/model/{id}?params',
				templateUrl: 'src/app/orgManage/model.html',
				controller: 'modelController',
				params: {
					isOpMsg: null,
					isOp: false
				},
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('src/app/orgManage/modelController.js');
					}]
				}
			})
			.state('org.superviseDetail.model', {
				url: '/model/{id}?params',
				templateUrl: 'src/app/orgManage/superviseModel.html',
				controller: 'superviseModelController',
				params: {
					isOpMsg: null,
					isOp: false
				},
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('src/app/orgManage/superviseModelController.js');
					}]
				}
			})
			.state('org.detail.child', {
				url: '/child/{id}?params',
				templateUrl: 'src/app/orgManage/childMed.html',
				controller: 'childController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('src/app/orgManage/childMedController.js');
					}]
				}
			})
			.state('org.detail.superviseChild', {
				url: '/child/{id}?params',
				templateUrl: 'src/app/orgManage/childSupervise.html',
				controller: 'superviseChildController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('src/app/orgManage/childSuperviseController.js');
					}]
				}
			})
			.state('org.superviseDetail.child', {
				url: '/child/{id}?params',
				templateUrl: 'src/app/orgManage/superviseChildMed.html',
				controller: 'childController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('src/app/orgManage/superviseChildMedController.js');
					}]
				}
			})
			.state('org.superviseDetail.superviseChild', {
				url: '/child/{id}?params',
				templateUrl: 'src/app/orgManage/superviseChildSupervise.html',
				controller: 'superviseChildController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('src/app/orgManage/superviseChildSuperviseController.js');
					}]
				}
			})
			.state('org.detail.operate', {
				url: '/operate/{id}?params',
				templateUrl: 'src/app/orgManage/operate.html',
				controller: 'operateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('src/app/orgManage/operateController.js');
					}]
				}
			})
			.state('org.detail.user', {
				url: '/user/{id}?params',
				templateUrl: 'src/app/orgManage/user.html',
				controller: 'userController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('src/app/orgManage/userController.js');
						// return $ocLazyLoad.load('src/app/orgManage/detailController.js');
					}]
				}
			})
			.state('org.superviseDetail.user', {
				url: '/user/{id}?params',
				templateUrl: 'src/app/orgManage/superviseUser.html',
				controller: 'superviseUserController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('src/app/orgManage/superviseUserController.js');
						// return $ocLazyLoad.load('src/app/orgManage/detailController.js');
					}]
				}
			})
			.state('role', {
				abstract: true,
				url: '/role/{id}?params',
				templateUrl: 'src/tpl/role.html',
				// template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('role.index', {
				url: '/index',
				templateUrl: 'src/app/role/roleIndex.html',
				controller: 'roleIndexController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/role/roleIndexController.js', 'res/css/role.css']);
					}]
				}
			})
			.state('role.detail', {
				url: '/detail/{roleId}?params',
				params: {
					roleId: null
				},
				templateUrl: 'src/app/role/roleDetail.html',
				controller: 'roleDetailController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/role/roleDetailController.js', 'res/css/role.css']);
					}]
				}
			})
			.state('role.detail.power', {
				url: '/power',
				templateUrl: 'src/app/role/rolePower.html',
				controller: 'rolePowerController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/role/rolePowerController.js', 'res/css/role.css']);
					}]
				}
			})
			.state('role.detail.user', {
				url: '/user',
				templateUrl: 'src/app/role/roleUser.html',
				controller: 'roleUserController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/role/roleUserController.js', 'res/css/role.css']);
					}]
				}
			})
			.state('role.add', {
				url: '/add',
				templateUrl: 'src/app/role/roleAdd.html',
				controller: 'roleAddController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/role/roleAddController.js', 'res/css/role.css']);
					}]
				}
			})

			// 首页
			.state('home', {
				url: '/home',
				controller: 'appController',
				templateUrl: 'src/app/home/app.html',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/home.css', 'src/app/home/appController.js', 'res/css/general.css']);
					}]
				}
			})
			// 平台首页-我的应用
			.state('home.use', {
				url: '/use/{tenantId}?params',
				controller: 'useController',
				templateUrl: 'src/app/home/use.html',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/home.css', 'src/app/home/use.js']);
					}]
				}
			})
			// .state('home.general', {
			// 	url: '/general/{tenantId}?params',
			// 	controller: 'generalController',
			// 	templateUrl: 'src/app/home/general.html',
			// 	resolve: {
			// 		deps: ['$ocLazyLoad', function($ocLazyLoad) {
			// 			return $ocLazyLoad.load(['res/css/general.css', 'src/app/home/general.js', 'lib/echarts/echarts.min.js']);
			// 		}]
			// 	}
			// })
			.state('home.general', {
				url: '/general/{tenantId}?params',
				controller: 'generalController2',
				templateUrl: 'src/app/home/general2.html',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/general2.css', 'src/app/home/general2.js', 'lib/echarts/echarts.min.js']);
					}]
				}
			})
			// 个人信息
			.state('personal', {
				url: '/personal',
				controller: 'personalController',
				templateUrl: 'src/app/home/personal.html',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/home.css', 'res/css/general.css', 'src/app/home/personal.js']);
					}]
				}
			})
			// 平台首页-账户信息
			.state('personal.account', {
				url: '/account',
				controller: 'accountController',
				templateUrl: 'src/app/home/account.html',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/home.css', 'src/app/home/account.js']);
					}]
				}
			})
			// 平台首页-机构信息
			.state('home.organization', {
				url: '/organization/{id}?params',
				controller: 'organController',
				templateUrl: 'src/app/home/organization.html',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/home.css', 'src/app/home/organization.js', 'res/css/detail.css']);
					}]
				}
			})
			// 平台首页-机构信息
			.state('home.superviseOrg', {
				url: '/superviseOrg/{id}?params',
				controller: 'organController',
				templateUrl: 'src/app/home/superviseOrg.html',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/home.css', 'src/app/home/superviseOrg.js', 'res/css/detail.css']);
					}]
				}
			})
			// 平台首页-操作说明
			.state('home.operation', {
				url: '/operation',
				controller: 'operationController',
				templateUrl: 'src/app/home/operation.html',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/home/operation.js', 'res/css/operation.css']);
					}]
				}
			})
			// 平台首页-操作说明详情
			.state('home.operationinfo', {
				url: '/operationinfo/{id}',
				controller: 'operationInfoController',
				templateUrl: 'src/app/home/operationinfo.html',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/home/operationinfo.js', 'res/css/operation.css']);
					}]
				}
			})
			.state('home.organization.model', {
				url: '/model',
				templateUrl: 'src/app/home/model.html',
				controller: 'hmodelController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/home.css', 'src/app/home/model.js']);
					}]
				}
			})
			.state('home.superviseOrg.model', {
				url: '/model/{id}?params',
				templateUrl: 'src/app/home/superviseModel.html',
				controller: 'hmodelController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/home.css', 'src/app/home/superviseModel.js']);
					}]
				}
			})
			.state('home.organization.child', {
				url: '/child',
				templateUrl: 'src/app/home/child.html',
				controller: 'hchildController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/home.css', 'src/app/home/child.js']);
					}]
				}
			})
			.state('home.superviseOrg.child', {
				url: '/child/{id}?params',
				templateUrl: 'src/app/home/superviseChildMed.html',
				controller: 'hchildController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/home.css', 'src/app/home/superviseChildMed.js']);
					}]
				}
			})
			.state('home.superviseOrg.superviseChild', {
				url: '/child/{id}?params',
				templateUrl: 'src/app/home/superviseChildSupervise.html',
				controller: 'superviseChildController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/home.css', 'src/app/home/superviseChildSuperviseController.js']);
					}]
				}
			})
			.state('home.organization.operate', {
				url: '/operate',
				templateUrl: 'src/app/home/operate.html',
				controller: 'hoperateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/home.css', 'src/app/home/operate.js']);
					}]
				}
			})
			.state('home.organization.user', {
				url: '/user',
				templateUrl: 'src/app/home/user.html',
				controller: 'huserController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/home.css', 'src/app/home/user.js']);
						// return $ocLazyLoad.load('src/app/orgManage/detailController.js');
					}]
				}
			})
			.state('home.superviseOrg.user', {
				url: '/user/{id}?params',
				templateUrl: 'src/app/home/superviseUser.html',
				controller: 'huserController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/home.css', 'src/app/home/superviseUser.js']);
						// return $ocLazyLoad.load('src/app/orgManage/detailController.js');
					}]
				}
			})
			// 平台首页-系统公告
			.state('home.notice', {
				url: '/notice',
				templateUrl: 'src/app/home/notice.html',
				controller: 'noticeController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/home.css', 'src/app/home/notice.js']);
					}]
				}
			})
			// 首页系统公告详情页
			.state('home.detail', {
				url: '/detail/{id}?params',
				templateUrl: 'src/app/home/detail.html',
				controller: 'detailController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/home/detail.js', 'res/css/home.css']);
					}]
				}
			})
			.state('repair', {
				abstract: true,
				url: '/repair/{id}/{tenantId}?params',
				templateUrl: 'src/tpl/repair.html',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/repair/repairMsgController.js', 'res/css/repair.css', 'src/app/tre/zctz/treUploadFile.js']);
					}]
				}
				// template: '<div ui-view class="fade-in-right-big smooth"></div>'
			}) // 消息
			.state('info', {
				url: '/info',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('info.msg', {
				url: '/msg/{id}/{tenantId}?params',
				templateUrl: 'src/app/repair/repairMsg.html',
				controller: 'repairMsgController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/repair/repairMsgController.js', 'res/css/repair.css']);
					}]
				}
			})
			.state('info.things', {
				url: '/things/{status}/{tenantId}?params',
				templateUrl: 'src/app/repairnew/repairMsgCenter.html',
				controller: 'repairMsgCenterController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/repairnew/js/repairMsgCenterController.js', 'res/css/newrepair.css', 'res/css/repair.css']);
					}]
				}
			})
			// 管理
			.state('repair.manage', {
				url: '/manage/{status}/{tenantId}/{msgIndex}?params',
				templateUrl: 'src/app/repair/repairManage.html',
				controller: 'repairManageController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/repair/repairManageController.js', 'res/css/manage.css', 'res/css/repair.css']);
					}]
				}
			})
			// 配件管理
			.state('repair.accessory', {
				url: '/accessory',
				templateUrl: 'src/app/repair/repairAccessory.html',
				controller: 'accessoryController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/repair/accessoryController.js', 'res/css/repair.css']);
					}]
				}
			})
			// 配件分类
			.state('repair.accessory.classify', {
				url: '/classify',
				templateUrl: 'src/app/repair/accessoryClassify.html',
				controller: 'accessoryClassifyController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/repair/accessoryClassifyController.js']);
					}]
				}
			})
			// 配件记录
			.state('repair.accessory.records', {
				url: '/records',
				templateUrl: 'src/app/repair/accessoryRecords.html',
				controller: 'accessoryRecordsController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/repair/accessoryRecordsController.js']);
					}]
				}
			})
			// new管理
			.state('repair.newmanage', {
				url: '/newmanage',
				templateUrl: 'src/app/repairnew/repairManage.html',
				controller: 'repairNewManageController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/repairnew/js/repairNewManageController.js', 'res/css/repair.css', 'res/css/zctz.css', 'res/css/manage.css', 'res/css/newrepair.css']);
					}]
				}
			})
			// new新建维修
			.state('repair.newweixiu', {
				url: '/newweixiu/{status}/{assetsId}/{applyId}',
				templateUrl: 'src/app/repairnew/repairWeiXiu.html',
				controller: 'repairweixiuController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/repairnew/js/repairweixiuController.js', 'res/css/zctz.css', 'res/css/manage.css', 'res/css/repair.css', 'res/css/newrepair.css']);
					}]
				}
			})
			// 故障鉴定,待验收，等
			.state('repair.identify', {
				url: '/identify/{applyid}/{assetsId}',
				templateUrl: 'src/app/repair/repairIdentify.html',
				controller: 'repairIdentifyController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/repair/repairIdentifyController.js', 'res/css/manage.css', 'res/css/repair.css']);
					}]
				}
			})
			// 维修大屏
			.state('repair.scroll', {
				url: '/scroll',
				templateUrl: 'src/app/repair/scroll.html',
				controller: 'scrollDashbordController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/general.css', 'src/app/repair/scrollController.js']);
					}]
				}
			})
			// 维修概览
			.state('repair.dashbord', {
				url: '/dashbord',
				templateUrl: 'src/app/repair/dashbord.html',
				controller: 'repairDashbordController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/general.css', 'lib/echarts/echarts.min.js', 'src/app/repair/dashbordController.js']);
					}]
				}
			})
			// 首页
			.state('repair.index', {
				url: '/index',
				templateUrl: 'src/app/repair/repairIndex.html',
				controller: 'repairIndexController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/repair/repairIndexController.js', 'res/css/repair.css']);
					}]
				}
			}) // 时间轴
			.state('repair.index.date', {
				url: '/date',
				templateUrl: 'src/app/repair/repairDate.html',
				controller: 'repairDateController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/repair/repairDateController.js']);
					}]
				}
			}) // 日历
			.state('repair.index.calendar', {
				url: '/calendar',
				templateUrl: 'src/app/repair/repairCalendar.html',
				controller: 'repairCalendarController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/repair/repairCalendarController.js']);
					}]
				}
			})
			// 监管树
			// 监管树列表
			.state('supervisetree', {
				url: '/treelist',
				templateUrl: 'src/app/supeTree/treeList.html',
				controller: 'treeListController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/supeTree/treeList.js', 'res/css/supTree.css', 'res/css/org.css']);
					}]
				}
			})
			//监管树详情
			.state('treeDetail', {
				url: '/treedetail/{tenantId}',
				templateUrl: 'src/app/supeTree/treedetail.html',
				controller: 'treeDetailController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/supeTree/treedetail.js', 'res/css/supTree.css', 'res/css/org.css']);
					}]
				}
			})
			//监管树监管详情
			.state('treeDetailcontrol', {
				url: '/treedetailc/{tenantId}',
				templateUrl: 'src/app/supeTree/treedetailcontrol.html',
				controller: 'treeDetailcController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/supeTree/treedetailcontrol.js', 'res/css/supTree.css', 'res/css/org.css']);
					}]
				}
			})
			.state('inspection', {
				abstract: true,
				url: '/inspection/{tenantId}?params',
				controller: 'inspectionController',
				templateUrl: 'src/tpl/inspection.html',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/directives/select/select.css', 'src/directives/select/select.js', 'src/app/inspection/inspectionController.js', 'res/css/inspection.css', 'res/css/repair.css', 'src/app/inspection/implementDirective.js', 'res/css/inspectionImplement.css']);
					}]
				}
			})
			// 巡检概览
			.state('inspection.dashbord', {
				url: '/dashbord',
				templateUrl: 'src/app/inspection/dashbord.html',
				controller: 'dashbordController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['res/css/general.css', 'lib/echarts/echarts.min.js', 'src/app/inspection/dashbordController.js']);
					}]
				}
			})
			.state('inspection.index', {
				url: '/index',
				templateUrl: 'src/app/inspection/index.html',
				controller: 'indexController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/inspection/indexController.js']);
					}]
				}
			})
			.state('inspection.plan', {
				abstract: true,
				url: '/plan',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('inspection.plan.list', {
				url: '/list',
				templateUrl: 'src/app/inspection/plan.html',
				controller: 'planController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/inspection/planController.js']);
					}]
				}
			})
			.state('inspection.plan.new', {
				url: '/new',
				templateUrl: 'src/app/inspection/newPlan.html',
				controller: 'newPlanController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/inspection/newPlanController.js']);
					}]
				}
			})
			.state('inspection.plan.detail', {
				url: '/detail/{planId}',
				templateUrl: 'src/app/inspection/planDetail.html',
				controller: 'planDetailController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/inspection/planDetailController.js']);
					}]
				}
			})
			.state('inspection.model', {
				abstract: true,
				url: '/model',
				template: '<div ui-view class="fade-in-right-big smooth"></div>'
			})
			.state('inspection.model.list', {
				url: '/list',
				templateUrl: 'src/app/inspection/model.html',
				controller: 'modelController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/inspection/modelController.js']);
					}]
				}
			})
			.state('inspection.model.detail', {
				url: '/detail/{modelId}',
				templateUrl: 'src/app/inspection/modelDetail.html',
				controller: 'modelDetailController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/inspection/modelDetailController.js']);
					}]
				}
			})
			.state('inspection.implement', {
				abstract: true,
				url: '/implement',
				template: '<div ui-view class="fade-in-right-big smooth"></div>',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/inspection/implementService.js', 'src/app/inspection/implementDirective.js', 'res/css/inspectionImplement.css']);
					}]
				}
			})
			.state('inspection.implement.list', {
				url: '/list/{status}',
				templateUrl: 'src/app/inspection/implement.html',
				controller: 'implementController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/inspection/implementController.js']);
					}]
				}
			})
			.state('inspection.implement.browse', {
				url: '/browse/{id}', // id：巡检计划id
				templateUrl: 'src/app/inspection/implementBrowse.html',
				controller: 'implementBrowseController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/inspection/implementBrowseController.js']);
					}]
				}
			})
			.state('inspection.implement.execute', {
				url: '/execute/{id}',	// id：巡检计划id
				templateUrl: 'src/app/inspection/implementExecute.html',
				controller: 'implementExecuteController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/inspection/implementExecuteController.js']);
					}]
				}
			})
			.state('inspection.implement.success', {
				url: '/success/{planId}/{id}', // planId:巡检计划id id: 巡检实施id
				templateUrl: 'src/app/inspection/implementSuccess.html',
				controller: 'implementSuccessController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/inspection/implementSuccessController.js']);
					}]
				}
			})
			.state('inspection.acceptance', {
				url: '/acceptance/{status}',
				templateUrl: 'src/app/inspection/inspection_acceptance.html',
				controller: 'inspectionAcceptanceController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/inspection/inspection_acceptance.js', 'src/app/pm/css/pm_list.css', 'src/app/pm/service/pm_util_service.js']);
					}]
				}
			})
			.state('inspection.report', {
				url: '/report',
				templateUrl: 'src/app/inspection/inspection_report.html',
				controller: 'inspectionReportController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/inspection/inspectionReport.js', 'src/app/pm/css/pm_list.css', 'src/app/pm/service/pm_util_service.js']);
					}]
				}
			})
			// pm---start
			.state('pm', {
				abstract: true,
				url: '/pm/{tenantId}',
				templateUrl: 'src/tpl/pm.html'
			})
			// pm - 菜单视图
			.state('pm.menu', {
				url: '/menu',
				templateUrl: 'src/tpl/pmmenu.html',
				controller: 'pmMenuController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/directives/select/select.css', 'src/directives/select/select.js', 'src/app/pm/css/pm_list.css', 'src/app/pm/service/pm_filter.js', 'src/app/pm/service/pm_db_service.js', 'src/app/pm/service/pm_util_service.js', 'src/app/pm/pm_menu.js']);
					}]
				}
			})
			// pm - pm概览
			.state('pm.menu.dashbord', {
				url: '/dashbord',
				templateUrl: 'src/app/pm/html/pm_dashbord.html',
				controller: 'pmDashbordController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['res/css/general.css', 'lib/echarts/echarts.min.js', 'src/app/pm/js/pm_dashbord.js']);
					}]
				}
			})
			// pm - 计划列表
			.state('pm.menu.plan', {
				url: '/plan',
				templateUrl: 'src/app/pm/html/pm_plan.html',
				controller: 'pmPlanController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/pm/js/pm_plan.js']);
					}]
				}
			})
			// pm - 新建计划
			.state('pm.menu.planadd', {
				url: '/planadd',
				templateUrl: 'src/app/pm/html/pm_plan_add.html',
				controller: 'pmPlanAddController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/pm/css/pm_add.css', 'src/app/pm/js/pm_plan_add.js']);
					}]
				}
			})
			// pm - 编辑计划
			.state('pm.menu.planedit', {
				url: '/planedit/{id}',
				templateUrl: 'src/app/pm/html/pm_plan_edit.html',
				controller: 'pmPlanEditController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/pm/css/pm_implement_execute.css', 'src/app/pm/css/pm_add.css', 'src/app/pm/js/pm_plan_edit.js']);
					}]
				}
			})
			// pm - 查看计划详情
			.state('pm.menu.planinfo', {
				url: '/planinfo/{id}',
				templateUrl: 'src/app/pm/html/pm_plan_info.html',
				controller: 'pmPlanInfoController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/pm/css/pm_implement_execute.css', 'src/app/pm/js/pm_plan_info.js']);
					}]
				}
			})
			// pm - 实施列表
			.state('pm.menu.implement', {
				url: '/implement/{status}',
				templateUrl: 'src/app/pm/html/pm_implement.html',
				controller: 'pmImplementController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/pm/js/pm_implement.js']);
					}]
				}
			})
			// pm-实施
			.state('pm.menu.implementsuccess', {
				url: '/implementsuccess/{id}',
				templateUrl: 'src/app/pm/html/pm_implement_success.html',
				controller: 'pmImplementSuccessController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/pm/css/pm_implement_execute.css', 'src/app/pm/js/pm_implement_success.js']);
					}]
				}
			})
			// pm-实施结束
			.state('pm.menu.doimplement', {
				url: '/doimplement/{id}',
				templateUrl: 'src/app/pm/html/pm_implement_execute.html',
				controller: 'pmImplementExecuteController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/pm/css/pm_implement_execute.css', 'src/app/pm/js/pm_implement_execute.js']);
					}]
				}
			})
			// pm - 模板列表
			.state('pm.menu.template', {
				url: '/template',
				templateUrl: 'src/app/pm/html/pm_template.html',
				controller: 'pmTemplateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/pm/js/pm_template.js']);
					}]
				}
			})
			.state('pm.menu.templateinfo', {
				url: '/templateinfo/{id}',
				templateUrl: 'src/app/pm/html/pm_template_info.html',
				controller: 'pmTemplateInfoController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/pm/js/pm_template_info.js']);
					}]
				}
			})
			// pm - 验收
			.state('pm.menu.acceptance', {
				url: '/acceptance/{status}',
				templateUrl: 'src/app/pm/html/pm_acceptance.html',
				controller: 'pmAcceptanceController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/pm/js/pm_acceptance.js']);
					}]
				}
			})
			// pm - 报告查询
			.state('pm.menu.report', {
				url: '/report',
				templateUrl: 'src/app/pm/html/pm_report.html',
				controller: 'pmReportController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/pm/js/pm_report.js']);
					}]
				}
			})
			// 单据申请 
			.state('repair.apply', {
				url: '/apply',
				template: '<div ui-view class="fade-in-right-big smooth"></div>',
				controller: 'baseController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['res/css/repair.css', 'src/app/repair/js/base.js', 'src/app/repair/service/apply_db_service.js']);
					}]
				}
			})
			.state('repair.apply.list', {
				url: '/list/{status}',
				templateUrl: 'src/app/repair/html/apply_list.html',
				controller: 'applyListController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/repair/css/apply_list.css', 'src/app/repair/js/apply_list.js']);
					}]
				}
			})
			.state('repair.apply.add', {
				url: '/add',
				templateUrl: 'src/app/repair/html/apply_add.html',
				controller: 'applyAddController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/repair/css/apply_add.css', 'src/app/repair/js/apply_add.js', 'res/css/newrepair.css', 'res/css/zctz.css', 'res/css/manage.css']);
					}]
				}
			})
			.state('repair.apply.detail', {
				url: '/detail/{billApplyId}',
				templateUrl: 'src/app/repairnew/applyDetail.html',
				controller: 'applyDetailController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/repairnew/applyDetailController.js', 'res/css/zkgl.css']);
					}]
				}
			})
			// 单据审批
			.state('repair.audit', {
				url: '/audit',
				template: '<div ui-view class="fade-in-right-big smooth"></div>',
				controller: 'baseController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['res/css/repair.css', 'src/app/repair/js/base.js']);
					}]
				}
			})
			.state('repair.audit.list', {
				url: '/list',
				templateUrl: 'src/app/repair/html/audit_list.html',
				controller: 'auditListController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/repair/css/audit_list.css', 'src/app/repair/js/audit_list.js', 'res/css/supTree.css', 'res/css/org.css']);
					}]
				}
			})
			.state('repair.audit.detail', {
				url: '/detail/{billApplyId}/{type}',
				templateUrl: 'src/app/repairnew/approveDetail.html',
				controller: 'approveDetailController',
				resolve: {
					deps: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(['src/app/repairnew/approveDetailController.js', 'src/app/repair/service/apply_db_service.js', 'res/css/zkgl.css', 'res/css/repair.css',]);
					}]
				}
			})
			// 维修配置
			.state('repair.repairconfig', {
				url: '/repairconfig',
				template: '<div ui-view class="fade-in-right-big smooth"></div>',
				controller: 'baseController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['res/css/repair.css', 'src/app/repair/js/base.js', 'src/app/repair/service/apply_db_service.js']);
					}]
				}
			})
			.state('repair.repairconfig.config', {
				url: '/config',
				templateUrl: 'src/app/repair/html/repair_config.html',
				controller: 'repairConfigController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/repair/css/apply_list.css', 'src/app/repair/css/repair_config.css', 'src/app/repair/js/repair_config.js']);
					}]
				}
			})
			// 工作流配置
			.state('repair.flowconfig', {
				url: '/flowconfig',
				template: '<div ui-view class="fade-in-right-big smooth"></div>',
				controller: 'baseController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['res/css/repair.css', 'src/app/repair/js/base.js', 'src/app/repair/service/apply_db_service.js']);
					}]
				}
			})
			.state('repair.flowconfig.config', {
				url: '/config',
				templateUrl: 'src/app/repair/html/flow_config.html',
				controller: 'flowConfigController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/repair/css/flow_config.css', 'src/app/repair/js/flow_config.js']);
					}]
				}
			})
			// 设备保养 --- start
			.state('maintain', {
				abstract: true,
				url: '/maintain/{tenantId}',
				templateUrl: 'src/tpl/maintain.html'
			})
			// 设备保养 - 菜单视图
			.state('maintain.menu', {
				url: '/menu',
				templateUrl: 'src/tpl/maintainmenu.html',
				controller: 'maintainMenuController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/maintain/css/maintain_list.css', 'src/app/maintain/service/maintain_filter.js', 'src/app/maintain/service/maintain_db_service.js', 'src/app/maintain/service/maintain_util_service.js', 'src/app/maintain/maintain_menu.js']);
					}]
				}
			})
			// 设备保养 - 计划列表
			.state('maintain.menu.plan', {
				url: '/plan',
				templateUrl: 'src/app/maintain/html/maintain_plan.html',
				controller: 'maintainPlanController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/maintain/js/maintain_plan.js']);
					}]
				}
			})
			// 设备保养 - 新建计划
			.state('maintain.menu.planadd', {
				url: '/planadd',
				templateUrl: 'src/app/maintain/html/maintain_plan_add.html',
				controller: 'maintainPlanAddController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/maintain/css/maintain_add.css', 'src/app/maintain/js/maintain_plan_add.js']);
					}]
				}
			})
			// 设备保养 - 编辑计划
			.state('maintain.menu.planedit', {
				url: '/planedit/{id}',
				templateUrl: 'src/app/maintain/html/maintain_plan_edit.html',
				controller: 'maintainPlanEditController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/maintain/css/maintain_implement_execute.css', 'src/app/maintain/css/maintain_add.css', 'src/app/maintain/js/maintain_plan_edit.js']);
					}]
				}
			})
			// 设备保养 - 查看计划详情
			.state('maintain.menu.planinfo', {
				url: '/planinfo/{id}',
				templateUrl: 'src/app/maintain/html/maintain_plan_info.html',
				controller: 'maintainPlanInfoController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/maintain/css/maintain_implement_execute.css', 'src/app/maintain/js/maintain_plan_info.js']);
					}]
				}
			})
			// 设备保养 - 实施列表
			.state('maintain.menu.implement', {
				url: '/implement/{status}',
				templateUrl: 'src/app/maintain/html/maintain_implement.html',
				controller: 'maintainImplementController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/maintain/js/maintain_implement.js']);
					}]
				}
			})
			// 设备保养-实施
			.state('maintain.menu.implementsuccess', {
				url: '/implementsuccess/{id}',
				templateUrl: 'src/app/maintain/html/maintain_implement_success.html',
				controller: 'maintainImplementSuccessController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/maintain/css/maintain_implement_execute.css', 'src/app/maintain/js/maintain_implement_success.js']);
					}]
				}
			})
			// 设备保养-实施结束
			.state('maintain.menu.doimplement', {
				url: '/doimplement/{id}',
				templateUrl: 'src/app/maintain/html/maintain_implement_execute.html',
				controller: 'maintainImplementExecuteController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/maintain/css/maintain_implement_execute.css', 'src/app/maintain/js/maintain_implement_execute.js']);
					}]
				}
			})
			// 设备保养 - 模板列表
			.state('maintain.menu.template', {
				url: '/template',
				templateUrl: 'src/app/maintain/html/maintain_template.html',
				controller: 'maintainTemplateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/maintain/js/maintain_template.js']);
					}]
				}
			})
			.state('maintain.menu.templateinfo', {
				url: '/templateinfo/{id}',
				templateUrl: 'src/app/maintain/html/maintain_template_info.html',
				controller: 'maintainTemplateInfoController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/maintain/css/maintain_template_info.css', 'src/app/maintain/js/maintain_template_info.js']);
					}]
				}
			})
			// 设备保养 - 报告查询
			.state('maintain.menu.report', {
				url: '/report',
				templateUrl: 'src/app/maintain/html/maintain_report.html',
				controller: 'maintainReportController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/maintain/js/maintain_report.js']);
					}]
				}
			})
			// 设备保养 -- end
			// 计量管理 -- start
			.state('metering', {
				abstract: true,
				url: '/metering/{tenantId}',
				templateUrl: 'src/tpl/metering.html'
			})
			// 计量管理 - 菜单视图
			.state('metering.menu', {
				url: '/menu',
				templateUrl: 'src/tpl/meteringmenu.html',
				controller: 'meteringMenuController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/directives/select/select.css', 'src/directives/select/select.js', 'src/app/metering/css/metering_list.css', 'src/app/metering/service/metering_filter.js', 'src/app/metering/service/metering_db_service.js', 'src/app/metering/service/metering_util_service.js', 'src/app/metering/metering_menu.js']);
					}]
				}
			})
			// 计量管理 - 计量台账
			.state('metering.menu.assets', {
				url: '/assets',
				templateUrl: 'src/app/metering/html/metering_assets.html',
				controller: 'meteringAssetsController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/metering/css/metering_add.css', 'src/app/metering/js/metering_assets.js']);
					}]
				}
			})
			// 计量管理 - 计量检测
			.state('metering.menu.testing', {
				url: '/testing',
				templateUrl: 'src/app/metering/html/metering_testing.html',
				controller: 'meteringTestingController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/metering/js/metering_testing.js']);
					}]
				}
			})
			// 计量管理 - 执行计量检测
			.state('metering.menu.testingexecute', {
				url: '/testingexecute/{id}',
				templateUrl: 'src/app/metering/html/metering_testing_execute.html',
				controller: 'meteringTestingExecuteController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/metering/css/metering_execute.css', 'src/app/metering/js/metering_testing_execute.js']);
					}]
				}
			})
			// 计量管理 - 计量档案
			.state('metering.menu.archives', {
				url: '/archives',
				templateUrl: 'src/app/metering/html/metering_archives.html',
				controller: 'meteringArchivesController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/metering/js/metering_archives.js']);
					}]
				}
			})
			// 计量管理 -- end
			// 档案管理 -- start
			.state('archives', {
				abstract: true,
				url: '/archives/{tenantId}',
				templateUrl: 'src/tpl/archives.html'
			})
			// 档案管理 - 菜单视图
			.state('archives.menu', {
				url: '/menu',
				templateUrl: 'src/tpl/archivesmenu.html',
				controller: 'archivesMenuController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/directives/select/select.css', 'src/directives/select/select.js', 'src/app/archives/css/archives_list.css', 'src/app/archives/service/archives_filter.js', 'src/app/archives/service/archives_db_service.js', 'src/app/archives/service/archives_util_service.js', 'src/app/archives/archives_menu.js']);
					}]
				}
			})
			// 档案管理 - 档案管理
			.state('archives.menu.list', {
				url: '/list',
				templateUrl: 'src/app/archives/html/archives_list.html',
				controller: 'archivesListController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/archives/css/archives_add.css', 'src/app/archives/js/archives_list.js']);
					}]
				}
			})
			// 档杆管理 - 档案查询
			.state('archives.menu.search', {
				url: '/search',
				templateUrl: 'src/app/archives/html/archives_search.html',
				controller: 'archivesSearchController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/archives/js/archives_search.js']);
					}]
				}
			})
			// 档案管理 - 档案查询-档案详情
			.state('archives.menu.searchdetail', {
				url: '/searchdetail/{id}',
				templateUrl: 'src/app/archives/html/archives_searchdetail.html',
				controller: 'archivesSearchdetailController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/archives/css/archives_searchdetail.css', 'res/css/repair.css', 'src/app/archives/js/archives_searchdetail.js']);
					}]
				}
			})
			// 档案管理 -- end
			// 培训管理 -- start
			.state('training', {
				abstract: true,
				url: '/training/{tenantId}',
				templateUrl: 'src/tpl/training.html'
			})
			// 培训管理 - 菜单视图
			.state('training.menu', {
				url: '/menu',
				templateUrl: 'src/tpl/trainingmenu.html',
				controller: 'trainingMenuController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/directives/select/select.css', 'src/directives/select/select.js', 'src/app/training/css/list.css', 'src/app/training/menu.js', 'src/app/training/service/db.js', 'src/app/training/service/util.js']);
					}]
				}
			})
			// 培训管理 - 培训管理
			.state('training.menu.plan', {
				url: '/plan',
				templateUrl: 'src/app/training/html/plan.html',
				controller: 'trainingPlanController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/training/js/plan.js']);
					}]
				}
			})
			// 培训管理 - 培训管理-新增培训
			.state('training.menu.add', {
				url: '/add/{id}',
				templateUrl: 'src/app/training/html/add.html',
				controller: 'trainingAddController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/training/css/add.css', 'src/app/training/js/add.js']);
					}]
				}
			})
			// 培训管理 - 培训管理/培训档案-培训详情/档案详情
			.state('training.menu.info', {
				url: '/info/{id}/{type}', // type取值 1：培训 2：档案
				templateUrl: 'src/app/training/html/info.html',
				controller: 'trainingInfoController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/training/css/info.css', 'src/app/training/js/info.js']);
					}]
				}
			})
			// 培训管理 - 培训档案
			.state('training.menu.archives', {
				url: '/archives',
				templateUrl: 'src/app/training/html/archives.html',
				controller: 'trainingArchivesController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/training/js/archives.js']);
					}]
				}
			})
			// 培训管理 -- end
			// 医疗管理委员会（会议记录） -- start
			.state('meeting', {
				abstract: true,
				url: '/meeting/{tenantId}',
				templateUrl: 'src/tpl/meeting.html'
			})
			// 医疗管理委员会 - 菜单视图
			.state('meeting.menu', {
				url: '/menu',
				templateUrl: 'src/tpl/meetingmenu.html',
				controller: 'meetingMenuController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/directives/select/select.css', 'src/directives/select/select.js', 'src/app/meeting/css/list.css', 'src/app/meeting/menu.js', 'src/app/meeting/service/db.js', 'src/app/meeting/service/util.js']);
					}]
				}
			})
			// 医疗管理委员会 - 会议管理
			.state('meeting.menu.plan', {
				url: '/plan',
				templateUrl: 'src/app/meeting/html/plan.html',
				controller: 'meetingPlanController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/meeting/js/plan.js']);
					}]
				}
			})
			// 医疗管理委员会 - 会议管理-新增会议
			.state('meeting.menu.add', {
				url: '/add/{id}',
				templateUrl: 'src/app/meeting/html/add.html',
				controller: 'meetingAddController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/meeting/css/add.css', 'src/app/meeting/js/add.js']);
					}]
				}
			})
			// 医疗管理委员会 - 会议管理/会议档案-会议管理详情/会议档案详情
			.state('meeting.menu.info', {
				url: '/info/{id}/{type}', // type取值 1：培训 2：档案
				templateUrl: 'src/app/meeting/html/info.html',
				controller: 'meetingInfoController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/meeting/css/info.css', 'src/app/meeting/js/info.js']);
					}]
				}
			})
			// 医疗管理委员会 - 会议档案
			.state('meeting.menu.archives', {
				url: '/archives',
				templateUrl: 'src/app/meeting/html/archives.html',
				controller: 'meetingArchivesController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/meeting/js/archives.js']);
					}]
				}
			})
			// 医疗管理委员会（会议记录） -- end
			// 质控管理 -- start
			.state('quality', {
				abstract: true,
				url: '/quality/{tenantId}',
				templateUrl: 'src/tpl/quality.html'
			})
			// 质控管理 - 菜单视图
			.state('quality.menu', {
				url: '/menu',
				templateUrl: 'src/tpl/qualitymenu.html',
				controller: 'qualityMenuController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/directives/select/select.css', 'src/directives/select/select.js', 'src/app/quality/css/list.css', 'src/app/quality/menu.js', 'src/app/quality/service/db.js', 'src/app/quality/service/util.js']);
					}]
				}
			})
			// 质控管理 - 质控填报
			.state('quality.menu.apply', {
				url: '/apply',
				templateUrl: 'src/app/quality/html/apply.html',
				controller: 'qualityApplyController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/quality/js/apply.js']);
					}]
				}
			})
			// 质控管理 - 质控填报-新增填报
			.state('quality.menu.add', {
				url: '/add/{id}/{type}',
				templateUrl: 'src/app/quality/html/add.html',
				controller: 'qualityAddController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/quality/css/add.css', 'src/app/quality/js/add.js']);
					}]
				}
			})
			// 质控管理 - 质控填报-查看详情
			.state('quality.menu.applyinfo', {
				url: '/applyinfo/{id}',
				templateUrl: 'src/app/quality/html/applyinfo.html',
				controller: 'qualityApplyinfoController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/quality/css/auditinfo.css', 'src/app/quality/js/applyinfo.js']);
					}]
				}
			})
			// 质控管理 - 质控审核
			.state('quality.menu.audit', {
				url: '/audit/{status}',
				templateUrl: 'src/app/quality/html/audit.html',
				controller: 'qualityAuditController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/quality/js/audit.js']);
					}]
				}
			})
			// 质控管理 - 质控审核-查看详情
			.state('quality.menu.auditinfo', {
				url: '/auditinfo/{id}',
				templateUrl: 'src/app/quality/html/auditinfo.html',
				controller: 'qualityAuditinfoController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/quality/css/auditinfo.css', 'src/app/quality/js/auditinfo.js']);
					}]
				}
			})
			// 质控管理 - 质控档案
			.state('quality.menu.archives', {
				url: '/archives',
				templateUrl: 'src/app/quality/html/archives.html',
				controller: 'qualityArchivesController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/quality/js/archives.js']);
					}]
				}
			})
			// 质控管理 - 质控档案-查看详情
			.state('quality.menu.archivesinfo', {
				url: '/archivesinfo/{id}',
				templateUrl: 'src/app/quality/html/archivesinfo.html',
				controller: 'qualityArchivesinfoController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/quality/css/auditinfo.css', 'src/app/quality/js/archivesinfo.js']);
					}]
				}
			})
			// 质控管理 - 质控模板
			.state('quality.menu.template', {
				url: '/template',
				templateUrl: 'src/app/quality/html/template.html',
				controller: 'qualityTemplateController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/quality/js/template.js']);
					}]
				}
			})
			// 质控管理 - 质控模板-查看详情
			.state('quality.menu.templateinfo', {
				url: '/templateinfo/{type}/{id}',
				templateUrl: 'src/app/quality/html/templateinfo.html',
				controller: 'qualityTemplateinfoController',
				resolve: {
					deps: ['uiLoad', '$ocLazyLoad', function (uiLoad, $ocLazyLoad) {
						return uiLoad.load(['src/app/quality/css/templateinfo.css', 'src/app/quality/js/templateinfo.js']);
					}]
				}
			})
		// 质控管理 -- end
	}])
	.controller("navCtrl", function ($rootScope, $state) {

	})
	.run(['$rootScope', '$state', '$stateParams', '$timeout', '$templateCache',
		function ($rootScope, $state, $stateParams, $timeout, $templateCache) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
			$rootScope.userOr = true;
			$rootScope.user = {};
			$rootScope.currentorganization = '杭州市第一人民医院';
			$rootScope.currentoffice = '心内科';
			$rootScope.currentname = '张楚明';
			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
				if (toState.name == 'inspection.plan.list') {
					if ($rootScope.userInfo.authoritiesStr.indexOf('QC_PLAN_VIEW') != -1)
						return;
					if ($rootScope.userInfo.authoritiesStr.indexOf('QC_PLAN_IMPLEMENT') != -1)
						return $state.go('inspection.implement.list', { tenantId: toParams.tenantId || $rootScope.userInfo.tenantId }, { reload: true });
					if ($rootScope.userInfo.authoritiesStr.indexOf('QC_TEMPLATE_VIEW') != -1)
						return $state.go('inspection.model.list', { tenantId: toParams.tenantId || $rootScope.userInfo.tenantId }, { reload: true });
					// event.preventDefault();
				}
				var from = fromState.name,
					to = toState.name;
				if (from && to) { // 解决 相应模块从列表进入编辑后 状态丢失问题
					var s1 = from.substring(0, from.lastIndexOf(".")),
						g1 = from.substring(from.lastIndexOf(".") + 1),
						s2 = to.substring(0, to.lastIndexOf(".")),
						g2 = to.substring(to.lastIndexOf(".") + 1);
					if (s1 == s2) {
						if (g1 == 'list' && (g2 == 'update' || g2 == 'view')) { //进行编辑
							toParams['params'] = window.location.hash;
						}
						//返回列表
						if ((g1 == "update" || g1 == 'view') && g2 == 'list') {
							var h = fromParams['params'];
							if (h) {
								$timeout(function () {
									window.location.hash = h;
								});
							}
						}
					}
				}

				//路由切换后清除所有layer弹窗，及全局组件，例如日历控件
				layer.closeAll();
				$('.daterangepicker').remove();
			});
		}
	]);