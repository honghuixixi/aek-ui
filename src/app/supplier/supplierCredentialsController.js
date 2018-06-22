'use strict';

angular.module('app')

.controller('supplierCredentialsController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', '$filter', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage, $filter) {	
	$rootScope.currentmodule = "供应商管理";
	$rootScope.sections = {
		model: false,
		credentials: true,
		seller: false,
		user: false
	};
	$scope.localStorageHad=function(){
		if(!$localStorage.userInfo){
			return $state.go('website.home');
		}
	}
	$scope.localStorageHad();
	$scope.getCredentials=function(){
		$.ajax({
			type: 'get',
			url: '/sys/supplier/view/credentials/'+$stateParams.supplierId,
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					$scope.credentials=res.responseJSON.data;
					var cur = new Date().getTime();
					for (var i = $scope.credentials.length - 1; i >= 0; i--) {
						$scope.credentials[i].unused=false;
						(($scope.credentials[i].expireTime+(((23*60)+60)*60000)+60)<cur)&&($scope.credentials[i].unused=true);
					}
					$scope.credentialAddList=[{type:1},{type:2},{type:3},{type:4}];
					for (var i = $scope.credentials.length - 1; i >= 0; i--) {
						for (var j = $scope.credentialAddList.length - 1; j >= 0; j--) {
							if($scope.credentialAddList[j].type==$scope.credentials[i].type){$scope.credentialAddList.splice(j,1);break;};
						};
					};
					$rootScope.$apply();
				}
			}
		});
	}
	$scope.getCredentials();

	$scope.credentialsUpload=function(a,b){
		angular.element('#imgFiles').val('');
		angular.element('#datepickerUpload').val('');
		$scope.obj={
	        imgChange: false,
	        imgClick: false,
	        imgSrc: '../../../res/img/file-pic.png',
	        code: '',
	        type: b.type,
	        imageUrl: '',
	        dateClass: '',
	        expireTime: '',
	        createBy: $localStorage.userInfo.id,
	        tenantId: $stateParams.supplierId,
	        updateBy: $localStorage.userInfo.id
	    };
	    if(a==1){
	    	$scope.obj.imgSrc=b.imageUrl?('/api/file'+b.imageUrl):'../../../res/img/file-pic.png';
	    	$scope.obj.code=b.code;
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
	    	$scope.obj.id=b.id;
	    	$scope.obj.imgClick=b.imageUrl?true:false;
	    }
		$scope.initcalendar();
		var index = layer.open({
			time: 0,
			type: 1,
			content: $('#credentialsUploadWrap'),
			title: [b.type==1?'上传组织机构代码证':(b.type==2?'上传营业执照证':(b.type==3?'上传医疗器械经营许可证':'上传税务登记证')), 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
			closeBtn: 1,
			shade: 0.3,
			shadeClose: true,
			btn: 0,
			area: ['522px', '350px']
		});
	}
	// 保存证件
	$scope.credentialsSave=function(){
		var msg;
		if(!$scope.obj.code&&!$scope.obj.expireTime&&!$scope.obj.imageUrl){
			return;
		}
	    layer.closeAll();
		$.ajax({
			type: $scope.obj.id?'put':'post',
			url: $scope.obj.id?'/sys/supplier/editCredentials':'/sys/supplier/createCredentials',
			contentType: "application/json;charset=UTF-8",
			data: JSON.stringify($scope.obj),
			complete: function(res) {
				$scope.obj={
			        imgChange: false,
			        imgClick: false,
			        imgSrc: '../../../res/img/file-pic.png',
			        code: '',
			        type: '',
			        imageUrl: '',
			        dateClass: '',
			        expireTime: null,
			        createBy: $localStorage.userInfo.id,
			        tenantId: $stateParams.supplierId,
			        updateBy: $localStorage.userInfo.id
			    };
				if(res.responseJSON.code&&res.responseJSON.code == 200) {
					$scope.getCredentials();
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
	}
	//上传预览事件

	//初始化日历
    $scope.initcalendar = function() {
        var option = {
            format: 'YYYY-MM-DD',
            startDate: $scope.obj.expireTime?(new Date($scope.obj.expireTime)):(new Date()),
            endDate: new Date(),
            minDate:new Date(new Date()-24*60*60*1000),
            maxDate: new Date("2050-01-01"),
            timePicker: false,
            singleDatePicker: true
        };
        angular.element('.input-datepicker').daterangepicker($.extend({}, option, {}), function(date, enddate, el) {});
        $('#datepickerUpload').on('apply.daterangepicker', function(a,b) {
            $scope.obj.expireTime=new Date(b.startDate).getTime();
        });
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
                    }
                }
            }
            $rootScope.$apply();
        } else {

        }
    }

}]);