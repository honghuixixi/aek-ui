angular.module('app')
    .controller('zctzController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$http', '$localStorage', 'FileUploader', '$sessionStorage', 'printCodeService',
        function($scope, $stateParams, $rootScope, $state, $timeout, $http, $localStorage, FileUploader, $sessionStorage, printCodeService) {
            // var layerNewTre;
            $rootScope.currentmodule = '资产管理';
            $rootScope.nocontent = false;
            $rootScope.membernav = false;
            $rootScope.userOr = true;

            $scope.localStorageHad = function() {
                if (!$localStorage.userInfo) {
                    return $state.go('website.home');
                }
            }
            /*操作成功后的弹出框 */
            if ($stateParams.isOp) {
                var msg = layer.msg('<div class="toaster"><i></i><span>' + $stateParams.isOpMsg + '</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });

            }
            $scope.localStorageHad();

            $scope.deptId = '';
            $scope.downloadState = true;
            $scope.tenantId = $stateParams.tenantId || $localStorage.userInfo.tenantId; //机构id
            // 来源的数组
            $scope.assestSourceList2 = [
                { id: 2, status: '验收录入' },
                { id: 3, status: '清查录入' }
            ]
            $scope.newTreListSource2 = $scope.assestSourceList2[0];
            // 基础数据
            $scope.getAllList = function() {
                $.ajax({
                    type: 'get',
                    url: '/assets/data/geCodeInfoByType?types=ACCOUNT_CATEGORY&types=MANAGE_LEVEL&types=FUND_SOURCES&types=UNIT&types=PURCHASE_TYPE&types=MEASURE_TYPE&types=DEP_TYPE&types=PURPOSE&types=ACCOUNT_BOOK',
                    complete: function(res) {
                        if (res.responseJSON.code == 200) {
                            var data = res.responseJSON.data;
                            $scope.ACCOUNT_CATEGORY = data.ACCOUNT_CATEGORY; // 核算类别
                            $scope.MANAGE_LEVEL = data.MANAGE_LEVEL; // 管理级别
                            $scope.FUND_SOURCES = data.FUND_SOURCES; // 资金来源
                        } else {}
                    }
                });
            }
            $scope.getAllList();
            // 新建资产台账
            $scope.newTreListInt = function() {
                $scope.newTreObj = {};
                $scope.newTreListDept = false;
                $scope.newTreListStateShow = false;
                $scope.newTreListAccountShow = false;
                $scope.newTreListManageShow = false;
                $scope.newTreListSourceShow = false;
                $scope.newTreListSourceShow2 = false;
                $scope.assetsNameErr = false;
                $scope.assetsOfficeNameErr = false;
                $scope.factoryNameErr = false;

                $scope.newTreListShow = false;

                $scope.newTreListMore = false;
                $scope.newTreListChangeTxt = '更多';

                $scope.newTreListOffice = { id: '', name: '' };
                $scope.newTreListAccount = { id: null, status: null };
                $scope.newTreListSource = { id: null, status: null };
                $scope.newTreListSource2 = { id: 2, status: '验收录入' };
                $scope.newTreListManage = { id: null, status: null };
                $scope.newTreListState = { id: 2, status: '在用' };
            }
            $scope.newTreListInt();
            $scope.newTre = function() {
                $scope.newTreListShow = true;

                layer.open({
                    time: 0, //不自动关闭
                    type: 1,
                    // autoHeight: true,
                    id: 'alertNewTreLayer',
                    content: $('.newTreList'),
                    title: ['新建资产台账', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    closeBtn: 1,
                    btn: 0,
                    shade: 0.3,
                    shadeClose: true,
                    area: ['624px', '670px'],
                    end: function() {
                        $scope.newTreListInt();
                    },
                    success: function(layero, index) {
                        $(window).trigger("resize");
                    }
                });
                // layerNewTre.offset(460);
            }
            $scope.threetypecode = function() {
                // $scope.newTreObj.threeLevelCode&&($scope.newTreObj.threeLevelCode.length>1)&&($scope.newTreObj.threeLevelCode=$scope.newTreObj.threeLevelCode.match(/^(68[0-9]{0,4})/g));
                if ($scope.newTreObj.threeLevelCode && ($scope.newTreObj.threeLevelCode.length > 1)) {
                    $scope.newTreObj.threeLevelCode = $scope.newTreObj.threeLevelCode.match(/^(68[0-9]{0,4})/g);
                    if (Object.prototype.toString.call($scope.newTreObj.threeLevelCode) == '[object Array]') {
                        $scope.newTreObj.threeLevelCode = $scope.newTreObj.threeLevelCode.join('');
                    }
                }
            }
            // 字节限制
            $scope.limitLength = function(a, b) {
                $scope[a + 'Err'] = $scope[a + 'Err'] ? false : '';
                if (!$scope.newTreObj[a]) return;
                $scope.deleteSpace(a, b, $scope.newTreObj);
                $scope.lengthSubstring(a, b, $scope.newTreObj);
            }
            $scope.limitLengths = function(a, b) {
                $scope[a + 'Err'] = $scope[a + 'Err'] ? false : '';
                if (!$scope[a]) return;
                $scope.deleteSpace(a, b, $scope);
                $scope.lengthSubstring(a, b, $scope);
            }
            $scope.deleteSpace = function(a, b, c) {
                c[a] = c[a].replace(/\s+/g, '');
            }
            $scope.lengthSubstring = function(a, b, c) {
                if (!$scope.lengthOut(a, b, c)) {
                    return
                }
                c[a] = c[a].substring(0, c[a].length - 1);
                $scope.lengthSubstring(a, b, c);
            }
            $scope.lengthOut = function(a, b, c) {
                var arg1 = c[a];
                if (arg1.length <= 20) return false;
                var dwords = arg1.match(/[\x00-\xff]/g);
                var bytes = arg1.match(/[^\x00-\xff]/g);
                !dwords && (dwords = []);
                !bytes && (bytes = []);
                if ((dwords.length + bytes.length) > 40) {
                    return true;
                }
                return false;
            }
            // 字节限制 END
            $scope.newTreListChange = function() {
                $scope.newTreListMore = !$scope.newTreListMore;
                $scope.newTreListChangeTxt = $scope.newTreListChangeTxt == '更多' ? '收起' : '更多';
                // $scope.newTreListMore ? layerNewTre.offset(460) : layerNewTre.offset(460);
            }
            $scope.newTreList = function(a) {
                $scope.batchSetDeptWrapShow = true;
                $scope[a] = true;
                $scope.searchResult = [];
            }
            $scope.newTreListStates = function(a, b, c) {

                $scope[b] = false;
                $scope[a] = c;
                $scope.batchSetDeptWrapShow = false;
            }

            $scope.initcalendar = function() {
                var option = {
                    format: 'YYYY-MM-DD',
                    timePicker: false,
                    maxDate: new Date("2050-01-01"),
                    timePicker12Hour: false,
                    isCotrScollEl:"body",
                    opens: "left",
                    singleDatePicker: true
                }
                angular.element('.newTrelistDate').daterangepicker($.extend({}, option, {
                    startDate: new Date()
                }), function(date, enddate, el) {
                    $scope.newTreObj.startUseDate = date.format('YYYY-MM-DD');
                });
                $('.newTrelistDate').on('apply.daterangepicker', function(a, b) {
                    $scope.newTreObj.startUseDate = b.startDate.format('YYYY-MM-DD');
                });
            }
            $scope.initcalendar();


		$scope.newTreListOffice = {id: '',name: ''};
		$scope.newTreListAccount = {id: null,status: null};
		$scope.newTreListSource = {id: null,status: null};
		$scope.newTreListSource2 = {id: 2,status: '验收录入'};
		$scope.newTreListManage = {id: null,status: null};
		$scope.newTreListState = {id: 2,status: '在用'};
		$scope.newTreListYes = function(){
			if(!$scope.newTreListOffice.name||!$scope.newTreListOffice.id){
				return $scope.assetsOfficeNameErr = true;
			}
			if(!$scope.newTreObj.assetsName){
				return $scope.assetsNameErr = true;
			}
			if(!$scope.newTreObj.factoryName){
				return $scope.factoryNameErr = true;
			}
			var data = {
				"assetsClassId": $scope.newTreListAccount.codeValue,
				"assetsName": $scope.newTreObj.assetsName,
				"assetsSpec": $scope.newTreObj.assetsSpec,
				"assetsStatus": 1, //1:台账,2:预台账
				"deptId": $scope.newTreListOffice.id,
				"factoryName": $scope.newTreObj.factoryName,
				"serialNum":$scope.newTreObj.serialNum,
				"factoryNum": $scope.newTreObj.factoryNum,
				"fundSourcesId": $scope.newTreListSource.codeValue,
				"manageLevel": $scope.newTreListManage.codeValue,
				"regNo": $scope.newTreObj.regNo,
				"splName": $scope.newTreObj.splName,
				"startUseDate": $scope.newTreObj.startUseDate,
				"status": $scope.newTreListState.statusNum,
				"assetsSource":$scope.newTreListSource2.id,
				"threeLevelCode": $scope.newTreObj.threeLevelCode
			}
			$.ajax({
				type: 'post',
				url: '/assets/assetsInfo/addAssets',
				contentType: "application/json;charset=UTF-8",
				data: JSON.stringify(data),
				complete: function(res) {
					var txt = '新建成功';
					if(res.responseJSON.code == 200) {
					} else {txt = '新建失败';}
					$state.go('main.tre.zctz.list', null, {
						id: $stateParams.id,
						reload: true
					});
					var msg = layer.msg('<div class="toaster"><span>'+txt+'</span></div>', {
						area: ['100%', '60px'],
						time: 3000,
						offset: 'b',
						shadeClose: true,
						shade: 0
					});
				}
			});
			$scope.newTreListNo();
		}


            $scope.newTreListNo = function() {
                layer.closeAll();
                $scope.newTreListInt();
            }

            //批量打印方位
            $scope.printDirection = false;

            // 批量设置部门
            $scope.batchSetDeptShow = false;
            $scope.batchSetDeptWrapShow = false;
            $scope.batchSetDeptByIt = {};
            $scope.batchSetDeptInIt = {};
            $scope.batchSetDeptMgIt = {};
            $scope.batchSetDeptInt = function() {
                $scope.batchSetDeptIn = false;
                $scope.batchSetDeptBy = false;
                $scope.batchSetDeptMg = false;

                $scope.batchSetDeptInShow = false;
                $scope.batchSetDeptByShow = false;
                $scope.batchSetDeptMgShow = false;

                $scope.batchSelectSearchWord = '';
            }
            $scope.batchSetDeptInt();
            $scope.batchSelectInputClick = function(n) {
                $scope.batchSetDeptInt();
                $scope.batchSetDeptWrapShow = true;
                $scope[n] = true;
                $scope.searchResult = [];

            }
            $scope.batchSelectLiClick = function(n, m, item) {
                $scope.searchResult = [];
                $scope.batchSelectSearchWord = '';
                $scope[m] = false;
                $scope[n] = item;
                $scope.batchSetDeptWrapShow = false;
                (n == 'newTreListOffice') && ($scope.assetsOfficeNameErr = false);
            }
            $scope.batchSearchChange = function() {
                $scope.getDeptList($scope.batchSelectSearchWord);
            }
            $scope.batchSetDeptYes = function() {
                var ids = [];
                for (var i = 0; i < $scope.printData.length; i++) {
                    ids.push($scope.printData[i].id);
                };
                var data = {
                    assetssIds: ids,
                    deptId: $scope.batchSetDeptInIt.id,
                    applyDeptId: $scope.batchSetDeptByIt.id,
                    manageDeptId: $scope.batchSetDeptMgIt.id
                };
                $.ajax({
                    type: 'post',
                    url: '/assets/assetsInfo/updateBatchAssetsDepartment',
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify(data),
                    complete: function(res) {
                        if (res.responseJSON.code == 200) {
                            $scope.pagination('', '', 1, null);
                        } else {}
                    }
                });
                $scope.batchSetCancel();
            }
            $scope.batchSetCancel = function() {
                $scope.batchSetDeptInt();
                $scope.batchSetDeptShow = false;
                $scope.batchSetDeptWrapShow = false;
                $scope.batchSetStateListShow = false;
                layer.closeAll();
            }
           
            $scope.setDept = function() {
                $scope.batchSetDeptShow = true;
                var index = layer.open({
                    time: 0, //不自动关闭
                    type: 1,
                    id: 'alertBatchSetDeptLayer',
                    content: $('#alertSetDept'),
                    title: ['批量设置部门', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    closeBtn: 1,
                    btn: 0,
                    shade: 0.3,
                    shadeClose: true,
                    area: ['628px', '341px'],
                    end: function() {
                        $scope.batchSetDeptInt($scope.batchSetState.id);
                        $scope.batchSetDeptShow = false;
                        $scope.batchSetDeptWrapShow = false;
                    }
                });
            }
            // 批量设置状态
            $scope.batchSetState = {};
            $scope.batchSetStateList = [];
            $scope.batchSetStateShow = false;
            $scope.batchSetStateListShow = false;
            $scope.setStates = function() {
                $scope.batchSetStateShow = true;
                var index = layer.open({
                    time: 0, //不自动关闭
                    type: 1,
                    id: 'alertBatchSetDeptLayer',
                    content: $('#alertSetState'),
                    title: ['批量设置部门', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    closeBtn: 1,
                    btn: 0,
                    shade: 0.3,
                    shadeClose: true,
                    area: ['628px', '226px'],
                    end: function() {
                        $scope.batchSetState = {};
                        $scope.batchSetStateListShow = false;
                        $scope.batchSetStateShow = false;
                        $scope.batchSetDeptWrapShow = false;
                    }
                });

            }
            $scope.batchSetStateYes = function() {
                var ids = [];
                for (var i = 0; i < $scope.printData.length; i++) {
                    ids.push($scope.printData[i].id);
                };
                var data = {
                    assetssIds: ids,
                    status: $scope.batchSetState.statusNum
                };
                $.ajax({
                    type: 'post',
                    url: '/assets/assetsInfo/updateBatchAssetsStatus',
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify(data),
                    complete: function(res) {
                        if (res.responseJSON.code == 200) {} else {
                            var msg = layer.msg('<div class="toaster"><i></i><span>' + res.responseJSON.msg + '</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0
                            });
                        }
                        $scope.pagination('', '', 1, null);
                    }
                });
                $scope.batchSetCancel();
            }
            $scope.downloadFile = function(fileName, content) {

                // var aLink = document.createElement('a');
                var blob = new Blob([content], {
                    type: "application/vnd.ms-excel"
                });
                // var evt = document.createEvent("HTMLEvents");
                // evt.initEvent("click", false, false); //initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
                // aLink.download = "资产台账模板.xls";
                // var url  = URL.createObjectURL(blob);
                // aLink.dispatchEvent(evt);
                // aLink.click();
                // window.location.href=url;

                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, fileName);
                } else {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }
            }
            // 导入
            //下载模板
            $scope.downloadTpl = function() {
                var xhr = new XMLHttpRequest(); // XMLHttpRequest 对象
                xhr.open("GET", "/api/assets/assetsInfo/getTemplate", true);
                xhr.setRequestHeader("X-AEK56-Token", $localStorage["X-AEK56-Token"]); //前后分离的权限头
                xhr.send();
                xhr.responseType = "blob"; //这里是关键，它指明返回的数据的类型是二进制
                xhr.onreadystatechange = function(e) {
                    if (this.readyState == 4 && this.status == 200) {
                        /*var blob = new Blob([xhr.response],{type: "application/vnd.ms-excel"});
                         var url = URL.createObjectURL(blob);
                         window.location.href = url; //想通过打开窗口来下载excel文件。却不可以。*/
                        $scope.downloadFile("资产台账导入模板.xls", xhr.response)
                    }
                }
            }
            //导入失败数据地址
            $scope.errorDataUrl = '';
            $scope.verfiyFail = false;
            $scope.inputRes = "导入完成！";
            $scope.inputState1 = false;
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
                while (i--) {
                    if (arr[i] === obj) {
                        return true;
                    }
                }
                return false;
            }
            $scope.closeIndex = function(n) {
                $scope.inputShow = false;
                $scope.inputState1 = false;
                layer.closeAll();
                if (n) {
                    $scope.import();
                } else {
                    $state.go('main.tre.zctz.list', null, {
                        id: $stateParams.id,
                        reload: true
                    });
                }
            }

            $scope.progressing = false;
            $scope.S4 = function() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            $scope.getUid = function() {
                return ($scope.S4() + $scope.S4() + "-" + $scope.S4() + "-" + $scope.S4() + "-" + $scope.S4() + "-" + $scope.S4() + $scope.S4() + $scope.S4());
            }
            $scope.file = null;
            $scope.errorDataUrls = 'api/assets/assetsInfo/getErrorData?id=';
            $scope.startInput = function() {
                $scope.errorDataUrls = 'api/assets/assetsInfo/getErrorData?id=';
                if (!$('.inputName').val()) return $scope.importNone = true;
                if ($scope.progressing) return;
                if ($scope.canntImport) return;
                $scope.sucNum = 0;
                var file = $scope.file,
                    typeArr = ['xlsx', 'xls', 'csv'],
                    type = file.name.split('.')[1];
                var formData = new FormData();
                formData.append("file", file);
                var uid = $scope.getUid();
                !$sessionStorage.uid && ($sessionStorage.uid = []);
                $sessionStorage.uid.push(uid);
                formData.append("id", uid);
                var xhr = new XMLHttpRequest();
                /*/zuul/api/assets/assetsInfo/import  大文件上传优化接口   */
                xhr.open('POST', '/api/assets/assetsInfo/import');
                xhr.setRequestHeader("X-AEK56-Token", $localStorage["X-AEK56-Token"]);
                xhr.upload.onprogress = function(event) {
                    if (event.lengthComputable) {
                        $scope.progressing = true;
                        // angular.element('.begin').text('正在导入')
                        $rootScope.$apply();
                    }
                };
                xhr.onload = function() {
                    if (xhr.status === 200) {} else {}
                };
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        var res = JSON.parse(xhr.response);
                        if (res.code != 200) {
                            $scope.layerImg = "../../../res/img/icon23.png";
                            $scope.downloadState = false;
                            $scope.inputRes = "导入失败！";
                            $scope.inputDes = "请检查表格兼容性/网络连接等问题，尝试重新导入。";
                            $scope.btnno = {
                                key: 0,
                                value: "稍后再说"
                            };
                            $scope.btnyes = {
                                key: 1,
                                value: "重新导入"
                            };
                        } else if (res.code == 200) {
                            $scope.btnyes = {
                                key: 0,
                                value: "查看导入的数据"
                            };
                            $scope.btnno = {
                                key: 1,
                                value: "继续导入"
                            };
                            $scope.layerImg = "../../../res/img/cg.png";
                            $scope.inputRes = "导入完成！";
                            var date = new Date();
                            var y = date.getFullYear();
                            var m = date.getMonth() + 1;
                            m = m < 10 ? ('0' + m) : m;
                            var d = date.getDate();
                            d = d < 10 ? ('0' + d) : d;
                            var Num = y + m + d;
                            for (var i = 0; i < 6; i++) {
                                Num += Math.floor(Math.random() * 10);
                            }
                            $('#errorDataUrls')[0].download = '导入失败数据_' + Num + '.xlsx';
                            $scope.errorDataUrls = $scope.errorDataUrls + $sessionStorage.uid[$sessionStorage.uid.length - 1];
                            //导入失败数据链接地址
                        }
                    } else {}
                }
                xhr.send(formData);
                $scope.progressing = true;
                $scope.getProgressBar();
            }
            // 进度
            $scope.getProgressBar = function() {
                $.ajax({
                    type: 'get',
                    url: '/assets/assetsInfo/getProgressBar',
                    data: {
                        id: $sessionStorage.uid[$sessionStorage.uid.length - 1]
                    },
                    complete: function(res) {
                        $('#progress').css('width', (res.responseJSON.data.progress || 0) + "%");
                        $('#progressNum').html(Number(res.responseJSON.data.progress).toFixed(2) || 0);
                        $scope.sucNum = res.responseJSON.data.successCount;
                        $scope.failNum = res.responseJSON.data.isSuccess;
                        $scope.failNum && ($scope.downloadState = false);
                        $scope.inputRes = "导入完成！";
                        $scope.btnyes = {
                            key: 0,
                            value: "查看导入的数据"
                        };
                        $scope.btnno = {
                            key: 1,
                            value: "继续导入"
                        };
                        $scope.layerImg = "../../../res/img/cg.png";
                        if (!$scope.failNum) {
                            $scope.layerImg = "../../../res/img/icon23.png";
                            $scope.downloadState = true;
                            $scope.inputRes = "导入失败！";
                            $scope.inputDes = "请检查表格数据并进行修改，尝试重新导入。";
                            $scope.btnno = {
                                key: 0,
                                value: "稍后再说"
                            };
                            $scope.btnyes = {
                                key: 1,
                                value: "重新导入"
                            };
                        }
                        if (res.responseJSON.data.progress == 100 || res.responseJSON.code != 200) {
                            $scope.inputDes = ($scope.inputDes == "请检查表格兼容性/网络连接等问题，尝试重新导入。") ? "请检查表格兼容性/网络连接等问题，尝试重新导入。" : ($scope.failNum ? ("成功导入数据" + $scope.sucNum + "条。") : '请检查表格数据并进行修改，尝试重新导入。');
                            $scope.progressing = false;
                            layer.closeAll();
                            $scope.inputState1 = true;
                            $rootScope.$apply();
                            var index = layer.open({
                                time: 0 //不自动关闭
                                    ,
                                type: 1,
                                content: $('#alertInput'),
                                title: ['导入资产台账', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                                closeBtn: 1,
                                btn: 0,
                                shade: 0.3,
                                shadeClose: true,
                                area: ['540px', '350px'],
                                end: function() {
                                    $scope.inputState1 = false;
                                    !$scope.failNum && $.ajax({
                                        url: '/assets/assetsInfo/delErrorData?id=' + $sessionStorage.uid[$sessionStorage.uid.length - 1],
                                        type: 'get',
                                        complete: function(res) {
                                            if (res.responseJSON.code == 200) {

                                            }
                                        }
                                    });
                                    $('#progress').css('width', 0 + "%") && $('#progressNum').html(0);
                                    $rootScope.$apply();
                                }
                            });
                            return;
                        }
                        $rootScope.$apply();
                        (res.responseJSON.code == 200) && $scope.getProgressBar();
                        // (res.responseJSON.code==200)&&(res.responseJSON.data<100&&res.responseJSON.data!=null)&&($('#progress').css('width', res.responseJSON.data+"%"))&&$scope.getProgressBar();
                    }
                });
            }

            /*上传文件end*/

            $scope.all = false;
            $('.import').hover(function() {
                $(this).css('color', '#f7931e')
                $(this).children('img').attr('src', '../res/img/icon30.png')
            }, function() {
                $(this).css('color', '#999')
                $(this).children('img').attr('src', '../res/img/icon29.png')
            });
            $('.export').hover(function() {
                $(this).css('color', '#f7931e')
                $(this).children('img').attr('src', '../res/img/icon28.png')
            }, function() {
                $(this).css('color', '#999')
                $(this).children('img').attr('src', '../res/img/icon27.png')
            })
            $scope.inputShow = false;
            $scope.canntImport = false;
            $scope.canntImport1 = false;
            $scope.clearItems = function() {
                $scope.importNone = false
                $scope.canntImport1 = false;
                console.log($scope.canntImport1)
            }
            $scope.import = function() {
                $('#progress').css('width', "0px");
                // angular.element('.begin').text('开始导入')

                $scope.progressing = false;

                $scope.canntImport = false;
                $scope.canntImport1 = false;
                $scope.inputShow = true;
                $scope.file = null;
                $('.inputName').val('');
                var index = layer.open({
                    time: 0 //不自动关闭
                        ,
                    type: 1,
                    content: $('#inputWrap'),
                    title: ['导入资产台账', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    closeBtn: 1,
                    btn: 0,
                    shade: 0.3,
                    shadeClose: true,
                    area: ['617px', '320px'],
                    success: function() {
                        $('.choose').hover(function() {
                            $(this).css({
                                'color': '#fff',
                                'background': '#f7931e'
                            })
                        }, function() {
                            $(this).css({
                                'color': '#999',
                                'background': '#e9e9e9'
                            })
                        })
                        $('.filebtn').val('')
                        $('.filebtn').change(function() {
                            if (!this.files.length) {
                                $scope.importNone = true
                                return;
                            }
                            $scope.file = this.files[0];
                            var name = this.files[0].name.split('.')
                            var campare = name[name.length - 1]
                            var size = this.files[0].size / (1024 * 1024)
                            $('.inputName').val(this.files[0].name);
                            if ((campare == 'xlsx' || campare == 'xls' || campare == 'csv') && size <= 4) {
                                $scope.canntImport = false;
                                $scope.canntImport1 = false;
                            } else {
                                $scope.canntImport = true;
                                $scope.canntImport1 = true;
                                console.log($scope.canntImport1)
                            }
                            $rootScope.$apply();

                        })

                    }
                });
                layer.style(index, {
                    fontSize: '16px',
                    backgroundColor: '#fff',
                });
            }
            // 来源

            // 获取导出字段
            $scope.getOutputData = function() {
                $.ajax({
                    type: 'get',
                    url: '/assets/assetsInfo/fieldDisplay',
                    complete: function(xhr) {
                        $scope.arrList1 = [];
                        $scope.arrList2 = [];
                        $scope.arrList3 = [];
                        $scope.substr = [];
                        if (xhr.responseJSON.code == 200) {
                            var temp;
                            for (var i = 0; i < xhr.responseJSON.data.length; i++) {
                                (xhr.responseJSON.data[i].index == 1) && ($scope.arrList1.push(xhr.responseJSON.data[i]));
                                (xhr.responseJSON.data[i].index == 2) && ($scope.arrList2.push(xhr.responseJSON.data[i]));
                                (xhr.responseJSON.data[i].index == 3) && ($scope.arrList3.push(xhr.responseJSON.data[i]));
                                xhr.responseJSON.data[i].index = '';
                                xhr.responseJSON.data[i].select && (xhr.responseJSON.data[i].required = true) && (temp = JSON.stringify(xhr.responseJSON.data[i])) && (temp = JSON.parse(temp)) && ($scope.substr.push(temp));
                            };
                        } else {

                        }
                    }
                });
            }
            $scope.getOutputData();

            function contactStr(res, wht) {
                var rsp = '';
                for (var i = 0; i < res.length; i++) {
                    if (res[i])
                        rsp += res[i].para + wht;
                };
                return rsp.slice(0, rsp.length - 1);
            }
            $scope.startOutput = function() {
                if (!$scope.checkNum && ($scope.radioV == 2)) return;
                switch ($scope.radioV) {
                    case 0:
                        window.location.href = 'api/assets/assetsInfo/exportAssert?colum=' + contactStr($scope.substr, ',') + '&status=&deptId=' + $scope.deptId + '&assetsSource=' + $scope.searchTwoV + '&sort=' + 0 + '&X-AEK56-Token=' + $localStorage["X-AEK56-Token"];
                        break;
                    case 1:
                        window.location.href = 'api/assets/assetsInfo/exportAssert?colum=' + contactStr($scope.substr, ',') +
                            '&status=' + $scope.searchOneV + '&deptId=' + $scope.deptId + '&assetsSource=' + $scope.searchTwoV + '&sort=' + 0 + '&X-AEK56-Token=' + $localStorage["X-AEK56-Token"];
                        break;
                    case 2:
                        window.location.href = 'api/assets/assetsInfo/exportAssert?colum=' + contactStr($scope.substr, ',') +
                            '&status=' + $scope.searchOneV + '&deptId=' + $scope.deptId + '&ids=' + $scope.idsArr.join(',') + '&assetsSource=' + $scope.searchTwoV + '&sort=' + 0 + '&X-AEK56-Token=' + $localStorage["X-AEK56-Token"];
                        break;
                }
            }
            $scope.downloadOutput = function(a) {
                $.ajax({
                    type: 'get',
                    url: '/assets/assetsInfo/exportAssert',
                    data: a,
                    complete: function(res) {

                    }
                });
            }
            $scope.selectI = function(i) {
                if (i.required) return;
                i.select = !i.select;
                if (i.select) {
                    $scope.substr.push(i);
                    i.index = $scope.substr.length - 1;
                } else {
                    $scope.substr[i.index] = null;
                }
            }
            $scope.radioV = 2;
            $scope.outputShow = false;
            $scope.selectNum = 0;
            $scope.totalNum = 300;

            //导出选中数据id数组
            $scope.idsArr = [];

            $scope.export = function() {
                $scope.idsArr = [];
                var trs = angular.element('.child-checkbox:checked');
                $scope.checkNum = trs.length;
                for (var i = 0; i < trs.length; i++) {
                    $scope.idsArr.push(JSON.parse(trs.eq(i).attr('data-json')).id);
                };

                $scope.outputShow = true;
                var index = layer.open({
                    time: 0 //不自动关闭
                        ,
                    type: 1,
                    content: $('#outputAlert')
                        // ,content: '<div class="export-alert"><div>导出哪些数据</div><div class="form1">'+
                        // '<form action="#" class="form1"><div> <div class="box1">'+
                        // '<input type="radio" id="best-1" name="evaluation" checked class="input"/><span></span>'+
                        // '</div><label for="best-1">当前删选的数据（200条）</label> </div><div><div class="box1">'+
                        // '<input type="radio" id="fine-1" name="evaluation" class="input"/><span></span>'+
                        // '</div><label for="fine-1">全部数据（300条）</label></div></form></div></div><div>导出哪些字段</div>'+
                        // '<div class="box"><span>设备编号</span><span>设备名称</span><span>生产商</span><span>规格型号</span>'+
                        // '<span>供应商</span><span>注册证号</span><span><span>品牌</span><i><img src="../res/img/icon24.png" alt=""></i></span>'+
                        // '</div><div><div>可选字段</div><div style="color: #999;margin:10px 0 0 30px">设备信息</div>'+
                        // '<div class="box"><span><span>单位</span><i><img src="../res/img/icon25.png" alt=""></i></span>'+
                        // '<span><span>设备注册证名称</span><i><img src="../res/img/icon25.png" alt=""></i></span>'+
                        // '<span><span>出厂号(SN)</span><i><img src="../res/img/icon25.png" alt=""></i></span>'+
                        // '<span><span>核算类别</span><i><img src="../res/img/icon25.png" alt=""></i></span>'+
                        // '<span><span>注册</span><i><img src="../res/img/icon25.png" alt=""></i></span>'+
                        // '</div><div style="color: #999;margin:0px 0 0 30px">采购信息</div>'+
                        // '<div class="box"><span><span>注册</span><i><img src="../res/img/icon25.png" alt=""></i></span>'+
                        // '<span><span>注册</span><i><img src="../res/img/icon25.png" alt=""></i></span>'+
                        // '<span><span>注册</span><i><img src="../res/img/icon25.png" alt=""></i></span>'+
                        // '<span><span>注册</span><i><img src="../res/img/icon25.png" alt=""></i></span></div><div class="begin">开始导入</div></div>'
                        ,
                    title: ['导出', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                    closeBtn: 1,
                    btn: 0,
                    shade: 0.3,
                    shadeClose: true,
                    area: ['650px', '611px'],
                    success: function() {

                    }
                });
                layer.style(index, {
                    fontSize: '16px',
                    backgroundColor: '#fff',
                });
            }
            /*表格*/
            $scope.trData = [];
            $scope.printData = [];
            $.ajax({
                type: 'get',
                url: '/assets/assetsInfo/getLedgerPage',
                data: {
                    "sort": 1,
                    "page.current": 1,
                    "page.size": 8

                },
                complete: function(res) {
                    var resData = res.responseJSON.data;
                    $scope.pageInfo = res.responseJSON.data;
                    $scope.pageInfo.pstyle = 2;
                    $scope.allInfo = $scope.pageInfo.total;
                    $scope.trData = resData.records;
                    for (var i = 0; i < $scope.trData.length; i++) {
                        $scope.trData[i].json = JSON.stringify($scope.trData[i]);
                    };
                    if (!$scope.trData.length) {
                        $rootScope.nocontent = true;
                    } else {
                        $rootScope.nocontent = false;
                    }
                    $rootScope.$apply();

                    if (angular.element(window).height() - angular.element('#batch').offset().top > 32) {
                        $scope.printDirection = true;
                    }

                }
            });
            //搜索部分
            $scope.states = ['全部状态', '在库', '在用', '维修中', '已报废'];
            $scope.stateN = $scope.states[0]
            $scope.depetshow = false;

            /*全选*/
            $scope.checkAll = function($event) {
                $scope.all = !$scope.all;
                angular.element('.child-checkbox').prop("checked", $scope.all);
                var currentLength = angular.element('.child-checkbox:checked').length;
                if (!currentLength) {
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

                if (!currentLength) {
                    angular.element('.select-wrap input').attr('disabled', 'disabled')
                } else {
                    angular.element('.select-wrap input').removeAttr('disabled');
                }
                if (currentLength < maxLength) {
                    $scope.all = false;
                } else {
                    $scope.all = true;
                }
            }
            /*展示部门列表*/
            $scope.showdeptList = function() {
                if ($scope.depetName) {
                    $scope.depetshow = true;
                } else {
                    $scope.depetshow = false;
                }
            }
            $scope.devshow = false;
            $scope.showdevList = function() {
                if ($scope.devName) {
                    $scope.devshow = true;
                } else {
                    $scope.devshow = false;
                }
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
                // 批量设置
                $scope.batchSetDeptInShow = false;
                $scope.batchSetDeptByShow = false;
                $scope.batchSetDeptMgShow = false;

                $scope.batchSetDeptWrapShow = false;
                $scope.batchSetStateListShow = false;
                // 新建资产台账
                $scope.newTreListDept = false;
                $scope.newTreListStateShow = false;
                $scope.newTreListAccountShow = false;
                $scope.newTreListManageShow = false;
                $scope.newTreListSourceShow = false;
                // $scope.searchThree = "选择部门";
            }
            // 搜索科室
            $scope.searchResult = [];
            $scope.deptSearch = '';
            $scope.searchChange = function() {
                $scope.getDeptList($scope.deptSearch);
            }

            //查询机构下的部门
            $scope.getDeptList = function(key) {
                $.ajax({
                    type: "get",
                    url: "/sys/dept/search/tenant/" + ($stateParams.id || $localStorage.userInfo.tenantId),
                    data: {
                        keyword: key
                    },
                    complete: function(res) {
                        if (res.responseJSON.code == 200) {
                            $scope.searchResult = res.responseJSON.data;
                            $rootScope.$apply();
                        }
                    }
                });
            }

            $scope.setDeptVal = function(item) {
                $scope.searchThree = item.name;
                console.log($scope.searchThree)
                $scope.deptId = item.id;
                $scope.hideAll();
            }

            // 获得焦点显示
            $scope.devshow1 = false;
            $scope.focus1 = function() {
                if ($scope.devshow) {
                    return $scope.hideAll();
                }
                $scope.devshow = true;
                $scope.devshow1 = true;
            }
            $scope.devshow2 = false;
            $scope.focus2 = function() {
                if ($scope.devshow) {
                    return $scope.hideAll();
                }
                $scope.devshow = true;
                $scope.devshow2 = true;
            }
            $scope.devshow3 = false;
            $scope.focus3 = function() {
                if ($scope.devshow) {
                    return $scope.hideAll();
                }
                $scope.searchThree = '选择部门';
                $scope.deptSearch = '';
                $scope.deptId = '';
                $scope.searchResult = [];
                $scope.devshow = true;
                $scope.devshow3 = true;
            }
            $scope.devshow4 = false;
            $scope.focus4 = function() {
                if ($scope.devshow) {
                    return $scope.hideAll();
                }
                $scope.devshow = true;
                $scope.devshow4 = true;
            }
            $scope.devshow5 = false;
            $scope.focus5 = function() {
                if ($scope.devshow) {
                    return $scope.hideAll();
                }
                $scope.devshow = true;
                $scope.devshow5 = true;
            }
            // 请求状态数据
            $.ajax({
                type: "get",
                url: "/assets/assetsInfo/getAssetsStatusForSelect",
                complete: function(res) {
                    if (res.responseJSON.code == 200) {
                        var resData = res.responseJSON.data;
                        $scope.allStatus = [];
                        $scope.allStatus.push({
                            statusName: '全部状态',
                            status: 0,
                        });
                        $scope.allStatus = $scope.allStatus.concat(resData);
                        $rootScope.$apply();
                    }
                }
            });
            $.ajax({
                type: "get",
                url: "/assets/assetsInfo/getAssetsStatus",
                complete: function(res) {
                    if (res.responseJSON.code == 200) {
                        var resData = res.responseJSON.data;
                        $scope.searchOnel = [];
                        $scope.searchOnel.push({
                            statusName: '全部状态',
                            status: 0,
                        });
                        $scope.searchOnel = $scope.searchOnel.concat(resData);
                        var arr = [];
                        for (var i = 0; i < resData.length; i++) {
                            var temp = {
                                id: i,
                                name: ""
                            };
                            temp.statusNum = resData[i].status;
                            temp.status = resData[i].statusName;
                            arr.push(temp);
                        };
                        $scope.batchSetStateList = arr;
                        // $scope.batchSetStateList.pop();
                        // $scope.batchSetStateList.pop();
                        // $scope.batchSetStateList.pop();
                        $scope.searchOne = $scope.searchOnel[0].statusName;
                        $scope.searchOneV = $scope.searchOnel[0].status;
                        $rootScope.$apply();
                    }
                }
            });
            // 请求来源数据
            $.ajax({
                type: "get",
                url: "/assets/assetsInfo/getAssetsSourceNum",
                complete: function(res) {
                    var resData = res.responseJSON.data;
                    $scope.searchTwol = [{
                        id: '',
                        name: "全部来源",
                        status: ''
                    }, {
                        id: '',
                        name: "入库新增",
                        status: 0
                    }, {
                        id: '',
                        name: "批量导入",
                        status: 1
                    }, {
                        id: '',
                        name: "验收录入",
                        status: 2
                    }, {
                        id: '',
                        name: "清查录入",
                        status: 3
                    }]
                    $scope.searchTwo = $scope.searchTwol[0].name;
                    $scope.searchTwoV = $scope.searchTwol[0].status;
                    $rootScope.$apply();

                }
            });
            $scope.searchThreel = ['全部状态（45）', '在库（5）', '在库（5）']
            // $scope.searchThree= $scope.searchThreel[0]
            $scope.searchThree = "选择部门"
            $scope.searchFourl = ['默认状态', '单价由高到低', '单价由低到高']
            $scope.searchFour = $scope.searchFourl[0]
            $scope.searchFivel = [{
                id: 0,
                name: ' 批量打印标签'
            }, {
                id: 2,
                name: ' 批量设置设备状态'
            }]
            $scope.searchFive = '批量操作'

            //搜索请求
            $scope.search = function(id, sort, page, pagesize, keyword) {
                $scope.all = false;
                $.ajax({
                    type: "get",
                    url: "/assets/assetsInfo/getLedgerPage",
                    data: {
                        "status": $scope.searchOneV, //状态
                        "deptId": $scope.deptId || '', //部门id
                        "page.current": page || $scope.page, //当前页
                        "page.size": pagesize || $scope.pagesize, //每页数目
                        "assetsSource": $scope.searchTwoV,
                        "sort": sort || 1, //排序
                        "keyword": keyword || $scope.searchCon //关键字
                    },
                    complete: function(res) {
                        $scope.pageInfo = res.responseJSON.data;
                        $scope.pageInfo.pstyle = 2;
                        $scope.trData = res.responseJSON.data.records;
                        for (var i = 0; i < $scope.trData.length; i++) {
                            $scope.trData[i].json = JSON.stringify($scope.trData[i]);
                        };
                        if (!$scope.trData.length) {
                            $rootScope.nocontent = true;
                        } else {
                            $rootScope.nocontent = false;
                        }
                        $rootScope.$apply();

                        if (angular.element(window).height() - angular.element('#batch').offset().top > 32) {
                            $scope.printDirection = true;
                        }
                    }

                })

            }
            /*分页*/
            $scope.page = 1;
            $scope.pagesize = 8;
            $scope.pagination = function(page, pagesize) {
                $scope.search("", "", page, pagesize);
            }

            // 点击子菜单
            $scope.click1 = function($event) {
                $scope.devshow1 = false;
                $scope.devshow = false;
                $scope.searchOne = $($event.target).text();
                $scope.searchOneV = $($event.target).attr('data-para');
                $scope.search();
            }
            $scope.click2 = function($event) {
                $scope.devshow2 = false;
                $scope.devshow = false;
                $scope.searchTwo = $($event.target).text();
                $scope.searchTwoV = $($event.target).attr('data-para');
                $scope.search();
            }
            $scope.click3 = function($event) {
                $scope.devshow3 = false;
                $scope.devshow = false;
                $scope.searchThree = $($event.target).text()
            }
            $scope.click4 = function($event) {
                $scope.devshow4 = false;
                $scope.devshow = false;
                $scope.searchFour = $($event.target).text()
                $scope.search("", $($event.target).attr('data-para'));
            }
            $scope.click5 = function(item) {
                $scope.devshow5 = false;
                $scope.devshow = false;
                $scope.printData = [];
                var trs = angular.element('.child-checkbox:checked');
                for (var i = 0; i < trs.length; i++) {
                    $scope.printData.push(JSON.parse(trs.eq(i).attr('data-json')));
                };
                switch (item.id) {
                    case 0:
                        printThe($scope.trData);
                        break;
                    case 1:
                        $scope.setDept();
                        break;
                    case 2:
                        $scope.setStates();
                        break;
                    default:
                        break;
                }
            }
            $scope.printOut = false;
            $scope.printIt = false;

            function printThe(tr) {
                var ids = [];
                for (var i = 0, len = $scope.printData.length; i < len; i++) {
                    ids.push($scope.printData[i].id);
                }
                printCodeService.ajax('GET', '/assets/assetsInfo/getAssetsPrintTag?assetsIds=' + ids.join(","), {}, function(json) {
                    var width = json.width * 5,
                        height = json.height * 5,
                        w = width + 200,
                        h = height + 200;

                    layer.open({
                        time: 0, //不自动关闭
                        type: 1,
                        content: $(".printthis"),
                        title: ['批量打印标签', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                        closeBtn: 1,
                        btn: 0,
                        shade: 0.3,
                        shadeClose: true,
                        area: ['656px', '520px'],
                        success: function() {
                            var showDom = $("#printFirst");
                            showDom.html(json.content);
                            printCodeService.fillTemplate(showDom, json.assetsDataList[0], $scope.printData[0].id);
                            var printDom = $("#print-table");
                            printDom.empty();
                            for (var i = 0, len = json.assetsDataList.length; i < len; i++) {
                                var dom = $(json.content).appendTo(printDom);
                                dom.css('page-break-after', 'always');
                                printCodeService.fillTemplate(dom, json.assetsDataList[i], $scope.printData[i].id, width, height);
                            }
                        }
                    });
                });
                /* $scope.printIt = true;
                 var index = layer.open({
                     time: 0, //不自动关闭
                     type: 1,
                     content: $(".printthis"),
                     title: ['批量打印标签', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                     closeBtn: 1,
                     btn: 0,
                     shade: 0.3,
                     shadeClose: true,
                     area: ['656px', '520px'],
                     success: function() {}
                 });
                 ($('.printscale1').height() > 52) && ($scope.printscale1 = true);
                 ($('.printscale2').height() > 52) && ($scope.printscale2 = true);*/
            }
            $scope.doPrint = function() {
                $scope.printIt = false;
                $scope.printTable = true;
                layer.closeAll();
                $("#print-table").css('display', 'inline');
                var dom = $('#print-table');
                dom.jqprint();
                $("#print-table").css('display', 'none');
            }
            $scope.hrefTo = function($event, tr) {
                var state = 0;
                $localStorage.record = {
                    state: state,
                    id: tr.id
                };
                switch ($scope.stateN.substr(0, $scope.stateN.indexOf('('))) {
                    case '暂存':
                        state = 0;
                        break;
                    case '待审核':
                        state = 1;
                        break;
                    case '审核未通过':
                        state = 2;
                        break;
                    case '审核通过待记账':
                        state = 3;
                        break;
                    case '记账未通过':
                        state = 4;
                        break;
                    case '已出库':
                        state = 5;
                        break;
                    default:
                        break;
                }
                var url = $state.href('main.tre.zctz.assets', { id: $stateParams.id, state: 1, assetId: tr.id });
                window.open(url, '_blank');
            }
        }
    ]);

app.filter('muiltyStatus', function() { //可以注入依赖
    return function(list) {
        var arr = [];
        for (var i = 0; i < 3; i++) {
            arr[i] = list[i];
        }
        return arr;
    }
});