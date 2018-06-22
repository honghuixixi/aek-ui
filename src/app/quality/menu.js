angular.module('app').controller('qualityMenuController', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
    $rootScope.currentmodule = "质控管理";
    $scope.data = {
        menus: [
            { name: '质控填报', cls: 'apply', right: $rootScope.userInfo.authoritiesStr.indexOf('MD_APPLY_MANAGE') != -1 },
            { name: '质控审核', cls: 'audit', right: $rootScope.userInfo.authoritiesStr.indexOf('MD_CHECK_MANAGE') != -1 },
            { name: '质控档案', cls: 'archives', right: $rootScope.userInfo.authoritiesStr.indexOf('MD_ARCHIVE_MANAGE') != -1 },
            { name: '质控模板', cls: 'template', right: $rootScope.userInfo.authoritiesStr.indexOf('MD_TEMPLATE_MANAGE') != -1 }
        ],
        menu: ''
    };

    $scope.menthods = {
        checkRight: function (key) {
            var right = false;
            var list = $scope.data.menus;
            for (var i = 0, len = list.length; i < len; i++) {
                if (list[i].cls == key) {
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
            for (var i = 0, len = list.length; i < len; i++) {
                if (list[i].cls == key) {
                    index = i;
                    break;
                }
            }
            for (var i = index, len = list.length; i < len; i++) {
                if (list[i].right) {
                    url = list[i].cls;
                    hasNext = true;
                    break;
                }
            }
            if (!hasNext && index > 0) {
                for (var i = 0; i < index; i++) {
                    if (list[i].right) {
                        url = list[i].cls;
                        hasNext = true;
                        break;
                    }
                }
            }
            if (hasNext) {
                url = "quality.menu." + url;
            }
            return url;
        }
    };

    $scope.checkLimit = function (key, fun) {
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

angular.module('app').directive('qualityList', function () {
    return {
        restrict: "E",
        scope: {
            statusOptions: '=',
            status: '@',
            search: "@",
            placeholder: "@",
            list: "="
        },
        templateUrl: 'src/app/quality/html/quality-list-tpl.html',
        // replace: true, // 使用模板替换原始标记 
        transclude: true, // 不复制原始HTML内容 
        controller: ["$rootScope", "$scope", 'qualityDbService', 'qualityUtilService', function ($rootScope, $scope, qualityDbService, qualityUtilService) {
            $scope.data = {
                local: {
                    departOptions: [],
                    keyword: '',
                    nextDateStart: '',
                    nextDateEnd: '',
                    currentType: { id: 0, name: '全部' },
                    currentDepart: { id: 0, name: '选择部门' }
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
                changeType: function (item) {
                    $scope.data.local.currentType = item;
                    $scope.methods.search();
                },
                changeDepart: function (item) {
                    $scope.data.local.currentDepart = item;
                    $scope.methods.search();
                },
                search: function () {
                    $scope.methods.getList(1, $scope.pageInfo.size);
                },
                // 培训管理查询
                getList: function (pageNo, pageSize) {
                    var param = {
                        pageNo: pageNo,
                        pageSize: pageSize,
                    };
                    if($scope.data.local.currentType.id > 0){
                        param.status = $scope.data.local.currentType.id;
                    }
                    if(($scope.data.local.nextDateStart + '').length > 0){
                        param.checkTimeStart = new Date($scope.data.local.nextDateStart).Format("yyyy-MM-dd") + " 00:00:00";
                    }
                    if(($scope.data.local.nextDateEnd + '').length > 0){
                        param.checkTimeEnd = new Date($scope.data.local.nextDateEnd).Format("yyyy-MM-dd") + " 23:59:59";
                    }
                    if($scope.data.local.currentDepart.id > 0){
                        param.deptId = $scope.data.local.currentDepart.id;
                    }
                    if($scope.data.local.keyword.length > 0){
                        param.keyword = $scope.data.local.keyword;
                    }

                    $scope.list = [];
                    $scope.data.loading = true;
                    qualityDbService[$scope.search](param, function (json) {
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
                for(var i=0,len=$scope.statusOptions.length; i<len; i++){
                    if($scope.statusOptions[i].id == $scope.status){
                        $scope.data.local.currentType = $scope.statusOptions[i];
                        break;
                    }
                }
                $scope.methods.search();
                qualityDbService.getDepartments($rootScope.userInfo.tenantId, function (data) {
                    $scope.data.local.departOptions = [{ id: 0, name: '全部' }].concat(data);
                    var st = new Date();
                    setStartDatepicker(null, null, st, null);
                    setEndDatepicker(null, null, st, null);
                });               
            };

            $scope.init();

            function setStartDatepicker(min, max, st, en) {
                qualityUtilService.setDatepicker('#nextDateStart', st, en, min, max, function (b) {
                    $scope.data.local.nextDateStart = new Date(b.startDate).getTime();
                    setEndDatepicker(new Date(b.startDate), new Date("2050-01-01"));
                });
            }

            function setEndDatepicker(min, max, st, en) {
                qualityUtilService.setDatepicker('#nextDateEnd', st, en, min, max, function (b) {
                    $scope.data.local.nextDateEnd = new Date(b.startDate).getTime();
                    setStartDatepicker(null, new Date(b.startDate));
                });
            }
        }]
    };
});