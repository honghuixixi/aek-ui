
angular.module('app')
    .controller('repairweixiuController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', '$filter', function ($scope, $stateParams, $rootScope, $state, $timeout, $localStorage, $filter) {
        $rootScope.currentmodule = "维修管理";
        // 维修费用及备注
        $scope.repairObj = {
            remark: '',
            repairCost: '0.00',
            materiaCost: '0.00',
            totalCost: '0.00'
        };
        $scope.turnNum = 0;
        $scope.reportStatus = 1;
        $rootScope.userInfo = $localStorage.userInfo;
        if ($rootScope.userInfo && !$rootScope.userInfo.authoritiesStr) {
            $rootScope.userInfo.authoritiesStr = '';
        }
        // 确认框提示语
        $scope.repairAlertTxt = $stateParams.status == 0 ? '确定提交该设备的维修申请吗?' : ($stateParams.status == 2 ? '提交后将不能修改，确定提交维修报告单吗?' : ($stateParams.status == 3 ? '提交后将不能修改，确定提交验收信息吗?' : '提交后将不能修改，确定提交接单信息吗?'));
        // 高度自适应
        $scope.repairHeightAuto = function () {
            var clientHeight = 0;
            var clientWidth = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
                clientWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
            }
            else {
                clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
                clientWidth = (document.body.clientWidth > document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
            }
            $('#repairContent').css('min-height', ((clientHeight - 146) < 640 ? 640 : (clientHeight - 146)) + 'px');
            $('#repairContentBody').css('min-height', ((clientHeight - 418) < 350 ? 350 : (clientHeight - 418)) + 'px');
        }
        $scope.repairHeightAuto();
        // 维修人列表
        $scope.pepleAjax = function () {
            $.ajax({
                type: "get",
                url: '/sys/user/getRepExchangeUserList',
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        $scope.peopleList2 = res.responseJSON.data
                    }
                }
            })
        }
        $scope.pepleAjax()
        // 选择故障现象
        $scope.phenomenon = function () {
            $scope.trouble = true;
            var index = layer.open({
                time: 0,//不自动关闭
                type: 1,
                content: $(".workTwo"),
                title: ['选择故障现象', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                closeBtn: 1,
                btn: 0,
                shade: 0.3,
                btn: ['确定', '取消'],
                shadeClose: true,
                area: ['600px', '310px'],
                success: function () {
                    if ($scope.addphenom.length != 0) {
                        var length1 = $scope.addphenom.length;
                        var length2 = $scope.troubleList.length;
                        for (var i = 0; i < length1; i++) {
                            for (var j = 0; j < length2; j++) {
                                if ($scope.addphenom[i].name == $scope.troubleList[j].name) {
                                    $scope.troubleList[j].choose = 'disabled';
                                }
                            }
                        }
                    }
                },
                yes: function () {
                    $scope.repairPhenomErr = false;
                    var _length = angular.element('.checkboxFive input:checked').length;
                    for (var i = 0; i < _length; i++) {
                        var _data = angular.element('.checkboxFive input:checked').eq(i).parent('div').next('span').text();
                        var listLength = $scope.troubleList.length;
                        for (var j = 0; j < listLength; j++) {
                            if ($scope.troubleList[j].name == _data) {
                                $scope.addphenom.push({ name: _data, key: $scope.troubleList[j].key });
                            }
                        }
                    }
                    if (_length > 0) {
                        $scope.trouble = false;
                        layer.close(index);
                    }
                },
                end: function () {
                    $scope.trouble = false;
                    $rootScope.$apply();
                }
            });
            layer.style(index, {
                fontSize: '16px',
                backgroundColor: '#fff',

            });
        }
        // 选择故障现象END
        // 选择故障原因start
        $scope.troubleReason = function () {
            $scope.error = ''
            $scope.errormSame = false;
            $scope.errList = false;
            $scope.errorindex = 3;
            $scope.dictionary('HUMAN_FACTOR')
            $scope.dictionary('EQUIPMENT_FAILURE')
            $scope.dictionary('EXTERNAL_FACTORS')
            $scope.three = false
            $scope.peopleList = $scope.peopleList.splice(0, $scope.peopleList.length)
            $scope.machineList = $scope.machineList.splice(0, $scope.machineList.length)
            $scope.environList = $scope.environList.splice(0, $scope.environList.length)
            $scope.otherList = [];
            var arr = JSON.stringify($scope.addReason);
            arr = JSON.parse(arr);
            for (var i = 0, length_0 = arr.length; i < length_0; i++) {
                arr[i].spliced = true;
                if ((function () {
                    for (var q = 0, length_1 = $scope.peopleList.length; q < length_1; q++) {
                        if (arr[i].name == $scope.peopleList[q].name) {
                            $scope.peopleList[q].checked = true;
                            arr[i].spliced = false;
                            return true;
                        }
                    };
                })()) {
                    continue;
                }
                if ((function () {
                    for (var w = 0, length_2 = $scope.machineList.length; w < length_2; w++) {
                        if (arr[i].name == $scope.machineList[w].name) {
                            $scope.machineList[w].checked = true;
                            arr[i].spliced = false;
                            return true;
                        }
                    };
                })()) {
                    continue;
                }
                if ((function () {
                    for (var e = 0, length_3 = $scope.environList.length; e < length_3; e++) {
                        if (arr[i].name == $scope.environList[e].name) {
                            $scope.environList[e].checked = true;
                            arr[i].spliced = false;
                            return true;
                        }
                    };
                })()) {
                    continue;
                }
            };
            for (var r = 0; r < length_0; r++) {
                if (arr[r].spliced)
                    $scope.otherList.push({ name: arr[r].name, checked: true, key: arr[r].name });
            };
            $scope.troubleErr = ''
            $scope.error = ''
            $scope.errorRea = true
            $rootScope.radio.radioNew = 1
            var index = layer.open({
                time: 0,//不自动关闭
                type: 1,
                content: $(".reason"),
                title: ['选择故障原因', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                closeBtn: 1,
                btn: 0,
                shade: 0.3,
                btn: ['确定', '取消'],
                shadeClose: true,
                area: ['600px', '600px'],
                success: function () {
                    if ($scope.addReason.length != 0) {
                        var length1 = $scope.addReason.length;
                        var length2 = $scope.peopleList.length;
                        var length3 = $scope.machineList.length;
                        var length4 = $scope.environList.length;
                        for (var i = 0; i < length1; i++) {
                            for (var j = 0; j < length2; j++) {
                                if ($scope.addReason[i].name == $scope.peopleList[j].name) {
                                    $scope.peopleList[j].choose = 'disabled';
                                }
                            }
                        };
                        for (var i = 0; i < length1; i++) {
                            for (var j = 0; j < length3; j++) {
                                if ($scope.addReason[i].name == $scope.machineList[j].name) {
                                    $scope.machineList[j].choose = 'disabled';
                                }
                            }
                        };
                        for (var i = 0; i < length1; i++) {
                            for (var j = 0; j < length4; j++) {
                                if ($scope.addReason[i].name == $scope.environList[j].name) {
                                    $scope.environList[j].choose = 'disabled';
                                }
                            }
                        }
                    }
                },
                yes: function () {
                    $scope.repairReasonErr = false;
                    var _length = angular.element('.errorReason input:checked').length;
                    $scope.addReason = [];
                    for (var i = 0; i < _length; i++) {
                        var _data = angular.element('.errorReason input:checked').eq(i).parent('div').next('span').text();
                        var listLength1 = $scope.peopleList.length
                        for (var j = 0; j < listLength1; j++) {
                            if ($scope.peopleList[j].name == _data) {
                                $scope.addReason.push({ name: _data, key: $scope.peopleList[j].key })
                            }
                        }
                        var listLength2 = $scope.machineList.length
                        for (var n = 0; n < listLength2; n++) {
                            if ($scope.machineList[n].name == _data) {
                                $scope.addReason.push({ name: _data, key: $scope.machineList[n].key })
                            }
                        }
                        var listLength3 = $scope.environList.length
                        for (var m = 0; m < listLength3; m++) {
                            if ($scope.environList[m].name == _data) {
                                $scope.addReason.push({ name: _data, key: $scope.environList[m].key })
                            }
                        }
                        for (var o = 0, listLength0 = $scope.otherList.length; o < listLength0; o++) {
                            if ($scope.otherList[o].name == _data) {
                                $scope.addReason.push({ name: _data, key: $scope.otherList[o].key });
                            }
                        }
                    }
                    if (_length > 0) {
                        $scope.errorRea = false;
                        layer.close(index)
                    }
                },
                end: function () {
                    $scope.errorRea = false;
                    $rootScope.$apply();
                }
            });
            layer.style(index, {
                fontSize: '16px',
                backgroundColor: '#fff',
            });
        }
        // 选择故障原因结尾
        //新增工作内容start
        $scope.addJob = function () {
            $scope.workSame = false;
            $scope.workcontent = ''
            $scope.dictionary('JOB_CONTENT');
            $scope.four = false;
            angular.element('.checkboxFive input').prop('checked', false);
            $scope.workList = $scope.workList.splice(0, $scope.workList.length);
            $scope.work = true;
            var index = layer.open({
                time: 0,//不自动关闭
                type: 1,
                content: $(".workOne"),
                title: ['选择工作内容', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                closeBtn: 1,
                shade: 0.3,
                btn: ['确定', '取消'],
                shadeClose: true,
                area: ['600px', '340px'],
                success: function () {
                    if ($scope.addWork.length != 0) {
                        var length1 = $scope.addWork.length;
                        var length2 = $scope.workList.length;
                        for (var i = 0; i < length1; i++) {
                            for (var j = 0; j < length2; j++) {
                                if ($scope.addWork[i].name == $scope.workList[j].name) {
                                    $scope.workList[j].choose = 'disabled';
                                }
                            }
                        }
                    }
                },
                yes: function () {
                    $scope.repairWorkErr = false;
                    var _length = angular.element('.checkboxFive input:checked').length
                    for (var i = 0; i < _length; i++) {
                        var _data = angular.element('.checkboxFive input:checked').eq(i).parent('div').next('span').text()
                        var listLength = $scope.workList.length;
                        for (var j = 0; j < listLength; j++) {
                            if ($scope.workList[j].name == _data) {
                                $scope.addWork.push({ name: _data, key: $scope.workList[j].key })
                            }
                        }
                    }
                    if (_length > 0) {
                        $scope.work = false;
                        layer.close(index)
                    }
                },
                end: function () {
                    $scope.work = false;
                    $rootScope.$apply();
                }
            });
            layer.style(index, {
                fontSize: '16px',
                backgroundColor: '#fff',

            });
        }
        //新增工作内容end
        $rootScope.role = $stateParams.role
        $scope.addParts = false  // 新增配件
        $scope.addWork = [] // 添加工作内容
        // $scope.unitArr=['个','盒','支']
        $scope.unitArr = []
        $scope.addReason = []
        $scope.addphenom = []
        $scope.partList = []
        $scope.unitName = '';
        $scope.reasonChoose = ['人为因素', '设备故障', '外界环境因素']
        $scope.workList = [];
        // 字典表查询
        $scope.pheno = 'FAULT_PHENOMENON';
        $scope.peopleReason = 'HUMAN_FACTOR';
        $scope.facilityReason = 'EQUIPMENT_FAILURE';
        $scope.environment = 'EXTERNAL_FACTORS';
        $scope.workMatter = 'JOB_CONTENT';
        $scope.danwei = 'PARTS_UNIT';
        $scope.repairType = 'REPAIR_TYPE';
        $scope.repairResult = 8;
        $scope.dictionary = function (id) {
            $.ajax({
                type: "get",
                url: "/newrepair/repairDictionary/search/" + id,
                async: false,
                data: { 'id': id },
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        var _length = res.responseJSON.data.length;
                        if (id == $scope.danwei) {
                            $scope.unitArr = res.responseJSON.data ? res.responseJSON.data : $scope.unitArr;
                            $scope.part = {
                                partName: '',
                                partSpec: '',
                                partProduce: '',
                                num: '',
                                status: '',
                                unitName: $scope.unitArr[1].name,
                                partPrice: '',
                                unit: $scope.unitArr[1].keyId
                            }
                        }
                        if (id == $scope.repairType) {
                            $scope.optionType2 = res.responseJSON.data;
                        }
                        if (id == $scope.repairResult) {
                            $scope.optionType3 = res.responseJSON.data;
                        }
                        if (id == $scope.pheno) {
                            $scope.troubleList = res.responseJSON.data
                            for (var i = 0; i < _length; i++) {
                                $scope.troubleList[i].checked = false
                                $scope.troubleList[i].choose = false
                            }
                            // $rootScope.$apply()
                        }
                        if (id == $scope.peopleReason) {
                            $scope.peopleList = res.responseJSON.data
                            for (var i = 0; i < _length; i++) {
                                $scope.peopleList[i].checked = false
                                $scope.peopleList[i].choose = false
                            }
                        }
                        if (id == $scope.facilityReason) {
                            $scope.machineList = res.responseJSON.data
                            for (var i = 0; i < _length; i++) {
                                $scope.machineList[i].checked = false
                                $scope.machineList[i].choose = false
                            }
                        }
                        if (id == $scope.environment) {
                            $scope.environList = res.responseJSON.data
                            for (var i = 0; i < _length; i++) {
                                $scope.environList[i].checked = false
                                $scope.environList[i].choose = false
                            }
                        }
                        if (id == $scope.workMatter) {
                            $scope.workList = res.responseJSON.data;
                            for (var i = 0; i < _length; i++) {
                                $scope.workList[i].checked = false;
                                $scope.workList[i].choose = false
                            }
                        }
                        // $rootScope.$apply();
                    }
                }
            })
        }
        $scope.dictionary('PARTS_UNIT');
        $scope.dictionary('REPAIR_TYPE');
        // $scope.dictionary(8);
        $scope.troubleList = [];
        $scope.peopleList = [];
        $scope.machineList = [];
        $scope.environList = [];
        // 根据列表传来的状态分别发送请求结尾
        // 选择工作内容
        $scope.workAdd = function () {
            for (var i = 0; i < $scope.workList.length; i++) {
                if ($scope.workList[i].name == $scope.workcontent) {
                    $scope.workSame = true;
                }
            }
            if (!$scope.workSame) {
                $scope.workList.push({ 'name': $scope.workcontent, 'checked': true, 'key': $scope.workcontent })
                $scope.workcontent = ''
            }
        }
        $scope.workChange = function () {
            $scope.workSame = false;
        }
        $scope.workClick = function () {
            $scope.workSame = false;
            $scope.workcontent = '';
        }
        // 选择故障现象
        $scope.errorSame = false;
        $scope.errorAddp = function () {
            for (var i = 0; i < $scope.troubleList.length; i++) {
                if ($scope.troubleList[i].name == $scope.newError) {
                    $scope.errorSame = true;
                }
            }
            if (!$scope.errorSame) {
                $scope.troubleList.push({ 'name': $scope.newError, 'checked': true, 'key': $scope.newError })
                $scope.newError = ''
            }
        }
        $scope.errorChange = function () {
            $scope.errorSame = false;
        }
        $scope.errorClick = function () {
            $scope.errorSame = false;
            $scope.newError = ''
        }
        // 故障原因
        $scope.errorAdd = function () {
            for (var i = 0; i < $scope.environList.length; i++) {
                if ($scope.environList[i].name == $scope.error) {
                    $scope.errormSame = true;
                }
            }
            $scope.otherList.push({ name: $scope.error, checked: true, 'key': $scope.error });
            $scope.error = '';
        }
        $scope.errormChange = function () {
            $scope.errormSame = false;
        }
        $scope.errormClick = function (a) {
            a.checked = !a.checked;
            $scope.errormSame = false;
            $scope.error = '';
        }
        // 删除故障原因，现象start
        $scope.delectpart = function (a, b) {
            $scope[b].splice(a, 1);
        }
        // 删除故障原因，现象end
        // 填写维修报告start
        $scope.lookRepairReportConShow = false;
        $scope.lookRepairReportPartsShow = false;
        $scope.lookRepairReportResultShow = false;
        $scope.lookRepairReportMenuShow = function (a) {
            $scope[a] = !$scope[a];
        }
        // 填写维修报告end
        // 添加配件的弹窗start
        $scope.unitList = function ($event, l) {
            $scope.part.unitName = $($event.target).text();
            $scope.part.unit = l.keyId;
            $scope.unit = false;
            $scope.partsUnit = false;
        };
        $scope.statusList = function (a) {
            $scope.part.status = a;
            $scope.part.statusTxt = a == 1 ? '领用' : '购买';
            $scope.partsSource = false;
            $scope.partstatus = false;
        };
        // 添加配件
        $scope.addPart = function () {
            $scope.partsone = false;
            $scope.partstwo = false;
            $scope.partsthree = false;
            $scope.partsfour = false;
            $scope.partssix = false;
            $scope.unit = false;
            $scope.part = {
                unitName: '个',
                unit: 1001,
                partName: '',
                partSpec: '',
                partProduce: '',
                num: '',
                status: '',
                // unitName:$scope.unitArr[1].name,
                partPrice: '',
                // unit:$scope.unitArr[1].key
            }
            // $scope.five=false;
            $scope.addParts = true;
            var index = layer.open({
                time: 0,//不自动关闭
                type: 1,
                content: $(".hd_addParts"),
                title: ['添加配件', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                closeBtn: 1,
                btn: 0,
                shade: 0.3,
                btn: ['确定', '取消'],
                shadeClose: true,
                area: ['618px', '462px'],
                yes: function () {
                    if (!$scope.part.partName) {
                        $scope.partsone = true;
                        $rootScope.$apply();
                        return;
                    }
                    if (!$scope.part.status) {
                        $scope.partsSource = true;
                        $rootScope.$apply();
                        return;
                    }
                    if (!$scope.part.num) {
                        $scope.partsfour = true;
                        $rootScope.$apply();
                        return;
                    }
                    if (!$scope.part.unit) {
                        $scope.partsUnit = true;
                        $rootScope.$apply();
                        return;
                    }
                    if ($scope.part.partName && $scope.part.num) {
                        $scope.addParts = false;
                        layer.close(index);
                        $scope.lookRepairReportPartsShow = false;
                        $scope.part.partPrice = Number($scope.part.partPrice).toFixed(2);
                        !$scope.part.delFlag && ($scope.part.delFlag = false);
                        !$scope.part.operationTime && ($scope.part.operationTime = new Date().getTime());
                        !$scope.part.tenantId && ($scope.part.tenantId = $stateParams.tenantId || $localStorage.userInfo.tenantId);
                        $scope.partList.push($scope.part);
                        $scope.partListHad = true;
                        $scope.part = {};
                        if ($rootScope.radio.radioV == 1 || $rootScope.radio.radioV == 2) {
                            var total = 0;
                            for (var i = $scope.partList.length - 1; i >= 0; i--) {
                                !$scope.partList[i].delFlag && (total += $scope.partList[i].partPrice * $scope.partList[i].num);
                            };
                            $scope.repairObj.materiaCost = total.toFixed(2);
                            $scope.repairObj.totalCost = Number($scope.repairObj.materiaCost) + Number($scope.repairObj.repairCost);
                        }
                        $rootScope.$apply();
                    }
                },
                end: function () {
                    $scope.addParts = false;
                    $scope.accessoryResult = [];
                    $scope.accessorySearch = false;
                    $scope.accessoryResultNone = false;
                    $scope.accessoryKeyWord = '';
                    $rootScope.$apply();
                }
            });
            layer.style(index, {
                fontSize: '16px',
                backgroundColor: '#fff',

            });
        }
        // 添加配件的弹窗end
        // 下拉菜单1,2,3start
        // 下拉菜单
        $scope.typeList = false;
        $scope.typeModel = '紧急程度';
        $scope.option = function (list, value, item) {
            $rootScope.fixWrapShow = false;
            $scope[list] = false;
            $scope[value] = item.name;
        }
        $scope.listShow = function (str) {
            if ($rootScope.fixWrapShow)
                return $scope.menuHide();
            $scope[str] = true;
            $rootScope.fixWrapShow = true;
        }
        $rootScope.fixWrapShow = false;
        $scope.menuHide = function () {
            $rootScope.fixWrapShow = false;
            $scope.stateList = false;
            $scope.typeList = false;
            $scope.operateList = false;
        }
        // 大屏显示 紧急程度
        $scope.optionType = [{
            id: '',
            name: '紧急'
        }, {
            id: 1,
            name: '非常紧急'
        }, {
            id: 2,
            name: '不紧急'
        }];
        // 下拉菜单2
        $scope.typeList2 = false;
        $scope.typeModel2 = { name: '', key: '' };
        $scope.typeModel2.name = '请选择维修内容';
        $scope.option2 = function (list, value, item) {
            $scope.first = false
            $scope[list] = false;
            $scope[value].name = item.name;
            $scope[value].key = item.key;
        }
        $scope.menuHide2 = function () {
            $rootScope.fixWrapShow = false;
            $scope.stateList = false;
            $scope.typeList2 = false;
            $scope.operateList = false;
        }
        $scope.listShow2 = function (str) {
            if ($rootScope.fixWrapShow)
                return $scope.menuHide2();
            $scope[str] = true;
            $rootScope.fixWrapShow = true;
        }

        // 下拉菜单3
        $scope.typeList = false;
        $scope.typeModel3 = { name: '', key: '' };
        $scope.typeModel3.name = '选择维修后状态';
        $scope.option3 = function (list, value, item) {
            $scope.six = false;
            $rootScope.fixWrapShow = false;
            $scope[list] = false;
            $scope[value].name = item.name;
            $scope[value].key = item.key;
        }
        $scope.listShow3 = function (str) {
            if ($rootScope.fixWrapShow)
                return $scope.menuHide3();
            $scope[str] = true;
            $rootScope.fixWrapShow = true;
        }
        $rootScope.fixWrapShow = false;
        $scope.menuHide3 = function () {
            $rootScope.fixWrapShow = false;
            $scope.stateList = false;
            $scope.typeList = false;
            $scope.operateList = false;
        }
        //下拉菜单1,2,3end
        // 选择故障现象
        $scope.phenomenon = function () {
            $scope.newError = ''
            $scope.errorSame = false;
            $scope.dictionary('FAULT_PHENOMENON')
            $scope.two = false
            angular.element('.checkboxFive input').prop('checked', false);
            $scope.troubleList = $scope.troubleList.splice(0, 6);
            $scope.trouble = true;
            var index = layer.open({
                time: 0,//不自动关闭
                type: 1,
                content: $(".workTwo"),
                title: ['选择故障现象', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                closeBtn: 1,
                btn: 0,
                shade: 0.3,
                btn: ['确定', '取消'],
                shadeClose: true,
                area: ['600px', '310px'],
                success: function () {
                    if ($scope.addphenom.length != 0) {
                        var length1 = $scope.addphenom.length;
                        var length2 = $scope.troubleList.length;
                        for (var i = 0; i < length1; i++) {
                            for (var j = 0; j < length2; j++) {
                                if ($scope.addphenom[i].name == $scope.troubleList[j].name) {
                                    $scope.troubleList[j].choose = 'disabled';
                                }
                            }
                        }
                    }
                },
                yes: function () {
                    $scope.repairPhenomErr = false;
                    var _length = angular.element('.checkboxFive input:checked').length
                    for (var i = 0; i < _length; i++) {
                        var _data = angular.element('.checkboxFive input:checked').eq(i).parent('div').next('span').text()
                        var listLength = $scope.troubleList.length
                        for (var j = 0; j < listLength; j++) {
                            if ($scope.troubleList[j].name == _data) {
                                $scope.addphenom.push({ name: _data, key: $scope.troubleList[j].key })
                            }
                        }
                    }
                    if (_length > 0) {
                        $scope.trouble = false;
                        layer.close(index)
                    }
                },
                end: function () {
                    $scope.trouble = false;
                    $rootScope.$apply();
                }
            });
            layer.style(index, {
                fontSize: '16px',
                backgroundColor: '#fff',

            });
        }
        // 故障原因start
        // $scope.troubleClick = function($event,$index){
        //        $scope.troubleErr = $($event.target).text()
        //        $scope.errList = false
        //        $scope.errorindex=$index
        //    }
        //    $scope.errorAdd = function(){
        //        for(var i=0;i<$scope.peopleList.length;i++){
        //            if($scope.peopleList[i].name==$scope.error){
        //                $scope.errormSame = true;
        //            }
        //        }
        //        for(var i=0;i<$scope.machineList.length;i++){
        //            if($scope.machineList[i].name==$scope.error){
        //                $scope.errormSame = true;
        //            }
        //        }
        //        for(var i=0;i<$scope.environList.length;i++){
        //            if($scope.environList[i].name==$scope.error){
        //                $scope.errormSame = true;
        //            }
        //        }
        //        if($scope.errorindex==0&&!$scope.errormSame){
        //            $scope.peopleList.push({name:$scope.error,checked:true,'key':$scope.error})
        //            $scope.error=''
        //        }else if($scope.errorindex==1&&!$scope.errormSame){
        //            $scope. machineList.push({name:$scope.error,checked:true,'key':$scope.error})
        //            $scope.error=''
        //        }else if($scope.errorindex==2&&!$scope.errormSame){
        //            $scope. environList.push({name:$scope.error,checked:true,'key':$scope.error})
        //            $scope.error=''
        //        }

        //    }
        //    $scope.errormChange = function(){
        //        $scope.errormSame = false;
        //    }
        //    $scope.errormClick = function(){
        //        $scope.errormSame = false;
        //        $scope.error='';
        //    }
        //故障原因结束end
        // 维修时间start
        $scope.repairDate1 = 0;
        $scope.repairDate2 = 0;
        $scope.repairTime = { day: 0, hour: 0 };
        // 真实时间
        $scope.repairTrue1 = 0;
        $scope.repairTrue2 = 0;
        $scope.repairTrue = { day: 0, hour: 0 };
        //维修时间end
        // 外修时间
        // $scope.outsideRepairTime = {
        //     callRepairDate: 0,
        //     arrivalDate: 0,
        //     leaveDate: 0,
        //     repairHours: '',
        // }
        // 删除配件start
        $scope.partListHad = false;
        $scope.deldectPart = function ($index) {
            $scope.partListHad = false;
            // ($scope.partList[$index].id)&&($scope.partList[$index].delFlag = true);
            // (!$scope.partList[$index].id)&&($scope.partList.splice($index,1));
            $scope.partList.splice($index, 1)
            if ($scope.partList.length) {
                $scope.partListHad = true;
                // var n = 0;
                // while(n<$scope.partList.length){
                //     (!$scope.partList[n].delFlag)&&($scope.partListHad=true);
                //     n++;
                // }
            }
            if ($rootScope.radio.radioV == 1 || $rootScope.radio.radioV == 2) {
                var total = 0;
                for (var i = $scope.partList.length - 1; i >= 0; i--) {
                    // !$scope.partList[i].delFlag&&(total+=$scope.partList[i].partPrice*$scope.partList[i].num);
                    total += $scope.partList[i].partPrice * $scope.partList[i].num;
                };
                $scope.repairObj.materiaCost = total.toFixed(2);
                $scope.repairObj.totalCost = Number($scope.repairObj.materiaCost) + Number($scope.repairObj.repairCost);
            }
        }
        // 备注

        $scope.writesum = function () {
            if ($scope.repairObj.remark && $scope.repairObj.remark.length > 300) {
                $scope.repairObj.remark = $scope.repairObj.remark.substring(0, 300)
            }
        }
        // // 接单备注数字控制
        $scope.jiedansum = function () {
            if ($scope.remarks.length > 300) {
                $scope.remarks = $scope.remarks.substring(0, 300)
            }
        }
        // 日历start
        $scope.totalCostChange = function (m) {
            if (m == 1) {
                $scope.eleven = false
            } else {
                $scope.twolve = false
            }

            $scope.repairObj.totalCost = Number($scope.repairObj.repairCost) + Number($scope.repairObj.materiaCost);
        }
        $scope.repairNumFix = function () {
            $scope.repairObj.repairCost = Number($scope.repairObj.repairCost).toFixed(2);
            $scope.repairObj.materiaCost = Number($scope.repairObj.materiaCost).toFixed(2);
        }
        // 维修中时间计算限制
        function repairHour(date, enddate, el) {
            $scope.preTimeTypeNum = 0;
            var t, temp = $scope[$(this.element).attr('attrVar')];
            if ($rootScope.radio.radioV == 2) {
                $scope['outsideRepairTime'][$(this.element).attr('attrVar')] = new Date(date).getTime();
            } else {
                $scope[$(this.element).attr('attrVar')] = new Date(date).getTime();
                t = ($scope.repairDate2 - $scope.repairDate1 < 0) ? -1 : (($scope.repairTrue2 - $scope.repairTrue1 < 0) ? -1 : 1);
                if (t < 0) {
                    $scope[$(this.element).attr('attrVar')] = temp;
                    $(this.element).val($filter('date')(temp, 'yyyy-MM-dd HH:mm'));
                    $scope.initcalendar($scope.repairDate1, $scope.repairDate2, $scope.repairDate1, '.date-endDate');
                    $scope.initcalendar($scope.repairTrue1, $scope.repairTrue2, $scope.repairTrue1, '.true-endDate');
                    $scope.initcalendar(0, $scope.repairDate1, 0, '.date-startDate');
                    $scope.initcalendar($scope.repairDate1, $scope.repairTrue1, $scope.repairDate1, '.true-startDate');
                    return;
                }
                var currentel = $(this.element).attr("name");
                currentel == "expireDate" && ($scope.expireStr = date.format('YYYY-MM-DD HH:mm'));
                t = $scope.repairDate2 - $scope.repairDate1;
                t = t > 0 ? t : 1;
                $scope.repairDate1 && $scope.repairDate2 && (
                    $scope.repairTime.day = Math.floor(t / 3600000 / 24),
                    $scope.repairTime.hour = Math.ceil(t / 3600000 % 24)
                );
                $scope.repairTime.hour == 24 ? ($scope.repairTime.day = $scope.repairTime.day + 1, $scope.repairTime.hour = 0) : '';
                t = $scope.repairTrue2 - $scope.repairTrue1;
                t = t > 0 ? t : 1;
                $scope.repairTrue1 && $scope.repairTrue2 && (
                    $scope.repairTrue.day = Math.floor(t / 3600000 / 24),
                    $scope.repairTrue.hour = Math.ceil(t / 3600000 % 24)
                );
                $scope.repairTrue.hour == 24 ? ($scope.repairTrue.day = $scope.repairTrue.day + 1, $scope.repairTrue.hour = 0) : '';
            }
            $rootScope.$apply();
        }
        $scope.$watch('repairDate1', function (newValue, oldValue, scope) {
            $scope.initcalendar(newValue, $scope.repairDate2, newValue, '.date-endDate');
            $scope.initcalendar(newValue, $scope.repairTrue1, newValue, '.true-startDate');
            $scope.initcalendar(0, $scope.repairDate1, 0, '.date-startDate');
        });
        $scope.$watch('repairTrue1', function (newValue, oldValue, scope) {
            $scope.initcalendar(newValue, $scope.repairTrue2, newValue, '.true-endDate');
        });
        // 初始化日历
        $scope.initcalendar = function (start, current, min, ele, max) {
            var option = {
                format: 'YYYY-MM-DD HH:mm',
                startDate: new Date('2017-01-01'),
                // endDate: new Date(),
                timePicker: true,
                // minDate:new Date(new Date()-24*60*60*1000),
                maxDate: new Date("2050-01-01"),
                timePicker12Hour: false,
                //timePicker: false,
                opens: "top",
                singleDatePicker: true
            }
            var obj = {};
            current && (obj.startDate = new Date(current));
            min && (obj.minDate = new Date(min));
            max && (obj.maxDate = new Date(max));
            angular.element(ele).daterangepicker($.extend({}, option, obj), repairHour);
        }

        // 日历 END

        // 点击上传图片
        $scope.clickAdd = true;
        $scope.url = [];
        $scope.urls = [];
        $scope.upload = function () {
            angular.element('.muchinput').val('');
            angular.element('.muchinput').click()
        }
        $timeout(function () {
            angular.element('.muchinput').change(function () {
                var _length = $scope.url.length;
                if (_length == 5) {
                    $scope.clickAdd = false;
                }
                if (_length > 5) {
                    var msg = layer.msg('<div class="toaster"><span>' + '最多上传五张' + '</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                } else {
                    for (var i = 0; i < $(this)[0].files.length; i++) {
                        var _type = $(this)[0].files[i].type
                        var _size = $(this)[0].files[i].size / (1024 * 1024)
                        if (_size > 2) {
                            angular.element('.muchinput').val('');
                            var msg = layer.msg('<div class="toaster"><span>' + '图片大于2M，上传失败' + '</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0
                            });
                            return;
                        }
                        if (_type == 'image/png' || _type == 'image/jpg' || _type == 'image/jpeg') {
                            if (_length == 4) {
                                $scope.clickAdd = false;
                            }
                            var windowUrl = window.URL || window.webkitURL;
                            var _data = windowUrl.createObjectURL($(this)[0].files[i])
                            // 去重
                            if ($scope.url.join().indexOf(_data) == -1) {
                                $scope.url.push(_data)
                                $scope.repairUploadImg($(this)[0].files[0]);
                            }
                            $rootScope.$apply();
                        }
                        if (_type != 'image/png' && _type != 'image/jpg' && _type != 'image/jpeg') {
                            angular.element('.muchinput').val('');
                            var msg = layer.msg('<div class="toaster"><span>' + '图片格式错误，上传失败' + '</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0
                            });
                        }
                    }
                }
            });
        }, 10);
        // 图片上传
        $scope.repairUploadImg = function (a, b, c) {
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
                        if (c) {
                            return $scope.attachment = JSON.parse(res).data[0];
                        }
                        if (b) {
                            $scope.urls[b] = JSON.parse(res).data[0];
                        } else {
                            $scope.urls.push(JSON.parse(res).data[0]);
                        }
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
        // 删除图片
        $scope.delect = function ($index) {
            $scope.delactInput = !$scope.delactInput;
            $scope.url.splice($index, 1)
            $scope.urls.splice($index, 1)
            if ($scope.url.length <= 4) {
                $scope.clickAdd = true
            }
        }
        // 更换图片
        $scope.replaceImg = function () {
            var _type = $('.oneinput')[0].files[0].type
            var _size = $('.oneinput')[0].files[0].size / (1024 * 1024)
            if (_size > 2) {
                var msg = layer.msg('<div class="toaster"><span>' + '图片大于2M，上传失败' + '</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
                $(".oneinput").val('');
            }
            if (_type != 'image/png' && _type != 'image/jpg' && _type != 'image/jpeg') {
                var msg = layer.msg('<div class="toaster"><span>' + '图片格式错误，上传失败' + '</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
                $(".oneinput").val('');

            }
            if (_type == 'image/png' || _type == 'image/jpg' || _type == 'image/jpeg') {
                if (_size <= 2) {
                    var windowUrl = window.URL || window.webkitURL;
                    var data = windowUrl.createObjectURL($('.oneinput')[0].files[0]);
                    $scope.url.splice($scope.curRelaceIndex, 1, data);
                    $scope.repairUploadImg($('.oneinput')[0].files[0], $scope.curRelaceIndex)
                }
            }
        }
        // 更换图片
        $scope.replace = function ($index) {
            angular.element('.oneinput').click();
            $scope.curRelaceIndex = $index;
        }

        // 维修服务 repair server star
        $scope.repairattitudes = 5;

        $scope.repairAttitude = {
            star1: true,
            star2: true,
            star3: true,
            star4: true,
            star5: true,
            txtArr: ["很差", "差", "一般", "满意", "非常满意"],
            txt: '非常满意',
            assessComent: '',
            score: '5.0分'
        }
        $scope.responseSpeed = 5;
        $scope.repairRespond = {
            star1: true,
            star2: true,
            star3: true,
            star4: true,
            star5: true,
            txtArr: ["很慢", "慢", "一般", "快", "非常快"],
            txt: '非常快',
            score: '5.0分'
        }
        $scope.repairQuality = 5;
        $scope.repairMass = {
            star1: true,
            star2: true,
            star3: true,
            star4: true,
            star5: true,
            txtArr: ["很差", "差", "一般", "好", "非常好"],
            txt: '非常好',
            score: '5.0分'
        }
        $scope.repairServerStar = function (a, b, c) {
            $scope.acceptBtn = false;
            if (c == 'attitude') {
                $scope.repairattitudes = b;
            }
            if (c == 'respond') {
                $scope.responseSpeed = b;
            }
            if (c == 'quality') {
                $scope.repairQuality = b;
            }
            for (var i = 1; i < 6; i++) {
                $scope[a]["star" + i] = false;
            };
            switch (Number(b)) {
                case 1:
                    $scope[a].txt = $scope[a].txtArr[b - 1];
                    $scope[a].score = '1.0分';
                    break;
                case 2:
                    $scope[a].txt = $scope[a].txtArr[b - 1];
                    $scope[a].score = '2.0分';
                    break;
                case 3:
                    $scope[a].txt = $scope[a].txtArr[b - 1];
                    $scope[a].score = '3.0分';
                    break;
                case 4:
                    $scope[a].txt = $scope[a].txtArr[b - 1];
                    $scope[a].score = '4.0分';
                    break;
                case 5:
                    $scope[a].txt = $scope[a].txtArr[b - 1];
                    $scope[a].score = '5.0分';
                    break;
                default:
                    break;
            }
            do {
                $scope[a]["star" + b] = true;
                b--;
            } while (b > 0)
        }
        $scope.currentAccept = 0;
        $scope.sumAccept = function () {
            $scope.currentAccept = $scope.repairAttitude.assessComent.length
            if ($scope.repairAttitude.assessComent.length >= 300) {
                $scope.repairAttitude.assessComent = $scope.repairAttitude.assessComent.substring(0, 300)
                $scope.currentAccept = 300
            }
        }
        // END
        // repair type 维修方式
        $rootScope.radio = {};
        $rootScope.radio.radioV = 3;
        $scope.radio.radioT = 1;
        // repair err sort 故障类型
        $rootScope.radio.radioS = 1;
        $scope.attachment = [];
        // 获取设备信息
        $scope.assetsInfoGet = function () {
            ($stateParams.assetsId) && $.ajax({
                type: 'get',
                url: '/assets/assetsInfo/getAssetsDetail',
                data: { id: $stateParams.assetsId },
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        $scope.assetsInfo = res.responseJSON.data;
                        $scope.assetsInfo.assetsDeptName = $scope.assetsInfo.deptName;
                        $scope.assetsInfo.assetsDesc = 1;
                        $scope.getPeople();
                        $rootScope.$apply();
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
            // 故障现象
            $scope.$watch('faultDesc', function (newValue, oldValue, scope) {
                $scope.faultDescErr = false;
            });
        }
        // repair progress list /newrepair/repRepairApply/getApplyDetails/ 维修流程初始化
        $scope.repairProgress = function () {
            $scope.repairInfo = { name: $localStorage.userInfo.realName || '', tel: $localStorage.userInfo.mobile || '', time: '', num: '' };
            $scope.repairFiles = [];
            $scope.sendInfo = {
                sendPerson: '',
                sendPhone: ''
            };
            $scope.faultDescErr = false;
            // 非新建获取维修详情
            ($stateParams.status != 0) && $.ajax({
                type: "get",
                url: "/newrepair/repRepairApply/getApplyDetails/" + $stateParams.applyId,
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        $scope.repairList = res.responseJSON.data;
                        $scope.repairInfo.name = $scope.repairList.reportRepairName;
                        $scope.repairInfo.time = $scope.repairList.reportRepairDate;
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
            // 新建获取设备信息
            ($stateParams.status == 0) && $scope.assetsInfoGet();
            // repair detail info /newrepair/repRepairApply/search/
            // 非新建获取维修单信息
            ($stateParams.status != 0) && $.ajax({
                type: "get",
                url: "/newrepair/repRepairApply/search/" + $stateParams.applyId,
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        $scope.repairDetail = res.responseJSON.data;
                        $scope.assetsInfo = res.responseJSON.data;
                        ($scope.repairDetail.status == 1) && ($scope.checkIsRep());
                        console.log($scope.repairObj);
                        $scope.repairDetail.assetsFile = JSON.parse($scope.repairDetail.assetsFile);
                        $scope.newFiles = $scope.repairDetail.assetsFile ? $scope.repairDetail.assetsFile : ''
                        if ($scope.newFiles) {
                            for (var i = 0; i < $scope.newFiles.length; i++) {
                                $scope.newFiles[i].imgUrlEn = encodeURI(encodeURI($scope.newFiles[i].uploadUrl));
                            }
                        }

                        $scope.repairDetail.assetsFile = $scope.newFiles;

                        $scope.reportStatus = $scope.assetsInfo.reportStatus ? $scope.assetsInfo.reportStatus : 1;
                        console.log('=====')
                        console.log($scope.reportStatus)
                        $scope.repairInfo.tel = $scope.repairDetail.reportRepairPhone;
                        $scope.applyStatus = $scope.repairDetail.status;
                        if (($scope.applyStatus != $stateParams.status) && ($stateParams.status != 6) && ($stateParams.status != 5)) {
                            return $state.go('repair.newweixiu', { status: $scope.applyStatus, assetsId: $scope.repairDetail.assetsId, applyId: $scope.repairDetail.id }, { reload: true });
                        }
                        ($scope.applyStatus == 4) && ($scope.repairCheckSearch());
                        ($scope.applyStatus > 1) && ($scope.repairTakeOrder());
                        $scope.repairInfo.num = $scope.repairDetail.applyNo;
                        $scope.faultDesc = $scope.repairDetail.faultDesc;
                        $scope.urls = $scope.repairDetail.assetsImg ? $scope.repairDetail.assetsImg.split(',') : [];
                        if ($scope.urls.length) {
                            $scope.imgArr = [];
                            var obj;
                            for (var i = 0; i < $scope.urls.length; i++) {
                                obj = {};
                                obj.src = '/api/file' + $scope.urls[i];
                                obj.index = i;
                                $scope.imgArr.push(obj);
                            };
                        }
                        $scope.currentImg = $scope.imgArr[0];
                        $scope.initcalendar($scope.repairDate1, $scope.repairDate2, $scope.repairDate1, '.date-endDate');
                    } else {
                        var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                    $rootScope.$apply();
                }
            });
        }
        $scope.repairProgress();



        // repair new 新建维修
        $scope.newRepair = function () {
            if (!$scope.orderTaker.id) {
                return $scope.manerror = true;
            }
            if (!$scope.faultDesc) {
                return $scope.faultDescErr = true;
            }
            $.ajax({
                type: "post",
                url: "/newrepair/repRepairApply/add",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify({
                    "assetsBrand": $scope.assetsInfo.assetsBrand,
                    "assetsDeptId": $scope.assetsInfo.deptId,
                    "assetsDeptName": $scope.assetsInfo.deptName,
                    "assetsId": $scope.assetsInfo.assetsId,
                    "assetsImg": $scope.urls.join(','),
                    "assetsFile": JSON.stringify($scope.repairFiles),
                    "assetsDesc": 1, // 资产类型
                    "serialNum": $scope.assetsInfo.serialNum, // 院内编码
                    "reportStatus": $scope.radio.radioT,
                    "sendPerson": $scope.sendInfo.sendPerson, //送修人
                    "sendPhone": $scope.sendInfo.sendPhone, //送修电话
                    "takeOrderId": $scope.orderTaker.id,
                    "takeOrderName": $scope.orderTaker.realName,
                    "assetsName": $scope.assetsInfo.assetsName,
                    "assetsNum": $scope.assetsInfo.assetsNum,
                    "assetsSpec": $scope.assetsInfo.assetsSpec,
                    "assetsStatus": $scope.assetsInfo.status,
                    "factoryName": $scope.assetsInfo.factoryName,
                    "factoryNum": $scope.assetsInfo.factoryNum,
                    "tenantId": $localStorage.userInfo.tenantId,
                    "faultDesc": $scope.faultDesc,
                    "startUseDate": $scope.assetsInfo.startUseDate,
                    "deptId": $localStorage.userInfo.deptId,
                    "warrantyDate": $scope.assetsInfo.warrantyDate
                }),
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        $state.go('repair.newweixiu', { status: 6, assetsId: $stateParams.assetsId, applyId: res.responseJSON.data.id }, { reload: true });
                    } else {
                        var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                    $rootScope.$apply();
                }
            });
        }
        // 故障描述
        $scope.faultDesc = '';
        $scope.repairDesAdd = function (a) {
            $scope.faultDesc += a;
            $scope.faultDesc = $scope.faultDesc.slice(0, 300);
        }
        // repair order search 查询接单信息
        $scope.repairTakeOrder = function () {
            $.ajax({
                type: "get",
                url: "/newrepair/repRepairTakeOrders/search/" + $stateParams.applyId,
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        $scope.repairDetail.repairName = res.responseJSON.data.repairName
                        $scope.repairDetail.predictReachDate = res.responseJSON.data.predictReachDate;
                        $scope.remarks = res.responseJSON.data.remarks;
                    } else {
                        var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                    $rootScope.$apply();
                }
            });
        }
        // repair order take /newrepair/repRepairTakeOrders/taking 接单
        $scope.takeOrder = function () {

            $.ajax({
                type: "post",
                url: "/newrepair/repRepairTakeOrders/taking",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify({
                    "applyId": $stateParams.applyId,
                    "predictReachDate": $scope.predictReachDate,
                    "remarks": $scope.remarks,
                    "takeOrderId": $localStorage.userInfo.id,
                    "takeOrderName": $localStorage.userInfo.realName,
                    "takeOrderTime": new Date().getTime(),
                    "repairId": $scope.repairmanIdsure,
                    "repairName": $scope.repairmanNamesure
                }),
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        // 之前的接单直接本页面状态改变
                        // $state.go('repair.newweixiu',{status: 2,assetsId: $stateParams.assetsId,applyId: $stateParams.applyId},{reload: true});
                        $state.go('repair.manage', { tenantId: ($stateParams.tenantId || $localStorage.userInfo.tenantId) })
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


        }
        $timeout(function () { $scope.initcalendar($scope.predictReachDate, $scope.predictReachDate, $scope.predictReachDate, '.date-preTimeDate'); }, 10);
        $scope.predictReachDate = new Date().getTime();
        $scope.preTimeTypeNum = 0;
        $scope.preTimeType = function (a) {
            $scope.preTimeTypeNum = a;
            $scope.predictReachDate = new Date().setTime(new Date().getTime() + a * 1000 * 60 * 60);
        }
        $scope.$watch('predictReachDate', function (newValue, oldValue, scope) {
            $scope.initcalendar(newValue, $scope.predictReachDate, '', '.date-preTimeDate');
            $('#predictReachDateInput').val($filter('date')(newValue, 'yyyy-MM-dd HH:mm'));
        });
        // 删除文件
        $scope.deleteRepairDoc = function () {
            $scope.repairUploadDoc = '';
            $('.repairUploadDocInput')[0].files = [];
        }
        // 维修方式切换初始化
        $scope.$watch('radio.radioV', function (newValue, oldValue, scope) {
            $scope.repairPhenomErr = false;
            $scope.repairReasonErr = false;
            $scope.repairWorkErr = false;
            if ($stateParams.status != 2) {
                return;
            }
            $scope.outsideCompanyErr = false;
            $scope.outsidePhoneErr = false;
            $scope.engineerNameErr = false;
            $scope.engineerNumErr = false;
            $scope.outsideHours = false;
            $rootScope.radio = { radioV: newValue };
            $rootScope.radio.repairResultR = 1;
            $scope.repairObj = {};
            $scope.partList = [];
            $scope.partListHad = false;
            $scope.addWork = [];
            $scope.addReason = [];
            $scope.addphenom = [];
            $timeout(function () {
                $scope.repairObj.sendPerson = $scope.sendInfo.sendPerson;
                $scope.repairObj.sendPhone = $scope.sendInfo.sendPhone;
                var time = new Date().getTime();
                if (newValue == 3) {
                    $scope.repairEndDate = '';
                    $scope.actualEndDate = '';
                    $scope.repairStartDate = '';
                    $scope.actualStartDate = '';
                    return
                }
                $scope.repairObj.repairCost = $scope.repairObj.repairCost ? Number($scope.repairObj.repairCost).toFixed(2) : '0.00';
                $scope.repairObj.materiaCost = $scope.repairObj.materiaCost ? Number($scope.repairObj.materiaCost).toFixed(2) : '0.00';
                $scope.repairObj.totalCost = $scope.repairObj.totalCost ? Number($scope.repairObj.totalCost).toFixed(2) : '0.00';
                if (newValue == 1) {
                    $rootScope.radio.radioS = $rootScope.radio.radioS ? $rootScope.radio.radioS : 1;
                    $scope.repairDate2 = $scope.repairEndDate ? $scope.repairEndDate : time;
                    $scope.repairTrue1 = $scope.actualStartDate ? $scope.actualStartDate : $scope.repairList.takeOrderTime;
                    $scope.repairTrue2 = $scope.actualEndDate ? $scope.actualEndDate : time;
                    $scope.repairDate1 = $scope.repairStartDate ? $scope.repairStartDate : $scope.repairList.reportRepairDate;
                    var t, b, l;
                    t = $scope.repairDate2 - $scope.repairDate1;
                    t = t > 0 ? t : 1;
                    $scope.repairDate1 && $scope.repairDate2 && (
                        $scope.repairTime.day = Math.floor(t / 3600000 / 24),
                        $scope.repairTime.hour = Math.ceil(t / 3600000 % 24)
                    );
                    b = t;
                    $scope.repairTime.hour == 24 ? ($scope.repairTime.day = $scope.repairTime.day + 1, $scope.repairTime.hour = 0) : '';
                    t = $scope.repairTrue2 - $scope.repairTrue1;
                    t = t > 0 ? t : 1;
                    l = Math.abs($scope.repairDate1 - $scope.repairTrue1);
                    $scope.repairTrue1 && $scope.repairTrue2 && (
                        $scope.repairTrue.day = Math.floor(t / 3600000 / 24),
                        $scope.repairTrue.hour = Math.ceil(t / 3600000 % 24)
                    );
                    $scope.repairWaitTime.day = Math.floor(l / 3600000 / 24);
                    $scope.repairWaitTime.hour = Math.ceil(l / 3600000 % 24);
                    $scope.repairWaitTime.hour == 24 ? ($scope.repairWaitTime.day = $scope.repairWaitTime.day + 1, $scope.repairWaitTime.hour = 0) : '';
                    $scope.repairTrue.hour == 24 ? ($scope.repairTrue.day = $scope.repairTrue.day + 1, $scope.repairTrue.hour = 0) : '';
                    $scope.initcalendar(time, $scope.repairDate2, $scope.repairDate1, '.date-endDate');
                    $scope.initcalendar(time, $scope.repairTrue1, time, '.true-startDate');
                    $scope.initcalendar(time, $scope.repairTrue2, $scope.repairTrue1, '.true-endDate');
                    $scope.initcalendar(0, $scope.repairDate1, 0, '.date-startDate');
                    return;
                }
                $scope.repairEndDate = '';
                $scope.actualEndDate = '';
                $scope.repairStartDate = '';
                $scope.actualStartDate = '';
                $rootScope.radio.radioS = $rootScope.radio.radioS ? $rootScope.radio.radioS : 4;
                $scope.outsideHoursErr = false;
                $scope.$watch('outsideRepairTime.repairHours', function (newValue, oldValue, scope) {
                    $scope.outsideHoursErr = false;
                    $scope.outsideHours = false;
                });
                $scope.$watch('outsideRepairTime.callRepairDate', function (newValue, oldValue, scope) {
                    $scope.outsideCall = false;
                    $scope.outsideRepairTime.callRepairDate1 = $filter('date')(newValue, 'yyyy-MM-dd HH:mm');
                });
                $scope.outsideHoursBlur = function () {
                    if ($scope.outsideRepairTime.arrivalDate && $scope.outsideRepairTime.leaveDate) {
                        var temp;
                        temp = ($scope.outsideRepairTime.leaveDate - $scope.outsideRepairTime.arrivalDate) / 3600000;
                        $scope.outsideHoursErr = (temp >= $scope.outsideRepairTime.repairHours) ? false : true;
                    }
                }
                $scope.$watch('outsideRepairTime.arrivalDate', function (newValue, oldValue, scope) {
                    $scope.outsideArrival = false;
                    $scope.outsideRepairTime.arrivalDate1 = $filter('date')(newValue, 'yyyy-MM-dd HH:mm');
                    if ($scope.outsideRepairTime.arrivalDate && $scope.outsideRepairTime.leaveDate) {
                        $scope.outsideRepairTime.repairHours = ($scope.outsideRepairTime.leaveDate - $scope.outsideRepairTime.arrivalDate) / 3600000;
                        $scope.outsideRepairTime.repairHours = $scope.outsideRepairTime.repairHours.toFixed(1);
                        $scope.outsideRepairTime.repairHours = $scope.outsideRepairTime.repairHours > 0 ? $scope.outsideRepairTime.repairHours : 0;
                    }
                });
                $scope.$watch('outsideRepairTime.leaveDate', function (newValue, oldValue, scope) {
                    $scope.outsideLeave = false;
                    $scope.initcalendar(time + 1, $scope.outsideRepairTime.arrivalDate ? $scope.outsideRepairTime.arrivalDate : time, $scope.outsideRepairTime.callRepairDate ? $scope.outsideRepairTime.callRepairDate : time, '.date-arrivalDate', $scope.outsideRepairTime.leaveDate ? $scope.outsideRepairTime.leaveDate : '');
                    $scope.outsideRepairTime.leaveDate1 = $filter('date')(newValue, 'yyyy-MM-dd HH:mm');
                    if ($scope.outsideRepairTime.arrivalDate && $scope.outsideRepairTime.leaveDate) {
                        $scope.outsideRepairTime.repairHours = ($scope.outsideRepairTime.leaveDate - $scope.outsideRepairTime.arrivalDate) / 3600000;
                        $scope.outsideRepairTime.repairHours = $scope.outsideRepairTime.repairHours.toFixed(1);
                        $scope.outsideRepairTime.repairHours = $scope.outsideRepairTime.repairHours > 0 ? $scope.outsideRepairTime.repairHours : 0;
                    }
                });
                $scope.outsideRepairTime = $scope.outsideRepairTime ? $scope.outsideRepairTime : {
                    callRepairDate: '',
                    arrivalDate: '',
                    leaveDate: '',
                    repairHours: '',
                };
                $scope.initcalendar(time, $scope.outsideRepairTime.callRepairDate ? $scope.outsideRepairTime.callRepairDate : time, 0, '.date-callRepairDate');
                $scope.initcalendar(time + 1, $scope.outsideRepairTime.arrivalDate ? $scope.outsideRepairTime.arrivalDate : time, $scope.outsideRepairTime.callRepairDate ? $scope.outsideRepairTime.callRepairDate : time, '.date-arrivalDate', $scope.outsideRepairTime.leaveDate ? $scope.outsideRepairTime.leaveDate : '');
                $scope.initcalendar(time + 2, $scope.outsideRepairTime.leaveDate ? $scope.outsideRepairTime.leaveDate : time, $scope.outsideRepairTime.arrivalDate ? $scope.outsideRepairTime.arrivalDate : time, '.date-leaveDate');

                angular.element('.repairUploadDocInput').change(function () {
                    var _type = $(this)[0].files[0].type;
                    var _size = $(this)[0].files[0].size / (1024 * 1024);
                    var msg;
                    if (_size > 10) {
                        angular.element('.repairUploadDocInput').val('');
                        return msg = layer.msg('<div class="toaster"><span>' + '文件大于10M，上传失败' + '</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                    if (_type == 'image/png' || _type == 'image/jpg' || _type == 'image/jpeg' || _type == 'application/vnd.ms-excel' || _type == 'application/pdf' || _type == 'application/msword' || _type == 'application/vnd.ms-powerpoint ') {
                        $scope.repairUploadImg($(this)[0].files[0], 0, 1);
                        $scope.repairUploadDoc = $(this)[0].files[0].name;
                        $rootScope.$apply();
                    } else {
                        angular.element('.repairUploadDocInput').val('');
                        msg = layer.msg('<div class="toaster"><span>' + '图片格式错误，上传失败' + '</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                });
            }, 10);
        });

        // repair report save 
        $scope.first = false;
        $scope.two = false;
        $scope.three = false;
        $scope.four = false;
        $scope.five = false;
        $scope.six = false;
        $scope.seven = false;
        $scope.nine = false;
        $scope.eleven = false;
        $scope.twolve = false;
        $scope.partList = []
        $scope.writeRepairReportShow = true;
        $rootScope.radio.repairResultR = 1;
        // 数组转字符串
        $scope.arrToString = function (a) {
            var str = '';
            for (var i = 0; i < a.length; i++) {
                str += a[i].name;
                str += ',';
            }
            return str.substr(0, str.length - 1);
        }
        $scope.arrToString1 = function (a) {
            var str = '';
            for (var i = 0; i < $scope[a].length; i++) {
                str += $scope[a][i].name;
                str += '；';
            }
            return str.substr(0, str.length - 1);
        }
        $scope.repairErrChange = function (a, b) {
            $scope[a] = false;
            ($scope['repairObj'][b]) && ($scope['repairObj'][b] = $scope['repairObj'][b].substr(0, 40));
        }
        $scope.repairErrChangeHour = function () {
            $scope.outsideHours = false;
            $scope.outsideRepairTime.repairHours && ($scope.outsideRepairTime.repairHours = $scope.outsideRepairTime.repairHours.substr(0, 5));
        }
        // 维修中提交 a: 1,暂存 2,完修
        $scope.repairReportSave = function (a) {
            if ($rootScope.radio.radioV != 3) {
                if (a == 2) {
                    (!$scope.addphenom.length) && ($scope.repairPhenomErr = true);
                    (!$scope.addReason.length) && ($scope.repairReasonErr = true);
                    (!$scope.addWork.length) && ($scope.repairWorkErr = true);
                    if ($rootScope.radio.radioV == 2) {
                        (!$scope.repairObj.engineerName) && ($scope.engineerNameErr = true);
                        (!$scope.repairObj.engineerNum) && ($scope.engineerNumErr = true);
                        (!$scope.repairObj.outsideCompany) && ($scope.outsideCompanyErr = true);
                        (!$scope.repairObj.outsidePhone) && ($scope.outsidePhoneErr = true);
                        (!$scope.outsideRepairTime.callRepairDate) && ($scope.outsideCall = true);
                        (!$scope.outsideRepairTime.arrivalDate) && ($scope.outsideArrival = true);
                        (!$scope.outsideRepairTime.leaveDate) && ($scope.outsideLeave = true);
                        (!$scope.outsideRepairTime.repairHours) && ($scope.outsideHours = true);
                    }
                    if ($scope.outsideHoursErr || $scope.repairPhenomErr || $scope.repairReasonErr || $scope.repairWorkErr || $scope.engineerNameErr || $scope.engineerNumErr || $scope.outsideCompanyErr || $scope.outsidePhoneErr || $scope.outsideCall || $scope.outsideArrival || $scope.outsideLeave || $scope.outsideHours) {
                        return;
                    }
                }
                if (a != 2) {
                    $scope.outsideHoursErr = false;
                    $scope.repairPhenomErr = false;
                    $scope.repairReasonErr = false;
                    $scope.repairWorkErr = false;
                    $scope.engineerNameErr = false;
                    $scope.engineerNumErr = false;
                    $scope.outsideCompanyErr = false;
                    $scope.outsidePhoneErr = false;
                    $scope.outsideCall = false;
                    $scope.outsideArrival = false;
                    $scope.outsideLeave = false;
                    $scope.outsideHours = false;
                }
            }
            var data = {
                "actualEndDate": $scope.repairTrue2, //维修时间
                "actualStartDate": $scope.repairTrue1, // 接单时间
                "applyId": $stateParams.applyId,
                "attachment": JSON.stringify($scope.attachment), // 附件
                "faultPhenomenon": $scope.arrToString($scope.addphenom),
                "faultReason": $scope.arrToString($scope.addReason),
                "faultType": $rootScope.radio.radioS,
                "list": $scope.partList,
                "modeStatus": $rootScope.radio.radioV,
                "partsCost": $scope.repairObj.materiaCost,
                "remarks": $scope.repairObj.remark,
                "repairCost": $scope.repairObj.repairCost,
                "sendPerson": $scope.repairObj.sendPerson, //送修人
                "sendPhone": $scope.repairObj.sendPhone, //送修电话
                "repairEndDate": $scope.repairDate2, // 完修时间
                "troubleCode": $scope.repairObj.troubleCode,
                "repairId": 0,
                "repairInvoice": $scope.repairObj.repairInvoice,
                "repairName": $localStorage.userInfo.realName,
                "repairResult": $rootScope.radio.repairResultR,
                "repairStartDate": $scope.repairDate1, // 申请时间
                "status": a, // 1，暂存 2，完修
                "totalCost": $scope.repairObj.totalCost,
                "reportStatus": $scope.reportStatus,//1.送修，2.现场维修
                "workContent": $scope.arrToString($scope.addWork)
            };
            if ($rootScope.radio.radioV == 2) {
                data.outsideCompany = $scope.repairObj.outsideCompany;
                data.outsidePhone = $scope.repairObj.outsidePhone;
                data.engineerNum = $scope.repairObj.engineerNum;
                data.engineerName = $scope.repairObj.engineerName;
                data.callRepairDate = $scope.outsideRepairTime.callRepairDate;
                data.arrivalDate = $scope.outsideRepairTime.arrivalDate;
                data.leaveDate = $scope.outsideRepairTime.leaveDate;
                data.repairHours = $scope.outsideRepairTime.repairHours;
                delete data.actualStartDate;
                delete data.actualEndDate;
                delete data.repairStartDate;
                delete data.repairEndDate;
            }
            $.ajax({
                type: "post",
                url: "/newrepair/repRepairReport/save",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(data),
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        if (a == 1) {
                            var msg = layer.msg('<div class="toaster"><span>暂存成功</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0
                            });
                        }
                        (a == 2) && $state.go('repair.newweixiu', { status: 5, assetsId: $stateParams.assetsId, applyId: $stateParams.applyId }, { reload: true });
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
        }
        // 查看大图
        $scope.imgArr = [
            { src: '../../res/img/dt.png', index: 0 }
        ];
        $scope.currentImg = $scope.imgArr[0];
        $scope.repairPicsShow = false;
        $scope.repairPicChange = function (a, b) {
            if ($scope.currentImg.index == 0 && a == -1 || $scope.currentImg.index == ($scope.imgArr.length - 1) && a == 1) {
                return;
            }
            if (a != 2) {
                var index = $scope.currentImg.index + a;
                $scope.currentImg = $scope.imgArr[index];
            } else {
                $scope.currentImg = $scope.imgArr[b];
            }
        }
        // 获取维修报告单详情 /newrepair/repRepairReport/search/
        $scope.listToObj = function (a) {
            var arr = [];
            if (!a) {
                return arr;
            }
            for (var i = 0; i < a.length; i++) {
                arr.push({ name: a[i] });
            };
            return arr;
        }
        $scope.repairWaitTime = {
            day: 0,
            hour: 0
        };
        // 维修结果对照
        $scope.repairResultSwitch = function () {
            switch ($scope.radio.repairResultR) {
                case 1:
                    return '正常工作';
                    break;
                case 2:
                    return '基本功能正常';
                    break;
                case 3:
                    return '需进一步修理';
                    break;
                case 4:
                    return '需外送修理';
                    break;
                case 5:
                    return '无法修复';
                    break;
                case 6:
                    return '其他';
                    break;
                default:
                    break;
            }
        }
        // 获取维修报告单详情
        $scope.getRepairReportDetail = function () {
            if (!$stateParams.applyId) {
                return;
            }
            $.ajax({
                type: "get",
                url: "/newrepair/repRepairReport/search/" + $stateParams.applyId,
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        var result = res.responseJSON.data;
                        $scope.flag = result.flag;
                        $scope.sendInfo = {
                            sendPerson: result.sendPerson,
                            sendPhone: result.sendPhone
                        };
                        $rootScope.radio.radioV = result.modeStatus ? result.modeStatus : 3;
                        $timeout(function () {
                            $scope.repairObj.troubleCode = result.troubleCode;
                            $scope.repairObj.sendPerson = result.sendPerson;
                            $scope.repairObj.sendPhone = result.sendPhone;
                            $scope.repairObj.attachment = result.attachment ? JSON.parse(result.attachment) : [];
                            $scope.repairObj.remark = result.remarks;
                            console.log($scope.reportStatus)
                            if (result.id) {
                                $scope.reportStatus = result.reportStatus ? result.reportStatus : 1;
                            }

                            console.log($scope.reportStatus)
                            $scope.attachment = $scope.repairObj.attachment.length ? $scope.repairObj.attachment : [];
                            console.log($scope.attachment);
                            for (var i = 0; i < $scope.attachment.length; i++) {
                                $scope.attachment[i].imgUrlEn = encodeURI(encodeURI($scope.attachment[i].uploadUrl));
                            };
                            if ($rootScope.radio.radioV == 3) {
                                return
                            }

                            $rootScope.radio.radioS = result.faultType;

                            $rootScope.radio.repairResultR = result.repairResult;
                            $scope.repairObj.totalCost = result.totalCost ? Number(result.totalCost).toFixed(2) : '0.00';
                            $scope.repairObj.repairCost = result.repairCost ? Number(result.repairCost).toFixed(2) : '0.00';
                            $scope.repairObj.repairInvoice = result.repairInvoice;
                            $scope.repairObj.materiaCost = result.partsCost ? Number(result.partsCost).toFixed(2) : '0.00';
                            var time = new Date().getTime();
                            if ($rootScope.radio.radioV == 2) {
                                $scope.repairObj.outsideCompany = result.outsideCompany;
                                $scope.repairObj.outsidePhone = result.outsidePhone;
                                $scope.repairObj.engineerName = result.engineerName;
                                $scope.repairObj.engineerNum = result.engineerNum;
                                $scope.outsideRepairTime = {};
                                $scope.outsideRepairTime.repairHours = result.repairHours;
                                $scope.outsideRepairTime.callRepairDate = result.callRepairDate;
                                $scope.outsideRepairTime.callRepairDate1 = $filter('date')(result.callRepairDate, 'yyyy-MM-dd HH:mm');
                                $scope.outsideRepairTime.arrivalDate1 = $filter('date')(result.arrivalDate, 'yyyy-MM-dd HH:mm');
                                $scope.outsideRepairTime.leaveDate1 = $filter('date')(result.leaveDate, 'yyyy-MM-dd HH:mm');
                                $scope.outsideRepairTime.arrivalDate = result.arrivalDate;
                                $scope.outsideRepairTime.leaveDate = result.leaveDate;
                                $scope.initcalendar(time, result.callRepairDate ? result.callRepairDate : time, 0, '.date-callRepairDate');
                                $scope.initcalendar(time, result.arrivalDate ? result.arrivalDate : time, result.callRepairDate ? result.callRepairDate : time, '.date-arrivalDate', $scope.outsideRepairTime.leaveDate ? $scope.outsideRepairTime.leaveDate : time);
                                $scope.initcalendar(time, result.leaveDate ? result.leaveDate : time, result.arrivalDate ? result.arrivalDate : (result.callRepairDate ? result.callRepairDate : time), '.date-leaveDate');
                            }
                            $scope.addWork = $scope.listToObj(result.workContentList);
                            $scope.addphenom = $scope.listToObj(result.faultPhenomenonList);
                            $scope.addReason = $scope.listToObj(result.faultReasonList);
                            $scope.partList = result.list;
                            ($scope.partList) && ($scope.partList.length) && ($scope.partList.length != 0) && ($scope.partListHad = true);
                            if ($rootScope.radio.radioV == 1) {
                                $scope.repairEndDate = result.repairEndDate;
                                $scope.actualEndDate = result.actualEndDate;
                                $scope.repairStartDate = result.repairStartDate;
                                $scope.actualStartDate = result.actualStartDate;
                                $scope.repairDate1 = result.repairStartDate ? result.repairStartDate : $scope.repairList.reportRepairDate;
                                $scope.repairDate2 = result.repairEndDate ? result.repairEndDate : time;
                                $scope.repairTrue1 = result.actualStartDate ? result.actualStartDate : $scope.repairList.takeOrderTime;

                                $scope.repairTrue2 = result.actualEndDate ? result.actualEndDate : time;
                                var t, b, l;
                                t = $scope.repairDate2 - $scope.repairDate1;
                                t = t > 0 ? t : 1;
                                $scope.repairDate1 && $scope.repairDate2 && (
                                    $scope.repairTime.day = Math.floor(t / 3600000 / 24),
                                    $scope.repairTime.hour = Math.ceil(t / 3600000 % 24)
                                );
                                b = t;
                                $scope.repairTime.hour == 24 ? ($scope.repairTime.day = $scope.repairTime.day + 1, $scope.repairTime.hour = 0) : '';
                                t = $scope.repairTrue2 - $scope.repairTrue1;
                                t = t > 0 ? t : 1;
                                l = Math.abs($scope.repairDate1 - $scope.repairTrue1);
                                $scope.repairTrue1 && $scope.repairTrue2 && (
                                    $scope.repairTrue.day = Math.floor(t / 3600000 / 24),
                                    $scope.repairTrue.hour = Math.ceil(t / 3600000 % 24)
                                );
                                $scope.repairWaitTime.day = Math.floor(l / 3600000 / 24);
                                $scope.repairWaitTime.hour = Math.ceil(l / 3600000 % 24);
                                $scope.repairWaitTime.hour == 24 ? ($scope.repairWaitTime.day = $scope.repairWaitTime.day + 1, $scope.repairWaitTime.hour = 0) : '';
                                $scope.repairTrue.hour == 24 ? ($scope.repairTrue.day = $scope.repairTrue.day + 1, $scope.repairTrue.hour = 0) : '';
                                $scope.initcalendar($scope.repairDate1, $scope.repairDate2, $scope.repairDate1, '.date-endDate');
                                $scope.initcalendar($scope.repairTrue1, $scope.repairTrue2, $scope.repairTrue1, '.true-endDate');
                                $scope.initcalendar(0, $scope.repairDate1, 0, '.date-startDate');
                                $scope.initcalendar($scope.repairDate1, $scope.repairTrue1, $scope.repairDate1, '.true-startDate');
                            }

                        });
                    } else {
                        var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                    $rootScope.$apply();
                }
            });
        }
        $scope.getRepairReportDetail();
        // 打印维修申请单
        $scope.preLookRepairRequest = function () {
            var index = layer.open({
                time: 0
                , type: 1
                , content: $('#repairRequestPrint')
                , title: ['打印维修申请单', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                , closeBtn: 1
                , shade: 0.3
                , shadeClose: true
                , btn: 0
                , area: ['1104px', '562px']
            });
        }
        // 维修报告单 a?报告单:预览报告单
        $scope.preLookRepairReport = function (a) {
            $scope.repairInfo.currentTime = a ? $scope.repairList.repairDate : new Date().getTime();
            for (var i = 0; i < $scope.attachment.length; i++) {
                $scope.attachment[i].imgUrlEn = encodeURI(encodeURI($scope.attachment[i].uploadUrl));
            };
            $scope.repairReportInfo = $.extend({
                repairInfo: $scope.repairInfo,
                repairList: $scope.repairList,
                addphenom: $scope.addphenom.length ? $scope.arrToString1('addphenom') : '',
                addReason: $scope.addReason.length ? $scope.arrToString1('addReason') : '',
                partListHad: $scope.partListHad,
                printPower: ($stateParams.status > 2) && ($localStorage.userInfo.authoritiesStr.indexOf('REP_APPLY_PUT') != -1),
                addWork: $scope.addphenom.length ? $scope.arrToString1('addWork') : '',
                reportStatus: $scope.reportStatus,
                partList: $scope.partList,
                repairDate1: $scope.repairDate1,
                repairWaitTime: $scope.repairWaitTime,
                repairResultSwitch: $scope.repairResultSwitch(),
                repairTrue: $scope.repairTrue,
                repairDate2: $scope.repairDate2
            }, $scope.outsideRepairTime, $scope.repairObj);
            $scope.repairReportInfo.attachment = $scope.attachment;
            $scope.repairReportInfo.reportPrint = false;
            console.log($scope.repairReportInfo);
            var index = layer.open({
                time: 0
                , type: 1
                , content: $('#PreRepairReportBill')
                , title: [a ? '打印维修报告单' : '维修报告单预览', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                , closeBtn: 1
                , shade: 0.3
                , shadeClose: true
                , btn: 0
                , area: ['1104px', '562px']
            });
        }

        $scope.methods = {
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
            listToObj: function (a) {
                if (a) {
                    return a.join("；");
                }
                return '';
            },
            disPrint: function () {
                var applyId = $stateParams.applyId;
                $scope.methods.getServerData("/newrepair/repRepairApply/getApplyDetails/" + applyId, function (repairList) {
                    $scope.methods.getServerData("/newrepair/repRepairApply/search/" + applyId, function (data) {
                        $scope.assetsInfo = data;
                        $scope.methods.getServerData("/newrepair/repRepairReport/search/" + applyId, function (data2) {
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
                                addphenom: $scope.methods.listToObj(data2.faultPhenomenonList), // 维修内容-故障现象
                                troubleCode: data2.troubleCode, // 维修内容-故障代码
                                addReason: $scope.methods.listToObj(data2.faultReasonList), // 维修内容-故障原因
                                addWork: $scope.methods.listToObj(data2.workContentList), // 维修内容-工作内容

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

        // 维修验收
        $scope.repairCheckOut = function () {
            $.ajax({
                type: "post",
                url: '/newrepair/repRepairCheck/check',
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify({
                    'applyId': $stateParams.applyId,
                    'remarks': $scope.repairAttitude.assessComent,
                    'repairAttitude': $scope.repairattitudes,
                    'repairCheckId': $localStorage.userInfo.id,
                    'repairCheckName': $localStorage.userInfo.realName,
                    'repairQuality': $scope.repairQuality,
                    'responseSpeed': $scope.responseSpeed
                }),
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        $state.go('repair.newweixiu', { status: 4, assetsId: $stateParams.assetsId, applyId: $stateParams.applyId }, { reload: true });
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
        }
        // 维修流程查看 1
        $scope.lookProgress1 = function () {
            var index = layer.open({
                time: 0
                , type: 1
                , content: $('#repairProgress1')
                , title: ['申请信息', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                , closeBtn: 1
                , shade: 0.3
                , shadeClose: true
                , btn: 0
                , area: ['1142px', '603px']
            });
        }
        // 维修流程查看 2
        $scope.lookProgress2 = function () {
            var index = layer.open({
                time: 0
                , type: 1
                , content: $('#repairProgress2')
                , title: ['接单详情', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                , closeBtn: 1
                , shade: 0.3
                , shadeClose: true
                , btn: 0
                , area: ['462px', '250px']
            });
        }
        // 查看维修流程验收
        $scope.lookCheckOut = function () {
            var index = layer.open({
                time: 0
                , type: 1
                , content: $('#repairProgress4')
                , title: ['验收详情', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                , closeBtn: 1
                , shade: 0.3
                , shadeClose: true
                , btn: 0
                , area: ['445px', '379px']
            });
        }
        // 维修验收情况
        $scope.repairCheckSearch = function () {
            $.ajax({
                type: "get",
                url: '/newrepair/repRepairCheck/search/' + $stateParams.applyId,
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        var result = res.responseJSON.data;
                        $scope.repairAttitude.assessComent = result.remarks;
                        $scope.repairServerStar("repairAttitude", result.repairAttitude, "attitude");
                        $scope.repairServerStar("repairRespond", result.responseSpeed, "respond");
                        $scope.repairServerStar("repairMass", result.repairQuality, "quality");
                        $rootScope.$apply();
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
        }
        // 确认框 yes回调
        $scope.repairAlertYes = function () {
            layer.closeAll();
            $scope.repairAlertConfirm = false;
            switch (Number($stateParams.status)) {
                case 1:
                    $scope.takeOrder();
                    break;
                case 2:
                    $scope.repairReportSave(2);
                    break;
                case 3:
                    $scope.repairCheckOut();
                    break;
                case 4:
                    break;
                case 0:
                    $scope.newRepair();
                    break;
                default:
                    break;
            }
        }
        // 确认框
        $scope.repairAlertLayer = function (a) {
            if (a) {
                if (!$scope.repairmanNamesure) {
                    $scope.manerror = true
                } else {
                    var index = layer.open({
                        time: 0
                        , type: 1
                        , content: $('#repairAlertConfirm')
                        , title: ['提示', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                        , closeBtn: 1
                        , shade: 0.3
                        , shadeClose: true
                        , btn: 0
                        , area: ['520px', '250px']
                    });
                }
            } else {
                var index = layer.open({
                    time: 0
                    , type: 1
                    , content: $('#repairAlertConfirm')
                    , title: ['提示', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                    , closeBtn: 1
                    , shade: 0.3
                    , shadeClose: true
                    , btn: 0
                    , area: ['520px', '250px']
                });
            }
        }
        $scope.usualLayerClose = function () {
            layer.closeAll();
        }
        // print 打印
        $scope.usualRepairPrint = function (a) {
            //fy_repairReportBillCon
            layer.closeAll();
            var dom = $('#fy_repairReportBillCon');
            a && (dom = $('#repairRequestPrintCon'));
            !a && ($scope.repairReportInfo.reportPrint = true);
            setTimeout(function () {
                dom.jqprint();
                !a && ($scope.repairReportInfo.reportPrint = false);
            }, 100);
        }
        // 接单类型
        $scope.radioNew = function (a) {
            $scope.reportStatus = a
        }
        // 维修人的接口

        $scope.peopleList2 = []

        // 选择维修人nameAlert
        $scope.showPeople = function () {
            if ($scope.assetsInfo.turnNum < 5) {
                $scope.newError = false
                $scope._index = -1;
                $scope.toId = -1;
                $scope.toName = '';
                var index = layer.open({
                    time: 0
                    ,
                    type: 1
                    ,
                    content: $('#nameAlert')
                    ,
                    title: ['选择维修人', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                    ,
                    closeBtn: 1
                    ,
                    shade: 0.3
                    ,
                    shadeClose: true
                    ,
                    btn: 0
                    ,
                    area: ['700px', '500px']
                });
                console.log($scope.toId)
                console.log($scope.toName)
                // $rootScope.$apply();
            } else {
                var msg = layer.msg('<div class="toaster"><span>已转单5次，无法再转单</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
            }

        }
        // 选中维修人对勾出现
        $scope.choosePeopleturn = function (l, index) {
            $scope._index = index;
            $scope.toId = l.id;
            $scope.toName = l.realName;
            $scope.orderTaker = {
                id: l.id,
                mobile: l.mobile,
                realName: l.realName
            };
            $scope.newError = false;
            console.log($scope.orderTaker);
        }
        $scope.getPeople = function () {
            console.log($scope.assetsInfo);
            $.ajax({
                type: "get",
                url: '/newrepair/repRepairConfig/selectConfiger',
                data: {
                    deptId: $scope.assetsInfo.deptId
                },
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        var obj = {
                            id: null,
                            mobile: null,
                            realName: null
                        };
                        $scope.orderTaker = res.responseJSON.data ? res.responseJSON.data : obj;
                        $scope._indexId = $scope.orderTaker ? $scope.orderTaker.id ? $scope.orderTaker.id : null : null;
                        $scope.$apply();
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
            })
        }
        $scope.turnCancle = function () {
            // $scope._index  = $scope._indexSure
            console.log($scope.toId)
            console.log($scope.toName)
            layer.closeAll();
        }
        // 点击确定转单
        $scope.repairPeopleYes = function () {
            console.log($scope.toId)
            console.log($scope.toName)
            if (!$scope.toName) {
                console.log($scope.turnNum)
                if ($scope.assetsInfo.turnNum < 5) {
                    $scope.newError = true
                } else {
                    console.log($scope.turnNum)
                    $scope.newError = false
                    layer.closeAll();
                }

            } else {
                layer.closeAll();
                console.log('======')
                console.log($scope.assetsInfo.turnNum < 5)
                if ($scope.assetsInfo.turnNum < 5) {
                    // 发送转单请求
                    $.ajax({
                        contentType: "application/json;charset=UTF-8",
                        type: "post",
                        url: '/newrepair/repRepairApply/turnOrder',
                        data: JSON.stringify({
                            applyId: $stateParams.applyId,
                            toId: $scope.toId,
                            toName: $scope.toName
                        }),
                        complete: function (res) {
                            if (res.responseJSON.code == 200) {
                                var msg = layer.msg('<div class="toaster"><span>转单成功</span></div>', {
                                    area: ['100%', '60px'],
                                    time: 3000,
                                    offset: 'b',
                                    shadeClose: true,
                                    shade: 0
                                });
                                setTimeout(function () {
                                    // 跳转到列表页
                                    $state.go('repair.manage', { tenantId: ($stateParams.tenantId || $localStorage.userInfo.tenantId) })
                                }, 3000)

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
                } else {
                    layer.closeAll();
                }

            }
        }
        // 查看转单记录
        $scope.showRecode = function () {
            $.ajax({
                type: "get",
                url: '/newrepair/repRepairApply/turnOrderRecord/' + $stateParams.applyId,
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        $scope.recodeList = res.responseJSON.data
                        var index = layer.open({
                            time: 0
                            , type: 1
                            , content: $('#recodeAlert')
                            , title: ['转单记录', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                            , closeBtn: 1
                            , shade: 0.3
                            , shadeClose: true
                            , btn: 0
                            , area: ['420px', '400px']
                        });
                        $rootScope.$apply();
                    }
                }
            })
        };
        // 维修申请时的选择接单人员
        $scope.choosePeopleList = function () {
            $.ajax({
                type: "get",
                url: '/newrepair/repRepairConfig//selectUsers',
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        $scope.peopleListman = res.responseJSON.data
                        $scope.newErrorman = false
                        $scope.newmanError = ''
                        $scope._indexId = $scope._indexIdsure
                        $scope.repairmanName = $scope._repairName
                        console.log($scope.repairmanIdsure)
                        console.log($scope.repairmanNamesure)
                    }
                }
            })
        }
        $scope.choosePeopleList();
        $scope.choosePeople0 = function () {
            var index = layer.open({
                time: 0
                , type: 1
                , content: $('#namemanAlert')
                , title: ['选择接单人', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                , closeBtn: 1
                , shade: 0.3
                , shadeClose: true
                , btn: 0
                , area: ['700px', '500px']
            });
        }
        // 待接单时的默认维修人权限验证
        $scope.checkIsRep = function () {
            $.ajax({
                type: "get",
                url: '/sys/user/checkIsRep',
                data: {
                    id: $scope.repairDetail.takeOrderId
                },
                complete: function (res) {
                    if (res.responseJSON.code == 200 && res.responseJSON.data == 3) { // 1:无权限 2:已停用 3:通过
                        $scope.repairmanIdsure = $scope.repairDetail.takeOrderId;
                        $scope.repairmanNamesure = $scope.repairDetail.takeOrderName;
                        $scope._repairName = $scope.repairmanNamesure;
                        $scope.$apply();
                    }
                }
            })
        }
        // 待接单时的选择维修人员
        $scope.choosePeople = function (a) {
            $.ajax({
                type: "get",
                url: a ? '/newrepair/repRepairConfig//selectUsers' : '/sys/user/getRepUserList',
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        $scope.peopleListman = res.responseJSON.data
                        $scope.newErrorman = false
                        $scope.newmanError = ''
                        $scope._indexId = $scope._indexIdsure
                        $scope.repairmanName = $scope._repairName
                        console.log($scope.repairmanIdsure)
                        console.log($scope.repairmanNamesure)
                        var index = layer.open({
                            time: 0
                            , type: 1
                            , content: $('#namemanAlert')
                            , title: [a ? '选择接单人' : '选择维修人', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                            , closeBtn: 1
                            , shade: 0.3
                            , shadeClose: true
                            , btn: 0
                            , area: ['700px', '500px']
                        });
                        $rootScope.$apply();
                    }
                }
            })
        }
        // 选中维修人对勾出现
        $scope.choosemanPeople = function (l, index) {
            $scope._indexId = l.id;
            $scope.repairmanId = l.id;
            $scope.repairmanName = l.realName;
            $scope.repairMobile = l.mobile;
            $scope.newmanError = false
        }
        // 点击确定
        $scope.choosePeopleYesman = function () {
            if (!$scope.repairmanName) {
                $scope.newmanError = true
            } else {
                $scope.manerror = false
                $scope._indexIdsure = $scope._indexId
                $scope._repairName = $scope.repairmanName
                $scope.repairmanIdsure = $scope.repairmanId
                $scope.repairmanNamesure = $scope.repairmanName
                layer.closeAll();
                $scope.orderTaker = {
                    id: $scope.repairmanIdsure,
                    mobile: $scope.repairMobile,
                    realName: $scope.repairmanName
                };
                console.log($scope.repairmanIdsure)
                console.log($scope.repairmanNamesure)
            }

        }
        // 点击取消
        $scope.peopleCancle = function () {
            $scope._indexId = $scope._indexIdsure
            $scope.repairmanName = $scope._repairName
            console.log($scope.repairmanIdsure)
            console.log($scope.repairmanNamesure)
            layer.closeAll();
        }
    }])