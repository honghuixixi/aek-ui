'use strict';

angular.module('app')

.controller('repairManageController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
	$rootScope.currentmodule = "维修管理";
	$rootScope.userInfo = $localStorage.userInfo;
	$scope.typeList = false;
	$scope.typeModel = '紧急程度';
	$scope.statusInfo = '已维修待验收';
	$scope.msgList = [];
	$rootScope.status=$stateParams.status;
	$scope.searchFour='';
	$scope.searchKey={
		searchFour:'',
		searchCon:''
	}
	$scope.searchCon='';
	// 状态转换
	$scope.change=function (l) {
		if(l.status==0){
			return '全部状态'
		}else if(l.status==1){
			return '待接单'
		}else if(l.status==2){
			return '维修中'
		}else if(l.status==3){
			return '待验收'
		}else if(l.status==4){
			return '已完成'
		}
	}
	// 搜索的数据
	$scope.searchOne1 = []
	$scope.searchOne = {'status':0,'msg':''}
	$scope.searchTwo1 = ['紧急程度','不紧急','一般','紧急','非常紧急']
	$scope.searchTwo = $scope.searchTwo1[0]
	$scope.searchThree1 = ['按照时间排序','按照紧急程度排序']
	$scope.searchThree = $scope.searchThree1[0]
	if($rootScope.status){
		if($rootScope.status==1){
			$scope.searchOne = {'status':1 ,'msg':'待接单'}
		}else if($rootScope.status==2){
			$scope.searchOne = {'status':2 ,'msg':'维修中'}
		}else if($rootScope.status==3){
			$scope.searchOne = {'status':3 ,'msg':'待验收'}
		}else if($rootScope.status==4){
			$scope.searchOne = {'status':4 ,'msg':'已完成'}
		}else{
			$scope.searchOne = {'status':0 ,'msg':'全部状态'}
		}
	}
	// 查看
	$scope.hrefTo = function(a){
		// $state.go('repair.identify',{'applyid':id,'assetsId':assetsId});
		$state.go('repair.newweixiu',{'applyId':a.id,'assetsId':a.assetsId,status:a.status});
	}
	$scope.option = function(list, value, item) {
        $rootScope.fixWrapShow = false;
        $scope[list] = false;
        $scope[value] = item.name;
    }
	$scope.listShow = function(str) {
		if($rootScope.fixWrapShow)
			return $scope.menuHide();
		$scope[str] = true;
		$rootScope.fixWrapShow = true;
	}
	$rootScope.fixWrapShow = false;
	$scope.menuHide = function() {
		$rootScope.fixWrapShow = false;
		$scope.stateList = false;
		$scope.typeList = false;
		$scope.operateList = false;
	}
	$scope.status=function(){
		if($scope.searchTwo=='紧急程度'){
			$scope.urgentLevel=''
		}else if($scope.searchTwo=='不紧急'){
			$scope.urgentLevel=1
		}else if($scope.searchTwo=='一般'){
			$scope.urgentLevel=2
		}else if($scope.searchTwo=='紧急'){
			$scope.urgentLevel=3
		}else{
			$scope.urgentLevel=4
		}
	}
	$scope.color=function(m){
		if(m==1){
			$scope.isUrgency = false;
			$scope.isUrgencyer = false;
			return '不紧急'
		}else if(m==2){
			$scope.isUrgency = false;
			$scope.isUrgencyer = false;
			return '一般'
		}else if(m==3){
			$scope.isUrgency = true;
			$scope.isUrgencyer = false;
			return '紧急'
		}else{
			$scope.isUrgency = false;
			$scope.isUrgencyer = true;
			return '非常紧急'
		}
	}
	$scope.order=function () {
		if($scope.searchThree=='按照时间排序'){
			$scope.orderByField='report_repair_date'
		}else{
			$scope.orderByField='urgent_level'
		}
	}
	$scope.baifenhao=function(m){
	  return m.replace(/%/,"\\%");
	}
	// 切换就再重新渲染
	$scope.qiehuan = function(){
		$scope.order();
		$scope.status();
		$scope.searchFour=$scope.baifenhao($scope.searchKey.searchFour);
		$scope.searchCon=$scope.baifenhao($scope.searchKey.searchCon);
		$.ajax({
			type: "get",
			url: "/newrepair/repRepairApply/search",
			data: {
				'status': $scope.searchOne.status,
				'assetsDeptName':$scope.searchFour,
				'isAsc':false,
				'keyword':$scope.searchCon,
				'pageSize':8,
				'tenantId':($stateParams.tenantId||$localStorage.userInfo.tenantId),
				'index': $stateParams.msgIndex || 0
			},
			complete: function (res) {

				if(res.responseJSON.code == 200){
					$scope.msgList = res.responseJSON.data.records;
					$scope.pageInfo = res.responseJSON.data;
					$scope.pageInfo.pstyle = 2;
					$rootScope.$apply();
				}
			}
		})
	}
	// 全部隐藏
	$scope.devshow = false;
	$scope.hideAll = function() {
		$scope.devshow = false;
		$scope.devshow1 = false;
		$scope.devshow2 = false;
		$scope.devshow3 = false;
		$scope.devshow4 = false;
		$scope.devshow5 = false;
	}
	// 获得焦点显示
	$scope.devshow1 = false;
	$scope.focus1 = function() {
		if($scope.devshow) {
			return $scope.hideAll();
		}
		$scope.devshow = true;
		$scope.devshow1 = true;
	}
	$scope.devshow2 = false;
	$scope.focus2 = function() {
		if($scope.devshow) {
			return $scope.hideAll();
		}
		$scope.devshow = true;
		$scope.devshow2 = true;
	}
	$scope.devshow3 = false;
	$scope.focus3 = function() {
		if($scope.devshow) {
			return $scope.hideAll();
		}
		$scope.devshow = true;
		$scope.devshow3 = true;
	}
	// 点击子菜单
	$scope.click1 = function($event,l) {
		$scope.devshow1 = false;
		$scope.devshow = false;
		$scope.searchOne = {'status':l.status || '','msg':$scope.change(l)};
		$scope.searchOneV = $($event.target).attr('data-para');
		// $scope.search();
		$scope.qiehuan();
	}
	$scope.click2 = function($event) {
		$scope.devshow2 = false;
		$scope.devshow = false;
		$scope.searchTwo = $($event.target).text();
		$scope.searchTwoV = $($event.target).attr('data-para');
		// $scope.search();
		$scope.qiehuan();
	}
	$scope.click3 = function($event) {
		$scope.devshow3 = false;
		$scope.devshow = false;
		$scope.searchThree = $($event.target).text()
		$scope.qiehuan()
			}
	// 获取状态
	$.ajax({
		type: "get",
		sync:false,
		url: "/newrepair/repRepairApply/total/"+($stateParams.tenantId||$localStorage.userInfo.tenantId),
		complete: function (res) {
			if(res.responseJSON.code == 200){
				$scope.searchOne1 = res.responseJSON.data;
				$scope.fullInfo.status = res.responseJSON.data;
				var _length=$scope.searchOne1.length-1
				if(!$rootScope.status) {
					$scope.searchOne = {'status': '', 'msg': $scope.change($scope.searchOne1[_length])};
				}
				$rootScope.$apply();
			}
		}
	})
	// 分页
	$scope.page = function(){
		$scope.order();
		$scope.status();
		$scope.searchFour=$scope.baifenhao($scope.searchKey.searchFour);
		$scope.searchCon=$scope.baifenhao($scope.searchKey.searchCon);
		$.ajax({
			type: "get",
			url: "/newrepair/repRepairApply/search",
			data: {
				'status': $scope.searchOne.status,
				'assetsDeptName':$scope.searchFour,
				'isAsc':false,
				'keyword':$scope.searchCon,
				'pageSize':$scope.pageSize,
				'pageNo':$scope.pageNo,
				'tenantId':($stateParams.tenantId||$localStorage.userInfo.tenantId),
				'index': $stateParams.msgIndex || 0
			},
			complete: function (res) {
				if(res.responseJSON.code == 200){
					var resData = res.responseJSON.data;
					$scope.pageInfo = res.responseJSON.data;
					$scope.pageInfo.pstyle = 2;
					$scope.allInfo = $scope.pageInfo.total;
					$scope.msgList = resData.records;
					for(var i = 0; i < $scope.msgList.length; i++) {
						$scope.msgList[i].json = JSON.stringify($scope.msgList[i]);
					};
					$rootScope.$apply();
				}
			}
		})
	}
	//$scope.page();
	$scope.pagination = function (page,pageSize) {
		$scope.pageNo = page;
		$scope.pageSize = pageSize;
		$scope.page();
	};
	// 首页跳转请求
	if($rootScope.status){
		$scope.order();
		$scope.status();
		// $scope.baifenhao($scope.searchKey.searchFour);
		// $scope.baifenhao($scope.searchKey.searchCon);
		$.ajax({
			type: "get",
			url: "/newrepair/repRepairApply/search",
			sync:false,
			data: {
				'status':$rootScope.status, 
				'isAsc': false,
				'pageSize':8,
				'tenantId':($stateParams.tenantId||$localStorage.userInfo.tenantId),
				'index': $stateParams.msgIndex || 0
			},
			complete: function (res) {
				if(res.responseJSON.code == 200){
					// var _length=$scope.searchOne1.length
					// for(var i=0;i<_length;i++){
					// 	if($rootScope.status==$scope.searchOne1[i].status){
					// 		console.log($scope.searchOne1[i].status)
					// 		$scope.searchOne = {'status':$rootScope.status || '','msg':$scope.change($scope.searchOne1[i])}
					// 	}
					// }
					$scope.pageInfo = res.responseJSON.data;
					$scope.pageInfo.pstyle = 2;
					$scope.msgList = res.responseJSON.data.records;
					$rootScope.$apply()

				}
			}
		})
	}else{
		// 获取列表请求，默认
		$scope.order();
		$scope.status();
		$scope.searchFour=$scope.baifenhao($scope.searchKey.searchFour);
		$scope.searchCon=$scope.baifenhao($scope.searchKey.searchCon);
		$.ajax({
			type: "get",
			url: "/newrepair/repRepairApply/search",
			data: {
				'isAsc': false,
				'pageSize':8,
				'tenantId':($stateParams.tenantId||$localStorage.userInfo.tenantId),
				'index': $stateParams.msgIndex || 0
			},
			complete: function (res) {
				if(res.responseJSON.code == 200){
					$scope.pageInfo = res.responseJSON.data;
					$scope.pageInfo.pstyle = 2;
					$scope.msgList = res.responseJSON.data.records;
					$rootScope.$apply();
				}
			}
		})
	}
	// 搜索列表请求
	$scope.search = function(){
		$scope.qiehuan()
	}
	// 分页
	$scope.page = function(){
		$scope.order();
		$scope.status();
		$scope.searchFour=$scope.baifenhao($scope.searchKey.searchFour);
		$scope.searchCon=$scope.baifenhao($scope.searchKey.searchCon);
		$.ajax({
			type: "get",
			url: "/newrepair/repRepairApply/search",
			data: {
				'status': $scope.searchOne.status,
				'assetsDeptName':$scope.searchFour,
				'isAsc':false,
				'keyword':$scope.searchCon,
				'pageSize':$scope.pageSize,
				'pageNo':$scope.pageNo,
				'tenantId':($stateParams.tenantId||$localStorage.userInfo.tenantId),
				'index': $stateParams.msgIndex || 0
			},
			complete: function (res) {
				if(res.responseJSON.code == 200){
					var resData = res.responseJSON.data;
					$scope.pageInfo = res.responseJSON.data;
					$scope.pageInfo.pstyle = 2;
					$scope.allInfo = $scope.pageInfo.total;
					$scope.msgList = resData.records;
					for(var i = 0; i < $scope.msgList.length; i++) {
						$scope.msgList[i].json = JSON.stringify($scope.msgList[i]);
					};
					$rootScope.$apply();
				}
			}
		})
	}
	// $scope.page();
	$scope.pagination = function (page,pageSize) {
		$scope.pageNo = page;
		$scope.pageSize = pageSize;
		$scope.page();
	};
	// 申请新建维修
	// $scope.newManage = function () {
	// 	$state.go('repair.newApply({tenantId:($stateParams.tenantId||$localStorage.userInfo.tenantId)})');
	// }
	$scope.image = function(url){
		if(url){
			var list = url.split(',');
			return  'http://'+window.location.host + '/api/file'+list[0];
		}else{
			return '../../../res/img/zwt.png'
		}

	}
	// 全屏
	$scope.fullTime = new Date();
	$scope.fullTimeWeek = function(){
		var day = new Date().getDay();
		switch (day){
			case 1:
				return '星期一';
			case 2:
				return '星期二';
			case 3:
				return '星期三';
			case 4:
				return '星期四';
			case 5:
				return '星期五';
			case 6:
				return '星期六';
			case 0:
				return '星期天';
			default:
				return '';
		}
	}();
	// 消息紧急程度
	$scope.msgLevel=function(a){
		switch (a){
			case 1:
				return "不紧急";
				break;
			case 2:
				return "一般";
				break;
			case 3:
				return "紧急";
				break;
			case 4:
				return "非常紧急";
				break;
			default:
				return "";
				break;
		}
	}
	// 消息状态
	$scope.repairCalendarStatus = function(a){
		switch (a){
			case 1:
				return "待接单";
				break;
			case 2:
				return "待维修";
				break;
			case 3:
				return "待验收";
				break;
			case 4:
				return "已完成";
				break;
			default:
				return "";
				break;
		}
	}
	$scope.fullInfo = {
		total: 0,
		current: 1,
		pages: 1,
		status: []
	};
	$scope.getRepairFullData = function(){
		$.ajax({
			type: "get",
			url: "/newrepair/repRepairApply/search2",
			data: {'statusList': '1,2,3',pageNo:$scope.fullInfo.current||1,pageSize:10,tenantId:$stateParams.tenantId||$localStorage.userInfo.tenantId},
			complete: function (res) {
				if(res.responseJSON.code == 200){
					$scope.fullInfo.total = res.responseJSON.data.total;
					$scope.fullInfo.current = res.responseJSON.data.current;
					$scope.fullInfo.pages = res.responseJSON.data.pages;
					$scope.fullData = res.responseJSON.data.records;
					for (var i = 0,len=10-$scope.fullData.length; i < len; i++) {
						$scope.fullData.push({visibility:true,applyNo:123});
					};
					$rootScope.$apply();
				}else{
					$scope.fullData=[];
					for (var i = 0,len=10-$scope.fullData.length; i < len; i++) {
						$scope.fullData.push({visibility:true,applyNo:123});
					};
				}
			}
		});
	}
	$scope.getRepairFullData();
	$scope.calendarFullShow = false;
	$rootScope.repairIndexFullSrc=function(){
		$scope.calendarFullShow=true;
		var clientHeight=0;
		if(document.body.clientHeight&&document.documentElement.clientHeight)
		{
			clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
		}
		else
		{
			clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
		}
		$('body').css('overflow','hidden');
		$('.fy_fullTable').css('line-height',(clientHeight-180)/11+'px');
		$scope.fullTime = new Date();
		$scope.timmor=0;
		if($scope.fullInfo.total<11){
			return;
		}
		$scope.timer = setInterval(function(){
			$scope.fullTime = new Date();
			$scope.timmor++;
			if(!($scope.timmor%45)){
				$scope.fullInfo.current++;
				if($scope.fullInfo.current<=$scope.fullInfo.pages){
					$scope.getRepairFullData();
				}else{
					$scope.fullInfo.current = 1;
					$scope.getRepairFullData();
				}
			}
			$rootScope.$apply();
		},1000);
	}
	$scope.repairIndexFullOut=function(){
		$scope.calendarFullShow = false;
		$('body').css('overflow','auto');
		clearInterval($scope.timer);
	}
	// 全屏 END
}]);

