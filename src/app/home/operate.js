'use strict';

angular.module('app')

    .controller('hoperateController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {

        //底部高度设置，使其占满剩余全部
        $scope.resetBottomHeight = function () {
            var height = angular.element('.org-body .sectionWrap').css('height','100%').height();
            var topHighe = angular.element('.org-title').height();
            var middleHighe = angular.element('.org-body .headWrap').height();

            angular.element('.org-body .sectionWrap').css('height','inherit');
            angular.element('.org-body .sectionWrap').css('min-height',height-134-middleHighe);
        }

        $scope.resetBottomHeight();

        $rootScope.userOr = true;
        // $rootScope.currentmodule = "机构管理";
        $rootScope.sections = {
            model: false,
            child: false,
            operate: true,
            user: false
        };

        $scope.optionList = false;
        $scope.model = '模块分类';
        $scope.option = function(item){
            $scope.optionList = false;
            $scope.model = item.name;

        }
        $scope.optionBar = [
            {name:'系统应用'},
            {name:'业务应用'},
            {name:'数据分析应用'}
        ];
        $scope.tdData = [
            {id:1,name:'zhang1',code:'asdf1',type:'string1',createTime:'time1',updateTime:'timer1',source:'source1',operate:'a',obj:'x'},
            {id:2,name:'zhang2',code:'asdf2',type:'string2',createTime:'time2',updateTime:'timer2',source:'source2',operate:'d',obj:'y'},
            {id:3,name:'zhang3',code:'asdf3',type:'string3',createTime:'time3',updateTime:'timer3',source:'source3',operate:'s',obj:'z'}
        ];
    }]);
