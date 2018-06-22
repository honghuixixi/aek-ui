'use strict';

angular.module('app')
    .controller('treDashbordController', ['$scope', '$rootScope', '$state', '$timeout', '$localStorage', '$stateParams',
        function($scope, $rootScope, $state, $timeout, $localStorage, $stateParams) {
            $rootScope.nocontent = false;
            $rootScope.membernav = false;
            $rootScope.userOr = true;

            $rootScope.currentmodule = '资产台账';

            var dt = new Date();
            dt.setDate(dt.getDate() - 1);
            $rootScope.fixWrapShow = false;
            $scope.data = {
                server: {
                    assetsTotalNum: 0, // 资产设备总数
                    assetsTotalCapital: 0.00, // 资产设备总额
                    assetsTotalNewNumYear: 0, // 年度新增设备总数
                    assetsTotalDiscardNumYear: 0, // 年度报损总数
                    assetsTotalNewCapitalYear: 0.00, // 年度新增设备总额
                    assetsTotalDiscardCapitalYear: 0.00, // 年度报损设备总额
                    assetsRepairPercent: 0, // 维修中设备百分比
                    assetsUnrepairPercent: 100, // 正常设备百分比
                    assetsDistribution: [], // 资产分布比例，格式[{remarks: '分布描述（String）', distributionProportion: '分布比例（Double）', sort:'排序（Integer）'}]
                    assetsTotalNumMonth: {}, // 图表数据(资产设备总数) ，格式：{'年份-月份': 统计值} 如： {'2018-01': 1, '2018-02': 5}
                    assetsTotalCapitalMonth: {} // 图表数据（资产设备总额）
                },
                local: {
                    endDate: dt.Format("yyyy-MM-dd"),
                    height: document.body.clientHeight,
                    group: 1, // 1:资产设备总数 2：资产设备总额
                    type: 2, // 1：季度 2：年度
                    year: 0, // 年份选项索引
                    yearOption: [dt.getFullYear(), dt.getFullYear() - 1, dt.getFullYear() - 2], // 年份选项
                    yearOptionShow: false, // 是否显示年份选项
                    compare: 0, // 图表比较选项索引
                    compareOption: ['年度', '去年同期', '三年同期'], // 图表比较选项
                    compareOptionShow: false // 是否显示图表比较选项
                }
            };

            $scope.methods = {
                showOption: function(showKey) {
                    $rootScope.fixWrapShow = true;
                    $scope.data.local[showKey] = true;
                },
                chooseOption: function(indexKey, showKey, index) {
                    $scope.data.local[indexKey] = index;
                    $scope.methods.hideOption(showKey);
                    $scope.methods.drawChart();
                },
                hideOption: function(showKey) {
                    $rootScope.fixWrapShow = false;
                    $scope.data.local[showKey] = false;
                },
                hideAllOption: function() {
                    $rootScope.fixWrapShow = false;
                    $scope.data.local.yearOptionShow = false;
                    $scope.data.local.compareOptionShow = false;
                },
                changeGroup: function(group) {
                    $scope.data.local.group = group;
                    $scope.methods.drawChart();
                },
                changeType: function(type) {
                    $scope.data.local.type = type;
                    $scope.methods.drawChart();
                },
                drawChart: function() {
                    var catalog = {
                        '1': ['第一季度', '第二季度', '第三季度', '第四季度'],
                        '2': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                    };
                    var groups = { '1': '资产设备总数', '2': '资产设备总额' };
                    drawBar(groups[$scope.data.local.group], catalog[$scope.data.local.type], fillData(), $scope.data.local.group > 1)
                },
                drawChart2: function() {
                    var catalog1 = [],
                        data1 = [],
                        catalog2 = ['维修中', '正常'],
                        data2 = [
                            { value: $scope.data.server.assetsRepairPercent, name: '维修中' },
                            { value: $scope.data.server.assetsUnrepairPercent, name: '正常' }
                        ],
                        list = $scope.data.server.assetsDistribution;
                    for (var i = 0, len = list.length; i < len; i++) {
                        catalog1.push(list[i].remarks);
                        data1.push({ value: list[i].distributionProportion, name: list[i].remarks });
                    }
                    drawPie('fy_pie_1', '资产分布比例', catalog1, data1);
                    drawPie('fy_pie_2', '维修设备占比', catalog2, data2);
                },
                getData: function() {
                    $.ajax({
                        type: 'GET',
                        url: '/data/assetsData/getAssetsData',
                        data: {tenantId: $stateParams.tenantId||$localStorage.userInfo.tenantId},
                        contentType: "application/json",
                        complete: function(res) {
                            if (+res.responseJSON.code === 200) {
                                $scope.data.server = res.responseJSON.data;
                                $scope.methods.drawChart();
                                $scope.methods.drawChart2();
                                $scope.$apply();
                            } else {
                                layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
                                    area: ['100%', '60px'],
                                    time: 3000,
                                    offset: 'b',
                                    shadeClose: true,
                                    shade: 0
                                });
                            }
                        }
                    });
                },
                init: function() {
                    if (!$localStorage.userInfo) {
                        return $state.go('website.home');
                    }
                    $scope.methods.getData();
                }
            };

            $scope.methods.init();

            function fillData() {
                switch ($scope.data.local.compare) {
                    case 0:
                        return [getSeries(0)];
                        break;
                    case 1:
                        return [getSeries(0), getSeries(1)];
                        break;
                    case 2:
                        return [getSeries(0), getSeries(1), getSeries(2)];
                        break;
                }
            }

            function getKeys() {
                var list = ['-03', '-06', '-09', '-12'];
                var month = dt.getMonth();
                var index = parseInt(month / 3);
                month = month + 1;
                if(month > 9){
                    list[index] = '-' + month;
                }else{
                    list[index] = '-0' + month;
                }
                return list;
            }

            function getSeries(dis) {
                var year = $scope.data.local.yearOption[$scope.data.local.year] - dis;
                var keys = {
                    '1': getKeys(),
                    '2': ['-01', '-02', '-03', '-04', '-05', '-06', '-07', '-08', '-09', '-10', '-11', '-12']
                }[$scope.data.local.type];
                var datas = $scope.data.local.group > 1 ? $scope.data.server.assetsTotalCapitalMonth : $scope.data.server.assetsTotalNumMonth
                var series = {
                    name: year + '年',
                    type: 'bar',
                    data: []
                };
                for (var i = 0, len = keys.length; i < len; i++) {
                    series.data.push(datas[year + keys[i]] || 0);
                }
                return series;
            }

            function drawBar(a, b, c, d) {
                // 基于准备好的dom，初始化echarts实例

                var myChart = echarts.init(document.getElementById('fy_generalChart'));
                window.onresize = function() {
                    myChart.resize({
                        width: null
                    });
                }
                // 指定图表的配置项和数据
                var option = {
                    color: ['#1e90ff', '#4ecdc4', '#9b95ff', '#ff6b6b', '#fdac19'],
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
                        formatter: function(param) {
                            if (!param.length) {
                                param = [param];
                            }
                            var result = [param[0].name];
                            for (var i = 0, len = param.length; i < len; i++) {
                                if(d){
                                    result.push(param[i].seriesName + a + "：￥" + param[i].data.toFixed(2));
                                }else{
                                    result.push(param[i].seriesName + a + "：" + param[i].data);
                                }                                
                            }
                            return result.join('<br/>');
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: b
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: c
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }

            function drawPie(id, name, catalog, data) {
                var myChart = echarts.init(document.getElementById(id));
                window.onresize = function() {
                    myChart.resize({
                        width: null
                    });
                }
                var option = {
                    color: ['#1e90ff', '#4ecdc4', '#9b95ff', '#ff6b6b', '#fdac19'],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c}"
                    },
                    legend: {
                        x: '10px',
                        y: 'bottom',
                        data: catalog
                    },
                    series: [{
                        name: name,
                        type: 'pie',
                        radius: ['0%', '45%'],
                        label: {
                            normal: {
                                formatter: ' {d}%',
                                borderWidth: 1,
                                borderRadius: 4,
                            }
                        },
                        data: data
                    }]
                };
                myChart.setOption(option);
            }


            function generateData() {
                var result = {
                    '2018-01': 15,
                    '2018-02': 12,
                    '2018-03': 10,
                    '2018-04': 5
                };
                var years = [2017, 2016, 2015, 2014];
                for (var i = 0, len = years.length; i < len; i++) {
                    for (var j = 1; j <= 12; j++) {
                        result[years[i] + '-' + (j > 9 ? j : '0' + j)] = parseInt(Math.random() * 30);
                    }
                }
                return result;
            }
        }
    ]);