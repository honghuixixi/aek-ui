'use strict';

angular.module('app')
    .controller('applyDetailController', ['$scope','$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', 'applyDbService',
        function($scope,$stateParams,$rootScope, $state, $timeout, $localStorage, applyDbService) {
            
            $scope.getBill = function(key) {
            	applyDbService.getApplyDetail({
            		id: $stateParams.billApplyId
            	},function(res) {
                    $scope.billObj=res;
                    $scope.billObj.canCancle=$scope.billObj.status==1?$scope.billObj.applyUserId==$localStorage.userInfo.id:false;
                    for (var i = 0; i < $scope.billObj.billFiles.length; i++) {
                    	$scope.billObj.billFiles[i].urlEncode=encodeURI(encodeURI($scope.billObj.billFiles[i].url));
                    };
                    $scope.billObj.statusTxt=$scope.billObj.status==1?'审批中':$scope.billObj.status==2?'审批通过':$scope.billObj.status==3?'审批未通过':'已撤销';
                    $scope.$apply();   
                },function(res){
                	var msg = layer.msg('<div class="toaster"><i></i><span>'+res+'</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                    $state.go('repair.apply.list',{tenantId:($stateParams.tenantId||$localStorage.userInfo.tenantId)},{reload: true});
                });
            }
            $scope.getBill();
            $scope.assetCancle=function(){
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
		                applyDbService.getApplyCancle({
		            		id: $stateParams.billApplyId
		            	},function(res) {
		                    $state.go('repair.apply.list',{tenantId:($stateParams.tenantId||$localStorage.userInfo.tenantId)},{reload: true});
		                },function(res){
		                	var msg = layer.msg('<div class="toaster"><i></i><span>'+res+'</span></div>', {
		                        area: ['100%', '60px'],
		                        time: 3000,
		                        offset: 'b',
		                        shadeClose: true,
		                        shade: 0
		                    });
		                    $scope.getBill();
		                });
		            }
		            ,btn: ['确定','取消']
		            ,area: ['480px','230px']
		        });
            }
            $scope.applyListDetail=function(a){
            	applyDbService.getApplyListDetail({
            		id: a
            	},function(res) {
                    $scope.listDetail=res;
                    $scope.$apply();
                    var index=layer.open({
			            time: 0 
			            ,type: 1
			            ,content: $('#adjustWrapD') 
			            ,title: ['审批详情','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
			            ,closeBtn: 1
			            ,shade: 0.3
			            ,shadeClose: true
			            ,yes:function(){
			                layer.closeAll();
			            }
			            ,btn: ['确定']
			            ,area: ['480px','230px']
			        });  
                },function(res){
                	var msg = layer.msg('<div class="toaster"><i></i><span>'+res+'</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                    $scope.getBill();
                });
            }
            $scope.newTre=function(){
            	$scope.adjust={
	            	id: $stateParams.billApplyId,
	            	suggestion: '',
	            	adjusted: true,
	            	remarks: ''
	            };
            	var index=layer.open({
		            time: 0 
		            ,type: 1
		            ,content: $('.adjustWrap') 
		            ,title: ['审批','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
		            ,closeBtn: 1
		            ,shade: 0.3
		            ,shadeClose: true
		            ,yes:function(){
		                layer.closeAll();
		                $scope.adjust.status=$scope.adjust.adjusted?1:0;
		                $scope.adjust.suggestion=$scope.billObj.applyInfo.suggestion;
		             //    applyDbService.getApplyCancle({
		            	// 	id: $stateParams.billApplyId
		            	// },function(res) {
		             //        $state.go('repair.apply.list',{tenantId:($stateParams.tenantId||$localStorage.userInfo.tenantId)},{reload: true});
		             //    },function(res){
		             //    	var msg = layer.msg('<div class="toaster"><i></i><span>'+res+'</span></div>', {
		             //            area: ['100%', '60px'],
		             //            time: 3000,
		             //            offset: 'b',
		             //            shadeClose: true,
		             //            shade: 0
		             //        });
		             //        $scope.getBill();
		             //    });
		            }
		            ,btn: ['确定','取消']
		            ,area: ['480px','250px']
		        });
            }

            // 打印申请单
            $scope.printBill = function () {
            	applyDbService.getApplyPrint($stateParams.billApplyId, $scope);
            };
        }]);