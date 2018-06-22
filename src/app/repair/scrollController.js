'use strict';
angular.module('app').filter('hs', function () {
    return function (val) {
        var dt = new Date(val),
            now = new Date(),
            dis = now.getTime() - dt.getTime();
        // console.log(dt.toLocaleString() + "||" + now.toLocaleString());
        dis = dis / (1000 * 60 * 60);
        if (dis > 24) {
            return (parseInt(dis / 24)) + "天" + ((dis % 24).toFixed(2)) + "小时";
        } else {
            return dis.toFixed(2) + "小时";
        }
    };
});
angular.module('app')
    .controller('scrollDashbordController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function ($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
        $rootScope.currentmodule = "维修管理";
        $scope.data = {
            server: {
                "waitTakeNum": 0, // 待接单
                "repairingNum": 0, // 维修中
                "waitCheckNum": 0, // 待验收
                "engineerNum": 0, // 工程师
                "currentWeekApplyNum": 0, // 本周保修
                "currentWeekCompleteNum": 0, // 本周完修
                "currentMonthApplyNum": 0, // 本月保修
                "currentMonthCompleteNum": 0, // 本月完修
                "repairApplyList": [] //格式 {"reportRepairDate": 1517557956000, "assetsDeptName": "爱医康", "assetsNum": "H00000120171117115777", "assetsName": "设备名称", "statusText": "待接单", "takeOrderName": "用户一号"}
            },
            local: {
                height: document.body.clientHeight,
                week: [' 周日', ' 星期一', ' 星期二', ' 星期三', ' 星期四', ' 星期五', ' 周六', ' 周日'],
                time: '',
                timeInterval: null,
                page: {
                    index: 0,
                    pageRowCount: 12,
                    list: [],
                    page: 0,
                    pageInterval: null,
                    intervalTime: 20000,
                    start: false,
                    startIndex: 0,
                    endIndex: 0
                },
                connectInterval: null
            }
        };

        $scope.methods = {
            getData: function () {
                $.ajax({
                    type: 'GET',
                    url: '/newrepair/data/getRepairLargeScreenData',
                    data: { tenantId: $stateParams.tenantId || $localStorage.userInfo.tenantId },
                    contentType: "application/json",
                    complete: function (res) {
                        if (+res.responseJSON.code === 200) {
                            if (res.responseJSON.data) {
                                $scope.data.server = res.responseJSON.data;
                                var len = $scope.data.server.repairApplyList.length;
                                $scope.data.local.page.index = 0;
                                $scope.data.local.page.list = [];
                                $scope.data.local.page.page = len > 0 ? parseInt((len - 1) / $scope.data.local.page.pageRowCount + 1, 10) : 0;
                                // console.log($scope.data.local);
                            }
                            $scope.methods.copyData();
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
            copyData: function () {
                if ($scope.data.local.page.index < $scope.data.local.page.page) {
                    var start = $scope.data.local.page.index * $scope.data.local.page.pageRowCount;
                    $scope.data.local.page.list = [];
                    $scope.data.local.page.startIndex = start + 1;
                    for (var i = 0; i < $scope.data.local.page.pageRowCount; i++) {
                        if ((start + i) < $scope.data.server.repairApplyList.length) {
                            $scope.data.local.page.list.push($scope.data.server.repairApplyList[start + i]);
                            $scope.data.local.page.endIndex = start + i + 1;
                        }
                    }
                    $scope.$apply();
                } else {
                    if ($scope.data.local.page.pageInterval) {
                        window.clearInterval($scope.data.local.page.pageInterval);
                    }
                    $scope.data.local.page.start = false;
                    if ($scope.data.local.page.page > 0) {
                        $scope.methods.getData();
                    } else {
                        $scope.data.local.page.start = true;
                        setTimeout(function () {
                            $scope.methods.getData();
                        }, 60000);
                    }

                }
                $scope.data.local.page.index++;
                if (!$scope.data.local.page.start) {
                    $scope.data.local.page.start = true;
                    $scope.data.local.page.pageInterval = setInterval($scope.methods.copyData, $scope.data.local.page.intervalTime);
                }
            },
            init: function () {
                $scope.data.local.page.pageRowCount = parseInt(($scope.data.local.height - 450) / 35, 10);
                $scope.methods.getData();
                $scope.data.local.timeInterval = setInterval(function () {
                    var dt = new Date();
                    $scope.data.local.time = dt.Format("yyyy-MM-dd hh:mm:ss") + $scope.data.local.week[dt.getDay()];
                    $scope.$apply();
                }, 1000);
            }
        };

        $scope.methods.init();

        $scope.$on('$destroy', function () {
            if ($scope.data.local.timeInterval) {
                window.clearInterval($scope.data.local.timeInterval);
            }
            if ($scope.data.local.page.pageInterval) {
                window.clearInterval($scope.data.local.page.pageInterval);
            }
            if ($scope.data.local.connectInterval) {
                window.clearInterval($scope.data.local.connectInterval);
            }
        });




        function generateData() {
            var result = [];
            var status = ["待接单", "维修中", "待验收", "待验收"];
            for (var i = 0; i < 1000; i++) {
                result.push({
                    "reportRepairDate": 1517557956000,
                    "assetsDeptName": "爱医康" + (i + 1),
                    "assetsNum": "H00000120171117115777",
                    "assetsName": "设备名称",
                    "statusText": status[parseInt(Math.random() * 3)],
                    "takeOrderName": "用户一号"
                });
            }
            return result;
        }
    }]);