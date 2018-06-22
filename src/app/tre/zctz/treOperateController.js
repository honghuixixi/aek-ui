'use strict';

angular.module('app')
    .controller('treoperateController', ['$scope', '$rootScope', '$state', '$timeout', '$localStorage', '$stateParams','pmUtilService', 'FileUploader',
        function($scope, $rootScope, $state, $timeout, $localStorage, $stateParams, pmUtilService,FileUploader) {
            $rootScope.currentmodule='资产台账';
            //底部高度设置，使其占满剩余全部
            $scope.resetBottomHeight = function () {
                var clientHeight = angular.element('.app-content-body').height();
                angular.element('.panel-default').css('min-height',clientHeight-70-angular.element('.ytz-con').height());
            }
            $scope.resetBottomHeight();
            $rootScope.membernav=false;
            $scope.searchOne={id:0,txt:'全部'};
            $scope.searchOnel=[{id:0,txt:'全部'},{id:1,txt:'设备信息'}];
            $scope.manageTypeid=0;
            $scope.alertShow = false;
            $scope.list =  []
            $scope.operateDetail ={}
            // 表格请求
            $scope.table = function (page,pageSize) {
                    var startDate = $scope.startTime ? new Date($scope.startTime).Format("yyyy-MM-dd") + " 00:00:00" : ''
                    var endDate = $scope.endTime ? new Date($scope.endTime).Format("yyyy-MM-dd") + " 23:59:59" : ''
                    var data = {
                        id:$stateParams.assetId,
                        'page.current':page,
                        'page.size':pageSize,
                        modelType: $scope.manageTypeid,
                    }
                    if($scope.startTime){
                        data.startTime = startDate
                    }
                    if($scope.endTime){
                        data.endTime = endDate
                    }
                $.ajax({
                    type: 'get',
                    url: '/assets/assAssetsLog/getLogPage',
                    contentType: "application/json;charset=UTF-8",
                    data:data,
                    complete: function(xhr){
                        if(xhr.responseJSON.code==200) {
                            $scope.list = xhr.responseJSON.data.records
                            $scope.pageInfo = xhr.responseJSON.data;
                            $scope.allInfo = $scope.pageInfo.total;
                            $scope.pageInfo.pstyle = 2;
                            $rootScope.$apply();
                        }
                    }
                });
            }
            /*获取详情*/
            $.ajax({
                type: 'get',
                url: '/assets/assetsInfo/getAssetsDetail',
                data: {id:$stateParams.assetId},
                complete: function(xhr){
                    setStartDatepicker(null, null);
                    setEndDatepicker(null, null);
                    if(xhr.responseJSON.code==200){
                        $scope.res = xhr.responseJSON.data;
                        $scope.assetsName = $scope.res.assetsName;
                        $scope.factoryName = $scope.res.factoryName;
                    }else{
                        $scope.res={};
                    }
                    $('#detailUploadImg').on('change',function(){$scope.assetimginputchange()});
                    $rootScope.$apply();
                }
            });
            // 点击子菜单
            $scope.click1 = function(a) {
                $scope.devshow1 = false;
                $scope.devshow = false;
                $scope.searchOne = a;
                $scope.manageTypeid = a.id
                $scope.table(1,$scope.pageSize)
            }
//             获得焦点显示
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
            // 方法
            function setStartDatepicker(min, max) {
                pmUtilService.setDatepicker('#startDt', null, null, min, max, function(b) {
                    $scope.startTime = new Date(b.startDate).getTime();
                    setEndDatepicker(new Date(b.startDate), new Date("2050-01-01"));
                });
            }

            function setEndDatepicker(min, max) {
                pmUtilService.setDatepicker('#endDt', null, null, min, max, function(b) {
                    $scope.endTime = new Date(b.startDate).getTime();
                    setStartDatepicker(null, new Date(b.startDate));
                });
            }
          // 点击搜索
            $scope.search = function(){
                $scope.table(1,$scope.pageSize)
            }
            // 首次调用
             $scope.table(1,16)

            // 分页加载
            $scope.pagination = function (page,pageSize) {
                $scope.pageNo = page;
                $scope.pageSize = pageSize;
                $scope.table($scope.pageNo,$scope.pageSize)
            };

            // 弹窗
            $scope.lookOperate = function (id) {
                // 操作记录详情接口
                $.ajax({
                    type: 'get',
                    url: '/assets/assAssetsLog/getLogDetail',
                    data: {
                        id:id
                    },
                    complete: function(xhr){
                        if(xhr.responseJSON.code==200) {
                            $scope.operateDetail = xhr.responseJSON.data
                            layer.open({
                                type: 1,
                                title: ['查看操作记录','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                                content: $('#alert'),
                                area: ['550px', '500px'],
                                btn: [ '关闭'],
                                end: function() {
                                    layer.close();
                                }
                            });
                            $scope.$apply();
                         }
                    }
                })
            }
        }]);