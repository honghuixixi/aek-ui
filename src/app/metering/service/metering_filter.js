// 下载地址编码
angular.module('app').filter('downloadURL', function () {
    return function (src) {
        return encodeURI(encodeURI('/api/download?path=' + src));
    };
});
// 资产状态
angular.module('app').filter('assetsStatus', function () {
    return function (level) {
        return {
            '1': '在库',
            '2': '在用',
            '3': '预登',
            '4': '待报损',
            '5': '报损',
            '6': '退货'
        }[level];
    };
});
// 计量分类
angular.module('app').filter('measureCategory', function () {
    return function (type) {
        var types = [
            { id: 1, name: '放射计量' },
            { id: 2, name: '电磁学计量' },
            { id: 3, name: '热力学计量' },
            { id: 4, name: '生物化学计量' },
            { id: 5, name: '光学计量' },
            { id: 6, name: '激光计量' },
            { id: 7, name: '超声学计量' }
        ];
        var result = '';
        for (var i = 0, len = types.length; i < len; i++) {
            if (types[i].id == type) {
                result = types[i].name;
                break;
            }
        }
        return result;
    };
});
// 计量类别
angular.module('app').filter('measureType', function () {
    return function (type) {
        var types = [
            { id: 1, name: 'A 类计量设备' },
            { id: 2, name: 'B 类计量设备' },
            { id: 3, name: 'C 类计量设备' }
        ];
        var result = '';
        for (var i = 0, len = types.length; i < len; i++) {
            if (types[i].id == type) {
                result = types[i].name;
                break;
            }
        }
        return result;
    };
});
// 计量台账是否完善
angular.module('app').filter('jlAssetsStatus', function () {
    return function (level) {
        return {
            '1': '待完善',
            '2': '完善',
        }[level];
    };
});
// 计量管理
angular.module('app').filter('measureManageType', function () {
    return function (level) {
        return {
            '1': '非强检',
            '2': '强检'
        }[level];
    };
});
// 检定方式
angular.module('app').filter('checkMode', function () {
    return function (level) {
        return {
            '1': '院内',
            '2': '外包'
        }[level];
    };
});
// 检定形式
angular.module('app').filter('checkForm', function () {
    return function (type) {
        var types = [
            { id: 1, name: '首次检定' }, 
            { id: 2, name: '随后检定' }, 
            { id: 3, name: '使用中检定' }, 
            { id: 4, name: '周期检定' }, 
            { id: 5, name: '仲裁检定' }
        ];
        var result = '';
        for (var i = 0, len = types.length; i < len; i++) {
            if (types[i].id == type) {
                result = types[i].name;
                break;
            }
        }
        return result;
    };
});
// 检定结果
angular.module('app').filter('checkResultStatus', function () {
    return function (type) {
        var types = [
            { id: 1, name: '合格' }, 
            { id: 2, name: '准用' }, 
            { id: 3, name: '限用' }, 
            { id: 4, name: '禁用' }
        ];
        var result = '';
        for (var i = 0, len = types.length; i < len; i++) {
            if (types[i].id == type) {
                result = types[i].name;
                break;
            }
        }
        return result;
    };
});

// 计量报告
angular.module('app').directive('meteringReport', function () {
    return {
        restrict: "E",
        scope: {
            report: "="
        },
        templateUrl: 'src/app/metering/html/directive_report.html',
        replace: true, // 使用模板替换原始标记 
        transclude: false // 不复制原始HTML内容 
    };
});