'use strict';

angular.module('app')
    .controller('BSGLdetailController', ['$scope','$stateParams', '$rootScope', '$state', '$timeout', '$localStorage',
        function($scope,$stateParams,$rootScope, $state, $timeout, $localStorage) {
            $rootScope.currentmodule = "资产管理";
            $scope.assetAdjust=function(){
            	var cancle = 0;
            	for (var i = 0; i < $scope.billObj.applyInfo.assetList.length; i++) {
            		($scope.billObj.applyInfo.assetList[i].status!=2)&&(cancle++);
            	};
            	return cancle>1;
            }
            $scope.getBill = function(key) {
                $.ajax({
                    type: "get",
                    url: "/assets/assDiscard/start/" + $stateParams.billId,
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {
                            $scope.billObj=res.responseJSON.data;
                            if($scope.billObj.billInfo.status!='待审核'){
                            	return $state.go('main.tre.bsgl.result', {billId: $stateParams.billId}, {
										reload: true
									});
                            }
                            $scope.billObj.applyInfo.assetCancleTxt='确定要撤销此设备报损吗？';
                            $scope.billObj.billInfo.txt='报损单号：';
                            $scope.billObj.applyInfo.edit=1;
                            $scope.billObj.applyInfo.assetCancle=$scope.assetAdjust();
                            $scope.$apply();
                        }else{
                        	var msg = layer.msg('<div class="toaster"><i></i><span>'+res.responseJSON.msg+'</span></div>', {
		                        area: ['100%', '60px'],
		                        time: 3000,
		                        offset: 'b',
		                        shadeClose: true,
		                        shade: 0
		                    });
                        }
                    }
                });
            }
            $scope.getBill();
            $scope.assetCancle=function(a){
            	console.log(a);
            	var index=layer.open({
		            time: 0 
		            ,type: 1
		            ,content: $('#inspectionLayer') 
		            ,title: ['提示','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
		            ,closeBtn: 1
		            ,shade: 0.3
		            ,shadeClose: true
		            ,yes:function(){
		                layer.closeAll();
		                $.ajax({
		                    type: 'post',
		                    contentType: "application/json;charset=UTF-8",
		                    url: '/assets/assDiscard/cancel',
		                    data: JSON.stringify({
		                    		                    	assetsId: a.assetsId,
		                    		                    	id: $stateParams.billId
		                    		                    }),
		                    complete: function(res) {
		                        if (res.responseJSON.code == 200) {
		                            $scope.getBill();
		                        }else{
		                        	var msg = layer.msg('<div class="toaster"><i></i><span>'+res.responseJSON.msg+'</span></div>', {
				                        area: ['100%', '60px'],
				                        time: 3000,
				                        offset: 'b',
				                        shadeClose: true,
				                        shade: 0
				                    });
		                        }
		                    }
		                });
		            }
		            ,btn: ['确定','取消']
		            ,area: ['480px','230px']
		        });
            }
            
            $scope.power=$localStorage.userInfo.authoritiesStr.indexOf('ASS_ASSETS_DISCARD_CHECK') != -1;
            $scope.newTre=function(){
            	$scope.adjust={
	            	id: $stateParams.billId,
	            	suggestion: '',
	            	adjusted: true,
	            	remarks: ''
	            };
            	var index=layer.open({
		            time: 0 
		            ,type: 1
		            ,content: $('.adjustWrap') 
		            ,title: ['审核','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
		            ,closeBtn: 1
		            ,shade: 0.3
		            ,shadeClose: true
		            ,yes:function(){
		                layer.closeAll();
		                $scope.adjust.status=$scope.adjust.adjusted?1:0;
		                $scope.adjust.suggestion=$scope.billObj.applyInfo.suggestion;
		                $.ajax({
		                    type: 'post',
		                    url: '/assets/assDiscard/verify',
		                    data: JSON.stringify($scope.adjust),
		                    contentType: "application/json;charset=UTF-8",
		                    complete: function(res) {
		                        if (res.responseJSON.code == 200) {
		                            $state.go('main.tre.bsgl.result', {billId: $stateParams.billId}, {
										reload: true
									});
		                        }else{
		                        	var msg = layer.msg('<div class="toaster"><i></i><span>'+res.responseJSON.msg+'</span></div>', {
				                        area: ['100%', '60px'],
				                        time: 3000,
				                        offset: 'b',
				                        shadeClose: true,
				                        shade: 0
				                    });
		                        }
		                    }
		                });
		            }
		            ,btn: ['确定','取消']
		            ,area: ['480px','250px']
		        });
            }
        }]);