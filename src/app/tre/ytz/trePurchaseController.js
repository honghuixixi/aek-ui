'use strict';

angular.module('app')
    .controller('treYtzPurchaseController', ['$scope', '$rootScope', '$state', '$timeout', '$localStorage', '$stateParams', 'FileUploader','$filter',
        function($scope, $rootScope, $state, $timeout, $localStorage, $stateParams,FileUploader,$filter) {

            //图片
            $scope.fileUrlBase = 'http://'+window.location.host + '/api/file';
            $scope.dateToTime=function(a){
                if(!a){
                    return;
                }
                var date = new Date(a);
                var y = date.getFullYear();
                var m = date.getMonth()+1;
                m=m<10?('0'+m):m;
                var d = date.getDate();
                d=d<10?('0'+d):d;
                return y+'-'+m+'-'+d;
            }

            $scope.isClick = true;

        	$rootScope.membernav=false;
            $scope.assetsId = 0;
            // 转为资产台账
            $scope.toAssets=function(){
                var layerImg = "../../../res/img/wh.png";
                var index = layer.open({
                    time: 0, //不自动关闭
                    type:1,
                    content: '<div class="pad-fifty delete-wrap"><div style="padding-bottom:20px;padding-top: 0;" class="alertImg"><img src='+layerImg+'></div>提交后不可撤回，您确定将预台账设备'+$scope.assetsName+'转为资产台账吗？</div>',
                    // content: $('#checkWinCon'),
                    title: ['转为资产台账', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    closeBtn: 1,
                    shade: 0.3,
                    shadeClose: true,
                    success: function() {
                    },
                    btn: ["确定", "取消"],
                    yes: function(index) {
                        $.ajax({
                            type: 'get',
                            url: '/assets/preAssetsInfo/toAssets',
                            data: {id:$stateParams.assetId},
                            complete: function(xhr){
                                if(xhr.responseJSON.code==200){
                                    $state.go('main.tre.zctz.list',{id:$stateParams.id});
                                }else{
                                    var msg = layer.msg('<div class="toaster"><span>'+xhr.responseJSON.msg+'</span></div>', {
                                        area: ['100%', '60px'],
                                        time: 3000,
                                        offset: 'b',
                                        shadeClose: true,
                                        shade: 0
                                    });
                                }
                            }
                        });
                        layer.close(index);
                    },
                    area: ['500px', '250px'],
                    btnAlign: 'r'
                });
            }
            $scope.verifyFn = function () {
                $scope.checkWin = true;
                var index = layer.open({
                    time: 0, //不自动关闭
                    type:1,
                    content: $('#checkWinCon'),
                    // content: $('#checkWinCon'),
                    title: ['提示', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    closeBtn: 1,
                    id:'pass',
                    shade: 0.3,
                    shadeClose: true,
                    btn: ["确定", "取消"],
                    yes: function(index) {
                        layer.close(index);
                        $state.go('main.tre.ytz.list',{id:$stateParams.id,isOpMsg:"操作成功",isOp:true});
                    },
                    area: ['500px', '560px'],
                    btnAlign: 'r'
                });
                layer.style(index, {
                    fontSize: '16px',
                    backgroundColor: '#fff',
                });
            }
            /*获取详情*/
            $.ajax({
                type: 'get',
                url: '/assets/assetsInfo/getAssetsDetail',
                data: {id:$stateParams.assetId},
                complete: function(xhr){
                    if(xhr.responseJSON.code==200){
                        $scope.res = xhr.responseJSON.data;
                        $scope.assetsName = $scope.res.assetsName;
                        $scope.factoryName = $scope.res.factoryName;
                        $scope.assetsId = $scope.res.assetsId;

                        $scope.res.purchaseDate1=$scope.res.purchaseDate?$scope.dateToTime($scope.res.purchaseDate):'';
                        $scope.res.startDate1=$scope.res.startDate?$scope.dateToTime($scope.res.startDate):'';
                        $scope.res.arrivalDate1=$scope.res.arrivalDate?($scope.dateToTime($scope.res.arrivalDate)):'';
                        $scope.res.price1 = $scope.res.priceStr?$scope.res.priceStr.slice(1).split(',').join(''):'';
                        $scope.res.contractPrice1 = $scope.res.contractPriceStr?$scope.res.contractPriceStr.slice(1).split(',').join(''):'';

                        $scope.res.startUseDate1=$scope.res.startUseDate?$scope.dateToTime($scope.res.startUseDate):'';

                        if(!+$scope.res.price1){
                            $scope.res.price1 = '';
                        }
                        if(!+$scope.res.contractPrice1){
                            $scope.res.contractPrice1 = '';
                        }

                        if($scope.res.listFundSources && $scope.res.listFundSources.length){
                            if($scope.res.listFundSources.length==2){
                                $scope.fundSources={codeText:'混合',codeValue:4}
                                $scope.res.listFundSources[0].fundSourceMoney=$scope.res.listFundSources[0].fundSourceMoneyStr;
                                $scope.res.listFundSources[1].fundSourceMoney=$scope.res.listFundSources[1].fundSourceMoneyStr;
                                $scope.moneys=[$scope.res.listFundSources[0].fundSourceMoneyStr?$scope.res.listFundSources[0].fundSourceMoneyStr.slice(1).split(',').join(''):'',
                                    $scope.res.listFundSources[1].fundSourceMoneyStr?$scope.res.listFundSources[1].fundSourceMoneyStr.slice(1).split(',').join(''):''];
                            }else{
                                $scope.fundSources={codeText:$scope.res.listFundSources[0].fundSourcesText,codeValue:$scope.res.listFundSources[0].fundSourcesId};
                                $scope.res.listFundSources[0].fundSourceMoney=$scope.res.listFundSources[0].fundSourceMoneyStr;
                                $scope.moneys=[$scope.res.listFundSources[0].fundSourceMoneyStr?$scope.res.listFundSources[0].fundSourceMoneyStr.slice(1).split(',').join(''):''];
                            }
                        }else{
                            $scope.moneys=[null];
                            $scope.fundSources={codeText:$scope.res.fundSourcesName,codeValue:$scope.res.fundSourcesId};
                            if($scope.res.fundSourcesId==4){
                                $scope.moneys=[null,null];
                                $scope.res.listFundSources=[{fundSourcesText: '财政资金',fundSourceMoneyStr:''},{fundSourcesText: '自筹资金',fundSourceMoneyStr:''}];
                            }
                            if($scope.res.fundSourcesId&&$scope.res.fundSourcesId!=4){
                                $scope.moneys=[null];
                                $scope.res.listFundSources=[{fundSourcesText: $scope.res.fundSourcesName,fundSourceMoneyStr:''}];
                            }
                        }
                        // $scope.fundSources = {codeText: $scope.res.listFundSources.length?($scope.res.listFundSources.length==2?'混合':$scope.res.listFundSources[0].fundSourcesText):null,codeValue: $scope.res.listFundSources.length?($scope.res.listFundSources.length==2?4:$scope.res.listFundSources[0].fundSourcesId):null,moneys:$scope.res.fundSourceMoneys};
                        // $scope.moneys = [$scope.res.listFundSources.length?$scope.res.listFundSources[0].];
                        // $scope.res.price && ($scope.res.price = (+$scope.res.price).toFixed(2));
                        // $scope.res.contractPrice && ($scope.res.contractPrice = (+$scope.res.contractPrice/100).toFixed(2));
                        $scope.res.invoiceNos&&($scope.res.invoiceNos=$scope.res.invoiceNos.split(',').join(';'));
                        if($scope.res.listInvoice && $scope.res.listInvoice.length){
                            $scope.res.invoiceNo = '';
                            for (var i = $scope.res.listInvoice.length - 1; i >= 0; i--) {
                                $scope.res.invoiceNo=$scope.res.listInvoice[i].invoiceNo;
                            };
                        }
                        $scope.purchaseType = {codeText: $scope.res.purchaseTypeName,codeValue: $scope.res.purchaseTypeId,id:$scope.res.purchaseTypeId};
                        // (!$scope.res.listInvoice.length)&&($scope.res.listInvoice.push({assetsId:$scope.res.assetsId,invoiceNo:null}));
                        if(!($scope.res.listInvoice && $scope.res.listInvoice.length)){
                            $scope.res.listInvoice = [{assetsId:$scope.res.assetsId,invoiceNo:null}];
                        }
                    }else{
                        $scope.res={};
                    }
                    $rootScope.$apply();

                    //底部高度设置，使其占满剩余全部
                    $scope.resetBottomHeight = function () {
                        var clientHeight = angular.element('.app-content-body').height();
                        angular.element('.panel-default').css('min-height',clientHeight-70-angular.element('.ytz-con').height());
                    }
                    $scope.resetBottomHeight();
                }
            })

            $scope.state = $stateParams.state;
            $scope.currentState = $stateParams.currentState;

            $scope.limitLengths=function(a,b){
                $scope.deleteSpace(a,b,$scope.res);
                $scope.lengthSubstring(a,b,$scope.res);
            }
            $scope.limitLength=function(a,b){
                $scope.deleteSpace(a,b,$scope);
                $scope.lengthSubstring(a,b,$scope);
            }
            $scope.deleteSpace=function(a,b,c){
                c[a]=c[a].replace(/\s+/g,'');
            }
            $scope.lengthSubstring=function(a,b,c){
                if(!$scope.lengthOut(a,b,c)){
                    return
                }
                c[a] = c[a].substring(0,c[a].length-1);
                $scope.lengthSubstring(a,b,c);
            }
            $scope.lengthOut=function(a,b,c){
                var arg1 = c[a];
                if(arg1.length<=20) return false;
                var dwords = arg1.match(/[\x00-\xff]/g);
                var bytes = arg1.match(/[^\x00-\xff]/g);
                !dwords&&(dwords=[]);
                !bytes&&(bytes=[]);
                if((dwords.length+bytes.length)>40){
                    return true;
                }
                return false;
            }

            switch($stateParams.state) {
                case '0':
                    $scope.statusText = '暂存';
                    $scope.ulStatus = false;
                    $scope.pro1=false;
                    $scope.pro2=false;
                    $scope.pro3=false;
                    $scope.pro4=true;
                    /*重新编辑跳转的页面*/
                    if($scope.currentState == 3) {
                        $scope.btnData = [{
                            name: 'submit',
                            text: '提交验收',
                            class: 'btn-submit'
                        }, {
                            name: 'cancel',
                            text: '取消申请',
                            class: 'btn-delete'
                        }];

                    }
                    break;
                case '1':
                    $scope.statusText = '待验收';
                    $scope.ulStatus = true;
                    $scope.pro1=true;
                    $scope.pro2=false;
                    $scope.pro3=false;
                    $scope.pro4=false;
                    $scope.btnData = [{
                        name: 'pass',
                        text: '验收',
                        class: 'btn-submit'
                    }
                        // , {
                        // 	name: 'noPass',
                        // 	text: '验收不通过',
                        // 	class: 'btn-save'
                        // }
                    ];
                    // $scope.pro2 = true;
                    // $('.ytz-detail').css('padding-top', '140px');
                    break;
                case '2':
                    $scope.statusText = '验收已通过';
                    $scope.ulStatus = true;
                    $scope.pro1=false;
                    $scope.pro2=true;
                    $scope.pro3=false;
                    $scope.pro4=false;
                    $scope.btnData = [{
                        name: 'print',
                        text: '打印验收单',
                        class: 'btn-save btn-print'
                    }];
                    $scope.pro2 = true;
                    // $('.ytz-detail').css('padding-top', '140px');
                    break;
                case '3':
                    $scope.ulStatus = true;
                    $scope.pro1=false;
                    $scope.pro2=false;
                    $scope.pro3=true;
                    $scope.pro4=false;
                    $scope.statusText = '验收未通过';
                    $scope.btnData = [{
                        name: 'again',
                        text: "重新编辑",
                        class: 'btn-submit'
                    }, {
                        name: "cancel",
                        text: "取消申请",
                        class: "btn-save"
                    }];
                    $scope.pro3 = true;
                    // $('.ytz-detail').css('padding-top', '141px');
                    break;
                // case '4':
                // $('.btn-list').html('<a name="print" class="pos-fix-btn pf-btn-sub btn-hover">提醒记账</a>'+
                // '<a name="print" class="pos-fix-btn pf-btn-save">打印出库单</a>');
                // 	$('.pro-ul em').text('记账待通过');
                // 	$('.pro-ul li:last-child').remove();
                // 	break;
                // case '5':
                // $('.btn-list').html('');
                // 	$('.pro-ul em').text('已出库');
                // 	break;
                default:
                    break;
            }

            // 下拉菜单
            $scope.needOverlay = false;

            $scope.fundSourceMoney = null;
            $scope.fundSourceMoneys = [];
            $scope.fundSourcesListShow = false;
            $scope.purchaseTypeListShow = false;

            $scope.fundSources = {codeText: null,codeValue: null,money1:null,money2:null,money:null};
            $scope.purchaseType = {codeText: null,codeValue: null,id:null};
            $scope.assetsSelecters=function(a){
                $scope[a]=true;
                $scope.needOverlay = true;
            }
            $scope.assetsSelectersLiClick=function(a,b,c,d){
                $scope[a] = c;
                $scope[b] = false;
                $scope.needOverlay = false;
                if($scope.moneys.length==2&&c.codeValue==4||$scope.res.listFundSources.length&&c.codeValue==$scope.res.listFundSources[0].fundSourcesId){
                    return;
                }
                d&&(c.codeValue!=4)&&($scope.res.listFundSources=[{"assetsId": $scope.res.assetsId,
                    // "fundPercent": "100%",
                    "fundSourceMoney": $scope.res.fundSourceMoneys,
                    "fundSourcesId": c.codeValue,
                    "fundSourcesText": c.codeText,
                    "id": $scope.res.listFundSources.length?$scope.res.listFundSources[0].id:null}])&&($scope.moneys=[null]);
                d&&(c.codeValue==4)&&($scope.res.listFundSources=[{"assetsId": $scope.res.assetsId,
                    // "fundPercent": "100%",
                    "fundSourceMoney": $scope.res.fundSourceMoneys,
                    "fundSourcesId": 1,
                    "fundSourcesText": '财政资金',
                    "id": $scope.res.listFundSources.length?$scope.res.listFundSources[0].id:null}
                    ,{"assetsId": $scope.res.assetsId,
                    // "+": "100%",
                    "fundSourceMoney": $scope.res.fundSourceMoneys,
                    "fundSourcesId": 2,
                    "fundSourcesText": '自筹资金',
                    "id": $scope.res.listFundSources.length?($scope.res.listFundSources.length==2?$scope.res.listFundSources[1].id:null):null}])&&($scope.moneys=[null,null]);
            }
            //关闭所有的弹出框
            $scope.closeAll = function() {
                $scope.needOverlay = false;
                
                $scope.fundSourcesListShow = false;
                $scope.purchaseTypeListShow = false;
            }

            $scope.getAllList=function(){
            $.ajax({
                    type: 'get',
                    url: '/assets/data/geCodeInfoByType?types=ACCOUNT_CATEGORY&types=MANAGE_LEVEL&types=FUND_SOURCES&types=UNIT&types=PURCHASE_TYPE&types=MEASURE_TYPE&types=DEP_TYPE&types=PURPOSE&types=ACCOUNT_BOOK',
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {
                            var data = res.responseJSON.data;
                            $scope.ACCOUNT_CATEGORY = data.ACCOUNT_CATEGORY; // 核算类别
                            $scope.MANAGE_LEVEL = data.MANAGE_LEVEL; // 管理级别
                            $scope.FUND_SOURCES = data.FUND_SOURCES; // 资金来源
                            $scope.UNIT = data.UNIT //单位
                            $scope.PURCHASE_TYPE = data.PURCHASE_TYPE //设备来源
                            $scope.MEASURE_TYPE = data.MEASURE_TYPE //计量类别
                            $scope.DEP_TYPE = data.DEP_TYPE //折旧方法
                            $scope.PURPOSE = data.PURPOSE //用途
                            $scope.ACCOUNT_BOOK = data.ACCOUNT_BOOK //仓库类型
                        } else {}
                    }
                });
            }
            $scope.getAllList();

            //编辑台账
            $scope.saveAssets = function(type) {

                var url = '/assets/preAssetsInfo/submitEditAssets',
                    url2 = '/assets/preAssetsInfo/submitEditAssets';
                var state = 0;
                // if(type == 'save'){
                //     state = 0 ;
                // }else{
                //     state = 1;
                // }

                if(type == 'save'){
                    state = 0 ;
                    url = '/assets/assetsInfo/editAssets';
                    url2 = '/assets/preAssetsInfo/editAssets'
                }else if(type == 'again'){
                    $.ajax({
                        type:'get',
                        url:'/assets/preAssetsInfo/reEdit',
                        async:false,
                        data: {
                            id: $stateParams.assetId
                        },
                        complete: function(res) {
                        }
                    })
                }else{
                    state = 1;
                    url = '/assets/preAssetsInfo/submitEditAssets';
                    url2 = '/assets/preAssetsInfo/submitEditAssets';
                }

                $scope.res.purchaseTypeId=$scope.purchaseType.codeValue;
                if($scope.res.listFundSources && $scope.res.listFundSources.length==2){
                    $scope.res.listFundSources[0].fundSourceMoneyStr = Math.floor($scope.moneys[0]);
                    $scope.res.listFundSources[1].fundSourceMoneyStr = Math.floor($scope.moneys[1]);
                    !$scope.moneys[0]&&(delete $scope.res.listFundSources[0].fundSourceMoneyStr);
                    !$scope.moneys[1]&&(delete $scope.res.listFundSources[1].fundSourceMoneyStr);
                    delete $scope.res.listFundSources[0].fundSourceMoney;
                    delete $scope.res.listFundSources[1].fundSourceMoney;
                }else if($scope.res.listFundSources && $scope.res.listFundSources.length==1){
                    $scope.res.listFundSources[0].fundSourceMoneyStr = $scope.moneys[0]?Math.floor($scope.moneys[0]):'';
                    delete $scope.res.listFundSources[0].fundSourceMoney;
                    !$scope.moneys[0]&&(delete $scope.res.listFundSources[0].fundSourceMoneyStr);
                }
                $scope.res.invoiceNos&&($scope.res.invoiceNos=$scope.res.invoiceNos.replace(/[\D]+/g,';'));
                $scope.res.invoiceNos&&($scope.res.invoiceNos.charAt($scope.res.invoiceNos.length-1)==';')&&($scope.res.invoiceNos=$scope.res.invoiceNos.substring(0,$scope.res.invoiceNos.length-1))
                $scope.listInvoice = $scope.res.invoiceNos?$scope.res.invoiceNos.split(';'):'';
                $scope.res.listInvoice=[];
                for (var i = 0; i < $scope.listInvoice.length; i++) {
                    $scope.res.listInvoice.push({assetsId:$scope.res.assetsId,invoiceNo:$scope.listInvoice[i]});
                };
                if($scope.res.listFundSources){
                    delete data.contractPriceStr
                }
                // !$scope.res.listFundSources&&(delete data.contractPriceStr);
                // (!$scope.res.listInvoice.length)&&(delete $scope.res.listInvoice);
                if($scope.res.listInvoice && $scope.res.listInvoice.length){
                    delete $scope.res.listInvoice
                }
                var data = {
                    "archivesCode": $scope.res.archivesCode,
                    "arrivalDate": $scope.res.arrivalDate,
                    "assetsId": $scope.res.assetsId,
                    "contractName": $scope.res.contractName,
                    "contractNo": $scope.res.contractNo,
                    "contractPrice": $scope.res.contractPrice,
                    // "fundSourcesId": $scope.res.fundSourcesId,
                    // "fundSourcesName": $scope.res.fundSourcesName,
                    // "fundSourceMoneys": $scope.res.fundSourceMoneys,
                    "contractId": $scope.res.contractId,
                    "listFundSources": $scope.res.listFundSources,
                    "listInvoice": $scope.res.listInvoice,
                    "price": $scope.res.price,
                    "purchaseDate": $scope.res.purchaseDate,
                    "purchaseTypeId": $scope.res.purchaseTypeId,
                    "splName": $scope.res.splName,
                    "startDate": $scope.res.startDate,
                    "supplierName": $scope.res.supplierName
                };

                $scope.res.arrivalDate = $scope.res.arrivalDate1?(new Date($scope.res.arrivalDate1+' 00:00:00').getTime()):null;
                $scope.res.purchaseDate = $scope.res.purchaseDate1?(new Date($scope.res.purchaseDate1+' 00:00:00').getTime()):null;
                $scope.res.startDate = $scope.res.startDate1?(new Date($scope.res.startDate1+' 00:00:00').getTime()):null;
                $scope.res.contractPriceStr = $scope.res.contractPrice1;
                $scope.res.priceStr = $scope.res.price1;

                if($scope.res.threeLevelCode && $scope.res.threeLevelCode.length!=6){
                    var msg = layer.msg('<div class="toaster"><span>三级分类代码需为6位！</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                    return;
                }

                !$scope.res.contractPrice1&&(delete data.contractPriceStr);
                !$scope.res.price1&&(delete data.priceStr);
                if(type=="submitAssets"){
                 var layerImg = "../../../res/img/wh.png";
                 var index = layer.open({
                    time: 0, //不自动关闭
                    type:1,
                    content: '<div class="pad-fifty delete-wrap"><div style="padding-bottom:20px;padding-top: 0;" class="alertImg"><img src='+layerImg+'></div>提交后不可再修改，您确定提交验收吗？</div>',
                    // content: $('#checkWinCon'),
                    title: ['提示', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    closeBtn: 1,
                    shade: 0.3,
                    shadeClose: true,
                    success: function() {
                    },
                    btn: ["确定", "取消"],
                    yes: function(index) {
                        $.ajax({
                    type: "post",
                    url: url,
                    async:false,
                    contentType: "application/json;charset=UTF-8",
                    // data: JSON.stringify(data),
                    data: JSON.stringify($scope.res),
                    complete: function(res) {
                    	
                    	
           	
                        var txt = '提交成功';
                        if(res.responseJSON.code == 200) {

                        }else{
                            txt='提交失败'
                        }
                        if(type=="save"){
                        	txt="保存成功"
                        }
                        

                        $state.go('main.tre.ytz.purchase', {id: $stateParams.id,
                            state: state,assetId:$stateParams.assetId}, {
                            reload: true
                        });
                        /*var msg = layer.msg('<div class="toaster"><span>'+txt+'</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });*/
                        $state.go('main.tre.ytz.list',{id:$stateParams.id,isOpMsg:txt,isOp:true});
                        /*$state.go('main.tre.ytz.list',{id:$stateParams.id});*/
                    }
                });
                        layer.close(index);
                    },
                    area: ['500px', '250px'],
                    btnAlign: 'r'
                });
                layer.style(index, {
                    fontSize: '16px',
                    backgroundColor: '#fff',
                });
                	
                	
                	
                	
                	
                	
                	
                }else{
                $.ajax({
                    type: "post",
                    url: url,
                    async:false,
                    contentType: "application/json;charset=UTF-8",
                    // data: JSON.stringify(data),
                    data: JSON.stringify($scope.res),
                    complete: function(res) {
                    	
                    	
                    	
                        var txt = '提交成功';
                        if(res.responseJSON.code == 200) {

                        }else{
                            txt='提交失败'
                        }
                        if(type=="save"){
                        	txt="保存成功"
                        }
                        

                        $state.go('main.tre.ytz.purchase', {id: $stateParams.id,
                            state: state,assetId:$stateParams.assetId}, {
                            reload: true
                        });
                        /*var msg = layer.msg('<div class="toaster"><span>'+txt+'</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });*/
                        $state.go('main.tre.ytz.list',{id:$stateParams.id,isOpMsg:txt,isOp:true});
                        /*$state.go('main.tre.ytz.list',{id:$stateParams.id});*/
                    }
                });
               }
                $scope.saveAssetsTitle(0);
                $scope.saveAssetsTitle(1);

                // $.ajax({
                //     type: "post",
                //     url: url2,
                //     async:false,
                //     contentType: "application/json;charset=UTF-8",
                //     data: JSON.stringify($scope.res),
                //     complete: function(res) {
                //         if(res.responseJSON.code == 200) {
                //
                //         }
                //
                //     }
                // });
            }

            $scope.calee = function() {
                var name, value;
                var str = location.href; //取得整个地址栏
                var num = str.indexOf("?")
                str = str.substr(num + 1); //取得所有参数   string var.substr(start [, length ]

                var arr = str.split("&"); //各个参数放到数组里
                for(var i = 0; i < arr.length; i++) {
                    num = arr[i].indexOf("=");
                    if(num > 0) {
                        name = arr[i].substring(0, num);
                        value = arr[i].substr(num + 1);
                        this[name] = value;
                    }

                    if($stateParams.state == 0) {
                        $scope.statusText = '暂存';
                        $scope.ulStatus = false;
                        $scope.pro1=false;
                        $scope.pro2=false;
                        $scope.pro3=false;
                    }

                    $scope.goHref = function(type) {
                        var url = '';

                        if(type == 'buy') {
                            url = 'main.tre.ytz.purchase';
                        } else if(type == 'assets') {
                            url = 'main.tre.ytz.assets';
                            $scope.res.invoiceNos = "";
                            $(".invoiceNos").each(function(index, item) {
                                var _thisVal = $(item).val();
                                if(_thisVal) {
                                    if($scope.res.invoiceNos) {
                                        $scope.res.invoiceNos += ',' + _thisVal;
                                    } else {
                                        $scope.res.invoiceNos = _thisVal;
                                    }

                                }

                            });
                            //处理资金来源
                            $scope.res.fundSourceMoneys = "";
                            $(".fond-resourse").each(function(index, item) {
                                var _thisval = $(item).val();
                                if(_thisval) {
                                    if($scope.res.fundSourceMoneys) {

                                        $scope.res.fundSourceMoneys += ',' + _thisval
                                    } else {
                                        $scope.res.fundSourceMoneys = _thisval;
                                    }
                                }

                            })
                            $scope.res.fundSourceMoneys = $scope.res.fundSourceMoneys.split(',');
                            $scope.res.invoiceNos = $scope.res.invoiceNos.split(',');
                            $localStorage.res.fundSourceMoneys = $scope.res.fundSourceMoneys;
                            $localStorage.res.invoiceNos = $scope.res.invoiceNos;

                        }
                        $state.go(url, {
                            id: $stateParams.id,
                            state: $stateParams.state,
                            currentState: $scope.currentState,
                            assetsId: $scope.assetsId,
                            IsSwitch: true
                        });
                    }

                    switch($stateParams.state) {
                        case '0':
                            $scope.statusText = '暂存';
                            $scope.ulStatus = false;
                            $scope.pro1=false;
                            $scope.pro2=false;
                            $scope.pro3=false;
                            $scope.pro4=true;
                            /*重新编辑跳转的页面*/
                            if($scope.currentState == 3) {
                                $scope.btnData = [{
                                    name: 'submit',
                                    text: '提交验收',
                                    class: 'btn-submit'
                                }, {
                                    name: 'cancel',
                                    text: '取消申请',
                                    class: 'btn-delete'
                                }];

                            }
                            break;
                        case '1':
                            $scope.statusText = '待验收';
                            $scope.ulStatus = true;
                            $scope.pro1=true;
                            $scope.pro2=false;
                            $scope.pro3=false;
                            $scope.pro4=false;
                            $scope.btnData = [{
                                name: 'pass',
                                text: '验收',
                                class: 'btn-submit'
                            }
                                // , {
                                // 	name: 'noPass',
                                // 	text: '验收不通过',
                                // 	class: 'btn-save'
                                // }
                            ];
                            // $scope.pro2 = true;
                            // $('.ytz-detail').css('padding-top', '140px');
                            break;
                        case '2':
                            $scope.statusText = '验收已通过';
                            $scope.ulStatus = true;
                            $scope.pro1=false;
                            $scope.pro2=true;
                            $scope.pro3=false;
                            $scope.pro4=false;
                            $scope.btnData = [{
                                name: 'print',
                                text: '打印验收单',
                                class: 'btn-save btn-print'
                            }];
                            $scope.pro2 = true;
                            // $('.ytz-detail').css('padding-top', '140px');
                            break;
                        case '3':
                            $scope.ulStatus = true;
                            $scope.pro1=false;
                            $scope.pro2=false;
                            $scope.pro3=true;
                            $scope.pro4=false;
                            $scope.statusText = '验收未通过';
                            $scope.btnData = [{
                                name: 'again',
                                text: "重新编辑",
                                class: 'btn-submit'
                            }, {
                                name: "cancel",
                                text: "取消申请",
                                class: "btn-save"
                            }];
                            $scope.pro3 = true;
                            // $('.ytz-detail').css('padding-top', '141px');
                            break;
                        // case '4':
                        // $('.btn-list').html('<a name="print" class="pos-fix-btn pf-btn-sub btn-hover">提醒记账</a>'+
                        // '<a name="print" class="pos-fix-btn pf-btn-save">打印出库单</a>');
                        // 	$('.pro-ul em').text('记账待通过');
                        // 	$('.pro-ul li:last-child').remove();
                        // 	break;
                        // case '5':
                        // $('.btn-list').html('');
                        // 	$('.pro-ul em').text('已出库');
                        // 	break;
                        default:
                            break;
                    }
                }

            }

            $scope.calee();

            $scope.topHeight = 0;

            $scope.proUl = function($event) {
                var liNum = 0;
                if($scope.pro1) {
                    liNum = $('#pro1 li').length;
                } else if($scope.pro2) {
                    liNum = $('#pro2 li').length;
                } else if($scope.pro3) {
                    liNum = $('#pro3 li').length;
                }

                if(this.state == '0') {
                    return;
                }
                var name = $event.target.name;
                var detailPadding = parseInt($('.ytz-detail').css('padding-top'));
                $scope.isClick = !$scope.isClick;
                if(name == 'down') {
                    $('.pro-ul').css({
                        'height': 'inherit',
                        'overflow-y': 'inherit'
                    });
                    // $('.ytz-detail').css('padding-top', detailPadding + (liNum * 28 - 28));
                } else {
                    $('.pro-ul').css({
                        'height': '28px',
                        'overflow-y': 'hidden'
                    });
                    // $('.ytz-detail').css('padding-top', detailPadding - (liNum * 28 - 28));
                }
            };

            //初始化日历
            $scope.initcalendar = function() {
                var option = {
                    format: 'YYYY-MM-DD',
                    startDate: '2017-01-01',
                    endDate: new Date("2050-01-01"),
                    maxDate: new Date("2050-01-01"),
                    timePicker: false,
                    opens: "left",
                    singleDatePicker: true
                }
                angular.element('.input-datepicker').daterangepicker($.extend({}, option, {
                    startDate: new Date()
                }), function(date, enddate, el) {
                });

            }
            $scope.$watch('res.purchaseDate1', function(newValue, oldValue, scope) {
                var option = {
                    format: 'YYYY-MM-DD',
                    startDate: new Date(newValue),
                    endDate: new Date("2050-01-01"),
                    maxDate: new Date("2050-01-01"),
                    timePicker: false,
                    opens: "top",
                    singleDatePicker: true
                }
                angular.element('.el-purchaseDate').daterangepicker($.extend({}, option, {
                    startDate: newValue?(new Date(newValue)):(new Date())
                }), function(date, enddate, el) {
                    var currentel = $(this.element).attr("name");
                    currentel == "arrivalDate1" && ($scope.res.arrivalDate1 = date.format('YYYY-MM-DD'));
                    currentel == "purchaseDate1" && ($scope.res.purchaseDate1 = date.format('YYYY-MM-DD'));
                    currentel == "startDate1" && ($scope.res.startDate1 = date.format('YYYY-MM-DD'));
                    $rootScope.$apply();
                });

            });
            $scope.$watch('res.arrivalDate1', function(newValue, oldValue, scope) {
                var option = {
                    format: 'YYYY-MM-DD',
                    startDate: new Date(newValue),
                    endDate: new Date("2050-01-01"),
                    maxDate: new Date("2050-01-01"),
                    timePicker: false,
                    opens: "top",
                    singleDatePicker: true
                }
                angular.element('.el-arrivalDate').daterangepicker($.extend({}, option, {
                    startDate: newValue?(new Date(newValue)):(new Date())
                }), function(date, enddate, el) {
                    var currentel = $(this.element).attr("name");
                    currentel == "arrivalDate1" && ($scope.res.arrivalDate1 = date.format('YYYY-MM-DD'));
                    currentel == "purchaseDate1" && ($scope.res.purchaseDate1 = date.format('YYYY-MM-DD'));
                    currentel == "startDate1" && ($scope.res.startDate1 = date.format('YYYY-MM-DD'));
                    $rootScope.$apply();
                });

            });
            $scope.$watch('res.startDate1', function(newValue, oldValue, scope) {
                var option = {
                    format: 'YYYY-MM-DD',
                    startDate: new Date(newValue),
                    endDate: new Date("2050-01-01"),
                    maxDate: new Date("2050-01-01"),
                    timePicker: false,
                    opens: "top",
                    singleDatePicker: true
                }
                angular.element('.el-startDate').daterangepicker($.extend({}, option, {
                    startDate: newValue?(new Date(newValue)):(new Date())
                }), function(date, enddate, el) {
                    var currentel = $(this.element).attr("name");
                    currentel == "arrivalDate1" && ($scope.res.arrivalDate1 = date.format('YYYY-MM-DD'));
                    currentel == "purchaseDate1" && ($scope.res.purchaseDate1 = date.format('YYYY-MM-DD'));
                    currentel == "startDate1" && ($scope.res.startDate1 = date.format('YYYY-MM-DD'));
                    $rootScope.$apply();
                });

            });

            function returnCase(ele,arr){
                for (var i = 0; i < arr.length; i++) {
                    if(arr[i].id==ele){
                        return arr[i];
                    }
                };
            }
            $scope.printIt = false;
            $scope.printscale1=false;
            $scope.printscale2=false;
            $scope.alert=function(){
                $scope.printIt = true;
                var index=layer.open({
                    time: 0 //不自动关闭
                    ,type: 1
                    ,content: $('.printthis')
                    ,title: ['打印标签','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                    ,closeBtn:1
                    ,btn:0
                    ,shade: 0.3
                    ,shadeClose: true
                    ,area: ['660px','360px'],
                    success:function () {
                        $('.print').click(function () {
                            $scope.printIt = false;
                            $('#printIt').jqprint();
                        });
                        ($('.printscale1').height()>52)&&($scope.printscale1=true);
                        ($('.printscale2').height()>52)&&($scope.printscale2=true);
                    }
                });
                layer.style(index, {
                    fontSize: '16px',
                    backgroundColor: '#fff',
                });
            }
              $scope.prnhtml='';
			  $scope.printTable=function (){
				  	$("#print-table").css('display','inline');
					var bdhtml=$("#print-table").html()
					var sprnstr="<!--startprint-->";
					var eprnstr="<!--endprint-->";
					if(bdhtml.indexOf(sprnstr)!=-1){
					  $scope.prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17);
					  $scope.prnhtml=$scope.prnhtml.substring(0,$scope.prnhtml.indexOf(eprnstr));
						
					}	
					$("#print-table").html($scope.prnhtml.trim());
					//window.print();
					$('#print-table').jqprint();
					$("#print-table").css('display','none');
			 }
            //验收预台账

            $scope.verifyAssets = function(callback) {
                $.ajax({
                    type: "get",
                    url: "/assets/preAssetsInfo/verify",
                    data: $scope.verifyinfo,
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {
                            callback && callback();
                        }

                    }
                });

            }

            $scope.toPrint = function () {
                $scope.printIt = true;
                var index=layer.open({
                    time: 0 //不自动关闭
                    ,type: 1
                    ,content: $('.printthis')
                    ,title: ['打印标签','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                    ,closeBtn:1
                    ,btn:0
                    ,shade: 0.3
                    ,shadeClose: true
                    ,area: ['645px','485px'],
                    success:function () {
                        $('.print').click(function () {
                           /* $scope.printIt = false;
                            $('#printIt').jqprint();*/
                           $scope.printTable()
                        })
                    }
                });
                layer.style(index, {
                    fontSize: '16px',
                    backgroundColor: '#fff',
                });
            }


            /*上传图片begin*/
            $scope.uploadStatus = false; //定义上传后返回的状态，成功获失败
            var uploader = $scope.uploader = new FileUploader({
                //url: "/upload/api/qiniu/index/upload", //上传图片
                url: "/api/upload",
                alias: 'files',
                queueLimit: 1, //文件个数
                withCredentials: true,
                removeAfterUpload: true, //上传后删除文件
                autoUpload: false, //是否自動上傳
                headers: {
                    "X-AEK56-Token": $localStorage["X-AEK56-Token"]
                },
                onProgress: function(res) {

                },
                onSuccess: function(res) {

                }
            });

            $scope.clearItems = function() { //重新选择文件时，清空队列，达到覆盖文件的效果
                uploader.clearQueue();
            }

            $scope.contains = function(arr, obj) {
                var i = arr.length;
                while(i--) {
                    if(arr[i] === obj) {
                        return true;
                    }
                }
                return false;
            }

            uploader.onAfterAddingFile = function(fileItem) {

                var typeArr = ['jpg', 'jpeg', 'gif', 'png', 'tiff', 'bmp'],
                    type = fileItem.file.name.split('.')[fileItem.file.name.split('.').length-1].toLocaleLowerCase();
                if(!$scope.contains(typeArr, type)) {
                    // alert('选择文件格式有误，请重新选择！');
                    var msg = layer.msg('<div class="toaster"><span>选择文件格式有误，请重新选择！</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                    return;
                }

                var size = fileItem.file.size / (1024 * 1024);
                if(size>3){
                    // alert('选择文件过大，请重新选择！');
                    var msg = layer.msg('<div class="toaster"><span>选择文件过大，请重新选择！</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                    return;
                }

                $scope.fileItem = fileItem._file; //添加文件之后，把文件信息赋给scope
                uploader.uploadAll();
            };
            uploader.onProgressItem = function(progress) {

            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                $scope.uploadStatus = true; //上传成功则把状态改为true
                // $scope.assetsDetailInfo.assetsImg = 'http://'+window.location.host + '/api/file' + response.data[0];
                $scope.res.assetsImg = response.data[0];
                $scope.isfileUploaded=true;
            };

            var handleFileSelect = function(evt) {
                var file = evt.currentTarget.files[0];
                if(!/image\/\w+/.test(file.type)) {
                    return false;
                }
                $scope.uploadfile();

            };
            angular.element(document.querySelector('#deviceImgFile')).on('change', handleFileSelect);

            $scope.uploadfile = function() {
                uploader.uploadAll();
            }
            /*上传图片end*/

            //取消编辑预台账
            $scope.cancelAgain = function () {
                $state.go('main.tre.ytz.purchase', {
                    id:$stateParams.id,
                    state: 3, //暂时为暂存
                    assetsId: $scope.assetsId,
                    currentState: ''
                });
            }

            //重新编辑预台账
            $scope.againAssets = function () {

                $state.go('main.tre.ytz.purchase', {
                    id:$stateParams.id,
                    state: 3, //暂时为暂存
                    assetsId: $scope.assetsId,
                    currentState: 3
                });

                // var layerImg = "../../../res/img/wh.png";
                // var index = layer.open({
                //     time: 0, //不自动关闭
                //     type:1,
                //     content: '<div class="pad-fifty delete-wrap"><div style="padding-bottom:20px;padding-top: 0;" class="alertImg"><img src='+layerImg+'></div>是否重新编辑？</div>',
                //     // content: $('#checkWinCon'),
                //     title: ['提示', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                //     closeBtn: 1,
                //     shade: 0.3,
                //     shadeClose: true,
                //     success: function() {
                //     },
                //     btn: ["确定", "取消"],
                //     yes: function(index) {
                //         $.ajax({
                //             type:'get',
                //             url:'/assets/preAssetsInfo/reEdit',
                //             data: {
                //                 id: $stateParams.assetId
                //             },
                //             complete: function(res) {
                //                 if(res.responseJSON.code == 200) {
                //                     $state.go('main.tre.ytz.purchase', {
                //                         id:$stateParams.id,
                //                         state: 0, //暂时为暂存
                //                         assetsId: $scope.assetsId,
                //                         currentState: 3
                //                     });
                //                 }
                //
                //             }
                //         })
                //     },
                //     area: ['500px', '250px'],
                //     btnAlign: 'r'
                // });
                // layer.style(index, {
                //     fontSize: '16px',
                //     backgroundColor: '#fff',
                // });
            }

            //删除预台账
            $scope.delAssets = function(type){
                var msg = '是否撤销申请';
                if(type){
                    msg = '是否撤销申请';
                }
                var layerImg = "../../../res/img/wh.png";

                var index = layer.open({
                    time: 0, //不自动关闭
                    type:1,
                    content: '<div class="pad-fifty delete-wrap"><div style="padding-bottom:20px;padding-top: 0;" class="alertImg"><img src='+layerImg+'></div>'+msg+'</div>',
                    // content: $('#checkWinCon'),
                    title: ['提示', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    closeBtn: 1,
                    shade: 0.3,
                    shadeClose: true,
                    success: function() {
                    },
                    btn: ["确定", "取消"],
                    yes: function(index) {
                        $.ajax({
                            type: "get",
                            url: "/assets/preAssetsInfo/delAssets",
                            data: {
                                id: $scope.assetsId
                            },
                            complete: function(res) {
                                if(res.responseJSON.code == 200) {
                                    /*var msg = layer.msg('<div class="toaster"><i></i><span>撤销成功</span></div>', {
                                        area: ['100%', '60px'],
                                        time: 3000,
                                        offset: 'b',
                                        shadeClose: true,
                                        shade: 0
                                    });*/
                                }
                                $state.go('main.tre.ytz.list',{id:$stateParams.id,isOpMsg:"撤销成功",isOp:true});
                                /*$state.go('main.tre.ytz.list',{id:$stateParams.id});*/
                            }
                        });
                        layer.close(index);
                    },
                    area: ['500px', '250px'],
                    btnAlign: 'r'
                });
                layer.style(index, {
                    fontSize: '16px',
                    backgroundColor: '#fff',
                });
            }

            // 编辑提交title
            $scope.assetsNameTipShow=false;
            $scope.factoryNameTipShow=false;
            $scope.assetsNameFocus=false;
            $scope.factoryNameFocus=false;
            $scope.setInputFocus = function(a){
                $scope[a]=true;
            }
            $scope.assetsTilteHover=function(a,b){
                $scope[a]=true;
                $scope[b]=true;
            }
            $scope.assetsTilteLeave=function(a,b){
                $scope[a]=false;
                !b&&($scope.assetsNameEdit = false);
                b&&($scope.factoryNameEdit = false);
                if($scope.factoryNameFocus){
                    $scope.factoryNameEdit = true;
                }
                if($scope.assetsNameFocus){
                    $scope.assetsNameEdit = true;
                }
            }
            $scope.assetsNameEdit = false;
            $scope.factoryNameEdit = false;
            $scope.editAssetsTitle=function(a){
                !a&&($scope.assetsNameEdit = true);
                a&&($scope.factoryNameEdit = true);
            }
            $scope.saveAssetsTitleLocal=function(a){
                if(a){
                    !$scope.factoryName&&($scope.factoryName=$scope.res.factoryName);
                    $scope.res.factoryName=$scope.factoryName;
                    $scope.factoryNameFocus=false;
                    $scope.factoryNameEdit=false;
                }else{
                    !$scope.assetsName&&($scope.assetsName=$scope.res.assetsName);
                    $scope.res.assetsName=$scope.assetsName;
                    $scope.assetsNameFocus=false;
                    $scope.assetsNameEdit=false;
                }
            }
            $scope.saveAssetsTitle=function(a){
                var data = {
                    assetssId: $stateParams.assetId
                };
                var url;
                if(a){
                    data.factoryName=$scope.factoryName;
                    url='/assets/assetsInfo/updateFactoryName';
                    $scope.factoryNameFocus=false;
                    $scope.factoryNameEdit=false;
                }else{
                    data.assetsName=$scope.assetsName;
                    url='/assets/assetsInfo/updateAssetsName';
                    $scope.assetsNameFocus=false;
                    $scope.assetsNameEdit=false;
                }
                // !a&&(data.assetsName=$scope.assetsName)&&(url='/assets/assetsInfo/updateAssetsName')&&($scope.assetsNameFocus=false)&&($scope.assetsNameEdit=false);
                // a&&(data.factoryName=$scope.factoryName)&&(url='/assets/assetsInfo/updateFactoryName')&&($scope.factoryNameFocus=false)&&($scope.factoryNameEdit=false);
                $.ajax({
                    type: "post",
                    url: url,
                    data: JSON.stringify(data),
                    contentType: "application/json;charset=UTF-8",
                    complete: function(res) {
                        if(res.responseJSON.code==200){
                            $scope.res.assetsName = $scope.assetsName;
                            $scope.res.factoryName = $scope.factoryName;
                        }else{
                            $scope.assetsName = $scope.res.assetsName;
                            $scope.factoryName = $scope.res.factoryName;
                        }
                        $rootScope.$apply();
                    }
                });
            }

            //处理预台账 更改状态
            $scope.handleAssets = function(params, callback) {
                $scope.verifyAssets(callback);
            }

            // 初始化页面
            $scope.activate = function() {
                $('.pro-ul').css({
                    'height': '28px',
                    'overflow-y': 'hidden'
                })
            }

            $scope.activate();

            // 操作记录
            $scope.getOperateList=function(){
                $.ajax({
                    type: "get",
                    url: "/assets/preAssetsInfo/getOperateByid",
                    data: {
                        id: $stateParams.assetId || ''
                    },
                    complete: function(res) {
                        if(res.responseJSON.code==200){
                            $scope.operateList=res.responseJSON.data;
                        }else{

                        }
                    }
                });
            }
            $scope.getOperateList();
            //查看验收详情
            $scope.getCheckInfo = function(a) {
                var index = layer.open({
                    time: 0,
                    content: '<div class="pad-fifty pass-wrap "><div><label>验收日期:</label><span  class="verifydata">' +$filter('date')(a.operateDate,'yyyy-MM-dd') + ' <span></div><div><label>验收说明:</label><p  class="verifycontent">' + (a.operateRemark || '验收没有说明') + '</p></div></div>',
                    title: ['提示', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    closeBtn: 1,
                    autoHeight: true,
                    shade: 0.3,
                    shadeClose: true,
                    area: '500px',
                    btnAlign: 'r'
                });

            }


            $scope.radioV = 2;
            $scope.verifyFn = function () {
                $scope.checkWin = true;
                $scope.checkDate = moment().format('YYYY-MM-DD');

                var index = layer.open({
                    time: 0, //不自动关闭
                    type:1,
                    content: $('#checkWinCon'),
                    // content: $('#checkWinCon'),
                    title: ['提示', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    closeBtn: 1,
                    id:'pass',
                    shade: 0.3,
                    shadeClose: true,
                    success: function() {


                            angular.element(".verifydata").daterangepicker({
                                format: 'YYYY-MM-DD',
                                startDate: new Date(),
                                endDate: new Date(),
                                maxDate: new Date(),
                                timePicker: false,
                                opens: "top",
                                singleDatePicker: true
                            });
                        $scope.verifyConNum = 0;
                        $scope.verifycontent = '';

                        $scope.verifyConChange = function () {
                            if($scope.verifycontent.length<=300){
                                $scope.verifyConNum = $scope.verifycontent.length;
                            }else{
                                return;
                            }
                        }


                    },
                    btn: ["确定", "取消"],
                    yes: function(index) {
                        layer.close(index);

                        /*验收信息*/
                        $scope.verifyinfo = {
                            id: $scope.assetsId,
                            verifyDate: Date.parse(new Date($(".verifydata").val())),
                            verifyRemark: $(".verifycontent").val(),
                            // verifyStatus: type == 'pass' ? 2 : 3
                            verifyStatus: $scope.radioV
                        }

                        /*处理预台账、更改状态*/
                        $scope.handleAssets({
                            type: 'pass'
                        }, function() {
                            /*var msg = layer.msg('<div class="toaster"><i></i><span>操作成功！</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0
                            });*/
                            $state.go('main.tre.ytz.list',{id:$stateParams.id,isOpMsg:"操作成功",isOp:true});
                            /*$state.go('main.tre.ytz.list',{id:$stateParams.id});*/
                        });
                    },
                    area: ['500px', '560px'],
                    btnAlign: 'r'
                });
                layer.style(index, {
                    fontSize: '16px',
                    backgroundColor: '#fff',
                });
            }

        }]);
