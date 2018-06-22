'use strict';

angular.module('app')
	.controller('zzjgController', [ '$rootScope', '$scope', '$http', '$state', '$localStorage',
		function($rootScope, $scope, $http, $state, $localStorage) {
			$rootScope.userOr = false;
            $scope.aLotOf = true;
            $scope.alertRecover = false;
            $scope.alertEdit = false;
            $scope.loading = true;
            $scope.thisPeople = {};
            /*编辑机构*/
            $scope.selectParentSave = false;
            $scope.searchResSave = false;
            $scope.searchWordSave = '';
            $scope.resLisSave = [];

            //角色信息
            $scope.roleIds = [];
            $scope.roleStrs = '';
            $scope.roleState = false;
            $scope.roleV = false;

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

            //下拉多选框选中事件
            function onCheck(e, treeId, treeNode) {
                $scope.roleIds = [];
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

            //列表参数
            $scope.param = {'orgId':$localStorage.user.orgId};

            //头像上传预览
            $scope.headfile = '';
            $scope.imgSrc = '../../../res/img/usertx.png';

			$scope.trData = [
				// {one: '001',two: '刘夏',three: '12589653251',hover: false,ckid: 'tr1'},
				// {one: '002',two: '刘夏',three: '12589653251',hover: false,ckid: 'tr2'},
				// {one: '003',two: '刘夏',three: '12589653251',hover: false,ckid: 'tr3'}
			];
            $scope.userInfo = {
                  "address": "string",
                  "avator": "string",
                  "city": "string",
                  "createBy": 0,
                  "dutyId": 0,
                  "dutyName": "string",
                  "email": "string",
                  "fax": "string",
                  "jobNumber": "5527",
                  "linkName": "string",
                  "mobile": "15879786897",
                  "orgId": 1,
                  "password": "11",
                  "passwordRepeat": "11",
                  "photo": "string",
                  "province": "string",
                  "realName": "何首乌",
                  "region": "string",
                  "sex": "MALE",
                  "updatBy": 0,
                  "updateBy": 0,
                  "userType": "SUPER_ADMIN"
                };
			$scope.editPeople = false;

            //点击头像事件
            $scope.headClick = function () {
                angular.element('#headFile').click();
            }

            $scope.contains = function (arr,obj) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] === obj) {
                        return true;
                    }
                }
                return false;
            }

            //上传预览事件
            $scope.setImagePreview = function (file) {
                var docObj=document.getElementById('headFile');
                if(docObj.files &&docObj.files[0]){
                    var typeArr = ['jpg','jpeg','gif','png','tiff','bmp'],
                        type = file[0].name.split('.')[1],
                        fileTypeFlag = true;
                    if(!$scope.contains(typeArr,type)){
                        alert('选择文件格式有误，请重新选择！');
                        return;
                    }
                    $scope.headfile = file;
//imgObjPreview.src = docObj.files[0].getAsDataURL();

//火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
                    $scope.imgSrc = window.URL.createObjectURL(docObj.files[0]);
                    $rootScope.$apply();
                }else{

                }
            }
            $scope.delete = function (tr) {
                $scope.loading = true;
                $scope.trData = [];
                $.ajax({
                    url : '/sys/user/delete/'+tr.id,
                    data:  {},
                    type: 'delete'
                }).then(function(result) {
                    $scope.param.deptIds = returnDeptIds($localStorage.user.curDeptId,$localStorage.user.deptIdsArr).toString() || $localStorage.user.curDeptId;
                    $scope.search();
                    zTreeGet();
                });
            }
			$scope.editThis = function (tr) {
                // $scope.$apply(function () {
                //点击编辑时不显示下拉选择及遮罩层
                    $scope.roleState = false;
                    $scope.shadeState = false;
                // })
                $scope.roleV = false;

                //重置树，使全部勾选清零
                for(var i = 0;i<zNodes2.length;i++){
                    zNodes2[i].checked = false;
                }
                //重置输入框值
                $scope.roleStrs = '';

				$scope.editPeople = true;
                $scope.thisPeople = tr;
                $scope.thisPeople.registTime = new Date(tr.createTime).toLocaleDateString();

                //获取当前用户个人信息
                $.ajax({
                    type:'put',
                    url:'/sys/user/query/'+tr.id,
                    contentType : "application/json"
                }).then(function (res) {
                    var node = res.result.roles;
                    var roleArr = [];
                    //如果有角色权限信息
                    if(node.length!=0){
                        //权限id数组重置
                        $scope.roleIds = [];
                        for(var i = 0;i<zNodes2.length;i++){
                            for(var j = 0;j<node.length;j++){
                                if(zNodes2[i].id == node[j].id){
                                    zNodes2[i].checked = true;
                                }
                            }
                        }

                        for(var k = 0;k<node.length;k++){
                            roleArr.push(node[k].name);
                            $scope.roleIds.push(node[k].id);
                        }


                        $scope.$apply(function () {
                            $scope.roleStrs = roleArr.join(',');
                        })
                    }else{

                    }

                    var treeObj2 = $("#treeDemo2");
                    $.fn.zTree.init(treeObj2, setting2, zNodes2);

                    zTree_Menu = $.fn.zTree.getZTreeObj("treeDemo2");
                    curMenu = zTree_Menu.getNodes()[0].children[0].children[0];
                    zTree_Menu.selectNode(curMenu);
                })

                var index=layer.open({
                        time: 0 //不自动关闭
                        ,type: 1
                        ,content: $('#editPeople')
                        ,title: false
                        // ,title: ['提示','font-size: 14px;color: #fff;background-color: #555a69;line-height: 40px;padding: 0px 10px;border-left: 2px solid #f7931e;textAlign: left;']
                        ,closeBtn: 1
                        ,shade: 0.3
                        ,shadeClose: true
                        ,btn: ['确定', '取消']
                        ,yes: $scope.save
                        ,area: ['677px','627px']
                        ,btnAlign: 'c'
                    });
                    layer.style(index, {
                        backgroundColor: '#fff',
                        borderRadius: '8px'
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
            $scope.save = function (index){
                $scope.thisPeople.email = new Date().getTime();
                $scope.thisPeople.roleIds = $scope.roleIds;
                if(!$scope.roleStrs)$scope.roleV = true;
                $scope.$apply();
                $.ajax({
                    url : '/sys/user/edit',
                    data:  JSON.stringify($scope.thisPeople),
                    contentType : "application/json",
                    type: 'put'
                }).then(function(result) {
                    result.code == '0' && layer.close(index);
                });
            }
            
            var zNodes =[
            ];
            zTreeGet();
            function zTreeGet() {
                $.ajax({
                    url : '/sys/office/queryList/1',
                    data:  {},
                    type: 'get',
                    complete: function(result) {
                    $localStorage.user.deptIdsArr = result.responseJSON.result;
                    var res = result.responseJSON.result, node = [];
                    for (var i = 0; i < res.length; i++) {
                        node.push({});
                        node[i].id = res[i].id;
                        node[i].pId = res[i].parentId;
                        node[i].name = res[i].name+'('+calc(res[i],res)+')';
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
                    
                    var children = returnDeptIds($localStorage.user.curDeptId,res);
                    $scope.param.deptIds = children.length == 0 ? $localStorage.user.curDeptId : children.toString();
                    $scope.param['page.current']=1;
                    $scope.param['page.size']=5;
                    $scope.search();

                    zNodes = node;
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

                    $(document).ready(function(){
                        var treeObj1 = $("#treeDemo");
                        $.fn.zTree.init(treeObj1, setting, zNodes);
                        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                        var node = treeObj.getNodesByParam('id',$localStorage.user.curDeptId);
                        treeObj.selectNode(node[0]);
                    });
                }
                });
            }


            /*计算科室人数*/
                    function returnChildren(pid,res) {
                        var temp = [];
                        var patt = new RegExp(pid,'ig');
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

                    function calc(dept,res) {
                        var children = returnChildren(dept.id,res);
                        if (children.length == 0) return dept.deptUserCount;
                        for (var k = 0; k < children.length; k++) {
                            dept.deptUserCount+=children[k].deptUserCount;
                        };
                        return dept.deptUserCount;
                    }

            /**/
            function returnDeptIds(id,res) {
                var temp = [];
                        var patt = new RegExp(id,'ig');
                        for (var j = 0; j < res.length; j++) {
                            var pids = res[j].parentIds.split(',').join('');
                            var had = patt.test(pids);
                            var has = pids.search(id);
                            if(has!=-1) {
                                temp.push(res[j].id);
                            }
                        };
                        return temp;
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
                 var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                 $scope.param.deptIds = treeNode.id;
                if (treeNode.isParent) {
                    zTree.expandNode(treeNode);
                    $scope.param.deptIds = returnDeptIds(treeNode.id,$localStorage.user.deptIdsArr).toString();
                }
                    $scope.param['page.current']=1;
                    $scope.param['page.size']=5;
                    $localStorage.user.curDeptId = treeNode.id;
                    $scope.search();
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
                $scope.deptSave.id = $localStorage.user.curDeptId;
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

            $scope.search = function () {
                $scope.loading = true;
                $scope.trData = [];
                $.ajax({
                    url:'/sys/user/users/deptIds',
                    data:$scope.param,
                    type:'get'
                }).then(function(res) {
                    $scope.loading = false;
                    $scope.trData = res.result.records;
                    $scope.pageInfo = res.result;
                    $rootScope.$apply();
                    // $scope.loading = false;
                });
            }

            // 翻页

            $scope.pagination = function (page,pageSize) {
                $scope.param['page.current']=page;
                $scope.param['page.size']=pageSize;
                $scope.search();
            };

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

	    } ]);