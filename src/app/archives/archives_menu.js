angular.module('app')
    .controller('archivesMenuController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
        $rootScope.currentmodule = "档案管理";
        $scope.data = {
            menus: [
                {name: '档案管理', cls: 'list', right: $rootScope.userInfo.authoritiesStr.indexOf('ARCHIVE_NEW_EDIT') != -1},
                {name: '档案查询', cls: 'search', right: $rootScope.userInfo.authoritiesStr.indexOf('ARCHIVE_RECORD_VIEW') != -1}
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
                    url = "archives.menu." + url;
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