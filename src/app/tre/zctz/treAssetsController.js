'use strict';

angular.module('app')
    .controller('treAssetsController', ['$scope', '$rootScope', '$state', '$timeout', '$localStorage', '$stateParams', 'FileUploader', 'printCodeService',
        function ($scope, $rootScope, $state, $timeout, $localStorage, $stateParams, FileUploader, printCodeService) {
            $rootScope.membernav = false;
            $rootScope.currentmodule = '资产台账';
            /*获取详情*/
            $.ajax({
                type: 'get',
                url: '/assets/assetsInfo/getAssetsDetail',
                data: { id: $stateParams.assetId },
                complete: function (xhr) {
                    $scope.assetsDetailInfo = xhr.responseJSON.data;
                    $scope.assetsName = $scope.assetsDetailInfo.assetsName;
                    $scope.factoryName = $scope.assetsDetailInfo.factoryName;
                    $scope.assetsDetailInfo.price1 = $scope.assetsDetailInfo.priceStr ? $scope.assetsDetailInfo.priceStr.slice(1).split(',').join('') : '';
                    $scope.assetsDetailInfo.contractPrice1 = $scope.assetsDetailInfo.contractPriceStr ? $scope.assetsDetailInfo.contractPriceStr.slice(1).split(',').join('') : '';
                    $scope.assetsDetailInfo.singleBudget1 = $scope.assetsDetailInfo.singleBudgetStr ? $scope.assetsDetailInfo.singleBudgetStr.slice(1).split(',').join('') : '';
                    $scope.purchaseType = { codeText: $scope.assetsDetailInfo.purchaseTypeName, codeValue: $scope.assetsDetailInfo.purchaseTypeId, id: $scope.assetsDetailInfo.purchaseTypeId };
                    $scope.assetsDetailInfo.startUseDate1 = $scope.assetsDetailInfo.startUseDate ? $scope.dateToTime($scope.assetsDetailInfo.startUseDate) : '';
                    $scope.assetsDetailInfo.warrantyDate1 = $scope.assetsDetailInfo.warrantyDate ? $scope.dateToTime($scope.assetsDetailInfo.warrantyDate) : '';
                    $scope.assetsDetailInfo.purchaseDate1 = $scope.assetsDetailInfo.purchaseDate ? $scope.dateToTime($scope.assetsDetailInfo.purchaseDate) : '';
                    $scope.assetsDetailInfo.startDate1 = $scope.assetsDetailInfo.startDate ? $scope.dateToTime($scope.assetsDetailInfo.startDate) : '';
                    ($stateParams.state == 0) && ($scope.initcalendar());
                    $scope.unitId = { codeText: $scope.assetsDetailInfo.unitName, codeValue: $scope.assetsDetailInfo.unitId, id: null };
                    $scope.assetsType = { codeText: $scope.assetsDetailInfo.assetsTypeName, codeValue: $scope.assetsDetailInfo.assetsTypeId, id: null };
                    $scope.assetsClassId = { codeText: $scope.assetsDetailInfo.assetsClassName, codeValue: $scope.assetsDetailInfo.assetsClassId, id: null };
                    $scope.manageLevel = { codeText: $scope.assetsDetailInfo.manageLevelName, codeValue: $scope.assetsDetailInfo.manageLevel, id: null };
                    $scope.measureType = { codeText: $scope.assetsDetailInfo.measureTypeName, codeValue: $scope.assetsDetailInfo.measureType, id: null };
                    $scope.purpose = { codeText: $scope.assetsDetailInfo.purposeName, codeValue: $scope.assetsDetailInfo.purpose, id: null };
                    $scope.applyDepetName = $scope.assetsDetailInfo.applyDeptName;
                    $scope.depetName = $scope.assetsDetailInfo.deptName;
                    $scope.manageDepName = $scope.assetsDetailInfo.manageDeptName;
                    $rootScope.$apply();
                    // console.log($scope.assetsDetailInfo)
                    $('#detailUploadImg').on('change', function () { $scope.assetimginputchange() });
                }
            });

            $scope.changeMeasureFlag = function (val) {
                if (+$scope.assetsDetailInfo.measureFlag == 1 && val == 0) {
                    layer.open({
                        type: 1,
                        title: ['提示', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                        content: $('#template_equ_jl_change'),
                        area: ['480px', '230px'],
                        btn: ['确定', '取消'],
                        yes: function (index, layero) {
                            $scope.assetsDetailInfo.measureFlag = 0;
                            layer.close(index);
                        },
                        end: function () {
                            $scope.$apply();
                        }
                    });
                } else {
                    $scope.assetsDetailInfo.measureFlag = val;
                }
            }
            $scope.dateToTime = function (a) {
                if (!a) {
                    return;
                }
                var date = new Date(a);
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
            }
            $scope.replaceImg = function () {
                var _type = $('#detailUploadImg')[0].files[0].type
                var _size = $('#detailUploadImg')[0].files[0].size / (1024 * 1024)
                var msg;
                if (_size > 2) {
                    return msg = layer.msg('<div class="toaster"><span>' + '图片大于2M，上传失败' + '</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                }
                if (_type != 'image/png' && _type != 'image/jpg' && _type != 'image/jpeg') {
                    return msg = layer.msg('<div class="toaster"><span>' + '图片格式错误，上传失败' + '</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                    $("#detailUploadImg").val('');

                }
                if (_type == 'image/png' || _type == 'image/jpg' || _type == 'image/jpeg') {
                    if (_size <= 2) {
                        $scope.repairUploadImg($('#detailUploadImg')[0].files[0])
                    }
                }
            }
            $scope.prnhtml = '';
            $scope.printTable = function () {
                $("#print-table").css('display', 'inline');
                var bdhtml = $("#print-table").html();
                var sprnstr = "<!--startprint-->";
                var eprnstr = "<!--endprint-->";
                if (bdhtml.indexOf(sprnstr) != -1) {
                    $scope.prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17);
                    $scope.prnhtml = $scope.prnhtml.substring(0, $scope.prnhtml.indexOf(eprnstr));
                }
                $("#print-table").html($scope.prnhtml.trim());
                //window.print();
                $('#print-table').jqprint();
                $("#print-table").css('display', 'none');
            }




            $scope.repairUploadImg = function (a, b) {
                $scope.imgLoading = true;
                var formData = new FormData();
                formData.append("files", a);
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'api/upload');
                // xhr.setRequestHeader("X-AEK56-Token", $localStorage["X-AEK56-Token"]);
                xhr.send(formData);
                xhr.onreadystatechange = function () {
                    var res = xhr.response;
                    $scope.imgLoading = false;
                    var resmsg = '网络故障，图片上传失败，请重试';
                    if (xhr.readyState == 4) {
                        if (JSON.parse(res).code == '200') {
                            resmsg = '图片上传成功';
                            $scope.assetsDetailInfo.assetsImg = JSON.parse(res).data[0];
                            $('#assetDetailImg').attr('src', '/api/file' + $scope.assetsDetailInfo.assetsImg)
                        } else {
                            $('#assetDetailImg').attr('src', '../../res/img/tjtp.png');
                        }
                        var msg = layer.msg('<div class="toaster"><span>' + resmsg + '</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                }
            }
            $scope.assetimginputchange = function () {
                $scope.replaceImg();
                $scope.assetsDetailInfo.assetsImg && $('#assetDetailImg').attr('src', '/api/file' + $scope.assetsDetailInfo.assetsImg);
            }
            $scope.assetdetailimgchange = function () {
                $('#detailUploadImg').trigger("click");
            }
            $scope.assetdetailimgdel = function () {
                $scope.assetsDetailInfo.assetsImg = '';
            }
            $scope.assetImgI = function () {
                if ($scope.state != 0) return;
                $scope.assetImgOperate = true;
                (!$scope.assetsDetailInfo.assetsImg) && $('#assetDetailImg').attr('src', '../../res/img/tjzpdj.png');
            }
            $scope.assetImgO = function () {
                if ($scope.state != 0) return;
                $scope.assetImgOperate = false;
                (!$scope.assetsDetailInfo.assetsImg) && $('#assetDetailImg').attr('src', '../../res/img/tjtp.png');
            }
            $scope.printIt = false;
            $scope.printscale1 = false;
            $scope.printscale2 = false;
            $scope.alert = function () {
                // $scope.printIt = true;
                //  var index=layer.open({
                //      time: 0 //不自动关闭
                //      ,type: 1
                //      ,content: $('.printthis')
                //      ,title: ['打印标签','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                //      ,closeBtn:1
                //      ,btn:0
                //      ,shade: 0.3
                //      ,shadeClose: true
                //      ,area: ['645px','485px'],
                //      success:function () {
                //          $('.print').click(function () {
                //              /*$scope.printIt = false;
                //              $('#printIt').jqprint();*/
                //             // $scope.printTable()
                //             console.log("打印");

                //          });
                //          ($('.printscale1').height()>52)&&($scope.printscale1=true);
                //         ($('.printscale2').height()>52)&&($scope.printscale2=true);
                //      }
                //  });
                //  layer.style(index, {
                //      fontSize: '16px',
                //      backgroundColor: '#fff',
                //  });
                printCodeService.print($scope.assetsDetailInfo.assetsId);
            }

            $scope.state = $stateParams.state;
            $scope.threetypecode = function () {
                // $scope.assetsDetailInfo.threeLevelCode&&($scope.assetsDetailInfo.threeLevelCode.length>1)&&($scope.assetsDetailInfo.threeLevelCode=$scope.assetsDetailInfo.threeLevelCode.match(/^(68[0-9]{0,4})/g));
                if ($scope.assetsDetailInfo.threeLevelCode && ($scope.assetsDetailInfo.threeLevelCode.length > 1)) {
                    $scope.assetsDetailInfo.threeLevelCode = $scope.assetsDetailInfo.threeLevelCode.match(/^(68[0-9]{0,4})/g);
                    if (Object.prototype.toString.call($scope.assetsDetailInfo.threeLevelCode) == '[object Array]') {
                        $scope.assetsDetailInfo.threeLevelCode = $scope.assetsDetailInfo.threeLevelCode.join('')
                    }
                }
            }
            // 字节限制
            $scope.limitLengths = function (a, b) {
                $scope.deleteSpace(a, b, $scope.assetsDetailInfo);
                $scope.lengthSubstring(a, b, $scope.assetsDetailInfo);
            }
            $scope.limitLength = function (a, b) {
                $scope.deleteSpace(a, b, $scope);
                $scope.lengthSubstring(a, b, $scope);
            }
            $scope.deleteSpace = function (a, b, c) {
                if (c[a]) {
                    c[a] = c[a].replace(/\s+/g, '');
                }
            }
            $scope.lengthSubstring = function (a, b, c) {
                if (!$scope.lengthOut(a, b, c)) {
                    return
                }
                c[a] = c[a].substring(0, c[a].length - 1);
                $scope.lengthSubstring(a, b, c);
            }
            $scope.lengthOut = function (a, b, c) {
                var arg1 = c[a];
                if (arg1 && arg1.length > 20) {
                    var dwords = arg1.match(/[\x00-\xff]/g);
                    var bytes = arg1.match(/[^\x00-\xff]/g);
                    !dwords && (dwords = []);
                    !bytes && (bytes = []);
                    if ((dwords.length + bytes.length) > 40) {
                        return true;
                    }
                }
                return false;
            }
            // 编辑提交title
            $scope.assetsNameTipShow = false;
            $scope.factoryNameTipShow = false;
            $scope.assetsNameFocus = false;
            $scope.factoryNameFocus = false;
            $scope.setInputFocus = function (a) {
                $scope[a] = true;
            }
            $scope.assetsTilteHover = function (a, b) {
                $scope[a] = true;
                $scope[b] = true;
            }
            $scope.assetsTilteLeave = function (a, b) {
                $scope[a] = false;
                !b && ($scope.assetsNameEdit = false);
                b && ($scope.factoryNameEdit = false);
                if ($scope.factoryNameFocus) {
                    $scope.factoryNameEdit = true;
                }
                if ($scope.assetsNameFocus) {
                    $scope.assetsNameEdit = true;
                }
            }
            $scope.assetsNameEdit = false;
            $scope.factoryNameEdit = false;
            $scope.editAssetsTitle = function (a) {
                !a && ($scope.assetsNameEdit = true);
                a && ($scope.factoryNameEdit = true);
            }
            $scope.saveAssetsTitleLocal = function (a) {
                if (a) {
                    !$scope.factoryName && ($scope.factoryName = $scope.assetsDetailInfo.factoryName);
                    $scope.assetsDetailInfo.factoryName = $scope.factoryName;
                    $scope.factoryNameFocus = false;
                    $scope.factoryNameEdit = false;
                } else {
                    !$scope.assetsName && ($scope.assetsName = $scope.assetsDetailInfo.assetsName);
                    $scope.assetsDetailInfo.assetsName = $scope.assetsName;
                    $scope.assetsNameFocus = false;
                    $scope.assetsNameEdit = false;
                }
            }
            $scope.saveAssetsTitle = function (a) {
                var data = {
                    assetssId: $stateParams.assetId
                };
                var url;
                if (a) {
                    data.factoryName = $scope.factoryName;
                    url = '/assets/assetsInfo/updateFactoryName';
                    $scope.factoryNameFocus = false;
                    $scope.factoryNameEdit = false;
                } else {
                    data.assetsName = $scope.assetsName;
                    url = '/assets/assetsInfo/updateAssetsName';
                    $scope.assetsNameFocus = false;
                    $scope.assetsNameEdit = false;
                }
                // !a&&(data.assetsName=$scope.assetsName)&&(url='/assets/assetsInfo/updateAssetsName')&&($scope.assetsNameFocus=false)&&($scope.assetsNameEdit=false);
                // a&&(data.factoryName=$scope.factoryName)&&(url='/assets/assetsInfo/updateFactoryName')&&($scope.factoryNameFocus=false)&&($scope.factoryNameEdit=false);
                $.ajax({
                    type: "post",
                    url: url,
                    data: JSON.stringify(data),
                    contentType: "application/json;charset=UTF-8",
                    complete: function (res) {
                        if (res.responseJSON.code == 200) {
                            $scope.assetsDetailInfo.assetsName = $scope.assetsName;
                            $scope.assetsDetailInfo.factoryName = $scope.factoryName;
                        } else {
                            $scope.assetsName = $scope.assetsDetailInfo.assetsName;
                            $scope.factoryName = $scope.assetsDetailInfo.factoryName;
                        }
                        $rootScope.$apply();
                    }
                });
            }
            // 上传图片
            // $scope.detailAssetsImg=function(){
            //     console.log(angular.element('#detailUploadImg')[0].files[0])
            //     var name = this.files[0].name.split('.')
            //     var campare = name[name.length - 1]
            //     var size = this.files[0].size / (1024 * 1024)
            //     $('.inputName').val(this.files[0].name);
            //     if((campare == 'xlsx' || campare == 'xls' || campare == 'csv') && size <= 4) {
            //         $scope.canntImport = false;
            //     } else {
            //         $scope.canntImport = true;
            //     }
            // }
            /*上传图片begin*/
            $scope.uploadStatus = false; //定义上传后返回的状态，成功获失败
            var uploader = $scope.uploader = new FileUploader({
                //url: "/upload/api/qiniu/index/upload", //上传图片
                url: "/api/upload",
                alias: 'files',
                queueLimit: 1, //文件个数 
                withCredentials: true,
                removeAfterUpload: true, //上传后删除文件
                // autoUpload: false, //是否自動上傳
                headers: {
                    "X-AEK56-Token": $localStorage["X-AEK56-Token"]
                },
                filters: [{
                    name: 'image',
                    fn: function (a) {
                        return /image\/\w+/.test(a.type);
                    }
                }, {
                    name: 'size',
                    fn: function (a) {
                        var size = a.size / (1024 * 1024);
                        return size < 2;
                    }
                }],
                onProgress: function (res) {

                },
                onSuccess: function (res) {
                }
            });

            $scope.clearItems = function () { //重新选择文件时，清空队列，达到覆盖文件的效果
                uploader.clearQueue();
            }

            uploader.onAfterAddingFile = function (fileItem) {
                $scope.fileItem = fileItem._file; //添加文件之后，把文件信息赋给scope
            };
            uploader.onProgressItem = function (progress) {

            };
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                $scope.uploadStatus = true; //上传成功则把状态改为true
                // $scope.assetsDetailInfo.assetsImg = 'http://'+window.location.host + '/api/file' + response.data[0];
                $scope.assetsDetailInfo.assetsImg = response.data[0];
                $scope.isfileUploaded = true;
                // $rootScope.$apply()
            };

            var handleFileSelect = function (evt) {
                var file = evt.currentTarget.files[0];
                if (file && !/image\/\w+/.test(file.type)) {
                    return false;
                }
                $scope.uploadfile();
            };

            $scope.uploadfile = function () {
                uploader.uploadAll();
            }
            /*上传图片end*/
            // 基础数据
            $scope.getAllList = function () {
                $.ajax({
                    type: 'get',
                    url: '/assets/data/geCodeInfoByType?types=ACCOUNT_CATEGORY&types=MANAGE_LEVEL&types=FUND_SOURCES&types=UNIT&types=PURCHASE_TYPE&types=MEASURE_TYPE&types=DEP_TYPE&types=PURPOSE&types=ACCOUNT_BOOK',
                    complete: function (res) {
                        if (res.responseJSON.code == 200) {
                            var data = res.responseJSON.data;
                            $scope.ACCOUNT_CATEGORY = data.ACCOUNT_CATEGORY; // 核算类别
                            $scope.MANAGE_LEVEL = data.MANAGE_LEVEL; // 管理级别
                            $scope.FUND_SOURCES = data.FUND_SOURCES; // 资金来源
                            $scope.UNIT = data.UNIT //单位
                            $scope.PURCHASE_TYPE = data.PURCHASE_TYPE //设备来源
                            $scope.MEASURE_TYPE = data.MEASURE_TYPE //计量类别
                            $scope.DEP_TYPE = data.DEP_TYPE //折旧方法
                            $scope.PURPOSE = data.PURPOSE //用途
                            $scope.ACCOUNT_BOOK = data.ACCOUNT_BOOK //仓库类型
                        } else { }
                        angular.element(document.querySelector('#detailUploadImg')).on('change', handleFileSelect);
                    }
                });
            }
            $scope.getAllList();

            $scope.hideAll = function () {
                $scope.devshow = false;
                $scope.depetshow = false;
                $scope.depetshow2 = false;
                $scope.depetshow3 = false;
                $scope.purchaseTypeListShow = false;
                $scope.needOverlay = false;
            }

            // 下拉菜单
            $scope.needOverlay = false;

            $scope.unitIdListShow = false;
            $scope.assetsTypeListShow = false;
            $scope.assetsClassIdListShow = false;
            $scope.manageLevelListShow = false;
            $scope.measureTypeListShow = false;
            $scope.purposeListShow = false;

            $scope.unitId = { codeText: null, codeValue: null, id: null };
            $scope.assetsType = { codeText: null, codeValue: null, id: null };
            $scope.assetsClassId = { codeText: null, codeValue: null, id: null };
            $scope.manageLevel = { codeText: null, codeValue: null, id: null };
            $scope.measureType = { codeText: null, codeValue: null, id: null };
            $scope.purpose = { codeText: null, codeValue: null, id: null };
            $scope.assetsSelecters = function (a) {
                $scope[a] = true;
                $scope.needOverlay = true;
            }
            $scope.assetsSelectersLiClick = function (a, b, c) {
                $scope[a] = c;
                $scope[b] = false;
                $scope.needOverlay = false;
            }

            //关闭所有的弹出框
            $scope.closeAll = function () {
                $scope.needOverlay = false;
                $scope.isSearchPlace = false;
                $scope.depetshow = false;
                $scope.depetshow2 = false;
                $scope.depetshow3 = false;
                $scope.devshow = false;

                $scope.unitIdListShow = false;
                $scope.assetsTypeListShow = false;
                $scope.assetsClassIdListShow = false;
                $scope.manageLevelListShow = false;
                $scope.measureTypeListShow = false;
                $scope.purposeListShow = false;
                $scope.purchaseTypeListShow = false;
                $(".search-wrap").empty();
            }

            $scope.getCitys = function () {

                //已經有地址數據不再請求
                /*if(~~$scope.cityArr) return;*/
                $scope.cityArr = [];
                for (var index = 0; index < citylist.length; index++) {
                    for (var j = 0; j < citylist[index].cities.length; j++) {
                        $scope.cityArr.push(citylist[index].name + "-" + citylist[index].cities[j]);

                    }

                }

            }

            //搜索地址显示
            $scope.searchPlace = function ($event) {
                $scope.isSearchPlace = true;
                $scope.needOverlay = true;
                $scope.getCitys();
                $(".search-wrap").autocomplete({
                    hints: $scope.cityArr,
                    width: '100%',
                    height: "30px",
                    showButton: false,
                    onSubmit: function (text) {
                        $scope.assetsDetailInfo.prodPlace = text;
                        $scope.closeAll();
                        $rootScope.$apply();

                    }
                });

            }

            /*部门、科室搜索*/
            $scope.showdeptList = function (dept) {
                if (dept == 1) {
                    $scope.depetshow = true;
                } else if (dept == 2) {
                    $scope.depetshow2 = true;
                } else if (dept == 3) {
                    $scope.depetshow3 = true;
                }
                $scope.devshow = true;
                $scope.needOverlay = true;
                $scope.deptList = [];
            }

            //获取科室名称
            $scope.searchList = function () {
                $.ajax({
                    type: "get",
                    url: "/sys/dept/search/tenant/" + ($stateParams.id || $localStorage.userInfo.tenantId),
                    data: {
                        keyword: $scope.keyword.nameSearch
                    },
                    complete: function (res) {
                        if (res.responseJSON.code == 200) {
                            $scope.deptList = res.responseJSON.data;
                            $rootScope.$apply();
                        }
                    }
                });
            }

            //设置科室名称
            $scope.setDeptValue = function (id, name, curDept) {
                if (curDept == 1) {
                    $scope.applyDepetName = name;
                    $scope.assetsDetailInfo.applyDeptId = id;
                    $scope.depetshow = false;
                } else if (curDept == 2) {
                    $scope.depetName = name;
                    $scope.assetsDetailInfo.deptId = id;
                    $scope.depetshow2 = false;
                } else if (curDept == 3) {
                    $scope.manageDepName = name;
                    $scope.assetsDetailInfo.manageDeptId = id;
                    $scope.depetshow3 = false;
                }

                $scope.deptList = [];

                $scope.devshow = false;
                $scope.needOverlay = false;
            }
            //编辑台账
            $scope.saveAssets = function () {
                // 模板类型的分类
                $scope.assetsDetailInfo.moduleType = 1
                console.log($scope.assetsDetailInfo)
                $scope.assetsDetailInfo.assetsTypeId = $scope.assetsType.codeValue;
                $scope.assetsDetailInfo.unitId = $scope.unitId.codeValue;
                $scope.assetsDetailInfo.assetsClassId = $scope.assetsClassId.codeValue;
                $scope.assetsDetailInfo.manageLevel = $scope.manageLevel.codeValue;
                $scope.assetsDetailInfo.measureType = $scope.measureType.codeValue;
                $scope.assetsDetailInfo.purpose = $scope.purpose.codeValue;
                $scope.assetsDetailInfo.warrantyDate = $scope.assetsDetailInfo.warrantyDate1 ? (new Date($scope.assetsDetailInfo.warrantyDate1).getTime()) : null;
                $scope.assetsDetailInfo.startUseDate = $scope.assetsDetailInfo.startUseDate1 ? (new Date($scope.assetsDetailInfo.startUseDate1).getTime()) : null;
                $scope.assetsDetailInfo.purchaseDate = $scope.assetsDetailInfo.purchaseDate1 ? (new Date($scope.assetsDetailInfo.purchaseDate1).getTime()) : null;
                $scope.assetsDetailInfo.purchaseTypeId = $scope.purchaseType.codeValue;
                //处理采购信息中的金额
                $scope.assetsDetailInfo.contractPriceStr = $scope.assetsDetailInfo.contractPrice1;
                $scope.assetsDetailInfo.priceStr = $scope.assetsDetailInfo.price1;
                $scope.assetsDetailInfo.singleBudgetStr = $scope.assetsDetailInfo.singleBudget1;

                if ($scope.assetsDetailInfo.listFundSources && $scope.assetsDetailInfo.listFundSources.length != 0) {
                    for (var i = 0; i < $scope.assetsDetailInfo.listFundSources.length; i++) {
                        $scope.assetsDetailInfo.listFundSources[i].fundSourceMoneyStr = ($scope.assetsDetailInfo.listFundSources[i].fundSourceMoney / 100).toString();
                    }
                }

                delete $scope.assetsDetailInfo.price;
                // console.log($scope.assetsDetailInfo)

                $scope.assetsDetailInfo.priceD = $scope.assetsDetailInfo.priceD == '' ? null : $scope.assetsDetailInfo.priceD;

                $.ajax({
                    type: "post",
                    url: "/assets/assetsInfo/editAssets",
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify($scope.assetsDetailInfo),
                    complete: function (res) {
                        var txt = '保存成功';
                        if (res.responseJSON.code == 200) {
                        } else {
                            txt = '保存失败'
                        }
                        $state.go('main.tre.zctz.assets', {
                            id: $stateParams.id,
                            state: 1, assetId: $stateParams.assetId
                        }, {
                                reload: true
                            });
                        var msg = layer.msg('<div class="toaster"><span>' + txt + '</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                });
                $scope.saveAssetsTitle(0);
                $scope.saveAssetsTitle(1);
            }

            //初始化日历
            $scope.initcalendar = function () {
                var option = {
                    format: 'YYYY-MM-DD',
                    startDate: '2017-01-01',
                    endDate: new Date("2050-01-01"),
                    maxDate: new Date("2050-01-01"),
                    timePicker: false,
                    opens: "left",
                    singleDatePicker: true
                }
                angular.element('.input-datepicker').daterangepicker($.extend({}, option, {
                    startDate: new Date()
                }), function (date, enddate, el) {
                    var currentel = $(this.element).attr("name");
                    currentel == "startUseDate1" && ($scope.assetsDetailInfo.startUseDate1 = date.format('YYYY-MM-DD'));
                    currentel == "warrantyDate1" && ($scope.assetsDetailInfo.warrantyDate1 = date.format('YYYY-MM-DD'));
                    currentel == "purchaseDate1" && ($scope.assetsDetailInfo.purchaseDate1 = date.format('YYYY-MM-DD'));
                    $rootScope.$apply();
                });

            }
            $scope.$watch('assetsDetailInfo.warrantyDate1', function (newValue, oldValue, scope) {
                var option = {
                    format: 'YYYY-MM-DD',
                    startDate: new Date(newValue),
                    endDate: new Date("2050-01-01"),
                    maxDate: new Date("2050-01-01"),
                    timePicker: false,
                    opens: "top",
                    singleDatePicker: true
                }
                angular.element('.el-arrivalDate').daterangepicker($.extend({}, option, {
                    minDate: new Date(newValue)
                }), function (date, enddate, el) {

                });

            });
            $scope.$watch('assetsDetailInfo.startUseDate1', function (newValue, oldValue, scope) {
                var option = {
                    format: 'YYYY-MM-DD',
                    startDate: new Date(newValue),
                    endDate: new Date("2050-01-01"),
                    maxDate: new Date("2050-01-01"),
                    timePicker: false,
                    opens: "top",
                    singleDatePicker: true
                }
                angular.element('.el-endDate').daterangepicker($.extend({}, option, {
                    minDate: new Date(newValue)
                }), function (date, enddate, el) {

                });

            });

            $scope.changeRange = function () {
                if (($scope.assetsDetailInfo.priceD + '').length > 0) {
                    var val = parseFloat($scope.assetsDetailInfo.priceD);
                    if (!(val >= 0 && val <= 1000000000)) {
                        $scope.assetsDetailInfo.priceD = '';
                    }
                }
            };

        }]);
