'use strict';
angular.module('app').controller('supplierAddController', ['$scope' ,'$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', '$http','$filter', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage,$http,$filter) {
    $rootScope.currentmodule = "供应商管理";
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
    $scope.accountType = {id:'',name:'请选择'};
    $scope.accountTypeArr = [{id:'1',name:'维修商'},{id:'2',name:'供货商'},{id:'3',name:'配件供应商'},{id:'4',name:'综合服务商'},{id:'5',name:'其他'}];
    $scope.isAccount = function (item,mod) {
        $scope.accountType = {id:item.id,name:item.name};
        $scope.accountTypeState = false;
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
    $scope.economyType = {name:'请选择'};
    $scope.economyTypeArr = [{name:'请选择'},{name:'中国工商银行'},{name:'中国建设银行'},{name:'中国银行'},{name:'中国农业银行'},{name:'交通银行'},{name:'招商银行'}
    ,{name:'光大银行'},{name:'中信实业银行'},{name:'上海银行'},{name:'上海浦东发展银行'},{name:'兴业银行'},{name:'民生银行'},{name:'北京市商业银行'}
    ,{name:'广东发展银行'},{name:'深圳发展银行'},{name:'华夏银行'},{name:'天津市商业银行'},{name:'深圳市商业银行'},{name:'南京市商业银行'},{name:'恒丰银行'}];
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
            $scope.expireStr = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.expireStrDate = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1000);
        }
    }


    //是否显示右侧管理员模块
    $scope.showRightCon = false;
    $scope.$watch('showRightCon', function(newValue, oldValue, scope) {
        if(!newValue){
            $scope.adminNameStatus=false;
            $scope.adminTelStatus=false;
            $scope.adminMailStatus=false;
            $scope.adminPwdStatus=false;
            $scope.realName='';
            $scope.adminTel='';
            $scope.adminMail='';
            $scope.adminPwd='';
        }
    });

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
        }else{
            $scope.adminMailStatus = false;
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
        $state.go('supplier.detail.model',{tenantId:$stateParams.tenantId,supplierId:$stateParams.supplierId});
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

    //省市区联动
    $scope.provChange = function (item,mod) {
        $scope.proSel = item;
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
                    if(mod&&mod.city){
                        for(var i=0;i<result.length;i++){
                            if(result[i].name == mod.city){
                                $scope.selected.citySel = {id:result[i].id,name:mod.city};
                            }
                        }
                        $scope.cityChange($scope.selected.citySel,mod.county);
                    }
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

                    if(mod){
                        for(var i=0;i<result.length;i++){
                            if(result[i].name == mod){
                                $scope.selected.regionSel = {id:result[i].id,name:mod};
                            }
                        }
                    }
                }
            }
        })
    }

    $scope.regionChange = function (item, mod) {
        $scope.selected.regionSel = item;
    }

    //初始化日历
    $scope.initcalendar = function() {
        var option = {
            format: 'YYYY-MM-DD',
            startDate: new Date(),
            endDate: new Date(),
            drops: 'up',
            minDate:new Date(new Date()-24*60*60*1000),
            maxDate: new Date("2050-01-01"),
            // parentEl: '.supper_detail',
            isCotrScollEl: '.supper_detail',
            opens: 'left',
            timePicker: false,
            singleDatePicker: true
        };
        angular.element('.input-datepicker').daterangepicker($.extend({}, option, {}), function(date, enddate, el) {});
        $('#datepicker1').on('apply.daterangepicker', function(a,b) {
            $scope.objList[0].expireTime=new Date(b.startDate).getTime();
        });
        $('#datepicker2').on('apply.daterangepicker', function(a,b) {
            $scope.objList[1].expireTime=new Date(b.startDate).getTime();
        });
        $('#datepicker3').on('apply.daterangepicker', function(a,b) {
            $scope.objList[2].expireTime=new Date(b.startDate).getTime();
        });
        angular.element('#datepicker4').daterangepicker($.extend({}, option, {}), function(date, enddate, el) {});
        $('#datepicker4').on('apply.daterangepicker', function(a,b) {
            $scope.objList[3].expireTime=new Date(b.startDate).getTime();
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

    $timeout(function(){
        $scope.initcalendar();
    },50);

    // objlist
    $scope.objList=[{
        imgChange: false,
        imgClick: false,
        imgSrc: '../../../res/img/file-pic.png',
        inputId: 'imgFile1',
        code: '',
        type: 1,
        imageUrl: '',
        expireTime: null,
    },{
        imgChange: false,
        imgClick: false,
        imgSrc: '../../../res/img/file-pic.png',
        inputId: 'imgFile2',
        code: '',
        type: 2,
        imageUrl: '',
        dateClass: '',
        expireTime: null,
    },{
        imgChange: false,
        imgClick: false,
        imgSrc: '../../../res/img/file-pic.png',
        inputId: 'imgFile3',
        code: '',
        type: 3,
        imageUrl: '',
        dateClass: '',
        expireTime: null,
    },{
        imgChange: false,
        imgClick: false,
        imgSrc: '../../../res/img/file-pic.png',
        inputId: 'imgFile4',
        code: '',
        type: 4,
        imageUrl: '',
        dateClass: '',
        expireTime: null,
    }];

    $scope.fileImg = function(obj) {
        angular.element('#'+obj.inputId).click();
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
    $scope.imgChangeFn = function (obj) {
        if((!$scope.addOrEdit && obj.imgSrc != '../../../res/img/file-pic.png') || ($scope.addOrEdit && obj.imgSrc && obj.imgSrc != '../../../res/img/file-pic.png')){
            obj.imgChange=true;
        }
    }

    $scope.imgChangeFn2 = function (obj) {
        obj.imgChange=false;
    }

    $scope.delect = function (obj) {
        obj.imgSrc = '../../../res/img/file-pic.png';
        obj.imageUrl = '';
        document.getElementById(obj.inputId).value = '';
        obj.imgClick = false;
    }

    //上传预览事件
    $scope.setImagePreview = function(obj) {
        var docObj = document.getElementById($scope.objList[obj.dataset.num].inputId);
        var file = docObj.files;
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
            $scope.objList[obj.dataset.num].imgClick = true;
            $scope.objList[obj.dataset.num].imgSrc = window.URL.createObjectURL(docObj.files[0]);
            //图片上传状态
            $scope.fileUpload = false;

            var file = $('#'+$scope.objList[obj.dataset.num].inputId)[0].files[0];


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
                        $scope.objList[obj.dataset.num].imageUrl = JSON.parse(res).data[0];
                    }
                }
            }

            $rootScope.$apply();
        } else {

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

    // get supplier info
    $scope.adminNull = true;
    $scope.getSupplierInfo=function(){
        //获取省
        $.ajax({
            type: "get",
            url: "/sys/area/province",
            async:false,
            complete: function(res) {
                if(res.responseJSON.code == 200) {
                    $scope.province = res.responseJSON.data;
                }
            }
        });
        $stateParams.supplierId&&$.ajax({
            type: 'get',
            url: '/sys/supplier/view/credentials/'+$stateParams.supplierId,
            complete: function(res) {
                if(res.responseJSON.code == 200) {
                    $scope.credentials=res.responseJSON.data;
                    for (var i = $scope.credentials.length - 1; i >= 0; i--) {
                        $scope.objList[$scope.credentials[i].type-1].code = $scope.credentials[i].code;
                        $scope.objList[$scope.credentials[i].type-1].id = $scope.credentials[i].id;
                        $scope.objList[$scope.credentials[i].type-1].expireTime = $scope.credentials[i].expireTime;
                        $scope.objList[$scope.credentials[i].type-1].imageUrl = $scope.credentials[i].imageUrl;
                        $scope.objList[$scope.credentials[i].type-1].imgSrc = $scope.credentials[i].imageUrl?('/api/file'+$scope.credentials[i].imageUrl):'';
                        $scope.objList[$scope.credentials[i].type-1].imgClick = $scope.objList[$scope.credentials[i].type-1].imageUrl?true:false;
                    }
                    $rootScope.$apply();
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
        $stateParams.supplierId&&
        $.ajax({
            type: 'get',
            url: '/sys/supplier/view/' + $stateParams.supplierId,
            complete: function(res) {
                if(res.responseJSON.code == 200) {
                    $scope.supplier = res.responseJSON.data;

                    var data = res.responseJSON.data.tenant;
                    $scope.addOrEdit = true;
                    $scope.name = data.name;

                    //账户类型
                    $scope.accountType = {id:data.commercialUse,name:$scope.getAreaName(data.commercialUse,$scope.accountTypeArr)};

                    if(res.responseJSON.data.tenantAdmin.realName){
                        $scope.showRightCon = true;
                        $scope.editState = true;
                        $scope.realName = res.responseJSON.data.tenantAdmin.realName;
                        $scope.adminTel = res.responseJSON.data.tenantAdmin.mobile;
                        $scope.adminMail = res.responseJSON.data.tenantAdmin.email;
                        $scope.adminPwd = res.responseJSON.data.tenantAdmin.password;
                        $scope.adminNull = false;
                    }else{
                        $scope.editState = false;
                        $scope.showRightCon = true;
                        $scope.adminNull = true;
                    }
                    if(data.province){
                        for(var i=0;i<$scope.province.length;i++){
                            if($scope.province[i].name == data.province){
                                $scope.proSel = {id:$scope.province[i].id,name:data.province};
                            }
                        }
                        $scope.provChange($scope.proSel,data);
                    }
                    $scope.economyType={name:data.supplierTenant.accountBank?data.supplierTenant.accountBank:'请选择'},
                    $scope.accountName=data.supplierTenant.accountName,
                    $scope.address=data.supplierTenant.address,
                    $scope.contact=data.supplierTenant.contact,
                    $scope.contactMobile=data.supplierTenant.contactMobile,
                    $scope.enterpriseLegalPerson=data.supplierTenant.enterpriseLegalPerson,
                    $scope.invoiceHeader=data.supplierTenant.invoiceHeader,
                    $scope.servicePhone=data.supplierTenant.servicePhone,
                    $scope.introduce=data.supplierTenant.introduce,
                    $scope.serviceScope=data.supplierTenant.serviceScope,
                    $scope.accountType=$scope.accountTypeArr[data.supplierTenant.serviceType?(data.supplierTenant.serviceType-1):{id:'',name:'请选择'}],
                    $scope.taxNumber=data.supplierTenant.taxNumber;
                    
                    $rootScope.$apply();
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
    $scope.getSupplierInfo();
    //提交状态验证，防止多次提交
    $scope.submitState = false;

    $scope.submit = function () {
        if(!$scope.name){
            return $scope.nameState = true;
        }
        if(!$scope.accountType.id){
            $scope.accountTypeState = true;
            return
        }
        if($scope.proSel.id && $scope.selected.citySel.id && $scope.selected.regionSel.id){
            $scope.areaState = false;
        }else{
            $scope.areaState = true;
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
            if($scope.adminNull){
                if(!$scope.adminPwd){
                    $scope.adminPwdStatus = true;
                    return;
                }else{
                    if($scope.adminPwd.length<8 || $scope.adminPwd.length>16){
                        $scope.adminPwdStatus = true
                        return;
                    }else{
                        var regNull=/^[0-9A-Za-z]*$/g;
                        if(!regNull.test($scope.adminPwd)){
                            $scope.adminPwdStatus = true;
                            return;
                        }else{
                            $scope.adminPwdStatus = false;
                        }
                    }
                }
            }
        }
        if(!$scope.fileUpload){
            return;
        }
        var arr = [];
        for (var i = $scope.objList.length - 1; i >= 0; i--) {
            if(!$scope.objList[i].id&&!$scope.objList[i].code&&!$scope.objList[i].expireTime&&!$scope.objList[i].imageUrl){
            }else{
                arr.push($scope.objList[i]);
            }
        };
        var data = {
            city:$scope.selected.citySel.name,
            county:$scope.selected.regionSel.name,
            createBy:$localStorage.userInfo.id,
            name:$scope.name,
            origin: 1,
            province:$scope.proSel.name,
            tenantType:3,
            "supplierTenant": {
                "accountBank": $scope.economyType.name=='请选择'?'':$scope.economyType.name,
                "accountName": $scope.accountName,
                "address": $scope.address,
                "contact": $scope.contact,
                "contactMobile": $scope.contactMobile,
                "enterpriseLegalPerson": $scope.enterpriseLegalPerson,
                "invoiceHeader": $scope.invoiceHeader,
                "servicePhone": $scope.servicePhone,
                "serviceType":$scope.accountType.id?$scope.accountType.id:'',
                "taxNumber": $scope.taxNumber
            },
            supplierCredentials: arr,
            updateBy:$localStorage.userInfo.id
        };
        if(!$stateParams.supplierId){
            data.realName=$scope.realName.trim().replace(/\s/g,"");
            data.mobile=$scope.adminTel;
            data.createAdmin=$scope.showRightCon;
            data.email=$scope.adminMail;
            data.password=$scope.adminPwd;
            $.ajax({
                type: 'post',
                url: '/sys/supplier/createSupplier',
                async:false,
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(data),
                complete: function(res) {
                    if(res.responseJSON.code == 200) {
                        $state.go('supplier.detail.model', {tenantId: $stateParams.tenantId,supplierId:res.responseJSON.data.id ,isOpMsg:'保存成功',isOp:true});
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
        }else {
            if($scope.adminNull&&$scope.showRightCon){
                data.realName=$scope.realName.trim().replace(/\s/g,"");
                data.mobile=$scope.adminTel;
                data.createAdmin=$scope.showRightCon;
                data.email=$scope.adminMail;
                data.password=$scope.adminPwd;
            }
            $scope.introduce&&(data.supplierTenant.introduce=$scope.introduce);
            $scope.serviceScope&&(data.supplierTenant.serviceScope=$scope.serviceScope);
            data.id=$scope.supplier.tenant.id;
            $.ajax({
                type: 'put',
                url: '/sys/supplier/edit',
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(data),
                complete: function(res) {
                    if(res.responseJSON.code&&res.responseJSON.code == 200) {
                        $state.go('supplier.detail.model', {tenantId: $stateParams.tenantId,supplierId:res.responseJSON.data.id ,isOpMsg:'保存成功',isOp:true});
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
    }

}]);