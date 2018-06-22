angular.module('app')
    .controller('meteringAssetsController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'meteringDbService', 'meteringUtilService', function ($rootScope, $scope, $stateParams, $localStorage, $state, meteringDbService, meteringUtilService) {
        $scope.$parent.checkLimit('assets', function () {
            $scope.data = {
                server: {
                    list: []
                },
                local: {
                    statusOptions: [
                        { id: 0, name: '全部' },
                        { id: 1, name: '待完善' },
                        { id: 2, name: '已完善' }
                    ],
                    typeOptions: [
                        { id: 0, name: '全部类别' },
                        { id: 1, name: '非强制性计量设备' },
                        { id: 2, name: '强制性计量设备' }
                    ],
                    departOptions: [{ id: 0, name: '选择部门' }],
                    methodOptions: [
                        { id: 1, name: '院内' },
                        { id: 2, name: '外包' }
                    ],
                    leibieOptions: [
                        { id: 0, name: '请选择' },
                        { id: 1, name: 'A 类计量设备' },
                        { id: 2, name: 'B 类计量设备' },
                        { id: 3, name: 'C 类计量设备' }
                    ],
                    fenleiOptions: [
                        { id: 0, name: '请选择' },
                        { id: 1, name: '放射计量' },
                        { id: 2, name: '电磁学计量' },
                        { id: 3, name: '热力学计量' },
                        { id: 4, name: '生物化学计量' },
                        { id: 5, name: '光学计量' },
                        { id: 6, name: '激光计量' },
                        { id: 7, name: '超声学计量' }
                    ],
                    userOptions: [{ id: 0, name: '请选择' }],
                    assetsStatusOptions: [
                        { id: 2, name: '在用' },
                        { id: 1, name: '在库' },
                        { id: 3, name: '预登' }
                    ],
                    keyword: '',
                    nextDateStart: '',
                    nextDateEnd: '',
                    currentStatu: { id: 0, name: '全部' },
                    currentType: { id: 0, name: '全部类别' },
                    currentDepart: { id: 0, name: '选择部门' },
                    newAssets: {},
                    editAssets: {}
                },
                loading: true,
                empty: false
            };
            // 分页数据
            $scope.pageInfo = {
                pages: 0,
                total: 0,
                size: 8,
                current: 1,
                pstyle: 2
            };

            // 分页事件
            $scope.pagination = function (page, pageSize) {
                $scope.pageInfo.size = pageSize;
                $scope.methods.getAssets(page, pageSize);
            }

            $scope.methods = {
                changeStatu: function (item) {
                    $scope.data.local.currentStatu = item;
                    $scope.methods.getAssets(1, $scope.pageInfo.size);
                },
                changeType: function (item) {
                    $scope.data.local.currentType = item;
                    $scope.methods.getAssets(1, $scope.pageInfo.size);
                },
                changeDepart: function (item) {
                    $scope.data.local.currentDepart = item;
                    $scope.methods.getAssets(1, $scope.pageInfo.size);
                },
                search: function () {
                    $scope.methods.getAssets(1, $scope.pageInfo.size);
                },
                addAssets: function () {
                    $scope.data.local.newAssets = { // 新建非固定资产计量台账
                        currentDepart: { id: 0, name: '选择部门' },
                        currentStatus: { id: 2, name: '在用' },
                        assetsName: '',
                        scs: '',
                        model: '',
                        num: '',
                        sn: '',
                        startDate: '',
                        gys: '',
                        jlgl: '1',
                        currentLeibie: { id: 0, name: '请选择' },
                        currentFenlei: { id: 0, name: '请选择' },
                        cycle: '',
                        nextDate: '',
                        currentMethod: { id: 1, name: '院内' },
                        currentUser: { id: 0, name: '请选择' },
                        remark: '',
                        err: ''
                    };
                    $scope.methods.setDatepicker('#modalStartDate', new Date(), false, 'newAssets', 'startDate');
                    $scope.methods.setDatepicker('#modalNextDate', new Date(), false, 'newAssets', 'nextDate', $scope.methods.removeAddErr);
                    meteringUtilService.openDialog("新建非固定资产台账", $("#template_add_assets"), ['800px', '650px'], null, function (index) {
                        if ($scope.methods.checkParam($scope.data.local.newAssets.currentDepart.id > 0, "newAssets", "请选择所在部门")
                            && $scope.methods.checkParam($scope.data.local.newAssets.assetsName.length > 0, "newAssets", "请输入设备名称")
                            && $scope.methods.checkParam($scope.data.local.newAssets.scs.length > 0, "newAssets", "请输入生产商")
                            && $scope.methods.checkParam($scope.data.local.newAssets.currentLeibie.id > 0, "newAssets", "请选择计量类别")
                            && $scope.methods.checkParam($scope.data.local.newAssets.currentFenlei.id > 0, "newAssets", "请选择计量分类")
                            && $scope.methods.checkParam(($scope.data.local.newAssets.cycle + '').length > 0, "newAssets", "请输入计量周期")
                            && $scope.methods.checkParam(($scope.data.local.newAssets.nextDate + '').length > 0, "newAssets", "请选择下次检定日期")
                            && $scope.methods.checkParam($scope.data.local.newAssets.currentMethod.id > 0, "newAssets", "请选择检定方式")
                            && $scope.methods.checkParam($scope.data.local.newAssets.currentUser.id > 0, "newAssets", "请选择负责人")) {
                            var param = {
                                "assetsDeptId": +$scope.data.local.newAssets.currentDepart.id,
                                "assetsDeptName": $scope.data.local.newAssets.currentDepart.name,
                                "assetsName": $scope.data.local.newAssets.assetsName,
                                "assetsSpec": $scope.data.local.newAssets.model,
                                "assetsStatus": +$scope.data.local.newAssets.currentStatus.id,
                                "assetsType": 2,
                                "chargeUserId": +$scope.data.local.newAssets.currentUser.id,
                                "chargeUserName": $scope.data.local.newAssets.currentUser.name,
                                "checkMode": +$scope.data.local.newAssets.currentMethod.id,
                                "factoryName": $scope.data.local.newAssets.scs,
                                "measureCategory": +$scope.data.local.newAssets.currentFenlei.id,
                                "measureCycle": +$scope.data.local.newAssets.cycle,
                                "measureManageType": +$scope.data.local.newAssets.jlgl,
                                "measureType": +$scope.data.local.newAssets.currentLeibie.id,
                                "nextCheckTime": $scope.data.local.newAssets.nextDate,
                                "remarks": $scope.data.local.newAssets.remark,
                                "splName": $scope.data.local.newAssets.gys,
                                "status": 2,
                                "tenantId": $stateParams.tenantId || $localStorage.userInfo.tenantId,
                                "factoryNum": $scope.data.local.newAssets.sn,
                                "serialNum": $scope.data.local.newAssets.num
                            };
                            meteringDbService.addAssets(param, function (json) {
                                layer.close(index);
                                meteringUtilService.tost("保存成功");
                                $scope.methods.getAssets(1, $scope.pageInfo.size);
                            }, function (msg) {
                                $scope.data.local.newAssets.err = msg;
                                $scope.$apply();
                            });
                        }
                    }, null, function () {
                        setTimeout(function () {
                            $scope.$apply();
                        }, 50);
                    });
                },
                checkParam: function (flag, key, msg) {
                    if (!flag) {
                        $scope.data.local[key].err = msg;
                        $scope.$apply();
                    }
                    return flag;
                },
                changeModalDept: function (item) {
                    $scope.data.local.newAssets.currentDepart = item;
                    $scope.methods.removeAddErr();
                },
                changeModalStatus: function (item) {
                    $scope.data.local.newAssets.currentStatus = item;
                },
                changeModalLeibie: function (item) {
                    $scope.data.local.newAssets.currentLeibie = item;
                    $scope.methods.removeAddErr();
                },
                changeModalFenlei: function (item) {
                    $scope.data.local.newAssets.currentFenlei = item;
                    $scope.methods.removeAddErr();
                },
                changeModalMethod: function (item) {
                    $scope.data.local.newAssets.currentMethod = item;
                    $scope.methods.removeAddErr();
                },
                changeModalUser: function (item) {
                    $scope.data.local.newAssets.currentUser = item;
                    $scope.methods.removeAddErr();
                },
                removeAddErr: function () {
                    $scope.data.local.newAssets.err = '';
                },
                editAssets: function (obj) {
                    $scope.data.local.editAssets = { //计量台账编辑
                        id: obj.id,
                        jlgl: obj.measureManageType ? obj.measureManageType + '' : '1',
                        currentLeibie: getOption($scope.data.local.leibieOptions, obj.measureType), 
                        currentFenlei: getOption($scope.data.local.fenleiOptions, obj.measureCategory), 
                        cycle: obj.measureCycle || '',
                        nextDate: obj.nextCheckTime || '',
                        currentMethod: obj.checkMode ? getOption($scope.data.local.methodOptions, obj.checkMode) : { id: 1, name: '院内' }, 
                        currentUser: obj.chargeUserId > 0 ? { id: obj.chargeUserId, name: obj.chargeUserName } : { id: 0, name: '请选择' },
                        remark: obj.remarks || '',
                        err: ''
                    };
                    var st = new Date(),
                        isFill = false;
                    if(($scope.data.local.editAssets.nextDate + '').length > 0){
                        st = new Date($scope.data.local.editAssets.nextDate);
                        isFill = true;
                    }
                    $scope.methods.setDatepicker('#modalNextDateEdit', st, isFill, 'editAssets', 'nextDate', $scope.methods.removeEditErr);
                    meteringUtilService.openDialog("编辑计量台账", $("#template_edit_assets"), ['800px', '480px'], null, function (index) {
                        if ($scope.methods.checkParam($scope.data.local.editAssets.currentLeibie.id > 0, "editAssets", "请选择计量类别")
                            && $scope.methods.checkParam($scope.data.local.editAssets.currentFenlei.id > 0, "editAssets", "请选择计量分类")
                            && $scope.methods.checkParam(($scope.data.local.editAssets.cycle + '').length > 0, "editAssets", "请输入计量周期")
                            && $scope.methods.checkParam(($scope.data.local.editAssets.nextDate + '').length > 0, "editAssets", "请选择下次检定日期")
                            && $scope.methods.checkParam($scope.data.local.editAssets.currentMethod.id > 0, "editAssets", "请选择检定方式")
                            && $scope.methods.checkParam($scope.data.local.editAssets.currentUser.id > 0, "editAssets", "请选择负责人")) {
                            var param = {
                                "chargeUserId": +$scope.data.local.editAssets.currentUser.id > 0 ? +$scope.data.local.editAssets.currentUser.id : null,
                                "chargeUserName": +$scope.data.local.editAssets.currentUser.id > 0 ? $scope.data.local.editAssets.currentUser.name : null,
                                "checkMode": +$scope.data.local.editAssets.currentMethod.id,
                                "id": $scope.data.local.editAssets.id,
                                "measureCategory": +$scope.data.local.editAssets.currentFenlei.id,
                                "measureCycle": $scope.data.local.editAssets.cycle == '' ? null : $scope.data.local.editAssets.cycle,
                                "measureManageType": +$scope.data.local.editAssets.jlgl,
                                "measureType": +$scope.data.local.editAssets.currentLeibie.id,
                                "nextCheckTime": $scope.data.local.editAssets.nextDate,
                                "remarks": $scope.data.local.editAssets.remark
                            };
                            meteringDbService.editAssets(param, function (json) {
                                layer.close(index);
                                meteringUtilService.tost("编辑成功");
                                $scope.methods.getAssets(1, $scope.pageInfo.size);
                            }, function (msg) {
                                $scope.data.local.editAssets.err = msg;
                                $scope.$apply();
                            });
                        }
                    }, null, function () {
                        setTimeout(function () {
                            $scope.$apply();
                        }, 50);
                    });
                },
                setDatepicker: function (domId, st, isFill, keyObj, keyField, fun) {
                    var val = isFill ? st.Format("yyyy-MM-dd") : '';
                    $(domId).val(val);                    
                    meteringUtilService.setDatepicker(domId, st, null, null, null, function (b) {
                        $scope.data.local[keyObj][keyField] = new Date(b.startDate).getTime();
                        if(typeof fun === 'function') {
                            fun();
                            $scope.$apply();
                        }
                    });
                },
                changeModalLeibieEdit: function (item) {
                    $scope.data.local.editAssets.currentLeibie = item;
                    $scope.methods.removeEditErr();
                },
                changeModalFenleiEdit: function (item) {
                    $scope.data.local.editAssets.currentFenlei = item;
                    $scope.methods.removeEditErr();
                },
                changeModalMethodEdit: function (item) {
                    $scope.data.local.editAssets.currentMethod = item;
                    $scope.methods.removeEditErr();
                },
                changeModalUserEdit: function (item) {
                    $scope.data.local.editAssets.currentUser = item;
                    $scope.methods.removeEditErr();
                },
                removeEditErr: function () {
                    $scope.data.local.editAssets.err = '';
                },
                getDeparts: function () {
                    meteringDbService.getDepartments($rootScope.userInfo.tenantId, function (data) {
                        $scope.data.local.departOptions = [{ id: 0, name: '选择部门' }].concat(data);
                        setStartDatepicker(null, null, null, null);
                        setEndDatepicker(null, null, null, null);
                        $scope.$apply();
                    });
                },
                getUsers: function () {
                    meteringDbService.getMeteringUsers(function (data) {
                        for (var i = 0, len = data.length; i < len; i++) {
                            data[i].name = data[i].realName;
                        }
                        $scope.data.local.userOptions = [{ id: 0, name: '请选择' }].concat(data);
                        $scope.$apply();
                    });
                },
                getAssets: function (pageNo, pageSize) {
                    var param = {
                        pageNo: pageNo,
                        pageSize: pageSize,
                    };
                    if ($scope.data.local.currentStatu.id > 0) {
                        param.status = $scope.data.local.currentStatu.id;
                    }
                    if ($scope.data.local.currentType.id > 0) {
                        param.measureManageType = $scope.data.local.currentType.id;
                    }
                    if ($scope.data.local.currentDepart.id > 0) {
                        param.assetsDeptId = $scope.data.local.currentDepart.id;
                    }
                    if ($scope.data.local.keyword.length > 0) {
                        param.keyword = $scope.data.local.keyword;
                    }
                    if (($scope.data.local.nextDateStart + '').length > 0) {
                        param.startDate = new Date($scope.data.local.nextDateStart).Format("yyyy-MM-dd") + " 00:00:00";
                    }
                    if (($scope.data.local.nextDateEnd + '').length > 0) {
                        param.endDate = new Date($scope.data.local.nextDateEnd).Format("yyyy-MM-dd") + " 23:59:59";
                    }
                    $scope.data.server.list = [];
                    $scope.data.loading = true;
                    meteringDbService.getAssets(param, function (json) {
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
                $scope.methods.getAssets(1, $scope.pageInfo.size);
                $scope.methods.getDeparts();
                $scope.methods.getUsers();
            };

            $scope.init();

            function getOption(list, id) {
                var result = {};
                id = id || 0;
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].id == id) {
                        result = list[i];
                        break;
                    }
                }
                return result;
            }

            function setStartDatepicker(min, max, st, en) {
                meteringUtilService.setDatepicker('#nextDateStart', st, en, min, max, function (b) {
                    $scope.data.local.nextDateStart = new Date(b.startDate).getTime();
                    setEndDatepicker(new Date(b.startDate), new Date("2050-01-01"));
                });
            }

            function setEndDatepicker(min, max, st, en) {
                meteringUtilService.setDatepicker('#nextDateEnd', st, en, min, max, function (b) {
                    $scope.data.local.nextDateEnd = new Date(b.startDate).getTime();
                    setStartDatepicker(null, new Date(b.startDate));
                });
            }
        });
    }]);