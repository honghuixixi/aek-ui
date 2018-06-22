'use strict';
angular.module('app')

    .controller('repairDashbordController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
        $rootScope.currentmodule = "维修管理";
        var dt = new Date();
        dt.setDate(dt.getDate() - 1);
        $rootScope.fixWrapShow = false;
        $scope.data = {
            server: {
                applyTotalNumYear: 0, // 本年度报修总数
                completeTotalNumYear: 0, // 本年度完修总数
                servenCompleteRate: 100, // 设备7天完修率
                repairTotalCapitalYear: 0.00, // 年度维修总额
                repairAssetsNum: 0, //在修设备总数
                waitTakeNum: 0, // 待接单
                repairingNum: 0, // 维修中
                waitCheckNum: 0, // 待验收
                completedNum: 0, // 已完成
                repairCompleteTotalNumMonth: {}, // 完修总数，格式：{'年份-月份': 统计值} 如： {'2018-01': 1, '2018-02': 5}
                repairCompleteTotalCapitalMonth: {}, // 完修费用
                servenCompleteRateMonth: {} // 7天完修率
            },
            local: {
                endDate: dt.Format("yyyy-MM-dd"),
                height: document.body.clientHeight,
                group: 1, // 1:完修总数 2：完修总额 3：7天完修率
                year: 0, // 年份选项索引
                yearOption: [dt.getFullYear(), dt.getFullYear() - 1, dt.getFullYear() - 2, dt.getFullYear() - 3, dt.getFullYear() - 4], // 年份选项
                yearOptionShow: false // 是否显示年份选项
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
            },
            changeGroup: function(group) {
                $scope.data.local.group = group;
                $scope.methods.drawChart();
            },
            drawChart: function() {
                var catalog = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
                var groups = { '1': '完修总数', '2': '完修费用', '3': '7天完修率' };
                drawBar(groups[$scope.data.local.group], catalog, fillData())
            },
            drawChart2: function() {
                var catalog1 = ['待接单', '维修中', '待验收', '已完成'],
                    data1 = [
                        { value: $scope.data.server.waitTakeNum, name: '待接单' },
                        { value: $scope.data.server.repairingNum, name: '维修中' },
                        { value: $scope.data.server.waitCheckNum, name: '待验收' },
                        { value: $scope.data.server.completedNum, name: '已完成' }
                    ];

                drawPie('fy_pie', '维修状态分布', catalog1, data1);
            },
            getData: function() {
                $.ajax({
                    type: 'GET',
                    url: '/data/repairData/getRepairData',
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
                $scope.methods.getData();
            }
        };

        $scope.methods.init();


        function fillData() {
            console.log($scope.data);
            switch ($scope.data.local.group) {
                case 1:
                    return [getSeries($scope.data.server.repairCompleteTotalNumMonth)];
                    break;
                case 2:
                    return [getSeries($scope.data.server.repairCompleteTotalCapitalMonth)];
                    break;
                case 3:
                    return [getSeries($scope.data.server.servenCompleteRateMonth)];
                    break;
            }
        }

        function getSeries(list) {
            console.log(list);
            var year = $scope.data.local.yearOption[$scope.data.local.year];
            var keys = ['-01', '-02', '-03', '-04', '-05', '-06', '-07', '-08', '-09', '-10', '-11', '-12'];
            var series = {
                name: year + '年',
                type: 'bar',
                data: []
            };
            for (var i = 0, len = keys.length; i < len; i++) {
                series.data.push(list[year + keys[i]] || 0);
            }
            return series;
        }

        function drawBar(a, b, c) {
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
                            if ($scope.data.local.group == 1) {
                                result.push(param[i].seriesName + a + "：" + param[i].data);
                            } else if ($scope.data.local.group == 2) {
                                result.push(param[i].seriesName + a + "：￥" + param[i].data.toFixed(2));
                            } else {
                                result.push(param[i].seriesName + a + "：" + param[i].data + "%");
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
                    show: false
                },
                series: [{
                    name: name,
                    type: 'pie',
                    radius: ['0%', '60%'],
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
            var years = [2017, 2016, 2015];
            for (var i = 0, len = years.length; i < len; i++) {
                for (var j = 1; j <= 12; j++) {
                    result[years[i] + '-' + (j > 9 ? j : '0' + j)] = parseInt(Math.random() * 30);
                }
            }
            return result;
        }





        /*

                $scope.nowDate = dt.Format('yyyy-MM-dd');
                // 下拉菜单
                
                $scope.optionType3 = [
                    { id: 2018, name: '2018年' },
                    { id: 2017, name: '2017年' },
                    { id: 2016, name: '2016年' }
                ];
                $scope.typeModel3 = $scope.optionType3[0];
                $scope.typeList3 = false;

                $scope.option = function(key, item) {
                    $scope.menuHide();
                    $scope[key] = item;
                    $scope.chartScopeChange();
                }
                $scope.listShow = function(key) {
                    if ($rootScope.fixWrapShow) {
                        $scope.menuHide();
                    } else {
                        $scope[key] = true;
                        $rootScope.fixWrapShow = true;
                    }
                }

                $scope.menuHide = function() {
                    $rootScope.fixWrapShow = false;
                    $scope.typeList3 = false;
                }
                // 绘制bar
                $scope.assetsType = 1;
                $scope.changeAssetsType = function(val) {
                    $scope.assetsType = val;
                    $scope.chartScopeChange();
                };
                $scope.chartScopeChange = function() {
                    // 年度-资产类型(总数/总额)-时间维度（季度/年度）
                    var data = {
                            '2018-1': [17906.42, 18568.76, 20114.22, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            '2017-1': [15634.71, 15803.2, 16360.96, 16209.9, 16936.15, 16273.81, 16349.34, 16936.15, 17360.28, 17499.72, 17906.42, 17906.42],
                            '2016-1': [14629.58, 14385.56, 14437.85, 14600.53, 15024.66, 14722.54, 15030.47, 15106, 15175.72, 15431.36, 15605.66, 15634.71],
                            '2018-2': [17906.42, 18568.76, 20114.22, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            '2017-2': [15634.71, 15803.2, 16360.96, 16209.9, 16936.15, 16273.81, 16349.34, 16936.15, 17360.28, 17499.72, 17906.42, 17906.42],
                            '2016-2': [14629.58, 14385.56, 14437.85, 14600.53, 15024.66, 14722.54, 15030.47, 15106, 15175.72, 15431.36, 15605.66, 15634.71],
                            '2018-3': [17906.42, 18568.76, 20114.22, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            '2017-3': [15634.71, 15803.2, 16360.96, 16209.9, 16936.15, 16273.81, 16349.34, 16936.15, 17360.28, 17499.72, 17906.42, 17906.42],
                            '2016-3': [14629.58, 14385.56, 14437.85, 14600.53, 15024.66, 14722.54, 15030.47, 15106, 15175.72, 15431.36, 15605.66, 15634.71]
                        },
                        catalog = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                        assetsName = {
                            '1': '完修总数',
                            '2': '完修费用',
                            '3': '7天完修率'
                        };
                    $scope.echartsInit(assetsName[$scope.assetsType], catalog, data[$scope.typeModel3.id + '-' + $scope.assetsType], $scope.assetsType == 2);
                }

                // echart
                $scope.echartsInit = function(a, b, c, d) {
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
                        // backgroundColor: '#fff',
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
                                    result.push(param[i].seriesName + a + ":" + (d ? '￥' : '') + param[i].data);
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
                        series: [{name: a, type: 'bar', data: c }]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                }
                // 绘制pie
                $scope.drawPie = function(id, name, catalog, data) {
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
                            show: false
                        },
                        series: [{
                            name: name,
                            type: 'pie',
                            radius: ['0%', '60%'],
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

                var catalog1 = ['待接单', '维修中', '待验收', '已完成'],
                    data1 = [
                        { value: 0, name: '待接单' },
                        { value: 5, name: '维修中' },
                        { value: 1, name: '待验收' },
                        { value: 25, name: '已完成' }
                    ];

                $scope.drawPie('fy_pie', '维修状态分布', catalog1, data1);
                $scope.chartScopeChange();*/
    }]);