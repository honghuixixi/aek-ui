angular.module('app')
    .controller('inspectionAcceptanceController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'pmUtilService', function($rootScope, $scope, $stateParams, $localStorage, $state, pmUtilService) {
        // 数据
        $scope.data = {
            height: document.body.clientHeight - 130,
            departments: [{ id: 0, name: '全部' }, { id: 1, name: '待验收' }, { id: 2, name: '已验收' }],
            condition: {
                startDt: '',
                endDt: '',
                keyword: ''
            },
            selectItem: {id: 0, name: '全部'},
            list: [],
            loading: true,
            empty: false,
            template: {},
            print: {},
            records: [],
            report: null,
            reportType: 1   // 打印类型1：简易版 2：标准版
        };
        
        // 分页数据
        $scope.pageInfo = {
            pages: 0,
            total: 0,
            size: 16,
            current: 1,
            pstyle: 2
        };
        $scope.changeReportType = function (type) {
            $scope.data.reportType = type;
        };
        $scope.powerChange=function(){
            if($localStorage.userInfo.authoritiesStr.indexOf('QC_CHECK_MANAGE') == -1){
                return $state.go('inspection.plan.list',{tenantId:$stateParams.tenantId||$localStorage.userInfo.tenantId},{reload:true});
            }
        }
        $scope.powerChange();
        $scope.changeItem = function (item) {
            $scope.data.selectItem = item;
            $scope.search();
        };
        // 分页事件
        $scope.pagination = function(page, pageSize) {
            $scope.pageInfo.size = pageSize;
            $scope.getImplementReport(page, pageSize);
        }

        // 查看报告
        $scope.browse = function(id, status) {
            $scope.data.reportType = 1;
            $scope.getReportDetail(id);
            var options = {
                type: 1,
                title: ["打印预览", 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                content: $('#template_ques_acceptance'),
                area: ['1000px', '700px'],
                btn: ['打印', '关闭'],
                yes: function (index) {
                    // $("#template_ques_acceptance").jqprint();
                    $(".modal-tab").hide();
                    $("#template_ques_acceptance").jqprint();
                    $(".modal-tab").show();
                }
            };
            if(status == 1){
                options.btn = ['确认验收', '打印', '关闭'];
                options.btn2 = options.yes;
                options.yes = function (index) {
                    $.ajax({
                        type: 'get',
                        url: '/qc/qcPlanCheck/check/' + id,
                        data: {},
                        complete: function(res) {
                            var msg = '验收成功';
                            layer.close(index);
                            if(res.responseJSON.code != 200){
                                msg = res.responseJSON.msg;
                            }
                            layer.msg('<div class="toaster"><span>' + msg + '</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0,
                                end: function () {
                                    $scope.search();
                                }
                            });
                        }
                    });
                }
            }
            layer.open(options);
        };

        // 获取报告
        $scope.getReportDetail=function(a){
            $.ajax({
                type: 'get',
                url: '/qc/qcImplement/getImplementReport/'+a,
                complete: function(res) {
                    $scope.onloading = false;
                    var data = res.responseJSON.data;
                    if(data.records && data.records.length){
                        for(var i=0,len=data.records.length; i<len; i++){
                            if(data.records[i].answers && data.records[i].answers.length > 0){
                                data.records[i].answers = JSON.parse(data.records[i].answers);
                            }else{
                                data.records[i].answers = {};
                            }
                        }
                    }
                    if (res.responseJSON.code == 200) {
                        $scope.data.print=res.responseJSON.data;
                    }
                    $scope.$apply();
                }
            });
        }
        // 报告查询
        $scope.getImplementReport = function(pageNo, pageSize) {
            var param = {
                pageNo: pageNo,
                pageSize: pageSize,
                userId: $rootScope.userInfo.id
            };
            if($scope.data.condition.keyword.length > 0){
                param.keyword = $scope.data.condition.keyword;
            }
            if($scope.data.selectItem.id > 0){
                param.status = $scope.data.selectItem.id;
            }
            if(($scope.data.condition.startDt + '').length > 0){
                param.startTime = new Date($scope.data.condition.startDt).Format("yyyy-MM-dd") + " 00:00:00";
            }
            if(($scope.data.condition.endDt + '').length > 0){
                param.endTime = new Date($scope.data.condition.endDt).Format("yyyy-MM-dd") + " 23:59:59";
            }
            $scope.data.loading = true;
            $scope.data.list = [];
            $.ajax({
                type: 'get',
                url: '/qc/qcPlanCheck/search',
                data: param,
                complete: function(res) {
                    var data = res.responseJSON.data;
                    $scope.data.loading = false;
                    $scope.pageInfo.current = pageNo;
                    $scope.pageInfo.total = data.total;
                    $scope.data.list = data.records;
                    $scope.data.empty = data.records.length < 1;
                    $scope.$apply();
                }
            });
        };

        // 搜索
        $scope.search = function() {
            $scope.getImplementReport(1, $scope.pageInfo.size);
        };

        // 方法
        function setStartDatepicker(min, max, st, en) {
            pmUtilService.setDatepicker('#startDt', st, en, min, max, function(b) {
                var st = new Date();
                if(($scope.data.condition.endDt + '').length > 0){
                    st = new Date($scope.data.condition.endDt);
                }
                $scope.data.condition.startDt = new Date(b.startDate).getTime();
                setEndDatepicker(new Date(b.startDate), new Date("2050-01-01"), st);
            });
        }

        function setEndDatepicker(min, max, st, en) {
            pmUtilService.setDatepicker('#endDt', st, en, min, max, function(b) {
                var st = new Date();
                if(($scope.data.condition.startDt + '').length > 0){
                    st = new Date($scope.data.condition.startDt);
                }
                $scope.data.condition.endDt = new Date(b.startDate).getTime();
                setStartDatepicker(null, new Date(b.startDate), st);
            });
        }

        // 初始化
        for(var i=0,len=$scope.data.departments.length; i<len; i++){
            if($scope.data.departments[i].id == $stateParams.status){
                $scope.data.selectItem = $scope.data.departments[i];
                break;
            }
        }
        $scope.getImplementReport($scope.pageInfo.current, $scope.pageInfo.size);
        setTimeout(() => {
            setStartDatepicker(null, null, new Date(), null);
            setEndDatepicker(null, null, new Date(), null);
        }, 200);
    }]);