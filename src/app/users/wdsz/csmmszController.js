'use strict';

angular.module('app')
	.controller('csmmszController', [ '$rootScope', '$scope', '$http', '$state',
		function($rootScope, $scope, $http, $state) {
			$rootScope.userOr = false;
			$scope.firstPsw={
				first: 'asdfasdf',
				src: '../../res/img/by1.png',
				firstShow: true,
				primary: '',
				newCode: '',
				resetCode: false,
				hadCode: true,
				repeatCode: '',
				pswctr: '重置密码',
				notRepeat: '两次密码输入不一致，请重新输入'
			};
			$scope.nextState = function () {
				if($scope.firstPsw.newCode != $scope.firstPsw.repeatCode) {
					$scope.firstPsw.notRepeat = '两次密码输入不一致，请重新输入';
				}
			}
			var validator = $("#pswSetL").validate({
				errorPlacement: function(error, element) {
					// Append error within linked label
					$( element )
						.closest( "form" )
							.find( "label[for='" + element.attr( "id" ) + "']" )
								.append( error );
				},
				errorElement: "em",
				messages: {
					primary: {
						required: " 请输入原密码",
						minlength: " 不能少于 8 个字母"
					},
					newCode: {
						required: " 请输入密码",
						minlength: " 不能少于 8 个字母",
						error: "用户名或密码错误"
					}
				}
			});
	} ]);