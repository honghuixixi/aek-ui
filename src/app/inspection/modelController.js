angular.module('app')

    .controller('modelController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
        $scope.localStorageHad=function(){
            if(!$localStorage.userInfo){
                return $state.go('website.home');
            }
        }
        $scope.localStorageHad();
        // 下拉框
        $scope.optionType = [{id:0,name:'全部状态'},{id:1,name:'启用'},{id:2,name:'停用'}];
        $scope.typeList = false;
        $scope.typeModel = $scope.optionType[0];
        $scope.option = function(list, value, item) {
            $rootScope.fixWrapShow = false;
            $scope[list] = false;
            $scope[value] = item;
            $scope.pageInfo.current=1;
            $scope.getAccessoryList();
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
        // 下拉框 END
        // 分页
        $scope.pageInfo = {
            total: 30,
            size: 8,
            current: 1
        };
        // 列表
        $scope.nocontent = false;
        $scope.onloading = false;
        $scope.accessoryContent = [];
        $scope.kindName = '';
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
        
        $scope.getAccessoryList = function(page,size){
            $scope.onloading = true;
            $scope.nocontent = false;
            $scope.accessoryContent=[];
            var data = {
                pageNo: page||$scope.pageInfo.current,
                pageSize: size||$scope.pageInfo.size,
                status: $scope.typeModel.id,
                keyword: $scope.kindName
            };
            (!data.status)&&(delete data.status);
            $.ajax({
                type: 'get',
                url: '/qc/qcTemplate/search',
                data: data,
                complete: function(res) {
                    $scope.onloading = false;
                    if(res.responseJSON.code == 200) {
                        $scope.accessoryContent = res.responseJSON.data.records;
                        $scope.pageInfo.total=res.responseJSON.data.total;
                        $scope.pageInfo.pstyle=2;
                        if(!$scope.accessoryContent.length){
                            $scope.nocontent = true;
                            $scope.accessoryContent=[];
                        }
                    }
                    $rootScope.$apply();
                }
            });
        }
        $scope.getAccessoryList();
        $scope.pagination = function(page,pageSize){
            $scope.getAccessoryList(page,pageSize);
        }
        $scope.modelNameChange=function(){
            $scope.modelNameErr = false;
            $scope.model.name=$scope.model.name.substring(0,40);
        }
        $scope.remarksLimit=function(){
            $scope.model.remarks=$scope.model.remarks.substring(0,40);
        }
        $scope.editModel=function(a,b){
            $scope.editModelShow=true;
            $scope.modelNameErr=false;
            $scope.model={
                name: '',
                remarks: ''
            };
            if(a){
                $scope.model=JSON.parse(JSON.stringify(a));
            }
            var index=layer.open({
                time: 0 
                ,type: 1 
                ,content: $('#ModelCon') 
                ,title: [a?'编辑巡检模板':'新建巡检模板','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                ,closeBtn: 1
                ,shade: 0.3
                ,shadeClose: true
                ,end:function(index){
                    $scope.editModelShow=false;
                }
                ,yes:function(){
                    if(!$scope.model.name){
                        $scope.modelNameErr = true;
                        return $scope.$apply();
                    }
                    $scope.submitModel(a);
                }
                ,btn: ['确定','取消']
                ,area: ['615px','354px']
            });
        }
        $scope.submitModel=function(a){
            // var data={
            //     name: $scope.model.name,
            //     remarks: $scope.model.remarks
            // };
            // a&&(data=a);
            $.ajax({
                type: 'post',
                url: a?'/qc/qcTemplate/edit':'/qc/qcTemplate/add',
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify($scope.model),
                complete: function(res) {
                    var txt = a?'保存成功':'新建成功';
                    if(res.responseJSON.code == 200) {
                        layer.closeAll();
                        $scope.getAccessoryList();
                    } else {txt = res.responseJSON.msg;}
                    var msg = layer.msg('<div class="toaster"><span>'+txt+'</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                }
            });
        }
    }])

