'use strict';

angular.module('app')
	.controller('jsqxController', [ '$rootScope', '$scope', '$http', '$state','$localStorage',
		function($rootScope, $scope, $http, $state,$localStorage) {
			$rootScope.userOr = false;
            $scope.trData = [];

            $scope.loading = true;
            $scope.addrole = false;

            //角色
            //数据范围
            $scope.dRan = 1;
            $scope.roleName = '';
            $scope.dataRange=[
                {name:"所在机构及以下数据",id:1},
                {name:"所在机构数据",id:2},
                {name:"所在部门及以下数据",id:3},
                {name:"所在部门数据",id:4},
                {name:"仅本人数据",id:5}
                // {name:"按明细设置",id:6}
            ];

            $scope.addrole = false;

            //搜索
            $scope.keywords = '';

            //列表参数
            $scope.param = {'orgId':$localStorage.user.orgId,'roleId':$scope.roleId};


            //添加或编辑角色事件
            $scope.addRole = function (type) {
            	$scope.addrole = true;

            	var node = $.fn.zTree.getZTreeObj("treeDemo").getSelectedNodes()[0];
                var roleId = node.id;
                var url = '',
                    data = null;
                if(type == 'edit' && node.children){
                    alert('请选择最末级节点！');
                }

                if(type == 'edit'){
                    url = '/sys/role/query';
                    data = {'orgId':$localStorage.user.orgId,'roleId':roleId,'platform':1};
                }else{
                    url = '/sys/services/query';
                    data = {'orgId':$localStorage.user.orgId,'platform':1};
                }

                $.ajax({
                    type:'get',
                    data:data,
                    url:url
                }).then(function (res) {
                    $scope.roleName = res.result.name;
                    $scope.dRan = res.result.dataScope;
                    type == 'edit' ? res = res.result.services : res = res.result;
                    for(var i =0 ;i<res.length;i++){
                        res[i].pId = res[i].parentId;
                        res[i].checked = res[i].dataVisible;
                    }
                    var setting2 = {
                        check: {
                            enable: true
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        }
                    };
                    $.fn.zTree.init($("#tree2"), setting2, res);

                    $rootScope.$apply();
                });

            	var index=layer.open({
                        time: 0 //不自动关闭
                        ,type: 1
                        ,content: $('#addRole')
                        ,title: false
                        // ,title: ['提示','font-size: 14px;color: #fff;background-color: #555a69;line-height: 40px;padding: 0px 10px;border-left: 2px solid #f7931e;textAlign: left;']
                        ,closeBtn: 1
                        ,shade: 0.3
                        ,shadeClose: true
                        ,btn: ['确定', '取消']
                        ,yes: function(index){
                            var nodes = $.fn.zTree.getZTreeObj("tree2").getCheckedNodes();
                            var nodeIds = [];

                            for(var i=0;i<nodes.length;i++){
                                nodeIds.push(nodes[i].id);
                            }

                            var data = {
                                createBy:$localStorage.user.id,
                                dataScope:$scope.dRan,
                                // id:roleId,
                                name:$scope.roleName,
                                orgId:$localStorage.user.orgId,
                                servicesIds:nodeIds
                                // updatBy:$localStorage.user.id
                            }

                            if(type == 'edit'){
                                delete data.createBy;
                                data.id = roleId;
                                data.updateBy = $localStorage.user.id;
                            }

                            $.ajax({
                                type:type == 'add' ? 'post' : 'put',
                                data:JSON.stringify(data),
                                contentType : "application/json",
                                url:type == 'add' ? '/sys/role/add' : '/sys/role/update'
                            }).then(function (res) {
                                if(res.description == 'OK'){
                                    alert('保存成功!');
                                    layer.close(index);
                                    zTreeGet();
                                }
                            })


                        }
                        ,area: ['1045px','714px']
                        ,btnAlign: 'c'
                    });
                    layer.style(index, {
                        backgroundColor: '#fff',
                        borderRadius: '8px'
                    });
            }


            var curMenu = null, zTree_Menu = null;
            var setting = {
                view: {
                    showLine: false,
                    showIcon: false,
                    selectedMulti: false,
                    dblClickExpand: false,
                    addDiyDom: addDiyDom
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeClick: beforeClick
                }
            };
            function zTreeGet() {
                var zNodes =[
                    { id:10000, pId:0, name:"角色", open:true},
                    { id:10001, pId:10000, name:"默认"},
                    { id:10002, pId:10000, name:"自定义"}
                ];

                $.ajax({
                    url : '/sys/role/query/roleList',
                    data:  {'orgId':$localStorage.user.orgId},
                    type: 'get',
                    complete: function(result) {
                    $scope.loading = false;
                    //默认及自定义节点
                    var tpl = result.responseJSON.result.templetRoles,
                        custom = result.responseJSON.result.customRoles;
                    for(var i=0;i<tpl.length;i++){
                        var node = {};
                        node.id = tpl[i].id;
                        node.pId = 10001;
                        node.name = tpl[i].name;
                        zNodes.push(node);
                    }

                    for(var j=0;j<custom.length;j++){
                        var node = {};
                        node.id = custom[j].id;
                        node.pId = 10002;
                        node.name = custom[j].name;
                        zNodes.push(node);
                    }
                    var treeObj = $("#treeDemo");
                    $.fn.zTree.init(treeObj, setting, zNodes);

                    zTree_Menu = $.fn.zTree.getZTreeObj("treeDemo");
                    curMenu = zTree_Menu.getNodes()[0].children[0].children[0];//默认展开默认节点第一个子节点
                    zTree_Menu.selectNode(curMenu);

                    $scope.param.roleId = curMenu.id;
                    $scope.param['page.current']=1;
                    $scope.param['page.size']=1;
                    $scope.search();

                    }
                });
                
            }

            function addDiyDom(treeId, treeNode) {
                var spaceWidth = 5;
                var switchObj = $("#" + treeNode.tId + "_switch"),
                    icoObj = $("#" + treeNode.tId + "_ico");
                switchObj.remove();
                icoObj.before(switchObj);

                if (treeNode.level >= 1) {
                    var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
                    switchObj.before(spaceStr);
                }
            }

            //树节点点击事件
            function beforeClick(treeId, treeNode) {
                //如果为一、二级节点，则只是展开，无法被选中
                if (treeNode.level == 0 || treeNode.level == 1) {
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    zTree.expandNode(treeNode);
                    return false;
                }

                //如果是根节点，无子节点，则请求形成列表
                if(!treeNode.children){
                    $scope.param.roleId = treeNode.id;
                    $scope.param['page.current']=1;
                    $scope.param['page.size']=1;
                    $scope.keywords = '';
                    $scope.search();
                }


                return true;
            }

            //搜素
            $scope.search = function () {
                $scope.param.keyword = $scope.keywords;//搜索关键字
                $scope.loading = true;//loading图
                $scope.trData = [];
                $.ajax({
                    url:'/sys/user/query/role',
                    data:$scope.param,
                    type:'get',
                    success:function(res) {
                    $scope.loading = false;
                    $scope.trData = res.responseJSON.result.records;//列表数据
                    $scope.pageInfo = res.responseJSON.result;//分页形成依赖数据
                    $rootScope.$apply();
                    }
                });
            }

            // 翻页
            $scope.pagination = function (page,pageSize) {
                $scope.param['page.current']=page;//当前页
                $scope.param['page.size']=pageSize;//每页条数
                $scope.search();
            };

            $(document).ready(function(){
                //初始化构建角色树
                zTreeGet();
            });

	} ]);