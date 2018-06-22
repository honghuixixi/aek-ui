'use strict';

angular.module('app')
    .controller('trePurchaseController', ['$scope', '$rootScope', '$state', '$timeout', '$localStorage', '$stateParams', 'FileUploader', 'printCodeService',
        function($scope, $rootScope, $state, $timeout, $localStorage, $stateParams, FileUploader, printCodeService) {
            $rootScope.currentmodule='资产台账';
            //底部高度设置，使其占满剩余全部
            $scope.resetBottomHeight = function () {
                var clientHeight = angular.element('.app-content-body').height();
                angular.element('.panel-default').css('min-height',clientHeight-70-angular.element('.ytz-con').height());
            }
            $scope.resetBottomHeight();
            $rootScope.membernav=false;
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

                        $scope.applyDeptName=$scope.res.applyDeptName;
                        $scope.acceptanceDeptName=$scope.res.acceptanceDeptName;

                        for (var i = 0; i < $scope.res.tenderAnnexList.length; i++) {
                            $scope.res.tenderAnnexList[i].imgUrlEn = encodeURI(encodeURI($scope.res.tenderAnnexList[i].uploadUrl));
                        };
                        for (var i = 0; i < $scope.res.acceptanceAnnexList.length; i++) {
                            $scope.res.acceptanceAnnexList[i].imgUrlEn = encodeURI(encodeURI($scope.res.acceptanceAnnexList[i].uploadUrl));
                        };

                        $scope.res.winTenderDate1=$scope.res.winTenderDate?$scope.dateToTime($scope.res.winTenderDate):'';
                        $scope.res.acceptanceDate1=$scope.res.acceptanceDate?$scope.dateToTime($scope.res.acceptanceDate):'';
                        $scope.res.arrivalDate1=$scope.res.arrivalDate?($scope.dateToTime($scope.res.arrivalDate)):'';
                        $scope.res.applyDate1=$scope.res.applyDate?($scope.dateToTime($scope.res.applyDate)):'';
                        $scope.res.proofDate1=$scope.res.proofDate?($scope.dateToTime($scope.res.proofDate)):'';
                        $scope.res.expectDate1=$scope.res.expectDate?($scope.dateToTime($scope.res.expectDate)):'';

                        $scope.res.price1 = $scope.res.priceStr?$scope.res.priceStr.slice(1).split(',').join(''):'';
                        $scope.res.contractPrice1 = $scope.res.contractPriceStr?$scope.res.contractPriceStr.slice(1).split(',').join(''):'';
                        $scope.res.singleBudget1 = $scope.res.singleBudgetStr?$scope.res.singleBudgetStr.slice(1).split(',').join(''):'';
                        $scope.initcalendar($scope.res.winTenderDate,'','.el-winTenderDate','','winTenderDate1');
                        $scope.initcalendar($scope.res.acceptanceDate,'','.el-acceptanceDate','','acceptanceDate1');
                        $scope.initcalendar($scope.res.arrivalDate,'','.el-arrivalDate','','arrivalDate1');
                        $scope.initcalendar($scope.res.applyDate,'','.el-applyDate','','applyDate1');
                        $scope.initcalendar($scope.res.proofDate,'','.el-proofDate','','proofDate1');
                        $scope.initcalendar($scope.res.expectDate,'','.el-expectDate','','expectDate1');

                        if($scope.res.listFundSources.length){
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
                        $scope.res.applyType&&($scope.applyType = $scope.applyTypeList[$scope.res.applyType-1]);
                        $scope.res.purchaseWay&&($scope.purchaseWay = $scope.purchaseWayList[$scope.res.purchaseWay-1]);
                        $scope.res.tenderForm&&($scope.tenderForm = $scope.tenderFormList[$scope.res.tenderForm-1]);
                        $scope.res.invoiceNos&&($scope.res.invoiceNos=$scope.res.invoiceNos.split(',').join(';'));
                        if($scope.res.listInvoice.length){
                            $scope.res.invoiceNo = '';
                            for (var i = $scope.res.listInvoice.length - 1; i >= 0; i--) {
                                $scope.res.invoiceNo=$scope.res.listInvoice[i].invoiceNo;
                            };
                        }
                        (!$scope.res.listInvoice.length)&&($scope.res.listInvoice.push({assetsId:$scope.res.assetsId,invoiceNo:null}));
                    }else{
                        $scope.res={};
                    }
                    $('#detailUploadImg').on('change',function(){$scope.assetimginputchange()});
                    $rootScope.$apply();
                }
            });
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
        $scope.replaceImg=function(){
             var _type = $('#detailUploadImg')[0].files[0].type
                var _size = $('#detailUploadImg')[0].files[0].size/(1024*1024)
                var msg;
                if(_size>2){
                    return msg = layer.msg('<div class="toaster"><span>' + '图片大于2M，上传失败' + '</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                }
                if(_type!='image/png'&&_type!='image/jpg'&&_type!='image/jpeg'){
                    return msg = layer.msg('<div class="toaster"><span>' + '图片格式错误，上传失败' + '</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                   $("#detailUploadImg").val('');   
                    
                }
                if(_type=='image/png'||_type=='image/jpg'||_type=='image/jpeg'){
                    if(_size<=2) {
                        $scope.repairUploadImg($('#detailUploadImg')[0].files[0])
                    }
                }       
        }
        $scope.repairUploadImg=function(a,b){
            $scope.imgLoading = true;
            var formData = new FormData();
            formData.append("files", a);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'api/upload');
            // xhr.setRequestHeader("X-AEK56-Token", $localStorage["X-AEK56-Token"]);
            xhr.send(formData);
            xhr.onreadystatechange = function () {
                var res = xhr.response;
                $scope.imgLoading = false;
                var resmsg = '网络故障，图片上传失败，请重试';
                if(xhr.readyState == 4){
                    if(JSON.parse(res).code == '200'){
                        resmsg='图片上传成功';
                        $scope.res.assetsImg=JSON.parse(res).data[0];
                        $('#assetDetailImg').attr('src','/api/file'+$scope.res.assetsImg)
                    }else{
                        $('#assetDetailImg').attr('src','../../res/img/tjtp.png');
                    }
                    var msg = layer.msg('<div class="toaster"><span>' + resmsg + '</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                }
            }
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
        $scope.assetimginputchange=function(){
            $scope.replaceImg();
            $scope.res.assetsImg&&$('#assetDetailImg').attr('src','/api/file'+$scope.res.assetsImg);
        }
        $scope.assetdetailimgchange=function(){
            $('#detailUploadImg').trigger("click");
        }
        $scope.assetdetailimgdel=function(){
            $scope.res.assetsImg='';
        }
        $scope.assetImgI = function(){
            if($scope.state!=0) return;
            $scope.assetImgOperate=true;
            (!$scope.res.assetsImg)&&$('#assetDetailImg').attr('src','../../res/img/tjzpdj.png');
        }
        $scope.assetImgO = function(){
            if($scope.state!=0) return;
            $scope.assetImgOperate=false;
            (!$scope.res.assetsImg)&&$('#assetDetailImg').attr('src','../../res/img/tjtp.png');
        }
                
            function showKeyPress(evt) {  
             evt = (evt) ? evt : window.event  
             return checkSpecificKey(evt.keyCode);  
            }  
              
            function checkSpecificKey(keyCode) {  
                var specialKey = "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘’";//Specific Key list  
                var realkey = String.fromCharCode(keyCode);  
                var flg = false;  
             flg = (specialKey.indexOf(realkey) >= 0);  
              if (flg) {  
                   // alert('请勿输入特殊字符: ' + realkey);  
                    return false;  
                }  
                return true;  
            }

            $scope.state = $stateParams.state;

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
            /*上传图片begin*/
            $scope.uploadStatus = false; //定义上传后返回的状态，成功获失败
            var uploader = $scope.uploader = new FileUploader({
                //url: "/upload/api/qiniu/index/upload", //上传图片
                url: "/api/upload",
                alias: 'files',
                queueLimit: 1, //文件个数 
                withCredentials: true,
                removeAfterUpload: true, //上传后删除文件
                autoUpload: true, //是否自動上傳
                headers: {
                    "X-AEK56-Token": $localStorage["X-AEK56-Token"]
                },
                filters: [{
                    name: 'image',
                    fn: function(a){
                        return /image\/\w+/.test(a.type);
                    }
                },{
                    name: 'size',
                    fn: function(a){
                        var size = a.size / (1024 * 1024);
                        return size<2;
                    }
                }],
                onProgress: function(res) {

                },
                onSuccess: function(res) {
                }
            });

            $scope.clearItems = function() { //重新选择文件时，清空队列，达到覆盖文件的效果
                uploader.clearQueue();
            }

            uploader.onAfterAddingFile = function(fileItem) {
                $scope.fileItem = fileItem._file; //添加文件之后，把文件信息赋给scope
            };
            uploader.onProgressItem = function(progress) {

            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                $scope.uploadStatus = true; //上传成功则把状态改为true
                // $scope.res.assetsImg = 'http://'+window.location.host + '/api/file' + response.data[0];
                $scope.res.assetsImg = response.data[0];
                $scope.isfileUploaded=true;
            };

            var handleFileSelect = function(evt) {
                var file = evt.currentTarget.files[0];
                if(file&&!/image\/\w+/.test(file.type)) {
                    return false;
                }
                $scope.uploadfile();

            };

            $scope.uploadfile = function() {
                    uploader.uploadAll();
                }
                /*上传图片end*/

            // 下拉菜单
            $scope.needOverlay = false;

            $scope.fundSourceMoney = null;
            $scope.fundSourceMoneys = [];
            $scope.fundSourcesListShow = false;
            $scope.purchaseTypeListShow = false;
            $scope.tenderFormListShow = false;
            $scope.purchaseWayListShow = false;
            $scope.applyTypeListShow = false;

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
                if($scope.moneys.length==2&&c.codeValue==4||$scope.res.listFundSources.length==1&&c.codeValue==$scope.res.listFundSources[0].fundSourcesId){
                    return;
                }
                d&&(c.codeValue!=4)&&($scope.res.listFundSources=[{"assetsId": $scope.res.assetsId,
                    "fundSourceMoney": $scope.res.fundSourceMoneys,
                    "fundSourceMoneyStr": '',
                    "fundSourcesId": c.codeValue,
                    "fundSourcesText": c.codeText,
                    "id": $scope.res.listFundSources.length?$scope.res.listFundSources[0].id:null}])&&($scope.moneys=[null]);
                d&&(c.codeValue==4)&&($scope.res.listFundSources=[{"assetsId": $scope.res.assetsId,
                    "fundSourceMoney": $scope.res.fundSourceMoneys,
                    "fundSourceMoneyStr": '',
                    "fundSourcesId": 1,
                    "fundSourcesText": '财政资金',
                    "id": $scope.res.listFundSources.length?$scope.res.listFundSources[0].id:null}
                    ,{"assetsId": $scope.res.assetsId,
                    "fundSourceMoneyStr": '',
                    "fundSourceMoney": $scope.res.fundSourceMoneys,
                    "fundSourcesId": 2,
                    "fundSourcesText": '自筹资金',
                    "id": $scope.res.listFundSources.length?($scope.res.listFundSources.length==2?$scope.res.listFundSources[1].id:null):null}])&&($scope.moneys=[null,null]);
                
            }
            //关闭所有的弹出框
            $scope.closeAll = function() {
                $scope.needOverlay = false;
                $scope.keyword&&($scope.keyword.nameSearch = '');
                $scope.depetshow = false;
                $scope.depetshow2 = false;

                $scope.applyTypeListShow = false;
                $scope.fundSourcesListShow = false;
                $scope.purchaseTypeListShow = false;
                $scope.tenderFormListShow = false;
                $scope.purchaseWayListShow = false;
            }
            // 字节限制
            $scope.limitLengths=function(a,b){
                $scope.deleteSpace(a,b,$scope.res);
                $scope.lengthSubstring(a,b,$scope.res);
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
                        angular.element(document.querySelector('#detailUploadImg')).on('change', handleFileSelect);
                    }
                });
            }
            $scope.getAllList();
            // 采购方式 招标形式 下拉列表
            $scope.applyTypeList=[{
                id: 1,
                name: '新增'
            },{
                id: 2,
                name: '添置'
            },{
                id: 3,
                name: '报废更新'
            }];
            $scope.applyType={id:null,name:'请选择'};
            $scope.purchaseWayList = [{
                id: 1,
                name: '国际招标'
            },{
                id: 2,
                name: '政府采购'
            },{
                id: 3,
                name: '院内采购'
            },{
                id: 4,
                name: '分散采购'
            },{
                id: 5,
                name: '自行采购'
            },{
                id: 6,
                name: '其它'
            }];
            $scope.purchaseWay={id:null,name:'请选择'};
            $scope.tenderFormList = [{
                id: 1,
                name: '公开招标'
            },{
                id: 2,
                name: '邀请招标'
            },{
                id: 3,
                name: '竞争性谈判'
            },{
                id: 4,
                name: '单一来源采购'
            },{
                id: 5,
                name: '询价采购'
            },{
                id: 6,
                name: '其它'
            }];
            $scope.tenderForm={id:null,name:'请选择'};
            //编辑台账
            $scope.saveAssets = function() {
                // 模板类型的分类
                if($scope.res.listFundSources.length==2){
                    $scope.res.listFundSources[0].fundSourceMoneyStr = Math.floor($scope.moneys[0]);
                    $scope.res.listFundSources[1].fundSourceMoneyStr = Math.floor($scope.moneys[1]);
                    !$scope.moneys[0]&&(delete $scope.res.listFundSources[0].fundSourceMoneyStr);
                    !$scope.moneys[1]&&(delete $scope.res.listFundSources[1].fundSourceMoneyStr);
                    delete $scope.res.listFundSources[0].fundSourceMoney;
                    delete $scope.res.listFundSources[1].fundSourceMoney;
                }else if($scope.res.listFundSources.length==1){
                    $scope.res.listFundSources[0].fundSourceMoneyStr = $scope.moneys[0]?Math.floor($scope.moneys[0]):'';
                    delete $scope.res.listFundSources[0].fundSourceMoney;
                    !$scope.moneys[0]&&(delete $scope.res.listFundSources[0].fundSourceMoneyStr);
                }

                !$scope.res.acceptancePersonName&&($scope.res.acceptancePersonName=null);
                $scope.res.acceptanceDeptName = $scope.acceptanceDeptName;
                $scope.res.applyDeptName = $scope.applyDeptName;
                $scope.res.winTenderDate = $scope.res.winTenderDate1?(new Date($scope.res.winTenderDate1).getTime()):null;
                $scope.res.acceptanceDate = $scope.res.acceptanceDate1?(new Date($scope.res.acceptanceDate1).getTime()):null;
                $scope.res.arrivalDate = $scope.res.arrivalDate1?(new Date($scope.res.arrivalDate1).getTime()):null;
                $scope.res.applyDate = $scope.res.applyDate1?(new Date($scope.res.applyDate1).getTime()):null;
                $scope.res.proofDate = $scope.res.proofDate1?(new Date($scope.res.proofDate1).getTime()):null;
                $scope.res.expectDate = $scope.res.expectDate1?(new Date($scope.res.expectDate1).getTime()):null;
                $scope.res.contractPriceStr = $scope.res.contractPrice1;
                $scope.res.priceStr = $scope.res.price1;
                $scope.res.singleBudgetStr = $scope.res.singleBudget1;

                $scope.res.tenderAnnex =$scope.res.tenderAnnexList;
                $scope.res.acceptanceAnnex =$scope.res.acceptanceAnnexList;

                $scope.res.purchaseWay = $scope.purchaseWay.id;
                $scope.res.tenderForm = $scope.tenderForm.id;
                $scope.res.applyType = $scope.applyType.id;

                !$scope.res.contractPrice1&&(delete $scope.res.contractPriceStr);
                !$scope.res.price1&&(delete $scope.res.priceStr);
                $scope.res.moduleType = 2
                console.log($scope.res.moduleType)
                $.ajax({
                    type: "post",
                    url: "/assets/assetsInfo/editAssets",
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify($scope.res),
                    complete: function(res) {
                        var txt = '保存成功';
                        if(res.responseJSON.code == 200) {
                        }else{
                            txt='保存失败'
                        }
                        $state.go('main.tre.zctz.purchase', {id: $stateParams.id,
                            state: 1,assetId:$stateParams.assetId}, {
                            reload: true
                        });
                        var msg = layer.msg('<div class="toaster"><span>'+txt+'</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                });
                $scope.saveAssetsTitle(0);
                $scope.saveAssetsTitle(1);
            }

            //初始化日历
            $scope.initcalendar = function(start,min,ele,max,para) {
                var option = {
                    format: 'YYYY-MM-DD',
                    startDate: new Date(),
                    timePicker:false,
                    maxDate: new Date("2050-01-01"),
                    timePicker12Hour:false,
                    opens: "top",
                    singleDatePicker: true
                }
                var obj = {};
                start&&(obj.startDate=new Date(start));
                min&&(obj.minDate=new Date(min));
                max&&(obj.maxDate=new Date(max));
                angular.element(ele).daterangepicker($.extend({}, option, obj), function(){});
                $(ele).on('apply.daterangepicker', function(a,b) {
                    $scope.res[para] = b.startDate.format('YYYY-MM-DD');
                    $scope.$apply();
                });
            }

            function returnCase(ele,arr){
                for (var i = 0; i < arr.length; i++) {
                    if(arr[i].id==ele){
                        return arr[i];
                    }
                };
            }
            $scope.printscale1=false;
            $scope.printscale2=false;
            $scope.printIt = false;
            $scope.alert=function(){
                // $scope.printIt = true;
                // var index=layer.open({
                //     time: 0 //不自动关闭
                //     ,type: 1
                //     ,content: $('.printthis')
                //     ,title: ['打印标签','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                //     ,closeBtn:1
                //     ,btn:0
                //     ,shade: 0.3
                //     ,shadeClose: true
                //     ,area: ['645px','485px'],
                //     success:function () {
                //         $('.print').click(function () {
                //             /*$scope.printIt = false;
                //             $('#printIt').jqprint();*/
                //            $scope.printTable()
                //         });
                //         ($('.printscale1').height()>52)&&($scope.printscale1=true);
                //         ($('.printscale2').height()>52)&&($scope.printscale2=true);
                //     }
                // });
                // layer.style(index, {
                //     fontSize: '16px',
                //     backgroundColor: '#fff',
                // });
                // console.log($scope.res);
                printCodeService.print($scope.res.assetsId);
            }
            /*部门、科室搜索*/
            $scope.showdeptList = function(dept) {
                    if(dept == 1) {
                        $scope.depetshow = true;
                    } else if(dept == 2) {
                        $scope.depetshow2 = true;
                    } else if(dept == 3) {
                        $scope.depetshow3 = true;
                    }
                    $scope.devshow = true;
                    $scope.needOverlay = true;
                    $scope.deptList = [];
                }

                //获取科室名称
        $scope.searchList = function() {
            $.ajax({
                type: "get",
                url: "/sys/dept/search/tenant/" + ($stateParams.id || $localStorage.userInfo.tenantId),
                data: {
                    keyword: $scope.keyword.nameSearch
                },
                complete: function(res) {
                    if(res.responseJSON.code == 200) {
                        $scope.deptList = res.responseJSON.data;
                        $rootScope.$apply();
                    }
                }
            });
        }

                //设置科室名称
            $scope.setDeptValue = function(id, name, curDept) {
                if(curDept == 1) {
                    $scope.applyDeptName = name;
                    $scope.res.applyDeptId = id;
                    $scope.depetshow = false;
                } else if(curDept == 2) {
                    $scope.acceptanceDeptName = name;
                    // $scope.res.deptId = id;
                    $scope.depetshow2 = false;
                } else if(curDept == 3) {
                    $scope.manageDepName = name;
                    $scope.res.manageDeptId = id;
                    $scope.depetshow3 = false;
                }
                $scope.keyword.nameSearch='';
                $scope.deptList = [];

                $scope.devshow = false;
                $scope.needOverlay = false;
            }
        }]);