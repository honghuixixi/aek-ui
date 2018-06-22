'use strict';

angular.module('app')
.controller('bfglController', ['$scope', '$rootScope', '$state', '$timeout', '$stateParams',
        function($scope, $rootScope, $state, $timeout, $stateParams) {
            $scope.applyForNum = 0;
            $scope.applyValue = '';
			$scope.depetshow=false;
            $scope.operation = '--';
            $scope.operaState = true;
			$scope.stateN = '待审核(5)';
            $scope.state=$stateParams.state;
//			$scope.stateN = $scope.stateM.match(/[\u4e00-\u9fa5]/ig).join('');
			$scope.states = ['待审核(5)','审核通过待记账(15)','记账未通过(25)','已报废(35)'];
            $scope.btns = [
                {name:'print',con:'打印报废单',class:'pos-fix-btn pf-btn-save',show:false},
                {name:'cancle',con:'取消',class:'pos-fix-btn pf-btn-save',show:false},
                {name:'save',con:'保存',class:'pos-fix-btn pf-btn-save',show:false},
                {name:'submit',con:'提交报废申请',class:'pos-fix-btn pf-btn-save btn-hover',show:false},
                {name:'remind',con:'提醒审核',class:'pos-fix-btn pf-btn-save btn-hover',show:false},
                {name:'remind',con:'提醒记账',class:'pos-fix-btn pf-btn-save btn-hover',show:false},
                {name:'again',con:'重新编辑',class:'pos-fix-btn pf-btn-save btn-hover',show:false},
                {name:'pass',con:'审核通过',class:'pos-fix-btn pf-btn-save btn-hover',show:false},
                {name:'noPass',con:'审核不通过',class:'pos-fix-btn pf-btn-save btn-hover',show:false},
                {name:'again',con:'重新审核',class:'pos-fix-btn pf-btn-save btn-hover',show:false},
                {name:'account',con:'记账报废',class:'pos-fix-btn pf-btn-save btn-hover',show:false},
                {name:'noPass',con:'记账不通过',class:'pos-fix-btn pf-btn-save btn-hover',show:false},
                {name:'cancel',con:'取消报废',class:'pos-fix-btn pf-btn-save',show:false}
            ];
            $scope.trData = [
                {one:'680100003309',two:'脉动真空灭火器111',three:'KP20170302P',four:'HYC-360',five:'杭州爱医康科技有限公司',six:'江苏刘能科技器械有限公司',seven:'呼吸科',ckid:'checkid0'},
                {one:'680100003309',two:'脉动真空灭火器222',three:'KP20170302P',four:'HYC-360',five:'杭州爱医康科技有限公司',six:'江苏刘能科技器械有限公司',seven:'呼吸科',ckid:'checkid1'},
                {one:'680100003309',two:'脉动真空灭火器333',three:'KP20170302P',four:'HYC-360',five:'杭州爱医康科技有限公司',six:'江苏刘能科技器械有限公司',seven:'呼吸科',ckid:'checkid2'},
                {one:'680100003309',two:'脉动真空灭火器444',three:'KP20170302P',four:'HYC-360',five:'杭州爱医康科技有限公司',six:'江苏刘能科技器械有限公司',seven:'呼吸科',ckid:'checkid3'}
            ];
            $scope.addData = [
                {one:'680100003309',two:'脉动真空灭火器0',three:'KP20170302P',four:'HYC-360',five:'杭州爱医康科技有限公司',six:'江苏刘能科技器械有限公司',seven:'呼吸科',ckid:'checkid0'},
                {one:'680100003309',two:'脉动真空灭火器1',three:'KP20170302P',four:'HYC-360',five:'杭州爱医康科技有限公司',six:'江苏刘能科技器械有限公司',seven:'呼吸科',ckid:'checkid1'},
                {one:'680100003309',two:'脉动真空灭火器2',three:'KP20170302P',four:'HYC-360',five:'杭州爱医康科技有限公司',six:'江苏刘能科技器械有限公司',seven:'呼吸科',ckid:'checkid2'},
                {one:'680100003309',two:'脉动真空灭火器3',three:'KP20170302P',four:'HYC-360',five:'杭州爱医康科技有限公司',six:'江苏刘能科技器械有限公司',seven:'呼吸科',ckid:'checkid3'},
                {one:'680100003309',two:'脉动真空灭火器4',three:'KP20170302P',four:'HYC-360',five:'杭州爱医康科技有限公司',six:'江苏刘能科技器械有限公司',seven:'呼吸科',ckid:'checkid4'},
                {one:'680100003309',two:'脉动真空灭火器5',three:'KP20170302P',four:'HYC-360',five:'杭州爱医康科技有限公司',six:'江苏刘能科技器械有限公司',seven:'呼吸科',ckid:'checkid5'},
                {one:'680100003309',two:'脉动真空灭火器6',three:'KP20170302P',four:'HYC-360',five:'杭州爱医康科技有限公司',six:'江苏刘能科技器械有限公司',seven:'呼吸科',ckid:'checkid6'},
                {one:'680100003309',two:'脉动真空灭火器7',three:'KP20170302P',four:'HYC-360',five:'杭州爱医康科技有限公司',six:'江苏刘能科技器械有限公司',seven:'呼吸科',ckid:'checkid7'},
                {one:'680100003309',two:'脉动真空灭火器8',three:'KP20170302P',four:'HYC-360',five:'杭州爱医康科技有限公司',six:'江苏刘能科技器械有限公司',seven:'呼吸科',ckid:'checkid8'},
                {one:'680100003309',two:'脉动真空灭火器9',three:'KP20170302P',four:'HYC-360',five:'杭州爱医康科技有限公司',six:'江苏刘能科技器械有限公司',seven:'呼吸科',ckid:'checkid9'}
            ];

            var title = "";
            var defaultAva = $rootScope.defaultAvatar;
            $scope.unAddDev = false;
            $scope.unPrint = false;
            $scope.isClick = true;
            $scope.regdiv = true;
            activate();
			
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
			/*select*/
//	    	angular.element(".basic-multiple").select2({
//				width: 160,
//				dropdownCss: {
//					'borderRadius': '0px',
//					'width': '160px'
//				}
//			});
//			angular.element(".js-example-basic-single").select2();
			
            //设备移除
            $scope.removeTr = function (tr) {
                $scope.trData.splice($scope.trData.indexOf(tr), 1);
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
            		case '已报废':
            		state = 5;
            			break;
            		default:
            			break;
            	}
				// window.location.href= 'http://dev.aek56.com/#/tre/bfgl/new?state='+state;
                $state.go("main.tre.bfgl.new",{state:state});
            }
            
            $scope.calee = function ($state) {
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
    // if(num>0){ 
    //  name=arr[i].substring(0,num);
    //  value=arr[i].substr(num+1);
    //  this[name]=value;
    //  }
    // console.log(this.state);
    switch ($stateParams.state){
        case 0:
            // $('.fix-btns').html('<a name="print" class="pos-fix-btn pf-btn-save">打印转科单</a>'+
      //   '<a name="cancle" class="pos-fix-btn pf-btn-save">取消</a>'+
      //   '<a name="save" class="pos-fix-btn pf-btn-save">保存</a>');
            // $('.pro-status').css('display','none');
            break;
        case 1:
        // $('.fix-btns').html('<a name="print" class="pos-fix-btn pf-btn-sub btn-hover">提醒审核</a>'+
     //    '<a name="print" class="pos-fix-btn pf-btn-save">打印入库单</a>');
            // $('.pro-ul em').text('待审核');
            // $('.pro-ul li:last-child').remove();
            // $('.pro-ul li:last-child').remove();
            $scope.li1 = true;
            $scope.div = true;
            $scope.li1con = '提交申请';
            $scope.divcon = '待审核';
            $scope.btns[7].show=true;
            $scope.btns[8].show=true;
            $scope.btns[2].show=true;
            break;
        case 2:
        // $('.fix-btns').html('<a name="print" class="pos-fix-btn pf-btn-sub btn-hover">提醒审核</a>');
        //  $('.pro-ul em').text('审核未通过');
        //  $('.pro-ul li:last-child').remove();
            break;
        case 3:
        // $('.fix-btns').html('<a name="print" class="pos-fix-btn pf-btn-sub btn-hover">提醒记账</a>');
        //  $('.pro-ul em').text('审核通过待记账');
        //  $('.pro-ul li:last-child').remove();
            $scope.li1 = true;
            $scope.div = true;
            $scope.li2 = true;
            $scope.li1con = '提交申请';
            $scope.li2con = '审核通过';
            $scope.divcon = '审核通过待记账';
            // $scope.btns[5].show=true;
            $scope.btns[10].show=true;
            $scope.btns[11].show=true;
            break;
        case 4:
        // $('.fix-btns').html('<a name="print" class="pos-fix-btn pf-btn-sub btn-hover">提醒记账</a>'+
     //    '<a name="print" class="pos-fix-btn pf-btn-save">打印入库单</a>');
        //  $('.pro-ul em').text('记账未通过');
        //  $('.pro-ul li:last-child').remove();
            $scope.li1 = true;
            $scope.div = true;
            $scope.li2 = true;
            $scope.li3 = true;
            $scope.li1con = '提交申请';
            $scope.li2con = '审核通过';
            $scope.regdiv = false;
            $scope.li3con = '记账不通过';
            $scope.divcon = '记账未通过';
            $scope.btns[9].show=true;
            // $scope.btns[7].show=true;
            break;
        case 5:
        // $('.fix-btns').html('');
        //  $('.pro-ul em').text('已入库');
            $scope.li1 = true;
            $scope.div = true;
            $scope.li2 = true;
            $scope.li3 = true;
            $scope.li1con = '提交申请';
            $scope.li2con = '审核通过';
            $scope.li3con = '记账通过';
            $scope.divcon = '已报废';
            break;
        default:
        // $('.pro-status').css('display','none');
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
                            // $state.go('main.tre.bfgl.new',{state: 0});
                            window.location.href='http://dev.aek56.com/#/tre/bfgl/new?state=0';
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

            $scope.toAddDev = function () {
                $scope.unAddDev = !$scope.unAddDev;
                layer.open({
                    type: 1
                    ,time: 0
                    ,btnAlign: 'c'
                    ,yes: function(index){
                        $scope.unAddDev = !$scope.unAddDev;
                        for (var i = 0,len=$scope.addData.length-1; i < len; i++) {
                        	if($('#'+$scope.addData[i].ckid).prop('checked'))
                        	$scope.trData.push($scope.addData.splice(i, 1)[0]);
                        }
                        layer.close(index);
                    }
                    ,btn2: function(index){
                        $scope.unAddDev = !$scope.unAddDev;
                        layer.close(index);
                    }
                    ,btn: ['提交', '取消']
                    ,title: ['添加设备','font-size: 14px;color: #fff;background-color: #555a69;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                    ,content: $('#addDev')
                    ,area: ['1166px','720px']
                    ,cancel: function(index, layero){ 
						layer.close(index);
						$scope.unAddDev = !$scope.unAddDev;
						return false; 
					}   
                });
            }
            $scope.layerWin = function (type,conetnt){
                // if(type == 'submit'){
                //     msg = '提交后不可再修改，您确定提交吗？';
                //     content = '提交成功！';
                // }else if(type == 'save'){
                //     msg = '是否保存？';
                //     content = '保存成功！';
                // }else if(type == 'cancle'){
                // 	window.history.go(-1);
                // }else if(type == 'print'){
                // 	$scope.unPrint = !$scope.unPrint;
                // 	var index=layer.open({
                //   title: ''
                //   ,time: 0
                //   ,area: ['210mm','100%']
                //   ,type: 1
                //   ,content: $('#toPrint')
                //   ,closeBtn: 0
                //   ,shadeClose: true
                //   ,btn: ''
                //   ,cancel: function(index, layero){
                // 	layer.close(index);
                // 	$scope.unPrint = !$scope.unPrint;
                // 	return false;
                // }
                // });
                // 	return;
                // }else if(type == 'audit'){
                //     msg = '是否重新审核？';
                //     content = '提交成功！';
                // }

                var msg = '';
                var content = '';

                switch (type){
                    case 'submit':
                        msg = '提交后不可再修改，您确定提交吗？';
                        content = '提交成功！';
                        break;
                    case 'save':
                        msg = '是否保存？';
                        content = '保存成功！';
                        break;
                    case 'delete':
                        msg = '是否删除？';
                        content = '删除成功！';
                        break;
                    case 'print':
                        msg = '是否打印？';
                        content = '打印成功！';
                        break;
                    case 'remind':
                        msg = '是否提醒？';
                        content = '提醒成功！';
                        break;
                    case 'pass':
                        msg = '是否通过？';
                        content = '操作成功！';
                        break;
                    case 'noPass':
                        msg = '是否不通过？';
                        content = '操作成功！';
                        break;
                    case 'again':
                        msg = '是否重新操作？';
                        content = '操作成功！';
                        break;
                    case 'account':
                        msg = '是否记账？';
                        content = '记账成功！';
                        break;
                    case 'audit':
                        msg = '是否审核？';
                        content = '审核成功！';
                        break;
                    case 'cancel':
                        msg = '是否取消';
                        content='取消成功！';
                        break;
                }


                var index=layer.open({
                    time: 0 //不自动关闭
                    ,content: '<div class="pad-fifty">'+msg+'</div>'
                    ,title: ['提示','font-size: 14px;color: #fff;background-color: #555a69;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                    ,closeBtn: 1
                    ,shade: 0.3
                    ,shadeClose: true
                    ,btn: ['确定', '取消']
                    ,yes: function(index){
                        layer.close(index);
                        var msg=layer.msg('<div class="toaster"><i></i><span>'+content+'</span></div>',{
                            area: ['100%','60px']
                            ,time: 3000,
                            offset:'b'
                            ,shadeClose: true
                            ,shade: 0
                        });
                        if(type == 'redo'){
                            return $state.go('main.tre.bfgl.new',{state: 7});
                        }else if(type == 'again'){
                            return $state.go('main.tre.bfgl.new',{state: 1});
                        }
                        $state.go('main.tre.bfgl.list');
                    }
                    ,area: ['500px','220px']
                    ,btnAlign: 'c'
                });
                layer.style(index, {
                    fontSize: '16px',
                    backgroundColor: '#fff',
                });
            }

            //初始化验证
            //validate($scope);
            $scope.btnFn = function ($event) {
                var name = $event.target.name;
                $scope.layerWin(name);
            }

            //申请说明字数变化
            $scope.applyChange = function () {
                $scope.applyForNum = $scope.applyValue.length;
            }

            $scope.proUl = function ($event,liNum){
                var name = $event.target.name;
                var detailPadding = parseInt($('.ytz-detail').css('padding-top'));
                $scope.isClick = !$scope.isClick;
                if(name == 'down'){
                    $('.pro-ul').css({
                        'height':'inherit',
                        'overflow-y':'inherit'
                    });
                }else{
                    $('.pro-ul').css({
                        'height':'28px',
                        'overflow-y':'hidden'
                    });
                }
            };

            // 初始化页面
            function activate() {
                $('.pro-ul').css({
                    'height':'28px',
                    'overflow-y':'hidden'
                })
            }
        }]);