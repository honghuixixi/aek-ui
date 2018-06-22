angular.module('app')

    .controller('newPlanController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
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
        $scope.planNameChange=function(){
            $scope.planNameErr=false;
            $scope.planName=$scope.planName.substring(0,40);
        }
        $scope.planCycleChange=function(){
            $scope.cycle=parseInt($scope.cycle);
            $scope.cycle=$scope.cycle<366?$scope.cycle:$scope.cycle='';
            $scope.planCycleErr=false;
        }
        // 选择科室
        $scope.searchResults=[];
        $scope.selectResults=[];
        $scope.addItem=function(a){
            for (var i = $scope.selectResults.length - 1; i >= 0; i--) {
                if($scope.selectResults[i].id==a.id){
                    return;
                }
            };
            $scope.planScopeErr=false;
            $scope.selectResults.push(a);
        }
        $scope.delItem=function(a){
            $scope.selectResults.splice(a,1);
        }
        $scope.clearSelect=function(a){
            $scope.selectResults=[];
        }
        $scope.searchDept=function(a){
            $.ajax({
                type: 'get',
                url: '/qc/qcPlan/getDepts',
                data: {
                    keyword: $scope.deptKeyWord
                },
                complete: function(res) {
                    $scope.onloading = false;
                    if (res.responseJSON.code == 200) {
                        if(res.responseJSON.data==0){
                            $scope.nocontent=true;
                            $scope.searchResults=[];
                        }else{
                            $scope.searchResults=res.responseJSON.data;
                        }
                    }
                    $scope.$apply();
                }
            });
        }
        $scope.searchDept();
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
                $scope.planDateErr=false;
                $scope.inspectionDate=new Date(date).getTime();
            });
            $(ele).on('apply.daterangepicker', function(a,b) {
                var date = new Date(b.startDate);
                $scope.planDateErr=false;
                $scope.inspectionDate=new Date(date).getTime();
                $rootScope.$apply()
            });
        }
        // 人员
        $scope.directorCon=false;
        $scope.directorList=[];
        $scope.searchDirector=function(){
            $.ajax({
                type: 'get',
                url: '/sys/restAPI/getQcUserList',
                complete: function(res) {
                    $scope.onloading = false;
                    if (res.responseJSON.code == 200) {
                        if(res.responseJSON.data==0){
                            $scope.nocontent=true;
                            $scope.directorList=[];
                        }else{
                            $scope.directorList=res.responseJSON.data;
                            for (var i = $scope.directorList.length - 1; i >= 0; i--) {
                                $scope.directorList[i].select=false;
                                $scope.director&&($scope.director.id==$scope.directorList[i].id)&&($scope.directorList[i]=$scope.director);
                            };
                        }
                    }
                    $scope.$apply();
                }
            });
        }
        $scope.selectDirector=function(){
            $scope.searchDirector();
            $scope.directorCon=true;
            $scope.directorErr=false;
            var index=layer.open({
                time: 0 
                ,type: 1 
                ,content: $('#directorCon') 
                ,title: ['选择人员','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                ,closeBtn: 1
                ,shade: 0.3
                ,shadeClose: true
                ,end:function(index){
                    $scope.directorCon=false;
                }
                ,yes:function(){
                    if(!$scope.director.id){
                        $scope.directorErr=true;
                        return $scope.$apply();
                    }
                    $scope.directorSelect=$scope.director;
                    $scope.$apply();
                    layer.closeAll();
                }
                ,btn: ['确定','取消']
                ,area: ['390px','354px']
            });
        }
        $scope.directorSelect={};
        // 模板
        $scope.modelCon=false;
        $scope.searchModel=function(a){
            $.ajax({
                type: 'get',
                url: '/qc/qcTemplate/changeSearch',
                data: {
                    keyword: $scope.modelKeyWord
                },
                complete: function(res) {
                    $scope.onloading = false;
                    if (res.responseJSON.code == 200) {
                        if(res.responseJSON.data==0){
                            $scope.nocontent=true;
                            $scope.modelList=[];
                        }else{
                            $scope.modelList=res.responseJSON.data;
                            a&&$scope.modelDetail(res.responseJSON.data[0].id);
                        }
                    }else{
                        var msg = layer.msg('<div class="toaster"><span>'+res.responseJSON.msg+'</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                    $scope.$apply();
                }
            });
        }
        $scope.$watch('model.id', function(newValue, oldValue, scope) {
            newValue&&$scope.modelDetail(newValue);
        });
        $scope.modelNone=function(){
            var url = $state.href('inspection.model.list',{tenantId:$stateParams.tenantId||$localStorage.userInfo.tenantId});
            window.open(url,'_blank');
        }
        $scope.modelDetail=function(a){
            $.ajax({
                type: 'get',
                url: '/qc/qcTemplate/change/'+a,
                complete: function(res) {
                    $scope.onloading = false;
                    if (res.responseJSON.code == 200) {
                        $scope.model=res.responseJSON.data;
                        $scope.model.id=a;
                    }else{
                        var msg = layer.msg('<div class="toaster"><span>'+res.responseJSON.msg+'</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                    $scope.$apply();
                }
            });
        }
        $scope.selectModel=function(){
            $scope.modelCon=true;
            $scope.modelKeyWord='';
            $scope.searchModel(1);
            var index=layer.open({
                time: 0 
                ,type: 1
                ,content: $('#modelCon')
                ,title: ['选择模板','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                ,closeBtn: 1
                ,shade: 0.3
                ,shadeClose: true
                ,end:function(index){
                    $scope.planModelErr=false;
                    $scope.modelCon=false;
                }
                ,yes:function(){
                    layer.closeAll();
                    $scope.modelSelect=$scope.model;
                    $scope.$apply();
                }
                ,btn: ['确定','取消']
                ,area: ['980px','546px']
            });
        }
        // $scope.modelSelect={id:1,name:'模板名称',projects:[
        //     {name:'项目1',results:[{name:'选项名称11',isDefault:false},{name:'选项名称12',isDefault:false}]},
        //     {name:'项目2',results:[{name:'选项名称21',isDefault:false},{name:'选项名称22',isDefault:false}]},
        //     {name:'项目3',results:[{name:'选项名称31',isDefault:false},{name:'选项名称32',isDefault:false}]}
        // ]};
        $scope.selectItemM=function(a){
            $scope.planModelErr=false;
            if(a.id==$scope.model.id){
                return;
            }
            $scope.model.id=a.id;
        }
        $scope.selectItemD=function(a){
            $scope.director&&($scope.director.select=false);
            $scope.director=a;
            $scope.director.select=true;
            $scope.planDirectorErr=false;
        }
        $scope.submitInfo=function(){
            $scope.directorSelect.name=$scope.directorSelect.realName;
            var users = [];
            if($scope.acceptChooseUser.length > 0){
                for(var i=0,len=$scope.acceptChooseUser.length; i<len; i++){
                    users.push({id: $scope.acceptChooseUser[i].id, name: $scope.acceptChooseUser[i].realName});
                }
            }
            $.ajax({
                type: 'post',
                url: '/qc/qcPlan/add',
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify({
                    name: $scope.planName,
                    type: 1,
                    scope: $scope.selectResults,
                    templateId: $scope.modelSelect.id,
                    cycle: $scope.cycle,
                    cycleType: $scope.typeModel.id,
                    director: $scope.directorSelect,
                    date: $scope.inspectionDate,
                    checkMan: users
                }),
                complete: function(res) {
                    if(res.responseJSON.code == 200) {
                        $state.go('inspection.plan.list',{tenantId:$stateParams.tenantId||$localStorage.userInfo.tenantId,success:true},{reload:true});
                    } else {
                        var msg = layer.msg('<div class="toaster"><span>'+res.responseJSON.msg+'</span></div>', {
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
        $scope.savePlan=function(){
            if(!$scope.planName){
                $scope.planNameErr=true;
            }
            if(!$scope.selectResults.length){
                $scope.planScopeErr=true;
            }
            if(!$scope.modelSelect||$scope.modelSelect&&!$scope.modelSelect.id){
                $scope.planModelErr=true;
            }
            if(!$scope.cycle){
                $scope.planCycleErr=true;
            }
            if(!$scope.inspectionDate){
                $scope.planDateErr=true;
            }
            if(!$scope.directorSelect.id){
                $scope.planDirectorErr=true;
            }
            if($scope.planNameErr||$scope.planScopeErr||$scope.planModelErr||$scope.planCycleErr||$scope.planDateErr||$scope.planDirectorErr){
                return;
            }
            var index=layer.open({
                time: 0 
                ,type: 1
                ,content: $('#inspectionLayer')
                ,title: ['提示','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                ,closeBtn: 1
                ,shade: 0.3
                ,shadeClose: true
                ,end:function(index){
                }
                ,yes:function(){
                    layer.closeAll();
                    if(!$scope.planName){
                        $scope.planNameErr=true;
                    }
                    if(!$scope.selectResults.length){
                        $scope.planScopeErr=true;
                    }
                    if(!$scope.modelSelect||$scope.modelSelect&&!$scope.modelSelect.id){
                        $scope.planModelErr=true;
                    }
                    if(!$scope.cycle){
                        $scope.planCycleErr=true;
                    }
                    if(!$scope.inspectionDate){
                        $scope.planDateErr=true;
                    }
                    if(!$scope.directorSelect.id){
                        $scope.planDirectorErr=true;
                    }
                    if($scope.planNameErr||$scope.planScopeErr||$scope.planModelErr||$scope.planCycleErr||$scope.planDateErr||$scope.planDirectorErr){
                        return $scope.$apply();
                    }
                    $scope.submitInfo();
                }
                ,btn: ['确定','取消']
                ,area: ['480px','230px']
            });
        };

        $scope.acceptUserList = [];
        $scope.acceptChooseUser = [];
        $scope.acceptTempUser = [];
        $scope.selectAcceptUser = function () {
            layer.open({
                type: 1,
                title: ['选择报告验收人', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                content: $('#acceptUserTpl'),
                area: ['700px', '400px'],
                btn: ['确定', '取消'],
                yes: function(index, layero) {
                    $scope.acceptChooseUser = $scope.copyUser($scope.acceptTempUser);
                    $scope.$apply();
                    layer.close(index);
                    console.log($scope);
                },
                success: function () {
                    $scope.acceptUserList = [];
                    $scope.acceptTempUser = $scope.copyUser($scope.acceptChooseUser);
                    $.ajax({
                        type: 'get',
                        url: '/sys/restAPI/getQcCheckUserList',
                        complete: function(res) {
                            if (res.responseJSON.code == 200) {
                                var list = res.responseJSON.data || [];
                                if(list.length > 0){
                                    for(var i=0,len=list.length; i<len; i++) {
                                        list[i].checked = $scope.isChoosed($scope.acceptTempUser, list[i].id);
                                    }
                                }
                                $scope.acceptUserList = list;
                            }
                            $scope.$apply();
                        }
                    });
                }
            });
        };
        $scope.chooseTempUser = function (user) {
            user.checked = !user.checked;
            for(var i=0,len=$scope.acceptTempUser.length; i<len; i++){
                if($scope.acceptTempUser[i].id == user.id){
                    $scope.acceptTempUser.splice(i, 1);
                    break;
                }
            }
            if(user.checked){
                $scope.acceptTempUser.push(user);
            }
        };
        $scope.copyUser = function (source) {
            var target = [];
            if(source.length > 0){
                for(var i=0,len=source.length; i<len; i++){
                    target.push(source[i]);
                }
            }
            return target;
        };
        $scope.isChoosed = function (list, id) {
            var result = false;
            if(list.length > 0){
                for(var i=0,len=list.length; i<len; i++){
                    if(list[i].id == id){
                        result = true;
                        break;
                    }
                }
            }
            return result;
        }
    }])

