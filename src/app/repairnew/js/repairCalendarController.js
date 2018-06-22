'use strict';

angular.module('app')

.controller('repairCalendarController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', '$compile', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage, $compile) {
	$rootScope.currentmodule = "维修管理";

	$scope.layerTipOpen = false;
	$scope.layerEvent = {};
	$scope.layerTip = function($event,b){
		if($scope.layerTipOpen) return;
		$scope.layerEvent = b;
		$scope.layerTipOpen = true;
		layer.open({
			type:4,
			shade:0,
			content:[$($event.currentTarget).parent().find('.fy_layerTipWrap').html(),$event.currentTarget],
			closeBtn:0
		})
	}
	$scope.layerTipClose = function(){
		$scope.layerTipOpen = false;
		layer.closeAll();
	}
	// 分页
	$scope.pageInfo = {
		pages: 3,
		total: 30,
		size: 8,
		current: 1
	};
	// END
	// dev add
	$scope.repairAddDevShow = false;
	$scope.repairDevAdd=function(){
		$scope.repairAddDevShow = true;
		// add dev
		var index=layer.open({
            time: 0 //不自动关闭
            ,type: 1
            ,content: $('.repairAddDev')
            ,title: ['选择设备','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
            ,closeBtn: 1
            ,shade: 0.3
            ,shadeClose: true
            ,btn: 0
            ,area: ['1324px','650px']
        });
	}
	$scope.addData = [];
	//  END
	// submit
	$scope.repairSubmitShow = false;
	$scope.layerSubmit=function(){
		$scope.repairSubmitShow = true;
		var index=layer.open({
            time: 0 //不自动关闭
            ,type: 1
            ,content: $('#alertRepairSubmit')
            ,title: ['提示','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
            ,closeBtn: 1
            ,shade: 0.3
            ,shadeClose: true
            ,btn: 0
            ,area: ['540px','250px']
        });
	}
	// END
	// check
	$scope.repairCheckAccpetType = false;
	$scope.repairCheckShow = false;
	$scope.layerCheck = function(){
		$scope.repairCheckShow = true;
		var index=layer.open({
            time: 0 //不自动关闭
            ,type: 1
            ,content: $('.repairCheckAccpet')
            ,title: ['验收','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
            ,closeBtn: 1
            ,shade: 0.3
            ,shadeClose: true
            ,btn: 0
            ,area: "615px"
            ,end: function(){
            	$rootScope.fixWrapShow = false;
				// $scope.stateList = false;
				// $scope.typeList = false;
				$scope.checkList = false;
            }
        });
	}
	$scope.repairCheckSelected =false;
	$scope.repairCheckHadSelected=function(a){
		$scope.repairCheckSelected = true;
		if(a){
			$scope.optionCheck = [{
				id: '',
				name: '正常工作'
			},{
				id: 1,
				name: '基本工作'
			}, {
				id: 2,
				name: '其他'
			}];
		}else {
			$scope.optionCheck = [{
				id: '',
				name: '需进一步维修'
			},{
				id: 1,
				name: '需外送维修'
			}, {
				id: 2,
				name: '其他'
			}];
		}
		$scope.checkModel = $scope.optionCheck[0].name;
		$scope.checkList = false;
		if($scope.repairCheckSelected) return;
		$rootScope.$apply();
	}
	// END
	// look check
	$scope.lookRepairCheckShow = false;
	$scope.lookRepairCheckPassShow = false;
	$scope.layerLookCheck = function(){
		$scope.lookRepairCheckShow = true;
		var index=layer.open({
            time: 0 //不自动关闭
            ,type: 1
            ,content: $('.lookRepairCheckAccpet')
            ,title: ['查看验收详情','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
            ,closeBtn: 1
            ,shade: 0.3
            ,shadeClose: true
            ,btn: 0
            ,area: "615px"
        });
	}
	// look check END
	// indentify detail
	$scope.repairIdentifyDetailType = false;
	$scope.repairIndetifyShow = false;
	$scope.layerIndentify = function(){
		$scope.repairIndetifyShow = true;
		var index=layer.open({
            time: 0 //不自动关闭
            ,type: 1
            ,content: $('.repairIdentifyDetail')
            ,title: ['验收','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
            ,closeBtn: 1
            ,shade: 0.3
            ,shadeClose: true
            ,btn: 0
            ,area: '650px'
        });
	}
	// END
	// look Repair Report
	$scope.lookRepairReportConShow = false;
	$scope.lookRepairReportPartsShow = false;
	$scope.lookRepairReportResultShow = false;
	$scope.lookRepairReportMenuShow = function(a){
		$scope[a]=!$scope[a];
	}
	$scope.lookRepairReportShow = false;
	$scope.layerlookRepairReport=function(){
		$scope.lookRepairReportShow = true;
		var index=layer.open({
            time: 0 //不自动关闭
            ,type: 1
            ,content: $('.lookRepairReport')
            ,title: ['查看维修报告','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
            ,closeBtn: 1
            ,shade: 0.3
            ,shadeClose: true
            ,btn: 0
            ,area: ['900px','650px']
        });
	}
	// 日历
	// 维修时间
	$scope.repairDate1 = 0;
	$scope.repairDate2 = 0;
	$scope.repairTime = {day:'',hour:''};
	// 等待时间
	$scope.repairWait1 = 0;
	$scope.repairWait2 = 0;
	$scope.repairWait = {day:'',hour:''};
	// 真实时间
	$scope.repairTrue1 = 0;
	$scope.repairTrue2 = 0;
	$scope.repairTrue = {day:'',hour:''};
	// 维修费用
	$scope.repairCost = '￥';
	$scope.materiaCost = '￥';
	$scope.totalCost = null;
	$scope.totalCostChange = function(){
		if($scope.repairCost=='￥'||$scope.materiaCost=='￥'){
			return
		}else if(/^[0-9]+$/.test($scope.repairCost)){
			$scope.repairCost = '￥'+$scope.repairCost;
		}else if(/^[0-9]+$/.test($scope.materiaCost)){
			$scope.materiaCost = '￥'+$scope.materiaCost;
		}
		$scope.totalCost = '￥'+(Number($scope.repairCost.substr(1))+Number($scope.materiaCost.substr(1)));
	}
	$scope.initcalendar = function() {
        var option = {
            format: 'YYYY-MM-DD HH:mm',
            startDate: '2017-01-01 ',
            endDate: new Date(),
            timePicker:true,
            // minDate:new Date(new Date()-24*60*60*1000),
            maxDate: new Date("2050-01-01"),
            timePicker12Hour:false,
            //timePicker: false,
            opens: "top",
            singleDatePicker: true
        }
        angular.element('.input-datepicker').daterangepicker($.extend({}, option, {
            startDate: new Date()
        }), function(date, enddate, el) {
        	$scope[$(this.element).attr('attrVar')]=new Date(date).getTime();
            var currentel = $(this.element).attr("name");
            currentel == "expireDate" && ($scope.expireStr = date.format('YYYY-MM-DD HH:mm'));
            if($scope.repairDate1&&$scope.repairDate2){
            	var t = $scope.repairDate2-$scope.repairDate1;
            	$scope.repairTime.day=Math.floor(t/3600000/24);
            	$scope.repairTime.hour=Math.floor(t/3600000)%24;
            }
            if($scope.repairTrue1&&$scope.repairTrue2){
            	var t = $scope.repairTrue2-$scope.repairTrue1;
            	$scope.repairTrue.day=Math.floor(t/3600000/24);
            	$scope.repairTrue.hour=Math.floor(t/3600000)%24;
            }
            if($scope.repairWait1&&$scope.repairWait2){
            	var t = $scope.repairWait2-$scope.repairWait1;
            	$scope.repairWait.day=Math.floor(t/3600000/24);
            	$scope.repairWait.hour=Math.floor(t/3600000)%24;
            }
            $rootScope.$apply();
        });
    }
    $scope.initcalendar();
	// 日历 END
	// 查看大图
	$scope.imgArr=[
		{src:'../../res/img/bg.png'},
		{src:'../../res/img/bg.jpg'}
	];
	$scope.currentImg=$scope.imgArr[0];
	$scope.currentImg.index=0;
	$scope.repairPicsShow = false;
	$scope.repairPicChange=function(a,b){
		if($scope.currentImg.index==0&&a==-1||$scope.currentImg.index==($scope.imgArr.length-1)&&a==1){
			return;
		}
		if(a!=2){
			var index= $scope.currentImg.index+a;
			$scope.currentImg=$scope.imgArr[index];
			$scope.currentImg.index = index;
		}else {
			$scope.currentImg=$scope.imgArr[b];
			$scope.currentImg.index = b;
		}
	}
	// 查看大图 END
	// 下拉菜单
	$scope.typeList = false;
	$scope.typeModel = '紧急程度';
	// 验收 菜单
	$scope.checkModel = '紧急程度';
	$scope.checkList = false;
	$scope.optionCheck = [];
	// 验收 菜单 END
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
		$scope.checkList = false;
	}
	$scope.optionType = [{
		id: '',
		name: '紧急'
	},{
		id: 1,
		name: '非常紧急'
	}, {
		id: 2,
		name: '不紧急'
	}];
	// END
	// repair server star
	$scope.repairAttitude={
		star1: false,
		star2: false,
		star3: false,
		star4: false,
		star5: false,
		txtArr: ["很差","差","一般","满意","非常满意"],
		txt: '',
		score: ''
	}
	$scope.repairRespond={
		star1: false,
		star2: false,
		star3: false,
		star4: false,
		star5: false,
		txtArr: ["很慢","慢","一般","快","非常快"],
		txt: '',
		score: ''
	}
	$scope.repairMass={
		star1: false,
		star2: false,
		star3: false,
		star4: false,
		star5: false,
		txtArr: ["很差","差","一般","好","非常好"],
		txt: '',
		score: ''
	}
	$scope.repairServerStar = function(a,b){
		for (var i = 1; i < 6; i++) {
			$scope[a]["star"+i]=false;
		};
		switch (b){
			case 1:
				$scope[a].txt=$scope[a].txtArr[b-1];
				$scope[a].score='2.0分';
				break;
			case 2:
				$scope[a].txt=$scope[a].txtArr[b-1];
				$scope[a].score='4.0分';
				break;
			case 3:
				$scope[a].txt=$scope[a].txtArr[b-1];
				$scope[a].score='6.0分';
				break;
			case 4:
				$scope[a].txt=$scope[a].txtArr[b-1];
				$scope[a].score='8.0分';
				break;
			case 5:
				$scope[a].txt=$scope[a].txtArr[b-1];
				$scope[a].score='10.0分';
				break;
			default:
				break;
		}
		do {
			$scope[a]["star"+b]=true;
			b--;
		}while(b>0)
	}
	// END
	$scope.calendarFullShow = false;
	$rootScope.repairIndexFullSrc=function(){
		$scope.calendarFullShow=true;
		var clientHeight=0;
		var clientWidth=0;
		if(document.body.clientHeight&&document.documentElement.clientHeight)
		{
			clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
			clientWidth = (document.body.clientWidth<document.documentElement.clientWidth)?document.body.clientWidth:document.documentElement.clientWidth;
		}
		else
		{
			clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
			clientWidth = (document.body.clientWidth>document.documentElement.clientWidth)?document.body.clientWidth:document.documentElement.clientWidth;
		}
		$('body').css('overflow','hidden');
		angular.element('.fy_repairCalendarFull').css('height',clientHeight-96+'px');
		(angular.element('.fy_repairCalendarTable').height()>angular.element('.fy_repairCalendarFull').height())&&angular.element('.fy_repairCalendarFull').css('overflowY','scroll');
		(clientWidth<1365)&&(angular.element('.fy_repairCalendarFull').css('overflowX','scroll'))
	}
	$scope.repairIndexFullOut=function(){
		$scope.calendarFullShow = false;
		$('body').css('overflow','auto');
	}
	// 详情跳转
	$scope.repairIndentify=function(a){
		layer.closeAll();
		$state.go('repair.identify',{assetsId:a.assetsId,applyid:a.id});
	}
	// 日历信息

	$rootScope.repairCalendar=function(){
		$scope.repairTablePre = [];
		$scope.repairTableNext = [];
		$scope.repairTable = [];
		$.ajax({
			type: 'get',
			url: '/repair/apply/getApplyByTime',
			data: {year:$rootScope.repairDate.year,month:$rootScope.repairDate.month,tenantId:$stateParams.tenantId||$localStorage.userInfo.tenantId},
			complete: function(res) {
				var days = res.responseJSON.data.days;
				var day = new Date().setFullYear($rootScope.repairDate.year,$rootScope.repairDate.month-1,1);
				var preLength = new Date(day).getDay();
				$scope.fullDatas = res.responseJSON.data.list;
				for (var i = $scope.fullInfo.currentF; i < $scope.fullInfo.currentE; i++) {
					$scope.fullData.push($scope.fullDatas[i]);
				};
				for (var i = 0; i < preLength; i++) {
					$scope.repairTablePre.push({day:''});
				};
				var nextLength = 7-(preLength+days)%7;
				nextLength==7?nextLength=0:0;
				for (var i = 0; i < nextLength; i++) {
					$scope.repairTableNext.push({day:''});
				};
				for (var i = 1; i <= days; i++) {
					var today = i<10?('0'+i):i;
					$scope.repairTable.push({day:today,events:[]});
				};
				if(res.responseJSON.code == 200) {
	                addRepairEvent($scope.repairTable,$scope.fullDatas);
				}
				$rootScope.$apply();
			}
		});
	}
	$rootScope.repairCalendar();
	// 全屏
	$scope.fullData = [];
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
	$scope.fullInfo = {
		total: 0,
		currentF: 0,
		currentE: 10,
		status: []
	};
	// 不同状态消息数量
	$.ajax({
		type: 'get',
		url: '/repair/apply/total/'+($stateParams.tenantId||$localStorage.userInfo.tenantId),
		complete: function(res) {
			$scope.fullInfo.status=res.responseJSON.data;
		}
	});
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
				return "待故障判定";
				break;
			case 2:
				return "现场解决";
				break;
			case 3:
				return "待维修";
				break;
			case 4:
				return "已维修待验收";
				break;
			case 5:
				return "验收通过";
				break;
			case 6:
				return "验收不通过";
				break;
			default:
				return "";
				break;
		}
	}
	function addRepairEvent(a,b){
		for (var i = 0; i < b.length; i++) {
			var n=b[i].applyNo.substr(8,2);
			a[n*1-1].applyNo=n;
			a[n*1-1].events.push(b[i]);
		};
	}
}]);