'use strict';

angular.module('app')
	.controller('jbxxController', ['$rootScope', '$scope', '$http', '$state', '$localStorage',
		function($rootScope, $scope, $http, $state, $localStorage) {
			$rootScope.currentmodule = "用户管理";
			/*$rootScope.currentname = $localStorage.user.realName;
            $rootScope.currentoffice = $localStorage.user.deptName;
            $rootScope.currentorganization = $localStorage.user.orgName;*/
			$rootScope.userOr = false;
			$rootScope.membernav=false;
			$scope.base = true;
			$scope.editName = false;
			$scope.common = true;
			$scope.super = false;
			$scope.createTime = '';
			$scope.updateTime = '';

			//头像上传预览
			$scope.avatarState = false;
			$scope.headfile = '';
			$scope.imgSrc = '../../../res/img/usertx.png';

			//省市区三级联动
			$scope.province = [];
			$scope.user.proSel = '';
			$scope.city = [];
			$scope.user.citySel = '';
			$scope.user.regionSel = '';
			$scope.area = [];
			$scope.commonList = [
				{required: '',head: '所在地区：',con: '浙江省/杭州市/萧山区'},
				{required: '',head: '街道地址：',con: '西行街道1号路1号'},
				{required: '',head: '联系人：',con: '夕木暖'},
				{required: '',head: '联系电话：',con: '16866668888'},
				{required: '',head: '传真：',con: '86057188888888'}
			];
            // $.ajax({
            //         url : '/sys/org/view/'+$localStorage.user.orgId,
            //         data:  {},
            //         type: 'get'
            //     }).then(function(result) {
            //         $scope.commonList = result.result;
            //         $rootScope.$apply();
            // });
			$scope.commonListEdit = [
				{required: '*',head: '街道地址：',con: '西行街道1号路1号',example: ''},
				{required: '*',head: '联系人：',con: '夕木暖',example: ''},
				{required: '*',head: '联系电话：',con: '16866668888',example: '例如：0571-88888888'},
				{required: '',head: '传真：',con: '86057188888888',example: '例如：86057188888888'}
			];

            $.ajax({
                    url : '/sys/user/query/'/*+$localStorage.user.id*/,
                    data:  {},
                    type: 'put',
                    complete: function(result){
                        $scope.user = result.responseJSON.result;
                        $scope.user.proSel = $scope.user.province;
                        $scope.user.citySel = $scope.user.city;
                        $scope.user.regionSel = $scope.user.region;
                        $scope.createTime = new Date($scope.user.createTime).toLocaleDateString();
                        $scope.updateTime = new Date($scope.user.updateTime).toLocaleDateString();
                        $rootScope.$apply();
                    }
                });
            // .then(function(result) {
            //         $scope.user = result.result;
            //         $scope.user.proSel = $scope.user.province;
            //         $scope.user.citySel = $scope.user.city;
            //         $scope.user.regionSel = $scope.user.region;
            //         $scope.createTime = new Date($scope.user.createTime).toLocaleDateString();
            //         $scope.updateTime = new Date($scope.user.updateTime).toLocaleDateString();
            //         $rootScope.$apply();
            // });
            $scope.provChange = function (e) {
                var id ;
                for (var i = 0; i < $localStorage.provinceLocal.length; i++) {
                    if($localStorage.provinceLocal[i].name==e){
                        id = $localStorage.provinceLocal[i].id;
                        break;
                    }
                };
                $http({
                    method: 'GET',
                    url: '/api/sys/area/'+id+'/city'
                }).then(function (res) {
                    $localStorage.cityLocal = res.data.result;
                    var result = res.data.result;
                    var province = [];
                        for (var i = 0; i < result.length; i++) {
                            province[i] = result[i].name;
                        };
                        $scope.city = province;
                });
            }
            $scope.cityChange = function (e) {
                if(!e) return;
                var id ;
                for (var i = 0; i < $localStorage.cityLocal.length; i++) {
                    if($localStorage.cityLocal[i].name==e){
                        id = $localStorage.cityLocal[i].id;
                        break;
                    }
                };
                $http({
                    method: 'GET',
                    url: '/api/sys/area/'+id+'/region'
                }).then(function (res) {
                    $localStorage.regionLocal = res.data.result;
                    var result = res.data.result;
                    var province = [];
                        for (var i = 0; i < result.length; i++) {
                            province[i] = result[i].name;
                        };
                        $scope.region = province;
                });
            }

			//点击头像事件
			$scope.headClick = function() {
				if($scope.avatarState) {
					angular.element('#headFile').click();
				}
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

			//上传预览事件
			$scope.setImagePreview = function(file) {
				var docObj = document.getElementById('headFile');
				var imgObjPreview = document.getElementById('headImg');
				if(docObj.files && docObj.files[0]) {
					var typeArr = ['jpg', 'jpeg', 'gif', 'png', 'tiff', 'bmp'],
						type = file[0].name.split('.')[1],
						fileTypeFlag = true;
					if(!$scope.contains(typeArr, type)) {
						alert('选择文件格式有误，请重新选择！');
						return;
					}
					$scope.headfile = file;
					//imgObjPreview.src = docObj.files[0].getAsDataURL();

					//火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
					$scope.imgSrc = window.URL.createObjectURL(docObj.files[0]);
					$rootScope.$apply();
				} else {

				}
			}

           $scope.validateform=function(){
           	   // 提交时验证表单
				var validator = angular.element("#saveForm").validate({
					errorPlacement: function(error, element) {
						// Append error within linked label
						$(element)
							.parent()
							.parent()
							.next().append(error);;
					},
					onkeyup:function(element){
						$(element).valid();
					},
					errorElement: "span",
					messages: {
						realName: {
							required: " 请输入姓名"
						},
						linkName: {
							required: " 请输入联系人"
						},
						address: {
							required: " 请输入地址"
						},
						mobile: {
							required: "请输入手机号",
							minlength: "不能少于11个"
						}
					},
					submitHandler: function() {
						$scope.toEdit();
					}

            	});
        	}
            $scope.cancel = function () {
                $scope.editName = !$scope.editName;
                $scope.super = !$scope.super;
                $.ajax({
                    url : '/sys/user/query/'+$localStorage.user.id,
                    data:  {},
                    type: 'put',
                    complete: function(result){
                         $scope.user = result.responseJSON.result;
                        $scope.user.proSel = $scope.user.province;
                        $scope.user.citySel = $scope.user.city;
                        $scope.user.regionSel = $scope.user.region;
                        $scope.createTime = new Date($scope.user.createTime).toLocaleDateString();
                        $scope.updateTime = new Date($scope.user.updateTime).toLocaleDateString();
                        $rootScope.$apply();
                    }
                });
            }
			$scope.toEdit = function () {
				$scope.super = !$scope.super;
				$scope.editName = !$scope.editName;

				//             if(!$scope.editName){
				//                 $scope.avatarState = false;
				// }else{
				//                 $scope.avatarState = true;
				// }
				if($scope.editName) {
					$http({
						method: 'GET',
						url: '/api/sys/area/province'
					}).then(function(res) {
						$localStorage.provinceLocal = res.data.result;
						var result = res.data.result;
						var province = [];
						for(var i = 0; i < result.length; i++) {
							province[i] = result[i].name;
						};
						$scope.province = province;
						// 获取市
						var id;
						for(var i = 0; i < $localStorage.provinceLocal.length; i++) {
							if($localStorage.provinceLocal[i].name == $scope.user.proSel) {
								id = $localStorage.provinceLocal[i].id;
								break;
							}
						};
						$http({
							method: 'GET',
							url: '/api/sys/area/' + id + '/city'
						}).then(function(res) {
							$localStorage.cityLocal = res.data.result;
							var result = res.data.result;
							var province = [];
							for(var i = 0; i < result.length; i++) {
								province[i] = result[i].name;
							};
							$scope.city = province;
							// 获取区
							var id;
							for(var i = 0; i < $localStorage.cityLocal.length; i++) {
								if($localStorage.cityLocal[i].name == $scope.user.citySel) {
									id = $localStorage.cityLocal[i].id;
									break;
								}
							};
							$http({
								method: 'GET',
								url: '/api/sys/area/' + id + '/region'
							}).then(function(res) {
								$localStorage.regionLocal = res.data.result;
								var result = res.data.result;
								var province = [];
								for(var i = 0; i < result.length; i++) {
									province[i] = result[i].name;
								};
								$scope.region = province;
								$scope.validateform();
							});

                        });
                    });
                }else{
                    $.ajax({
                        url : '/sys/user/edit',
                        data: JSON.stringify({
                          "updatBy": 0,
                          "updateBy": 0,
                          "id": $localStorage.user.orgId,
                          "address": $scope.user.address,
                          "linkName": $scope.user.linkName,
                          "mobile": $scope.user.mobile,
                          "fax": $scope.user.fax,
                          "city": $scope.user.citySel,
                          "region": $scope.user.regionSel,
                          "province": $scope.user.proSel,
                          "realName": $scope.user.realName,
                          "roleIds": [1,2]
                        }),
                        contentType : "application/json",
                        type: 'put'
                    }).then(function(res) {
                        if(res.code==0){
                            $scope.user.province= $scope.user.proSel;
                            $scope.user.city= $scope.user.citySel;
                            $scope.user.region= $scope.user.regionSel;
                            $rootScope.$apply();
                        }
                    });
                }
			}
	} ]);