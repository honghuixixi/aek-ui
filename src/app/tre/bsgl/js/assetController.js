'use strict';

angular.module('app')
    .controller('BSGLassetController', ['$scope','$stateParams', '$rootScope', '$state', '$timeout', '$localStorage',
        function($scope,$stateParams,$rootScope, $state, $timeout, $localStorage) {
            
            $scope.checkAll=false;
            $scope.pageInfo={
                current: 1,
                size: 16,
                pstyle: 2,
                total: 10
            };
            /*全选*/
            $scope.checkAll = function($event) {
                $scope.all = !$scope.all;
                angular.element('.child-checkbox').prop("checked", $scope.all);
                var currentLength = angular.element('.child-checkbox:checked').length;
                if(!currentLength) {
                    angular.element('.select-wrap input').attr('disabled', 'disabled')
                } else {
                    angular.element('.select-wrap input').removeAttr('disabled')
                }
            }
            // 复选框部分
            $scope.checked = function($event, tr) {

                //复选框的总个数
                var maxLength = angular.element('.child-checkbox').length;
                //当前选中的个数
                var currentLength = angular.element('.child-checkbox:checked').length;
                //当前点击的是否是选中

                if(!currentLength) {
                    angular.element('.select-wrap input').attr('disabled', 'disabled')
                } else {
                    angular.element('.select-wrap input').removeAttr('disabled');
                }
                if(currentLength < maxLength) {
                    $scope.all = false;
                } else {
                    $scope.all = true;
                }
            }
            // 获取列表
            $scope.getList=function(page,size){
                $scope.all=true;
                $scope.checkAll();
                $.ajax({
                    type: "get",
                    url: "/assets/assDiscard/search",
                    data: {
                        "status": $scope.searchOneV, //状态
                        "deptId": $scope.searchTwoV || '', //部门id
                        "pageNo": page||$scope.pageInfo.current, //当前页
                        "pageSize": size||$scope.pageInfo.size, //每页数目
                        "keyword": $scope.searchCon || '' //关键字
                    },
                    complete: function(res) {
                        if(res.responseJSON.code==200){
                            console.log($scope.all);
                            $scope.pageInfo.total = res.responseJSON.data.total;
                            $scope.assetslist = res.responseJSON.data.records;
                            $rootScope.$apply();
                        }
                    }

                })
            }

            $scope.pagination=function(page,size){
                $scope.pageInfo.current=page;
                $scope.pageInfo.size=size;
                $scope.getList();
            }
            $scope.searchOne='全部状态';
            $scope.searchOnel=[{
                statusName: '全部状态',
                status: 0,
            },{
                statusName: '在库',
                status: 1,
            },{
                statusName: '在用',
                status: 2,
            },{
                statusName: '预登',
                status: 3,
            }];
            $scope.searchThree='请选择';
            $scope.searchThreel=[{
                name: '在用报损',
                id: 1,
            },{
                name: '在库报损',
                id: 2,
            },{
                name: '附件报损',
                id: 3,
            }];
            $scope.searchTwoV=$localStorage.userInfo.deptId;
            $scope.searchTwo=$localStorage.userInfo.deptName;
            $scope.getList();
            // 获得焦点显示
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
            
            // 全部隐藏
            $scope.devshow = false;
            $scope.hideAll = function() {
                $scope.devshow = false;
                $scope.devshow1 = false;
                $scope.devshow2 = false;
                $scope.devshow3 = false;
                $scope.devshow4 = false;
                $scope.devshow5 = false;
                $scope.batchSetStateListShow = false;
                $scope.batchSetDeptWrapShow = false;
            }

            //查询机构下的部门
            $scope.getDeptList = function(key) {
                $.ajax({
                    type: "get",
                    url: "/sys/dept/search/tenant/" + ($scope.userInfo?$localStorage.userInfo.tenantId:1),
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {
                            $scope.searchTwol = res.responseJSON.data;
                            $rootScope.$apply();
                        }
                    }
                });
            }
            $scope.getDeptList();

            $scope.apply={
                director: '',
                illustration: ''
            };
            $scope.dataForm=function(){
                $scope.printData = [];
                var trs = angular.element('.child-checkbox:checked');
                for(var i = 0; i < trs.length; i++) {
                    $scope.printData.push(trs.eq(i).attr('data-json'));
                };
                if(!$scope.printData.length){
                    var msg = layer.msg('<div class="toaster"><i></i><span>请选择报损设备</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                    return;
                }
                $scope.searchThree='请选择';
                $scope.batchSetStateListShow=false;
                $scope.billData={
                    ids: $scope.printData,
                    illustration: '',
                    type: ''
                };
                $scope.deptErr=false;
                var index = layer.open({
                    time: 0, //不自动关闭
                    type: 1,
                    id: 'alertBatchSetDeptLayer',
                    content: $('.adjustWrap'),
                    title: ['报损', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    closeBtn: 1,
                    shade: 0.3,
                    btn: ['确定','取消'],
                    yes: function(){
                        if(!$scope.billData.type){
                            $scope.deptErr=true;
                            return $scope.$apply();
                        }
                        $scope.subApply();
                    },
                    shadeClose: true,
                    area: ['628px', '320px']
                });
            }
            $scope.batchSelectInputClick = function(n) {
                $scope.batchSetDeptWrapShow = true;
                $scope[n] = true;
            }
            $scope.batchSelectLiClick = function(n, m, item) {
                $scope.searchResult = [];
                $scope.batchSelectSearchWord = '';
                $scope[m] = false;
                $scope[n] = item.name;
                $scope.deptErr = false;
                $scope.billData.type = item.id;
                $scope.batchSetDeptWrapShow = false;
            }
            // submit 
            $scope.subApply=function(a){
                layer.closeAll();
                $.ajax({
                    type: 'post',
                    url: '/assets/assDiscard/add',
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify($scope.billData),
                    complete: function(res) {
                        if(res.responseJSON.code == 200) {
                            $state.go('main.tre.bsgl.browse', null, {
                                // msg: '',
                                reload: true
                            });
                        } else {
                            var msg = layer.msg('<div class="toaster"><i></i><span>'+res.responseJSON.msg+'</span></div>', {
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
        }]);