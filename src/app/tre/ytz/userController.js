'use strict';

angular.module('app')
	.controller('userController', [ '$rootScope', '$scope', '$http', '$state',
	                                function($rootScope, $scope, $http, $state) {
		$scope.title = '';
        $scope.param = { };
        $scope.loading = false;
        
		$scope.search = function () {
	        $scope.loading = true;
			$.ajax({
				url : '/ytz',
				data: $scope.param
			}).then(function(result) {
		        $scope.loading = false;
				if (result.httpCode == 200) {
					$scope.pageInfo = result.data;
				} else {
					$scope.msg = result.msg;
				}
				$scope.$apply();
			});
		}
		
		$scope.search();
		
		$scope.clearSearch = function() {
			$scope.param.keyword= null;
			$scope.search();
		}
		
		$scope.disableItem = function(id, enable) {
			
		}

		// 表单验证
		function validate(userId){
            //notEqual 规则
            $.validator.addMethod('notEqual', function(value, ele){
                return value != this.settings.rules[ele.name].notEqual;
            });
            jQuery('form').validate({
                rules: {
                    account: {
                        required: true,
                        stringCheck:[],
                        maxLengthB:[10]//,
                        //isExist:['/user/checkName',userId]
                    },
                    userName: {
                        required: true
                    },
                    phone: {
                        required: true,
                        isPhone:[]
                    },
                    password:{
                        maxlength: 16
                    },
                    confirmPassword:{
                       // required: true,
                        maxlength: 16,
                        equalTo: "#password"
                    }
                },
                messages: {
                    account: {
                        required: '请填写帐号',
                        maxLengthB:"帐号不得超过{0}个字符",
                        isExist:"该帐号已存在"
                    },
                    account1: {
                        required: '请填写用户名'
                    },
                    phone: {
                        required: '请填写联系方式'
                    },
                    password:{
                        //required: '请填写密码',
                        maxlength: '密码长度不可大于16位'
                    },
                    confirmPassword:{
                        //required: '请填写确认密码',
                        maxlength: '密码长度不可大于16位',
                        equalTo: '两次输入的密码不相符'
                    }
                },
                submitHandler: function() {
                    $scope.submit();
                }
            });
        }
		
		// 翻页
        $scope.pagination = function (page) {
            $scope.param.pageNum=page;
            $scope.search();
        };
} ]);
  var index=layer.open({
  time: 0 //不自动关闭
  ,content: '<div class="pad-fifty">提交后不可再修改，您确定提交审核不通过吗？</div>'
  ,title: ['提示','font-size: 14px;color: #fff;background-color: #555a69;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
  ,closeBtn: 1
  ,shade: 0.3
  ,shadeClose: true
  ,btn: ['确定', '取消']
  ,yes: function(index){
    layer.close(index);
    var msg=layer.msg('<div class="toaster"><i></i><span>这是最常用的吧</span></div>',{
    	area: ['100%','60px']
    	,time: 3000
    	,shadeClose: true
        ,offset: 'b'
    	,shade: 0
    });
  }
  ,area: ['500px','220px']
  ,btnAlign: 'c'
});
    layer.style(index, {
      fontSize: '16px',
      backgroundColor: '#fff',
    });