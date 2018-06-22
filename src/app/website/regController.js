'use strict';

angular.module('app')
    .controller('regController', [ '$rootScope', '$scope', '$http', '$state' , '$localStorage', '$timeout',
        function($rootScope, $scope, $http, $state, $localStorage, $timeout) {
        	$scope.loginOrNot=function(){
                $rootScope.logined=false;
                window.scrollTo(0,0);
                ($localStorage.userInfo)&&($rootScope.logined=true);
            }
            $scope.loginOrNot();

            $scope.verifyName=function(){
            	if(!$scope.name){
			    	return $scope.nameErr=true;
			    }
            }

            $scope.codetxt = '获取验证码';
            $scope.codeText = '请输入验证码';
            $scope.timer = 0;
            $scope.getcode=function(){
            	if(!$scope.mobile||$scope.mobileErr||$scope.codetxt!='获取验证码'||$scope.mobileUndo) return;
            	$.ajax({
					type: "get",
					data: {'account': $scope.mobile},
                    url: '/sys/index/sendRstCode',
					complete: function(res) {
						if(res.responseJSON.code&&res.responseJSON.code == 200) {
							$scope.codetxt = '60s';
							$scope.timeout();
						}else if(res.responseJSON.code='U_022'){
							$scope.codeText = '24小时内只能发送6次';
							$scope.codeErr = true;
							$scope.mobileUndo = true;
							$rootScope.$apply();
						}
					}
				});
            }
            $scope.timeout = function(){
            	if($scope.codetxt=='0s'||$scope.codetxt=='获取验证码'){
            		$localStorage.codetxt=null;
            		return $scope.codetxt='获取验证码';;
            	}
            	$scope.timer=$timeout(function(){
            		$scope.codetxt=($scope.codetxt.slice(0,$scope.codetxt.length-1)-1) + 's';
            		$scope.timeout();
            	},1000);
            	clearTimeout($scope.timeout);
            }
            $scope.timeout();
            $scope.verifyCodes=function(){
            	if(!$scope.verifyCode){
            		return $scope.codeErr = true;
            	}
            }

            $scope.orgModel={name:'',id:''};
			$scope.getOrg=function(){
				$.ajax({
					type: "get",
	                url: '/sys/tenant/all/manageTenant',
					complete: function(res) {
						if(res.responseJSON.code == 200) {
							$scope.orgs = res.responseJSON.data;
						}else{
							$scope.orgs = [];
						}
					}
				});
			}
			$scope.getOrg();

			$scope.inputLimit=function(a,b,c){
				$scope[a]&&($scope[a]=$scope[a].slice(0,b));
				$scope[c]&&($scope[c]=false);
			}

			$scope.mobileTxt = '请输入手机号';
			$scope.mobileErr = false;
			$scope.verifyMobile=function(){
				if(!$scope.mobile){
					$scope.mobileErr=true;
            		$scope.mobileTxt='请输入手机号';
            		return;
            	}
				var reg = /^(1[3-8][0-9])\d{8}$/;
            	$scope.mobileErr = !(reg.test($scope.mobile));
            	if($scope.mobileErr){
            		$scope.mobileTxt='手机号不正确';
            		return;
            	}
            	$.ajax({
					type: "get",
					data: {'mobile': $scope.mobile},
                    url: '/sys/tenant/mobileCheck',
					complete: function(res) {
						$scope.mobileErr = false;
						if(res.responseJSON.code == 200) {
							(res.responseJSON.data)&&($scope.mobileErr=true)&&($scope.mobileTxt='手机号已存在');
						}
						$rootScope.$apply()
					}
				});
			}

			$scope.passwordTxt='请输入密码';
			$scope.verifyPassword=function(){
				if(!$scope.password){
					$scope.passwordErr=true;
					$scope.passwordTxt='请输入密码';
				}else if($scope.password.length<8){
					$scope.passwordErr=true;
					$scope.passwordTxt='密码格式不正确';
				}
				return;
			}

			$scope.orgNameTxt='请输入机构名称';
			$scope.orgNameErr=false;
			$scope.verifyOrgName=function(){
				if(!$scope.orgName){
					$scope.orgNameTxt='请输入机构名称';
					return $scope.orgNameErr=true;
				}
				$.ajax({
					type: "get",
					data: {'tenantName': $scope.orgName},
                    url: '/sys/tenant/tenantNameCheck',
					complete: function(res) {
						$scope.orgNameErr=false;
						if(res.responseJSON.code == 200) {
							(res.responseJSON.data)&&($scope.orgNameErr=true)&&($scope.orgNameTxt='医疗机构已存在');
						}
						$rootScope.$apply()
					}
				});
			}

			$scope.hplcodeTxt = '请输入医疗机构代码';
			$scope.verifyHplCode=function(){
				if(!$scope.hplCode){
					return $scope.hplCodeErr=true;
				}
			}

			$scope.inputChange=function(a){
				$scope[a]=false;
				(a=='mobileErr')&&($scope.mobileUndo=false);
				(a=='mobileErr')&&($scope.codeErr=false);
			}

			$scope.isSave = false;
			
            $scope.submit=function(){
            	if($scope.nameErr||$scope.mobileErr||$scope.codeErr||$scope.passwordErr||$scope.orgNameErr||$scope.regionErr||$scope.orgErr||$scope.hplCodeErr){
            		return;
            	}
            	if(!$scope.name){
            		return $scope.nameErr=true;
            	}
            	if(!$scope.mobile){
            		$scope.mobileErr=true;
            		return $scope.mobileTxt='请输入手机号';
            	}
            	if(!$scope.verifyCode){
            		$scope.codeText = '请输入验证码';
            		return $scope.codeErr=true;
            	}
            	if(!$scope.password){
            		return $scope.passwordErr=true;
            	}
            	if(!$scope.orgName){
            		return $scope.orgNameErr=true;
            	}
            	if(!$scope.selected.regionSel.id||!$scope.selected.citySel.id||!$scope.proSel.id){
            		return $scope.regionErr=true;
            	}
            	if(!$scope.orgModel.name){
            		return $scope.orgErr=true;
            	}
            	if(!$scope.hplCode){
            		return $scope.hplCodeErr=true;
				}
				if(!$scope.isSave){
					$scope.isSave = true;
					$.ajax({
						type: "post",
						contentType: "application/json;charset=UTF-8",
						data: JSON.stringify({
							realName: $scope.name,
							
							mobile: $scope.mobile,
							verifyCode: $scope.verifyCode,
							password: $scope.password,
							name: $scope.orgName,
							license: $scope.orgCode,
							tenantType: 1 || $scope.tenantModel.id,
							province: $scope.proSel.name,
							city: $scope.selected.citySel.name,
							county: $scope.selected.regionSel.name,
							licenseImgUrl: $scope.codeImg,
							commercialUse: 0,
							hplTenant: {
								orgCode: $scope.hplCode,
								manageType: $scope.manageModel.id,
								category: $scope.tenantModel.id,
								economicType: $scope.economicModel.id,
								grade: $scope.gradeModel.id,
								hierarchy: $scope.hierarchyModel.id,
							},
							createAdmin: true,
							createBy: 0,
							origin: 2,
							parentId: 1,
							trial: 0,
							manageTenantId: $scope.orgModel.id,
							subTenantLimit: 0,
							updateBy: 0
						}),
						url: '/sys/tenant/createTrialSubTenant',
						complete: function(res) {
							$scope.isSave = false;
							if(res.responseJSON.code == 200) {
								$state.go('website.success');
							}else if(res.responseJSON.code=='L_007'){
								$scope.codeErr = true;
								$scope.codeText = '请输入正确的验证码';
								$rootScope.$apply();
							}else if(res.responseJSON.code=='L_003'){
								$scope.codeErr = true;
								$scope.codeText = '请输入正确的验证码';
								$rootScope.$apply();
							}else if(res.responseJSON.code=='O_016'){
								$scope.hplcodeTxt=res.responseJSON.msg;
								$scope.hplCodeErr=true;
								$rootScope.$apply();
							}
						}
					});
				}
            }
            
            // reg upload 
            $scope.codeImg = '';
            $scope.inputFile = '';
            $scope.replaceImg=function(){
            	if(!$('#detailUploadImg')[0].files.length) return;
	            var _type = $('#detailUploadImg')[0].files[0].type
                var _size = $('#detailUploadImg')[0].files[0].size/(1024*1024)
                var msg;
                if(_size>2){
                	$("#detailUploadImg").val('');
                    return msg = layer.msg('<div class="toaster"><span>' + '图片大于2M，上传失败' + '</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                }
                if(_type!='image/png'&&_type!='image/jpg'&&_type!='image/jpeg'){
                	$("#detailUploadImg").val('');
                    return msg = layer.msg('<div class="toaster"><span>' + '图片格式错误，上传失败' + '</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
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
	                        $scope.codeImg=JSON.parse(res).data[0];
	                        // $('#assetDetailImg').attr('src','/api/file'+$scope.codeImg)
	                    }else{
	                    	$scope.codeImg = '';
	                        // $('#assetDetailImg').attr('src','../../res/img/tjtp.png');
	                    }
	                    var msg = layer.msg('<div class="toaster"><span>' + resmsg + '</span></div>', {
	                        area: ['100%', '60px'],
	                        time: 3000,
	                        offset: 'b',
	                        shadeClose: true,
	                        shade: 0
	                    });
	                    $rootScope.$apply();
	                }
	            }
	        }
            // reg select
            $scope.tenantShow = false;
            $scope.tenantModel = {
            	id: null,
            	name: null
            };
            $scope.tenantType = [{
	        	id: '',
	        	name: '请选择'
	        },{
            	id: 1,
            	name: '医疗机构'
            },{
            	id: 2,
            	name: '基层医疗卫生机构'
            },{
            	id: 3,
            	name: '疾病预防控制中心'
            }];
	        $scope.economicShow = false;
	        $scope.economicModel = {
	        	id: null,
	        	name: null
	        };
	        $scope.economicType = [{
	        	id: '',
	        	name: '请选择'
	        },{
	        	id: 1,
	        	name: '公立'
	        },{
	        	id: 2,
	        	name: '民营'
	        }];
	        $scope.gradeShow = false;
	        $scope.gradeModel = {
	        	id: null,
	        	name: null
	        };
	        $scope.grade = [{
	        	id: '',
	        	name: '请选择'
	        },{
	        	id: 1,
	        	name: '一级'
	        },{
	        	id: 2,
	        	name: '二级'
	        },{
	        	id: 3,
	        	name: '三级'
	        },{
	        	id: 4,
	        	name: '未定级'
	        }];
	        $scope.manageShow = false;
	        $scope.manageModel = {
	        	id: null,
	        	name: null
	        };
	        $scope.manageType = [{
	        	id: '',
	        	name: '请选择'
	        },{
	        	id: 1,
	        	name: '营利性'
	        },{
	        	id: 2,
	        	name: '非营利性'
	        },{
	        	id: 3,
	        	name: '其他'
	        }];
	        $scope.hierarchyShow = false;
	        $scope.hierarchyModel = {
	        	id: null,
	        	name: null
	        };
	        $scope.hierarchy = [{
	        	id: '',
	        	name: '请选择'
	        },{
	        	id: 1,
	        	name: '特等'
	        },{
	        	id: 2,
	        	name: '甲等'
	        },{
	        	id: 3,
	        	name: '乙等'
	        },{
	        	id: 4,
	        	name: '丙等'
	        },{
	        	id: 6,
	        	name: '未评'
	        }];
            $scope.option = function(list, value, item) {
	            $scope.fixWrapShow = false;
	            $scope[list] = false;
	            $scope[value] = item;
	            (list=='orgShow')&&($scope.orgErr=false);
	        }
	        $scope.listShow = function(str) {
	            if($scope.fixWrapShow)
	                return $scope.menuHide();
	            $scope[str] = true;
	            $scope.fixWrapShow = true;
	        }
	        $scope.fixWrapShow = false;
	        $scope.menuHide = function() {
	            $scope.fixWrapShow = false;
	            $scope.hierarchyShow = false;
	            $scope.manageShow = false;
	            $scope.gradeShow = false;
	            $scope.economicShow = false;
	            $scope.tenantShow = false;
	            $scope.orgShow = false;
	        }

	        //省市区三级联动
		    $scope.province = [];
		    $scope.proSel = {id:0,name:'省份'};
		    $scope.city = [];
		    $scope.citySel = {id:0,name:'城市'};
		    $scope.regionSel = {id:0,name:'区县'};
		    $scope.area = [];
		    $scope.selected={
		    	citySel:{id:0,name:'城市'},
		    	regionSel:{id:0,name:'区县'}
		    }

    		//省市区联动
		    $scope.provChange = function (item,mod) {
		        $scope.proSel = item;
		        // $scope.getManageTenant(item.name);
		        $.ajax({
		            type:'get',
		            url:'/sys/area/'+item.id+'/city',
		            async:false,
		            complete:function (res) {
		                if(res.responseJSON.code == 200) {
		                    var result = res.responseJSON.data;
		                    $scope.selected.citySel = {id:0,name:'城市'};
		                    $scope.region = [];
		                    $scope.selected.regionSel = {id:0,name:'区县'};
		                    $scope.city = result;
		                    if($localStorage.orgData){
		                        for(var i=0;i<result.length;i++){
		                            if(result[i].name == $localStorage.orgData.tenant.city){
		                                $scope.selected.citySel = {id:result[i].id,name:$localStorage.orgData.tenant.city};
		                            }
		                        }
		                        $scope.cityChange($scope.selected.citySel);
		                    }
		                     // $rootScope.$apply();
		                }
		            }
		        })
		    }
		    $scope.cityChange = function (item,mod) {
		        $scope.selected.citySel = item;
		        $.ajax({
		            type:'get',
		            async:false,
		            url:'/sys/area/'+item.id+'/region',
		            complete:function (res) {
		                if(res.responseJSON.code == 200) {
		                    var result = res.responseJSON.data;
		                    $scope.region = result;
		                    $scope.selected.regionSel = {id:0,name:'区县'};

		                    if($localStorage.orgData){
		                        for(var i=0;i<result.length;i++){
		                            if(result[i].name == $localStorage.orgData.tenant.county){
		                                $scope.selected.regionSel = {id:result[i].id,name:$localStorage.orgData.tenant.county};
		                            }
		                        }
		                    }
		                    // $scope.$apply();
		                }
		            }
		        })
		    }

		    $scope.regionChange = function (item, mod) {
		        $scope.selected.regionSel = item;
		        $scope.regionErr=false;
		    }

		    //获取省
		    $.ajax({
		        type: "get",
		        url: "/sys/area/province",
		        async:false,
		        complete: function(res) {
		            if(res.responseJSON.code == 200) {
		                $localStorage.provinceLocal = res.responseJSON.data;
		                var result = res.responseJSON.data;
		                $scope.province = result;

		                if($localStorage.orgData){
		                    for(var i=0;i<result.length;i++){
		                        if(result[i].name == $localStorage.orgData.tenant.province){
		                            $scope.proSel = {id:result[i].id,name:$localStorage.orgData.tenant.province};
		                        }
		                    }
		                    $scope.provChange($scope.proSel);
		                }
		            }
		        }
		    });


    } ]);