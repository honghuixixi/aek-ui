'use strict';

angular.module('app')

.controller('credentialsController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', '$filter', 'FileUploader', 'printCodeService', 
    function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage, $filter, FileUploader, printCodeService) {	
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
                        $scope.credentials = $scope.res.listCertificate;
                        if($scope.credentials.length){
                            for (var i = 0; i < $scope.credentials.length; i++) {
                                $scope.credentials[i].assetsId=$stateParams.assetId;
                                $scope.credentials[i].timer = new Date().getTime()+i;
                            };
                        }
                    }else{
                        $scope.res={};
                    }
                    $('#detailUploadImg').on('change',function(){$scope.assetimginputchange()});
                    $rootScope.$apply();
                }
            });
            $scope.state=$stateParams.state;
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
            // 查看图片
            $scope.credentialsImg=function(a){
                if(!a.imageUrl){
                    return;
                }
                $scope.credentialUrl = 'api/file/'+a.imageUrl;
                $scope.credentialsImgShow = true;
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
                        angular.element(document.querySelector('#detailUploadImg')).on('change', handleFileSelect);
                    }
                });
            }
            $scope.getAllList();

            //编辑台账
            $scope.saveAssets = function() {
                $.ajax({
                    type: "post",
                    url: "/assets/assAssetsCertificate/edit",
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify($scope.credentials),
                    complete: function(res) {
                        var txt = '保存成功';
                        if(res.responseJSON.code == 200) {
                        }else{
                            txt=res.responseJSON.msg;
                        }
                        $state.go('main.tre.zctz.credentials', {id: $stateParams.id,
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
                // $scope.saveAssetsTitle(0);
                // $scope.saveAssetsTitle(1);
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
                printCodeService.print($scope.res.assetsId);
            }


	$scope.localStorageHad=function(){
		if(!$localStorage.userInfo){
			return $state.go('website.home');
		}
	}
	$scope.localStorageHad();

	$scope.credentialsUpload=function(a,b,c){
        $scope.certificateNameErr=false;
        $scope.certificateFileErr=false;
		angular.element('#imgFiles').val('');
		angular.element('.input-datepicker').val('');
		$scope.obj={
	        imgChange: false,
	        imgClick: false,
	        imgSrc: '../../../res/img/file-pic.png',
	        imageUrl: '',
            name: '',
            certificateType: 5,
            validDate: '',
            assetsId: $stateParams.assetId
	    };
	    if(a==1){
	    	$scope.obj.imgSrc=b.imageUrl?('/api/file'+b.imageUrl):'../../../res/img/file-pic.png';
	    	$scope.obj.certificateNum=b.certificateNum;
            $scope.obj.id=b.id;
            $scope.obj.timer=b.timer;
            $scope.obj.validDate=b.validDate;
            $scope.obj.name=b.name;
            $scope.obj.certificateType=b.certificateType;
            if($scope.obj.certificateType==2){
                $scope.obj.certificateRegisterNum=b.certificateRegisterNum;
            }else if($scope.obj.certificateType==4){
                $scope.obj.productDate=b.productDate;
                $scope.obj.validDateStr=b.validDateStr;
            }
            $scope.obj.index=c;
	    	$scope.obj.imageUrl=b.imageUrl;
	    	if(b.expireTime){
	    		$scope.obj.expireTime=b.expireTime;
		    	var date = new Date(b.expireTime);
	            var y = date.getFullYear();
	            var m = date.getMonth()+1;
	            m=m<10?('0'+m):m;
	            var d = date.getDate();
	            d=d<10?('0'+d):d;
		    	angular.element('#datepickerUpload').val(y+'-'+m+'-'+d);
		    }
            if(b.productDate){
                var date = new Date(b.productDate);
                var y = date.getFullYear();
                var m = date.getMonth()+1;
                m=m<10?('0'+m):m;
                var d = date.getDate();
                d=d<10?('0'+d):d;
                angular.element('#productDate').val(y+'-'+m+'-'+d);
            }
	    	$scope.obj.id=b.id;
	    	$scope.obj.imgClick=b.imageUrl?true:false;
	    }else{
            $scope.obj.certificateNum='';
            $scope.obj.timer = new Date().getTime();
        }
		
		var index = layer.open({
			time: 0,
			type: 1,
			content: $('#credentialsUploadWrap'),
			title: [b?'编辑证件':'新增证件', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
			closeBtn: 1,
			shade: 0.3,
            success:function(){
                $scope.initcalendar();
            },
			shadeClose: true,
			btn: 0,
			area: ['522px', '400px']
		});
	}
    // 名称验重
    $scope.nameCheck=function(){
        if(!$scope.obj.name){
            $scope.certificateNameTxt='不能为空';
            return $scope.certificateNameErr=true;
        }
        for (var i = 0; i < $scope.credentials.length; i++) {
            if($scope.credentials[i].timer!=$scope.obj.timer&&$scope.credentials[i].name==$scope.obj.name){
                $scope.certificateNameTxt='已存在';
                return $scope.certificateNameErr=true;;
            }
        };
        $scope.certificateNameErr = false;
        if(!$scope.obj.id){
            return
        }
        $.ajax({
            type: 'get',
            url: '/assets/assAssetsCertificate/check',
            data: {assetsId:$stateParams.assetId,name:$scope.obj.name,idFlag:$scope.obj.id},
            complete: function(xhr){
                if(xhr.responseJSON.code=='C_003'){
                    $scope.certificateNameErr=true;
                    $scope.certificateNameTxt='已存在';
                }else{
                    $scope.certificateNameErr=false;
                }
                $scope.$apply();
            }
        });
    }
    $scope.credentialDel=function(a){
        var index = layer.open({
            time: 0,
            type: 1,
            content: $('#inspectionLayer'),
            title: ['提示', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
            closeBtn: 1,
            shade: 0.3,
            yes: function(){
                $scope.credentials.splice(a,1);
                $scope.$apply();
                layer.closeAll();
            },
            shadeClose: true,
            btn: ['确定'],
            area: ['522px', '220px']
        });
    }
	// 保存证件
	$scope.credentialsSave=function(){
        if($scope.certificateNameErr){
            return;
        }
		if(!$scope.obj.name){
            $scope.certificateNameTxt='不能为空';
			return $scope.certificateNameErr=true;
		}
        if(!$scope.obj.imageUrl){
            return $scope.certificateFileErr=true;;
        }
	    layer.closeAll();
        if($scope.obj.certificateType<5){
            $scope.credentials[$scope.obj.index]=$scope.obj;
        }else{
            $scope.obj.index&&($scope.credentials[$scope.obj.index]=$scope.obj);
            !$scope.obj.index&&$scope.credentials.push($scope.obj);
        }
	}
	//上传预览事件

	//初始化日历
    $scope.initcalendar = function() {
        var option = {
            format: 'YYYY-MM-DD',
            endDate: new Date(),
            maxDate: new Date("2050-01-01"),
            timePicker: false,
            isCotrScollEl:"body",
            singleDatePicker: true
        };
        setTimeout(function(){
            angular.element('#datepickerUpload').daterangepicker($.extend({}, option, {startDate: $scope.obj.validDate?(new Date($scope.obj.validDate)):(new Date())}), function(date, enddate, el) {});
            $('#datepickerUpload').on('apply.daterangepicker', function(a,b) {
                $scope.obj.validDate=new Date(b.startDate).getTime();
            });
            $scope.obj.validDate&&($('#datepickerUpload').val($filter('date')($scope.obj.validDate, 'yyyy-MM-dd')));
            angular.element('#productDate').daterangepicker($.extend({}, option, {maxDate: new Date(),startDate: $scope.obj.productDate?(new Date($scope.obj.productDate)):(new Date())}), function(date, enddate, el) {});
            $('#productDate').on('apply.daterangepicker', function(a,b) {
            $scope.obj.productDate=new Date(b.startDate).getTime();
            
        });$scope.obj.productDate&&($('#productDate').val($filter('date')($scope.obj.productDate, 'yyyy-MM-dd')));},1000);
    }
	$scope.fileImg = function(obj) {
        angular.element('#imgFiles').click();
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

    $scope.imgChangeFn = function (obj) {
        if((!$scope.addOrEdit && $scope.obj.imgSrc != '../../../res/img/file-pic.png') || ($scope.addOrEdit && $scope.obj.imgSrc && $scope.obj.imgSrc != '../../../res/img/file-pic.png')){
            $scope.obj.imgChange=true;
        }
    }

    $scope.imgChangeFn2 = function (obj) {
        $scope.obj.imgChange=false;
    }

    $scope.delect = function (obj) {
        $scope.obj.imgSrc = '../../../res/img/file-pic.png';
        $scope.obj.imageUrl = '';
        document.getElementById('imgFiles').value = '';
        $scope.obj.imgClick = false;
    }
    $scope.setImagePreview = function(arg) {
    	var file = arg.files;
        if(arg.files && arg.files[0]) {
            var typeArr = ['jpg', 'jpeg', 'gif', 'png', 'tiff', 'bmp','PNG','JPG'],
                type = file[0].name.split('.')[file[0].name.split('.').length-1].toLocaleLowerCase();
            if(!$scope.contains(typeArr, type)) {
                var msg = layer.msg('<div class="toaster"><span>选择文件格式有误，请重新选择！</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
                arg.value = '';
                return;
            }
            var size = file[0].size / (1024 * 1024);
            if(size>2){
                var msg = layer.msg('<div class="toaster"><span>选择文件过大，请重新选择！</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
                arg.value = '';
                return;
            }

            //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
            $scope.obj.imgSrc = window.URL.createObjectURL(arg.files[0]);
            $scope.obj.imgClick=true;
            var file = arg.files[0];

            var formData = new FormData();
            formData.append("files", file);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/upload/');
            xhr.setRequestHeader("X-AEK56-Token", $localStorage["X-AEK56-Token"]);
            xhr.send(formData);
            xhr.onreadystatechange = function () {
                var res = xhr.response;
                if((xhr.readyState == 4)&&res){
                    if(JSON.parse(res).code == '200'){
                        $scope.obj.imageUrl = JSON.parse(res).data[0];
                        $scope.certificateFileErr=false;;
                    }
                }
            }
            $rootScope.$apply();
        } else {

        }
    }

}]);