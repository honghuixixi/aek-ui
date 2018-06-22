angular.module('app')
    .controller('pmDashbordController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'pmDbService', 'pmUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, pmDbService, pmUtilService) {
        $scope.$parent.checkLimit('dashbord', function() {
            var dt = new Date();
            dt.setDate(dt.getDate() - 1);
            $rootScope.fixWrapShow = false;
            $scope.data = {
                server: {
                    pmImplementTotalYear: 0, // 年度PM执行总数
                    pmPlanTotalYear: 0, // 年度PM计划总数
                    pmRateYear: 100, // 年度PM执行率
                    chart: {} // 图表数据，格式：{'年份-月份': 统计值} 如： {'2018-01': 1, '2018-02': 5}
                },
                local: {
                    endDate: dt.Format("yyyy-MM-dd"),
                    height: document.body.clientHeight,
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
                changeType: function(type) {
                    $scope.data.local.type = type;
                    $scope.methods.drawChart();
                },
                drawChart: function() {
                    var catalog = {
                        '1': ['第一季度', '第二季度', '第三季度', '第四季度'],
                        '2': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                    };
                    drawBar('PM执行设备总数', catalog[$scope.data.local.type], fillData())
                },
                getData: function() {
                    $.ajax({
                        type: 'GET',
                        url: '/data/qcPmData/getPmData',
                        data: {},
                        contentType: "application/json",
                        complete: function(res) {
                            if (+res.responseJSON.code === 200) {
                                $scope.data.server = res.responseJSON.data;
                                $scope.data.server.chart = $scope.data.server.chart || {};
                                $scope.methods.drawChart();
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

            function getSeries(dis) {
                var year = $scope.data.local.yearOption[$scope.data.local.year] - dis;
                var keys = ['-01', '-02', '-03', '-04', '-05', '-06', '-07', '-08', '-09', '-10', '-11', '-12'];
                var series = {
                    name: year + '年',
                    type: 'bar',
                    data: []
                };
                for (var i = 0, len = keys.length; i < len; i++) {
                    series.data.push($scope.data.server.chart[year + keys[i]] || 0);
                }
                if($scope.data.local.type == 1){
                    var data = [0, 0, 0, 0];
                    for(var i=0,len=keys.length; i<len; i++){
                        data[parseInt(i / 3)] += series.data[i];
                    }
                    series.data = data;
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
                                result.push(param[i].seriesName + a + "：" + param[i].data);
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
        })
    }]);