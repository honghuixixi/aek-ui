'use strict';

angular.module('app')

    .controller('hmodelController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
        $rootScope.userOr = true;
        $rootScope.currentmodule = "平台首页";
        $rootScope.sections = {
            model: true,
            child: false,
            operate: false,
            user: false
        }; 
        
        //底部高度设置，使其占满剩余全部
        $scope.resetBottomHeight = function () {
            var clientHeight = angular.element('.app-content-body').height();
            var topHighe = angular.element('.org-title').height();

            angular.element('.org-body').css('height',clientHeight-70);
        }
        $scope.resetBottomHeight();
        $scope.moduleType = '';
        $scope.id = $stateParams.id;

        $scope.optionList = false;
        $scope.model = '模块分类';
        $scope.option = function(item){
            $rootScope.fixWrapShow = false;
            $scope.optionList = false;
            item ? ($scope.model = item.name,$scope.moduleType = item.id):($scope.model = '全部',$scope.moduleType = '');
            $scope.getList();
        }
        $scope.listShow = function(str){
            $scope.menuHide();
            $scope[str]=true;
            $rootScope.fixWrapShow = true;
        }
        /*遮罩*/
        $rootScope.fixWrapShow = false;
        $scope.menuHide = function(){
            $rootScope.fixWrapShow = false;

            $scope.optionList = false;
        }
        $scope.optionBar = $localStorage.baseOrg.moduleType;
        $scope.tdData = [
            {id:1,name:'zhang1',code:'asdf1',type:'string1',createTime:'time1',updateTime:'timer1',source:'source1'},
            {id:2,name:'zhang2',code:'asdf2',type:'string2',createTime:'time2',updateTime:'timer2',source:'source2'},
            {id:3,name:'zhang3',code:'asdf3',type:'string3',createTime:'time3',updateTime:'timer3',source:'source3'}
        ];

        //时间处理
        $scope.disposeTime = function (t) {
            if(!t){
                return;
            }
            var date = new Date(t);
            return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }

        //类型处理
        $scope.getTypeName = function (id, arr) {
            if(!arr || arr.length == 0){
                return;
            }
            for(var i = 0; i<arr.length;i++){
                if(id == arr[i].id){
                    return arr[i].name;
                }
            }
        }

        $scope.$on("FromSelf", function (event, data) {
            if(data.code == 200){
                $scope.getList();
            }
        });

        $scope.getList = function () {
            $scope.loading2 = true;
            $.ajax({
                type:'get',
                url:'/sys/tenantModule/tenant/'+($stateParams.id || $localStorage.userInfo.tenantId)+'?moduleType='+$scope.moduleType,
                contentType: "application/json;charset=UTF-8",
                complete:function (res) {
                    if(res.responseJSON.code == 200){
                        $scope.loading2 = false;
                        var data = res.responseJSON.data;
                        for(var i = 0;i<data.length;i++){
                            data[i].createTime = $scope.disposeTime(data[i].createTime);
                            data[i].releaseTime = $scope.disposeTime(data[i].releaseTime);
                            data[i].moduleType = $scope.getTypeName(data[i].moduleType,$localStorage.baseOrg.moduleType);
                            data[i].moduleSource = $scope.getTypeName(data[i].moduleSource,$localStorage.baseOrg.tanentOrigin);
                        }

                        $scope.tdData = data;
                        $scope.$apply();
                        $scope.resetBottomHeight();
                    }
                }
            })
        }

        $scope.closeIndex=function(){
            layer.closeAll();
        }

        $scope.removeModel = function (item) {
            $.ajax({
                type:'delete',
                url:'/sys/tenantModule/delete/tenant/'+$stateParams.id+'/module/'+item.moduleId,
                contentType: "application/json;charset=UTF-8",
                complete:function (res) {
                    if(res.responseJSON.code == 200){
                        $scope.getList();
                    }else{
                        // var index=layer.open({
                        //     time: 0 //不自动关闭
                        //     ,content: '<div style="text-align:center;"><div style="margin-top:30px;" class="pad-fifty2"><img style="margin-right:15px;" src="../../../res/img/icon20.png">'+res.responseJSON.msg+'</div></div>'
                        //     ,title: ['提示','font-size: 14px;color: #fff;background-color: rgb(74, 178, 155);line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                        //     ,closeBtn: 1
                        //     ,shade: 0.3
                        //     ,shadeClose: true
                        //     ,btn: ['确定', '取消']
                        //     ,yes: function(index){
                        //         // $state.go('org.index');
                        //         layer.close(index);
                        //     }
                        //     ,area: ['500px','220px']
                        //     ,btnAlign: 'c'
                        // });
                        // layer.style(index, {
                        //     fontSize: '16px',
                        //     backgroundColor: '#fff',
                        // });


                        $scope.alertCon2 = true;
                        $scope.layerImg = "../../../res/img/icon20.png";
                        $scope.layerMsg = res.responseJSON.msg;
                        $scope.$apply();
                        var index=layer.open({
                            time: 0 //不自动关闭
                            ,type: 1
                            ,content: $('#alertModel2')
                            ,title: ['提示','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                            ,closeBtn: 1
                            ,shade: 0.3
                            ,shadeClose: true
                            ,btn: 0
                            ,area: ['540px','250px']
                        });


                    }
                }
            })
        }

        $scope.getList();
    }]);