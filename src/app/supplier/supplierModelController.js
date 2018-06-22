'use strict';

angular.module('app')

.controller('supplierModelController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
	$rootScope.userOr = true;
	$rootScope.sections = {
		model: true,
		credentials: false,
		seller: false,
		user: false
	};
     
    if($stateParams.isOp) {
        var msg = layer.msg('<div class="toaster"><i></i><span>' + $stateParams.isOpMsg + '</span></div>', {
            area: ['100%', '60px'],
            time: 3000,
            offset: 'b',
            shadeClose: true,
            shade: 0
        });
    }
    $scope.localStorageHad=function(){
        if(!$localStorage.userInfo){
            return $state.go('website.home');
        }
    }
    $scope.localStorageHad();
    //底部高度设置，使其占满剩余全部
    $scope.resetBottomHeight = function () {
        var clientHeight = angular.element('.app-content-body').height();
        var topHighe = angular.element('.org-title').height();

        angular.element('.org-body').css('height',clientHeight-70);
        angular.element('.home-model-bottom').css('min-height',clientHeight-90-angular.element('.headWrap').height());
    }
    $scope.resetBottomHeight();

	$scope.moduleType = '';
	$scope.id = $stateParams.supplierId;

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
	$scope.tdData = [];

    //时间处理
	$scope.disposeTime = function (t) {
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
            url:'/sys/tenantModule/tenant/'+$stateParams.supplierId+'?moduleType='+$scope.moduleType,
            contentType: "application/json;charset=UTF-8",
            complete:function (res) {
                if(res.responseJSON.code == 200){
                    $scope.loading2 = false;
                    var data = res.responseJSON.data;
					for(var i = 0;i<data.length;i++){
                        data[i].createTime && (data[i].createTime = $scope.disposeTime(data[i].createTime));
                        data[i].releaseTime && (data[i].releaseTime = $scope.disposeTime(data[i].releaseTime));
                        data[i].moduleType && (data[i].moduleType = $scope.getTypeName(data[i].moduleType,$localStorage.baseOrg.moduleType));
                        data[i].moduleSource && (data[i].moduleSource = $scope.getTypeName(data[i].moduleSource,$localStorage.baseOrg.tanentOrigin));
					}

                    $scope.tdData = data;
                    $scope.$apply();
                }
            }
        })
    }

    $scope.closeIndex=function(){
        layer.closeAll();
    }

    $scope.removeModel = function (item) {
        $scope.layerImg = "../../../res/img/wh.png";
        $scope.orgMouleName = item.name;
        var index = layer.open({
            time: 0,//不自动关闭
            type: 1,
            content: $('#orgModule'),
            title: ['提示', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
            closeBtn: 1,
            shade: 0.3,
            shadeClose: true,
            btn: 0,
            area: ['540px', '280px']
        });

        $scope.removeOk = function () {
            layer.close(index);
            $.ajax({
                type:'delete',
                url:'/sys/tenantModule/delete/tenant/'+$stateParams.supplierId+'/module/'+item.moduleId,
                contentType: "application/json;charset=UTF-8",
                complete:function (res) {
                    if(res.responseJSON.code == 200){
                        $scope.getList();
                    }else{
                        $scope.alertCon2 = true;
                        $scope.layerImg = "../../../res/img/icon20.png";
                        $scope.layerMsg = res.responseJSON.msg;
                        $scope.$apply();
                        var index2 = layer.open({
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
    }

    $scope.getList();
}]);