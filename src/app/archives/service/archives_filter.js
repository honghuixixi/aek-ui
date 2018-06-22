// 下载地址编码
angular.module('app').filter('archivesDownloadURL', function () {
    return function (src) {
        return encodeURI(encodeURI('/api/download?path=' + src));
    };
});
// 新建档案选择设备
angular.module('app').directive('archivesModalEqups', function () {
    return {
        restrict: "E",
        scope: {
            equ: "=",
            err: "="
        },
        templateUrl: 'src/app/archives/html/directive_equps.html',
        replace: true, // 使用模板替换原始标记 
        transclude: false, // 不复制原始HTML内容 
        controller: ["$rootScope", "$scope", 'archivesDbService', function ($rootScope, $scope, archivesDbService) {
            $scope.data = {
                departOptions: [],
                currentDepart: { id: 0, name: '全部' },
                keyword: '',
                list: [],
                loading: true,
                empty: false
            };
            // 分页数据
            $scope.pageInfo = {
                pages: 0,
                total: 0,
                size: 4,
                current: 1,
                pstyle: 2
            };

            // 分页事件
            $scope.pagination = function (page, pageSize) {
                $scope.pageInfo.size = pageSize;
                $scope.getEqupments(page, pageSize);
            }

            // 切换部门
            $scope.changeDept = function (item) {
                $scope.equ = { assetId: 0 };
                $scope.data.currentDepart = item;
                $scope.search();
            };

            // 搜索
            $scope.search = function () {
                $scope.equ = { assetId: 0 };
                $scope.getEqupments(1, $scope.pageInfo.size);
            };

            // 选择设备
            $scope.chooseEqu = function (obj) {
                $scope.equ = obj;
                $scope.err = '';
            };

            $scope.getEqupments = function (pageNo, pageSize) {
                var param = {
                    "pageNo": pageNo,
                    "pageSize": pageSize
                };
                if ($scope.data.currentDepart.id > 0) {
                    param.deptId = $scope.data.currentDepart.id;
                }
                if ($scope.data.keyword.length > 0) {
                    param.keyword = $scope.data.keyword;
                }

                $scope.data.list = [];
                $scope.data.loading = true;
                archivesDbService.getEqupments(param, function (json) {
                    $scope.data.loading = false;
                    $scope.data.list = json.records;
                    $scope.pageInfo.current = pageNo;
                    $scope.pageInfo.total = json.total;
                    $scope.data.empty = json.records.length < 1;
                    $scope.$apply();
                });
            }

            $scope.init = function () {
                if ($scope.data.departOptions.length < 1) {
                    archivesDbService.getDepartments($rootScope.userInfo.tenantId, function (data) {
                        $scope.data.departOptions = [{ id: 0, name: '全部' }].concat(data);
                    });
                }
                $scope.data.currentDepart = { id: 0, name: '全部' };
                $scope.data.keyword = '';
                $scope.getEqupments(1, $scope.pageInfo.size);
            };

            $scope.init();
        }]
    };
});
// 新建/编辑档案表单
angular.module('app').directive('archivesModalForm', function () {
    return {
        restrict: "E",
        scope: {
            miji: "=",
            form: "=",
            err: "="
        },
        templateUrl: 'src/app/archives/html/directive_form.html',
        replace: true, // 使用模板替换原始标记 
        transclude: false, // 不复制原始HTML内容 
        controller: ["$rootScope", "$scope", 'archivesDbService', 'archivesUtilService', function ($rootScope, $scope, archivesDbService, archivesUtilService) {
            $scope.data = {
                timeOptions: [
                    { id: 1, name: '永久' },
                    { id: 2, name: '长期（16~50年）' },
                    { id: 3, name: '短期（15年以下）' }
                ]
            };
            $scope.methods = {
                changeTime: function (item) {
                    $scope.form.qixian = item;
                },
                changeType: function (item) {
                    $scope.form.miji = item;
                    if (item.id > 0) {
                        $scope.methods.removeErr('miji');
                    }
                },
                removeErr: function (key) {
                    $scope.err[key] = '';
                },
                setDatepicker: function (domId, keyField, keyErr, dt) {
                    var st = new Date();
                    if ((dt + '').length > 0) {
                        st = new Date(dt);
                    }
                    archivesUtilService.setDatepicker(domId, st, null, null, null, function (b) {
                        $scope.form[keyField] = new Date(b.startDate).getTime();
                        $scope.methods.removeErr(keyErr);
                        $scope.$apply();
                    });
                }
            };

            $scope.init = function () {
                var rangeFun = function () {
                    if (($scope.form.rangeStart + '').length && ($scope.form.rangeEnd + '').length) {
                        $scope.methods.removeErr('range');
                        $scope.$apply();
                    }
                }
                $scope.methods.setDatepicker('#ljrq', 'ljrq', 'ljrq', $scope.form.ljrq);
                $scope.methods.setDatepicker('#jcrq', 'jcrq', 'jcrq', $scope.form.jcrq);
                var st = null;
                var en = null;
                if (($scope.form.rangeStart + '').length > 0) {
                    st = new Date($scope.form.rangeStart);
                }
                if (($scope.form.rangeEnd + '').length > 0) {
                    en = new Date($scope.form.rangeEnd);
                }
                setStartDatepicker(rangeFun, null, en, st, null);
                setEndDatepicker(rangeFun, st, null, en, null);
            };

            $scope.init();

            function setStartDatepicker(fun, min, max, st, en) {
                archivesUtilService.setDatepicker('#rangeStart', st, en, min, max, function (b) {
                    $scope.form.rangeStart = new Date(b.startDate).getTime();
                    setEndDatepicker(fun, new Date(b.startDate), new Date("2050-01-01"));
                    fun();
                });
            }

            function setEndDatepicker(fun, min, max, st, en) {
                archivesUtilService.setDatepicker('#rangeEnd', st, en, min, max, function (b) {
                    $scope.form.rangeEnd = new Date(b.startDate).getTime();
                    setStartDatepicker(fun, null, new Date(b.startDate));
                    fun();
                });
            }
        }]
    };
});

