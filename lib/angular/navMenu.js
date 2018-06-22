/*
 *parms: 左侧导航组件
 * auter:aiyou
 */
angular.module('ay.navlist', []).directive('navMenu', function($compile, $state,$stateParams, $localStorage, $rootScope) {
	var curDeptId = ''; //当前部门id
	var parentDeptId = ''; //当前部门父级id 
	var parentDeptName = '';
	var curDeptIdName = '';

	function addDiyDom(treeId, treeNode) {
		var spaceWidth = 16;
		var switchObj = $("#" + treeNode.tId + "_switch"),
			icoObj = $("#" + treeNode.tId + "_ico");
		switchObj.remove();
		icoObj.before(switchObj);

		if(treeNode.level >= 1) {
			var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
			switchObj.before(spaceStr);
		}
	}
	//转换数据
	function recursiveData(scope, data, pid) {
		for(var i in data) {	
		  data[i].id &&	scope.zNodes.push({
				id: data[i].id,
				name: data[i].name,
				halfCheck:data[i].preset,
				open: true,
				pId: pid
			});
			if(data[i].subDepts && data[i].subDepts.length > 0) {
				recursiveData(scope, data[i].subDepts, data[i].id);
			}

		}
	}

	function beforeClick(treeId, treeNode) {
		if(treeNode.isParent) {
			var zTree = $.fn.zTree.getZTreeObj("depttree");
			//zTree.expandNode(treeNode);
		}
		//$localStorage.user.curDeptId = treeNode.id;
		curDeptId = treeNode.id;
		curDeptIdName = treeNode.name;
		parentDeptId = treeNode.pId;
		/* 获取选中的id*/
		$state.go('main.member.list', {
			// deptId: treeNode.getParentNode() && curDeptId,
			deptId: curDeptId,
			deptName: curDeptIdName,
			parentDeptId: parentDeptId,
			preset:treeNode.halfCheck,
			parentDeptName: treeNode.getParentNode() && treeNode.getParentNode().name
		});
		return true;
	}

	//转换数据
	function trsfomrData(scope, data) {
		
		var parentId =data && data.id;
		scope.zNodes = [];
		curDeptId = data.id;
		scope.zNodes.push({
			id: data.id,
			halfCheck:data.preset,
			name: data.name,
			open: true,
			pId: 0
		});

		recursiveData(scope, data.subDepts, data.id);

	}
	//toaster
	function toastMsg(params) {

		layer.msg('<div class="toaster"><span>' + params.msg + '</span></div>', {
			area: ['100%', '60px'],
			time: 1000,
			offset: 'b',
			shadeClose: true,
			shade: 0,
			end: function() {
				params.callback && params.callback();
			}
		});

	}

	function creatDept(scope, element, attrs) {
		if(scope.dept_form.$invalid) {
			scope.dept_form.$dirty = true;
			$rootScope.$apply();
			return;
		}
		scope.dept_form.parentId = curDeptId; //父级id 
		scope.dept_form.tenantId =$stateParams.id || $localStorage.userInfo.nowOrgId; // 所在机构id
		scope.dept_form.createBy = $localStorage.userInfo.id;

		$.ajax({
			type: "post",
			url: "/sys/dept/save",
			contentType: "application/json;charset=UTF-8",
			data: JSON.stringify(scope.dept_form),
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					toastMsg({
						msg: '添加成功'
					});
					refleshList(scope, element, attrs);
				} else {
					toastMsg({
						msg: res.responseJSON.msg
					});
				}

			}
		});
	}

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

	function buildHtml(scope, element, attrs) {
		var treeObj1 = $("#depttree");
		$.fn.zTree.init(treeObj1, setting, scope.zNodes);
		var treeObj = $.fn.zTree.getZTreeObj("depttree");
		if(!treeObj)return
		var node = treeObj.getNodesByParam('id', curDeptId); //设置默认选中项
		treeObj.selectNode(node[0]);
		curDeptId = node[0].id;
		curDeptIdName = node[0].name;
		/*弹框的父级*/
		scope.parentDept = curDeptIdName;
		/*添加部门*/
		scope.addDeptAction = function() {
			scope.parentDept = curDeptIdName;
            scope.depetshow = false;
			layer.open({
				time: 0, //不自动关闭			
				content: angular.element("#addmemberdept")[0].outerHTML,
				title: ['新建部门', 'font-size: 14px;color: #fff;background-color:#4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
				closeBtn: 1,
				shade: 0.3,
				id:'editDept',
				shadeClose: true,
				btn: ['确定', '取消'],
				area: ['620px', '260px'],
				btnAlign: 'r',
				success: function(el) {
					var $dom = $(el).find("#addmemberdept").html();
					$(el).find("#addmemberdept").html($compile($dom)(scope));

					scope.deptarr = [];
					scope.keyword = {
						nameSearch: ''
					}

                    scope.hideAll = function() {
                        scope.depetshow = false;
                    }

					/*搜索部门*/
					scope.showdeptList = function() {
						scope.depetshow = true;
						$(".member-deptWrap").empty();
					}

					//ng-repeat失效 暂时使用jq处理

					$("body").on("click", ".label-item", function(e) {
						scope.depetshow = false;
						scope.parentDept = e.target.innerText;

						curDeptId = e.target.id;
						$rootScope.$apply();

					})
					scope.$watch('deptarr', function(newValue, oldValue, scope) {
						var $label = '';
						angular.forEach(scope.deptarr, function(item) {
							$label += '<label class="label-item"  id=' + item.id + '>' + item.name + '</label>'
						});
						$(".member-deptWrap").empty().append($label);

					});
					scope.searchList = function() {

						$.ajax({
							type: "get",
							url: "/sys/dept/search/tenant/" + ($stateParams.id || $localStorage.userInfo.nowOrgId),
							data: {
								keyword: scope.keyword.nameSearch
							},
							complete: function(res) {
								if(res.responseJSON.code == 200) {
									scope.deptarr = res.responseJSON.data;
									$rootScope.$apply();
								}

							}
						});

					}

                    scope.deptLength = function () {
						if(scope.dept_form.name.length>40){
                            scope.dept_form.name = scope.dept_form.name.slice(0,40);
						}
                    }

				},
				yes: function(index) {
					if(scope.dept_form.name.length>40){
                        // toastMsg({
                        //     msg: '部门名称长度应在40个字符串之内'
                        // });
                        return;
					}else{
                        creatDept(scope, element, attrs);
                        layer.close(index);
					}
				},
				cancel: function(index) {
					layer.close(index);

				}
			})

		}

	}

	function refleshList(scope, element, attrs) {

		$.ajax({
			type: "get",
			url: "/sys/dept/tree/tenant/" + ($stateParams.id || $localStorage.userInfo.nowOrgId),
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					trsfomrData(scope, res.responseJSON.data);
					buildHtml(scope, attrs, element);
				}

			}

		});
	}

	return {
		restrict: 'EA',
		scope: {
			DeptAction: '&'
		},
		templateUrl: '../../src/tpl/navlist.html',

		link: function(scope, element, attrs) {
			scope.userInfo=$localStorage.userInfo
			refleshList(scope, element, attrs);
		}
	};

});