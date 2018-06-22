'use strict';

angular.module('app')
    .controller('trerepairController', ['$scope', '$rootScope', '$state', '$timeout', '$localStorage', '$stateParams', 'FileUploader',
        function($scope, $rootScope, $state, $timeout, $localStorage, $stateParams, FileUploader) {
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
            // 上传图片
            // $scope.detailAssetsImg=function(){
            //     console.log(angular.element('#detailUploadImg')[0].files[0])
            //     var name = this.files[0].name.split('.')
            //     var campare = name[name.length - 1]
            //     var size = this.files[0].size / (1024 * 1024)
            //     $('.inputName').val(this.files[0].name);
            //     if((campare == 'xlsx' || campare == 'xls' || campare == 'csv') && size <= 4) {
            //         $scope.canntImport = false;
            //     } else {
            //         $scope.canntImport = true;
            //     }
            // }
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
            $scope.searchCon='';
            $scope.searchOne={id:'',txt:'全部类型'};
            $scope.searchOnel=[{id:'',txt:'全部类型'},{id:1,txt:'自主维修'},{id:2,txt:'外修'},{id:3,txt:'现场解决'}];
            $scope.searchRepair=function(type,page,pagesize){
                var data = {
                    "assetsId": $stateParams.assetId,
                    "pageNo": page||1,
                    "pageSize": pagesize||8,
                    "applyNo": $scope.searchCon,
                    "modeStatus": type||$scope.searchOne.id,
                };
                $scope.nocontent=false;
                !data.applyNo&&(delete data.applyNo);
                !data.modeStatus&&(delete data.modeStatus);
                $.ajax({
                    type: "get",
                    url: "/newrepair/repRepairApply/repairRecord",
                    data: data,
                    complete: function(res) {
                        if(res.responseJSON.code==200){
                            $scope.pageInfo=res.responseJSON.data;
                            $scope.pageInfo.pstyle = 2;
                            $scope.trData=res.responseJSON.data.records;
                            !$scope.trData.length&&($scope.nocontent=true);
                        }else{
                            $scope.nocontent=true;
                        }
                        $rootScope.$apply();
                    }
                });
            }
            $scope.limitKeyWord=function(a,b){
                $scope[a]=$scope[a].substring(0,b);
            }
            $scope.searchRepair('',1,8);
            $scope.pagination = function(page, pagesize) {
                $scope.searchRepair("",page,pagesize);
            }
            // 点击子菜单
			$scope.click1 = function(a) {
				$scope.devshow1 = false;
				$scope.devshow = false;
				$scope.searchOne = a;
				$scope.searchRepair(a.id);
			}
			// 获得焦点显示
			$scope.devshow1 = false;
			$scope.focus1 = function() {
				if($scope.devshow) {
					return $scope.hideAll();
				}
				$scope.devshow = true;
				$scope.devshow1 = true;
			}
			$scope.devshow = false;
			$scope.hideAll = function() {
				$scope.devshow = false;
				$scope.devshow1 = false;
			}
            $scope.usualLayerClose=function(){
                layer.closeAll();
            }
            // print
            $scope.usualRepairPrint=function(a){
                layer.closeAll();
                $scope.$apply();
                var dom = $('#fy_repairReportBillCon');
                dom.jqprint();
                $scope.repairReportInfo.reportPrint = true;
                setTimeout(function(){
                    dom.jqprint();
                    $scope.repairReportInfo.reportPrint = false;
                },100);
            }
            // 维修报告单
            $rootScope.radio={};
            $rootScope.radio.radioV=3;
            // repair err sort 
            $rootScope.radio.radioS=1;
            $scope.repairObj={};
            $scope.repairObj.remark='';
            $scope.listToObj=function(a){
                var arr=[];
                if(!a){
                    return arr;
                }
                for (var i=0; i<a.length; i++) {
                    arr.push({name:a[i]});
                };
                return arr;
            }
            $scope.repairDate1 = 0;
            $scope.repairDate2 = 0;
            $scope.repairTime = {day:0,hour:0};
            // 真实时间
            $scope.repairTrue1 = 0;
            $scope.repairTrue2 = 0;
            $scope.repairTrue = {day:0,hour:0};
            $scope.repairWaitTime={
                day: 0,
                hour: 0
            };
            $scope.arrToString1=function(a){
                var str='';
                for (var i=0;i<$scope[a].length;i++) {
                    str+=$scope[a][i].name;
                    str+='，';
                }
                return str.substr(0,str.length-1);
            }
            $scope.repairResultSwitch=function(){
                switch ($scope.radio.repairResultR){
                    case 1:
                        return '正常工作';
                        break;
                    case 2:
                        return '基本功能正常';
                        break;
                    case 3:
                        return '需进一步修理';
                        break;
                    case 4:
                        return '需外送修理';
                        break;
                    case 5:
                        return '无法修复';
                        break;
                    case 6:
                        return '其他';
                        break;
                    default:
                        break;
                }
            }
            $scope.hrefTo=function(a){
                $.ajax({
                    type: "get",
                    url: "/newrepair/repRepairApply/search/"+ a.applyId,
                    complete: function (res) {
                        if (res.responseJSON.code == 200) {
                            $scope.assetsInfo = res.responseJSON.data;
                        }else{
                            var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0
                            });
                        }
                    }
                });
                $.ajax({
                    type: "get",
                    url: "/newrepair/repRepairReport/search/"+a.applyId,
                    complete: function(res){
                        if(res.responseJSON.code==200){
                            var result=res.responseJSON.data;
                            if(!result){
                                return;
                            }
                            $rootScope.radio.radioV=result.modeStatus;
                            $scope.repairDate=result.repairDate;
                            $timeout(function(){
                                $scope.repairObj.remark=result.remarks;
                                if($rootScope.radio.radioV==3){
                                    $scope.repairReportInfo = $.extend({
                                        repairList:$scope.assetsInfo,
                                        // addphenom: $scope.addphenom.length?$scope.arrToString1('addphenom'):'',
                                        // addReason: $scope.addReason.length?$scope.arrToString1('addReason'):'',
                                        partListHad: $scope.partListHad,
                                        printPower: true,
                                        reportStatus: $scope.assetsInfo.reportStatus,
                                        // addWork: $scope.addWork.length?$scope.arrToString1('addWork'):'',
                                        reportStatus:$scope.radio.reportStatus,
                                        partList: $scope.partList,
                                        repairDate: $scope.repairDate,
                                        repairDate1: $scope.repairDate1,
                                        repairWaitTime: $scope.repairWaitTime,
                                        repairResultSwitch: $scope.repairResultSwitch(),
                                        repairTrue: $scope.repairTrue,
                                        repairDate2: $scope.repairDate2
                                    },$scope.outsideRepairTime,$scope.repairObj);
                                    $scope.repairReportInfo.attachment=result.attachment?JSON.parse(result.attachment):[];
                                    $scope.repairReportInfo.reportPrint=false;
                                    console.log($scope.repairReportInfo);
                                    return
                                }
                                $rootScope.radio.radioS=result.faultType;
                                $rootScope.radio.repairResultR=result.repairResult;
                                $scope.repairObj.totalCost=result.totalCost;
                                $scope.repairObj.repairCost=result.repairCost;
                                $scope.repairObj.repairInvoice=result.repairInvoice;
                                $scope.repairObj.materiaCost=result.partsCost;
                                var time = new Date().getTime();
                                if($rootScope.radio.radioV==2){
                                    $scope.repairObj.outsideCompany=result.outsideCompany;
                                    $scope.repairObj.outsidePhone=result.outsidePhone;
                                    $scope.repairObj.engineerName=result.engineerName;
                                    $scope.repairObj.engineerNum=result.engineerNum;
                                    $scope.outsideRepairTime={};
                                    $scope.outsideRepairTime.repairHours = result.repairHours;
                                    $scope.outsideRepairTime.callRepairDate = result.callRepairDate;
                                    $scope.outsideRepairTime.arrivalDate = result.arrivalDate;
                                    $scope.outsideRepairTime.leaveDate = result.leaveDate;
                                    $scope.initcalendar(time,result.callRepairDate?result.callRepairDate:time,0,'.date-callRepairDate');
                                    $scope.initcalendar(time,result.arrivalDate?result.arrivalDate:time,result.callRepairDate?result.callRepairDate:time,'.date-arrivalDate',$scope.outsideRepairTime.leaveDate?$scope.outsideRepairTime.leaveDate:time);
                                    $scope.initcalendar(time,result.leaveDate?result.leaveDate:time,result.arrivalDate?result.arrivalDate:(result.callRepairDate?result.callRepairDate:time),'.date-leaveDate');
                                }
                                $scope.addWork=$scope.listToObj(result.workContentList);
                                $scope.addphenom=$scope.listToObj(result.faultPhenomenonList);
                                $scope.addReason=$scope.listToObj(result.faultReasonList);
                                $scope.partList=result.list;
                                ($scope.partList.length)&&($scope.partList.length!=0)&&($scope.partListHad=true);
                                if($rootScope.radio.radioV==1){
                                    $scope.repairDate1 = result.repairStartDate;
                                    $scope.repairDate2 = result.repairEndDate?result.repairEndDate:time;
                                    $scope.repairTrue1 = result.actualStartDate;
                                    $scope.repairTrue2 = result.actualEndDate?result.actualEndDate:time;
                                    var t,b,l;
                                    t = $scope.repairDate2-$scope.repairDate1;
                                    $scope.repairDate1&&$scope.repairDate2&&(
                                        $scope.repairTime.day=Math.floor(t/3600000/24),
                                        $scope.repairTime.hour=Math.ceil(t/3600000%24)
                                    );
                                    b=t;
                                    $scope.repairTime.hour==24?($scope.repairTime.day=$scope.repairTime.day+1,$scope.repairTime.hour=0):'';
                                    t = $scope.repairTrue2-$scope.repairTrue1;
                                    l=Math.abs($scope.repairDate1-$scope.repairTrue1);
                                    $scope.repairTrue1&&$scope.repairTrue2&&(
                                        $scope.repairTrue.day=Math.floor(t/3600000/24),
                                        $scope.repairTrue.hour=Math.ceil(t/3600000%24)
                                    );
                                    $scope.repairWaitTime.day=Math.floor(l/3600000/24);
                                    $scope.repairWaitTime.hour=Math.ceil(l/3600000%24);
                                    $scope.repairWaitTime.hour==24?($scope.repairWaitTime.day=$scope.repairWaitTime.day+1,$scope.repairWaitTime.hour=0):'';
                                    $scope.repairTrue.hour==24?($scope.repairTrue.day=$scope.repairTrue.day+1,$scope.repairTrue.hour=0):'';
                                    $scope.initcalendar($scope.repairDate1,$scope.repairDate2,$scope.repairDate1,'.date-endDate');
                                    $scope.initcalendar($scope.repairTrue1,$scope.repairTrue2,$scope.repairTrue1,'.true-endDate');
                                    $scope.initcalendar(0,$scope.repairDate1,0,'.date-startDate');
                                    $scope.initcalendar($scope.repairDate1,$scope.repairTrue1,$scope.repairDate1,'.true-startDate');
                                }
                                $scope.repairReportInfo = $.extend({
                                    repairList:$scope.assetsInfo,
                                    addphenom: $scope.addphenom.length?$scope.arrToString1('addphenom'):'',
                                    addReason: $scope.addReason.length?$scope.arrToString1('addReason'):'',
                                    partListHad: $scope.partListHad,
                                    printPower: true,
                                    reportStatus: $scope.assetsInfo.reportStatus,
                                    addWork: $scope.addWork.length?$scope.arrToString1('addWork'):'',
                                    reportStatus:$scope.radio.reportStatus,
                                    partList: $scope.partList,
                                    repairDate: $scope.repairDate,
                                    repairDate1: $scope.repairDate1,
                                    repairWaitTime: $scope.repairWaitTime,
                                    repairResultSwitch: $scope.repairResultSwitch(),
                                    repairTrue: $scope.repairTrue,
                                    repairDate2: $scope.repairDate2
                                },$scope.outsideRepairTime,$scope.repairObj);
                                console.log($scope.repairReportInfo);
                            });
                            var index=layer.open({
                                time: 0 
                                ,type: 1
                                ,content: $('#PreRepairReportBill')
                                ,title: ['打印维修报告单','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                                ,closeBtn: 1
                                ,shade: 0.3
                                ,shadeClose: true
                                ,btn: 0
                                ,area: ['1104px','562px']
                            });
                        }else{
                            var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
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
            //关闭所有的弹出框
            $scope.closeAll = function() {
                $scope.needOverlay = false;
                
                $scope.fundSourcesListShow = false;
                $scope.purchaseTypeListShow = false;
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

            //编辑台账
            $scope.saveAssets = function() {
                $scope.res.purchaseTypeId=$scope.purchaseType.codeValue;

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

                $scope.res.invoiceNos&&($scope.res.invoiceNos=$scope.res.invoiceNos.replace(/[\D]+/g,';'));
                $scope.res.invoiceNos&&($scope.res.invoiceNos.charAt($scope.res.invoiceNos.length-1)==';')&&($scope.res.invoiceNos=$scope.res.invoiceNos.substring(0,$scope.res.invoiceNos.length-1))
                $scope.listInvoice = $scope.res.invoiceNos?$scope.res.invoiceNos.split(';'):'';
                $scope.res.listInvoice=[];
                for (var i = 0; i < $scope.listInvoice.length; i++) {
                    $scope.res.listInvoice.push({assetsId:$scope.res.assetsId,invoiceNo:$scope.listInvoice[i]});
                };
                !$scope.res.listFundSources&&(delete data.contractPriceStr);
                (!$scope.res.listInvoice.length)&&(delete $scope.res.listInvoice);

                var data = {
                    "assetsImg": $scope.res.assetsImg,
                    "archivesCode": $scope.res.archivesCode,
                    "arrivalDate": $scope.res.arrivalDate1?(new Date($scope.res.arrivalDate1+' 00:00:00').getTime()):null,
                    "assetsId": $scope.res.assetsId,
                    "contractName": $scope.res.contractName,
                    "contractNo": $scope.res.contractNo,
                    "contractPriceStr": $scope.res.contractPrice1,
                    "contractId": $scope.res.contractId,
                    "listFundSources": $scope.res.listFundSources,
                    "listInvoice": $scope.res.listInvoice,
                    "priceStr": $scope.res.price1,
                    "purchaseDate": $scope.res.purchaseDate1?(new Date($scope.res.purchaseDate1+' 00:00:00').getTime()):null,
                    "purchaseTypeId": $scope.res.purchaseTypeId,
                    "splName": $scope.res.splName,
                    "startDate": $scope.res.startDate1?(new Date($scope.res.startDate1+' 00:00:00').getTime()):null,
                    "supplierName": $scope.res.supplierName
                };

                $scope.res.arrivalDate = $scope.res.arrivalDate1?(new Date($scope.res.arrivalDate1+' 00:00:00').getTime()):null;
                $scope.res.purchaseDate = $scope.res.purchaseDate1?(new Date($scope.res.purchaseDate1+' 00:00:00').getTime()):null;
                $scope.res.startDate = $scope.res.startDate1?(new Date($scope.res.startDate1+' 00:00:00').getTime()):null;
                $scope.res.contractPriceStr = $scope.res.contractPrice1;
                $scope.res.priceStr = $scope.res.price1;


                !$scope.res.contractPrice1&&(delete data.contractPriceStr);
                !$scope.res.price1&&(delete data.priceStr);
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
            $scope.printscale1=false;
            $scope.printscale2=false;
            $scope.printIt = false;
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
                    ,area: ['645px','485px'],
                    success:function () {
                        $('.print').click(function () {
                            /*$scope.printIt = false;
                            $('#printIt').jqprint();*/
                           $scope.printTable()
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
        }]);