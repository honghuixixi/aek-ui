angular.module('app')

    .controller('generalController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', '$filter', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage, $filter) {
        $rootScope.currentmodule = '平台首页';
        // 下拉菜单
        $.ajax({
            url: '/oauth/cache/permission/list',
            async:false,
            data:{tenantId:$stateParams.tenantId},
            type: 'post'
        }).then(function(res) {
            var oldOrgs = $localStorage.userInfo.orgs;
            var oldTenantName = $localStorage.userInfo.tenantName;
            var oldTenantId = $localStorage.userInfo.nowOrgId;
            
            $localStorage.userInfo = res;

            $localStorage.userInfo.orgs = oldOrgs;
            $localStorage.userInfo.tenantName = oldTenantName;
            $localStorage.userInfo.nowOrgId = oldTenantId;
            $localStorage.userInfo.nowOrgType =$localStorage.userInfo.tenantType;
            if($rootScope.userInfo && !$rootScope.userInfo.authoritiesStr) {
                $rootScope.userInfo.authoritiesStr = '';
            }
            $rootScope.userInfo = $localStorage.userInfo;
            $rootScope.meau = $rootScope.userInfo.modules.length ? true : false;
        });

        $scope.nowOrgType=function(){
            $scope.optionType=($localStorage.userInfo.nowOrgType||$localStorage.userInfo.tenantType)==0?[{
                id: 0,
                name: '平台医疗机构数'
            },{
                id: 1,
                name: '平台设备资产数'
            },{
                id: 2,
                name: '平台设备资产总额'
            }]:($localStorage.userInfo.nowOrgType==2?[{
                id: 0,
                name: '监管医疗机构数'
            },{
                id: 1,
                name: '监管设备数'
            },{
                id: 2,
                name: '监管设备总额'
            }]:[{
                id: 1,
                name: '设备资产数'
            },{
                id: 2,
                name: '维修中的设备资产数'
            }]);
            $scope.typeModel = $scope.optionType[0];
            $scope.chartScopeChange(1);
        }
        $scope.typeList = false;
        $scope.generalList = new Array(3);
        $scope.option = function(list, value, item) {
            $rootScope.fixWrapShow = false;
            $scope[list] = false;
            $scope[value] = item;
            $scope.chartScopeChange(null,item.id);
        }
        $scope.listShow = function(str) {
            if($rootScope.fixWrapShow)
                return $scope.menuHide();
            $scope[str] = true;
            $rootScope.fixWrapShow = true;
        }
        $rootScope.fixWrapShow = false;
        $scope.menuHide = function() {
            $rootScope.fixWrapShow = false;
            $scope.typeList = false;
        }
        // 下拉菜单END

        // chart
        $scope.chartScope = 1;
        $scope.echartDataY=[];
        $scope.echartDataX=[];
        $scope.chartDateRootScope = '';
        $scope.chartData1 = function(data){
            delete data.status;
            data.tenantId = $stateParams.tenantId || $localStorage.userInfo.tenantId;
            $.ajax({
                type: 'get',
                url: '/sys/tenant/censusByDay',
                data: data,
                complete: function(res) {
                    if(res.responseJSON.code == 200) {
                        var datas = res.responseJSON.data;
                        var count = 0;
                        if(datas==null||!datas.length){return $scope.echartsInit($scope.typeModel.name,[],[]);}
                        for (var i = 0,len=datas.length; i < len; i++) {
                            $scope.echartDataY.push(datas[i].count);
                            count+=datas[i].count;
                            $scope.echartDataX.push(datas[i].dateStr);
                        };
                        $scope.echartsInit($scope.typeModel.name,$scope.echartDataX,$scope.echartDataY);
                    }
                }
            });
        }
        $scope.getUseCreatTime=function(){
            var id = 0;
            if($localStorage.userInfo && $localStorage.userInfo.id){
                id = $localStorage.userInfo.id;
            }
            $.ajax({
                type: 'get',
                url: '/sys/user/' + id,
                complete: function(res) {
                    if(res.responseJSON.code == 200) {
                        $scope.creatTime = res.responseJSON.data.createTime;
                    }
                    $scope.initcalendar();
                }
            });
        }
        $scope.getUseCreatTime();
        $scope.chartData2 = function(a,data){
            a&&($scope.typeModel.id==2)&&(data.status=4);//a存在是医疗机构
            $.ajax({
                type: 'post',
                url: '/assets/assetsInfo/queryAssetsCurve',
                data: JSON.stringify(data),
                contentType: "application/json;charset=UTF-8",
                complete: function(res) {
                    if(res.responseJSON.code == 200) {
                        var data = res.responseJSON.data;
                        var key = a?'count':($scope.typeModel.id==1?'count':'priceStr');
                        if(data==null||!data.length){return $scope.echartsInit($scope.typeModel.name,[],[],key=='priceStr');}
                        for (var i = 0,len=data.length; i < len; i++) {
                            $scope.echartDataY.push(key=='priceStr'?data[i][key].slice(1):data[i][key]);
                            $scope.echartDataX.push(data[i].date);
                            (key=='priceStr')&&($scope.echartDataY[i]=$scope.echartDataY[i].split(',').join(''));
                        };
                        $scope.echartsInit($scope.typeModel.name,$scope.echartDataX,$scope.echartDataY,key=='priceStr');
                    }
                }
            });
        }
        $scope.generalListGet=function(a){
            var data = {
                tenantId: $stateParams.tenantId || $localStorage.userInfo.tenantId,
                flag: $localStorage.userInfo.nowOrgType==2?2:1
            };
            ($localStorage.userInfo.nowOrgType!=1)&&$.ajax({
                type: 'get',
                url: '/sys/tenant/count',
                data: data,
                complete: function(res) {
                    if(res.responseJSON.code&&res.responseJSON.code == 200) {
                        var datas = res.responseJSON.data;
                        $scope.generalList[0]={num:datas||0,name:$localStorage.userInfo.nowOrgType==0?'平台医疗机构数':'监管医疗机构数'};
                    }else{
                        $scope.generalList[0]={err:true,num:'暂无数据',name:$localStorage.userInfo.nowOrgType==0?'平台医疗机构数':'监管医疗机构数'};
                    }
                    $rootScope.$apply();
                }
            });
            delete data.flag;
            ($localStorage.userInfo.nowOrgType!=1)&&$.ajax({
                type: 'get',
                url: '/assets/assetsInfo/getAssetsNumAndMoney',
                data: data,
                contentType: "application/json;charset=UTF-8",
                complete: function(res) {
                    if(res.responseJSON.code&&res.responseJSON.code == 200) {
                        var data = res.responseJSON.data;
                        $scope.generalList[1]={num:data.num,name:$localStorage.userInfo.nowOrgType==0?'平台设备资产数':'监管设备数'};
                        $scope.generalList[2]={num:data.sumPrice,name:$localStorage.userInfo.nowOrgType==0?'平台设备资产总额':'监管设备总额'};

                    }else{
                        $scope.generalList[1]={err:true,num:'暂无数据',name:$localStorage.userInfo.nowOrgType==0?'平台设备资产数':'监管设备数'};
                        $scope.generalList[2]={err:true,num:'暂无数据',name:$localStorage.userInfo.nowOrgType==0?'平台设备资产总额':'监管设备总额'};
                    }
                    $rootScope.$apply();
                }
            });
            $localStorage.userInfo.nowOrgType==1&&$.ajax({
                type: 'get',
                url: '/assets/assetsInfo/getAssetsCount',
                data: data,
                complete: function(res) {
                    if(res.responseJSON.code&&res.responseJSON.code == 200) {
                        var data = res.responseJSON.data;
                        $scope.generalList[1]={num:data[data.length-1].count,name:'维修中的设备资产数'};
                        $scope.generalList[0]={num:data[0].count,name:'设备资产数'};
                    }else{
                        $scope.generalList[1]={err:true,num:'暂无数据',name:'维修中的设备资产数'};
                        $scope.generalList[0]={err:true,num:'暂无数据',name:'设备资产数'};
                    }
                    $scope.getMembers();
                }
            });
        }
        $scope.generalFlush=function(a){
            var data = {
                tenantId: $stateParams.tenantId || $localStorage.userInfo.tenantId,
                flag: $localStorage.userInfo.nowOrgType==2?2:1
            };
            (a==0)&&($localStorage.userInfo.nowOrgType!=1)&&$.ajax({
                type: 'get',
                url: '/sys/tenant/count',
                data: data,
                complete: function(res) {
                    if(res.responseJSON.code&&res.responseJSON.code == 200) {
                        var datas = res.responseJSON.data;
                        $scope.generalList[0]={num:datas||0,name:$localStorage.userInfo.nowOrgType==0?'平台医疗机构数':'监管医疗机构数'};
                    }else{
                        $scope.generalList[0]={err:true,num:'暂无数据',name:$localStorage.userInfo.nowOrgType==0?'平台医疗机构数':'监管医疗机构数'};
                    }
                    $rootScope.$apply();
                }
            });
            delete data.flag;
            (a!=0)&&($localStorage.userInfo.nowOrgType!=1)&&$.ajax({
                type: 'get',
                url: '/assets/assetsInfo/getAssetsNumAndMoney',
                data: data,
                contentType: "application/json;charset=UTF-8",
                complete: function(res) {
                    if(res.responseJSON.code&&res.responseJSON.code == 200) {
                        var data = res.responseJSON.data;
                        (a==1)&&($scope.generalList[1]={num:data.num,name:$localStorage.userInfo.nowOrgType==0?'平台设备资产数':'监管设备数'});
                        (a==2)&&($scope.generalList[2]={num:data.sumPrice,name:$localStorage.userInfo.nowOrgType==0?'平台设备资产总额':'监管设备总额'});

                    }else{
                        (a==1)&&($scope.generalList[1]={err:true,num:'暂无数据',name:$localStorage.userInfo.nowOrgType==0?'平台设备资产数':'监管设备数'});
                        (a==2)&&($scope.generalList[2]={err:true,num:'暂无数据',name:$localStorage.userInfo.nowOrgType==0?'平台设备资产总额':'监管设备总额'});
                    }
                    $rootScope.$apply();
                }
            });
            ($localStorage.userInfo.nowOrgType==1)&&$.ajax({
                type: 'get',
                url: '/assets/assetsInfo/getAssetsCount',
                data: data,
                complete: function(res) {
                    if(res.responseJSON.code&&res.responseJSON.code == 200) {
                        var data = res.responseJSON.data;
                        (a==1)&&($scope.generalList[1]={num:data[data.length-1].count,name:'维修中的设备资产数'});
                        (a==0)&&($scope.generalList[0]={num:data[0].count,name:'设备资产数'});
                    }else{
                        (a==1)&&($scope.generalList[1]={err:true,num:'暂无数据',name:'维修中的设备资产数'});
                        (a==0)&&($scope.generalList[0]={err:true,num:'暂无数据',name:'设备资产数'});
                    }
                    (a==2)&&($scope.getMembers());
                }
            });
        }
        $scope.generalListGet();

        $scope.getMembers=function(){
            $.ajax({
                type: 'get',
                url: '/sys/user/count/tenant/'+($stateParams.tenantId || $localStorage.userInfo.tenantId),
                complete: function(res) {
                    if(res.responseJSON.code&&res.responseJSON.code == 200) {
                        $scope.generalList[2]={name:'成员用户数',num:res.responseJSON.data};
                    }else{
                        $scope.generalList[2]={err:true,name:'成员用户数',num:'暂无数据'};
                    }
                    $rootScope.$apply();
                }
            });
        }

        $scope.dateToTime=function(a){
            var date = new Date(a);
            var y = date.getFullYear();
            var m = date.getMonth();
            m=m<10?('0'+m):m;
            var d = date.getDate();
            d=d<10?('0'+d):d;
            return y+'-'+m+'-'+d;
        }
        $scope.chartScopeChange = function(a){
            $scope.chartScope = a||$scope.chartScope;
            $scope.echartDataY=[],$scope.echartDataX=[];
            var data = {
                startDate: $scope.startDate,
                endDate: $scope.endDate,
                status: ''
            };
            $scope.chartScope&&(data={dateLabel: $scope.chartScope,status: ''});
            $scope.typeModel.id?$scope.chartData2($localStorage.userInfo.nowOrgType==1,data):$scope.chartData1(data);
        }
        $scope.nowOrgType();
        $scope.startDate='';
        $scope.endDate='';
        $scope.creatTime=null;
        // date
        function getDaysInOneMonth(year, month){
          month = parseInt(month, 10);
          var d= new Date(year, month, 0);
          return d.getDate();
        }
        $scope.initcalendar = function() {
            var startyear = new Date().getFullYear();
            var startmonth = (new Date().getMonth()+1);
            var day = new Date().getDate();
            var date = getDaysInOneMonth(startyear,startmonth);
            var maxday = day<date?(day<10?('0'+(day+1)):(day+1)):'01';
            var maxmonth = day<date?(startmonth<10?('0'+startmonth):startmonth):(startmonth+1);
            var maxyear = day<date?startyear:(startmonth==12?(year+1):startyear);
            startmonth = startmonth<10?('0'+startmonth):startmonth;
            day = day<10?('0'+day):day;
            var option = {
                format: 'YYYY-MM-DD',
                startDate: startyear+'-'+startmonth+'-01',
                endDate: maxyear+'-'+maxmonth+'-'+day,
                minDate: new Date($scope.creatTime)||'',
                limitDate: true,
                timePicker: false,
                maxDate: maxyear+'-'+maxmonth+'-'+maxday,
                timePicker12Hour:false,
                opens: "left",
                singleDatePicker: false
            }
            angular.element('#chartDateScope').daterangepicker($.extend({
            }, option, {
                startDate: startyear+'-'+startmonth+'-01',endDate: startyear+'-'+startmonth+'-'+day
            }), function(date, enddate, el) {

            });
            $('#chartDateScope').on('apply.daterangepicker', function(a,b) {
                var date = new Date(b.startDate),enddate = new Date(b.endDate);
                var same = $scope.startDate==date&&$scope.endDate==enddate;
                $scope.startDate=date;
                $scope.endDate=enddate;
                (!same)&&($scope.chartScope=0);
                (!same)&&$scope.chartScopeChange();
                $rootScope.$apply()
            });
        }
        // echart
        $scope.echartsInit=function(a,b,c,d){
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('fy_generalChart'));
            window.onresize=function(){
                myChart.resize({
                    width: null
                });
            }
            // 指定图表的配置项和数据
            var option = {
                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'line',
                        axis: 'x',
                        lineStyle: {
                            color: '#4ab29b',
                            width: 2
                        }
                    },
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    formatter: '{b0}<br />'+a+'：{c}'
                },
                grid: {
                    top: 70,
                    bottom: 50
                },
                xAxis: [
                    {
                        axisLine: {
                            onZero: true
                        },
                        boundaryGap: false,
                        type: 'category',
                        triggerEvent: true,
                        data: b
                    }
                ],
                yAxis: [
                    {
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: true,
                            interval: 1,
                            lineStyle: {
                                color: '#dcdcdc'
                            }
                        },
                        axisLabel: {
                            formatter: '{value}'
                        },
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name:'2016',
                        type:'line',
                        lineStyle: {
                            normal: {
                                color: '#f7931e'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#f7931e'
                            }
                        },
                        smooth: true,
                        symbol: 'circle',
                        data: c
                    }
                ]
            };
            d&&(option.yAxis[0].axisLabel.formatter='￥ {value}')&&(option.tooltip.formatter='{b0}<br />'+a+'：￥ {c}');
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
    }])

