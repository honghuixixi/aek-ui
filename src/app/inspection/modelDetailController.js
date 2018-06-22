angular.module('app')

    .controller('modelDetailController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
        $scope.localStorageHad=function(){
            if(!$localStorage.userInfo){
                return $state.go('website.home');
            }
        }
        $scope.localStorageHad();

        clientHeight();
        function clientHeight(){
            var clientHeight=0;
            if(document.body.clientHeight&&document.documentElement.clientHeight)
            {
                clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
            }
            else
            {
                clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
            }
            $('.fy_accessoryWrap').css('min-height',clientHeight-180+'px');
        }
 
        $scope.optionType = [{id:1,name:'月'},{id:2,name:'天'}];
        $scope.typeList = false;
        $scope.typeModel = $scope.optionType[0];
        $scope.option = function(list, value, item) {
            $rootScope.fixWrapShow = false;
            $scope[list] = false;
            $scope[value] = item;
        }
        $scope.listShow = function(str) {
            if($rootScope.fixWrapShow)
                return $scope.menuHide();
            $scope[str] = true;
            $rootScope.fixWrapShow = true;
        }
        $rootScope.fixWrapShow = false;
        $scope.menuHide = function() {
            $rootScope.fixWrapShow = false;
            $scope.typeList = false;
        }
        // 选择科室
        $scope.searchResults=[];
        $scope.selectResults=[];
        var n = 1;
        do{
            $scope.searchResults.push({id:n,name:'选择科室'+n});
            n++;
        }while(n<16);
        $scope.addItem=function(a){
            for (var i = $scope.selectResults.length - 1; i >= 0; i--) {
                if($scope.selectResults[i].id==a.id){
                    return;
                }
            };
            $scope.selectResults.push(a);
        }
        $scope.delItem=function(a){
            $scope.selectResults.splice(a,1);
        }
        $scope.clearSelect=function(a){
            $scope.selectResults=[];
        }
        $scope.searchDept=function(a){

        }
        var timer;
        timer=setTimeout(function(){
            var time = new Date().getTime();
            $scope.initcalendar(time,'','','.inspectionDate');
        },10);
        $scope.initcalendar = function(start,current,min,ele,max) {
            var option = {
                format: 'YYYY-MM-DD',
                startDate: new Date(),
                endDate: new Date(),
                drops: 'up',
                maxDate: new Date("2050-01-01"),
                opens: 'left',
                timePicker: false,
                singleDatePicker: true
            }
            var obj = {};
            current&&(obj.startDate=new Date(current));
            min&&(obj.minDate=new Date(min));
            max&&(obj.maxDate=new Date(max));
            angular.element(ele).daterangepicker($.extend({}, option, obj), function(date, enddate, el){
                $scope.inspectionDate=new Date(date).getTime();
            });
        }
        // 项目
        // $scope.projectCon=false;
        // $scope.addSelect=function(){
        //     if($scope.project.results.length>4){
        //         return;
        //     }
        //     $scope.project.results.push({
        //         name: '',
        //         time: new Date().getTime(),
        //         err:false,
        //         isDefault: false
        //     });
        // }
        // $scope.delProject=function(a){
        //     $scope.project.results.splice(a,1);
        // }
        // $scope.nameLimit=function(a){
        //     a.name=a.name.substring(0,4);
        //     a.err=false;
        // }
        // $scope.nameAdjust=function(a){
        //     if(!a.name){
        //         return a.err=true;
        //     }
        //     for (var i = 0; i < $scope.project.results.length; i++) {
        //         if($scope.project.results[i].name&&($scope.project.results[i].time!=a.time)&&($scope.project.results[i].name==a.name)){
        //             return a.err=true;
        //         }
        //     };
        // }
        // $scope.projectLimit=function(){
        //     $scope.project.name=$scope.project.name.substring(0,40);
        //     $scope.projectErr=false;
        // }
        // $scope.projectAdjust=function(){
        //     if(!$scope.project.name){
        //         return $scope.projectErr = true;
        //     }
        //     for (var i = $scope.modelSelect.projects.length - 1; i >= 0; i--) {
        //         if($scope.project.id&&($scope.modelSelect.projects[i].id!=$scope.project.id)&&($scope.modelSelect.projects[i].name==$scope.project.name)){
        //             return $scope.projectErr = true;
        //         }
        //     };
        // }
        // $scope.projectErr=false;
        // $scope.editProject=function(a,b,c){
        //     if(c){
        //         return $scope.modelSelect.projects.splice(b,1);
        //     }
        //     $scope.projectCon=true;
        //     $scope.projectErr=false;
        //     if(a){
        //         $scope.project = JSON.stringify(a);
        //         $scope.project = JSON.parse($scope.project); 
        //     }else{
        //         $scope.project={
        //             name: '',
        //             results:[{
        //                 name: '',
        //                 time: new Date().getTime()-1,
        //                 err:false,
        //                 isDefault: false
        //             },{
        //                 name: '',
        //                 time: new Date().getTime(),
        //                 err:false,
        //                 isDefault: false
        //             }]
        //         };
        //     }
        //     var index=layer.open({
        //         time: 0 
        //         ,type: 1
        //         ,content: $('#projectCon')
        //         ,title: ['选择人员','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
        //         ,closeBtn: 1
        //         ,shade: 0.3
        //         ,shadeClose: true
        //         ,end:function(index){
        //             $scope.projectCon=false;
        //         }
        //         ,yes:function(){
        //             if($scope.projectErr){
        //                 return;
        //             }
        //             for (var i = $scope.project.results.length - 1; i >= 0; i--) {
        //                 if($scope.project.results[i].err){
        //                     return;
        //                 }
        //             };
        //             if(b){
        //                 $scope.modelSelect.projects[b]=$scope.project;
        //             }else{

        //             }
        //             layer.closeAll();
        //             $rootScope.$apply();
        //         }
        //         ,btn: ['确定','取消']
        //         ,area: ['616px','423px'] // 423px
        //     });
        // }
        // $scope.modelSelect={name:'模板名称',remarks:'备注内容',status:'启用中',isSys:false,projects:[
        //     {id:1,name:'项目1',results:[{name:'选项11',isDefault:false,time: new Date().getTime()-1,err:false},{name:'选项12',isDefault:false,time: new Date().getTime(),err:false}]},
        //     {id:2,name:'项目2',results:[{name:'选项21',isDefault:false,time: new Date().getTime()-1,err:false},{name:'选项22',isDefault:false,time: new Date().getTime(),err:false}]},
        //     {id:3,name:'项目3',results:[{name:'选项31',isDefault:false,time: new Date().getTime()-1,err:false},{name:'选项32',isDefault:false,time: new Date().getTime(),err:false}]}
        // ]};
        $scope.getModelDetail=function(){
            $.ajax({
                type: 'get',
                url: '/qc/qcTemplate/'+$stateParams.modelId,
                complete: function(res) {
                    if(res.responseJSON.code == 200) {
                        $scope.modelSelect=res.responseJSON.data;
                        $scope.modelSelect.id=$stateParams.modelId;
                    }
                    $rootScope.$apply();
                }
            });
        }
        $scope.getModelDetail();
        // $scope.changeChecked=function(a){
        //     if(a.isDefault){
        //         a.isDefault=false;
        //         return 
        //     }
        //     for (var i = $scope.project.results.length - 1; i >= 0; i--) {
        //         if($scope.project.results[i].time==a.time){
        //             $scope.project.results[i].isDefault=true;
        //         }else{
        //             $scope.project.results[i].isDefault=false;
        //         }
        //     };
        // }
        $scope.operateModel=function(a){
            $.ajax({
                type: a?'get':'delete',
                url: a?(a==1?('/qc/qcTemplate/enable/'+$stateParams.modelId):('/qc/qcTemplate/disable/'+$stateParams.modelId)):('/qc/qcTemplate/delete/'+$stateParams.modelId),
                complete: function(res) {
                    if(res.responseJSON.code == 200) {
                        if(a){
                            //启用/停用 刷新当前页
                            $scope.getModelDetail();
                        }else{
                            //删除 跳列表
                            $state.go('inspection.model.list',{tenantId:$stateParams.tenantId||$localStorage.userInfo.tenantId},{reload:true});
                        }
                    }
                    $rootScope.$apply();
                }
            });
        }
        $scope.editModel=function(a){
            var index=layer.open({
                time: 0 
                ,type: 1
                ,content: $(a?(a==1?'#inspectionLayerU':'#inspectionLayerS'):'#inspectionLayerD') //1 启用 2 停用 -删除
                ,title: ['提示','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                ,closeBtn: 1
                ,shade: 0.3
                ,shadeClose: true
                ,end:function(index){
                }
                ,yes:function(){
                    layer.closeAll();
                    $scope.operateModel(a);
                }
                ,btn: ['确定','取消']
                ,area: ['480px','230px']
            });
        }
    }])

