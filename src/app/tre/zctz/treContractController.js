'use strict';

angular.module('app')
    .controller('treContractController', ['$scope', '$rootScope', '$state', '$timeout', '$localStorage', '$stateParams', 'FileUploader', 'printCodeService',
        function($scope, $rootScope, $state, $timeout, $localStorage, $stateParams, FileUploader, printCodeService) {
            $rootScope.currentmodule='资产台账';
            // upload file 3 
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
                        for (var i = 0; i < $scope.res.contractAnnexList.length; i++) {
                            $scope.res.contractAnnexList[i].imgUrlEn = encodeURI(encodeURI($scope.res.contractAnnexList[i].uploadUrl));
                        };
                        $scope.res.endDate1=$scope.res.endDate?$scope.dateToTime($scope.res.endDate):'';
                        $scope.res.startDate1=$scope.res.startDate?$scope.dateToTime($scope.res.startDate):'';
                        $scope.res.singleBudget1 = $scope.res.singleBudgetStr?$scope.res.singleBudgetStr.slice(1).split(',').join(''):'';
                        $scope.res.price1 = $scope.res.priceStr?$scope.res.priceStr.slice(1).split(',').join(''):'';
                        $scope.res.contractPrice1 = $scope.res.contractPriceStr?$scope.res.contractPriceStr.slice(1).split(',').join(''):'';
                        $scope.res.invoiceNos&&($scope.res.invoiceNos=$scope.res.invoiceNos.split(',').join(';'));
                        if($scope.res.listInvoice.length){
                            $scope.res.invoiceNo = '';
                            for (var i = $scope.res.listInvoice.length - 1; i >= 0; i--) {
                                $scope.res.invoiceNo=$scope.res.listInvoice[i].invoiceNo;
                            };
                        }
                        (!$scope.res.listInvoice.length)&&($scope.res.listInvoice.push({assetsId:$scope.res.assetsId,invoiceNo:null}));
                    }else{
                        $scope.res={};
                    }
                    $rootScope.$apply();
                }
            });
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
                // !a&&(data.assetsName=$scope.assetsName)&&(url='/assets/assetsInfo/updateAssetsName')&&($scope.assetsNameFocus=false)&&($scope.assetsNameEdit=false);
                // a&&(data.factoryName=$scope.factoryName)&&(url='/assets/assetsInfo/updateFactoryName')&&($scope.factoryNameFocus=false)&&($scope.factoryNameEdit=false);
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
            //关闭所有的弹出框
            $scope.closeAll = function() {
                $scope.needOverlay = false;
                
                $scope.fundSourcesListShow = false;
                $scope.purchaseTypeListShow = false;
            }
            // 字节限制
            $scope.limitLengths=function(a,b){
                $scope.deleteSpace(a,b,$scope.res);
                $scope.lengthSubstring(a,b,$scope.res);
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

            //编辑台账
            $scope.saveAssets = function() {
                // 模板类型的分类
                $scope.res.moduleType = 3
                console.log($scope.res.moduleType)
                $scope.res.invoiceNos&&($scope.res.invoiceNos=$scope.res.invoiceNos.replace(/[\D]+/g,';'));
                $scope.res.invoiceNos&&($scope.res.invoiceNos.charAt($scope.res.invoiceNos.length-1)==';')&&($scope.res.invoiceNos=$scope.res.invoiceNos.substring(0,$scope.res.invoiceNos.length-1))
                $scope.listInvoice = $scope.res.invoiceNos?$scope.res.invoiceNos.split(';'):'';
                $scope.res.listInvoice=[];
                for (var i = 0; i < $scope.listInvoice.length; i++) {
                    $scope.res.listInvoice.push({assetsId:$scope.res.assetsId,invoiceNo:$scope.listInvoice[i]});
                };
                if($scope.res.listFundSources.length!=0){
                    for(var i=0;i<$scope.res.listFundSources.length;i++){
                        $scope.res.listFundSources[i].fundSourceMoneyStr = ($scope.res.listFundSources[i].fundSourceMoney/100).toString();
                    }
                }
                $scope.res.contractAnnex =$scope.res.contractAnnexList;
                $scope.res.endDate = $scope.res.endDate1?(new Date($scope.res.endDate1).getTime()):null;
                $scope.res.startDate = $scope.res.startDate1?(new Date($scope.res.startDate1).getTime()):null;
                $scope.res.contractPriceStr = $scope.res.contractPrice1;
                $scope.res.priceStr = $scope.res.price1;
                $scope.res.singleBudgetStr = $scope.res.singleBudget1;
                !$scope.res.contractPrice1&&(delete $scope.res.contractPriceStr);
                !$scope.res.price1&&(delete $scope.res.priceStr);
                !$scope.res.endDate1&&(delete $scope.res.endDate);
                !$scope.res.startDate1&&(delete $scope.res.startDate);

                $.ajax({
                    type: "post",
                    url: "/assets/assetsInfo/editAssets",
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify($scope.res),
                    complete: function(res) {
                        var txt = '保存成功';
                        if(res.responseJSON.code == 200) {
                        }else{
                            txt=res.responseJSON.msg;
                        }
                        $state.go('main.tre.zctz.contract', {id: $stateParams.id,
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
                $scope.saveAssetsTitle(0);
                $scope.saveAssetsTitle(1);
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
                });

            }
            $scope.$watch('res.endDate1', function(newValue, oldValue, scope) {
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
                    startDate: newValue?(new Date(newValue)):(new Date())
                }), function(date, enddate, el) {
                    var currentel = $(this.element).attr("name");
                    currentel == "endDate" && ($scope.res.endDate1 = date.format('YYYY-MM-DD'));
                    currentel == "startDate" && ($scope.res.startDate1 = date.format('YYYY-MM-DD'));
                    $rootScope.$apply();
                });
            });
            $scope.$watch('res.startDate1', function(newValue, oldValue, scope) {
                var option = {
                    format: 'YYYY-MM-DD',
                    startDate: new Date(newValue),
                    endDate: new Date("2050-01-01"),
                    maxDate: new Date("2050-01-01"),
                    timePicker: false,
                    opens: "top",
                    singleDatePicker: true
                }
                angular.element('.el-startDate').daterangepicker($.extend({}, option, {
                    startDate: newValue?(new Date(newValue)):(new Date())
                }), function(date, enddate, el) {
                    var currentel = $(this.element).attr("name");
                    currentel == "purchaseDate" && ($scope.res.purchaseDate1 = date.format('YYYY-MM-DD'));
                    currentel == "startDate" && ($scope.res.startDate1 = date.format('YYYY-MM-DD'));
                    $rootScope.$apply();
                });

            });

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
        }]);