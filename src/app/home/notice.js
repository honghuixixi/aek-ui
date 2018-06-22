angular.module('app')
    .controller('noticeController', [ '$rootScope', '$scope', '$http', '$state',
        function($rootScope, $scope, $http, $state) {
            $scope.read=true
            $scope.readed=false
            $scope.isAllreade=false
            $scope.allread=function(){
                var index=layer.open({
                    time: 0 //不自动关闭
                    ,content: '<div style="text-align: center"><img src="../../../res/img/wh.png" alt="" ></div><div class="pad-fifty">您确定要标记信息为已读吗？</div>'
                    ,title: ['提示','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                    ,closeBtn: 1
                    ,shade: 0.3
                    ,shadeClose: true
                    ,btn: ['确定', '取消']
                    //点击确定全部已读后的操作
                    ,yes: function(index){
                        layer.close(index);
                        // var msg=layer.msg('<div class="toaster"><i></i><span>这是最常用的吧</span></div>',{
                        //     area: ['100%','60px']
                        //     ,time: 3000
                        //     ,shadeClose: true
                        //     ,offset: 'b'
                        //     ,shade: 0
                        // });
                        $scope.read=false
                        $scope.readed=true
                        $scope.isAllreade=true
                    }
                    ,area: ['500px','250px']
                    ,btnAlign: 'c'
                });
                layer.style(index, {
                    fontSize: '16px',
                    backgroundColor: '#fff',
                });
            }
        } ]);

