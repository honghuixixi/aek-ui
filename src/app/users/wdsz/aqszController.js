'use strict';

angular.module('app')
	.controller('aqszController', [ '$rootScope', '$scope', '$http', '$state',
		function($rootScope, $scope, $http, $state) {
			$rootScope.userOr = false;
			$scope.infomation={
				iState: '安全',
				iStateImg: '../../res/img/safy.png',
				phoneInfo: '您绑定的手机号为：',
				phone: '138*******1',
				phoneSet: '修改',
				emailInfo: '您绑定的邮箱地址为：',
				email: 'n***********@qq.com',
				emailSet: '修改'
			};
			// $scope.base = true;
			// $scope.editName = false;
			// $scope.common = true;
			// $scope.superviser = false;
			// $scope.personal = false;
			// $scope.super = false;
			// $scope.company = false;
			// $scope.baseList = [
			// 	{required: '',head: '机构类别：',con: '医疗机构'},
			// 	{required: '',head: '机构名称：',con: '三区卫生院'},
			// 	{required: '',head: '机构类型：',con: '医疗机构/省级'},
			// 	{required: '',head: '机构代码：',con: '00001234567'}
			// ];
			// $scope.commonList = [
			// 	{required: '',head: '所在地区：',con: '浙江省/杭州市/萧山区'},
			// 	{required: '',head: '街道地址：',con: '西行街道1号路1号'},
			// 	{required: '',head: '联系人：',con: '夕木暖'},
			// 	{required: '',head: '联系电话：',con: '16866668888'},
			// 	{required: '',head: '传真：',con: '86057188888888'}
			// ];
			// $scope.commonListEdit = [
			// 	{required: '*',head: '街道地址：',con: '西行街道1号路1号',example: ''},
			// 	{required: '*',head: '联系人：',con: '夕木暖',example: ''},
			// 	{required: '*',head: '联系电话：',con: '16866668888',example: '例如：0571-88888888'},
			// 	{required: '',head: '传真：',con: '86057188888888',example: '例如：86057188888888'}
			// ];
			// $scope.toEdit = function () {
			// 	$scope.super = !$scope.super;
			// 	$scope.editName = !$scope.editName;
			// 	$scope.company = !$scope.company;
			// 	if($scope.superviser) {
			// 		$scope.company = false;
			// 	}
			// }
			// $scope.zzList = [
			// 	{tit: '营业执照',src: '../../res/img/yyzz.png',img: '../../res/img/example1.png'},
			// 	{tit: '组织机构代码证',src: '../../res/img/yyzz.png',img: '../../res/img/example2.png'},
			// 	{tit: '税务登记证',src: '../../res/img/yyzz.png',img: '../../res/img/example3.png'}
			// ];
	} ]);