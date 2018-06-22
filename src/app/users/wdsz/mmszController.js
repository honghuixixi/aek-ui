'use strict';

angular.module('app')
	.controller('mmszController', [ '$rootScope', '$scope', '$http', '$state', '$localStorage',
		function($rootScope, $scope, $http, $state, $localStorage) {
			$rootScope.userOr = false;
			$scope.pswSet={
				primary: '',
				newCode: '',
				repeatCode: '',
				notRepeat: '两次密码输入不一致，请重新输入',
				phoneSet: '修改',
				pswErr: false
			};
			$.ajax({
                url : '/sys/index/cehckLogin',
                data:  {},
                type: 'get'
            });
			$scope.nextState = function () {
				$.ajax({
                        url : '/sys/user/modifyPassword',
                        data: {
                          "userName": $localStorage.user.mobile,
                          "pwd": $scope.pswSet.primary,
                          "inPwd": $scope.pswSet.newCode
                        },
                        // contentType : "application/json",
                        type: 'post'
                    }).then(function(res) {
    					if(res.code==0){
    						$localStorage.$reset();
    						$state.go('access.login');
    					}else if(res.code=='U_008'){
    						$scope.pswSet.pswErr = true;
    						$rootScope.$apply();
    					}
    				});
			}
			var validator = $(".pswSet").validate({
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
						required: " 请输入密码"
					},
					newCode: {
						required: " 请输入密码"
					}
				},
				submitHandler:function(){
					if($scope.pswSet.newCode==$scope.pswSet.repeatCode)
                    $scope.nextState();
                }
			});
	} ]);