'use strict';

angular.module('app')
    .controller('repairController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', 'FileUploader','$filter',
        function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage, FileUploader,$filter) {
            var title = "";
            var defaultAva = $rootScope.defaultAvatar; //默认头像
            $rootScope.currentmodule = "资产管理"; //当前模块
            $scope.localStorageHad=function(){
                if(!$localStorage.userInfo){
                    return $state.go('website.home');
                }
            }
            $scope.localStorageHad();

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
                                        // addWork: $scope.addWork.length?$scope.arrToString1('addWork'):'',
                                        reportStatus:$scope.assetsInfo.reportStatus,
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
                                    addWork: $scope.addWork.length?$scope.arrToString1('addWork'):'',
                                    reportStatus:$scope.assetsInfo.reportStatus,
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

            //图片
            $scope.fileUrlBase = 'http://'+window.location.host + '/api/file';

            $rootScope.membernav = false;
            $scope.isfileUploaded=false;
            $scope.btnData = [{
                name: 'submit',
                text: '提交',
                class: 'btn-submit'
            }, {
                name: 'save',
                text: '暂存',
                class: 'btn-save'
            }, {
                name: 'delete',
                text: '撤销',
                class: 'btn-delete'
            }];
            $scope.baseConfig = {}; //基础数据 

            $scope.unAddDev = false;
            $scope.isClick = true;
            $scope.ulStatus = true; //状态条
            $scope.statusText = ''; //状态文本 
            $scope.isGrove = false; //是否是政府财政
            $scope.ismine = false; //是否是自筹  
            $scope.isMix = false; //是否是混合类型
            $scope.istry = false; //是否是试用设备
            $scope.isSearchPlace = false; //搜索地址框出现
            $scope.needOverlay = false; //需要遮罩层

            $scope.assetsId = $stateParams.assetId; //预台账Id
            $scope.state = $stateParams.state; //当前状态

            $scope.limitLengths=function(a,b){
                $scope.deleteSpace(a,b,$scope.assetsDetailInfo);
                $scope.lengthSubstring(a,b,$scope.assetsDetailInfo);
            }
            $scope.limitLength=function(a,b){
                $scope.deleteSpace(a,b,$scope);
                $scope.lengthSubstring(a,b,$scope);
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

            $scope.currentState = $stateParams.currentState; //当前临时状态
            $scope.IsSwitch = $stateParams.IsSwitch; //是否是切换

            //获取本地存储对象
            $scope.assetsDetailInfo = $localStorage.assetsDetailInfo || {}; //预台账详情
            $scope.tenantId = $stateParams.tenantId || $localStorage.userInfo.nowOrgId;
            $scope.verifyinfo = {} //验收详情
            $scope.pro1 = true; // 已创建信息
            $scope.pro2 = true; //已提交信息
            $scope.pro3 = true; //已验收信息
            $scope.cityArr = []; //获取城市列表
            $scope.applyDepetName = ""; //申购科室
            $scope.depetshow = false;
            $scope.depetshow2 = false;
            $scope.depetshow3 = false;
            $scope.devshow = false;
            $scope.keyword = {
                applyDepkey: ''
            }
            activate();
            // hd获取预台账基本数据
            $scope.baseMsg = function(){
                $.ajax({
                    type: "get",
                    url: '/assets/data/geCodeInfoByType?types=ACCOUNT_CATEGORY&types=MANAGE_LEVEL&types=FUND_SOURCES&types=UNIT&types=PURCHASE_TYPE&types=MEASURE_TYPE&types=DEP_TYPE&types=PURPOSE&types=ACCOUNT_BOOK',
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {
                            // var data=res.responseJSON.data;
                            // console.log(data)
                            // $scope.UNIT=data.UNIT
                            // $scope.UNIT.unshift({codeValue:"0",codeText:"请选择",id:0})
                            // $scope.hdwhIds=data.ACCOUNT_BOOK
                            // $scope.hdwhIds.unshift({codeValue:"0",codeText:"请选择",id:0})
                            // $scope.hdassetsClassIds = data.ACCOUNT_CATEGORY
                            // $scope.hdassetsClassIds.unshift({codeValue:"0",codeText:"请选择",id:0})
                            // $scope.hdmanageLevels = data.MANAGE_LEVEL
                            // $scope.hdmanageLevels.unshift({codeValue:"0",codeText:"请选择",id:0})
                            // $scope.hdmeasures = data.MEASURE_TYPE
                            // $scope.hdmeasures.unshift({codeValue:"0",codeText:"请选择",id:0})
                            // $scope.hdpusposes = data.PURPOSE
                            // $scope.hdpusposes.unshift({codeValue:"0",codeText:"请选择",id:0})

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
                        }
                    }
                });
            }
            

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

            $scope.baseMsg()
            // 操作记录
            $scope.getOperateList=function(){
                $.ajax({
                    type: "get",
                    url: "/assets/preAssetsInfo/getOperateByid",
                    data: {
                        id: $scope.assetsId || ''
                    },
                    complete: function(res) {
                        if(res.responseJSON.code==200){
                            $scope.operateList=res.responseJSON.data;
                        }else{

                        }
                    }
                });
            }
            $scope.getOperateList();
            /*获取预台账详情*/
            $scope.getAssetsDetail = function() {
                $.ajax({
                    type: "get",
                    url: "/assets/assetsInfo/getAssetsDetail",
                    data: {
                        id: $scope.assetsId || ''
                    },
                    complete: function(res) {
                        // $scope.getBaseDate();

                        /*解决日历获取不到dom的问题  暂时这样处理 */
                        if(!$scope.assetsId || $scope.IsSwitch) {
                            $scope.trsfundSources();
                            $scope.initcalendar();
                            return;
                        }
                        if(res.responseJSON.code == 200) {
                            /*编辑获取基础数据 */
                            $scope.assetsDetailInfo = res.responseJSON.data;
                            $scope.assetsName = $scope.assetsDetailInfo.assetsName;
                            $scope.factoryName = $scope.assetsDetailInfo.factoryName;
                            $scope.assetsDetailInfo.startUseDate1=$scope.assetsDetailInfo.startUseDate?$scope.dateToTime($scope.assetsDetailInfo.startUseDate):'';
                            $scope.assetsDetailInfo.warrantyDate1=$scope.assetsDetailInfo.warrantyDate?$scope.dateToTime($scope.assetsDetailInfo.warrantyDate):'';

                            // $scope.newTreListAccount.codeText= $scope.assetsDetailInfo.assetsClassName
                            // $scope.assetsDetailInfo.assetsImg = $scope.assetsDetailInfo.assetsImg ? $scope.assetsDetailInfo.assetsImg : '../../../../res/img/file-pic.png';
                            /*发票号特殊处理 成数组*/
                            $scope.assetsDetailInfo.invoiceNos = $scope.assetsDetailInfo.invoiceNos && $scope.assetsDetailInfo.invoiceNos.split(',');
                            /*资金来源转换 */
                            $scope.trsfundSources();
                            /*金额过滤0 */
                            $scope.assetsDetailInfo.price = $scope.assetsDetailInfo.price == 0 ? 0 : $scope.assetsDetailInfo.price;

                            if($scope.assetsDetailInfo.price){
                                $scope.assetsDetailInfo.price = (+$scope.assetsDetailInfo.price).toFixed(2);
                            }

                            $scope.assetsDetailInfo.lessPrice && ($scope.assetsDetailInfo.lessPrice = +($scope.assetsDetailInfo.lessPrice).toFixed(2));
                            $scope.assetsDetailInfo.contractPrice = $scope.assetsDetailInfo.contractPrice == 0 ? '' : $scope.assetsDetailInfo.contractPrice;
                            $localStorage.assetsDetailInfo = $scope.assetsDetailInfo;
                            $scope.initcalendar(); //初始化日历

                            $scope.depetName = $scope.assetsDetailInfo.deptName;
                            $scope.applyDepetName = $scope.assetsDetailInfo.applyDeptName;
                            $scope.manageDepName = $scope.assetsDetailInfo.manageDeptName;

                            $scope.unitId = {codeText: $scope.assetsDetailInfo.unitName,codeValue: $scope.assetsDetailInfo.unitId,id:null};
                            $scope.assetsType = {codeText: $scope.assetsDetailInfo.assetsTypeName,codeValue: $scope.assetsDetailInfo.assetsTypeId,id:null};
                            $scope.assetsClassId = {codeText: $scope.assetsDetailInfo.assetsClassName,codeValue: $scope.assetsDetailInfo.assetsClassId,id:null};
                            $scope.manageLevel = {codeText: $scope.assetsDetailInfo.manageLevelName,codeValue: $scope.assetsDetailInfo.manageLevel,id:null};
                            $scope.measureType = {codeText: $scope.assetsDetailInfo.measureTypeName,codeValue: $scope.assetsDetailInfo.measureType,id:null};
                            $scope.purpose = {codeText: $scope.assetsDetailInfo.purposeName,codeValue: $scope.assetsDetailInfo.purpose,id:null};

                            $rootScope.$apply();
                        }
                    }
                });

            }
            // hd下拉菜单
            // 核算类别
            $scope.newTreList=function(a){
                $scope.batchSetDeptWrapShow = true;
                $scope[a] = true;
                $scope.searchResult = [];
            }
            $scope.newTreListStates1=function(a,b,c){
                $scope[b] = false;
                $scope[a] = c;
                $scope.batchSetDeptWrapShow = false;
                $scope.assetsDetailInfo.assetsClassId = c.codeValue
            }
            // 管理级别
            $scope.newTreListStates2=function(a,b,c){
                $scope[b] = false;
                $scope[a] = c;
                $scope.batchSetDeptWrapShow = false;
                $scope.assetsDetailInfo.manageLevel= c.codeValue
            }
            // 帐圃类型
            $scope.newTreListStates3=function(a,b,c){
                $scope[b] = false;
                $scope[a] = c;
                $scope.batchSetDeptWrapShow = false;
                $scope.assetsDetailInfo.assetsTypeId= c.codeValue
            }
            // 计量类别
            $scope.newTreListStates4=function(a,b,c){
                $scope[b] = false;
                $scope[a] = c;
                $scope.batchSetDeptWrapShow = false;
                $scope.assetsDetailInfo.measureType= c.codeValue
            }
            // 用途
            $scope.newTreListStates5=function(a,b,c){
                $scope[b] = false;
                $scope[a] = c;
                $scope.batchSetDeptWrapShow = false;
                $scope.assetsDetailInfo.purpose= c.codeValue
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
                autoUpload: false, //是否自動上傳
                headers: {
                    "X-AEK56-Token": $localStorage["X-AEK56-Token"]
                },
                filters: [{
                    name: 'image',
                    fn: function(a){
                        return /image\/\w+/.test(a.type)
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

            $scope.contains = function(arr, obj) {
                var i = arr.length;
                while(i--) {
                    if(arr[i] === obj) {
                        return true;
                    }
                }
                return false;
            }

            uploader.onAfterAddingFile = function(fileItem) {
                var typeArr = ['jpg', 'jpeg', 'gif', 'png', 'tiff', 'bmp'],
                    type = fileItem.file.name.split('.')[fileItem.file.name.split('.').length-1].toLocaleLowerCase();
                if(!$scope.contains(typeArr, type)) {
                    // alert('选择文件格式有误，请重新选择！');
                    var msg = layer.msg('<div class="toaster"><span>选择文件格式有误，请重新选择！</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                    return;
                }

                var size = fileItem.file.size / (1024 * 1024);
                if(size>3){
                    // alert('选择文件过大，请重新选择！');
                    var msg = layer.msg('<div class="toaster"><span>选择文件过大，请重新选择！</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                    return;
                }

                $scope.fileItem = fileItem._file; //添加文件之后，把文件信息赋给scope
                uploader.uploadAll();
            };
            uploader.onProgressItem = function(progress) {

            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                $scope.uploadStatus = true; //上传成功则把状态改为true
                // $scope.assetsDetailInfo.assetsImg = 'http://'+window.location.host + '/api/file' + response.data[0];
                $scope.assetsDetailInfo.assetsImg = response.data[0];
                $scope.isfileUploaded=true;
            };

            var handleFileSelect = function(evt) {
                var file = evt.currentTarget.files[0];
                if(!/image\/\w+/.test(file.type)) {
                    return false;
                }
                $scope.uploadfile();

            };
            angular.element(document.querySelector('#deviceImgFile')).on('change', handleFileSelect);

            $scope.uploadfile = function() {
                uploader.uploadAll();
            }
                /*上传图片end*/
            $scope.myCroppedImage = '';

            /*转换资金来源 */
            $scope.trsfundSources = function(data) {
                var fundSourcesId = $scope.assetsDetailInfo.fundSourcesId;
                if(fundSourcesId == 112 || fundSourcesId == '财政资金') {
                    $scope.isGrove = true;
                    $scope.assetsDetailInfo.groveMoney = $scope.assetsDetailInfo.fundSourceMoneys;
                } else if(fundSourcesId == 113 || fundSourcesId == '自筹资金') {
                    $scope.ismine = true;
                    $scope.assetsDetailInfo.hosMoney = $scope.assetsDetailInfo.fundSourceMoneys;
                } else if(fundSourcesId == 114 || fundSourcesId == '混合类型') {
                    var currentMoney = $scope.assetsDetailInfo.fundSourceMoneys;
                    var moneys;
                    if(angular.isArray(currentMoney)) {
                        moneys = currentMoney;
                    } else {
                        moneys = currentMoney.split(",")
                    }
                    $scope.isMix = true;
                    $scope.assetsDetailInfo.groveMoney = moneys[0];
                    $scope.assetsDetailInfo.hosMoney = moneys[1] || '';
                } else if(fundSourcesId == 115 || fundSourcesId == '试用设备') {
                    $scope.istry = true;
                    $scope.assetsDetailInfo.tryMoney = $scope.assetsDetailInfo.fundSourceMoneys;
                }
                $rootScope.$apply();
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
                    var currentel = $(this.element).attr("name");
                    // currentel == "startUseDate" && ($scope.assetsDetailInfo.startUseDate = date.format('YYYY-MM-DD'));
                    // currentel == "warrantyDate" && ($scope.assetsDetailInfo.warrantyDate = date.format('YYYY-MM-DD'));
                    // currentel == "purchaseDate" && ($scope.assetsDetailInfo.purchaseDate = date.format('YYYY-MM-DD'));
                    // currentel == "arrivalDate" && ($scope.assetsDetailInfo.arrivalDate = date.format('YYYY-MM-DD'));
                    // currentel == "endDate" && ($scope.assetsDetailInfo.endDate = date.format('YYYY-MM-DD'));
                    // currentel == "startDate" && ($scope.assetsDetailInfo.startDate = date.format('YYYY-MM-DD'));
                    currentel == "startUseDate1" && ($scope.assetsDetailInfo.startUseDate1 = date.format('YYYY-MM-DD'));
                    currentel == "warrantyDate1" && ($scope.assetsDetailInfo.warrantyDate1 = date.format('YYYY-MM-DD'));
                    $rootScope.$apply();
                });

            }
            $scope.$watch('assetsDetailInfo.warrantyDate1', function(newValue, oldValue, scope) {
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
                    minDate: new Date(newValue)
                }), function(date, enddate, el) {

                });

            });
            $scope.$watch('assetsDetailInfo.startUseDate1', function(newValue, oldValue, scope) {
                var option = {
                    format: 'YYYY-MM-DD',
                    startDate: new Date(newValue),
                    endDate: new Date("2050-01-01"),
                    maxDate: new Date("2050-01-01"),
                    timePicker: false,
                    opens: "top",
                    singleDatePicker: true
                }
                angular.element('.el-endDate').daterangepicker($.extend({}, option, {
                    minDate: new Date(newValue)
                }), function(date, enddate, el) {

                });

            });

            $scope.assetsSelecters=function(a){
                $scope[a]=true;
                $scope.needOverlay = true;
            }

            $scope.assetsSelectersLiClick=function(a,b,c){
                $scope[a] = c;
                $scope[b] = false;
                $scope.needOverlay = false;
            }

            //关闭所有的弹出框
            $scope.closeAll = function() {
                $scope.needOverlay = false;
                $scope.isSearchPlace = false;
                $scope.depetshow = false;
                $scope.depetshow2 = false;
                $scope.depetshow3 = false;
                $scope.devshow = false;

                $scope.unitIdListShow = false;
                $scope.assetsTypeListShow = false;
                $scope.assetsClassIdListShow = false;
                $scope.manageLevelListShow = false;
                $scope.measureTypeListShow = false;
                $scope.purposeListShow = false;

                $(".search-wrap").empty();

            }

            $scope.getCitys = function() {
                    //已經有地址數據不再請求
                    /*if(~~$scope.cityArr) return;*/
                    for(var index = 0; index < citylist.length; index++) {
                        for(var j = 0; j < citylist[index].cities.length; j++) {
                            $scope.cityArr.push(citylist[index].name + "-" + citylist[index].cities[j]);

                        }

                    }

                }
                //搜索地址显示
            $scope.searchPlace = function($event) {
                $scope.isSearchPlace = true;
                $scope.needOverlay = true;
                $scope.cityArr.length = 0;
                $scope.getCitys();
                $(".search-wrap").autocomplete({
                    hints: $scope.cityArr,
                    width: '100%',
                    height: "30px",
                    showButton: false,
                    onSubmit: function(text) {
                        $scope.assetsDetailInfo.prodPlace = text;
                        $scope.closeAll();
                        $rootScope.$apply();

                    }
                });

            }

            $scope.getAssetsDetail();

            //删除预台账
            $scope.delAssets = function(callback,params) {
                $.ajax({
                    type: "get",
                    url: "/assets/preAssetsInfo/delAssets",
                    data: {
                        id: $scope.assetsId
                    },
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {
                            callback && callback(params);
                        }
                    }
                });
            }

            //验收预台账

            $scope.verifyAssets = function(callback) {
                $.ajax({
                    type: "get",
                    url: "/assets/preAssetsInfo/verify",
                    data: $scope.verifyinfo,
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {
                            callback && callback();
                        }

                    }
                });

            }

            $scope.setVarfalse = function() {
                $scope.isGrove = false;
                $scope.ismine = false;
                $scope.isMix = false;
                $scope.istry = false;

            }

            /*$scope.showMoneyModal = function() {

                $scope.setVarfalse();
                if($scope.assetsDetailInfo.fundSourcesId == 1) {
                    $scope.isGrove = true;

                } else if($scope.assetsDetailInfo.fundSourcesId == 2) {
                    $scope.ismine = true;


                } else if($scope.assetsDetailInfo.fundSourcesId == 3) {
                    $scope.isMix = true;

                } else if($scope.assetsDetailInfo.fundSourcesId == 4) {
                    $scope.istry = true;
                }

            }*/

            //转换数据
            // $scope.transformData = function(params) {
            //
            //  /*收集发票号 */
            //  if($state.includes("main.tre.ytz.assets")) {
            //      if(angular.isArray($localStorage.assetsDetailInfo.invoiceNos)) {
            //          $scope.assetsDetailInfo.invoiceNos = $localStorage.assetsDetailInfo.invoiceNos.join(",");
            //      } else {
            //          $scope.assetsDetailInfo.invoiceNos = $localStorage.assetsDetailInfo.invoiceNos;
            //      }
            //      if(angular.isArray($localStorage.assetsDetailInfo.fundSourceMoneys)) {
            //          $scope.assetsDetailInfo.fundSourceMoneys = $localStorage.assetsDetailInfo.fundSourceMoneys.join(",");
            //
            //      } else {
            //          $scope.assetsDetailInfo.fundSourceMoneys = $localStorage.assetsDetailInfo.fundSourceMoneys;
            //      }
            //
            //  } else {
            //      $scope.assetsDetailInfo.invoiceNos = "";
            //      $(".invoiceNos").each(function(index, item) {
            //          var _thisVal = $(item).val();
            //          if(_thisVal) {
            //              if($scope.assetsDetailInfo.invoiceNos) {
            //                  $scope.assetsDetailInfo.invoiceNos += ',' + _thisVal;
            //              } else {
            //                  $scope.assetsDetailInfo.invoiceNos = _thisVal;
            //              }
            //
            //          }
            //
            //      });
            //      //处理资金来源
            //      $scope.assetsDetailInfo.fundSourceMoneys = "";
            //      $(".fond-resourse").each(function(index, item) {
            //          var _thisval = $(item).val();
            //          if(_thisval) {
            //              if($scope.assetsDetailInfo.fundSourceMoneys) {
            //
            //                  $scope.assetsDetailInfo.fundSourceMoneys += ',' + _thisval
            //              } else {
            //                  $scope.assetsDetailInfo.fundSourceMoneys = _thisval;
            //              }
            //          }
            //
            //      })
            //
            //  }
            //
            //  !params.type && $rootScope.$apply();
            //
            // }

            //保存/编辑  预台账
            $scope.saveAssets = function(callback, params, fn) {

                    // $scope.transformData(params);
                    
                     if(!$scope.isfileUploaded){
                         $scope.assetsDetailInfo.assetsImg='';
                     }

                    // $.ajax({
                    //  type: "post",
                    //  url: "/assets/preAssetsInfo/edit",
                    //  contentType: "application/json;charset=UTF-8",
                    //  data: JSON.stringify($scope.assetsDetailInfo),
                    //  complete: function(res) {
                    //      console.log(res.responseJSON.data)
                    //      if(res.responseJSON.code == 200) {
                    //          if(!$scope.isfileUploaded){
                    //              $scope.assetsDetailInfo.assetsImg="../../../../res/img/file-pic.png";
                    //          }
                    //
                    //          if(params && params.issubmit) {
                    //              fn && fn();
                    //              return;
                    //          }
                    //
                    //          callback && callback();
                    //      }
                    //
                    //  }
                    // });

                $scope.assetsDetailInfo.assetsTypeId=$scope.assetsType.codeValue;
                $scope.assetsDetailInfo.unitId=$scope.unitId.codeValue;
                $scope.assetsDetailInfo.assetsClassId=$scope.assetsClassId.codeValue;
                $scope.assetsDetailInfo.manageLevel=$scope.manageLevel.codeValue;
                $scope.assetsDetailInfo.measureType=$scope.measureType.codeValue;
                $scope.assetsDetailInfo.purpose=$scope.purpose.codeValue;

                $scope.assetsDetailInfo.warrantyDate=$scope.assetsDetailInfo.warrantyDate1?(new Date($scope.assetsDetailInfo.warrantyDate1+' 00:00:00').getTime()):null;
                $scope.assetsDetailInfo.startUseDate=$scope.assetsDetailInfo.startUseDate1?(new Date($scope.assetsDetailInfo.startUseDate1+' 00:00:00').getTime()):null;
                //编辑提交时不传设备原值
                // delete $scope.assetsDetailInfo.priceStr;

                //处理采购信息中的金额
                if($scope.assetsDetailInfo.price){
                    $scope.assetsDetailInfo.priceStr = ($scope.assetsDetailInfo.price/100).toString();
                }else{
                    $scope.assetsDetailInfo.priceStr = '';
                }

                if($scope.assetsDetailInfo.contractPrice){
                    $scope.assetsDetailInfo.contractPriceStr = ($scope.assetsDetailInfo.contractPrice/100).toString();
                }else{
                    $scope.assetsDetailInfo.contractPriceStr = '';
                }


                if($scope.assetsDetailInfo.listFundSources.length!=0){
                    for(var i=0;i<$scope.assetsDetailInfo.listFundSources.length;i++){
                        $scope.assetsDetailInfo.listFundSources[i].fundSourceMoneyStr = ($scope.assetsDetailInfo.listFundSources[i].fundSourceMoney/100).toString();
                    }
                }

                delete $scope.assetsDetailInfo.price;


                if($scope.assetsDetailInfo.threeLevelCode && $scope.assetsDetailInfo.threeLevelCode.length!=6){
                    var msg = layer.msg('<div class="toaster"><span>三级分类代码需为6位！</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                    return;
                }

                $.ajax({
                    type: "post",
                    url: "/assets/preAssetsInfo/editAssets",
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify($scope.assetsDetailInfo),
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {
                            if(!$scope.isfileUploaded){
                                $scope.assetsDetailInfo.assetsImg="../../../../res/img/file-pic.png";
                            }

                            if(params && params.issubmit) {
                                fn && fn();
                                return;
                            }

                            callback && callback();
                        }

                    }
                });
                $scope.saveAssetsTitle(0);
                $scope.saveAssetsTitle(1);
            }
                //提交预台账
            $scope.submitAssests = function(callback) {
                if($stateParams.currentState == 3){
                    $.ajax({
                        type:'get',
                        url:'/assets/preAssetsInfo/reEdit',
                        async:false,
                        data: {
                            id: $stateParams.assetId
                        },
                        complete: function(res) {
                        }
                    })
                }

                $scope.assetsDetailInfo.assetsTypeId=$scope.assetsType.codeValue;
                $scope.assetsDetailInfo.unitId=$scope.unitId.codeValue;
                $scope.assetsDetailInfo.assetsClassId=$scope.assetsClassId.codeValue;
                $scope.assetsDetailInfo.manageLevel=$scope.manageLevel.codeValue;
                $scope.assetsDetailInfo.measureType=$scope.measureType.codeValue;
                $scope.assetsDetailInfo.purpose=$scope.purpose.codeValue;

                $scope.assetsDetailInfo.warrantyDate=$scope.assetsDetailInfo.warrantyDate1?(new Date($scope.assetsDetailInfo.warrantyDate1+' 00:00:00').getTime()):null;
                $scope.assetsDetailInfo.startUseDate=$scope.assetsDetailInfo.startUseDate1?(new Date($scope.assetsDetailInfo.startUseDate1+' 00:00:00').getTime()):null;
                //编辑提交时不传设备原值

                //处理采购信息中的金额
                // $scope.assetsDetailInfo.priceStr = ($scope.assetsDetailInfo.price/100).toString();
                // $scope.assetsDetailInfo.contractPriceStr = ($scope.assetsDetailInfo.contractPrice/100).toString();

                if($scope.assetsDetailInfo.contractPrice){
                    $scope.assetsDetailInfo.contractPriceStr = ($scope.assetsDetailInfo.contractPrice/100).toString();
                }else{
                    $scope.assetsDetailInfo.contractPriceStr = '';
                }


                if($scope.assetsDetailInfo.price){
                    $scope.assetsDetailInfo.priceStr = ($scope.assetsDetailInfo.price/100).toString();
                }else{
                    $scope.assetsDetailInfo.priceStr = '';
                }

                if($scope.assetsDetailInfo.listFundSources.length!=0){
                    for(var i=0;i<$scope.assetsDetailInfo.listFundSources.length;i++){
                        $scope.assetsDetailInfo.listFundSources[i].fundSourceMoneyStr = ($scope.assetsDetailInfo.listFundSources[i].fundSourceMoney/100).toString();
                    }
                }

                delete $scope.assetsDetailInfo.price;
                // delete $scope.assetsDetailInfo.priceStr;

                if($scope.assetsDetailInfo.threeLevelCode && $scope.assetsDetailInfo.threeLevelCode.length!=6){
                    var msg = layer.msg('<div class="toaster"><span>三级分类代码需为6位！</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                    return;
                }

                $.ajax({
                    type: "post",
                    async:false,
                    // url: "/assets/preAssetsInfo/addConfirm",
                    contentType: "application/json;charset=UTF-8",
                    url: "/assets/preAssetsInfo/submitEditAssets",
                    data: JSON.stringify($scope.assetsDetailInfo ),
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {
                            callback && callback();
                        }

                    }
                });

                $scope.saveAssetsTitle(0);
                $scope.saveAssetsTitle(1);

                // $scope.saveAssets(callback, {
                //  issubmit: true
                // }, function() {
                //  $.ajax({
                //      type: "post",
                //      // url: "/assets/preAssetsInfo/addConfirm",
                //      contentType: "application/json;charset=UTF-8",
                //      url: "/assets/preAssetsInfo/submitEditAssets",
                //      data: JSON.stringify($scope.assetsDetailInfo ),
                //      complete: function(res) {
                //          if(res.responseJSON.code == 200) {
                //              callback && callback();
                //          }
                //
                //      }
                //  });
                // });
            }

            //三级分类代码验证
            $scope.threetypecode = function () {
                if($scope.assetsDetailInfo.threeLevelCode&&($scope.assetsDetailInfo.threeLevelCode.length>1)){
                    $scope.assetsDetailInfo.threeLevelCode=$scope.assetsDetailInfo.threeLevelCode.match(/^(68[0-9]{0,4})/g);
                    if(Object.prototype.toString.call($scope.assetsDetailInfo.threeLevelCode) == '[object Array]'){
                        $scope.assetsDetailInfo.threeLevelCode = $scope.assetsDetailInfo.threeLevelCode.join('')
                    }
                }
            }

            //处理预台账 更改状态
            $scope.handleAssets = function(params, callback) {
                if(params.type == "submit") {
                    $scope.submitAssests(callback);
                } else if(params.type == "save") {

                    $scope.saveAssets(callback,params);

                } else if(params.type == 'delete' || params.type == 'cancel') {
                    $scope.delAssets(callback,params);
                } else if(params.type == 'pass' || params.type == 'noPass') {
                    $scope.verifyAssets(callback);
                } else if(params.type == 'again') {
                    $state.go('main.tre.ytz.assets', {
                        id:$stateParams.id,
                        state: 0, //暂时为暂存
                        assetsId: $scope.assetsId,
                        currentState: ''
                    });


                    // $.ajax({
                    //  type:'get',
                    //  url:'/assets/preAssetsInfo/reEdit',
                     //    data: {
                     //        id: $stateParams.assetId
                     //    },
                     //    complete: function(res) {
                     //        if(res.responseJSON.code == 200) {
                     //            $state.go('main.tre.ytz.assets', {
                     //             id:$stateParams.id,
                     //             state: 0, //暂时为暂存
                     //             assetsId: $scope.assetsId,
                     //             currentState: 3
                     //            });
                     //        }
                    //
                     //    }
                    // })
                } else if(params.type == 'print') {
                    angular.element("#printIt").jqprint({
                        operaSupport: false
                    });
                }

            }

            //增加发票号
            $scope.addbill = function($event) {
                if($(".del-bill-group").css("display") == "none") {
                    $(".del-bill-group").show();
                    return
                }
                $(".bill-wrap").append($(".del-bill-group")[0].outerHTML);

            }

            /*解决文档点击触发多次的问题 */

            $(document).off("click", ".del-bill");
            $(document).on("click", '.del-bill', function($event) {
                var isCurrentBill = $(this).hasClass("del-currentBill"); //判断是否是原有的记录
                if($(".del-bill-group").length == 1 && !isCurrentBill) {
                    $(".del-bill-group").hide();
                    return
                }
                $($event.currentTarget).parent('.form-group').remove();

            })

            //查看验收详情
            $scope.getCheckInfo = function(a) {
                var index = layer.open({
                    time: 0,
                    content: '<div class="pad-fifty pass-wrap "><div><label>验收日期:</label><span  class="verifydata">' +$filter('date')(a.operateDate,'yyyy-MM-dd') + ' <span></div><div><label>验收说明:</label><p  class="verifycontent">' + (a.operateRemark || '验收没有说明') + '</p></div></div>',
                    title: ['提示', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    closeBtn: 1,
                    autoHeight: true,
                    shade: 0.3,
                    shadeClose: true,
                    area: '500px',
                    btnAlign: 'r'
                });

            }

            //匹配键值
            $scope.matchKeyValue = function(arr, id, defaultId) {
                    var arrLengh = arr.length;
                    if($scope.state == 0) return id ? id | 0 : defaultId; //id为空时 返回默认id
                    if(!arrLengh) return;
                    for(var i = 0; i < arrLengh; i++) {
                        if(arr[i].codeValue == id) {
                            return arr[i].codeText;
                        }

                    }
                    return id;
                }
                /*联动效果 */

            $scope.getIdByParentId = function(parentId, callback) {

                    $.ajax({
                        type: "get",
                        url: "/assets/data/getChildCodeInfo",
                        data: {
                            "parentCodeId": parentId
                        },
                        complete: function(res) {
                            if(res.responseJSON.code == 200) {
                                callback && callback(res.responseJSON.data);

                            }

                        }
                    });

                }
                //获取核算类别
            // $scope.getAssets = function(id, isChange) {
            //
            //  $scope.getIdByParentId(id, function(data) {
            //      if(isChange == 1) {
            //          $scope.assetsDetailInfo.assetsClassId = '';
            //      }
            //      $scope.assetsClassIds = data;
            //      $scope.assetsDetailInfo.assetsClassId = $scope.matchKeyValue($scope.assetsClassIds, $scope.assetsDetailInfo.assetsClassId, data[0].id);
            //
            //      $rootScope.$apply();
            //  });
            //
            // }

            //获取基础数据

            $scope.getBaseDate = function() {
                /*
                 *账簿类型、核算类型、单位、经费来源、管理级别、折旧方法、设备来源、计量类别、用途
                 * */
                var basekey = ["ACCOUNT_BOOK", "ACCOUNT_CATEGORY", "UNIT", "FUND_SOURCES", "MANAGE_LEVEL", "DEP_TYPE", "PURCHASE_TYPE", "MEASURE_TYPE", "PURPOSE"];
                $.map(basekey, function(item_key) {
                    $.ajax({
                        type: "get",
                        url: "/assets/data/baseConfig",
                        data: {
                            key: item_key
                        },
                        complete: function(res) {

                            if(res.responseJSON.code == 200) {
                                res.responseJSON.data.unshift({codeValue:"0",codeText:"请选择",id:0});

                                if(item_key == "ACCOUNT_BOOK") {
                                    $scope.whIds = res.responseJSON.data;
                                    var parentId = $scope.assetsDetailInfo.whId || 1;
                                    $scope.getAssets(parentId);
                                    $scope.assetsDetailInfo.whId = $scope.matchKeyValue($scope.whIds, $scope.assetsDetailInfo.whId, 0) + '';

                                } else if(item_key == "ACCOUNT_CATEGORY") {

                                    /*不根据key值 去查核算类别*/
                                    /*$scope.assetsClassIds = res.responseJSON.data;
                                    $scope.assetsDetailInfo.assetsClassId = $scope.matchKeyValue($scope.assetsClassIds, $scope.assetsDetailInfo.assetsClassId, 3);*/

                                } else if(item_key == "UNIT") {
                                    $scope.unitIds = res.responseJSON.data;
                                    $scope.assetsDetailInfo.unitId = $scope.matchKeyValue($scope.unitIds, $scope.assetsDetailInfo.unitId, 0) + '';
                                    /*console.log("单位");
                                    console.log($scope.assetsDetailInfo.unitId);*/

                                } else if(item_key == "FUND_SOURCES") {
                                    $scope.fundJsons = res.responseJSON.data;
                                    $scope.assetsDetailInfo.fundSourcesId = $scope.matchKeyValue($scope.fundJsons, $scope.assetsDetailInfo.fundSourcesId, 0) + '';

                                } else if(item_key == "MANAGE_LEVEL") {
                                    $scope.manageLevels = res.responseJSON.data;
                                    $scope.assetsDetailInfo.manageLevel = $scope.matchKeyValue($scope.manageLevels, $scope.assetsDetailInfo.manageLevel, 0) + '';

                                } else if(item_key == "DEP_TYPE") {
                                    $scope.depTypes = res.responseJSON.data;
                                    $scope.assetsDetailInfo.depType = $scope.matchKeyValue($scope.depTypes, $scope.assetsDetailInfo.depType, 0) + '';

                                } else if(item_key == "PURCHASE_TYPE") {
                                    $scope.purchaseTypeIds = res.responseJSON.data
                                    $scope.assetsDetailInfo.purchaseTypeId = $scope.matchKeyValue($scope.purchaseTypeIds, $scope.assetsDetailInfo.purchaseTypeId, 0) + '';
                                } else if(item_key == "MEASURE_TYPE") {
                                    $scope.measures = res.responseJSON.data;
                                    $scope.assetsDetailInfo.measureType = $scope.matchKeyValue($scope.measures, $scope.assetsDetailInfo.measureType, 0) + '';
                                } else if(item_key == "PURPOSE") {
                                    $scope.pusposes = res.responseJSON.data;
                                    $scope.assetsDetailInfo.purpose = $scope.matchKeyValue($scope.pusposes, $scope.assetsDetailInfo.purpose, 0) + '';
                                }
                                $rootScope.$apply();

                            }

                        }
                    });

                });

            }

            $scope.radioV = 0;
            $scope.checkWin = false;

            $scope.radioFn = function (event) {
                $scope.radioV = event;
            }

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
                    !$scope.factoryName&&($scope.factoryName=$scope.assetsDetailInfo.factoryName);
                    $scope.assetsDetailInfo.factoryName=$scope.factoryName;
                    $scope.factoryNameFocus=false;
                    $scope.factoryNameEdit=false;
                }else{
                    !$scope.assetsName&&($scope.assetsName=$scope.assetsDetailInfo.assetsName);
                    $scope.assetsDetailInfo.assetsName=$scope.assetsName;
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
                            $scope.assetsDetailInfo.assetsName = $scope.assetsName;
                            $scope.assetsDetailInfo.factoryName = $scope.factoryName;
                        }else{
                            $scope.assetsName = $scope.assetsDetailInfo.assetsName;
                            $scope.factoryName = $scope.assetsDetailInfo.factoryName;
                        }
                        $rootScope.$apply();
                    }
                });
            }

            //按钮提示
            $scope.layerWin = function(type, conetnt) {
                var msg = '';
                var content = '';
                var className = '';
                var _id = '';
                var height = "250px";
                var width = "500px";
                var closeBtn = 1;
                var closeArr = ["确定", "取消"];
                var layerImg = "../../../res/img/wh.png";
                // $scope.layerImg = "../../../res/img/icon20.png";
                console.log("类型");
                console.log(type);
                switch(type) {
                    case 'submit':
                        className = "submit-wrap";
                        msg = '提交后不可再修改，您确定提交验收吗？';
                        content = '提交成功！';
                        height = '250px';
                        break;
                    case 'save':
                        className = "save-wrap";
                        msg = '是否保存？';
                        content = '保存成功！';
                        break;
                    case 'delete':
                        className = "delete-wrap";
                        //msg = '是否删除？';
                        msg='是否撤销申请';
                        content = '撤销成功！';
                        break;
                    case 'cancel':
                        className = "delete-wrap";
                        //msg = '是否删除？';
                        msg='是否撤销申请';
                        content = '撤销成功！';
                        break;  
                    case 'print':
                        className = "print-wrap";
                        /*msg = '是否打印？';*/
                        msg = angular.element(".printthis").html();
                        height = "360px";
                        width = "640px"
                        content = '打印成功！';
                        closeBtn = 0;
                        closeArr = ["打印"];
                        break;
                    case 'remind':
                        className = "remind-wrap";
                        msg = '是否提醒？';
                        content = '提醒成功！';
                        break;
                    case 'pass':
                        $scope.checkWin = true;
                        $scope.checkDate = moment().format('YYYY-MM-DD');
                        _id = 'pass';
                        className = "pass-wrap";
                        height = "285px";
                        $scope.radioV = 2;
                        msg = '<div class="text-left"><label>验收结果:</label><div style="display: inline-block;"><div class="box1"><input ng-click="radioFn($event)" type="radio" id="check-1" name="evaluation" class="input ng-valid ng-not-empty ng-dirty ng-touched" ng-model="radioV"  ng-value="2"><span></span></div><label for="check-1" class="ng-binding">通过</label></div><div style="display: inline-block;"><div class="box1"><input ng-click="radioFn($event)" type="radio" id="check-2" name="evaluation" class="input ng-valid ng-not-empty ng-dirty ng-touched" ng-model="radioV" ng-value="3"><span></span></div><label for="check-2" class="ng-binding">不通过</label></div></div><div class="text-left"><label>验收日期:</label><input value="' + moment().format('YYYY-MM-DD') + '" class="verifydata" name="verifydata" id="verifydata"/></div><div class="text-left"><label>验收说明:</label><textarea id="verifycontent" placeholder="请输入验收通过说明（非必填）" name="verifycontent" class="verifycontent"></textarea></div>';
                        content = '操作成功！';
                        break;
                    case 'noPass':
                        $scope.checkWin = true;
                        $scope.checkDate = moment().format('YYYY-MM-DD');
                        _id = 'pass';
                        className = "pass-wrap";
                        height = "285px";
                        $scope.radioV = 3;
                        msg = '<div><label>验收日期:</label><input value="' + moment().format('YYYY-MM-DD') + '" class="verifydata" name="verifydata" id="verifydata"/></div><div><label>验收说明:</label><textarea id="verifycontent" name="verifycontent" class="verifycontent"></textarea></div>';
                        content = '操作成功！';
                        break;
                    case 'again':
                        className = "again-wrap";
                        msg = '是否重新编辑？';
                        content = '操作成功！';
                        break;
                    case 'cancel':
                        msg = "是否撤销申请？";
                        conetnt = '撤销成功!'
                        break;
                    case 'account':
                        className = "account-wrap";
                        msg = '是否记账？';
                        content = '记账成功！';
                        break;
                    case 'audit':
                        className = "audit-wrap";
                        msg = '是否审核？';
                        content = '审核成功！';
                        break;
                }
                if(type == "save") {
                    /*处理预台账、更改状态*/
                    $scope.handleAssets({
                        type: type
                    }, function() {
                        
                        /*var msg = layer.msg('<div class="toaster"><i></i><span>' + content + '</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });*/
                        if(type != 'print') {
                            $state.go('main.tre.ytz.list',{id:$stateParams.id,isOpMsg:content,isOp:true});
                        }
                    });
                    
                    return;

                }

                var layCon = '<div class="pad-fifty ' + className + ' ">' + msg + '</div>';

                if(type == 'pass' || type == 'noPass'){
                    layCon = $('#checkWinCon');
                    height = 560;
                }else if(type != 'print'){
                    layCon = '<div class="pad-fifty ' + className + ' "><div style="padding-bottom:20px;padding-top: 0;" class="alertImg"><img src='+layerImg+'></div>' + msg + '</div>';
                }

                if(type == 'again'){
                    $state.go('main.tre.ytz.assets', {
                        id:$stateParams.id,
                        state: 3, //暂时为暂存
                        assetsId: $scope.assetsId,
                        currentState: 3
                    });
                    return;
                }

                if(type == 'cancel2'){
                    $state.go('main.tre.ytz.assets', {
                        id:$stateParams.id,
                        state: 3, //暂时为暂存
                        assetsId: $scope.assetsId,
                        currentState: ''
                    });
                    return;
                }


                if(type == 'print'){
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
                               $scope.printTable();
                            });
                            ($('.printscale1').height()>52)&&($scope.printscale1=true);
                            ($('.printscale2').height()>52)&&($scope.printscale2=true);
                        }
                    });
                    layer.style(index, {
                        fontSize: '16px',
                        backgroundColor: '#fff',
                    });

                    return;
                }
                console.log(content);


                var index = layer.open({
                    time: 0, //不自动关闭
                    type:1,
                    // content: (type == 'pass' || type == 'noPass') ? $('#checkWinCon'):'<div class="pad-fifty ' + className + ' "><div style="padding-bottom:20px;padding-top: 0;" class="alertImg"><img src='+layerImg+'></div>' + msg + '</div>',
                    content: layCon,
                    title: ['提示', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    closeBtn: closeBtn,
                    id:_id,
                    shade: 0.3,
                    shadeClose: true,
                    success: function() {

                        if(type == "pass" || type == "noPass") {
                            angular.element(".verifydata").daterangepicker({
                                format: 'YYYY-MM-DD',
                                startDate: new Date(),
                                endDate: new Date(),
                                maxDate: new Date(),
                                timePicker: false,
                                opens: "top",
                                singleDatePicker: true
                            });

                            $scope.verifyConNum = 0;
                            $scope.verifycontent = '';

                            $scope.verifyConChange = function () {
                                if($scope.verifycontent.length<=300){
                                    $scope.verifyConNum = $scope.verifycontent.length;
                                }else{
                                    return;
                                }
                            }
                        }

                    },
                    btn: closeArr,
                    yes: function(index) {
                        layer.close(index);

                        /*验收信息*/
                        if(type == "pass" || type == "noPass") {
                            $scope.verifyinfo = {
                                id: $scope.assetsId,
                                verifyDate: Date.parse(new Date($(".verifydata").val())),
                                verifyRemark: $(".verifycontent").val(),
                                // verifyStatus: type == 'pass' ? 2 : 3
                                verifyStatus: $scope.radioV
                            }

                        }

                        /*处理预台账、更改状态*/
                        $scope.handleAssets({
                            type: type
                        }, function() {
                            /*var msg = layer.msg('<div class="toaster"><i></i><span>' + content + '</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0
                            });*/
                            if(type != 'print') {
                                $state.go('main.tre.ytz.list',{id:$stateParams.id,isOpMsg:content,isOp:true});
                                /*$state.go('main.tre.ytz.list',{id:$stateParams.id});*/
                            }
                        });

                    },
                    area: [width, height],
                    btnAlign: 'r'
                });
                layer.style(index, {
                    fontSize: '16px',
                    backgroundColor: '#fff',
                });
            }

            //初始化验证
            //validate($scope);
            $scope.btnFn = function($event) {
                var name = $event.target.name;
                $scope.layerWin(name);
            }

            function saveData() {
                var m = $scope.record;
                if(m) {
                    $scope.isDisabled = true; //提交disabled
                    $.ajax({
                        dataType: 'json',
                        contentType: 'application/json;charset=UTF-8',
                        url: '/user/update',
                        data: angular.toJson(m)
                    }).then(callback);
                }

                function callback(result) {
                    if(result.httpCode == 200) { //成功
                        toaster.clear('*');
                        toaster.pop('success', '', "保存成功");
                        $timeout(function() {
                            $state.go('main.sys.user.list',{id:$stateParams.id});
                        }, 2000);
                    } else {
                        toaster.clear('*');
                        toaster.pop('error', '', result.msg);
                        $scope.isDisabled = false;
                    }
                    $scope.loading = false;
                }
            }

            var handleFileSelect = function(evt) {
                var file = evt.currentTarget.files[0];
                if(!/image\/\w+/.test(file.type)) {
                    return false;
                }
                var reader = new FileReader();
                reader.onload = function(evt) {
                    $scope.$apply(function($scope) {
                        $scope.myImage = evt.target.result;
                    });
                };
                reader.readAsDataURL(file);
            };

            $scope.calee = function() {
                var name, value;
                var str = location.href; //取得整个地址栏
                var num = str.indexOf("?")
                str = str.substr(num + 1); //取得所有参数   string var.substr(start [, length ]

                var arr = str.split("&"); //各个参数放到数组里
                for(var i = 0; i < arr.length; i++) {
                    num = arr[i].indexOf("=");
                    if(num > 0) {
                        name = arr[i].substring(0, num);
                        value = arr[i].substr(num + 1);
                        this[name] = value;
                    }

                    if($stateParams.state == 0) {
                        $scope.statusText = '暂存';
                        $scope.ulStatus = false;
                        $scope.pro1=false;
                        $scope.pro2=false;
                        $scope.pro3=false;
                    }

                    $scope.goHref = function(type) {
                        var url = '';

                        if(type == 'buy') {
                            url = 'main.tre.ytz.purchase';
                        } else if(type == 'assets') {
                            url = 'main.tre.ytz.assets';
                            $scope.assetsDetailInfo.invoiceNos = "";
                            $(".invoiceNos").each(function(index, item) {
                                var _thisVal = $(item).val();
                                if(_thisVal) {
                                    if($scope.assetsDetailInfo.invoiceNos) {
                                        $scope.assetsDetailInfo.invoiceNos += ',' + _thisVal;
                                    } else {
                                        $scope.assetsDetailInfo.invoiceNos = _thisVal;
                                    }

                                }

                            });
                            //处理资金来源
                            $scope.assetsDetailInfo.fundSourceMoneys = "";
                            $(".fond-resourse").each(function(index, item) {
                                var _thisval = $(item).val();
                                if(_thisval) {
                                    if($scope.assetsDetailInfo.fundSourceMoneys) {

                                        $scope.assetsDetailInfo.fundSourceMoneys += ',' + _thisval
                                    } else {
                                        $scope.assetsDetailInfo.fundSourceMoneys = _thisval;
                                    }
                                }

                            })
                            $scope.assetsDetailInfo.fundSourceMoneys = $scope.assetsDetailInfo.fundSourceMoneys.split(',');
                            $scope.assetsDetailInfo.invoiceNos = $scope.assetsDetailInfo.invoiceNos.split(',');
                            $localStorage.assetsDetailInfo.fundSourceMoneys = $scope.assetsDetailInfo.fundSourceMoneys;
                            $localStorage.assetsDetailInfo.invoiceNos = $scope.assetsDetailInfo.invoiceNos;

                        }
                        $state.go(url, {
                            id: $stateParams.id,
                            state: $stateParams.state,
                            currentState: $scope.currentState,
                            assetsId: $scope.assetsId,
                            IsSwitch: true
                        });
                    }

                    switch($stateParams.state) {
                        case '0':
                            $scope.statusText = '暂存';
                            $scope.ulStatus = false;
                            $scope.pro1=false;
                            $scope.pro2=false;
                            $scope.pro3=false;
                            $scope.pro4=true;
                            /*重新编辑跳转的页面*/
                            if($scope.currentState == 3) {
                                $scope.btnData = [{
                                    name: 'submit',
                                    text: '提交验收',
                                    class: 'btn-submit'
                                }, {
                                    name: 'cancel',
                                    text: '取消申请',
                                    class: 'btn-delete'
                                }];

                            }
                            break;
                        case '1':
                            $scope.statusText = '待验收';
                            $scope.ulStatus = true;
                            $scope.pro1=true;
                            $scope.pro2=false;
                            $scope.pro3=false;
                            $scope.pro4=false;
                            $scope.btnData = [{
                                    name: 'pass',
                                    text: '验收',
                                    class: 'btn-submit'
                                }
                                // , {
                                //  name: 'noPass',
                                //  text: '验收不通过',
                                //  class: 'btn-save'
                                // }
                            ];
                            // $scope.pro2 = true;
                            // $('.ytz-detail').css('padding-top', '140px');
                            break;
                        case '2':
                            $scope.statusText = '验收已通过';
                            $scope.ulStatus = true;
                            $scope.pro1=false;
                            $scope.pro2=true;
                            $scope.pro3=false;
                            $scope.pro4=false;
                            $scope.btnData = [{
                                name: 'print',
                                text: '打印标签',
                                class: 'btn-save btn-print'
                            }];
                            $scope.pro2 = true;
                            // $('.ytz-detail').css('padding-top', '140px');
                            break;
                        case '3':
                            $scope.ulStatus = true;
                            $scope.pro1=false;
                            $scope.pro2=false;
                            $scope.pro3=true;
                            $scope.pro4=false;
                            $scope.statusText = '验收未通过';
                            $scope.btnData = [{
                                name: 'again',
                                text: "重新编辑",
                                class: 'btn-submit'
                            }, {
                                name: "cancel",
                                text: "撤销",
                                class: "btn-save"
                            }];
                            $scope.pro3 = true;

                            if($scope.currentState == 3) {
                                $scope.btnData = [{
                                    name: 'submit',
                                    text: '提交验收',
                                    class: 'btn-submit'
                                }, {
                                    name: 'cancel2',
                                    text: '取消',
                                    class: 'btn-delete'
                                }];

                            }

                            // $('.ytz-detail').css('padding-top', '141px');
                            break;
                            // case '4':
                            // $('.btn-list').html('<a name="print" class="pos-fix-btn pf-btn-sub btn-hover">提醒记账</a>'+
                            // '<a name="print" class="pos-fix-btn pf-btn-save">打印出库单</a>');
                            //  $('.pro-ul em').text('记账待通过');
                            //  $('.pro-ul li:last-child').remove();
                            //  break;
                            // case '5':
                            // $('.btn-list').html('');
                            //  $('.pro-ul em').text('已出库');
                            //  break;
                        default:
                            break;
                    }
                }

            }

            $scope.calee();

            $scope.topHeight = 0;

            $scope.proUl = function($event) {
                var liNum = 0;
                if($scope.pro1) {
                    liNum = $('#pro1 li').length;
                } else if($scope.pro2) {
                    liNum = $('#pro2 li').length;
                } else if($scope.pro3) {
                    liNum = $('#pro3 li').length;
                }

                if(this.state == '0') {
                    return;
                }
                var name = $event.target.name;
                var detailPadding = parseInt($('.ytz-detail').css('padding-top'));
                $scope.isClick = !$scope.isClick;
                if(name == 'down') {
                    $('.pro-ul').css({
                        'height': 'inherit',
                        'overflow-y': 'inherit'
                    });
                    // $('.ytz-detail').css('padding-top', detailPadding + (liNum * 28 - 28));
                } else {
                    $('.pro-ul').css({
                        'height': '28px',
                        'overflow-y': 'hidden'
                    });
                    // $('.ytz-detail').css('padding-top', detailPadding - (liNum * 28 - 28));
                }
            };

            $scope.hideAll = function() {
                $scope.devshow = false;
                $scope.depetshow = false;
                $scope.devshow1 = false;
                $scope.needOverlay = false;
            }

            /*部门、科室搜索*/
            $scope.showdeptList = function(dept) {
                $scope.keyword.nameSearch = '';
                if(dept == 1) {
                    $scope.depetshow = true;
                } else if(dept == 2) {
                    $scope.depetshow2 = true;
                } else if(dept == 3) {
                    $scope.depetshow3 = true;
                }
                $scope.devshow = true;
                $scope.needOverlay = true;
                }
                //获取科室名称
            $scope.searchList = function() {

                    $.ajax({
                        type: "get",
                        url: "/sys/dept/search/tenant/" + $scope.tenantId,
                        data: {
                            keyword: $scope.keyword.nameSearch
                        },
                        complete: function(res) {
                            if(res.responseJSON.code == 200) {
                                $scope.deptList = res.responseJSON.data;
                                $rootScope.$apply();
                            }

                        }
                    });

                }
                //设置科室名称
            $scope.setDeptValue = function(id, name, curDept) {
                if(curDept == 1) {
                    $scope.applyDepetName = name;
                    $scope.assetsDetailInfo.applyDeptId = id;
                    $scope.depetshow = false;
                } else if(curDept == 2) {
                    $scope.depetName = name;
                    $scope.assetsDetailInfo.deptId = id;
                    $scope.depetshow2 = false;
                } else if(curDept == 3) {
                    $scope.manageDepName = name;
                    $scope.assetsDetailInfo.manageDeptId = id;
                    $scope.depetshow3 = false;
                }

                $scope.deptList = [];

                $scope.devshow = false;
                $scope.needOverlay = false;
            }

            // 初始化页面
            function activate() {
                $('.pro-ul').css({
                    'height': '28px',
                    'overflow-y': 'hidden'
                })
            }

            //表单验证
            function validate(userId) {
                //notEqual 规则
                $.validator.addMethod('notEqual', function(value, ele) {
                    return value != this.settings.rules[ele.name].notEqual;
                });

                var validateData = {
                    rules: {
                        assetName: {
                            required: true
                        },
                        belongDept: {
                            required: true
                        },
                        regNo: {
                            required: true
                        },
                        splName: {
                            required: true
                        }
                    },
                    messages: {
                        assetName: {
                            required: '请填写设备名称'
                        },
                        belongDept: {
                            required: '请填写所在部门'
                        },
                        regNo: {
                            required: '请填写注册证号'
                        },
                        splName: {
                            required: '请选择供应商'
                        }
                    },
                    submitHandler: function() {
                        $scope.submit();
                    }
                }
                jQuery('#form1').validate(validateData);
            };
        }
    ]);