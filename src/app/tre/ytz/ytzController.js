'use strict';

angular.module('app')

.controller('ytzController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', '$compile', '$filter', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage, $compile, $filter) {
	$scope.localStorageHad=function(){
		if(!$localStorage.userInfo){
			return $state.go('website.home');
		}
	}
	$scope.localStorageHad();
	//图片
	$scope.fileUrlBase = 'http://' + window.location.host + '/api/file';

	$rootScope.userOr = true;
	$rootScope.membernav = false;
	$rootScope.currentmodule = "资产管理";
	$scope.stateN = '';
	$scope.states = [];
	$scope.depetshow = false;
	$scope.sortName = 1; //排序 
	$scope.devshow = false;
	$scope.tenantId = $stateParams.tenantId || $localStorage.userInfo.tenantId; //机构id
	
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

	$scope.keyword = {
		nameSearch: '', //科室名称
		deciveName: '',
		deptkey: 0
	}
	$scope.deptList = [];
	$scope.deptarr = [];
	$scope.searchCondition = {}; //搜索条件
	$scope.statenameList = false;
	$scope.sortstatus = [{
		id: 1,
		name: '默认排序'
	}, {
		id: 2,
		name: '状态排序'
	}];
	$scope.sortList = false;
	//arguments query, status, deptId, current, size, sort,keyword
	/*获取列表*/
	$scope.getAssetsList = function(setting) {

			setting = setting || {};
			var arg = arguments;
			$.ajax({
				type: "get",
				url: "/assets/preAssetsInfo/getAssetsPage",
				data: {
					"query": setting.query || '', //关键字
					"tenantId": $scope.tenantId,
					"status": setting.status, //状态
					"deptId": setting.deptId || '', //部门id
					"page.current": setting.current || 1, //当前页
					"page.size": setting.size || 8, //每页数目
					"sort": setting.sort || 1, //排序 
					"keyword": setting.keyword || '' //关键字
				},
				complete: function(res) {
					$scope.pageInfo = res.responseJSON.data;
					$scope.pageInfo.pstyle = 2;
					$scope.assetslist = res.responseJSON.data.records;
					$rootScope.$apply();
				}

			})

		}
		/*显示状态列表*/
	$scope.showstateList = function() {
		if($scope.statenameList) {
			return $scope.hideAll();
		}
		$scope.statenameList = !$scope.statenameList;
		$scope.devshow = !$scope.devshow;
	}
	$scope.changeState = function(name, id) {
			$scope.stateN = id;
			$scope.stateName = name;
			$scope.changeListByState(id);
			$scope.statenameList = !$scope.statenameList;
			$scope.hideAll();
		}
		/*显示排序列表*/
	$scope.showsortList = function() {
		$scope.sortList = !$scope.sortList;
	}

	$scope.sortshowName = '默认排序';

	$scope.changesort = function(name, id) {
			$scope.sortList = !$scope.sortList;
			$scope.sortName = id;
			console.log(name)
			$scope.sortshowName = name;
			$scope.changeAssetsList(id);
		}
		// hd获取弹窗的下拉菜单
	$scope.baseMsg = function() {
		$.ajax({
			type: "get",
			url: '/assets/data/geCodeInfoByType?types=ACCOUNT_CATEGORY&types=MANAGE_LEVEL&types=FUND_SOURCES&types=UNIT&types=PURCHASE_TYPE&types=MEASURE_TYPE&types=DEP_TYPE&types=PURPOSE&types=ACCOUNT_BOOK',
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					var data = res.responseJSON.data;
					// 核算类别
					$scope.batchSetStateList = data.ACCOUNT_CATEGORY
						// 管理界别
					$scope.hdmanageLevels = data.MANAGE_LEVEL
						// 资金来源
					$scope.hdfoundsources = data.FUND_SOURCES
				}
			}
		});
	}
	$scope.baseMsg()

	$scope.changeAssetsList = function(sortName) {
		$scope.getAssetsList({
			"sort": sortName,
			"keyword": $scope.keyword.deciveName,
			//"status": $scope.stateN,
			"current": 1, //当前页
			"size": 8 //每页数目
		});

	}

	$scope.changeListByState = function(sortName) {
		//$scope.stateN=sortName;
		$scope.getAssetsList({
			"status": sortName,
			"current": 1, //当前页
			"deptId": $scope.keyword.deptkey,
			"size": 8, //每页数目,
			"keyword": $scope.keyword.deciveName
		});

	}

	$scope.pagination = function(page, pagesize) {
		$scope.getAssetsList({
			"current": page,
			"size": pagesize,
			"status": $scope.stateN,
			"sort": $scope.sortName
		});
	}

	$scope.searchAssets = function() {
			$scope.getAssetsList({
				"status": $scope.stateN,
				"deptId": $scope.keyword.deptkey,
				"sort": $scope.sortName,
				"keyword": $scope.keyword.deciveName
			});

		}
		/*获取状态人数*/
	$scope.getStatusTotalNum = function() {
		$.ajax({
			type: "get",
			url: "/assets/preAssetsInfo/getStatusTotalNum",
			complete: function(res) {
				var resData = res.responseJSON.data;
				$scope.stateN = '';
				$scope.states = [{
					id: '',
					// name: "全部状态(" + resData.verfyStatusAll + ")"
					name: "全部状态"
				}, {
					id: 0,
					// name: "暂存(" + resData.verfyStatusStage + ")"
					name: "暂存"
				}, {
					id: 1,
					// name: "待验收(" + resData.verfyStatusUnaudited + ")"
					name: "待验收"
				}, {
					id: 2,
					// name: "验收通过(" + resData.verfyStatusPass + ")"
					name: "验收通过"
				}, {
					id: 3,
					// name: "验收未通过(" + resData.verfyStatusUnPass + ")"
					name: "验收未通过"
				}]
				$scope.stateName = $scope.states[0].name;
				$rootScope.$apply();

			}
		});
	}

	//生成预台账
	$scope.saveAssets = function(device, producer) {

		$.ajax({
			type: "post",
			url: "/assets/preAssetsInfo/add",
			contentType: "application/json",
			data: JSON.stringify({
				"assetsName": device,
				"factoryName": producer

			}),
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					var index = layer.open({
						time: 0, //不自动关闭
						content: '<div class="new-ytz">' +
							'<div class="m-t-b-md"><img src="../../../../res/img/cg.png"/></div>' +
							'<div>预台账创建成功，现在去完善预台账信息？</div>' +
							'</div>',
						title: ['提示', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
						closeBtn: 1,
						shade: 0.3,
						shadeClose: true,
						btn: ['完善预台账信息', '稍后再说'],
						btn2: function(index) {
							layer.close(index);
							$state.go('main.tre.ytz.list', null, {
								id: $stateParams.id,
								reload: true
							});

						},
						yes: function(index) {
							layer.close(index);
							$state.go('main.tre.ytz.assets', {
								id: $stateParams.id,
								assetId: res.responseJSON.data,
								state: 0
							});
						},
						cancel: function(index) {
							layer.close(index);
							$state.go('main.tre.ytz.list', null, {
								id: $stateParams.id,
								reload: true
							});
						},
						area: ['500px', '240px'],
						btnAlign: 'r'
					});

				}
			}
		});

	};
	$scope.hideAll = function() {
		$scope.devshow = false;
		$scope.depetshow = false;
		$scope.statenameList = false;

		// 批量设置
		$scope.batchSetDeptInShow = false;
		$scope.batchSetDeptByShow = false;
		$scope.batchSetDeptMgShow = false;

		$scope.batchSetDeptWrapShow = false;
		$scope.batchSetStateListShow = false;
		// 新建预台账
		$scope.newTreListDept = false;
		$scope.newTreListStateShow = false;
		$scope.newTreListAccountShow = false;
		$scope.newTreListManageShow = false;
		$scope.newTreListSourceShow = false;
	}

	//设置科室名称
	$scope.setDeptValue = function(id, name) {
		$scope.depetName = name;
		$scope.depetshow = false;
		$scope.deptList = [];
		$scope.keyword.deptkey = id;
		$scope.devshow = false;

	}

	//获取科室名称
	$scope.searchList = function(type) {

		$.ajax({
			type: "get",
			url: "/sys/dept/search/tenant/" + $scope.tenantId,
			data: {
				keyword: $scope.keyword.nameSearch
			},
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					if(type) {
						$scope.deptarr = res.responseJSON.data;
					} else {
						$scope.deptList = res.responseJSON.data;
					}

					$rootScope.$apply();
				}

			}
		});
	}

	//查询机构下的部门
	$scope.getDeptList = function(key) {
		$.ajax({
			type: "get",
			url: "/sys/dept/search/tenant/" + ($stateParams.id || $localStorage.userInfo.tenantId),
			data: {
				keyword: key
			},
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					$scope.searchResult = res.responseJSON.data;
					$rootScope.$apply();
				}
			}
		});
	}

	$scope.getAssetsList();
	$scope.getStatusTotalNum();

	/*展示部门列表*/
	$scope.showdeptList = function() {
		if($scope.devshow) {
			return $scope.hideAll();
		}

		$scope.depetName = '';
		$scope.keyword.deptkey = 0;
		$scope.depetshow = true;
		$scope.devshow = true;
		/*if($scope.depetName) {
			$scope.depetshow = true;
		} else {
			$scope.depetshow = false;
		}*/
	}
	$scope.showdevList = function() {
		if($scope.devName) {
			$scope.devshow = true;
		} else {
			$scope.devshow = false;
		}
	}
	$scope.divblur = function() {
		$scope.depetshow = false;
	}

	/*条件不同的页面*/
	$scope.hrefs = function($event, state, id) {
		$state.go('main.tre.ytz.assets', {
			id: $stateParams.id,
			state: state,
			assetId: id
		});
	}

	$scope.calee = function() {

		var name, value;
		var str = location.href; //取得整个地址栏
		var num = str.indexOf("?")
		str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

		var arr = str.split("&"); //各个参数放到数组里
		for(var i = 0; i < arr.length; i++) {
			num = arr[i].indexOf("=");
			if(num > 0) {
				name = arr[i].substring(0, num);
				value = arr[i].substr(num + 1);
				this[name] = value;
			}
			switch(this.state) {
				case '0':
					$('.fix-btns').html('<a name="print" class="pos-fix-btn pf-btn-save">打印出库单</a>' +
						'<a name="cancle" class="pos-fix-btn pf-btn-save">取消</a>' +
						'<a name="save" class="pos-fix-btn pf-btn-save">保存</a>');
					$('.pro-status').css('display', 'none');
					break;
				case '1':
					$('.fix-btns').html('<a name="print" class="pos-fix-btn pf-btn-sub btn-hover">提醒审核</a>' +
						'<a name="print" class="pos-fix-btn pf-btn-save">打印出库单</a>');
					$('.pro-ul em').text('待审核');
					$('.pro-ul li:last-child').remove();
					$('.pro-ul li:last-child').remove();
					break;
				case '2':
					$('.fix-btns').html('<a name="print" class="pos-fix-btn pf-btn-sub btn-hover">提醒审核</a>');
					$('.pro-ul em').text('审核待通过');
					$('.pro-ul li:last-child').remove();
					break;
				case '3':
					$('.fix-btns').html('<a name="print" class="pos-fix-btn pf-btn-sub btn-hover">提醒记账</a>');
					$('.pro-ul em').text('审核通过待记账');
					$('.pro-ul li:last-child').remove();
					break;
				case '4':
					$('.fix-btns').html('<a name="print" class="pos-fix-btn pf-btn-sub btn-hover">提醒记账</a>' +
						'<a name="print" class="pos-fix-btn pf-btn-save">打印出库单</a>');
					$('.pro-ul em').text('记账待通过');
					$('.pro-ul li:last-child').remove();
					break;
				case '5':
					$('.fix-btns').html('');
					$('.pro-ul em').text('已出库');
					break;
				default:
					break;
			}
		}
	}

	$scope.calee();

	$scope.toAssets = function() {
		var index = layer.open({
			time: 0 //不自动关闭
				,
			content: '<form class="preledform" id="preledform"><ul class="input-ytz">' +
				'<li><span class="fixWidth"><i>*</i>设备名称:</span><input type="text"  name="deviceName"  class="deviceName" maxlength="40" required /></li>' +
				'<label class="errorMsg" for="deviceName"></label>' +
				'<li><span class="fixWidth"><i>*</i>生产商:</span><input type="text" name="producerName" class="producerName" maxlength="40"  required /></li>' +
				'<label class="errorMsg" for="producerName"></label>' +
				'</ul></form>',
			title: ['新建预台账', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
			closeBtn: 1,
			shade: 0.3,
			success: function() {
				var validator = $("#preledform").validate({
					errorPlacement: function(error, element) {

						// Append error within linked label

						$(element).closest("form")
							.find("label[for='" + element.attr("name") + "']")
							.append(error);
					},
					errorElement: "span",
					keyup: function(element) {
						$(element).valid();
					},
					messages: {
						deviceName: {
							required: "请输入设备名称",
							maxlength: " 不能大于 40 个字符"
						},
						producerName: {
							required: "请输入生产商",
							maxlength: " 不能大于 40个字符"
						}
					},
					submitHandler: function() {
						var deviceNameVal = $(".deviceName").val();
						var producerNameVal = $(".producerName").val();
						$scope.saveAssets(deviceNameVal, producerNameVal);
					}

				});
			},
			shadeClose: true,
			btn: ['确定', '取消'],
			yes: function(index) {
				$("#preledform").submit();

				//layer.close(index);
				layer.style(index, {
					fontSize: '16px',
					backgroundColor: '#fff',
				});
			},
			cancel: function(index) {

			},
			area: ['500px', '258px'],
			btnAlign: 'r'
		});
		layer.style(index, {
			fontSize: '16px',
			backgroundColor: '#fff',
		});
	}

	$("body").on("click", ".label-item", function(e) {
		$scope.depetshow = !$scope.depetshow;
		$scope.searchListShow = !$scope.searchListShow;
		$scope.addDepetName = e.target.innerText;
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

	$scope.adddepetshow = false;
	$scope.searchListShow = false;
	$scope.searchListShow2 = false;
	$scope.addAccountList = false;
	$scope.accountArr = [];
	$scope.accountArr3 = [1, 2, 3];

	//遮罩层点击事件，用作隐藏搜索框
	$scope.hideSearchlist = function() {
		$scope.searchListShow = !$scope.searchListShow;
		$scope.adddepetshow = !$scope.adddepetshow;
	}

	//遮罩层点击事件，用作隐藏下拉框
	$scope.hideSearchlist2 = function() {
		$scope.searchListShow2 = !$scope.searchListShow2;
		$scope.addAccountList = !$scope.addAccountList;
	}

	/*展示新建预台账部门列表*/
	$scope.showAddDeptList = function() {
		$scope.searchListShow = !$scope.searchListShow;
		$scope.adddepetshow = !$scope.adddepetshow;
		/*if($scope.depetName) {
		 $scope.depetshow = true;
		 } else {
		 $scope.depetshow = false;
		 }*/
	}

	$scope.getBaseYtz = function(key) {
		$.ajax({
			type: 'get',
			url: '/assets/data/baseConfig',
			contenType: 'application/json;charset=UTF-8',
			data: {
				key: key
			},
			complete: function(res) {
				if(res.responseJSON.code == 200) {}
			}
		})
	}

	$scope.getBaseYtz('ACCOUNT_CATEGORY');
	$scope.getBaseYtz('MANAGE_LEVEL');
	$scope.getBaseYtz('FUND_SOURCES');

	$scope.addYtz = function(index) {
			if($scope.addytzForm.$invalid) {
				angular.forEach($scope.addytzForm.$error.required, function(data, index, currentArr) {
					data.$dirty = true; //必填选项
				})
				$rootScope.$apply();
				return;
			}

			var data = {
				assetsClassId: 3,
				assetsName: $scope.addAssetsName,
				assetsSpec: $scope.addSpc,
				assetsStatus: 2,
				deptId: $scope.addDeptId,
				factoryName: $scope.addManufacturer,
				factoryNum: $scope.addFacNum
			}

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

			layer.close(index);

		}
		/*解决ng-repeat重复的问题*/
		/*$scope.setStyleRpeat=function(arr,class){
			angular.forEach(arr,function(data,index,currentArr){
				$("."+class+index)[0].style.display="inline-block";
			})  	
		}*/
	$("body").on("click", ".accountItem", function(e) {
		$scope.addAccountList = !$scope.addAccountList;
		$scope.searchListShow = false;
		$scope.addAccountId = e.target.id;
		$scope.addAccountName = e.target.innerText
		$rootScope.$apply();

	})

	$scope.$watch("accountArr", function(newValue, oldValue, scope) {
		var $html = '';
		angular.forEach($scope.accountArr, function(item) {
			$html += '<li  id=' + item.id + '  class="acolor999 accountItem"  >' + item.name + '</li>'
		})
		$("#addYtzCon").find(".accountWrap").append($html);

	});

	$scope.showAccountList = function() {
		$scope.addAccountList = !$scope.addAccountList;
		$scope.searchListShow2 = !$scope.searchListShow2;
	}

	//初始化日历
	$scope.initcalendar = function() {
		var option = {
			format: 'YYYY-MM-DD',
			startDate: '2017-01-01',
			endDate: new Date(),
			minDate: new Date(new Date() - 24 * 60 * 60 * 1000),
			maxDate: new Date("2050-01-01"),
			timePicker: false,
			opens: "top",
			singleDatePicker: true
		};

		angular.element('.input-datepicker').daterangepicker($.extend({}, option, {
			startDate: new Date()
		}), function(date, enddate, el) {
			var currentel = $(this.element).attr("name");
			currentel == "expireDate" && ($scope.expireStr = date.format('YYYY-MM-DD'));
			$rootScope.$apply();
		});
	}

	$scope.initialDate = function() {
		$scope.expireStr = $filter('date')(new Date(), 'yyyy-MM-dd');
	}

	// 基础数据
	$scope.getAllList = function() {
		$.ajax({
			type: 'get',
			url: '/assets/data/geCodeInfoByType?types=ACCOUNT_CATEGORY&types=MANAGE_LEVEL&types=FUND_SOURCES&types=UNIT&types=PURCHASE_TYPE&types=MEASURE_TYPE&types=DEP_TYPE&types=PURPOSE&types=ACCOUNT_BOOK',
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					var data = res.responseJSON.data;
					$scope.ACCOUNT_CATEGORY = data.ACCOUNT_CATEGORY; // 核算类别
					$scope.MANAGE_LEVEL = data.MANAGE_LEVEL; // 管理级别
					$scope.FUND_SOURCES = data.FUND_SOURCES; // 资金来源

					// $scope.batchSetStateList = [{
					//     id: '',
					//     status: "全部状态"
					// }, {
					//     id: 0,
					//     status: "暂存"
					// }, {
					//     id: 1,
					//     status: "待验收"
					// }, {
					//     id: 2,
					//     status: "验收通过"
					// }, {
					//     id: 3,
					//     status: "验收不通过"
					// }];

					$scope.$apply()
				} else {}
			}
		});
	}
	$scope.getAllList();

	$scope.newTreListInt = function() {
		$scope.newTreObj = {};
		$scope.newTreListDept = false;
		$scope.newTreListStateShow = false;
		$scope.newTreListAccountShow = false;
		$scope.newTreListManageShow = false;
		$scope.newTreListSourceShow = false;

		$scope.assetsNameErr = false;
		$scope.factoryNameErr = false;
		$scope.assetsOfficeNameErr = false;

		$scope.newTreListShow = false;

		$scope.newTreListMore = false;
		$scope.newTreListChangeTxt = '更多';
	}

	var layerNewTre;

	$scope.newTreListInt();
	$scope.newTre = function() {
		// $scope.threeLevelCodeErr = false;
		$scope.newTreListOffice = {
			id: '',
			name: ''
		};
		$scope.newTreListAccount = {
			id: null,
			status: null
		};
		$scope.newTreListSource = {
			id: null,
			status: null
		};
		$scope.newTreListManage = {
			id: null,
			status: null
		};
		$scope.newTreListState = {
			id: 0,
			status: '暂存'
		};
		$scope.newTreListShow = true;
		layerNewTre = layer.open({
			time: 0, //不自动关闭
			type: 1,
			autoHeight: true,
			id: 'alertNewYtzLayer',
			content: $('.newTreList'),
			title: ['新建预台账', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
			closeBtn: 1,
			btn: 0,
			shade: 0.3,
			shadeClose: true,
			area: '616px',
			end: function() {
				$scope.newTreListInt();
			},
			success: function(layero, index) {
				$(window).trigger("resize");
			}
		});
		layerNewTre.offset(460);
	}

	$scope.limitLength = function(a, b) {
		if(a == 'threeLevelCode'){
            if($scope.newTreObj.threeLevelCode&&($scope.newTreObj.threeLevelCode.length>1)){
                $scope.newTreObj.threeLevelCode=$scope.newTreObj.threeLevelCode.match(/^(68[0-9]{0,4})/g);
                if(Object.prototype.toString.call($scope.newTreObj.threeLevelCode) == '[object Array]'){
                    $scope.newTreObj.threeLevelCode = $scope.newTreObj.threeLevelCode.join('');
				}
			}
		}else{
            $scope.newTreObj[a] = $scope.newTreObj[a].slice(0, b);
            $scope[a + 'Err'] = $scope[a + 'Err'] ? false : '';
		}
	}
	$scope.newTreListChange = function() {
		$scope.newTreListMore = !$scope.newTreListMore;
		$scope.newTreListChangeTxt = $scope.newTreListChangeTxt == '更多' ? '收起' : '更多';
		$scope.newTreListMore ? layerNewTre.offset(600) : layerNewTre.offset(460);
	}
	$scope.newTreList = function(a) {
		$scope.batchSetDeptWrapShow = true;
		$scope[a] = true;
		$scope.searchResult = [];
	}
	$scope.newTreListStates1 = function(a, b, c) {
		$scope[b] = false;
		$scope[a] = c;
		$scope.batchSetDeptWrapShow = false;
		$scope.assetsClassId = c.codeValue
	}
	$scope.newTreListStates2 = function(a, b, c) {

		$scope[b] = false;
		$scope[a] = c;
		$scope.batchSetDeptWrapShow = false;
		$scope.manageLevel = c.codeValue
	}
	$scope.newTreListStates3 = function(a, b, c) {

		$scope[b] = false;
		$scope[a] = c;
		$scope.batchSetDeptWrapShow = false;
		$scope.fundSourcesId = c.codeValue
	}

	$scope.newTreListStates = function(a, b, c) {

		$scope[b] = false;
		$scope[a] = c;
		$scope.batchSetDeptWrapShow = false;
	}
	$scope.initcalendar = function() {
		var option = {
			format: 'YYYY-MM-DD',
			timePicker: false,
			maxDate: new Date("2050-01-01"),
			timePicker12Hour: false,
			opens: "left",
			singleDatePicker: true
		}
		angular.element('.newTrelistDate').daterangepicker($.extend({}, option, {
			startDate: new Date()
		}), function(date, enddate, el) {
			$scope.newTreObj.startUseDate = date.format('YYYY-MM-DD');
		});
		$('.newTrelistDate').on('apply.daterangepicker', function(a, b) {
			$scope.newTreObj.startUseDate = b.startDate.format('YYYY-MM-DD');
		});
	}
	$scope.initcalendar();

	$scope.newTreListOffice = {
		id: '',
		name: ''
	};
	$scope.newTreListAccount = {
		id: null,
		status: null
	};
	$scope.newTreListSource = {
		id: null,
		status: null
	};
	$scope.newTreListManage = {
		id: null,
		status: null
	};
	$scope.newTreListState = {
		id: 0,
		status: '暂存'
	};
	$scope.newTreListYes = function() {
		if(!$scope.newTreListOffice.name||!$scope.newTreListOffice.id){
			return $scope.assetsOfficeNameErr=true;
		}
		if(!$scope.newTreObj.assetsName) {
			return $scope.assetsNameErr = true;
		}
		if(!$scope.newTreObj.factoryName) {
			return $scope.factoryNameErr = true;
		}
		// if($scope.newTreObj.threeLevelCode && $scope.newTreObj.threeLevelCode.length!=6){
         //    return $scope.threeLevelCodeErr = true;
		// }


		var data = {
			"assetsClassId": $scope.assetsClassId,
			"assetsName": $scope.newTreObj.assetsName,
			"assetsSpec": $scope.newTreObj.assetsSpec,
			"assetsStatus": 2, //1:台账,2:预台账
			"deptId": $scope.newTreListOffice.id,
			"factoryName": $scope.newTreObj.factoryName,
			"serialNum":$scope.newTreObj.serialNum,
			"factoryNum": $scope.newTreObj.factoryNum,
			"fundSourcesId": $scope.fundSourcesId,
			"manageLevel": $scope.manageLevel,
			"regNo": $scope.newTreObj.regNo,
			"splName": $scope.newTreObj.splName,
			"startUseDate": $scope.newTreObj.startUseDate,
			// "status": $scope.newTreListState.id,
			"threeLevelCode": $scope.newTreObj.threeLevelCode
		}
console.log($scope.newTreObj.serialNum)
		$.ajax({
			type: 'post',
			url: '/assets/preAssetsInfo/addPreAssets',
			contentType: "application/json;charset=UTF-8",
			data: JSON.stringify(data),
			complete: function(res) {
				if(res.responseJSON.code == 200) {
                    var msg = layer.msg('<div class="toaster"><span>新建成功</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
					$scope.searchAssets()
				} else {
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
		$scope.newTreListNo();
	}

	$scope.newTreListNo = function() {
		layer.closeAll();
		$scope.newTreListInt();
	}

	// 批量设置部门
	$scope.batchSetDeptShow = false;
	$scope.batchSetDeptWrapShow = false;
	$scope.batchSetDeptByIt = {};
	$scope.batchSetDeptInIt = {};
	$scope.batchSetDeptMgIt = {};
	$scope.batchSetDeptInt = function() {
		$scope.batchSetDeptIn = false;
		$scope.batchSetDeptBy = false;
		$scope.batchSetDeptMg = false;

		$scope.batchSetDeptInShow = false;
		$scope.batchSetDeptByShow = false;
		$scope.batchSetDeptMgShow = false;

		$scope.batchSelectSearchWord = '';
	}
	$scope.batchSetDeptInt();
	$scope.batchSelectInputClick = function(n) {
		$scope.batchSetDeptInt();
		$scope.batchSetDeptWrapShow = true;
		$scope[n] = true;
		$scope.searchResult = [];

	}
	$scope.batchSelectLiClick = function(n, m, item) {
		$scope.searchResult = [];
		$scope.batchSelectSearchWord = '';
		$scope[m] = false;
		$scope[n] = item;
		$scope.batchSetDeptWrapShow = false;
		(n=='newTreListOffice')&&($scope.assetsOfficeNameErr=false);
	}
	$scope.batchSearchChange = function() {
		$scope.getDeptList($scope.batchSelectSearchWord);
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
				params.successCallBack && params.successCallBack(el);

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

}]);