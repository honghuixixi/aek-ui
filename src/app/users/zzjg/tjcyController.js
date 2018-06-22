'use strict';

angular.module('app')
	.controller('tjcyController', [ '$rootScope', '$scope', '$http', '$state', '$localStorage',
		function($rootScope, $scope, $http, $state, $localStorage) {

            //角色信息
            $scope.roleIds = [];
            $scope.roleStrs = '';
            $scope.roleState = false;

            //遮罩层
            $scope.shadeState = false;

            $scope.roleV = false;

			$rootScope.userOr = false;
            $scope.userInfo = {
                  "address": "string",
                  "avator": "string",
                  "city": "string",
                  "createBy": $localStorage.user.id,
                  "dutyId": 0,
                  "dutyName": "string",
                  "email": "string",
                  "fax": "string",
                  "jobNumber": "",
                  "linkName": "string",
                  "mobile": "",
                  "orgId": 1,
                  "deptId": $localStorage.user.deptId,
                  "deptName": $localStorage.user.deptName,
                  "paperNumber": "string",
                  "paperType": "IDCARD",
                  "password": "",
                  "passwordRepeat": "",
                  "photo": "string",
                  "province": "string",
                  "realName": "",
                  "region": "string",
                  "registId": "string",
                  "remark": "string",
                  "sex": "MALE",
                  "updatBy": 0,
                  "updateBy": 0,
                  "roleIds": '',
                  "userType": "COMMON"
                };

            /*编辑科室*/
            $scope.selectParentSave = false;
            $scope.searchResSave = false;
            $scope.searchWordSave = '';
            $scope.resLisSave = [];
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
            //
            $scope.save = function () {
                if($scope.userInfo.password!=$scope.userInfo.passwordRepeat)return;
                if(!$scope.roleStrs)$scope.roleV = true;
                $scope.userInfo.deptId = $localStorage.user.curDeptId;
                $scope.userInfo.roleIds = $scope.roleIds;
                $scope.userInfo.email = new Date().getTime();
                $.ajax({
                    url: '/sys/user/add',
                    data:  JSON.stringify($scope.userInfo),
                    contentType: "application/json",
                    type: 'post'
                }).then(function(result) {
                    if(result.code==0){
                        $state.go('main.users.zzjg.zzjg');
                    }
                });
            }

            var validator = $("#person").validate({
                errorPlacement: function(error, element) {
                    // Append error within linked label
                    $( element ).parent().parent().next()
                                .append( error );
                },
                errorElement: "span",
                messages: {
                    name: {
                        required: " 请输入真实姓名",
                        minlength: " 不能少于 6 个字母"
                    },
                    phone: {
                        required: " 请输入手机号",
                        minlength: " 不能少于 11 个字母"
                    },
                    password: {
                        required: " 请输入密码",
                        minlength: " 不能少于 8 个字母"
                    },
                    passwordR: {
                        required: " 请重复密码",
                        minlength: " 不能少于 8 个字母"
                    },
                    jobNumber: {
                        required: " 请输入工号",
                        minlength: " 不能少于 8 个字母",
                        error: "用户名或密码错误"
                    }
                },
                submitHandler:function(){
                    $scope.save();
                } 
            });

			 var curMenu = null, zTree_Menu = null, zNodes;

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

            //下拉多选框
            var setting2 = {
                check: {
                    enable: true,
                    chkboxType: {"Y":"ps", "N":"ps"}
                },
                view: {
                    dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onCheck: onCheck
                }
            };
            var zNodes2 =[
                { id:10000, pId:0, name:"角色", open:true},
                { id:10001, pId:10000, name:"默认",open:true},
                { id:10002, pId:10000, name:"自定义",open:true}
            ];
            $.ajax({
                url : '/sys/role/query/roleList',
                data:  {'orgId':$localStorage.user.orgId},
                type: 'get'
            }).then(function(result) {
                $scope.loading = false;
                var tpl = result.result.templetRoles,
                    custom = result.result.customRoles;
                for(var i=0;i<tpl.length;i++){
                    var node = {};
                    node.id = tpl[i].id;
                    node.pId = 10001;
                    node.name = tpl[i].name;
                    zNodes2.push(node);
                }

                for(var j=0;j<custom.length;j++){
                    var node = {};
                    node.id = custom[j].id;
                    node.pId = 10002;
                    node.name = custom[j].name;
                    zNodes2.push(node);
                }
                var treeObj2 = $("#treeDemo2");
                $.fn.zTree.init(treeObj2, setting2, zNodes2);

                zTree_Menu = $.fn.zTree.getZTreeObj("treeDemo2");
                curMenu = zTree_Menu.getNodes()[0].children[0].children[0];
                zTree_Menu.selectNode(curMenu);

            });


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
                    function recursiveData(data, pid) {
                      var result = [],
                        temp;
                      for(var l in data) {
                        if(data[l].pid == pid) {
                          result.push(data[l]);
                          temp = recursiveData(data, data[l].id);
                          if(temp.length > 0) {
                            data[l].children = temp;
                          }
                        }
                      }
                      return result;
                    }

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
            }
            });

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
                if (target.id == 'roleInput') {
                    $scope.$apply(function () {
                        $scope.roleState = true;
                        $scope.shadeState = true;
                    })
                }else if(target.id == 'shadeDiv'){
                    $scope.$apply(function () {
                        $scope.roleState = false;
                        $scope.shadeState = false;
                    })
                }
            })

            //下拉多选框选中事件
            function onCheck(e, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo2"),
                    nodes = zTree.getCheckedNodes(true),
                    v = "";
                for (var i=0, l=nodes.length; i<l; i++) {
                    !nodes[i].children && (v += nodes[i].name + ",",$scope.roleIds.push(nodes[i].id));
                }
                if (v.length > 0 ) v = v.substring(0, v.length-1);
                $scope.roleStrs = v;
                $rootScope.$apply();
            }
	} ]);