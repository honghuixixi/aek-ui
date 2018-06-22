angular.module('app')

    .controller('accessoryClassifyController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {

        // 下拉框
        $scope.optionType = [{
            id: '',
            name: '全部状态'
        },{
            id: 0,
            name: '禁用'
        },{
            id: 1,
            name: '启用'
        }];
        $scope.optionStatus = [{
            id: 0,
            name: '禁用'
        },{
            id: 1,
            name: '启用'
        }];
        $scope.typeList = false;
        $scope.statusList = false;
        $scope.statusModel = {
            id: '',
            name: ''
        };
        $scope.typeModel = $scope.optionType[0];
        $scope.option = function(list, value, item,a) {
            $scope.statusErr = false;
            $rootScope.fixWrapShow = false;
            $scope[list] = false;
            $scope[value] = item;
            a&&$scope.accessoryListChange();
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
            $scope.statusList = false;
            $scope.typeList = false;
        }
        // 下拉框 END
        $scope.accessoryAjax=function(type,url,data,callback){
            type=='get'&&$.ajax({
                type: type,
                url: url,
                data: data,
                complete: callback
            });
            type=='post'&&$.ajax({
                type: type,
                url: url,
                data: data,
                contentType: 'application/json',
                complete: callback
            });
        }
        // 分页
        $scope.pageInfo = {
            pages: 3,
            total: 30,
            size: 16,
            current: 1
        };
        $scope.pagination = function(page,pageSize){
            $scope.accessoryListChange(page,pageSize);
        }
        // 列表
        $scope.nocontent = false;
        $scope.onloading = false;
        $scope.accessoryContent = [];
        getAccessoryList();
        function getAccessoryList(){
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
            $scope.onloading = true;
            var data = {
                pageNo: $scope.pageInfo.current,
                pageSize: $scope.pageInfo.size,
                orderByField: 'update_time',
                isAsc: false,
                tenantId: $stateParams.tenantId||$localStorage.userInfo.tenantId
            };
            $scope.accessoryAjax('get','/repair/repParts/search',data,function(res) {
                $scope.onloading = false;
                $scope.nocontent = false;
                if(res.responseJSON.code == 200) {
                    $scope.accessoryContent = res.responseJSON.data.records;
                    $scope.pageInfo=res.responseJSON.data;
                    if(!$scope.accessoryContent.length){
                        $scope.nocontent = true;
                    }
                }
                $rootScope.$apply();
            });
        }

        // limit
        $scope.accessoryLimit=function(a,b){
            $scope.kindNameErr=false;
            $scope[a]=$scope[a].length<b?$scope[a]:$scope[a].slice(0,b);
        }
        $scope.accessoryLimitCheck=function(a,b){
            $scope.kindNameErr=false;
            $scope[a]=$scope[a].length<b?$scope[a]:$scope[a].slice(0,b);
            $scope.checkClassifyName();
        }
        // 检索
        $scope.kindName = '';
        $scope.kindNameErrTxt='请输入分类名称,40个字符以内';
        $scope.accessoryListChange = function(page,size){
            var data = {
                pageNo: page||'',
                pageSize: size||$scope.pageInfo.size|'',
                orderByField: 'update_time',
                isAsc: false,
                kindName: $scope.kindName,
                tenantId: $stateParams.tenantId||$localStorage.userInfo.tenantId,
                status: $scope.typeModel.id //启用状态（0未启用 1启用）
            };
            for (var key in data) {
                if(data[key]===''){
                    delete data[key]
                }
            };
            $scope.accessoryAjax('get','/repair/repParts/search',data,function(res) {
                $scope.onloading = false;
                $scope.nocontent = false;
                if(res.responseJSON.code == 200) {
                    $scope.accessoryContent = res.responseJSON.data.records;
                    $scope.pageInfo=res.responseJSON.data;
                    if(!$scope.accessoryContent.length){
                        $scope.nocontent = true;
                    }
                }
                $rootScope.$apply();
            });
        }

        $scope.checkClassifyName=function($event){
            if(!$scope.oneAccessoryKindName||$scope.cancleOperate){
                return;
            }
            $.ajax({
                type: "post",
                url: "/repair/repParts/check" ,
                // contentType: 'application/json',
                data: {kindName:$scope.oneAccessoryKindName},
                complete: function(res){
                    if(res.responseJSON.code==200){
                        (res.responseJSON.data=='YES')&&($scope.kindNameErr=true,$scope.kindNameErrTxt='分类名称已存在',angular.element('.checkClassifyName').focus(),$rootScope.$apply());
                    }
                }
            });
        }
        // 新建/编辑配件分类
        $scope.kindCode = '系统自动生成，无需填写';
        $scope.oneAccessoryKindName = '';
        $scope.newOrEdit = false;
        $scope.currentAccesstory = null;
        $scope.newAccessoryBtn=function(a){
            $scope.cancleOperate=false;
            $scope.accessoryClassify=true;
            var title = '新建配件分类';
            $scope.statusModel = {
                id: '',
                name: ''
            };
            $scope.newOrEdit=false;
            $scope.oneAccessoryKindName='';
            $scope.oneAccessoryRemarks='';
            $scope.kindCode='系统自动生成，无需填写';
            a&&($scope.statusModel={id:a.status,name:a.status==1?'启用':'禁用'},$scope.newOrEdit = true,$scope.currentAccesstory=a,$scope.oneAccessoryKindName=a.kindName,$scope.oneAccessoryRemarks=a.remarks,$scope.kindCode=a.kindCode,title = '编辑配件分类');
            var index=layer.open({
                time: 0 //不自动关闭
                ,type: 1
                ,content: $('.fy_oneAccessoryClassify')
                ,title: [title,'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                ,closeBtn: 1
                ,shade: 0.3
                ,shadeClose: false
                ,btn: 0
                ,area: ['616px','441px']
                ,end:function(){
                    $scope.kindNameErr=false;
                    $scope.statusErr=false;
                    $scope.accessoryClassify=false;
                }
            });
        }
        $scope.cancleOperate=false;
        $scope.newAccessory=function(a){
            if(a){
                $scope.cancleOperate=true;
                $scope.kindNameErr=false;
                $scope.statusErr=false;
                return layer.closeAll();
            }
            !$scope.oneAccessoryKindName&&($scope.kindNameErr=true);
            !$scope.statusModel.name&&($scope.statusErr=true);
            if(!$scope.oneAccessoryKindName||!$scope.statusModel.name||$scope.kindNameErr){
                return;
            }
            layer.closeAll();
            if($scope.newOrEdit){
                return $scope.editAccessory();
            }
            $scope.accessoryAjax('post','/repair/repParts/add',JSON.stringify({
                            "kindName": $scope.oneAccessoryKindName,
                            "remarks": $scope.oneAccessoryRemarks,
                            "status": $scope.statusModel.id,
                            "tenantId": $stateParams.tenantId||$localStorage.userInfo.tenantId,
                            "updateMan": $localStorage.userInfo.realName,
                            "updateTime": new Date().getTime()
                        }),function(res) {
                if(res.responseJSON.code == 200) {
                    $state.go('repair.accessory.classify',{tenantId: $stateParams.tenantId||$localStorage.userInfo.tenantId},{reload: true});
                }
            });
        }
        $scope.editAccessory=function(){
            $scope.accessoryAjax('post','/repair/repParts/edit',JSON.stringify({
                "kindName": $scope.oneAccessoryKindName,
                "id": $scope.currentAccesstory.id,
                "remarks": $scope.oneAccessoryRemarks,
                "status": $scope.statusModel.id,
                "tenantId": $stateParams.tenantId||$localStorage.userInfo.tenantId,
                "updateMan": $localStorage.userInfo.realName,
                "updateTime": new Date()
            }),function(res) {
                if(res.responseJSON.code == 200) {
                    $state.go('repair.accessory.classify',{tenantId: $stateParams.tenantId||$localStorage.userInfo.tenantId},{reload: true});
                }
            });
        }


    }])

