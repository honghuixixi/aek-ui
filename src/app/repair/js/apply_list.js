angular.module('app')
    .controller('applyListController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'applyDbService', function($rootScope, $scope, $stateParams, $localStorage, $state, applyDbService) {
        // 数据
        $scope.data = {
            height: document.body.clientHeight - 130,
            menuTypes: [
                { id: 1, name: '我的申请' },
                { id: 2, name: '全院申请' }
            ],
            applyStatus: [
                { id: 0, name: '全部状态' },
                { id: 1, name: '审批中' },
                { id: 2, name: '审批通过' },
                { id: 3, name: '审批未通过' },
                { id: 4, name: '已撤销' }
            ],
            applyTypes: [
                { id: 0, name: '全部类型' },
                { id: 2, name: '配件采购' },
                { id: 1, name: '外修费用' }
            ],
            selectMenuType: { id: 1, name: '我的申请' },
            selectApplyStatus: { id: 0, name: '全部状态' },
            selectApplyType: { id: 0, name: '全部类型' },
            condition: {
                keyword: ''
            },
            limit: {
                edit: true //$rootScope.userInfo.authoritiesStr.indexOf('PM_PLAN_NEW_EDIT') != -1
            },
            list: [],
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

        $scope.changeMenuType = function(item) {
            if ($scope.data.selectMenuType.id != item.id) {
                $scope.data.selectMenuType = item;
                $scope.data.selectApplyStatus = { id: 0, name: '全部状态' };
                $scope.data.selectApplyType = { id: 0, name: '全部类型' };
                $scope.data.condition.keyword = '';
                $scope.search();
            }
        };

        $scope.changeApplyStatus = function(item) {
            if ($scope.data.selectApplyStatus.id != item.id) {
                $scope.data.selectApplyStatus = item;
                $scope.search();
            }
        };

        $scope.changeApplyType = function(item) {
            if ($scope.data.selectApplyType.id != item.id) {
                $scope.data.selectApplyType = item;
                $scope.search();
            }
        };

        // 分页事件
        $scope.pagination = function(page, pageSize) {
            $scope.pageInfo.size = pageSize;
            $scope.getList(page, pageSize);
        }

        // 新建申请
        $scope.addPlan = function() {
            $state.go('repair.apply.add');
        };

        // 单据申请列表查询
        $scope.getList = function(pageNo, pageSize) {
            var param = {
                pageNo: pageNo,
                pageSize: pageSize,
                applyType: $scope.data.selectMenuType.id,
                tenantId: $rootScope.userInfo.tenantId
            };
            if ($scope.data.selectApplyStatus.id > 0) {
                param['status'] = $scope.data.selectApplyStatus.id;
            }
            if ($scope.data.selectApplyType.id > 0) {
                param['type'] = $scope.data.selectApplyType.id;
            }
            if ($scope.data.condition.keyword.length > 0) {
                param['keyword'] = $scope.data.condition.keyword;
            }

            $scope.data.loading = true;
            $scope.data.list = [];
            applyDbService.getApplyList(param, function(data) {
                $scope.data.loading = false;
                $scope.pageInfo.current = pageNo;
                $scope.pageInfo.total = data.total;
                $scope.data.list = data.records;
                $scope.data.empty = data.records.length < 1;
                $scope.$apply();
            });
        };

        // 搜索
        $scope.search = function() {
            $scope.getList(1, $scope.pageInfo.size);
        };

        // 初始化
        $scope.getList(1, $scope.pageInfo.size);
    }]);

// 申请单状态
angular.module('app').filter('applyStatus', function() {
    return function(status) {
        return {
            '1': '审批中',
            '2': '审批通过',
            '3': '审批未通过',
            '4': '已撤销'
        }[status];
    };
});