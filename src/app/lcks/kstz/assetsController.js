'use strict';

angular.module('app')
    .controller('lcksassetsController', ['$scope', '$rootScope', '$state', '$timeout',
        function($scope, $rootScope, $state, $timeout) {
            var title = "";
            var defaultAva = $rootScope.defaultAvatar;

            $scope.unAddDev = false;
            $scope.isClick = true;
			activate();
			
            // $scope.myCroppedImage=$scope.myCroppedImage ;
            $scope.myCroppedImage = '';
            if($state.includes('**.ytz.updateAssets')){
                title="编辑预台账";
                var id = $state.params.id;
                // activate(id);
                // validate(id);
            }else if($state.includes('**.ytz.assets')){
                title="新增预台账";
                activate();
//              validate(null);
                setTimeout(function(){
                    $scope.myCroppedImage = defaultAva;
                    !$rootScope.$$phase && $scope.$apply();
                },300);

            }

            if($state.includes('**.ytz.updatePurchase')){
                title="编辑预台账";
                var id = $state.params.id;
                // activate(id);
                // validate(id);
            }else if($state.includes('**.ytz.purchase')){
                title="新增预台账";
                activate();
//              validate(null);
                setTimeout(function(){
                    $scope.myCroppedImage = defaultAva;
                    !$rootScope.$$phase && $scope.$apply();
                },300);

            }

            $scope.layerWin = function (type,conetnt){
                var msg = '';
                var content = '';
                if(type == 'submit'){
                    msg = '提交后不可再修改，您确定提交吗？';
                    content = '提交成功！';
                }else if(type == 'save'){
                    msg = '是否保存？';
                    content = '保存成功！';
                }else if(type == 'delete'){
                    msg = '是否删除？';
                    content = '删除成功！';
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

            function saveData(){
                var m = $scope.record;
                if(m){
                    $scope.isDisabled = true;//提交disabled
                    $.ajax({
                        dataType: 'json',
                        contentType:'application/json;charset=UTF-8',
                        url : '/user/update',
                        data: angular.toJson(m)
                    }).then(callback);
                }
                function callback(result){
                    if(result.httpCode ==200){//成功
                        toaster.clear('*');
                        toaster.pop('success', '', "保存成功");
                        $timeout(function(){
                            $state.go('main.sys.user.list');
                        },2000);
                    }else{
                        toaster.clear('*');
                        toaster.pop('error', '', result.msg);
                        $scope.isDisabled = false;
                    }
                    $scope.loading = false;
                }
            }

            var handleFileSelect=function(evt) {
                var file=evt.currentTarget.files[0];
                if(!/image\/\w+/.test(file.type)){
                    return false;
                }
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $scope.$apply(function($scope){
                        $scope.myImage=evt.target.result;
                    });
                };
                reader.readAsDataURL(file);
            };

            $scope.topHeight = 0;

            
            $scope.proUl = function ($event,liNum){
//              console.log(liNum)
                var name = $event.target.name;
                var detailPadding = parseInt($('.ytz-detail').css('padding-top'));
                $scope.isClick = !$scope.isClick;
                if(name == 'down'){
                    $('.pro-ul').css({
                        'height':'inherit',
                        'overflow-y':'inherit'
                    });
                    $('.ytz-detail').css('padding-top',detailPadding+(liNum*28-28));
                }else{
                    $('.pro-ul').css({
                        'height':'28px',
                        'overflow-y':'hidden'
                    });
                    $('.ytz-detail').css('padding-top',detailPadding-(liNum*28-28));
                }
            };

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
//  		$('.pro-status').css('display','none');
			$('.pro-status').remove();
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




            // 初始化页面
            function activate() {
                $('.pro-ul').css({
                    'height':'28px',
                    'overflow-y':'hidden'
                })
            }

            //表单验证
            function validate(userId){
                //notEqual 规则
                $.validator.addMethod('notEqual', function(value, ele){
                    return value != this.settings.rules[ele.name].notEqual;
                });

                var validateData = {
                    rules: {
                        assetName: {
                            required: true
                        },
                        belongDept: {
                            required: true
                        },
                        regNo: {
                            required: true
                        },
                        splName: {
                            required: true
                        }
                    },
                    messages: {
                        assetName: {
                            required: '请填写设备名称'
                            // maxLengthB:"帐号不得超过{0}个字符",
                            // isExist:"该名称已存在"
                        },
                        belongDept: {
                            required: '请填写所属科室'
                        },
                        regNo: {
                            required: '请填写注册证号'
                        },
                        splName: {
                            required: '请选择供应商'
                        }
                    },
                    submitHandler: function() {
                        $scope.submit();
                    }
                }
                jQuery('#form1').validate(validateData);
//              jQuery('#form2').validate(validateData);
//              jQuery('#form3').validate(validateData);
            }
        }]);
