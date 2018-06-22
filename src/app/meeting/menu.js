angular.module('app')
    .controller('meetingMenuController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
        $rootScope.currentmodule = "医学装备管理委员会";
        $scope.data = {
            menus: [
                {name: '记录管理', cls: 'plan', right: $rootScope.userInfo.authoritiesStr.indexOf('MEETING_RECORD_MANAGE') != -1},
                {name: '记录档案', cls: 'archives', right: $rootScope.userInfo.authoritiesStr.indexOf('MEETING_ARCHIVE_VIEW') != -1}
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
                    url = "meeting.menu." + url;
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
    }]);

    angular.module('app').directive('meetingList', function () {
        return {
            restrict: "E",
            scope: {
                userId: "=",
                search: "@",
                list: "="
            },
            templateUrl: 'src/app/meeting/html/meeting-list-tpl.html',
            transclude: true, // 不复制原始HTML内容 
            controller: ["$rootScope", "$scope", 'meetingDbService', 'meetingUtilService', function ($rootScope, $scope, meetingDbService, meetingUtilService) {
                $scope.data = {
                    local: {
                        keyword: '',
                        nextDateStart: '',
                        nextDateEnd: ''
                    },
                    loading: true,
                    empty: false
                };
                // 分页数据
                $scope.pageInfo = {
                    pages: 0,
                    total: 0,
                    size: 16,
                    current: 1,
                    pstyle: 2
                };
    
                // 分页事件
                $scope.pagination = function (page, pageSize) {
                    $scope.pageInfo.size = pageSize;
                    $scope.methods.getList(page, pageSize);
                }
    
                $scope.methods = {
                    search: function () {
                        $scope.methods.getList(1, $scope.pageInfo.size);
                    },
                    // 培训管理查询
                    getList: function (pageNo, pageSize) {
                        var param = {
                            pageNo: pageNo,
                            pageSize: pageSize,
                            tenantId: $rootScope.userInfo.tenantId
                        };
                        if(+$scope.userId > 0){
                            param.userId = $scope.userId;
                        }
                        if($scope.data.local.keyword.length > 0){
                            param.keyword = $scope.data.local.keyword;
                        }
                        if(($scope.data.local.nextDateStart + '').length > 0){
                            param.startDate = new Date($scope.data.local.nextDateStart).Format("yyyy-MM-dd") + " 00:00:00";
                        }
                        if(($scope.data.local.nextDateEnd + '').length > 0){
                            param.endDate = new Date($scope.data.local.nextDateEnd).Format("yyyy-MM-dd") + " 23:59:59";
                        }
    
                        $scope.list = [];
                        $scope.data.loading = true;
                        meetingDbService[$scope.search](param, function (json) {
                            $scope.data.loading = false;
                            $scope.list = json.records;
                            $scope.pageInfo.current = pageNo;
                            $scope.pageInfo.total = json.total;
                            $scope.data.empty = json.records.length < 1;
                            $scope.$apply();
                        });
                    }
                };
    
                $scope.init = function () {
                    $scope.methods.search();
                    setTimeout(function () {
                        var st = new Date();
                        setStartDatepicker(null, null, st, null);
                        setEndDatepicker(null, null, st, null);
                    }, 200);
                };
    
                $scope.init();
    
                function setStartDatepicker(min, max, st, en) {
                    meetingUtilService.setDatepicker('#nextDateStart', st, en, min, max, function (b) {
                        $scope.data.local.nextDateStart = new Date(b.startDate).getTime();
                        setEndDatepicker(new Date(b.startDate), new Date("2050-01-01"));
                    });
                }
    
                function setEndDatepicker(min, max, st, en) {
                    meetingUtilService.setDatepicker('#nextDateEnd', st, en, min, max, function (b) {
                        $scope.data.local.nextDateEnd = new Date(b.startDate).getTime();
                        setStartDatepicker(null, new Date(b.startDate));
                    });
                }
            }]
        };
    });