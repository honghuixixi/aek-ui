angular.module('app')
    .controller('flowConfigController', ['$rootScope', '$scope', '$stateParams', '$localStorage', '$state', 'applyDbService', function($rootScope, $scope, $stateParams, $localStorage, $state, applyDbService) {
        // 数据
        function WorkItem(level, obj) {
            this.level = level;
            this.name = '';
            this.nameMsg = '';
            this.rangeStart = '';
            this.rangeEnd = '';
            this.rangeMsg = '';
            this.audit = {
                id: 0,
                name: '',
                job: '',
                msg: ''
            };
            this.keyword = '';
            this.showSearch = false;
            this.remark = '';
            if (obj) {
                this.level = obj.index;
                this.name = obj.indexName;
                this.rangeStart = obj.minFee + '';
                this.rangeEnd = obj.maxFee + '';
                this.audit.id = obj.checkUserId;
                this.audit.name = obj.checkUserName;
                this.audit.job = obj.checkUserJob;
                this.remark = obj.remark;
            }
            if (this.rangeStart.length > 0) {
                this.rangeStart = parseFloat(this.rangeStart).toFixed(2);
            }
            if (this.rangeEnd.length > 0) {
                this.rangeEnd = parseFloat(this.rangeEnd).toFixed(2);
            }
        }
        WorkItem.prototype.canSave = function() {
            return this.name.length > 0 &&
                this.rangeStart.length > 0 &&
                this.rangeEnd.length > 0 &&
                this.audit.id > 0 &&
                this.audit.name.length > 0 &&
                this.nameMsg === '' &&
                this.rangeMsg === '' &&
                this.audit.msg === '';
        };
        WorkItem.prototype.checkRange = function() {
            this.rangeMsg = '';
            this.nameMsg = '';
            this.audit.msg = '';
            if (this.name === '') {
                this.nameMsg = '*请输入';
            }
            if (this.rangeEnd === '') {
                this.rangeMsg = '*请输入';
            }
            if (this.level === 1 && this.rangeStart === '') {
                this.rangeMsg = '*请输入';
            }
            if (('' + this.rangeStart).length > 0 && ('' + this.rangeEnd).length > 0) {
                if (+this.rangeEnd < +this.rangeStart) {
                    this.rangeMsg = '*不能小于起始值';
                }
            }
            if (this.audit.id < 0 || this.audit.name === '') {
                this.audit.msg = '*请选择';
            }
        };

        $scope.data = {
            height: document.body.clientHeight - 130,
            levels: [
                { id: 1, name: '1' },
                { id: 2, name: '2' },
                { id: 3, name: '3' },
                { id: 4, name: '4' },
                { id: 5, name: '5' },
                { id: 6, name: '6' },
                { id: 7, name: '7' }
            ],
            selectLevel: { id: 1, name: '1' },
            limit: {
                edit: true //$rootScope.userInfo.authoritiesStr.indexOf('PM_PLAN_NEW_EDIT') != -1
            },
            list: [],
            loading: true,
            empty: false,
            isEdit: false,
            canSave: false,
            auditUsers: []
        };

        $scope.changeLevel = function(item) {
            if ($scope.data.selectLevel.id !== item.id) {
                $scope.data.selectLevel = item;
                $scope.data.list = [];
                if (item.id > 0) {
                    for (var i = 0; i < item.id; i++) {
                        $scope.data.list.push(new WorkItem(i + 1));
                    }
                }
            }
        };

        // 工作流配置列表查询
        $scope.getList = function() {
            $scope.data.loading = true;
            $scope.data.list = [];
            applyDbService.getFlowConfigs({}, function(data) {
                $scope.data.loading = false;
                var arr = [];
                if (data && data.length > 0) {
                    for (var i = 0, len = data.length; i < len; i++) {
                        arr.push(new WorkItem(i + 1, data[i]));
                    }
                }
                $scope.data.list = arr;
                $scope.data.empty = $scope.data.list.length < 1;
                $scope.data.selectLevel = $scope.data.levels[$scope.data.list.length > 0 ? $scope.data.list.length - 1 : 0];
                $scope.$apply();
            });
        };

        // 获取审批人
        $scope.getAuditUsers = function(obj) {
            applyDbService.getAuditUsers({keyword: obj.keyword}, function(data) {
                $scope.data.auditUsers = [];
                if(data && data.length > 0){
                    for(var i=0,len=data.length; i<len; i++){
                        $scope.data.auditUsers.push({
                            id: data[i].id,
                            name: data[i].realName
                        });
                    }
                }
                $scope.$apply();
            });
        };

        // 保存
        $scope.save = function() {
            if ($scope.data.canSave) {
                var param = [];
                this.data.isEdit = false;
                for (var i = 0, len = $scope.data.list.length; i < len; i++) {
                    param.push({
                        index: $scope.data.list[i].level,
                        indexName: $scope.data.list[i].name,
                        minFee: $scope.data.list[i].rangeStart,
                        maxFee: $scope.data.list[i].rangeEnd,
                        checkUserId: $scope.data.list[i].audit.id,
                        checkUserName: $scope.data.list[i].audit.name,
                        checkUserJob: $scope.data.list[i].audit.job,
                        remark: $scope.data.list[i].remark
                    });
                }
                applyDbService.saveFlowConfig(param, function(data) {
                    $scope.getList();
                    layer.msg('<div class="toaster"><span>保存成功</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                }, function (msg, obj) {
                    $scope.getList();
                    layer.msg('<div class="toaster"><span>' + msg + '</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                });
            }
        };

        // 显示搜索
        $scope.showSearch = function(obj) {
            obj.showSearch = !obj.showSearch;
            $scope.data.auditUsers = [];
            obj.keyword = '';
            for (var i = 0, len = $scope.data.list.length; i < len; i++) {
                if ($scope.data.list[i].level !== obj.level) {
                    $scope.data.list[i].showSearch = false;
                }
            }
        };

        $scope.showEdit = function () {
            $scope.data.isEdit=true
            if($scope.data.list.length < 1){
                $scope.data.list.push(new WorkItem(1));
            }
        };

        // 取消
        $scope.cancle = function() {
            $scope.data.isEdit = false;
            $scope.getList();
        };

        // 选择审核人
        $scope.chooseAuditUser = function(obj, user) {
            obj.audit.id = user.id;
            obj.audit.name = user.name;
            obj.showSearch = false;
        };

        $scope.closeSearch = function(evt) {
            if (evt.target.className === "flow-config-main") {
                for (var i = 0, len = $scope.data.list.length; i < len; i++) {
                    $scope.data.list[i].showSearch = false;
                }
            }
        };

        // 数字校验
        $scope.checkNum = function(obj, type) {
            var val = type > 1 ? obj.rangeEnd : obj.rangeStart;
            val = val.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符  
            val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
            val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数  
            if (val.indexOf(".") < 0 && val != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
                val = parseFloat(val);
            }
            if (type > 1) {
                obj.rangeEnd = val;
            } else {
                obj.rangeStart = val;
            }
        };

        $scope.convertNum = function (obj, type) {
            var val = type > 1 ? obj.rangeEnd : obj.rangeStart;
            if(('' + val).length > 0){
                val = parseFloat(val).toFixed(2);
            }
            if (type > 1) {
                obj.rangeEnd = val;
            } else {
                obj.rangeStart = val;
            }
        };

        // 初始化
        $scope.getList();
        // 监控数据变化
        $scope.$watch("data.list", function(newVal, oldVal) {
            var list = $scope.data.list;
            if (list && list.length > 0) {
                list[0].checkRange();
                $scope.data.canSave = list[0].canSave();
                for (var i = 1, len = list.length; i < len; i++) {
                    list[i].rangeStart = list[i - 1].rangeEnd;
                    list[i].checkRange();
                    $scope.data.canSave = $scope.data.canSave && list[i].canSave();
                }
            }
        }, true);
    }]);