// 档案详情-设备信息
angular.module('app').directive('tabContent2', function () {
    return {
        restrict: "E",
        scope: {
            isshow: '=',
            isedit: '=',
            id: '='
        },
        templateUrl: 'src/app/archives/html/archives_searchdetail_tab_2.html',
        replace: true,
        transclude: false,
        controller: ["$scope", 'archivesDbService', 'archivesUtilService', function ($scope, archivesDbService, archivesUtilService) {
            $scope.data = {
                server: {},
                isInit: false
            };
            $scope.init = function () {
                if ($scope.isshow && !$scope.data.isInit) {
                    $scope.data.isInit = true;
                    archivesDbService.getAssetBasicInfo(+$scope.id, function (json) {
                        $scope.data.server = json;
                        $scope.$apply();
                    });
                }
            };

            $scope.$watch('isshow', $scope.init);
        }]
    };
});
// 档案详情-采购信息
angular.module('app').directive('tabContent3', function () {
    return {
        restrict: "E",
        scope: {
            isshow: '=',
            isedit: '=',
            issubmit: '=',
            id: '=',
            assetid: '=',
            record: '='
        },
        templateUrl: 'src/app/archives/html/archives_searchdetail_tab_3.html',
        replace: true,
        transclude: false,
        controller: ['$rootScope', "$scope", 'archivesDbService', 'archivesUtilService', function ($rootScope, $scope, archivesDbService, archivesUtilService) {
            $scope.data = {
                server: {},
                local: {
                    FUND_SOURCES_MAP: {},
                    FUND_SOURCES: [],
                    TENDER_FORM: [],
                    PURCHASE_MODE: [],
                    PURCHASE_TYPE: [],
                    DEPARTS: [],
                    record: {
                        acceptAttachments: [], // 验收附件
                        acceptor: "", // 验收人员
                        acceptorDeptName: "", // 验收部门
                        acceptorTime: "", // 验收时间
                        applyDate: "", // 申购日期
                        applyDeptId: 0, // 申购科室id
                        applyReason: "", // 申购理由
                        archiveId: 0, // 档案id
                        arrivalTime: "", // 到货时间
                        assetsId: 0, // 设备id
                        bidAttachments: [], // 招标附件
                        buildItemBasis: "", // 立项依据
                        listFundSources: [], // 资金来源
                        previewArriveDate: "", // 预到时间
                        proveDate: "", // 论证日期
                        purchaseMode: 0, // 采购方式
                        purchaseType: 0, // 购置类别
                        singleBudget: '', // 单项预算
                        tenderDate: "", // 中标时间
                        tenderForm: 0, // 招标形式

                        listFundSourcesType: 0, // 资金来源
                        listFundSourcesMoney1: '',
                        listFundSourcesMoney2: ''
                    }
                },
                isInit: false
            };

            $scope.methods = {
                uploadFile: function (id) {
                    angular.element('#' + id).click();
                },
                removeFile: function (index, key) {
                    $scope.data.local.record[key].splice(index, 1);
                },
                getPurchase: function () {
                    archivesDbService.getPurchase({ archiveId: $scope.id, assetsId: $scope.assetid }, function (json) {
                        $scope.data.server = json;
                        $scope.$apply();
                    });
                }
            };

            $scope.utils = {
                convertConst: function (obj, key) {
                    var arr = [];
                    for (var i in obj[key]) {
                        arr.push({ id: i, name: obj[key][i] });
                    }
                    $scope.data.local[key] = [{ id: 0, name: '请选择' }].concat(arr);
                },
                copyData: function () {
                    if ($scope.data.server) {
                        for (var key in $scope.data.server) {
                            if (key == 'acceptAttachments') {
                                $scope.data.local.record.acceptAttachments = [];
                                if ($scope.data.server.acceptAttachments.length > 0) {
                                    for (var i = 0, len = $scope.data.server.acceptAttachments.length; i < len; i++) {
                                        $scope.data.local.record.acceptAttachments.push({
                                            fileName: $scope.data.server.acceptAttachments[i].fileName,
                                            fileUrl: $scope.data.server.acceptAttachments[i].fileUrl
                                        });
                                    }
                                }
                            } else if (key == 'bidAttachments') {
                                $scope.data.local.record.bidAttachments = [];
                                if ($scope.data.server.bidAttachments.length > 0) {
                                    for (var i = 0, len = $scope.data.server.bidAttachments.length; i < len; i++) {
                                        $scope.data.local.record.bidAttachments.push({
                                            fileName: $scope.data.server.bidAttachments[i].fileName,
                                            fileUrl: $scope.data.server.bidAttachments[i].fileUrl
                                        });
                                    }
                                }
                            } else if (key == 'listFundSources') {
                                var list = $scope.data.server.listFundSources;
                                if (list.length > 0) {
                                    $scope.data.local.record.listFundSourcesType = list[0].type;
                                    $scope.data.local.record.listFundSourcesMoney1 = list[0].money;
                                    if (list.length > 1) {
                                        $scope.data.local.record.listFundSourcesMoney2 = list[1].money;
                                    }
                                }
                            } else {
                                $scope.data.local.record[key] = $scope.data.server[key];
                            }
                        }
                    }
                    $scope.record = $scope.data.local.record;
                },
                setDatepicker: function (domId, key) {
                    var st = $scope.data.local.record[key],
                        val = '';
                    if (st && (st + '').length > 0) {
                        st = new Date(st);
                        val = st.Format("yyyy-MM-dd");
                        st = new Date(val + " 00:00:00");
                    }
                    $(domId).val(val);
                    archivesUtilService.setDatepicker(domId, st, null, null, null, function (b) {
                        $scope.data.local.record[key] = new Date(b.startDate).getTime();
                    });
                }
            };

            // 指令初始化
            $scope.init = function () {
                if ($scope.isshow && !$scope.data.isInit) {
                    $scope.data.isInit = true;
                    // 获取常量
                    archivesDbService.getArchiveConstantMap(function (json) {
                        $scope.data.local.FUND_SOURCES_MAP = json.FUND_SOURCES;
                        $scope.utils.convertConst(json, 'FUND_SOURCES');
                        $scope.utils.convertConst(json, 'TENDER_FORM');
                        $scope.utils.convertConst(json, 'PURCHASE_MODE');
                        $scope.utils.convertConst(json, 'PURCHASE_TYPE');
                    });
                    // 获取部门
                    archivesDbService.getDepartments($rootScope.userInfo.tenantId, function (data) {
                        $scope.data.local.DEPARTS = [{ id: 0, name: '请选择' }].concat(data);
                    });
                    // 获取采购信息
                    $scope.methods.getPurchase();
                    // 文件上传
                    archivesUtilService.bindUploadEvent('#tab3-uploadId-1', 5, archivesUtilService.tost, function (obj) {
                        $scope.data.local.record.bidAttachments.push({ fileName: obj.fileName, fileUrl: obj.uploadUrl });
                        $scope.$apply();
                    });
                    archivesUtilService.bindUploadEvent('#tab3-uploadId-2', 5, archivesUtilService.tost, function (obj) {
                        $scope.data.local.record.acceptAttachments.push({ fileName: obj.fileName, fileUrl: obj.uploadUrl });
                        $scope.$apply();
                    });
                }
            };

            // 监听isshow
            $scope.$watch('isshow', $scope.init);
            $scope.$watch('isedit', function () {
                if ($scope.isedit) {
                    $scope.utils.copyData();
                    $scope.utils.setDatepicker('#tab3-applyDate', 'applyDate');
                    $scope.utils.setDatepicker('#tab3-proveDate', 'proveDate');
                    $scope.utils.setDatepicker('#tab3-previewArriveDate', 'previewArriveDate');
                    $scope.utils.setDatepicker('#tab3-tenderDate', 'tenderDate');
                    $scope.utils.setDatepicker('#tab3-acceptorTime', 'acceptorTime');
                    $scope.utils.setDatepicker('#tab3-arrivalTime', 'arrivalTime');
                }
            });
            $scope.$watch('issubmit', function () {
                if ($scope.issubmit) {
                    $scope.methods.getPurchase();
                }
            });
        }]
    };
});
// 档案详情-合同信息
angular.module('app').directive('tabContent4', function () {
    return {
        restrict: "E",
        scope: {
            isshow: '=',
            isedit: '=',
            issubmit: '=',
            id: '=',
            assetid: '=',
            record: '='
        },
        templateUrl: 'src/app/archives/html/archives_searchdetail_tab_4.html',
        replace: true,
        transclude: false,
        controller: ["$scope", 'archivesDbService', 'archivesUtilService', function ($scope, archivesDbService, archivesUtilService) {
            $scope.data = {
                server: {},
                local: {
                    attachments: [], // 合同附件
                    contractArchiveAdministrator: '', // 档案管理员
                    contractArchiveNum: '', // 档案编号
                    contractContent: '', // 合同内容
                    contractName: '', // 合同名称
                    contractNum: '', // 合同编号
                    contractPrice: '', // 合同金额
                    endDate: '', // 合同截止时间
                    id: null, // ,
                    invoiceNo: '', // 发票号
                    partybContactPerson: '', // 乙方联系人
                    partybContactPhone: '', // 乙方联系电话
                    signDate: '', //  签订日期
                },
                isInit: false
            };
            $scope.methods = {
                uploadFile: function () {
                    angular.element('#tab4-uploadId').click();
                },
                removeFile: function (index) {
                    $scope.data.local.attachments.splice(index, 1);
                },
                copyData: function () {
                    if ($scope.data.server) {
                        for (var key in $scope.data.server) {
                            if (key == 'attachments') {
                                $scope.data.local.attachments = [];
                                if ($scope.data.server.attachments.length > 0) {
                                    for (var i = 0, len = $scope.data.server.attachments.length; i < len; i++) {
                                        $scope.data.local.attachments.push({
                                            fileName: $scope.data.server.attachments[i].fileName,
                                            fileUrl: $scope.data.server.attachments[i].fileUrl
                                        });
                                    }
                                }
                            } else {
                                $scope.data.local[key] = $scope.data.server[key];
                            }
                        }
                    }
                    $scope.record = $scope.data.local;
                },
                setDatepicker: function (domId, key) {
                    var st = $scope.data.local[key],
                        val = '';
                    if (st && (st + '').length > 0) {
                        st = new Date(st);
                        val = st.Format("yyyy-MM-dd");
                        st = new Date(val + " 00:00:00");
                    }
                    $(domId).val(val);
                    archivesUtilService.setDatepicker(domId, st, null, null, null, function (b) {
                        $scope.data.local[key] = new Date(b.startDate).getTime();
                    });
                },
                getHtObject: function () {
                    archivesDbService.getHtObject({ archiveId: $scope.id, assetsId: $scope.assetid }, function (json) {
                        $scope.data.server = json;
                        $scope.$apply();
                    });
                }
            };

            // 指令初始化
            $scope.init = function () {
                if (!$scope.data.isInit && $scope.isshow) {
                    $scope.data.isInit = true;
                    // 获取合同信息
                    $scope.methods.getHtObject();
                    // 文件上传
                    archivesUtilService.bindUploadEvent('#tab4-uploadId', 5, archivesUtilService.tost, function (obj) {
                        $scope.data.local.attachments.push({ fileName: obj.fileName, fileUrl: obj.uploadUrl });
                        $scope.$apply();
                    });
                }
            };

            // 监听isshow
            $scope.$watch('isshow', $scope.init);
            $scope.$watch('isedit', function () {
                if ($scope.isedit) {
                    $scope.methods.copyData();
                    $scope.methods.setDatepicker('#tab4-qdrq', 'signDate');
                    $scope.methods.setDatepicker('#tab4-htjzrq', 'endDate');
                }
            });
            $scope.$watch('issubmit', function () {
                if ($scope.issubmit) {
                    $scope.methods.getHtObject();
                }
            });
        }]
    };
});
// 档案详情-证件信息
angular.module('app').directive('tabContent5', function () {
    return {
        restrict: "E",
        scope: {
            isshow: '=',
            isedit: '=',
            id: '=',
            assetid: '='
        },
        templateUrl: 'src/app/archives/html/archives_searchdetail_tab_5.html',
        replace: true,
        transclude: false,
        controller: ["$scope", 'archivesDbService', 'archivesUtilService', function ($scope, archivesDbService, archivesUtilService) {
            $scope.data = {
                isInit: false,
                catalogs: [],
                currentCatalog: {},
                err: {}
            };

            $scope.methods = {
                // 新建证件
                addCatalog: function () {
                    $scope.methods.resetErr();
                    $scope.data.currentCatalog = {
                        archiveId: $scope.id,
                        assetsId: $scope.assetid,
                        imageUrl: null,
                        name: '',
                        certificateType: 5,
                        certificateNum: null,
                        validDate: null,
                        certificateRegisterNum: null,
                        expireTime: null,
                        productDate: null
                    };
                    archivesUtilService.openDialog("新增证件", $("#tab5_modal_content_form"), ["600px", "450px"], null, function (index) {
                        if ($scope.methods.checkParam()) {
                            var param = $scope.data.currentCatalog;
                            archivesDbService.insertOrUpdateCertificateInfo(param, function (json) {
                                $scope.methods.getCertificate();
                                archivesUtilService.tost("提交成功！");
                                layer.close(index);
                            });
                        }
                    }, null, function () {
                        setTimeout($scope.methods.setDatepicker, 300);
                    });
                },
                // 编辑证件
                editCatalog: function (obj) {
                    $scope.data.currentCatalog = {
                        id: obj.id,
                        archiveId: $scope.id,
                        assetsId: $scope.assetid,
                        imageUrl: obj.imageUrl,
                        name: obj.name,
                        certificateType: obj.certificateType,
                        certificateNum: obj.certificateNum,
                        validDate: obj.validDate,
                        certificateRegisterNum: obj.certificateRegisterNum,
                        expireTime: obj.expireTime,
                        productDate: obj.productDate
                    };
                    $scope.methods.resetErr();
                    archivesUtilService.openDialog("编辑证件", $("#tab5_modal_content_form"), ["600px", "450px"], null, function (index) {
                        if ($scope.methods.checkParam()) {
                            var param = $scope.data.currentCatalog;
                            archivesDbService.insertOrUpdateCertificateInfo(param, function (json) {
                                $scope.methods.getCertificate();
                                archivesUtilService.tost("编辑成功！");
                                layer.close(index);
                            });
                        }
                    }, null, function () {
                        setTimeout($scope.methods.setDatepicker, 300);
                    });
                },
                // 删除证件
                removeCatalog: function (obj) {
                    archivesUtilService.openDialog('提示', $('#template_delete'), ['480px', '230px'], null, function (index) {
                        archivesDbService.deleteCertificateInfo(obj.id, function () {
                            archivesUtilService.tost('删除成功！');
                            $scope.methods.getCertificate();
                            layer.close(index);
                        });
                    });
                },
                // 上传证件图片
                uploadFile: function () {
                    angular.element('#tab5-uploadId').click();
                },
                // 删除证件图片
                removeImg: function () {
                    $scope.data.currentCatalog.imageUrl = null;
                },
                // 错误信息重置
                resetErr: function () {
                    $scope.data.err = {
                        name: '',
                        file: ''
                    };
                },
                // 移除指定错误信息
                removeErr: function (key) {
                    $scope.data.err[key] = '';
                },
                // 必填字段校验
                checkParam: function () {
                    var result = true;
                    if ($scope.data.currentCatalog.name == '') {
                        $scope.data.err.name = '请输入证件名称';
                        result = false;
                    }
                    if (!$scope.data.currentCatalog.imageUrl) {
                        $scope.data.err.file = '请上传图片';
                        result = false;
                    }
                    $scope.$apply();
                    return result;
                },
                // 获取证件列表
                getCertificate: function () {
                    archivesDbService.getCertificate({ archiveId: $scope.id, assetsId: $scope.assetid }, function (json) {
                        if (json.length > 0) {
                            for (var i = 0, len = json.length; i < len; i++) {
                                json[i].isSelf = json[i].certificateType > 4;
                            }
                        }
                        $scope.data.catalogs = json;
                        $scope.$apply();
                    });
                },
                setDatepicker: function () {
                    var val = '';
                    var dt = $scope.data.currentCatalog.validDate;
                    if ($scope.data.currentCatalog.certificateType == 4) {
                        dt = $scope.data.currentCatalog.productDate;
                    }
                    if (dt && (dt + '').length > 0) {
                        dt = new Date(dt);
                        val = dt.Format("yyyy-MM-dd");
                    } else {
                        dt = new Date();
                    }
                    $('#tab5-file-date').val(val);
                    archivesUtilService.setDatepicker('#tab5-file-date', dt, null, null, null, function (b) {
                        if ($scope.data.currentCatalog.certificateType == 4) {
                            $scope.data.currentCatalog.productDate = new Date(b.startDate).getTime();
                        } else {
                            $scope.data.currentCatalog.validDate = new Date(b.startDate).getTime();
                        }
                    });
                }
            };

            $scope.init = function () {
                if ($scope.isshow && !$scope.data.isInit) {
                    $scope.data.isInit = true;
                    // 获取证件列表
                    $scope.methods.getCertificate();
                    // 证件图片上传
                    archivesUtilService.bindUploadEvent('#tab5-uploadId', 2, archivesUtilService.tost, function (obj) {
                        $scope.data.currentCatalog.imageUrl = obj.uploadUrl;
                        $scope.methods.removeErr('file');
                        $scope.$apply();
                    }, function (file) {
                        if (file.type.split('/')[0] != 'image') {
                            archivesUtilService.tost("选择文件格式有误，请重新选择！");
                            return false;
                        }
                        return true;
                    });
                }
            };

            $scope.$watch('isshow', $scope.init);
        }]
    };
});
// 档案详情-文件管理
angular.module('app').directive('tabContent6', function () {
    return {
        restrict: "E",
        scope: {
            isshow: '=',
            isedit: '=',
            id: '=',
            assetid: '='
        },
        templateUrl: 'src/app/archives/html/archives_searchdetail_tab_6.html',
        replace: true,
        transclude: false,
        controller: ["$scope", 'archivesDbService', 'archivesUtilService', function ($scope, archivesDbService, archivesUtilService) {
            $scope.data = {
                isInit: false,
                catalogs: [],
                currentCatalog: {},
                err: {}
            };

            $scope.methods = {
                // 新建文件
                addCatalog: function () {
                    $scope.methods.resetErr();
                    $scope.data.currentCatalog = {
                        name: '',
                        createTime: '',
                        files: []
                    };
                    $scope.methods.setDatepicker(new Date(), false);
                    archivesUtilService.openDialog("新增文件", $("#tab6_modal_content_form"), ["600px", "450px"], null, function (index) {
                        if ($scope.methods.checkParam()) {
                            var param = $scope.methods.getParam();
                            archivesDbService.addFolder(param, function (json) {
                                $scope.methods.getFiles();
                                archivesUtilService.tost('新增成功！');
                                layer.close(index);
                            });
                        }
                    }, null, function () {
                        setTimeout(function () { $scope.$apply() }, 50);
                    });
                },
                // 编辑文件
                editCatalog: function (obj) {
                    $scope.methods.resetErr();
                    archivesDbService.getFolderDetail({ id: obj.id }, function (json) {
                        $scope.data.currentCatalog = {
                            id: obj.id,
                            name: json.folderName,
                            createTime: json.folderDate,
                            files: json.attachment
                        };
                        $scope.methods.setDatepicker(new Date(json.folderDate), true);
                        $scope.$apply();
                        archivesUtilService.openDialog("编辑文件", $("#tab6_modal_content_form"), ["600px", "450px"], null, function (index) {
                            if ($scope.methods.checkParam()) {
                                var param = $scope.methods.getParam();
                                param.id = $scope.data.currentCatalog.id;
                                archivesDbService.editFolder(param, function () {
                                    $scope.methods.getFiles();
                                    archivesUtilService.tost('编辑成功！');
                                    layer.close(index);
                                });
                            }
                        }, null, function () {
                            setTimeout(function () { $scope.$apply() }, 50);
                        });
                    });
                },
                getParam: function () {
                    return {
                        "archiveId": +$scope.id,
                        "assetsId": +$scope.assetid,
                        "attachments": $scope.data.currentCatalog.files,
                        "folderDate": $scope.data.currentCatalog.createTime,
                        "folderName": $scope.data.currentCatalog.name
                    };
                },
                // 查看文件
                browseCatalog: function (obj) {
                    archivesDbService.getFolderDetail({ id: obj.id }, function (json) {
                        $scope.data.currentCatalog = json;
                        $scope.$apply();
                        archivesUtilService.openDialog("查看文件", $("#tab6_modal_content_browse"), ["500px", "400px"], ['确定'], function (index) {
                            layer.close(index);
                        });
                    });
                },
                // 删除证件
                removeCatalog: function (obj) {
                    archivesUtilService.openDialog('提示', $('#template_delete_file'), ['480px', '230px'], null, function (index) {
                        archivesDbService.deleteFolder(obj.id, function () {
                            archivesUtilService.tost('删除成功！');
                            $scope.methods.getFiles();
                            layer.close(index);
                        });
                    });
                },
                // 删除文件附件
                removeFile: function (index) {
                    $scope.data.currentCatalog.files.splice(index, 1);
                },
                // 上传文件附件
                uploadFile: function () {
                    angular.element('#tab6-uploadId').click();
                },
                // 错误信息重置
                resetErr: function () {
                    $scope.data.err = {
                        name: '',
                        time: '',
                        file: ''
                    };
                },
                // 移除指定错误信息
                removeErr: function (key) {
                    $scope.data.err[key] = '';
                },
                // 必填字段校验
                checkParam: function () {
                    var result = true;
                    if ($scope.data.currentCatalog.name == '') {
                        $scope.data.err.name = '请输入文件名称';
                        result = false;
                    }
                    if (($scope.data.currentCatalog.createTime + '').length < 1) {
                        $scope.data.err.time = '请选择文件日期';
                        result = false;
                    }
                    if ($scope.data.currentCatalog.files.length < 1) {
                        $scope.data.err.file = '请上传文件附件';
                        result = false;
                    }
                    $scope.$apply();
                    return result;
                },
                getFiles: function () {
                    archivesDbService.getFiles({ archiveId: $scope.id, assetsId: $scope.assetid }, function (json) {
                        $scope.data.catalogs = json;
                        $scope.$apply();
                    });
                },
                setDatepicker: function (dt, isFill) {
                    var st = new Date(dt.Format("yyyy-MM-dd") + " 00:00:00");
                    $('#tab6-file-date').val(isFill ? dt.Format("yyyy-MM-dd") : '');
                    archivesUtilService.setDatepicker('#tab6-file-date', st, null, null, null, function (b) {
                        $scope.data.currentCatalog.createTime = new Date(b.startDate).getTime();
                        $scope.methods.removeErr('time');
                        $scope.$apply();
                    });
                }
            };

            // 指令初始化
            $scope.init = function () {
                if ($scope.isshow && !$scope.data.isInit) {
                    $scope.data.isInit = true;
                    // 获取文件列表
                    $scope.methods.getFiles();
                    // 文件上传
                    archivesUtilService.bindUploadEvent('#tab6-uploadId', 5, archivesUtilService.tost, function (obj) {
                        $scope.data.currentCatalog.files.push({ fileName: obj.fileName, fileUrl: obj.uploadUrl });
                        $scope.methods.removeErr('file');
                        $scope.$apply();
                    });
                }
            };

            // 监听isshow
            $scope.$watch('isshow', $scope.init);
        }]
    };
});
// 档案详情-维修记录
angular.module('app').directive('tabContent7', function () {
    return {
        restrict: "E",
        scope: {
            isshow: '=',
            isedit: '=',
            id: '='
        },
        templateUrl: 'src/app/archives/html/archives_searchdetail_tab_7.html',
        replace: true,
        transclude: false,
        controller: ["$rootScope", "$scope", "$timeout", 'archivesDbService', 'archivesUtilService', function ($rootScope, $scope, $timeout, archivesDbService, archivesUtilService) {
            $scope.data = {
                server: {
                    list: []
                },
                local: {
                    typeOptions: [
                        { id: 0, name: '全部类型' },
                        { id: 1, name: '自主维修' },
                        { id: 2, name: '外修' },
                        { id: 3, name: '现场解决' }
                    ],
                    keyword: '',
                    currentType: { id: 0, name: '全部类型' }
                },
                isInit: false,
                loading: true,
                empty: false
            };

            // 分页数据
            $scope.pageInfo = {
                pages: 0,
                total: 0,
                size: 16,
                current: 1,
                pstyle: 2
            };

            // 分页事件
            $scope.pagination = function (page, pageSize) {
                $scope.pageInfo.size = pageSize;
                $scope.methods.getWxList(page, pageSize);
            }

            $scope.methods = {
                changeType: function (item) {
                    $scope.data.local.currentType = item;
                    $scope.methods.search();
                },
                search: function () {
                    $scope.methods.getWxList(1, $scope.pageInfo.size);
                },
                getWxList: function (pageNo, pageSize) {
                    var param = {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        assetsId: $scope.id
                    };
                    if ($scope.data.local.currentType.id > 0) {
                        param.modeStatus = $scope.data.local.currentType.id;
                    }
                    if ($scope.data.local.keyword.length > 0) {
                        param.applyNo = archivesUtilService.myTrim($scope.data.local.keyword);
                    }
                    $scope.data.server.list = [];
                    $scope.data.loading = true;
                    archivesDbService.getWxList(param, function (json) {
                        $scope.data.loading = false;
                        $scope.data.server.list = json.records;
                        $scope.pageInfo.current = pageNo;
                        $scope.pageInfo.total = json.total;
                        $scope.data.empty = json.records.length < 1;
                        $scope.$apply();
                    });
                },
                getServerData: function (url, fun) {
                    $.ajax({
                        type: "get",
                        url: url,
                        complete: function (res) {
                            if (res.responseJSON.code == 200) {
                                fun(res.responseJSON.data);
                            } else {
                                var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
                                    area: ['100%', '60px'],
                                    time: 3000,
                                    offset: 'b',
                                    shadeClose: true,
                                    shade: 0
                                });
                            }
                        }
                    });
                },
                disPrint: function (a) {
                    $scope.methods.getServerData("/newrepair/repRepairApply/getApplyDetails/" + a.applyId, function (repairList) {
                        $scope.methods.getServerData("/newrepair/repRepairApply/search/" + a.applyId, function (data) {
                            $scope.assetsInfo = data;
                            $scope.methods.getServerData("/newrepair/repRepairReport/search/" + a.applyId, function (data2) {
                                // $scope.repairReportInfo = data2;
                                var attachment = data2.attachment ? JSON.parse(data2.attachment) : [];

                                for (var i = 0; i < attachment.length; i++) {
                                    attachment[i].imgUrlEn = encodeURI(encodeURI(attachment[i].uploadUrl));
                                };
                                $scope.repairReportInfo = {
                                    repairInfo: {
                                        name: '',
                                        tel: data.reportRepairPhone,
                                        time: '',
                                        num: data.applyNo,
                                        currentTime: repairList.repairDate
                                    },
                                    repairList: repairList,

                                    outsideCompany: data2.outsideCompany, // 外修单位
                                    outsidePhone: data2.outsidePhone,  // 外修单位联系电话
                                    engineerName: data2.engineerName, // 工程师姓名
                                    engineerNum: data2.engineerNum, // 工程师工号

                                    reportStatus: data2.reportStatus, // 维修内容-接单类型
                                    sendPerson: data2.sendPerson, // 维修内容-接单类型-送修-送修人
                                    sendPhone: data2.sendPhone, // 维修内容-接单类型-送修-送修人电话
                                    addphenom: $scope.listToObj(data2.faultPhenomenonList), // 维修内容-故障现象
                                    troubleCode: data2.troubleCode, // 维修内容-故障代码
                                    addReason: $scope.listToObj(data2.faultReasonList), // 维修内容-故障原因
                                    addWork: $scope.listToObj(data2.workContentList), // 维修内容-工作内容

                                    partListHad: data2.list.length > 0, // 是否显示配件
                                    partList: data2.list, // 维修配件

                                    repairResultSwitch: {
                                        '1': '正常工作',
                                        '2': '基本功能正常',
                                        '3': '需进一步修理',
                                        '4': '需外送修理',
                                        '5': '无法修复',
                                        '6': '其他'
                                    }[data2.repairResult] || '', // 维修结果-维修后状态
                                    repairDate1: data.reportRepairDate, // 维修结果-维修周期-申请时间
                                    repairTrue1: repairList.takeOrderTime, // 维修结果-维修周期-接单时间
                                    repairTrue2: data2.actualEndDate, // 维修结果-维修周期-维修时间
                                    repairDate2: data2.repairEndDate, // 维修结果-维修周期-接单时间
                                    callRepairDate: data2.callRepairDate, // 维修结果-维修周期-叫修时间
                                    arrivalDate: data2.arrivalDate, // 维修结果-维修周期-到达时间
                                    leaveDate: data2.leaveDate, // 维修结果-维修周期-离开时间
                                    repairHours: data2.repairHours, // 维修结果-维修周期-维修工时
                                    repairCost: data2.repairCost, // 维修结果-费用总计-维修费
                                    materiaCost: data2.partsCost, // 维修结果-费用总计-材料费
                                    totalCost: data2.totalCost, // 维修结果-费用总计-合计
                                    remark: data2.remarks, // 维修结果-备注
                                    attachment: attachment, // 维修结果-附件

                                    reportPrint: false, // 是否打印中

                                    printPower: true // 是否显示打印按钮
                                };
                                $scope.radio = {
                                    radioV: data2.modeStatus,
                                    radioS: data2.faultType // 维修内容-工作性质
                                };

                                layer.open({
                                    time: 0
                                    , type: 1
                                    , content: $('#PreRepairReportBill')
                                    , title: ['打印维修报告单', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                                    , closeBtn: 1
                                    , shade: 0.3
                                    , shadeClose: true
                                    , btn: 0
                                    , area: ['1104px', '562px']
                                    , success: function () {
                                        $scope.$apply();
                                    }
                                });
                            });
                        });
                    });
                }
            };

            $scope.init = function () {
                if ($scope.isshow && !$scope.data.isInit) {
                    $scope.data.isInit = true;
                    // 获取维修列表
                    $scope.methods.search();
                }
            };

            $scope.$watch('isshow', $scope.init);

            // 维修报告单
            $scope.usualRepairPrint = function (a) {
                $scope.repairReportInfo.reportPrint = true;
                setTimeout(function () {
                    $('#fy_repairReportBillCon').jqprint();
                    $scope.repairReportInfo.reportPrint = false;
                }, 100);
            }
            $scope.usualLayerClose = function () {
                layer.closeAll();
            };

            $scope.listToObj = function (a) {
                if (a) {
                    return a.join("；");
                }
                return '';
            }
        }]
    };
});
angular.module('app').directive('archivesRepairReportBill', function () {
    return {
        restrict: "E",
        scope: {
            assetsInfo: '=', // 设备信息
            repairObj: '=', // 维修内容
            radio: '=', // 单选内容
            userInfo: '=', // 用户信息
            repairResultSwitch: '=', // 维修结果
            usualRepairPrint: '=', // 打印按钮
            usualLayerClose: '=', // 关闭弹框
            arrToString1: '=' // 维修内容拼接
        },
        templateUrl: 'src/tpl/repairReportBillTp.html',
        replace: true, // 使用模板替换原始标记 
        transclude: false, // 不复制原始HTML内容 
        controller: ["$scope", function ($scope) {

        }]
    };
})
// 档案详情-转科记录
angular.module('app').directive('tabContent8', function () {
    return {
        restrict: "E",
        scope: {
            isshow: '=',
            isedit: '=',
            id: '='
        },
        templateUrl: 'src/app/archives/html/archives_searchdetail_tab_8.html',
        replace: true,
        transclude: false,
        controller: ["$scope", 'archivesDbService', 'archivesUtilService', function ($scope, archivesDbService, archivesUtilService) {
            $scope.data = {
                server: {
                    list: []
                },
                local: {
                    keyword: '',
                    rangeStart: '',
                    rangeEnd: ''
                },
                print: {}, // 报告单数据
                isInit: false,
                loading: true,
                empty: false
            };

            // 分页数据
            $scope.pageInfo = {
                pages: 0,
                total: 0,
                size: 16,
                current: 1,
                pstyle: 2
            };

            // 分页事件
            $scope.pagination = function (page, pageSize) {
                $scope.pageInfo.size = pageSize;
                $scope.methods.getAssets(page, pageSize);
            }

            $scope.methods = {
                changeType: function (item) {
                    $scope.data.local.currentType = item;
                    $scope.methods.search();
                },
                search: function () {
                    $scope.methods.getZkList(1, $scope.pageInfo.size);
                },
                getZkList: function (pageNo, pageSize) {
                    var param = {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        assetId: $scope.id
                    };
                    if ($scope.data.local.keyword.length > 0) {
                        param.keyword = archivesUtilService.myTrim($scope.data.local.keyword);
                    }
                    if (($scope.data.local.rangeStart + '').length > 0) {
                        param.startDate = new Date($scope.data.local.rangeStart).Format("yyyy-MM-dd") + " 00:00:00";
                    }
                    if (($scope.data.local.rangeEnd + '').length > 0) {
                        param.endDate = new Date($scope.data.local.rangeEnd).Format("yyyy-MM-dd") + " 23:59:59";
                    }
                    $scope.data.server.list = [];
                    $scope.data.loading = true;
                    archivesDbService.getZkList(param, function (json) {
                        $scope.data.loading = false;
                        $scope.data.server.list = json.records;
                        $scope.pageInfo.current = pageNo;
                        $scope.pageInfo.total = json.total;
                        $scope.data.empty = json.records.length < 1;
                        $scope.$apply();
                    });
                },
                disPrint: function (id) {
                    archivesDbService.getZkPrint(id, function (data) {
                        $scope.data.print = data;
                        archivesUtilService.openDialog('打印预览', $('#template_print_archives'), ['1000px', '600px'], ['打印', '关闭'], function () {
                            $("#template_print_archives").jqprint();
                        }, null, function () {
                            $scope.$apply();
                        });
                    });
                }
            };

            $scope.init = function () {
                if ($scope.isshow && !$scope.data.isInit) {
                    $scope.data.isInit = true;
                    // 获取转科列表
                    $scope.methods.search();
                    // 日历初始化
                    setStartDatepicker(null, null, null, null);
                    setEndDatepicker(null, null, null, null);
                }
            };

            // 方法
            function setStartDatepicker(min, max, st, en) {
                archivesUtilService.setDatepicker('#tab8-range-start', st, en, min, max, function (b) {
                    $scope.data.local.rangeStart = new Date(b.startDate).getTime();
                    setEndDatepicker(new Date(b.startDate), new Date("2050-01-01"));
                });
            }

            function setEndDatepicker(min, max, st, en) {
                archivesUtilService.setDatepicker('#tab8-range-end', st, en, min, max, function (b) {
                    $scope.data.local.rangeEnd = new Date(b.startDate).getTime();
                    setStartDatepicker(null, new Date(b.startDate));
                });
            }

            $scope.$watch('isshow', $scope.init);
        }]
    };
});
angular.module('app').directive('archivesBrowsePrint', function () {
    return {
        restrict: "E",
        scope: {
            title: "@",
            title2: "@",
            title3: "@",
            iszk: "=",
            obj: "="
        },
        templateUrl: 'src/app/tre/zkgl/template/print.html',
        replace: true,
        transclude: false,
        controller: ["$scope", function ($scope) {

        }]
    };
});
// 档案详情-报损记录
angular.module('app').directive('tabContent9', function () {
    return {
        restrict: "E",
        scope: {
            isshow: '=',
            isedit: '=',
            id: '='
        },
        templateUrl: 'src/app/archives/html/archives_searchdetail_tab_9.html',
        replace: true,
        transclude: false,
        controller: ["$scope", "archivesDbService", "archivesUtilService", function ($scope, archivesDbService, archivesUtilService) {
            $scope.data = {
                server: {
                    list: [],
                    bsPrint: {}
                },
                isInit: false
            };

            $scope.methods = {
                getBsPrint: function (billId) {
                    archivesDbService.getBsPrint(billId, function (data) {
                        $scope.data.server.bsPrint = data;
                        archivesUtilService.openDialog('打印预览', $('#template_bs_print'), ['1000px', '600px'], ['打印', '关闭'], function (index) {
                            $("#template_bs_print").jqprint();

                        }, null, function () {
                            $scope.$apply();
                        });
                    });
                }
            };

            $scope.init = function () {
                if ($scope.isshow && !$scope.data.isInit) {
                    $scope.data.isInit = true;
                    archivesDbService.getBsList({ assetId: $scope.id }, function (json) {
                        $scope.data.server.list = json.records;
                        $scope.$apply();
                    });
                }
            };

            $scope.$watch('isshow', $scope.init);
        }]
    };
});
// 档案详情-报损记录-报损报告
angular.module('app').directive('browsePrint', function () {
    return {
        restrict: "E",
        scope: {
            title: "@",
            title2: "@",
            title3: "@",
            iszk: "=",
            obj: "="
        },
        templateUrl: 'src/app/tre/zkgl/template/print.html',
        replace: true,
        transclude: false,
        controller: ["$scope", function ($scope) {

        }]
    };
});