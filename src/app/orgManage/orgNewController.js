'use strict';
angular.module('app').controller('orgNewController', ['$scope' ,'$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', '$http','$filter', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage,$http,$filter) {
    //底部高度设置，使其占满剩余全部
    $scope.resetBottomHeight = function() {
        var Maxheight = angular.element('.app-content-body').height();
        var topHighe = angular.element('.head-top').height();

        angular.element('.org-panel').css('min-height', Maxheight - 70);
    }
    $scope.resetBottomHeight();
    $scope.localStorageHad=function(){
        if(!$localStorage.userInfo){
            return $state.go('website.home');
        }
    }
    $scope.localStorageHad();


    //机构名称
    $scope.name = '';
    $scope.nameState = false;
    $scope.nameVerify = function () {
        if($scope.name && $scope.name.length<=40){
            $scope.nameState = false;
        }
    }

    //医疗机构代码
    $scope.hospCode = '';
    $scope.hosState = false;
    $scope.hosVerify = function () {
        if($scope.hospCode){
            $scope.hosState = false;
        }
    }

    //图片上传状态
    $scope.fileUpload = true;

    //是否测试机构  默认为否
    $scope.isTest = 1;
    //子机构限制
    $scope.allowChild = 0;
    //到期时间
    $scope.expireState = 0;
    //是否医疗机构
    $scope.isMed = false;

    //机构代码
    $scope.license = null;

    //机构代码图片
    $scope.orgFile = '';
    $scope.imgClick = false;
    $scope.imgSrc = '../../../res/img/file-pic.png';

    //租户类型 -------------已去除
    $scope.userType = {id:0,name:'请选择'};
    $scope.userTypeArr = $localStorage.baseOrg && $localStorage.baseOrg.tenantType;
    $scope.isHpl = function (item,mod) {
        $scope.userType = {id:item.id,name:item.name};
        $scope.userType.id == 1 ? ($scope.isMed = true) : ($scope.isMed = false);
        $scope.userTypeState = false;
    }
    //账户类型
    $scope.accountType = {id:'null',name:'请选择'};
    $scope.accountTypeArr = $localStorage.baseOrg && $localStorage.baseOrg.tenantAccountType;
    $scope.isAccount = function (item,mod) {
        $scope.accountType = {id:item.id,name:item.name};
        $scope.accountTypeState = false;
    }

    //获取上级行政机构
    $scope.getManageTenant = function (province) {
        $scope.selected.superiorUnit = {id:'null',name:'请选择'};
        $scope.superiorUnitArr = [];
        $.ajax({
            type:'get',
            async:false,
            url:'/sys/tenant/all/manageTenant?province=',
            complete:function (res) {
                if(res.responseJSON.code == 200){
                    $scope.superiorUnitArr = res.responseJSON.data;
                }
            }
        })
    }

    //上级行政机构
    // $scope.superiorUnit = {id:'null',name:'请选择'};
    $scope.superiorUnitArr = [];
    $scope.isSuperiorUnit = function (item,mod) {
        $scope.superiorUnit = {id:item.id,name:item.name};
        $scope.superiorUnitState = false;
    }
    
    //机构类别
    $scope.orgType = '';
    $scope.orgTypeArr =$localStorage.baseOrg &&  $localStorage.baseOrg.tenantCategory;
    $scope.orgTypes = function (item, model) {
        $scope.orgType = {id:item.id,name:item.name};
    }
    //经济类型
    $scope.economyType = {id:'null',name:'请选择'};
    $scope.economyTypeArr = $localStorage.baseOrg && $localStorage.baseOrg.tenantEconomicType;
    $scope.economyTypeSel = function (item,mod) {
        $scope.economyType = {id:item.id,name:item.name};
    }
    //机构分类管理类型
        $scope.orgClassType = '';
    $scope.orgClassTypeArr =$localStorage.baseOrg && $localStorage.baseOrg.tenantManageType;
    $scope.orgClassTypeSel = function (item,mod) {
        $scope.orgClassType = {id:item.id,name:item.name};
    }
    //医院等级 等次
    $scope.grade = {id:'',name:'级别'};
    $scope.gradeArr =$localStorage.baseOrg &&  $localStorage.baseOrg.tenantGrade;
    $scope.gradeChange = function (item,mod) {
        $scope.grade = item
    }

    $scope.level = {id:'',name:'等次'};
    $scope.levelArr =$localStorage.baseOrg && $localStorage.baseOrg.tenantHierarchy;
    $scope.levelChange = function (item,mod) {
        $scope.level = item
    }
    

    $rootScope.currentmodule = "医疗机构管理";
    //省市区三级联动
    $scope.province = [];
    $scope.proSel = {id:0,name:'省份'};
    $scope.city = [];
    $scope.citySel = {id:0,name:'城市'};
    $scope.regionSel = {id:0,name:'区县'};
    $scope.area = [];

    //子机构限制
    $scope.childStr = '';
    $scope.childError = false;
    $scope.childOrg = true;

    $scope.childChange = function (e) {
        var reg = /^[1-9][0-9]*$/;
        if($scope.childStr){
            reg.test($scope.childStr) ? ($scope.childError = false) : ($scope.childError = true);
        }else{
            $scope.childError = false;
        }
    }
    $scope.childOrgFn = function (e) {
        var v = e.target.value;
        v == '0'?($scope.childOrg=true,$scope.childStr = '',$scope.childError = false):($scope.childOrg=false);
    }

    //到期时间
    $scope.expireStr = '';
    $scope.expireStrDate = new Date();
    $scope.expireDate = true;
    $scope.expireDateFn = function (e) {
        var v = e.target.value;
        v == '0'?($scope.expireDate=true,$scope.expireStr = null,$scope.expireStrDate = null):($scope.expireDate=false);
    }

    $scope.initialDate = function (str) {
        if(!str){
            // var _winHeight = window.innerHeight,
            //     _thisTop = angular.element('#expireDate').offset().top;
            //
            // if(_winHeight-_thisTop<230){
            //     angular.element('#expireDate').attr('data-offset','istop');
            // }else{
            //     angular.element('#expireDate').attr('data-offset','isbottom');
            // }
            $scope.expireStr = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.expireStrDate = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1000);
        }
    }


    //是否显示右侧管理员模块
    $scope.showRightCon = false;

    //右侧验证

    //管理员姓名
    $scope.realName = '';
    $scope.adminNameStatus = false;
    $scope.adminNameVerify = function () {
        if(!$scope.realName){
            $scope.adminNameStatus = true;
        }else if($scope.realName.length>40){
            $scope.adminNameStatus = true;
        }else{
            $scope.adminNameStatus = false;
        }
    }

    $scope.adminTel = '';
    $scope.adminTelStatus = false;
    $scope.adminTelVerify = function () {
        if($scope.adminTel){
            var reg = /^(1[3-8][0-9])\d{8}$/;
            reg.test($scope.adminTel) ? ($scope.adminTelStatus = false) : ($scope.adminTelStatus = true);
        }
    }

    $scope.adminMail = '';
    $scope.adminMailStatus = false;
    $scope.adminMailVerify = function () {
        if($scope.adminMail){
            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ;
            reg.test($scope.adminMail) ? ($scope.adminMailStatus = false) : ($scope.adminMailStatus = true);
        }
    }

    $scope.adminPwd = '';
    $scope.adminPwdStatus = false;
    $scope.pwdState = true;
    $scope.adminPwdVerify = function (){
        if($scope.adminPwd){
            if($scope.adminPwd.length<8 || $scope.adminPwd.length>16){
                $scope.adminPwdStatus = true;
            }else{
                var regNull=/^[\S]*$/g;
                    if(regNull.test($scope.adminPwd)){
                    $scope.adminPwdStatus = false;
                }else{
                    $scope.adminPwdStatus = true;
                }
            }
        }
    }
    $scope.changePwd = function (n) {
        n == 0 ? ($scope.pwdState = true) : ($scope.pwdState = false);
    }

    $scope.getAreaName = function (id, arr) {
        if(!arr || arr.length == 0){
            return;
        }
        for(var i = 0; i<arr.length;i++){
            if(id == arr[i].id){
                return arr[i].name;
            }
        }
    }

    //返回机构详情
    $scope.toDetail = function () {
        $state.go('org.detail',{id:$stateParams.id,loginId:$stateParams.loginId});
    }

    $scope.pageInfo = $scope.res;
    $scope.toAssets = function() {
        $state.go('org.add',{id:$stateParams.id});
    }
    $scope.selected={
        superiorUnit:{id:'null',name:'请选择'},
    	citySel:{id:0,name:'城市'},
    	regionSel:{id:0,name:'区县'}
    }

    $scope.getManageTenant();

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
                    // $scope.$apply();
                }
            }
        })
    }

    $scope.regionChange = function (item, mod) {
        $scope.selected.regionSel = item;
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
            }
        }
    });

    //初始化日历
    $scope.initcalendar = function() {
        var option = {
            format: 'YYYY-MM-DD',
            startDate: '2017-01-01',
            endDate: new Date(),
            minDate:new Date(new Date()-24*60*60*1000),
            maxDate: new Date("2050-01-01"),
            timePicker: false,
            opens: "top",
            /*parentEl:'.org-initDate',*/
            isCotrScollEl:".org-content-detail",
            singleDatePicker: true
        };

        angular.element('.input-datepicker').daterangepicker($.extend({}, option, {
            startDate: new Date()
        }), function(date, enddate, el) {
            // console.log(date)
            // var currentel = $(this.element).attr("name");
            // // console.log(new Date(new Date(date).getTime() + 24*60*60*1000).getDate());
            // // currentel == "expireDate" && ($scope.expireStr = date.format('YYYY-MM-DD'),$scope.expireStrDate = new Date(date));
            // if(currentel == "expireDate"){
            //     $scope.expireStr = date.format('YYYY-MM-DD');
            //     // $scope.expireStrDate = new Date(date);
            //     $scope.expireStrDate = new Date(new Date(new Date(date).toLocaleDateString()).getTime()+24*60*60*1000-1000);
            // }
            // $rootScope.$apply();
        });

        $('#expireDate').on('apply.daterangepicker', function(a,b) {
            var currentel = b.element[0].name;
            if(currentel == "expireDate"){
                $scope.expireStr = b.startDate.format('YYYY-MM-DD');
                // $scope.expireStrDate = new Date(date);
                $scope.expireStrDate = new Date(new Date(new Date(b.startDate).toLocaleDateString()).getTime()+24*60*60*1000-1000);;
            }
            $rootScope.$apply();
        });
    }



    $scope.runDate = function (num) {
        if($scope.expireState == '1'){
            var date = new Date();//获取当前时间
            date.setDate(date.getDate()+num);//设置天数 -1 天
            var dateStr = date.getFullYear()+'-'+(+date.getMonth()+1)+'-'+date.getDate();
            $scope.expireStr = dateStr;
            $scope.expireStrDate = new Date(new Date(new Date(dateStr).toLocaleDateString()).getTime()+24*60*60*1000-1000);
        }
    }

    $scope.initcalendar();

    $scope.fileImg = function() {
        angular.element('#imgFile').click();
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

    $scope.imgChange = false;
    $scope.imgChangeFn = function () {
        if((!$scope.addOrEdit && $scope.imgSrc != '../../../res/img/file-pic.png') || ($scope.addOrEdit && $scope.imgSrc && $scope.imgSrc != '../../../res/img/file-pic.png')){
            $scope.imgChange=true;
        }
    }

    $scope.imgChangeFn2 = function () {
        $scope.imgChange=false;
    }

    $scope.delect = function () {
        $scope.imgSrc = '../../../res/img/file-pic.png';
        $scope.fileUploadUrl = null;
        document.getElementById('imgFile').value = '';
        $scope.imgClick = false;
    }

    //上传预览事件
    $scope.setImagePreview = function(file) {
        var docObj = document.getElementById('imgFile');
        // var imgObjPreview = document.getElementById('headImg');
        if(docObj.files && docObj.files[0]) {
            var typeArr = ['jpg', 'jpeg', 'gif', 'png', 'tiff', 'bmp','PNG','JPG'],
                type = file[0].name.split('.')[file[0].name.split('.').length-1].toLocaleLowerCase();
            // console.log(file[0].name.split('.')[file[0].name.split('.').length-1]);
            if(!$scope.contains(typeArr, type)) {
                // alert('选择文件格式有误，请重新选择！');
                var msg = layer.msg('<div class="toaster"><span>选择文件格式有误，请重新选择！</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
                docObj.value = '';
                return;
            }

            var size = file[0].size / (1024 * 1024);
            if(size>2){
                // alert('选择文件过大，请重新选择！');
                var msg = layer.msg('<div class="toaster"><span>选择文件过大，请重新选择！</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
                docObj.value = '';
                return;
            }

            $scope.orgFile = file;
            //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
            $scope.imgClick = true;
            $scope.imgSrc = window.URL.createObjectURL(docObj.files[0]);
            //图片上传状态
            $scope.fileUpload = false;

            var file = $('#imgFile')[0].files[0];


            var formData = new FormData();
            formData.append("files", file);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/upload/');
            xhr.setRequestHeader("X-AEK56-Token", $localStorage["X-AEK56-Token"]);
            xhr.send(formData);
            xhr.onreadystatechange = function () {
                var res = xhr.response;
                if(res){
                    if(JSON.parse(res).code == '200'){
                        $scope.fileUpload = true;
                        $scope.fileUploadUrl = JSON.parse(res).data[0];
                    }
                }
            }

            $rootScope.$apply();
        } else {

        }
    }
    $scope.addOrEdit = false;
    $.ajax({
        // url: '/apis/perms',
        url: '/oauth/cache/permission/list',
        data:{tenantId:$stateParams.id},
        type: 'post'
    }).then(function(res) {
        $scope.userInfo.adminFlag = res.adminFlag;
    	if(!$scope.userInfo.adminFlag && res.tenantType == 1){
    	    $scope.isMed = true;
        }
        $scope.$apply();
    })

    $scope.superiorUnitState2 = false;

    //验证并获取上级行政机构
    $scope.getSuperior = function () {
        if(!$scope.proSel.id){
            $scope.superiorUnitState2 = true;
            return;
        }else{
            $scope.superiorUnitState2 = false;
        }
    }


    //提交提示
    $scope.layerWin = function () {
        var index=layer.open({
            time: 0 //不自动关闭
            ,content: '<div class="pad-fifty">是否提交？</div>'
            ,title: ['提示','font-size: 14px;color: #fff;background-color: rgb(74, 178, 155);line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
            ,closeBtn: 1
            ,shade: 0.3
            ,shadeClose: true
            ,btn: ['确定', '取消']
            ,yes: function(index){
                $scope.submit();
                layer.close(index);
            }
            ,area: ['500px','220px']
            ,btnAlign: 'c'
        });
        layer.style(index, {
            fontSize: '16px',
            backgroundColor: '#fff',
        });
    }

    //返回机构机构列表
    $scope.toList = function () {
        $state.go('org.index', {id: $stateParams.id});
    }

    //提交状态验证，防止多次提交
    $scope.submitState = false;

    $scope.submit = function () {
        var type = 'post';
        var url = '/sys/tenant/';

        var hplTenant = {};
        // if($scope.userType.id == 1){
        //     hplTenant = {
        //         category: $scope.orgType.id,
        //         economicType: $scope.economyType.id,
        //         grade: $scope.orgClassType.id,
        //         hierarchy: $scope.level.id,
        //         manageType: $scope.grade.id
        //     }
        // }

        hplTenant = {
            category: $scope.orgType.id,
            economicType: $scope.economyType.id,
            manageType: $scope.orgClassType.id,
            hierarchy: $scope.level.id,
            grade: $scope.grade.id,
            orgCode:$scope.hospCode
        }

        if($scope.expireState == 0){
            $scope.expireStrDate = null;
        }


        var data = {
            // city:$scope.getAreaName($scope.citySel,$scope.city),
            city:$scope.selected.citySel.name,
            commercialUse:$scope.accountType.id,
            county:$scope.selected.regionSel.name,
            createAdmin:$scope.showRightCon,
            createBy:$localStorage.userInfo.id,
            email:$scope.adminMail,
            // expireTime:$scope.expireStr,
            expireTime:$scope.expireStrDate,
            hplTenant:hplTenant,
            license: $scope.license,
            licenseImgUrl: $scope.fileUploadUrl || null,
            mobile:$scope.adminTel,
            name:$scope.name,
            parentId:$stateParams.id,
            province:$scope.proSel.name,
            realName:$scope.realName.trim().replace(/\s/g,""),
            subTenantLimit: $scope.allowChild == 1 ? (+$scope.childStr) : ($scope.allowChild),
            tenantType:1, //医疗机构
            trial:$scope.isTest,
            manageTenantId:$scope.selected.superiorUnit.id,
            updateBy:$localStorage.userInfo.id
        };

        //提交验证
        if(!$scope.name){
            $scope.nameState = true;
            return;
        }else if($scope.name && $scope.name.length>40){
            $scope.nameState = true;
            return;
        }else{
            $scope.nameState = false;
        }

        // if(!$scope.userInfo.adminFlag){
        //
        // }else{
        //     if(!$scope.userType.id){
        //         $scope.userTypeState = true;
        //         return;
        //     }else{
        //         $scope.userTypeState = false;
        //     }
        // }


        if($scope.accountType.id == 'null'){
            $scope.accountTypeState = true;
            return;
        }else{
            $scope.accountTypeState = false;
        }

        if($scope.proSel.id && $scope.selected.citySel.id && $scope.selected.regionSel.id){
            $scope.areaState = false;
        }else{
            $scope.areaState = true;
            return;
        }

        if($scope.selected.superiorUnit.id == 'null'){
            $scope.superiorUnitState = true;
            return;
        }else{
            $scope.superiorUnitState = false;
        }

        //医疗代码验证
        if(!$scope.hospCode){
            $scope.hosState = true;
            return;
        }else{
            $scope.hosState = false;
        }
        // if(!$scope.hospCode){
        //     $scope.hosState = true;
        //     return;
        // }else if($scope.hospCode && $scope.hospCode.length>7){
        //     $scope.hosState = true;
        //     return;
        // }else if($scope.hospCode.length<=7){
        //     $scope.hosState = false;
        //     var _len = 7 - $scope.hospCode.length,
        //         _str = '0000000'.slice(0,_len);
        //     $scope.hospCode = (_str + $scope.hospCode).toString();
        //     data.hplTenant.orgCode = $scope.hospCode;
        // }


        //子机构验证
        if($scope.childError){
            return;
        }

        if($scope.showRightCon){
            //管理员姓名
            if(!$scope.realName){
                $scope.adminNameStatus = true;
                return;
            }else if($scope.realName.length>40){
                $scope.adminNameStatus = true;
                return;
            }else{
                $scope.adminNameStatus = false;
            }

            //手机
            if(!$scope.adminTel){
                $scope.adminTelStatus = true;
                return;
            }else{
                var reg = /^(1[3-8][0-9])\d{8}$/;
                if(reg.test($scope.adminTel)){
                    $scope.adminTelStatus = false;
                }else{
                    $scope.adminTelStatus = true;
                    return;
                }
            }

            //邮箱
            if($scope.adminMail){
                var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ;
                if(reg.test($scope.adminMail)){
                    $scope.adminMailStatus = false;
                }else{
                    $scope.adminMailStatus = true;
                    return;
                }
            }

            //密码
            if(!$scope.detail || $scope.adminNull){
                if(!$scope.adminPwd){
                    $scope.adminPwdStatus = true;
                    // $scope.$apply();
                    return;
                }else{
                    if($scope.adminPwd.length<8 || $scope.adminPwd.length>16){
                        $scope.adminPwdStatus = true
                        // $scope.$apply();
                        return;
                    }else{
                        var regNull=/^[0-9A-Za-z]*$/g;
                        if(!regNull.test($scope.adminPwd)){
                            $scope.adminPwdStatus = true;
                            // $scope.$apply();
                            return;
                        }else{
                            $scope.adminPwdStatus = false;
                            data.password = $scope.adminPwd;
                            // $scope.$apply();
                        }
                    }
                }
            }

        }

        if($scope.detail&&$scope.detail.realName&&$scope.addOrEdit){
            data.createAdmin = false;
        }
        if($scope.addOrEdit){
            data.id = $scope.detailId;
            data.parentId = $scope.parentId;
            type = 'put';
            url = '/sys/tenant/edit';
        }

        if(!$scope.fileUpload){
            return;
        }

        if(!$scope.submitState){
            $scope.submitState = true;
        }else{
            return;
        }

        $.ajax({
            type: type,
            url: url,
            async:false,
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(data),
            complete: function(res) {
                if(res.responseJSON.code == 200) {
                    // var msg = layer.msg('<div class="toaster"><span>保存成功</span></div>', {
                    //     area: ['100%', '60px'],
                    //     time: 3000,
                    //     offset: 'b',
                    //     shadeClose: true,
                    //     shade: 0
                    // });
                    
                     $state.go('org.detail', {id: res.responseJSON.data.id,loginId:$stateParams.loginId||$localStorage.userInfo.tenantId ,isOpMsg:'保存成功',isOp:true})
                    
                   /* if($stateParams.loginId == 0){
                    	org.detail({id: item.id,loginId:$stateParams.id})
                        $state.go('org.index', {id: $stateParams.id,isOpMsg:'保存成功',isOp:true});
                      
                        
                    }else{
                        $state.go('org.index', {id: $stateParams.loginId,isOpMsg:'保存成功',isOp:true});
                        // $state.go('org.index', {id: $stateParams.id});
                    }*/
                }else{
                    var msg = layer.msg('<div class="toaster"><span>'+res.responseJSON.msg+'</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                    $scope.submitState = false;
                }
            }
        });
    }

}]);