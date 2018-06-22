angular.module('app')
    .controller('archivesListController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'archivesDbService', 'archivesUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, archivesDbService, archivesUtilService) {
        $scope.$parent.checkLimit('list', function () {
            var dt = new Date();
            dt.setDate(dt.getDate() - 29);
            $scope.data = {
                server: {
                    list: [],
                    report: {}
                },
                local: {
                    timeOptions: [
                        { id: 1, name: '永久' },
                        { id: 2, name: '长期（16~50年）' },
                        { id: 3, name: '短期（15年以下）' }
                    ],
                    typeOptions: [
                        { id: 1, name: '公开级' },
                        { id: 2, name: '内部级' },
                        { id: 3, name: '秘密级' },
                        { id: 4, name: '机密级' },
                        { id: 5, name: '绝密级' }
                    ],
                    typeOptionsSearch: [],
                    keyword: '',
                    nextDateStart: dt.getTime(),
                    nextDateEnd: (new Date()).getTime(),
                    currentType: { id: 0, name: '请选择' },
                    archives: {},
                    err: {},
                    modalAddShow: false, // 显示或隐藏新建对话框
                    modalEditShow: false // 显示或隐藏编辑对话框
                },
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
                    $scope.methods.getAssets(1, $scope.pageInfo.size);
                },
                displayAddModal: function () {
                    $scope.data.local.archives = {
                        equ: { assetId: 0 },
                        name: '',
                        qixian: { id: 1, name: '永久' },
                        miji: { id: 0, name: '请选择' },
                        ljr: '',
                        ljrq: '',
                        jcr: '',
                        jcrq: '',
                        rangeStart: '',
                        rangeEnd: '',
                        ljdw: ''
                    };
                    $scope.methods.resetErr();
                    $scope.data.local.modalAddShow = true;
                    archivesUtilService.openDialog('新增档案', $('#template_archives_add'), ['1000px', '630px'], null, function (index) {
                        if ($scope.methods.checkParam()) {
                            var param = $scope.methods.getParam();
                            archivesDbService.addArchive(param, function () {
                                archivesUtilService.tost("新增成功！");
                                layer.close(index);
                                $scope.methods.search();
                            });
                        } else {
                            $scope.$apply();
                        }
                    }, function () {
                        $scope.data.local.modalAddShow = false;
                        $scope.$apply();
                    });
                },
                displayEditModal: function (obj) {
                    archivesDbService.preEditArchive(obj.id, function (json) {
                        $scope.data.local.archives = {
                            equ: {
                                assetId: json.assetId,
                                assetsName: json.assetsName,
                                deptName: json.deptName,
                                assetsNum: json.assetsNum,
                                factoryNum: json.factoryNum
                            },
                            name: json.archiveName,
                            qixian: archivesUtilService.getCurrentOption($scope.data.local.timeOptions, json.limitStorageTime),
                            miji: archivesUtilService.getCurrentOption($scope.data.local.typeOptions, json.secretLevel),
                            ljr: json.filingUserName,
                            ljrq: json.filingTime,
                            jcr: json.checkUserName,
                            jcrq: json.checkTime,
                            rangeStart: json.startTime,
                            rangeEnd: json.endTime,
                            ljdw: json.filingDepartment
                        };
                        $scope.methods.resetErr();
                        $scope.data.local.modalEditShow = true;
                        $scope.$apply();
                        archivesUtilService.openDialog('编辑档案', $('#template_archives_edit'), ['1000px', '630px'], null, function (index) {
                            if ($scope.methods.checkParam()) {
                                var param = $scope.methods.getParam();
                                param.id = obj.id;
                                archivesDbService.editArchive(param, function (json) {
                                    archivesUtilService.tost("编辑成功！");
                                    layer.close(index);
                                    $scope.methods.search();
                                })
                            } else {
                                $scope.$apply();
                            }
                        }, function () {
                            $scope.data.local.modalEditShow = false;
                            $scope.$apply();
                        });
                    });
                },
                getParam: function () {
                    return {
                        "archiveName": $scope.data.local.archives.name,
                        "assetsId": $scope.data.local.archives.equ.assetId,
                        "checkTime": $scope.data.local.archives.jcrq,
                        "checkUserName": $scope.data.local.archives.jcr,
                        "endTime": $scope.data.local.archives.rangeEnd,
                        "filingDepartment": $scope.data.local.archives.ljdw,
                        "filingTime": $scope.data.local.archives.ljrq,
                        "filingUserName": $scope.data.local.archives.ljr,
                        "limitStorageTime": $scope.data.local.archives.qixian.id,
                        "secretLevel": $scope.data.local.archives.miji.id,
                        "startTime": $scope.data.local.archives.rangeStart
                    };
                },
                resetErr: function () {
                    $scope.data.local.err = {
                        equ: '',
                        name: '',
                        miji: '',
                        ljr: '',
                        ljrq: '',
                        jcr: '',
                        jcrq: '',
                        range: '',
                        ljdw: ''
                    };
                },
                removeErr: function (key) {
                    $scope.data.local.err[key] = '';
                },
                checkParam: function () {
                    var result = true;
                    if ($scope.data.local.archives.equ.assetId < 1) {
                        result = false;
                        $scope.data.local.err.equ = '请选择设备';
                    }
                    if ($scope.data.local.archives.name.length < 1) {
                        result = false;
                        $scope.data.local.err.name = '请输入档案名称';
                    }
                    if ($scope.data.local.archives.miji.id < 1) {
                        result = false;
                        $scope.data.local.err.miji = '请选择保密级';
                    }
                    if ($scope.data.local.archives.ljr.length < 1) {
                        result = false;
                        $scope.data.local.err.ljr = '请输入立卷人';
                    }
                    if (($scope.data.local.archives.ljrq + '').length < 1) {
                        result = false;
                        $scope.data.local.err.ljrq = '请选择立卷日期';
                    }
                    if ($scope.data.local.archives.jcr.length < 1) {
                        result = false;
                        $scope.data.local.err.jcr = '请输入检查人';
                    }
                    if (($scope.data.local.archives.jcrq + '').length < 1) {
                        result = false;
                        $scope.data.local.err.jcrq = '请选择检查日期';
                    }
                    if (($scope.data.local.archives.rangeStart + '').length < 1
                        || ($scope.data.local.archives.rangeEnd + '').length < 1) {
                        result = false;
                        $scope.data.local.err.range = '请选择起止日期';
                    }
                    if ($scope.data.local.archives.ljdw.length < 1) {
                        result = false;
                        $scope.data.local.err.ljdw = '请输入立卷单位';
                    }
                    return result;
                },
                search: function () {
                    $scope.methods.getAssets(1, $scope.pageInfo.size);
                },
                // 档案查询
                getAssets: function (pageNo, pageSize) {
                    var param = {
                        pageNo: pageNo,
                        pageSize: pageSize,
                    };
                    if ($scope.data.local.currentType.id > 0) {
                        param.secretLevel = $scope.data.local.currentType.id;
                    }
                    if ($scope.data.local.keyword.length > 0) {
                        param.keyword = archivesUtilService.myTrim($scope.data.local.keyword);
                    }
                    if (($scope.data.local.nextDateStart + '').length > 0) {
                        param.filingTimeStart = new Date($scope.data.local.nextDateStart).Format("yyyy-MM-dd") + " 00:00:00";
                    }
                    if (($scope.data.local.nextDateEnd + '').length > 0) {
                        param.filingTimeEnd = new Date($scope.data.local.nextDateEnd).Format("yyyy-MM-dd") + " 23:59:59";
                    }
                    $scope.data.server.list = [];
                    $scope.data.loading = true;
                    archivesDbService.getArchives(param, function (json) {
                        $scope.data.loading = false;
                        $scope.data.server.list = json.records;
                        $scope.pageInfo.current = pageNo;
                        $scope.pageInfo.total = json.total;
                        $scope.data.empty = json.records.length < 1;
                        $scope.$apply();
                    });
                }
            };

            $scope.init = function () {
                $scope.data.local.typeOptionsSearch = [{id: 0, name: '请选择'}].concat($scope.data.local.typeOptions);
                $scope.methods.search();
                setTimeout(function () {
                    var st = new Date(new Date($scope.data.local.nextDateStart).Format("yyyy-MM-dd") + " 00:00:00");
                    var en = new Date(new Date($scope.data.local.nextDateEnd).Format("yyyy-MM-dd") + " 00:00:00");
                    setStartDatepicker(null, en, st, null);
                    setEndDatepicker(st, null, en, null);
                }, 100);
            };

            $scope.init();

            function setStartDatepicker(min, max, st, en) {
                archivesUtilService.setDatepicker('#nextDateStart', st, en, min, max, function (b) {
                    $scope.data.local.nextDateStart = new Date(b.startDate).getTime();
                    setEndDatepicker(new Date(b.startDate), new Date("2050-01-01"));
                });
            }

            function setEndDatepicker(min, max, st, en) {
                archivesUtilService.setDatepicker('#nextDateEnd', st, en, min, max, function (b) {
                    $scope.data.local.nextDateEnd = new Date(b.startDate).getTime();
                    setStartDatepicker(null, new Date(b.startDate));
                });
            }
        })
    }]);