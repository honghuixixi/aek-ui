'use strict';

angular.module('app')

.controller('supplierSellerController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {	
	$rootScope.currentmodule = "供应商管理";
	$rootScope.sections = {
		model: false,
		credentials: false,
		seller: true,
		user: false
	};
	$scope.localStorageHad=function(){
		if(!$localStorage.userInfo){
			return $state.go('website.home');
		}
	}
	$scope.localStorageHad();
	
	//获取机构详情
	$scope.getSellerDetail = function(a) {
		$.ajax({
			type: 'get',
			url: '/sys/supplier/view/' + $stateParams.supplierId,
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					$scope.supplierTenant = res.responseJSON.data.tenant.supplierTenant;
					$scope.introduce=$scope.supplierTenant.introduce;
					$scope.serviceScope=$scope.supplierTenant.serviceScope;
					$scope.editIntroduce=$scope.supplierTenant.introduce?false:true;
					$scope.editScope=$scope.supplierTenant.serviceScope?false:true;
					a&&($scope.editIntroduce=false);
					a&&($scope.editScope=false);
					$rootScope.$apply();
				}
			}
		});
	}
	$scope.getSellerDetail();
	$scope.saveEdit=function(){
		$.ajax({
            type: 'put',
            url: '/sys/supplier/edit',
            async:false,
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
            	supplierTenant: $scope.supplierTenant,
            	id: $stateParams.supplierId,
            	tenantType: 3,
            	updateBy: $localStorage.userInfo.id
            }),
            complete: function(res) {
                if(res.responseJSON.code == 200) {
                    $state.go('supplier.detail.seller', {tenantId: $stateParams.tenantId,supplierId:res.responseJSON.data.id ,isOpMsg:'保存成功',isOp:true},{reload:true});
                }else{
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
		$scope.cancelEdit();
	}
	$scope.cancelEdit=function(){
		$scope.editScope=false;
		$scope.getSellerDetail(1);
		$scope.editIntroduce=false;
	}
}]);