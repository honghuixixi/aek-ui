'use strict';

angular.module('app')
    .controller('lcksytzController', ['$scope', '$rootScope', '$state', '$timeout', function($scope, $rootScope, $state, $timeout) {
    	
    	$scope.stateN = '全部(5)';
//			$scope.stateN = $scope.stateM.match(/[\u4e00-\u9fa5]/ig).join('');
			$scope.states = ['全部(5)','在用(15)','维修中(25)','报废中(35)'];
    	$scope.depetshow=false;
    	/*select*/
	    	angular.element(".basic-multiple").select2({
				width: 160,
				dropdownCss: {
					'borderRadius': '0px',
					'width': '160px'
				}
			});
			angular.element(".js-example-basic-single").select2();
			
		/*展示部门列表*/
		$scope.showdeptList=function(){
			if($scope.depetName){
				$scope.depetshow=true;
			}else{
				$scope.depetshow=false;
			}
		}
		$scope.devshow=false;
		$scope.showdevList=function(){
			if($scope.devName){
				$scope.devshow=true;
			}else{
				$scope.devshow=false;
			}
		}
		$scope.divblur = function () {
                $scope.depetshow = false;
            }
		$scope.hrefs = function ($event) {
            	var state = 0;
            	switch ($scope.stateN.substr(0,$scope.stateN.indexOf('('))){
            		case '暂存':
            		state = 0;
            			break;
            		case '待审核':
            		state = 1;
            			break;
            		case '审核未通过':
            		state = 2;
            			break;
            		case '审核通过待记账':
            		state = 3;
            			break;
            		case '记账未通过':
            		state = 4;
            			break;
            		case '已出库':
            		state = 5;
            			break;
            		default:
            			break;
            	}
            	$state.go('main.lcks.kstz.assets',{state:state});
				// window.location.href= 'http://dev.aek56.com/#/tre/ytz/assets?state='+state;
            }
            
            $scope.calee = function () {
//          	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
//				var r = window.location.search.substr(1).match(reg);
//				console.log(window.location);
//				console.log(window.location.search);
//          	console.log(r);
            	 var name,value; 
   var str=location.href; //取得整个地址栏
   var num=str.indexOf("?") 
   str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

   var arr=str.split("&"); //各个参数放到数组里
   for(var i=0;i < arr.length;i++){ 
    num=arr[i].indexOf("="); 
    if(num>0){ 
     name=arr[i].substring(0,num);
     value=arr[i].substr(num+1);
     this[name]=value;
     }
    switch (this.state){
    	case '0':
    		$('.fix-btns').html('<a name="print" class="pos-fix-btn pf-btn-save">打印出库单</a>'+
        '<a name="cancle" class="pos-fix-btn pf-btn-save">取消</a>'+
        '<a name="save" class="pos-fix-btn pf-btn-save">保存</a>');
    		$('.pro-status').css('display','none');
    		break;
    	case '1':
    	$('.fix-btns').html('<a name="print" class="pos-fix-btn pf-btn-sub btn-hover">提醒审核</a>'+
        '<a name="print" class="pos-fix-btn pf-btn-save">打印出库单</a>');
    		$('.pro-ul em').text('待审核');
    		$('.pro-ul li:last-child').remove();
    		$('.pro-ul li:last-child').remove();
    		break;
    	case '2':
    	$('.fix-btns').html('<a name="print" class="pos-fix-btn pf-btn-sub btn-hover">提醒审核</a>');
    		$('.pro-ul em').text('审核未通过');
    		$('.pro-ul li:last-child').remove();
    		break;
    	case '3':
    	$('.fix-btns').html('<a name="print" class="pos-fix-btn pf-btn-sub btn-hover">提醒记账</a>');
    		$('.pro-ul em').text('审核通过待记账');
    		$('.pro-ul li:last-child').remove();
    		break;
    	case '4':
    	$('.fix-btns').html('<a name="print" class="pos-fix-btn pf-btn-sub btn-hover">提醒记账</a>'+
        '<a name="print" class="pos-fix-btn pf-btn-save">打印出库单</a>');
    		$('.pro-ul em').text('记账未通过');
    		$('.pro-ul li:last-child').remove();
    		break;
    	case '5':
    	$('.fix-btns').html('');
    		$('.pro-ul em').text('已出库');
    		break;
    	default:
    		break;
    }
    } 
            }
            $scope.calee();
		
	 $scope.toAssets = function () {
            var index=layer.open({
                time: 0 //不自动关闭
                ,content: '<ul class="input-ytz">'+
                '<li class="m-b-sm"><span><i>*</i>设备名称：</span><input type="text" /></li>'+
                '<li><span><i>*</i>所属科室：</span><input type="text" /></li>'+
                '</ul>'
                ,title: ['新建预台账','font-size: 14px;color: #fff;background-color: #555a69;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                ,closeBtn: 1
                ,shade: 0.3
                ,shadeClose: true
                ,btn: ['确认', '取消']
                ,yes: function(index){
                    layer.close(index);
                    var index=layer.open({
                        time: 0 //不自动关闭
                        ,content: '<div class="new-ytz">'+
                        '<div class="m-t-b-md"><img src="../../../../res/img/cg.png"/></div>'+
                        '<div>预台账创建成功，现在去完善预台账信息？</div>'+
                        '</div>'
                        ,title: ['提示','font-size: 14px;color: #fff;background-color: #555a69;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                        ,closeBtn: 1
                        ,shade: 0.3
                        ,shadeClose: true
                        ,btn: ['完善预台账信息', '　稍后再说　']
                        ,yes: function(index){
                            layer.close(index);
                            $state.go('main.lcks.kstz.assets');
                        }
                        ,area: ['500px','240px']
                        ,btnAlign: 'c'
                    });
                    layer.style(index, {
                        fontSize: '16px',
                        backgroundColor: '#fff',
                    });
                }
                ,area: ['500px','240px']
                ,btnAlign: 'c'
            });
            layer.style(index, {
                fontSize: '16px',
                backgroundColor: '#fff',
            });
        }
    }]);