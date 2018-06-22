angular.module('app')
    .controller('applyAddController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state',  'applyDbService','$filter', function($rootScope, $scope, $stateParams, $localStorage, $state, applyDbService,$filter) {
        $scope.type =1;
        $scope.money = '';
        $scope.applyFiles=[];//附件数组  JSON.stringify($scope.applyFiles)
        $scope.assestList={};
        $scope.pageSize = 16;
        $scope.partList = [];//配件数组
        $scope.addData = [];
        $scope.billFiles = [];//传给后台的附件
        $scope.billParts = [];//传给后台的配件
        $scope.pageInfo = {
            pages: 0,
            total: 0,
            size: 16,
            current: 1,
            pstyle: 2
        };
        $scope.unitArr = [
            {name:'个',key:''},
            {name:'盒',key:''},
            {name:'支',key:''}
        ];
        $scope.part={
            name:'',
            model:'',
            product:'',
            number:'',
            unitInput:$scope.unitArr[0].name,
            price:'',
            unitkey:$scope.unitArr[0].key
        };
        // 接单类型
        $scope.radioNew = function(a){
            $scope.type = a
        };
        $scope.officeSearchId = $localStorage.userInfo.deptId;
        $scope.searchOfficeCon = $localStorage.userInfo.deptName;
        $scope.dictionary = function(){
            // $.ajax({
            //     type: "get",
            //     url: "/newrepair/repairDictionary/search/PARTS_UNIT",
            //     data:{typeKey:'PARTS_UNIT'},
            //     async: false,
            //     complete: function (res) {
            //         if(res.responseJSON.code == 200){
            //             var _length=res.responseJSON.data.length
            //                 $scope.unitArr=res.responseJSON.data
            //                 $scope.part={
            //                     name:'',
            //                     model:'',
            //                     product:'',
            //                     number:'',
            //                     unitInput:$scope.unitArr[1].name,
            //                     price:'',
            //                     unitkey:$scope.unitArr[1].key
            //                 }
            //         }
            //     }
            // })
            $.ajax({
                type: 'get',
                url: '/sys/dept/search/tenant/'+($stateParams.tenantId||$localStorage.userInfo.tenantId||1),
                data: {
                    'keyword': ''
                },
                complete: function(res) {
                    if(res.responseJSON.code==500){
                        $scope.onloading = false;
                        $scope.nocontent=true;
                        $rootScope.$apply();
                    }else if(res.responseJSON.code==200){
                        $scope.officeResult=res.responseJSON.data;
                        $rootScope.$apply();
                    }
                }
            });
        }
        // 首页加载掉一下字典表单位，以及科室的列表
        $scope.dictionary();
        // 选择设备
        $scope.searchOfficeLi=function(a) {
            $scope.officeCoSearch = false;
            $scope.officeSearchId = a.id;
            $scope.searchOfficeCon = a.name;
            $scope.table(1,$scope.pageSize)
        }
        $scope.chooseDept = function(){
            $scope.officeCoSearch = false
            $scope.table(1,$scope.pageSize)
            var index=layer.open({
                time: 0 //不自动关闭
                ,type: 1
                ,content: $('#repairAddDev')
                ,title: ['选择设备','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                ,closeBtn: 1
                ,shade: 0.3
                ,shadeClose: false
                ,btn: 0
                ,end: function(){
                    $scope.hasChoose=false
                }
                ,area: ['1324px','650px']
            });
            // 选择设备
            $scope.checkClick = function($event,l){
                $scope.assestList = l;
                $scope.assestEmit = false;
                layer.close(index)
            }
        }
        // 设备表格
        $scope.table = function(page, pageSize){
            // officeSearchId----部门
            // deptName----设备名称
            // repairNo----维修单号
            $.ajax({
                type: 'get',
                url: '/newrepair/bill/getRepairApplyPage',
                data: {
                    "pageNo": page,
                    "pageSize": pageSize,
                    'tenantId': $localStorage.userInfo.tenantId,
                    'keyword': $scope.repairNo,
                    "assetsName":$scope.deptName,
                    "assetsDeptName":$scope.searchOfficeCon,
                },
                complete: function(res) {
                    $scope.onloading = false;
                    $scope.nocontent = false;
                    var code = res.responseJSON.code;
                    if(code==500){
                        $scope.nocontent=true;
                    }else if(code==200){
                        var resData = res.responseJSON.data;
                        $scope.pageInfo.current = res.responseJSON.data.current;
                        $scope.pageInfo.total = res.responseJSON.data.total;
                        $scope.pageInfo.pstyle = 2;
                        if(!resData.records.length){
                            $scope.nocontent = true;
                            $scope.addData = resData.records;
                        }else{
                            $scope.addData = resData.records;
                        }
                    }
                    $rootScope.$apply();
                }
            });
        };
        // 点击搜索
        $scope.searchDeptAndOffice = function(){
            $scope.table(1,$scope.pageSize)
        }
        // 分页事件
        $scope.pagination = function(page, pageSize) {
            $scope.pageNo = page;
            $scope.pageSize = pageSize;
            $scope.table(page, pageSize);
        }
        // 点击搜索部分
        $scope.hideAll = function() {
            $scope.devshow = false;
            $scope.officeCoSearch = false;
        };
        $scope.focus = function(){
            $scope.hideAll();
            $scope.officeCoSearch = true;
            $scope.devshow = true;
        }
        // 添加配件
        $scope.unitList = function($event,l){
            $scope.part.unitName = $($event.target).text();
            $scope.part.unit = l.keyId;
            $scope.unit = false;
            $scope.partsUnit = false;
        };
        // 删除配件
        $scope.deldectPart = function($index){
            $scope.partList.splice($index,1)
            if($scope.partList.length){
                $scope.partListHad=true;
            }else{
                $scope.partListHad=false;
            }
        }
        $scope.addPart = function(){
            $scope.partsone = false;
            $scope.partsfour = false;
            $scope.part={
                name:'',
                model:'',
                product:'',
                number:'',
                unitName:$scope.unitArr[0].name,
                price:'',
                unitkey:$scope.unitArr[0].key
            }
            $scope.addParts = true;
            var index = layer.open({
                time: 0,//不自动关闭
                type: 1,
                content: $(".hd_addParts"),
                title: ['添加配件', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                closeBtn: 1,
                btn: 0,
                shade: 0.3,
                btn: ['确定', '取消'],
                shadeClose: true,
                area: ['618px', '520px'],
                yes: function() {
                    if(!$scope.part.name) {
                        $scope.partsone = true;
                        $rootScope.$apply();
                    }else if(!$scope.part.number){
                        $scope.partsfour=true;
                        $rootScope.$apply();
                    }
                    if($scope.part.name&&$scope.part.number){
                        $scope.addParts = false;
                        layer.close(index);
                        $scope.lookRepairReportPartsShow=false;
                        $scope.partList.push($scope.part);
                        $scope.part={};
                        $scope.partListHad=true;
                        $rootScope.$apply();
                    }
                },
                end: function(){
                    $scope.addParts = false;
                    $scope.accessoryResult = [];
                    $scope.accessorySearch = false;
                    $scope.accessoryResultNone = false;
                    $scope.accessoryKeyWord = '';
                    $rootScope.$apply();
                }
            });
            layer.style(index, {
                fontSize: '16px',
                backgroundColor: '#fff',
            });
        }
        $scope.myToast = function(msg){
            var msg = layer.msg('<div class="toaster"><span>'+msg+'</span></div>', {
                area: ['100%', '60px'],
                time: 3000,
                offset: 'b',
                shadeClose: true,
                shade: 0
            });
        }
        // 金额校验
        $scope.changeMoney = function(){
            var val = $scope.money;
            val = val.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
            val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
            if (val.indexOf(".") < 0 && val != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
               val = parseFloat(val);
            }
            $scope.money = val;
        }
        $scope.checkNum = function(){
            if(($scope.money+ '' ) ==""){
                $scope.moneyEmit = true
            }else{
                $scope.moneyEmit = false
                $scope.money = parseFloat($scope.money).toFixed(2)
            }

            if($scope.money<0){
                $scope.myToast('金额未达标，申请金额必须大于0.00')
            }
            if($scope.money>999999999.99){
                $scope.myToast('金额未达标，申请金额必须小于999999999.99')
            }
        }
        // 外修单位校验
        $scope.exitCheck = function(){
            if($scope.externalRepairCompany){
                $scope.exitCompanyEmit = false
            }else{
                $scope.exitCompanyEmit = true
            }

        }

        // 配件单价类型限制
        $scope.checkPartPrice = function (part) {
            var val = part.price;
            val = val.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
            val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
            if (val.indexOf(".") < 0 && val != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
               val = parseFloat(val);
            }
            part.price = val;
        };

        // 配件单价格式转换
        $scope.convertPartPrice = function (part) {
            var val = part.price;
            if(('' + val).length > 0){
                val = parseFloat(val).toFixed(2);
            }
            part.price = val;
        };

        // 配件数量类型限制
        $scope.checkPartCount = function(part) {
           $scope.partsfour = false;
           if ((part.number + '').length > 0) {
                part.number = parseInt(part.number);
                if (!(part.number >= 0)) {
                    part.number = '';
                }
            }
        };

        // 提交申请
        $scope.sub = function(){
            if(!$scope.assestList.id){
                $scope.assestEmit = true
            }else if(!$scope.money){
                $scope.moneyEmit = true
            }else if($scope.money<0){
                $scope.myToast('金额未达标，申请金额必须大于0.00')
            }else if($scope.money>999999999.99){
                $scope.myToast('金额未达标，申请金额必须小于999999999.99')
            }else if(!$scope.externalRepairCompany){
                $scope.exitCompanyEmit = true
            }
            if($scope.assestList && $scope.money>= 0 && $scope.externalRepairCompany && $scope.money<=999999999.99){
                // 附件格式转换
                var _length = $scope.applyFiles.length
                if(_length){
                    for(i=0;i<_length;i++){
                        $scope.billFiles[i] = {};
                        $scope.billFiles[i].name =$scope.applyFiles[i].fileName
                        $scope.billFiles[i].url =$scope.applyFiles[i].uploadUrl
                    }
                }
                // 配件格式转换
                var _length2 = $scope.partList.length
                if(_length2){
                    for(i=0;i<_length2;i++){
                        $scope.billParts[i] = {};
                        $scope.billParts[i].num =$scope.partList[i].number
                        $scope.billParts[i].partName =$scope.partList[i].name
                        $scope.billParts[i].partPrice =$scope.partList[i].price
                        $scope.billParts[i].partProduce =$scope.partList[i].product
                        $scope.billParts[i].partSpec =$scope.partList[i].model
                        $scope.billParts[i].unit =$scope.partList[i].unitName
                    }
                }
                $.ajax({
                    type: "post",
                    url: "/newrepair/bill/add" ,
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify({
                    "applyId": $scope.assestList.id,
                    "applyNo": $scope.assestList.applyNo,
                    "assetsDeptName": $scope.assestList.assetsDeptName,
                    "assetsName": $scope.assestList.assetsName,
                    "assetsSpec":$scope.assestList.assetsSpec,
                    "reportRepairDate":$scope.assestList.reportRepairDate,
                     "serialNum":$scope.assestList.serialNum,
                     "startUseDate":$scope.assestList.startUseDate,
                    "billFiles":$scope.billFiles,
                    "billParts":$scope.billParts,
                    "externalRepairCompany":$scope.externalRepairCompany ,// 外修单位
                    "fee":$scope.money,//金额
                    "remark": $scope.remark,//申请理由
                     "type":$scope.type
                    }),
                    complete: function(res) {
                        if (res.responseJSON.code == 200) {
                            $state.go('repair.apply.list');
                        }else{
                            var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg +'</span></div>', {
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
        }
    }]);