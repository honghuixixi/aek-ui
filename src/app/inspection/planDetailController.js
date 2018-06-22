angular.module('app').controller('planDetailController', ['$rootScope', '$scope', '$stateParams', '$localStorage', function($rootScope, $scope, $stateParams, $localStorage) {
    $scope.data = {
        plan: {
            name: '巡检名称',
            status: 2,
            createTime: 0,
            planNo: '',
            type: '按科室巡检',
            cycle: '',
            preDate: 0,
            nextDate: 0,
            director: '',
            condition: 'cccccccccc',
            analysis: 'aaaaaaaaaaa',
            suggestion: '',
            attention: '剩余2天',
            startDt: '',
            scope: '数据范围',
            endDt: ''
        },
        type: 2, // 1:待巡检；2：巡检中；3：巡检结束
        conType: 1, // 1:巡检范围；2：巡检模板 3：巡检记录
        template: {},
        print: {},
        records: [],
        reportType: 1
    };
    var arr = [];
    for (var i = 0, len = 14; i < len; i++) {
        arr.push({
            id: i + 1,
            equipmentNo: 'H000000012457896321012',
            name: '设备名称设备名称设备名称' + i,
            model: 'HNI-00200221',
            department: '部门名称部门名称',
            remarks: '备注备注备注'
        });
    }
    $scope.data.print = {
        hospital: '医院名称',
        planNo: 'XJJH20171101100001',
        scope: '科室1，科室2，科室3',
        director: '王大锤',
        records: arr
    };
    $scope.changeReportType = function (type) {
        $scope.data.reportType = type;
    };
    $scope.printReport=function(a){
        $scope.data.reportType = 1;
        $scope.getReportDetail(a.id);
        layer.open({
            type: 1,
            title: ["打印预览", 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
            content: $('#template_ques'),
            area: ['1000px', '700px'],
            btn: ['打印', '关闭'],
            yes: function(index, layero) {
                $(".modal-tab").hide();
                $("#template_ques").jqprint();
                $(".modal-tab").show();
            }
        });
    }
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
    $scope.planStop=function(){
        var index=layer.open({
            time: 0 
            ,type: 1
            ,content: $('#inspectionLayer') //1 启用 2 停用 -删除
            ,title: ['提示','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
            ,closeBtn: 1
            ,shade: 0.3
            ,shadeClose: true
            ,yes:function(){
                layer.closeAll();
                $.ajax({
                    type: 'get',
                    url: '/qc/qcPlan/disable/'+$stateParams.planId,
                    complete: function(res) {
                        if (res.responseJSON.code == 200) {
                            $scope.getPlanDetail();
                        }
                    }
                });
            }
            ,btn: ['确定','取消']
            ,area: ['480px','230px']
        });
        
    }
    $scope.getPlanDetail=function(){
        $.ajax({
            type: 'get',
            url: '/qc/qcPlan/'+$stateParams.planId,
            complete: function(res) {
                $scope.onloading = false;
                if (res.responseJSON.code == 200) {
                    $scope.data.plan=res.responseJSON.data;
                }
                $scope.$apply();
            }
        });
    }
    $scope.getPlanDetail();
    $scope.changeConType = function(type) {
        $scope.data.conType = type;
    }
    // 分页
    $scope.pageInfo = {
        total: 30,
        size: 8,
        current: 1
    };
    $scope.getPlanRecords=function(page,size){
        $scope.onloading=true;
        $scope.data.records=[];
        $.ajax({
            type: 'get',
            url: '/qc/qcPlan/getRecord',
            data: {
                id: $stateParams.planId,
                pageNo: page || $scope.pageInfo.current,
                pageSize: size || $scope.pageInfo.size,
            },
            complete: function(res) {
                $scope.onloading = false;
                if (res.responseJSON.code == 200) {
                    $scope.data.records=res.responseJSON.data.records;
                    $scope.pageInfo.total=res.responseJSON.data.total;
                    $scope.pageInfo.pstyle=2;
                    if(res.responseJSON.data.records.length==0){
                        $scope.nocontent=true;
                    }
                }
                $scope.$apply();
            }
        });
    }
    $scope.getPlanRecords();
    // 分页
    $scope.pagination = function(page, pagesize) {
        $scope.pageInfo.size=pagesize;
        $scope.pageInfo.current=page;
        $scope.getPlanRecords(page, pagesize);
    };
}]);