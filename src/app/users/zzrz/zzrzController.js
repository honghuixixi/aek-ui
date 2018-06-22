'use strict';

angular.module('app')
    .controller('zzrzController', [ '$rootScope', '$scope', '$http', '$state' , '$localStorage',
        function($rootScope, $scope, $http, $state, $localStorage) {
            $rootScope.userOr = false;
            $scope.base = true;
            $scope.editName = false;
            $scope.common = true;
            $scope.superviser = false;
            $scope.personal = false;
            $scope.super = false;
            $scope.company = false;
            $scope.gradelists = ["省级","市级","县级","区级"];
            $scope.categorylists = [{name: '医疗机构',value: 'MEDICAL'},{name: '行政机构',value: 'ADMINISTRATIVE'}];
            $scope.typelists = ["医疗机构","设备质控中心","疾控中心","血液中心","卫计委","保健所"];

            //头像上传预览
            $scope.avatarState = false;
            $scope.headfile = '';
            $scope.imgSrc = '';

            //省市区三级联动
            $scope.province = [];
            $scope.city = [];
            $scope.area = [];

            // $scope.baseList = [
            //  {required: '',head: '机构类别：',con: '医疗机构'},
            //  {required: '',head: '机构名称：',con: '三区卫生院'},
            //  {required: '',head: '机构类型：',con: '医疗机构/省级'},
            //  {required: '',head: '机构代码：',con: '00001234567'}
            // ];
            // $scope.commonList = [
            //  {required: '',head: '所在地区：',con: '浙江省/杭州市/萧山区'},
            //  {required: '',head: '街道地址：',con: '西行街道1号路1号'},
            //  {required: '',head: '联系人：',con: '夕木暖'},
            //  {required: '',head: '联系电话：',con: '16866668888'},
            //  {required: '',head: '传真：',con: '86057188888888'}
            // ];
            $.ajax({
                    url : '/sys/org/view/'+$localStorage.user.orgId,
                    data:  {},
                    type: 'get'
                }).then(function(result) {
                    $scope.org = result.result; // 1=省级,2=市级,3=县级,4=区级 MEDICAL=医疗机构,ADMINISTRATIVE=行政机构
                    $scope.org.proSel = $scope.org.province;
                    $scope.org.citySel = $scope.org.city;
                    $scope.org.regionSel = $scope.org.region;
                    $scope.org.categoryTransfer = $scope.org.category == 'MEDICAL'? '医疗机构':'行政机构';
                    switch ($scope.org.typeGrade){
                        case 1:
                            $scope.org.orgtypeGrade = "省级";
                            break;
                        case 2:
                            $scope.org.orgtypeGrade = "市级";
                            break;
                        case 3:
                            $scope.org.orgtypeGrade = "县级";
                            break;
                        case 4:
                            $scope.org.orgtypeGrade = "区级";
                            break;
                        default:
                            break;
                    }
                    $scope.org.orgtype = $scope.typelists[$scope.org.type-1];
                    $rootScope.$apply();
            });
            $scope.commonListEdit = [
                {required: '*',head: '街道地址：',con: '西行街道1号路1号',example: ''},
                {required: '*',head: '联系人：',con: '夕木暖',example: ''},
                {required: '*',head: '联系电话：',con: '16866668888',example: '例如：0571-88888888'},
                {required: '',head: '传真：',con: '86057188888888',example: '例如：86057188888888'}
            ];

            $scope.zzList = [
                {tit: '营业执照',src: '../../res/img/yyzz.png',img: '../../res/img/example1.png',file:''},
                {tit: '组织机构代码证',src: '../../res/img/yyzz.png',img: '../../res/img/example2.png',file:''},
                {tit: '税务登记证',src: '../../res/img/yyzz.png',img: '../../res/img/example3.png',file:''}
            ];

            //点击头像事件
            $scope.headClick = function () {
                if($scope.avatarState){
                    angular.element('#headFile').click();
                }
            }

            //证件照上传
            $scope.papersClick = function(index) {
                if($scope.avatarState){
                    angular.element('#paperFile'+index).click();
                }
            }

            $scope.pC = function () {
                if($scope.org.brief.length>=500)
                $scope.org.brief = $scope.org.brief.slice(0,500);
            }
            $scope.setImagePreview2 = function (file,id){
                var index = id.slice(9);
                var docObj=document.getElementById('paperFile'+index);
                var imgObjPreview=document.getElementById('headImg');
                if(docObj.files &&docObj.files[0]){
                    var typeArr = ['jpg','jpeg','gif','png','tiff','bmp'],
                        type = file[0].name.split('.')[1];
                    if(!$scope.contains(typeArr,type)){
                        alert('选择文件格式有误，请重新选择！');
                        return;
                    }
                    $scope.zzList[index].file = file;
//imgObjPreview.src = docObj.files[0].getAsDataURL();

//火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
//                     imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
                    $scope.zzList[index].src = window.URL.createObjectURL(docObj.files[0]);
                    $scope.zzList[index].img = window.URL.createObjectURL(docObj.files[0]);
                    $rootScope.$apply();
                }else{

                }
            }

            $scope.contains = function (arr,obj) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] === obj) {
                        return true;
                    }
                }
                return false;
            }

            //上传预览事件
            $scope.setImagePreview = function (file) {
                var docObj=document.getElementById('headFile');
                var imgObjPreview=document.getElementById('headImg');
                if(docObj.files &&docObj.files[0]){
                    var typeArr = ['jpg','jpeg','gif','png','tiff','bmp'],
                        type = file[0].name.split('.')[1];
                    if(!$scope.contains(typeArr,type)){
                        alert('选择文件格式有误，请重新选择！');
                       return;
                    }
                    $scope.headfile = file;
                    imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
                    $scope.imgSrc = window.URL.createObjectURL(docObj.files[0]);
                }else{

                }
            }

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
                        $scope.region = [];
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
            $scope.cancel = function () {
                $scope.super = !$scope.super;
                $scope.editName = !$scope.editName;
                $scope.company = !$scope.company;
                $.ajax({
                    url : '/sys/org/view/'+$localStorage.user.orgId,
                    data:  {},
                    type: 'get'
                }).then(function(result) {
                    $scope.org = result.result; // 1=省级,2=市级,3=县级,4=区级 MEDICAL=医疗机构,ADMINISTRATIVE=行政机构
                    $scope.org.proSel = $scope.org.province;
                    $scope.org.citySel = $scope.org.city;
                    $scope.org.regionSel = $scope.org.region;
                    $scope.org.categoryTransfer = $scope.org.category == 'MEDICAL'? '医疗机构':'行政机构';
                    switch ($scope.org.typeGrade){
                        case 1:
                            $scope.org.orgtypeGrade = "省级";
                            break;
                        case 2:
                            $scope.org.orgtypeGrade = "市级";
                            break;
                        case 3:
                            $scope.org.orgtypeGrade = "县级";
                            break;
                        case 4:
                            $scope.org.orgtypeGrade = "区级";
                            break;
                        default:
                            break;
                    }
                    $scope.org.orgtype = $scope.typelists[$scope.org.type-1];
                    $rootScope.$apply();
            });
            }
            $scope.toEdit = function () {
                $scope.super = !$scope.super;
                $scope.editName = !$scope.editName;
                $scope.company = !$scope.company;

                if(!$scope.editName){
                    $scope.avatarState = false;
                }else{
                    $scope.avatarState = true;
                }

                if($scope.superviser) {
                    $scope.company = false;
                }
                if($scope.editName){
                    $http({
                        method: 'GET',
                        url: '/api/sys/area/province'
                    }).then(function (res) {
                        $localStorage.provinceLocal = res.data.result;
                        var result = res.data.result;
                        var province = [];
                        for (var i = 0; i < result.length; i++) {
                            province[i] = result[i].name;
                        };
                        $scope.province = province;
                        // $scope.provChange($scope.org.proSel);
                        // $scope.cityChange($scope.org.citySel);
                        var id ;
                        for (var i = 0; i < $localStorage.provinceLocal.length; i++) {
                            if($localStorage.provinceLocal[i].name==$scope.org.proSel){
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
                            //
                            var id ;
                            for (var i = 0; i < $localStorage.cityLocal.length; i++) {
                                if($localStorage.cityLocal[i].name==$scope.org.citySel){
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
                        });
                    });
                }else{
                    for (var i = 0; i < $scope.gradelists.length; i++) {
                        if($scope.gradelists[i]==$scope.org.orgtypeGrade){
                            $scope.org.typeGrade = i+1;
                            break;
                        }
                    };
                    for (var i = 0; i < $scope.typelists.length; i++) {
                        if($scope.typelists[i]==$scope.org.orgtype){
                            $scope.org.type = i+1;
                            break;
                        }
                    };
                    var category = $scope.org.category == '医疗机构'? 'MEDICAL':'ADMINISTRATIVE';
                    $.ajax({
                        url : '/sys/org/edit',
                        data: JSON.stringify({
                          "category": category,
                          "brief": $scope.org.brief,
                          "name": $scope.org.name,
                          "code": $scope.org.code,
                          "updateBy": $localStorage.user.id,
                          "id": $localStorage.user.orgId,
                          "contactPerson": $scope.org.contactPerson,
                          "city": $scope.org.citySel,
                          "fax": $scope.org.fax,
                          "phone": $scope.org.phone,
                          "province": $scope.org.proSel,
                          "region": $scope.org.regionSel,
                          "type": $scope.org.type,
                          "typeGrade": $scope.org.typeGrade
                        }),
                        contentType : "application/json",
                        type: 'put'
                    }).then(function(res) {
                    });
                }
            }
    } ]);