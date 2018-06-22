/**
 *这是一个翻页组件
 */
angular.module('cw.paging', []).directive('newPaging', function () {

    // Assign null-able scope values from settings
    function setScopeValues(scope, attrs) {
        scope.List = [];
        scope.Hide = false;
        scope.page = parseInt(scope.page) || 1;
        scope.total = parseInt(scope.total) || 0;
        scope.dots = scope.dots || '...';
        scope.ulClass = scope.ulClass || 'cw-pagination';
        scope.adjacent = parseInt(scope.adjacent) || 2;
        scope.activeClass = scope.activeClass || 'active';
        scope.disabledClass = scope.disabledClass || 'disabled';
        scope.scrollTop = scope.$eval(attrs.scrollTop);
        scope.hideIfEmpty = scope.$eval(attrs.hideIfEmpty);
        scope.showPrevNext = scope.$eval(attrs.showPrevNext);

        // if(scope.ppSize == 1){
        //     scope.pageArr = [{id:16,name:'16条/页'},{id:32,name:'32条/页'},{id:64,name:'64条/页'}];
        // }else if(scope.ppSize == 2){
        //     scope.pageArr = [{id:8,name:'8条/页'},{id:16,name:'16条/页'},{id:32,name:'32条/页'}];
        // }

        //原select换为ui-select
        //若pageInfo传入参数ppSize等于2,则切换pageArr
        if(scope.ppSize == 2){
            scope.pageArr = [{id:8,name:'8条/页'},{id:16,name:'16条/页'},{id:32,name:'32条/页'}];
        }else{
            scope.pageArr = [{id:16,name:'16条/页'},{id:32,name:'32条/页'},{id:64,name:'64条/页'}];
        }
        //当前选中页码
        scope.pageSizeSel = {id:scope.pageSize,name:scope.pageSize+"条/页"};

        //跳页
        scope.jump=parseInt(scope.page) || 1;
        scope.pageSize=scope.pageSize;

    }

    // Validate and clean up any scope values
    // This happens after we have set the
    // scope values
    function validateScopeValues(scope, pageCount) {

        // Block where the page is larger than the pageCount
        if (scope.page > pageCount) {
            scope.page = pageCount;
        }

        // Block where the page is less than 0
        if (scope.page <= 0) {
            scope.page = 1;
        }

        // Block where adjacent value is 0 or below
        if (scope.adjacent <= 0) {
            scope.adjacent = 2;
        }

        // Hide from page if we have 1 or less pages
        // if directed to hide empty
        //如果页数小于等于1的时候，则将hide变量值改为hideIfEmpty(该值由组件参数传入),即隐藏翻页组件
        if (pageCount <= 1) {
            scope.Hide = scope.hideIfEmpty;
        }
    }


    // Internal Paging Click Action
    function internalAction(scope, page) {
        // Block clicks we try to load the active page
        if (scope.page == page) {
            return;
        }

        // Update the page in scope 
        scope.page = page;

        // Pass our parameters to the paging action
        scope.pagingAction({
            page: scope.page,
            pageSize: scope.pageSize,
            total: scope.total
        });

        // If allowed scroll up to the top of the page
        if (scope.scrollTop) {
            scrollTo(0, 0);
        }
    }


    // Adds the first, previous text if desired   
    function addPrev(scope, pageCount) {

        // Ignore if we are not showing
        // or there are no pages to display
        if (!scope.showPrevNext || pageCount < 1) {
            return;
        }

        // Calculate the previous page and if the click actions are allowed
        // blocking and disabling where page <= 0
        var disabled = scope.page - 1 <= 0;
        var prevPage = scope.page - 1 <= 0 ? 1 : scope.page - 1;

        var total = {
            total:scope.total,
            liClass: ''
        };

        //第一页
        var first = {
            value: '<<',
            title: '第一页',
            src:'../../res/img/first.png',
            liClass: disabled ? scope.disabledClass : '',
            action: function () {
                if(!disabled) {
                    internalAction(scope, 1);
                }
            }
        };

        //上一页
        var prev = {
            value: 'prevI',
            title: '上一页',
            src:'../../res/img/zuofanye.png',
            liClass: 'prev',
            action: function () {
                if(!disabled) {
                    internalAction(scope, prevPage);
                }
            }
        };

        scope.List.push(total);

        // scope.List.push(first);
        scope.List.push(prev);
    }

    // Adds the next, last text if desired
    function addNext(scope, pageCount) {

        // Ignore if we are not showing 
        // or there are no pages to display
        if (!scope.showPrevNext || pageCount < 1) {
            return;
        }

        // Calculate the next page number and if the click actions are allowed
        // blocking where page is >= pageCount
        var disabled = scope.page + 1 > pageCount;
        var nextPage = scope.page + 1 >= pageCount ? pageCount : scope.page + 1;

        var last = {
            value: '>>',
            title: '最后一页',
            src:'../../res/img/last.png',
            liClass: disabled ? scope.disabledClass : '',
            action: function () {
                if(!disabled){
                    internalAction(scope, pageCount);
                }
            }
        };

        var next = {
            value: 'nextI',
            title: '下一页',
            src:'../../res/img/youfanye.png',
            liClass: disabled ? scope.disabledClass : '',
            action: function () {
                if(!disabled){
                    internalAction(scope, nextPage);
                }
            }
        };

        //input跳转
        var runPage={
            value: 'input',
            runpage:true,
            page:scope.page,
            pageCount:Math.ceil(scope.total / scope.pageSize),
            title: '跳转',
            src:'',
            liClass: 'inputcount',
            action: function (e,item) {
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    if(!/^[0-9]*$/.test(+item.page)) return;

                    if(item.page>item.pageCount){
                        item.page = item.pageCount;
                    }
                    if(item.page<1){
                        item.page = 1;
                    }
                    scope.page = item.page;
                    scope.pagingAction({
                        page: item.page,
                        pageSize: scope.pageSize,
                        total: scope.total
                    });
                }
            },
            pageChange:function (item) {
                scope.jump = +item.jump;
            }
        }

        //页码设置
        var statis={
            value: '',
            statis:true,
            // total:scope.total,
            pageSize:scope.pageSize,
            title: '',
            src:'',
            liClass: '',
            action: function (item,mod) {

                angular.element('input[type="search"]').attr('readonly','true');
                //if(item.pageSize<=0) return;
                // if(item.pageSize>scope.total) return;
                if(!item.id)return;
                scope.pageSize = parseInt(item.id);
                scope.page = 1;
                scope.pagingAction({
                    page: scope.page,
                    pageSize: scope.pageSize,
                    total: scope.total
                });
                // var keycode = window.event?e.keyCode:e.which;
                /*if(keycode==13){
                 if(!/^[0-9]*$/.test(item.pageSize)) return;

                 }*/
            }
        }

        scope.List.push(next);
        // scope.List.push(last);

        scope.List.push(statis);

        /*跳转*/
        scope.List.push(runPage);
    }

    function addRefresh(scope) {
        var page = scope.page;
        var refresh = {
            value: '>',
            title: '刷新',
            src:'../../res/img/f5.png',
            liClass: '',
            action: function () {
                scope.refresh({
                    page: scope.page,
                    pageSize: scope.pageSize,
                    total: scope.total
                });
            }
        };

        var run = {
            value: 'go',
            title: '跳转',
            jump:scope.page,
            src:'../../res/img/go.png',
            jump:scope.page,
            liClass: '',
            action: function (e) {
                if(!/^[0-9]*$/.test(scope.jump)) return;
                scope.pagingAction({
                    page: scope.jump,
                    pageSize: scope.pageSize,
                    total: scope.total
                });
            }
        }
        /*跳转图标*/
        //scope.List.push(run);
        // scope.List.push(refresh);
    }

    // Add Range of Numbers
    function addRange(start, finish, scope) {
        var i = 0;
        for (i = start; i <= finish; i++) {

            var item = {
                value: i,
                // title: 'Page ' + i,
                pages:true,
                liClass: scope.page == i ? scope.activeClass : '',
                action: function () {
                    internalAction(scope, this.value);
                }
            };

            scope.List.push(item);
        }
    }


    // Add Dots ie: 1 2 [...] 10 11 12 [...] 56 57
    //省略号
    function addDots(scope) {
        scope.List.push({
            value: '···',
            pages:true,
			liClass: 'dots'
        });
    }


    // Add First Pages
    function addFirst(scope, next) {
        addRange(1, 1, scope);

        // We ignore dots if the next value is 3
        // ie: 1 2 [...] 3 4 5 becomes just 1 2 3 4 5 
        if(next != 3){
            addDots(scope);
        }
    }


    // Add Last Pages
    function addLast(pageCount, scope, prev) {

        // We ignore dots if the previous value is one less that our start range
        // ie: 1 2 3 4 [...] 5 6  becomes just 1 2 3 4 5 6
        if(prev != pageCount - 2){
            addDots(scope);
        }
        addRange(pageCount, pageCount, scope);
    }



    // Main build function
    function build(scope, attrs) {
        // Block divide by 0 and empty page size
        if (!scope.pageSize || scope.pageSize < 0) {
            return;
        }


        // Assign scope values
        setScopeValues(scope, attrs);

        // local variables
        var start,
            size = scope.adjacent * 2,
            pageCount = Math.ceil(scope.total / scope.pageSize);

        // Validate Scope
        validateScopeValues(scope, pageCount);

        // Calculate Counts and display
        addPrev(scope, pageCount);
        if (pageCount < (5 + size)) {
            start = 1;
            addRange(start, pageCount, scope);

        } else {

            var finish;

            if (scope.page <= (1 + size)) {

                start = 1;
                finish = 2 + size + (scope.adjacent - 1);
                addRange(start, finish, scope);
                addLast(pageCount, scope, finish);

            } else if (pageCount - size > scope.page && scope.page > size) {

                start = scope.page - scope.adjacent;
                finish = scope.page + scope.adjacent;

                addFirst(scope, start);
                addRange(start, finish, scope);
                addLast(pageCount, scope, finish);

            } else {

                start = pageCount - (1 + size + (scope.adjacent - 1));
                finish = pageCount;

                addFirst(scope, start);
                addRange(start, finish, scope);

            }
        }
        addNext(scope, pageCount);
        addRefresh(scope);
        }


    // The actual angular directive return
    return {
        restrict: 'EA',
        scope: {
            page: '=',
            pageSize: '=',
            total: '=',
            ppSize: '=',
            dots: '@',
            hideIfEmpty: '@',
            ulClass: '@',
            activeClass: '@',
            disabledClass: '@',
            adjacent: '@',
            scrollTop: '@',
            showPrevNext: '@',
            pagingAction: '&',
            refresh:'&'
        },
        templateUrl:'../../src/tpl/pageTpl.html',
       
        link: function (scope, element, attrs) {

            // Hook in our watched items 
            scope.$watchCollection('[page,pageSize,total]', function () {
                build(scope, attrs);
            });
        }
    };
});
