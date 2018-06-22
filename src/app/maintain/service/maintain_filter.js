// PM等级
angular.module('app').filter('pmlevel', function() {
    return function(level) {
        return {
            '1': '一级',
            '2': '二级',
            '3': '三级'
        }[level];
    };
});
// PM计划状态
angular.module('app').filter('pmplanstatus', function() {
    return function(status) {
        return {
            '1': '启用',
            '2': '停用',
            '3': '已结束'
        }[status];
    };
});
// PM检查结果
angular.module('app').filter('pmplanresult', function() {
    return function(status) {
        return {
            '1': '正常',
            '2': '不正常'
        }[status];
    };
});
// PM检查结果
angular.module('app').filter('pmplanlive', function() {
    return function(status) {
        return {
            '1': '正常工作',
            '2': '小问题，不影响使用',
            '3': '有故障，需要维修',
            '4': '不能使用'
        }[status];
    };
});