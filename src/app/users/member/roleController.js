'use strict';

angular.module('app').controller('roleController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', '$compile', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage, $compile) {

	$scope.userid = $stateParams.userId;
	$scope.roleInfo = [];
	$scope.editRole = true;
	$scope.orgName = '';
	$scope.rolesList = [];
	/*$scope.roleList = [{"id":20,"name":"用户"}];*/
	$scope.isEditRole = false;
	$scope.rolesIds = [];

	//获取用户角色
	$scope.getUserRole = function() {

		$.ajax({
			type: "get",
			//url: "/sys/roleUser/all/user/" + $scope.userid,
			url: "/sys/roleUser/user/" + $scope.userid,
			complete: function(res) {
				if(res.responseJSON.code == 200) {

					$scope.roleInfo = res.responseJSON.data;
					$rootScope.$apply();

				}

			}
		});
	}

	$scope.getUserRole();
	$scope.$on("changeRoleList", function() {
		$scope.getUserRole();

	})
	Array.prototype.unique2 = function() {

		}
		/*数组去重*/

	$scope.unique = function(arr) {

		if(!arr.length) return;
		var res = [];
		var json = {};
		for(var i = 0; i < arr.length; i++) {
			if(!json[arr[i]]) {
				res.push(arr[i]);
				json[arr[i]] = 1;
			}
		}
		return res;
		

	}

	/*编辑角色*/
	$scope.editRolefn = function(id) {
		var currentRoleIds = [];
		//会导致编辑框和添加框同时收录  目前只能手动去重
		angular.element(".ay-edit-checkbox:checked").each(function(index, el) {
			currentRoleIds.push(angular.element(el).val());
		});

		var _data = {
			"roleIds": currentRoleIds, //手动去重 
			"tenantId": id || $scope.currentOrgId,
			"userId": $scope.userid
		};
		$.ajax({
			type: "post",
			contentType: "application/json;charset=UTF-8",
			url: "/sys/roleUser/edit/tenant",
			data: JSON.stringify(_data),
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					$scope.getUserRole();
					$scope.toastMsg({
						msg: "更新成功"
					});

				} else {
					$scope.toastMsg({
						msg: "更新失败"
					});
				}

			}
		});

	}

	/*编辑角色弹框*/
	$scope.editRoleDialog = function(id, name) {
		$scope.orgName = name;
		//$rootScope.$apply();
		$.ajax({
			type: "get",
			url: "/sys/roleUser/user/" + $stateParams.userId + "/tenant/" + id,
			async: false,
			complete: function(res) {
				if(res.responseJSON.code = 200) {
					$scope.rolesList = res.responseJSON.data.roles;
					//$rootScope.$apply();

				}

			}
		});
		$scope.isEditRole = true;

		var index = layer.open({
			time: 0, //不自动关闭,
			type: 1,
			content: $('#ay-editrole'),
			title: ['提示', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
			closeBtn: 1,
			shade: 0.3,
			shadeClose: true,
			btn: ['确定', '取消'],
			btnAlign: 'r',
			yes: function(index) {
				$scope.editRolefn(id);
				layer.close(index);
			},
			area: ['635px', '600px']
		});

	}
}]);