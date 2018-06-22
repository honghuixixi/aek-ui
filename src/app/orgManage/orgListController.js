'use strict';

angular.module('app').controller('orgListController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage','$sessionStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage,$sessionStorage) {
	$scope.localStorageHad=function(){
		if(!$localStorage.userInfo){
			return $state.go('website.home');
		}
	}
	$scope.localStorageHad();
	/*操作成功后的弹出框 */
    if($stateParams.isOp) {
        var msg = layer.msg('<div class="toaster"><i></i><span>' + $stateParams.isOpMsg + '</span></div>', {
            area: ['100%', '60px'],
            time: 3000,
            offset: 'b',
            shadeClose: true,
            shade: 0
        });
    }

	$.ajax({
		type: 'get',
		async:false,
		url: '/sys/tenant/view/tenant/' + ($stateParams.id || $localStorage.userInfo.tenantId) + '/user/' + $rootScope.userInfo.id,
		contentType: "application/json;charset=UTF-8",
		complete: function(res) {
			if(res.responseJSON.code == 200) {
				$localStorage.userInfo.nowOrgName = res.responseJSON.data;
			}
		}
	})
		//底部高度设置，使其占满剩余全部
	$scope.resetBottomHeight = function() {
		var Maxheight = angular.element('.app-content-body').height();
		var topHighe = angular.element('.head-top').height();

		angular.element('.org-panel').css('height', Maxheight - 70);
	}
	$scope.resetBottomHeight();
      $(window).resize(function () {
	     $scope.resetBottomHeight();
       });
	
	$scope.operateTenant=function(a,b){
		$.ajax({
			type: 'post',
			url: '/sys/tenant/operate/' + b.id+'/'+a,
			contentType: "application/json;charset=UTF-8",
			complete: function(res) {
				if(res.responseJSON.code&&res.responseJSON.code == 200) {
					$state.go('org.index', {
						id: $stateParams.id,
		                isOp: true,
		                isOpMsg: '操作成功'
					}, {
		                reload: true
		            });
				}
			}
		});
	}
	
	

	// $rootScope.userOr = true;
	$rootScope.currentmodule = "医疗机构管理";
	$scope.keywords = 'ID/机构名称';
	$scope.key = '';

	$scope.clearKey = function() {
		if($scope.keywords == 'ID/机构名称') {
			$scope.keywords = '';
			$scope.key = '';
		} else {
			$scope.key = $scope.keywords;
		}
	}

	$scope.addKey = function() {
		if(!$scope.keywords) {
			$scope.keywords = 'ID/机构名称';
			$scope.key = '';
		}
	}

	$localStorage.orgData = null;
	// $localStorage.nowId = null;

	//来源
	$scope.source = '来源';
	$scope.sourceId = "";
	$scope.sourceArr = $localStorage.baseOrg && $localStorage.baseOrg.tanentOrigin;
	//审核状态
	$scope.status = '审核状态';
	$scope.statusId = "";
	$scope.statusArr = $localStorage.baseOrg && $localStorage.baseOrg.tenantAuditStatus;
	//机构类型
	// $scope.orgType = '机构类型';
	// $scope.orgTypeId = "";
	// $scope.orgTypeArr = $localStorage.baseOrg && $localStorage.baseOrg.tenantType;
	//账户类型
	$scope.accountType = '账户类型';
	$scope.accountTypeId = "";
	$scope.accountTypeArr = $localStorage.baseOrg && $localStorage.baseOrg.tenantAccountType;
	//开通状态
	$scope.open = '开通状态';
	$scope.openId = "";
	$scope.openArr = [{
		id: 1,
		name: '启用中'
	}, {
		id: 0,
		name: '已停用'
	}];
	//是否测试
	$scope.test = '是否测试';
	$scope.testId = "";
	$scope.testArr = $localStorage.baseOrg && $localStorage.baseOrg.tenantTrial;

	$scope.devshow = false;
	$scope.devshow1 = false;
	$scope.devshow2 = false;
	$scope.devshow3 = false;
	$scope.devshow4 = false;
	$scope.devshow5 = false;
	$scope.devshow6 = false;

	$scope.fixWrapShow = false;

	$scope.hideAll = function() {
		$scope.devshow = false;
		$scope.devshow1 = false;
		$scope.devshow2 = false;
		$scope.devshow3 = false;
		$scope.devshow4 = false;
		$scope.devshow5 = false;
		$scope.devshow6 = false;
	}

	$scope.focus = function(num) {
		$scope.hideAll();
		$scope.devshow = true;
		$scope['devshow' + num] = true;
	}

	// 点击子菜单
	$scope.click = function($event, num, type) {
		$scope['devshow' + num] = false;
		$scope.devshow = false;
		$scope[type] = $($event.target).html();
		$scope[type + 'Id'] = $($event.target).attr('data-id');
		$scope.search('search');
	}

	//获取当前机构详情
	$scope.getDetail = function(id) {
		$.ajax({
			type: 'get',
			url: '/sys/tenant/view/' + id,
			contentType: "application/json;charset=UTF-8",
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					// $scope.nowOrgName = res.responseJSON.data.tenant.name;
					$scope.nowOrgEnable = res.responseJSON.data.tenant.enable;
					// var customData = JSON.parse(res.responseJSON.data.tenant.customData);
					$scope.$apply();
				}
			}
		})
	}

	if($stateParams.id) {
		$scope.getDetail($stateParams.id);
	} else {
		$scope.getDetail($localStorage.userInfo.tenantId);
	}

	//模拟数据
	$scope.res = {};
	$scope.noData = false;

	$scope.pageNo = 1;
	$scope.pageSize = 16;

	$scope.search = function(type) {
		//loading状态
        $scope.res = [];
		$scope.loading2 = true;
		var keyword = '';
		if($scope.keywords != 'ID/机构名称') {
			keyword = $scope.keywords;
		} else {
			keyword = $scope.key;
		}

		var tenantId = 0;
		$stateParams.id ? (tenantId = $stateParams.id) : (tenantId = $localStorage.userInfo.tenantId);

		var data = {
			origin: $scope.sourceId,
			auditStatus: $scope.statusId,
			tenantType: 1,//医疗机构
			commercialUse: $scope.accountTypeId,
			enable: $scope.openId,
			trial: $scope.testId,
			keyword: keyword,
			tenantId: tenantId,
			pageNo: $scope.pageNo,
			pageSize: $scope.pageSize,
		}

		type == 'search' && (data.pageNo = 1);

		$.ajax({
			type: 'get',
			url: '/sys/tenant/index/list',
			contentType: "application/json;charset=UTF-8",
			data: data,
			complete: function(res) {
				if(res.responseJSON.code == 200) {
					$scope.loading2 = false;
					$scope.pageInfo = res.responseJSON.data;
					$scope.pageInfo.pstyle = 1;

					var data = res.responseJSON.data.records;
					if(data.length == 0){
						$scope.noData = true;
					}else{
                        $scope.noData = false;
					}
					for(var i = 0; i < data.length; i++) {
						if(data[i].expireTime) {
							data[i].expireTime = data[i].expireTime.slice(0, 10);
						} else {
							data[i].expireTime = '永久有效';
						}

						var areaMsg = [];
						data[i].province && (areaMsg.push(data[i].province));
                        data[i].city && (areaMsg.push(data[i].city));
                        data[i].county && (areaMsg.push(data[i].county));
                        data[i].areaMsg = areaMsg.join("-");

						// data[i].expireTime && (data[i].expireTime = data[i].expireTime.slice(0,10));
						data[i].createTime && (data[i].createTime = data[i].createTime.slice(0, 10));
					}
					$scope.res = data;
					$scope.$apply();
				}
			}
		})
	}

	$scope.search();

	$scope.showMoreOpt = function(i) {
		$scope.menuHide();
		$scope.fixWrapShow = true;

		$scope['operateList' + i] = !$scope['operateList' + i];
	}

	$scope.menuHide = function() {
		$scope.fixWrapShow = false;
		for(var i = 0, len = $scope.res.length; i < len; i++) {
			$scope['operateList' + i] = false;
		};
	}

	$scope.alertChildCon = false;
	$scope.orgId = 235;
	$scope.orgName = "浙江省第一人民医院";
	$scope.layerImg = "../../../res/img/wh.png";
	$scope.operate = ["删除", "停用", "恢复"];
	$scope.orgOperate = "停用";
	$scope.tips = ["删除机构后,下级机构将一并删除且无法恢复，请谨慎操作！", "停用机构将导致机构对应后台用户均不可登陆，该机构及下级机构后台页面不可访问，请谨慎操作。"];
	$scope.orgTip = "停用机构将导致机构对应后台用户均不可登陆，该机构及下级机构后台页面不可访问，请谨慎操作。";

	$scope.alertLayer = function(i, item, n) {
		$rootScope.fixWrapShow = false;
		$scope['operateList' + i] = false;
		$scope.alertChildCon = true;
		$scope.orgOperate = $scope.operate[n];
		$scope.orgTip = $scope.tips[n];
		$scope.orgId = item.id;
		$scope.orgName = item.name;
		if(n) $scope.layerImg = "../../../res/img/icon20.png";
		else $scope.layerImg = "../../../res/img/wh.png";
		var index = layer.open({
			time: 0 //不自动关闭
				,
			type: 1,
			content: $('#alertOrgChild'),
			title: ['提示', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
			closeBtn: 1,
			shade: 0.3,
			shadeClose: true,
			btn: 0,
			area: ['540px', '287px']
		});

		$scope.closeIndex = function() {
			layer.close(index);
		}

		//停用或删除机构
		$scope.operateOrg = function() {
			var url = '',
				type = 'post';

			if(n == 1) {
				url = '/sys/tenant/stop/' + item.id;
			} else if(n == 0) {
				url = '/sys/tenant/delete/' + item.id;
				type = 'delete'
			} else {
				url = '/sys/tenant/recover/' + item.id;
			}

			$.ajax({
				type: type,
				url: url,
				contentType: "application/json;charset=UTF-8",
				complete: function(res) {
					if(res.responseJSON.code == 200) {
						layer.close(index);
						$scope.search();
					}
				}
			});
		}

	};

	$scope.pagination = function(page, pageSize) {
		$scope.pageNo = page;
		$scope.pageSize = pageSize;
		$scope.search();
	};

	$scope.pageInfo = $scope.res;
	$scope.toAssets = function() {
		if($scope.nowOrgEnable) {
			if($stateParams.id) {
				var url = $state.href('org.new',{id:$stateParams.id,loginId:$stateParams.id});
				window.open(url,'_blank');
				// $state.go('org.add', {
				// 	id: $stateParams.id
				// });
			} else {
                var url = $state.href('org.new',{id:$rootScope.userInfo.tenantId||$localStorage.userInfo.tenantId,loginId:$rootScope.userInfo.tenantId});
                window.open(url,'_blank');
				// $state.go('org.add', {
				// 	id: $rootScope.userInfo.tenantId
				// });
			}

		} else {
			layer.msg('<div class="toaster"><span>当前机构已被停用</span></div>', {
				area: ['100%', '60px'],
				time: 3000,
				offset: 'b',
				shadeClose: true,
				shade: 0
			});
		}
	}

	$scope.goDetail = function(id) {
		$state.go('org.detail', {
			id: id
		});
	}

//	机构导入
    $scope.orgStartMsg = '开始导入';
	$scope.startState = false;
	$scope.progressState = false;
    $scope.exportShow = false;

    var progressTime;

    $scope.import = function() {
        $('.progress').css('width', "0px");
        $scope.canntImport = false;
        $scope.exportShow = true;
        $('.inputName').val('');
        var index = layer.open({
            time: 0, //不自动关闭
            type: 1,
            content: $('#exportShow'),
            title: ['批量导入医疗机构', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
            closeBtn: 1,
            btn: 0,
            shade: 0.3,
            shadeClose: true,
            area: ['617px', '320px'],
            success: function() {
                // $('.choose').hover(function() {
                //     $(this).css({
                //         'color': '#fff',
                //         'background': '#f7931e'
                //     })
                // }, function() {
                //     $(this).css({
                //         'color': '#999',
                //         'background': '#e9e9e9'
                //     })
                // })
                $('.filebtn').val('')
                $('.filebtn').change(function() {
                    // if(!this.files.length) {
                    //     $('.inputName').val('');
                    //     $scope.canntImport = true;
                    //     $rootScope.$apply();
                    //     return;
                    // }
                    var name = this.files[0].name.split('.')
                    var campare = name[name.length - 1]
                    var size = this.files[0].size / (1024 * 1024);
                    $('.inputName').val(this.files[0].name);
                    if((campare == 'xlsx' || campare == 'xls' || campare == 'csv') && size <= 4) {
                        $scope.canntImport = false;
                    } else {
                        $scope.canntImport = true;
                    }
                    $rootScope.$apply();
                })
				$scope.getExcel = function () {
                    angular.element('#downExcel').attr('href','/api/sys/excel/export/templt/tenant')
                }
            },
			cancel:function () {
				clearInterval(progressTime);
                $scope.startState = false;
                $scope.orgStartMsg = '开始导入';
                angular.element('#orgChooseBtn input[type="file"]').removeAttr('disabled');
                $scope.progressing = false;
            }
        });
        layer.style(index, {
            fontSize: '16px',
            backgroundColor: '#fff',
        });

        $scope.startInput = function() {
        	if($scope.startState){
        		return;
			}

            if($scope.canntImport) return;
            if(!$('.inputName').val()) return $scope.canntImport = true;

            //防止用户多次点击
            $scope.startState = true;
            angular.element('#orgChooseBtn input[type="file"]').attr('disabled','true');
            $scope.orgStartMsg = '正在导入';



            var file = $('.filebtn')[0].files[0],
                typeArr = ['xlsx', 'xls', 'csv'],
                type = file.name.split('.')[1];
            var progress = $('.progress');
            var progressNum = $('.progressNum');
            var progressTotalNum = $('.progressTotalNum');

            //在下一次文件上传返回total总条数之前，先把前次的总条数置零
            progressTotalNum.html(0);

            var formData = new FormData();
            formData.append("file", file);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/sys/excel/import/tenant');
            xhr.setRequestHeader("X-AEK56-Token", $localStorage["X-AEK56-Token"]);
            // xhr.upload.onprogress = function(event) {
            //     if(event.lengthComputable) {
            //         $scope.progressing = true;
            //         $rootScope.$apply();
            //         var complete = (event.loaded / event.total * 100 | 0);
            //         progress.css('width', complete + "%");
            //         progressNum.html(complete);
            //     }
            // };

            // var proWidth = 0;
            // var proWidthNum = 0;
            //
            // $scope.progressing = true;
            // var progressTime = setInterval(function () {
            //     proWidth++;
            //     proWidthNum++;
            //     if(proWidthNum == 91){
            //         clearInterval(progressTime)
            //     }else{
            //         progress.css('width', proWidth + "%");
            //         progressNum.html(proWidthNum);
            //     }
            // },10);




            xhr.onload = function() {
                if(xhr.status === 200) {

                } else {

                }
            };
            $scope.msgObj = {
                errorExcelUrl:''
            };
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4) {
                    var res = JSON.parse(xhr.response);
                    if(res.code == 200 && res && res.data.importRateRedisKey){
                        var proWidth = 0;
                        var proWidthNum = 0;

                        $scope.progressing = true;
                        $scope.$apply();
                        progressTime = setInterval(function () {
                            $.ajax({
                                type:'get',
                                url:'/sys/excel/import/tenant/rate',
                                data:{
                                    importRateRedisKey:res.data.importRateRedisKey
                                },
                                success:function (xhr) {
                                	progressTotalNum.html(xhr.data.totalNum);
									if(xhr.data.rate>=1 || xhr.data.totalNum == 0){
                                        clearInterval(progressTime);
                                        progress.css('width', "100%");
                                        progressNum.html(xhr.data.succesNum);
                                        $scope.startState = false;
                                        $scope.orgStartMsg = '开始导入';
                                        angular.element('#orgChooseBtn input[type="file"]').removeAttr('disabled');
                                        $scope.progressing = false;
                                        layer.close(index);


                                        $scope.downloadState = true;
                                        $scope.layerImg = "../../../res/img/cg.png";
                                        $scope.inputRes = "导入完成";
                                        $scope.sucNum = xhr.data.succesNum && xhr.data.succesNum;
                                        $scope.failNum = xhr.data.errorNum && xhr.data.errorNum;
                                        if(!xhr.data.errorNum) {
                                            $scope.failNum = 0;
                                            $scope.downloadState = false;
                                            $scope.verfiyFail = true;
                                            $scope.errorExcelUrl = xhr.data.errorExcelUrl;

                                            $scope.btnyes = {
                                                key: 0,
                                                value: "查看导入的数据"
                                            };
                                            $scope.btnno = {
                                                key: 1,
                                                value: "继续导入"
                                            };

                                        }
                                        //导入失败数据链接地址
                                        angular.element('#errorExcelA').attr('href','/api/sys/excel/export/error/tenant/?errorTenantExcelBoRedisKey='+res.data.importErrorRedisKey);

                                        $scope.msgObj.errorExcelUrl = '/api/sys/excel/export/error/tenant/'+$localStorage.userInfo.id;
                                        console.log($scope.sucNum)
                                        console.log($scope.failNum)
                                        $scope.inputDes = "成功导入数据" + $scope.sucNum + "条，导入失败数据" + $scope.failNum + "条。";

                                        if(!xhr.data.errorNum && !xhr.data.succesNum){
                                            $scope.layerImg = "../../../res/img/icon23.png";
                                            $scope.downloadState = false;
                                            $scope.inputRes = "导入失败！";
                                            $scope.inputDes = "导入数据为空，请重新导入。";
                                            $scope.btnyes = {
                                                key: 1,
                                                value: "重新导入"
                                            };
                                            $scope.btnno = {
                                                key: 0,
                                                value: "稍后再说"
                                            };
                                        }

                                        $scope.inputState = true;

                                        $rootScope.$apply();

                                        var index2 = layer.open({
                                            time: 0 //不自动关闭
                                            ,
                                            type: 1,
                                            id:'orguploadError',
                                            content: $('#exportAlertInput'),
                                            title: ['批量导入医疗机构', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                                            closeBtn: 1,
                                            btn: 0,
                                            shade: 0.3,
                                            shadeClose: true,
                                            area: ['540px', '308px'],
                                            end: function() {
                                                $scope.inputState = false;
                                                $rootScope.$apply();
                                            }
                                        });


									}else{
                                        progress.css('width', xhr.data.rate*100 + "%");
                                        progressNum.html(xhr.data.succesNum);
									}
                                }
                            })
                        },1000);

					}

                    //如果接口响应成功返回数据，则使进度条为100%，关闭当前弹窗，打开新弹窗
                    // if(res){
                    //     // progress.value = 0;
                    //     progress.css('width', "100%");
                    //     progressNum.html(100);
                    //     $scope.startState = false;
                    //     angular.element('#orgChooseBtn input[type="file"]').removeAttr('disabled');
                    //     $scope.progressing = false;
						// layer.close(index);
                    // }

                    if(res.code == 500 || res.code != 200) {

                        layer.close(index);
                        $scope.startState = false;
                        $scope.orgStartMsg = '开始导入';
                        angular.element('#orgChooseBtn input[type="file"]').removeAttr('disabled');
                        $scope.progressing = false;

                        $scope.layerImg = "../../../res/img/icon23.png";
                        $scope.downloadState = false;
                        $scope.inputRes = "导入失败！";
                        $scope.inputDes = "请检查表格兼容性/网络连接等问题，尝试重新导入。";
                        $scope.btnyes = {
                            key: 1,
                            value: "重新导入"
                        };
                        $scope.btnno = {
                            key: 0,
                            value: "稍后再说"
                        };
                        var msg = layer.msg('<div class="toaster"><span>'+res.msg+'</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });

                        $scope.inputState = true;

                        $rootScope.$apply();

                        var index2 = layer.open({
                            time: 0 //不自动关闭
                            ,
                            type: 1,
                            id:'orguploadError',
                            content: $('#exportAlertInput'),
                            title: ['批量导入医疗机构', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                            closeBtn: 1,
                            btn: 0,
                            shade: 0.3,
                            shadeClose: true,
                            area: ['540px', '308px'],
                            end: function() {
                                $scope.inputState = false;
                                $rootScope.$apply();
                            }
                        });
                    } else if(res.code == 200){
                        // $scope.downloadState = true;
                        // $scope.layerImg = "../../../res/img/cg.png";
                        // $scope.inputRes = "导入完成";
                        // $scope.sucNum = res.data.succesNum && res.data.succesNum;
                        // $scope.failNum = res.data.errorNum && res.data.errorNum;
                        // if(!res.data.errorNum) {
                         //    $scope.failNum = 0;
                         //    $scope.verfiyFail = true;
                         //    $scope.errorExcelUrl = res.data.errorExcelUrl;
                        // }
                        // //导入失败数据链接地址
                        // angular.element('#errorExcelA').attr('href','/api/sys/excel/export/error/tenant/'+$localStorage.userInfo.id)
                        //
                        // $scope.msgObj.errorExcelUrl = '/api/sys/excel/export/error/tenant/'+$localStorage.userInfo.id;
                        // $scope.inputDes = "成功导入数据" + $scope.sucNum + "条，导入失败数据" + $scope.failNum + "条。";
                        //
                        // if(!res.data.errorNum && !res.data.succesNum){
                         //    $scope.layerImg = "../../../res/img/icon23.png";
                         //    $scope.downloadState = false;
                         //    $scope.inputRes = "导入失败！";
                         //    $scope.inputDes = "导入数据为空，请重新导入。";
                         //    $scope.btnyes = {
                         //        key: 1,
                         //        value: "重新导入"
                         //    };
                         //    $scope.btnno = {
                         //        key: 0,
                         //        value: "稍后再说"
                         //    };
						// }
                    }
                    // progress.value = 0;
                    // layer.close(index);
                    // $scope.inputState = true;
                    //
                    // $rootScope.$apply();
                    //
                    // var index2 = layer.open({
                    //     time: 0 //不自动关闭
                    //     ,
                    //     type: 1,
						// id:'orguploadError',
                    //     content: $('#exportAlertInput'),
                    //     title: ['批量导入医疗机构', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    //     closeBtn: 1,
                    //     btn: 0,
                    //     shade: 0.3,
                    //     shadeClose: true,
                    //     area: ['540px', '308px'],
                    //     end: function() {
                    //         $scope.inputState = false;
                    //         $rootScope.$apply();
                    //     }
                    // });
                } else {

                }
            }
            xhr.send(formData);

        }
    }

    // 导入
    // $scope.downloadState = true;
    //导入失败数据地址
    $scope.errorDataUrl = '';
    $scope.verfiyFail = false;
    $scope.inputRes = "导入完成！";
    $scope.inputState = false;
    $scope.inputDes = "请检查表格兼容性/网络连接等问题，尝试重新导入。";
    // $scope.inputDes = "成功导入数据"+$scope.sucNum+"条，导入失败数据"+$scope.failNum+"条。";
    $scope.inputFailTip = "下载导入失败数据";
    $scope.layerImg = "../../../res/img/cg.png";
    $scope.btnyes = {
        key: 0,
        value: "查看导入的数据"
    };
    $scope.btnno = {
        key: 1,
        value: "继续导入"
    };
    $scope.contains = function(arr, obj) {
        var i = arr.length;
        while(i--) {
            if(arr[i] === obj) {
                return true;
            }
        }
        return false;
    }


    $scope.closeIndex = function(n) {
        $scope.inputShow = false;
        $scope.inputState = false;
        layer.closeAll();
        if(n) {
            $scope.import();
        } else {
            $state.go('org.index', null, {
                id: $stateParams.id,
                reload: true
            });
        }
    }

    $scope.progressing = false;


}]);