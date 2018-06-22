angular.module('app')

    .controller('implementController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
        $scope.localStorageHad = function() {
            if (!$localStorage.userInfo) {
                return $state.go('website.home');
            }
        }
        // 下拉框
        $scope.optionType = [{ id: 0, name: '全部状态' }, { id: 1, name: '待巡检' }, { id: 2, name: '巡检中' }];
        $scope.typeList = false;
        $scope.typeModel = $scope.optionType[$stateParams?$stateParams.status?$stateParams.status:0:0];
        $scope.option = function(list, value, item) {
            $rootScope.fixWrapShow = false;
            $scope[list] = false;
            $scope[value] = item;
            $scope.pageInfo.current=1;
            $scope.getAccessoryList();
        }
        $scope.listShow = function(str) {
            if ($rootScope.fixWrapShow)
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
            pages: 0,
            total: 0,
            size: 8,
            current: 1,
            pstyle: 2
        };
        $scope.pagination = function(page, pageSize) {
            $scope.getAccessoryList(page, pageSize);
        }

        // 列表
        $scope.nocontent = false;
        $scope.onloading = true;
        $scope.accessoryContent = [];
        $scope.kindName = '';


        function clientHeight() {
            var clientHeight = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
            } else {
                clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
            }
            $('.fy_accessoryWrap').css('min-height', clientHeight - 180 + 'px');
        }

        $scope.getAccessoryList = function(page, size) {
            $scope.onloading = true;
            $scope.nocontent = false;
            $scope.accessoryContent = [];

            var url = '/qc/qcImplement/search',
                data = {
                    pageNo: page || $scope.pageInfo.current,
                    pageSize: size || $scope.pageInfo.size,
                    status: $scope.typeModel.id
                };
            if ($scope.kindName.length) {
                data.keyword = $scope.kindName;
            }

            $.ajax({
                type: 'get',
                url: url,
                data: data,
                complete: function(res) {
                    $scope.onloading = false;
                    if (res.responseJSON.code == 200) {
                        $scope.pageInfo.total = res.responseJSON.data.total;
                        $scope.accessoryContent = res.responseJSON.data.records;

                    } else {
                        layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                    if (!$scope.accessoryContent.length) {
                        $scope.nocontent = true;
                    }
                    $rootScope.$apply();
                }
            });
        }

        // 页面初始化
        $scope.localStorageHad();
        clientHeight();
        $scope.getAccessoryList();
    }]);