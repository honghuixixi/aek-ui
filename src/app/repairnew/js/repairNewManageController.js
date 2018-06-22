'use strict';

angular.module('app')

.controller('repairNewManageController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
	$rootScope.currentmodule = "维修管理";

    $scope.assetsDescCg=function(a){
        $scope.assetsInit(a);
    }
    
    $scope.assetsInit=function(a){
        $scope.assetsDesc=a; // 资产描述
        if(a==1){
            $scope.pageInfo={
                current: 1,
                size: 16,
                pstyle: 1,
                ppSize: 1
            }
            $scope.searchOfficeCon='';
            $scope.searchDeptCon='';
            $scope.addData = [];
            $scope.nocontent = false;
            $scope.onloading = false;
            $scope.pagination();
            return;
        }
        $scope.getPeople();
        //故障现象
        $scope.faultDesc='';
        $scope.faultDescErr=false;
        $scope.clickAdd = true;
        $scope.url = [];
        $scope.urls = [];
        $scope.repairFiles=[];
        $scope.radioT = 1;
        $scope.orderTakerErr=false;
        $scope.sendInfo = {
            sendPerson: '',
            sendPhone: ''
        };
        $scope.asset2={
            assetsName: '',
            assetsDesc: 2,
            assetsNameErr:false,
            assetsLocal: '',
            assetsLocalErr:false,
            assetsDeptName: $localStorage.userInfo.deptName,
            assetsDeptId: $localStorage.userInfo.deptId,
            deptErr: false,
            assetsNum: '',
            assetsSpec: ''
        };
        $scope.searchList();
        $timeout(function() {
            angular.element('.muchinput').change(function(){
            var _length = $scope.url.length;
            if (_length == 5) {
                $scope.clickAdd = false;
            }
            if(_length>5){
                var msg = layer.msg('<div class="toaster"><span>' + '最多上传五张' + '</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
            }else{
                for(var i=0;i<$(this)[0].files.length;i++){
                    var _type = $(this)[0].files[i].type
                    var _size = $(this)[0].files[i].size/(1024*1024)
                    if(_size>2){
                        var msg = layer.msg('<div class="toaster"><span>' + '图片大于2M，上传失败' + '</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                        return;
                    }
                    if(_type=='image/png'||_type=='image/jpg'||_type=='image/jpeg') {
                        if (_length == 4) {
                            $scope.clickAdd = false;
                        }
                            var windowUrl = window.URL || window.webkitURL;
                            var _data = windowUrl.createObjectURL($(this)[0].files[i])
                            // 去重
                            if ($scope.url.join().indexOf(_data) == -1) {
                                $scope.url.push(_data)
                                $scope.repairUploadImg($(this)[0].files[0]);
                            }
                            $rootScope.$apply();
                    }
                    if (_type != 'image/png' && _type != 'image/jpg' && _type != 'image/jpeg') {
                        var msg = layer.msg('<div class="toaster"><span>' + '图片格式错误，上传失败' + '</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                }
            }
        });
        }, 10);
    }
    
    $scope.setDeptName=function(item){
        $scope.asset2.assetsDeptName = item.name;
        $scope.asset2.assetsDeptId = item.id;
        $scope.asset2.deptErr = false;
    }
    $scope.assetInfoCg=function(param){
        $scope.asset2[param+'Err']=false;
    }
    $scope.submitAsset=function(){
        if(!$scope.asset2.assetsName){
            return $scope.asset2.assetsNameErr = true;
        }
        if(!$scope.asset2.assetsLocal){
            return $scope.asset2.assetsLocalErr = true;
        }
        if(!$scope.asset2.assetsDeptId){
            return $scope.asset2.deptErr = true;
        }
        if(!$scope.orderTaker.id){
            return $scope.orderTakerErr=true;
        }
        if(!$scope.faultDesc){
            return $scope.faultDescErr=true;
        }
        $scope.newRepair();
    }
    // 故障现象
    $scope.$watch('faultDesc', function(newValue, oldValue, scope) {
        $scope.faultDescErr=false;
    });
    $scope.pagination=function(page,size){
        $scope.addData = [];
        $scope.addList = null;
        $scope.hasChoose = false;
        $scope.onloading = true;
        $scope.nocontent = false;
        $scope.officeResult=[];
            $.ajax({
                type: 'get',
                url: '/assets/assetsInfo/getLedgerPage',
                data: {
                    "page.current": page||$scope.pageInfo.current,
                    "page.size": size||$scope.pageInfo.size,
                    'keyword': $scope.searchDeptCon,
                    'status': 99
                },
                complete: function(res) {
                    $scope.onloading = false;
                    $scope.nocontent = false;
                    var code = res.responseJSON.code;
                    if(code==500){
                        $scope.nocontent=true;
                    }else if(code==200){
                        var resData = res.responseJSON.data;
                        $scope.pageInfo = res.responseJSON.data;
                        $scope.pageInfo.pstyle = 1;
                        if(!resData.records.length){
                            $scope.nocontent = true;
                        }else{
                            $scope.addData = resData.records;
                        }
                    }
                    $rootScope.$apply();
                }
            });
    }
    
    $scope.searchDeptAndOffice=function(){
        $scope.addData = [];
        $.ajax({
            type: 'get',
            url: '/assets/assetsInfo/getLedgerPage',
            data: {
                "page.current": 1,
                "page.size": $scope.pageInfo.size,
                'keyword': $scope.searchDeptCon,
                'status': 99
            },
            complete: function(res) {
                $scope.onloading = false;
                $scope.nocontent = false;
                var code = res.responseJSON.code;
                if(code==500){
                    $scope.nocontent=true;
                }else if(code==200){
                    var resData = res.responseJSON.data;
                    $scope.pageInfo = res.responseJSON.data;
                    $scope.pageInfo.pstyle = 2;
                    if(!resData.records.length){
                        $scope.nocontent = true;
                    }else{
                        $scope.addData = resData.records;
                    }
                }
                $rootScope.$apply();
            }
        });
    }
    $scope.assetsInit(1);
    // 非固定资产申请信息填写
    // 点击上传图片
        $scope.upload = function(){
            angular.element('.muchinput').val('');
            angular.element('.muchinput').click()
        }
        
        $scope.repairUploadImg=function(a,b,c){
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
                        if(c){
                            return $scope.attachment=JSON.parse(res).data[0];
                        }
                        if(b){
                            $scope.urls[b]=JSON.parse(res).data[0];
                        }else{
                            $scope.urls.push(JSON.parse(res).data[0]);
                        }
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
        // 删除图片
        $scope.delect = function($index){
            $scope.delactInput=!$scope.delactInput;
            $scope.url.splice($index,1)
            $scope.urls.splice($index,1)
            if($scope.url.length<=4){
                $scope.clickAdd = true
            }
        }
        $scope.replaceImg=function(){
             var _type = $('.oneinput')[0].files[0].type
                var _size = $('.oneinput')[0].files[0].size/(1024*1024)
                if(_size>2){
                    var msg = layer.msg('<div class="toaster"><span>' + '图片大于2M，上传失败' + '</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                    $(".oneinput").val(''); 
                }
                if(_type!='image/png'&&_type!='image/jpg'&&_type!='image/jpeg'){
                    var msg = layer.msg('<div class="toaster"><span>' + '图片格式错误，上传失败' + '</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                   $(".oneinput").val('');   
                    
                }
                if(_type=='image/png'||_type=='image/jpg'||_type=='image/jpeg'){
                    if(_size<=2) {
                        var windowUrl = window.URL || window.webkitURL;
                        var data = windowUrl.createObjectURL($('.oneinput')[0].files[0]);
                        $scope.url.splice($scope.curRelaceIndex, 1, data);
                        $scope.repairUploadImg($('.oneinput')[0].files[0], $scope.curRelaceIndex)
                    }
                }       
        }
        // 更换图片
        $scope.replace = function($index){
            angular.element('.oneinput').click();
            $scope.curRelaceIndex=$index;
        }

        $scope.faultDesc='';
        $scope.repairDesAdd=function(a){
            $scope.faultDesc+=a;
            $scope.faultDesc=$scope.faultDesc.slice(0,300);
        }
        $scope.radioC=function(a){
            $scope.radioT=a;
        }
        $scope.searchList = function() {
            $.ajax({
                type: "get",
                url: "/sys/dept/search/tenant/" + $localStorage.userInfo.nowOrgId,
                complete: function(res) {
                    if(res.responseJSON.code == 200) {
                        $scope.orgList = res.responseJSON.data;
                        $scope.$apply();
                    }
                }
            });
        }
        // repair new 
        $scope.newRepair=function(){
            $.ajax({
                type: "post",
                url: "/newrepair/repRepairApply/add" ,
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify($.extend($scope.asset2,{
                    "tenantId": $localStorage.userInfo.tenantId,
                    "faultDesc": $scope.faultDesc,
                    "deptId": $localStorage.userInfo.deptId,
                    "deptName": $localStorage.userInfo.deptName,
                    "sendPerson": $scope.sendInfo.sendPerson, //送修人
                    "sendPhone": $scope.sendInfo.sendPhone, //送修电话
                    "takeOrderId": $scope.orderTaker.id,
                    "takeOrderName": $scope.orderTaker.realName,
                    "reportStatus": $scope.radioT,
                    "assetsImg": $scope.urls.join(','),
                    "assetsStatus": 1,
                    "assetsFile": JSON.stringify($scope.repairFiles)
                })),
                complete: function(res){
                    if (res.responseJSON.code == 200) {
                        $state.go('repair.newweixiu',{status: 6,applyId: res.responseJSON.data.id},{reload: true});
                    }else{
                        var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                    $rootScope.$apply();
                }
            });
        }
        $scope.choosePeopleList = function(a){
            $.ajax({
                type: "get",
                url: '/newrepair/repRepairConfig//selectUsers',
                complete: function(res){
                    if (res.responseJSON.code == 200) {
                        $scope.peopleListman = res.responseJSON.data
                        $scope.newErrorman = false
                        $scope.newmanError = ''
                        $scope._indexId  = $scope._indexIdsure
                        $scope.repairmanName = $scope._repairName
                        console.log($scope.repairmanIdsure)
                        console.log($scope.repairmanNamesure)
                    }
                }
            })
        }
        $scope.choosePeopleList();
        $scope.choosePeople = function(a){
            console.log($scope._indexId,$scope.peopleListman);
            var index=layer.open({
                time: 0
                ,type: 1
                ,content: $('#namemanAlert')
                ,title: ['选择接单人','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                ,closeBtn: 1
                ,shade: 0.3
                ,shadeClose: true
                ,btn: 0
                ,area: ['700px','500px']
            });
        }
        // 选中维修人对勾出现
        $scope.choosemanPeople = function(l,index){
            $scope._indexId = l.id;
            $scope.repairmanId = l.id;
            $scope.repairmanName = l.realName;
            $scope.repairMobile = l.mobile;
            $scope.newmanError = false
        }
        // 点击确定
        $scope.choosePeopleYesman = function(){
            if(!$scope.repairmanName){
                $scope.newmanError = true
            }else{
                $scope.manerror = false
                $scope._indexIdsure = $scope._indexId
                $scope._repairName = $scope.repairmanName
                $scope.repairmanIdsure = $scope.repairmanId
                $scope.repairmanNamesure = $scope.repairmanName
                layer.closeAll();
                $scope.orderTaker={
                    id: $scope.repairmanIdsure,
                    mobile: $scope.repairMobile,
                    realName: $scope.repairmanName
                };
                $scope.orderTakerErr=false;
                console.log($scope.sendInfo);
                console.log($scope.orderTaker);
                console.log($scope.repairmanIdsure)
                console.log($scope.repairmanNamesure)
            }

        }
        // 点击取消
        $scope.peopleCancle = function(){
            $scope._indexId  = $scope._indexIdsure
            $scope.repairmanName = $scope._repairName
            console.log($scope.repairmanIdsure)
            console.log($scope.repairmanNamesure)
            layer.closeAll();
        }
        $scope.getPeople=function(){
            $.ajax({
                type: "get",
                url: '/newrepair/repRepairConfig/selectConfiger',
                data: {
                    deptId: $localStorage.userInfo.deptId
                },
                complete: function(res){
                    if (res.responseJSON.code == 200) {
                        var obj = {
                            id: null,
                            mobile: null,
                            realName: null
                        };
                        $scope.orderTaker=res.responseJSON.data?res.responseJSON.data:obj;
                        $scope._indexId=$scope.orderTaker?$scope.orderTaker.id?$scope.orderTaker.id:null:null;
                        $scope.$apply();
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
            })
        }
}]);

