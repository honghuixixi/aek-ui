'use strict';

angular.module('app')
    .controller('bsglListController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', 'browseService',
        function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage, browseService) {
            $scope.data = {
            	loading: true,
            	empty: false,
                list: []
            };
            // 筛选
            $scope.searchOne='全部类型';
            $scope.searchOnel=[{
                statusName: '全部类型',
                status: 0,
            },{
                statusName: '在用报损',
                status: 1,
            },{
                statusName: '在库报损',
                status: 2,
            },{
                statusName: '附件报损',
                status: 3,
            }];
            $scope.searchTwo='全部状态';
            $scope.searchTwol=[{
                statusName: '全部状态',
                status: 0,
            },{
                statusName: '待审核',
                status: 1,
            },{
                statusName: '审核通过',
                status: 2,
            },{
                statusName: '审核未通过',
                status: 3,
            }];
            $scope.searchTwoV=0;
            if($stateParams.status){
                $scope.searchTwoV=$scope.searchTwol[$stateParams.status].status;
                $scope.searchTwo=$scope.searchTwol[$stateParams.status].statusName;
            }
            $scope.searchFour='全部';
            $scope.searchFourl=[{
                statusName: '全部',
                status: 1,
            },{
                statusName: '我的申请',
                status: 2,
            }];
            // 获得焦点显示
            $scope.searchThree = '选择部门';
            $scope.devshow1 = false;
            $scope.focus1 = function() {
                if($scope.devshow) {
                    return $scope.hideAll();
                }
                $scope.devshow = true;
                $scope.devshow1 = true;
            }
            $scope.devshow2 = false;
            $scope.focus2 = function() {
                if($scope.devshow) {
                    return $scope.hideAll();
                }
                $scope.devshow = true;
                $scope.devshow2 = true;
            }
            $scope.devshow3 = false;
            $scope.focus3 = function() {
                if($scope.devshow) {
                    return $scope.hideAll();
                }
                $scope.deptSearch = '';
                $scope.deptId = '';
                $scope.searchResult = [];
                $scope.devshow = true;
                $scope.devshow3 = true;
            }
            $scope.devshow4 = false;
            $scope.focus4 = function() {
                if($scope.devshow) {
                    return $scope.hideAll();
                }
                $scope.devshow = true;
                $scope.devshow4 = true;
            }
            // 点击子菜单
            $scope.click1 = function($event) {
                $scope.devshow1 = false;
                $scope.devshow = false;
                $scope.searchOne = $($event.target).text();
                $scope.searchOneV = $($event.target).attr('data-para');
                $scope.getList(1,16);
            }
            $scope.click2 = function($event) {
                $scope.devshow2 = false;
                $scope.devshow = false;
                $scope.searchTwo = $($event.target).text();
                $scope.searchTwoV = $($event.target).attr('data-para');
                $scope.getList(1,16);
            }
            $scope.click3 = function($event) {
                $scope.devshow3 = false;
                $scope.devshow = false;
                $scope.searchThree = $($event.target).text();
                $scope.searchThreeV = $($event.target).attr('data-para');
                $scope.getList(1,16);
            }
            $scope.click4 = function($event) {
                $scope.devshow4 = false;
                $scope.devshow = false;
                $scope.searchFour = $($event.target).text();
                $scope.searchFourV = $($event.target).attr('data-para');
                $scope.getList(1,16);
            }
            $scope.hideAll = function() {
                $scope.devshow = false;
                $scope.devshow1 = false;
                $scope.devshow2 = false;
                $scope.devshow3 = false;
                $scope.devshow4 = false;
            }
            //查询机构下的部门
            $scope.getDeptList = function(key) {
                $.ajax({
                    type: "get",
                    url: "/sys/dept/search/tenant/" + ($scope.userInfo?$localStorage.userInfo.tenantId:1),
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {
                            $scope.searchThreel = [{id: 0, name: '选择部门'}].concat(res.responseJSON.data);
                            $scope.$apply();
                        }
                    }
                });
            }
            
            // 分页数据
            $scope.pageInfo = {
                pages: 0,
                total: 0,
                size: 16,
                current: 1,
                pstyle: 2
            };

             // 分页事件
            $scope.pagination = function(page, pageSize) {
                $scope.pageInfo.size = pageSize;
                $scope.pageInfo.current=page;
                $scope.getList(page, pageSize);
            }

            // 列表查询
            $scope.getList = function (pageNo, pageSize) {
            	var param = {
                    "keyword": $scope.searchCon,
                    "type": $scope.searchOneV,
                    "status": $scope.searchTwoV, //状态
                    "scope": $scope.searchFourV,
                    "pageNo": pageNo || $scope.pageInfo.current, //当前页
                    "pageSize": pageSize ||$scope.pageInfo.size, //每页数目
                    "keyword": $scope.searchCon || '' //关键字
                };
                if(+$scope.searchThreeV > 0){
                    param.deptId = $scope.searchThreeV;
                }
            	$scope.data.loading = true;
            	$scope.data.empty = false;
            	$scope.data.list = [];
            	browseService.getBslist(param, function (data) {
            		$scope.data.loading = false;
            		$scope.data.empty = data.records.length < 1;
            		$scope.data.list = browseService.convertBrowseList(data.records, false);
            		$scope.pageInfo.total = data.total;
            		$scope.pageInfo.current = pageNo;
            		$scope.$apply();
            	});
            };


            // 初始化
            $scope.getDeptList();
            $scope.getList($scope.pageInfo.current, $scope.pageInfo.size);       
        }
    ]);