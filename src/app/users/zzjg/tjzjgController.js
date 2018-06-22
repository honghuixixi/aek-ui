'use strict';

angular.module('app')
	.controller('tjzjgController', [ '$rootScope', '$scope', '$http', '$state', '$localStorage',
		function($rootScope, $scope, $http, $state, $localStorage) {
			$rootScope.userOr = false;
            $scope.aLotOf = true;
            $scope.alertRecover = false;
            $scope.alertEdit = false;
            $scope.charger = false;
            $scope.hadCharger = true;
            $scope.selectParent = false;
            $scope.selectParentSave = false;
            $scope.searchRes = false;
            $scope.searchResSave = false;
            $scope.searchWord = '';
            $scope.searchWordSave = '';
            $scope.resLis = [];
            $scope.resLisSave = [];
			
            $scope.dept = {
                createBy: $localStorage.user.id,//创建人ID 
                level: 0,//组织内排序 
                masterId: 1,//负责人ID 
                masterName: '',//负责人姓名 
                name: '',//名称 
                orgId: 1,//所在机构ID 
                parentId: $localStorage.user.curDeptId,//父级编号 
                parentName: '',
                type: 1,//类型 
                typeName: '科室'
            };
            $scope.deptSave = {
                updateBy: $localStorage.user.id,//创建人ID 
                level: 0,//组织内排序 
                masterId: 1,//负责人ID 
                masterName: '',//负责人姓名 
                id: $localStorage.user.curDeptId,
                name: '',//名称 
                orgId: 1,//所在机构ID 
                parentId: 0,//父级编号 
                parentName: '',
                type: 1,//类型 
                typeName: '科室'
            };
            $scope.addLiName = function (li) {
                $scope.dept.parentName = li.name;
                $scope.dept.parentId = li.id;
                $scope.selectParent = false;
            }
            $scope.addLiNameSave = function (li) {
                $scope.deptSave.parentName = li.name;
                $scope.deptSave.parentId = li.id;
                $scope.selectParentSave = false;
            }
            // angular.element(document).on('click',function ($event) {
            //     var target = angular.element($event.target)
            //     // console.log(angular.element($event.target).attr('data-id'));
            //     console.log(target);
            //     console.log((!(target.hasClass('selectCon')||target.parent().hasClass('selectCon')||target.parent().parent().hasClass('selectCon'))));
            //     if(!(target.hasClass('selectCon')||target.parent().hasClass('selectCon')||target.parent().parent().hasClass('selectCon'))) {
            //         $scope.selectParentSave = false;
            //         $scope.selectParent = false;
            //     }
            // });
            $scope.search = function () {
                if(!$scope.searchWord){return $scope.searchRes = false;}
                $.ajax({
                    url : '/sys/office/queryList/1/keyword/'+$scope.searchWord,
                    data:  {},
                    type: 'get'
                }).then(function(result) {
                    if(result.result.length==0) return;
                    $scope.resLis = result.result;
                    $scope.searchRes = true;
                    $rootScope.$apply();
                });
            }
            $scope.searchSave = function () {
                if(!$scope.searchWordSave){return $scope.searchResSave = false;}
                $scope.searchResSave = true;
                $.ajax({
                    url : '/sys/office/queryList/1/keyword/'+$scope.searchWordSave,
                    data:  {},
                    type: 'get'
                }).then(function(result) {
                    $scope.resLisSave = result.result;
                    $rootScope.$apply();
                });
            }
            $scope.setCharge = function (index) {
                for (var i = $scope.trData.length - 1; i >= 0; i--) {
                    $scope.trData[i].charge = '';
                };
                $scope.trData[index].charge = '默认负责人';
            }
            $scope.charge = function () {
                $scope.charger = true;
                var index=layer.open({
                        time: 0 //不自动关闭
                        ,type: 1
                        ,content: $('#Ccharger')
                        ,title: false
                        // ,title: ['提示','font-size: 14px;color: #fff;background-color: #555a69;line-height: 40px;padding: 0px 10px;border-left: 2px solid #f7931e;textAlign: left;']
                        ,closeBtn: 1
                        ,shade: 0.3
                        ,shadeClose: true
                        ,btn: ['确定', '取消']
                        ,yes: function(index){
                            layer.close(index);
                        }
                        ,area: ['1045px','714px']
                        ,btnAlign: 'c'
                    });
                    layer.style(index, {
                        backgroundColor: '#fff',
                        borderRadius: '8px'
                    });
            }
            
            /*ztree begin */
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
            // var zNodes =[
            //     { id:1, pId:0, name:"浙江省人民医院(1024)", open:true},
            //     { id:11, pId:1, name:"浙江省人民医院钱江分院(369人)"},
            //     { id:111, pId:11, name:"皮肤科（300人）"},
            //     { id:112, pId:11, name:"内科（30人）"},
            //     { id:113, pId:11, name:"消化内科（60人）"},
            //     { id:114, pId:11, name:"骨科（20人）"},
            //     { id:12, pId:11, name:"外科（49人）"},
            //     { id:13, pId:11, name:"儿科（60人）"},
            //     { id:14, pId:11, name:"泌尿外科（60人）"},
            //     { id:15, pId:11, name:"神经外科（60人）"},
            //     { id:3, pId:11, name:"耳鼻咽喉科（50人）"},
            //     { id:31, pId:1, name:"浙江省人民医院义务分院(369)"},
            //     { id:32, pId:31, name:"儿科（30人）"},
            //     { id:32, pId:31, name:"妇产科（50人）"},
            //     { id:32, pId:31, name:"口腔科（40人）"}
            // ];
            var zNodes;
            /*删除*/
            // $.ajax({
            //         url : '/sys/office/delete/30',
            //         data:  {},
            //         type: 'delete'
            //     }).then(function(result) {
            // });

            zTreeGet();
            function zTreeGet() {
                $.ajax({
                    url : '/sys/office/queryList/1',
                    data:  {},
                    type: 'get',
                    complete: function(result) {
                    var res = result.responseJSON.result, node = [];
                    for (var i = 0; i < res.length; i++) {
                        node.push({});
                        node[i].id = res[i].id;
                        node[i].pId = res[i].parentId;
                        if(node[i].id==$localStorage.user.curDeptId){
                            $scope.dept.parentName = res[i].name;
                        }
                        node[i].name = res[i].name+'('+calc(res[i])+')';
                        if($localStorage.user.deptId==node[i].id){
                            var pId = node[i].pId;
                        }
                    };
                    open(pId);
                    function open(cur) {
                        for (var i = 0; i < node.length; i++) {
                            if(cur==node[i].id){
                                node[i].open=true;
                                if(node[i].pId!=0) {
                                    open(node[i].pId);
                                }
                                break;
                            }
                        };
                    }
                    zNodes = node;
                    // zNodes[0].open = true;

                    //递归处理数据成标准格式
                    // function recursiveData(data, pid) {
                    //   var result = [],
                    //     temp;
                    //   for(var l in data) {
                    //     if(data[l].pid == pid) {
                    //       result.push(data[l]);
                    //       temp = recursiveData(data, data[l].id);
                    //       if(temp.length > 0) {
                    //         data[l].children = temp;
                    //       }
                    //     }
                    //   }
                    //   return result;
                    // }

                    /*计算科室人数*/
                    function returnChildren(pid) {
                        var temp = [];

                        // var patt = new RegExp(pid,'ig');
                        var patt = /1/g;
                        for (var j = 0; j < res.length; j++) {
                            var pids = res[j].parentIds.split(',').join('');
                            var had = patt.test(pids);
                            var has = pids.search(pid);
                            if(has!=-1) {
                                temp.push(res[j]);
                            }
                        };
                        return temp;
                    }

                    function calc(dept) {
                        var children = returnChildren(dept.id);
                        if (children.length == 0) return res[i].deptUserCount;
                        for (var k = 0; k < children.length; k++) {
                            dept.deptUserCount+=children[k].deptUserCount;
                        };
                        return dept.deptUserCount;
                    }

                    $(document).ready(function(){
                        var treeObj = $("#treeDemo");
                        $.fn.zTree.init(treeObj, setting, zNodes);
                        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                        var node = treeObj.getNodesByParam('id',$localStorage.user.curDeptId);
                        treeObj.selectNode(node[0]);
                    });
                    $rootScope.$apply();
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

            function beforeClick(treeId, treeNode) {
                if (treeNode.isParent) {
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    zTree.expandNode(treeNode);
                }
                $localStorage.user.curDeptId = treeNode.id;
                $state.go('main.users.zzjg.zzjg');
                return true;
            }
           /*z-tree end*/ 
                
            /*添加科室*/
            $scope.save = function () {
                if(!$scope.dept.name) return $scope.dept.nameErr=true;
                $.ajax({
                    url : '/sys/office/save',
                    data:  JSON.stringify($scope.dept),
                    contentType : "application/json",
                    type: 'post'
                }).then(function(result) {
                    zTreeGet();
                    $scope.$apply();
                });
            }


            $scope.editDepart = function () {
                $scope.alertEdit = true;
                var parentId = 0;
                for (var i = 0; i < $localStorage.user.deptIdsArr.length; i++) {
                    if($localStorage.user.deptIdsArr[i].id == $localStorage.user.curDeptId) {
                        $scope.deptSave.name = $localStorage.user.deptIdsArr[i].name;
                        parentId = $localStorage.user.deptIdsArr[i].parentId;
                        break;
                    }
                };
                for (var i = 0; i < $localStorage.user.deptIdsArr.length; i++) {
                    if($localStorage.user.deptIdsArr[i].id == parentId) {
                        $scope.deptSave.parentName = $localStorage.user.deptIdsArr[i].name;
                        break;
                    }
                };
                $scope.deptSave.parentId = parentId;
                if(!parentId){$scope.deptSave.parentName = "浙江省人民医院";}
                var index=layer.open({
                        time: 0 //不自动关闭
                        ,type: 1
                        ,content: $('#editDepart')
                        ,title: false
                        // ,title: ['提示','font-size: 14px;color: #fff;background-color: #555a69;line-height: 40px;padding: 0px 10px;border-left: 2px solid #f7931e;textAlign: left;']
                        ,closeBtn: 1
                        ,shade: 0.3
                        ,shadeClose: true
                        ,btn: ['确定', '取消']
                        ,yes: function(index){
                            layer.close(index);
                            /*编辑科室*/
                            $.ajax({
                                url : '/sys/office/edit',
                                data:  JSON.stringify($scope.deptSave),
                                contentType : "application/json",
                                type: 'post'
                            }).then(function(result) {
                                zTreeGet();
                                $scope.$apply();
                            });
                        }
                        ,area: ['677px','385px']
                        ,btnAlign: 'c'
                    });
                    layer.style(index, {
                        backgroundColor: '#fff',
                        borderRadius: '8px'
                    });
            }
             $scope.recoverCode = function () {
                $scope.alertRecover = true;
                var index=layer.open({
                        time: 0 //不自动关闭
                        ,type: 1
                        ,content: $('#recoverCode')
                        ,title: false
                        // ,title: ['提示','font-size: 14px;color: #fff;background-color: #555a69;line-height: 40px;padding: 0px 10px;border-left: 2px solid #f7931e;textAlign: left;']
                        ,closeBtn: 1
                        ,shade: 0.3
                        ,shadeClose: true
                        ,btn: ['确定', '取消']
                        ,yes: function(index){
                            layer.close(index);
                        }
                        ,area: ['500px','260px']
                        ,btnAlign: 'c'
                    });
                    layer.style(index, {
                        backgroundColor: '#fff',
                        borderRadius: '8px'
                    });
            }

            $(document).on("click", function (e) {
                var target = e.target;
                if (target.id == 'organization') {
                    $scope.$apply(function () {
                        $scope.selectParent = true;
                        $scope.shadeState = true;
                    })
                }else if(target.id == 'shadeDiv'){
                    $scope.$apply(function () {
                        $scope.selectParent = false;
                        $scope.shadeState = false;
                    })
                }
            })

	    } ]);