angular.module('app')
    .controller('meteringMenuController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
        $rootScope.currentmodule = "计量管理";
        $scope.data = {
            menus: [
                {name: '计量台账', cls: 'assets', right: $rootScope.userInfo.authoritiesStr.indexOf('MS_ASSETS_VIEW_NEW_IMPORT_EXPORT') != -1},
                {name: '计量检测', cls: 'testing', right: $rootScope.userInfo.authoritiesStr.indexOf('MS_CHECK_EDIT_PRINT') != -1},
                {name: '计量档案', cls: 'archives', right: $rootScope.userInfo.authoritiesStr.indexOf('MS_RECORD_VIEW_PRINT') != -1}
            ],
            menu: ''
        };

        $scope.menthods = {
            checkRight: function (key) {
                var right = false;
                var list = $scope.data.menus;
                for(var i=0,len=list.length; i<len; i++){
                    if(list[i].cls == key){
                        right = list[i].right;
                        break;
                    }
                }
                return right;
            },
            getNextUrl: function (key) {
                var url = 'home.general';
                var list = $scope.data.menus;
                var index = 0;
                var hasNext = false;
                for(var i=0,len=list.length; i<len; i++){
                    if(list[i].cls == key){
                        index = i;
                        break;
                    }
                }
                for(var i=index, len=list.length; i<len; i++){
                    if(list[i].right){
                        url = list[i].cls;
                        hasNext = true;
                        break;
                    }
                }
                if(!hasNext && index > 0){
                    for(var i=0; i<index; i++){
                        if(list[i].right){
                            url = list[i].cls;
                            hasNext = true;
                            break;
                        }
                    }
                }
                if(hasNext){
                    url = "metering.menu." + url;
                }
                return url;
            }
        };

        $scope.checkLimit = function(key, fun) {
            if ($scope.menthods.checkRight(key)) {
                $scope.data.menu = key;
                if (typeof fun === 'function') {
                    fun();
                }
            } else {
                $state.go($scope.menthods.getNextUrl(key));
            }
        }
    }])