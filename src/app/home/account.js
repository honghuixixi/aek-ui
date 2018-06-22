angular.module('app')

    .controller('accountController', [ '$rootScope', '$scope', '$http', '$state','$localStorage','$interval',
        function($rootScope, $scope, $http, $state,$localStorage,$interval) {
            $scope.localStorageHad=function(){
                if(!$localStorage.userInfo){
                    return $state.go('website.home');
                }
            }
            $scope.localStorageHad();
                $rootScope.userInfo = $localStorage.userInfo;
                $rootScope.currentmodule = '平台首页';
                $scope.ismodify = false;
                $scope.rewrite = false;
                $scope.mmqr = false;
                $scope.newnumber = false;
                $scope.unbindem = false;
                $scope.newemail = '';
                $scope.countdown = '获取验证码';
                $scope.surepassword = '';
                $scope.newInfo={
                	 mobile:'',
                	 message:''
                	
                };
                $scope.isemit=true
                $scope.changeEmail = function(){
                    if(angular.element('.addinput').val()){
                        $scope.isemit=true
                    }else{
                        $scope.isemit=false
                    }
                }
            // 加上秒
            $scope.miaoshu = function(a){
                if(a!='获取验证码'){
                    return a+'s'
                }else{
                    return '获取验证码'
                }
            }
                $scope.Add = false;
                // 获取用户信息
                $scope.getUser = function() {
                    $.ajax({
                        type: "get",
                        url: "/sys/user/" + $rootScope.userInfo.id,
                        complete: function(res) {
                            if(res.responseJSON.code = 200) {
                                $scope.detailInfo = res.responseJSON.data;
                                $scope.emailbind = $scope.detailInfo.email&&$scope.detailInfo.emailActivate
                                $scope.detailinput = $scope.detailInfo.email
                                // 如果没有手机那么显示添加
                                if(!$scope.detailInfo.email){
                                    $scope.isAdd = true
                                }else if($scope.detailInfo.email&&!$scope.detailInfo.emailActivate){
                                    // 如果有手机号没有绑定，那么显示手机号修改绑定
                                    $scope.movebind = true
                                    $scope.detailinput = $scope.detailInfo.email
                                }
                                $rootScope.$apply();
                        }
                    }
                });
            }
            $scope.getUser();
                //获取用户角色
                $scope.getUserRole = function() {
                    $.ajax({
                        type: "get",
                        url: "/sys/roleUser/user/" + $rootScope.userInfo.id,
                        complete: function(res) {
                            if(res.responseJSON.code = 200) {
                                $scope.roleInfo = res.responseJSON.data;
                                $rootScope.$apply();
                            }
                        }
                    });
                }
                $scope.getUserRole();
                $scope.changenull=function(){
                    $scope.passwordnull=''
                }
                // 修改密码
                $scope.repassword = function () {
                    $scope.surepassword = '';
                    $scope.mmqr = true;
                    var index1 = layer.open({
                        type:1,
                        time: 0 ,//不自动关闭,
                        content: $('.surepass'),
                        title: ['密码验证', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                        closeBtn: 1,
                        shade: 0.3,
                        shadeClose: true,
                        move:false,
                         btn: ['确定', '取消'],
                         yes:function(){
                         	 $scope.verifyPwd();
                         },
                        //点击确定后的操作,

                        area: ['540px', '270px'],
                        btnAlign: 'r',
                        end: function() {
                            $scope.mmqr = false
                            $rootScope.$apply();
                        }
                    });
                    layer.style(index1, {
                        fontSize: '16px',
                        backgroundColor: '#fff',
                    });

                    $scope.verifyPwd = function () {
                        // 发送请求
                        $.ajax({
                            type: "get",
                            url: "/sys/user/password",
                            data:{'password':$scope.surepassword,'userId':$rootScope.userInfo.id},
                            complete: function(res) {
                                if(res.responseJSON.data==false){
                                    $scope.error=true
                                    // 当前密码正确
                                }else{
                                    layer.close(index1);
                                    $scope.rewrite = true
                                    $scope.password = ''
                                    $scope.rewpassword = ''
                                    $scope.passwordnull= ''
                                    var index2 = layer.open({
                                        type:1,
                                        time: 0 ,//不自动关闭,
                                        content:$('.alertPass'),
                                        title: ['修改密码', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                                        closeBtn: 1,
                                        shade: 0.3,
                                        shadeClose: true,
                                        move:false,
                                        // btn: ['确定', '取消'],
                                        //点击确定全部已读后的操作,
                                        area: ['617px', '257px'],
                                        btnAlign: 'c',
                                        end: function(){
                                            $scope.rewrite = false
                                            $rootScope.$apply();
                                        }
                                    });
                                    layer.style(index2, {
                                        fontSize: '16px',
                                        backgroundColor: '#fff',
                                    });

                                    $scope.resetPwd = function () {
                                        if(!$scope.password){
                                            $scope.passwordnull=true
                                        }else{
                                            var errorOne = angular.element('.errpass').eq(0).hasClass('ng-hide')
                                            var errorTwo = angular.element('.errpass').eq(1).hasClass('ng-hide')
                                            var errorThree = angular.element('.errpass').eq(2).hasClass('ng-hide')
                                            var errorFour = angular.element('.errpass').eq(3).hasClass('ng-hide')
                                            if(errorOne&&errorTwo&&errorThree&&errorFour&&$scope.rewpassword) {
                                                // 验证通过可以发送请求修改密码
                                                $.ajax({
                                                    type: "post",
                                                    url: "/sys/user/onese/changePwd" ,
                                                    contentType: "application/json;charset=UTF-8",
                                                    data:JSON.stringify({
                                                        password:$scope.password
                                                    }),
                                                    complete: function(res) {
                                                        if(res.responseJSON.code == 200) {
                                                            layer.close(index2);
                                                            var msg = layer.msg('<div class="toaster"><span>修改成功</span></div>', {
                                                                area: ['100%', '60px'],
                                                                time: 3000,
                                                                offset: 'b',
                                                                shadeClose: true,
                                                                shade: 0
                                                            });
                                                        }else{
                                                        	layer.close(index2);
                                                            var msg = layer.msg('<div class="toaster"><span>'+res.responseJSON.msg+'</span></div>', {
                                                                area: ['100%', '60px'],
                                                                time: 3000,
                                                                offset: 'b',
                                                                shadeClose: true,
                                                                shade: 0
                                                            });
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    }

                                    $scope.closeIndexPwd = function () {
                                        layer.close(index2);
                                    }

                                }
                                $rootScope.$apply();
                            }
                        })
                    }

                    $scope.closeIndexVerify = function () {
                        layer.close(index1);
                    }
                }
                // 修改当前密码，错误提示消失
                $scope.change = function(){
                    $scope.error = false
                    $scope.errornull = false
                }
                $scope.change4 = function(){
                    $scope.notexit = false
                    $scope.msg2 = false
                    $scope.nophone = false
                    $scope.noyanzhengma = false
                }
                $scope.change5 = function(){
                    $scope.msg2 = false
                    $scope.nophone = false
                    $scope.noyanzhengma = false
                }
                $scope.changeRe = function(){
                    $scope.passwordnull=false
                }
                // 修改手机号发送验证码
                $scope.send = function($event) {
                    var _data = {
                        "mobile": $scope.newInfo.mobile
                    };
                    $.ajax({
                        url: '/sys/user/user/mobile',
                        data: _data,
                        type: 'get'
                    }).then(function(data) {
                        if(data.code==200){
                            angular.element($event.target).prop('disabled', true)
                            // 发送成功以后，颜色变灰
                            $scope.isdaojishi = true
                            $scope.countdown = 60
                            $scope.interval=$interval(
                                function() {
                                    $scope.countdown--
                                    if($scope.countdown <= 0) {
                                        $scope.countdown = '获取验证码';
                                        $scope.isdaojishi = false;
                                        angular.element($event.target).prop('disabled', false)
                                    }
                                }, 1000, 60)
                        }else{
                           // $scope.notexit=data.msg;
                            var msg = layer.msg('<div class="toaster"><span>'+data.msg+'</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0
                            });
                        }
                        $rootScope.$apply();
                    })
            }
                // 修改手机号
                $scope.remobile = function(){
                        $scope.surepassword = '';
                        $scope.newInfo.mobile = '';
                        $scope.newInfo.message = '';
                        $scope.mmqr = true;
                        $scope.error = false;
                        var index = layer.open({
                                        type:1,
                                        time: 0 ,//不自动关闭,
                                        content: $('.surepass'),
                                        title: ['密码验证', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                                        closeBtn: 1,
                                        shade: 0.3,
                                        shadeClose: true,
                                        move:false,
                                        btn: ['确定', '取消'],
                                        //点击确定后的操作,
                                        yes: function (index) {
                                            // layer.close(index);
                                            $scope.newnumber = true;
                                            $scope.msg2 = false;
                                            if(!$scope.surepassword){
                                                $scope.errornull=true
                                                $rootScope.$apply()
                                            }else{
                                                // 发送请求
                                                $.ajax({
                                                    type: "get",
                                                    url: "/sys/user/password",
                                                    data:{'password':$scope.surepassword,'userId':$rootScope.userInfo.id},
                                                    complete: function(res) {
                                                        if(res.responseJSON.code == 200) {
                                                        if(res.responseJSON.data==false){
                                                                $scope.error=true
                                                                // 当前密码正确
                                                            }else{
                                                                layer.close(index);
                                                                $scope.countdown = '获取验证码';
                                                                var index1 = layer.open({
                                                                    type:1,
                                                                    time: 0 ,//不自动关闭,
                                                                    content:$('.bindphone'),
                                                                    title: ['绑定新的手机号', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                                                                    closeBtn: 1,
                                                                    shade: 0.3,
                                                                    shadeClose: true,
                                                                    success:function(){
                                                                    	$scope.countdown = '获取验证码';
                                                                    },
                                                                    move:false,
                                                                    btn: ['确定', '取消'],
                                                                    //点击确定全部已读后的操作,
                                                                    yes: function (index) {
                                                                        // layer.close(index);
                                                                        $scope.isdaojishi = false;
                                                                        $interval.cancel($scope.interval);
                                                                        // $scope.countdown = '获取验证码';
                                                                        $scope.countdown = '获取验证码';
                                                                        if($scope.new.phone.$error.required){
                                                                            $scope.nophone=true
                                                                            $rootScope.$apply()
                                                                        }else{
                                                                            if($scope.new.message.$error.required){
                                                                                $scope.noyanzhengma=true
                                                                                $rootScope.$apply()
                                                                            }
                                                                        }
                                                                        if($scope.new.$valid) {
                                                                            var _data = {
                                                                                "mobile": $scope.newInfo.mobile,
                                                                                "code": $scope.newInfo.message,
                                                                                "userId": $rootScope.userInfo.id
                                                                            };
                                                                            $.ajax({
                                                                                url: '/sys/user/reset/mobile',
                                                                                data: _data,
                                                                                type: 'get'
                                                                            }).then(function (data) {
                                                                                if (data.code == 200) {
                                                                                    layer.close(index)
                                                                                    $scope.detailInfo.mobile = $scope.newInfo.mobile
                                                                                } else {
                                                                                    $scope.msg2 = data.msg
                                                                                }
                                                                            })
                                                                        }
                                                                    },
                                                                    area: ['617px', '257px'],
                                                                    btnAlign: 'r',
                                                                    end: function(){
                                                                        $scope.newnumber = false;
                                                                        $scope.isdaojishi = false;
                                                                        $interval.cancel($scope.interval);
                                                                        // $scope.countdown = '获取验证码';
                                                                        $rootScope.$apply();
                                                                    }
                                                                });
                                                                layer.style(index1, {
                                                                    fontSize: '16px',
                                                                    backgroundColor: '#fff',
                                                                });

                                                            }
                                                            $rootScope.$apply();
                                                        }
                                                    }
                                })}
                            },
                            area: ['540px', '270px'],
                            btnAlign: 'r',
                            end: function() {
                                $scope.mmqr = false;
                                $scope.msg2 = false;
                                $rootScope.$apply();
                            }
                        });
                        layer.style(index, {
                            fontSize: '16px',
                            backgroundColor: '#fff',
                        });
                }
                // 解绑邮箱
                $scope.unbind = function(){
                    $scope.unbindem=true
                    var index = layer.open({
                        type:1,
                        time: 0 ,//不自动关闭,
                        content:$('.unemail'),
                        title: ['邮箱解绑', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
                        closeBtn: 1,
                        shade: 0.3,
                        shadeClose: true,
                        btn: 0,
                        area: ['541px', '260px'],
                        end: function(){
                            $scope.unbindem = false
                            $rootScope.$apply();
                        }
                    });
                    layer.style(index, {
                        fontSize: '16px',
                        backgroundColor: '#fff',
                    });

                    $scope.closeIndex = function () {
                        layer.close(index);
                    }

                    $scope.unbindEmail = function () {
                        $.ajax({
                            url: '/sys/user/'+$rootScope.userInfo.id+'/unbundling/email',
                            data: $rootScope.userInfo.id,
                            type: 'get'
                        }).then(function(data) {
                            // 解绑成功后
                            if(data.code==200){
                                layer.close(index)
                                $scope.movebind = true
                                $scope.emailbind = false
                                $scope.isAdd = false
                                $scope.Add = false
                                var msg = layer.msg('<div class="toaster"><span>解绑成功</span></div>', {
                                    area: ['100%', '60px'],
                                    time: 3000,
                                    offset: 'b',
                                    shadeClose: true,
                                    shade: 0
                                });
                            }else{
                                var msg = layer.msg('<div class="toaster"><span>'+data.msg+'</span></div>', {
                                    area: ['100%', '60px'],
                                    time: 3000,
                                    offset: 'b',
                                    shadeClose: true,
                                    shade: 0
                                });
                            }
                        })
                    }


                }
                // 添加邮箱
                $scope.addemail=function(){
                    $scope.Add=true
                    $scope.isAdd=false
                    $scope.bindemail = ''
                    $scope.statusAdd = true
                }
                // 取消添加邮箱
                $scope.canael=function(){
                    // 如果此变量为真，说明点击添加，那么取消得回到添加，变量为假说明从修改点击的
                    if($scope.statusAdd){
                        $scope.isAdd = true
                    }else{
                        $scope.movebind = true
                        $scope.detailinput =$scope.bindemail
                    }
                    $scope.Add = false
                }
                // 添加邮箱格式错误提示
                $scope.sumbit = function(){
                    var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                    var value=angular.element('input[name=addemail]').val()
                    if(value!='' && !reg.test(value)){
                        var msg = layer.msg('<div class="toaster"><span>邮箱格式不正确</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }else{
                        // 发送请求
                        $.ajax({
                            url: '/sys/user/'+$rootScope.userInfo.id+'/submit/email',
                            data: {"email":angular.element('.addinput').val(),"id":$rootScope.userInfo.id},
                            type: 'get'
                        }).then(function(data) {
                            if(data.code==200){
                                var msg = layer.msg('<div class="toaster"><span>提交成功</span></div>', {
                                    area: ['100%', '60px'],
                                    time: 3000,
                                    offset: 'b',
                                    shadeClose: true,
                                    shade: 0
                                });
                                // $scope.isAdd = false
                                // $scope.Add = false
                                // $scope.movebind =true
                                // $scope.detailinput = angular.element('.addinput').val()
                                if(value==''){
                                    $scope.isAdd = true;
                                    $scope.movebind = false;
                                    $scope.Add = false;
                                    $scope.emailbind = false;
                                }else{
                                    $scope.movebind = true;
                                    $scope.Add = false;
                                    $scope.emailbind = false;
                                    $scope.isAdd = false;
                                    $scope.detailinput = angular.element('.addinput').val()
                                }
                                $rootScope.$apply();
                            }else{
                                var msg = layer.msg('<div class="toaster"><span>'+data.msg+'</span></div>', {
                                    area: ['100%', '60px'],
                                    time: 3000,
                                    offset: 'b',
                                    shadeClose: true,
                                    shade: 0
                                });
                            }
                        })
                    }
                }
                // 修改邮箱
                $scope.move = function(){
                    $scope.Add = true
                    $scope.movebind = false
                    $scope.bindemail=$scope.detailinput
                    $scope.detailinput= ''
                    $scope.statusAdd = false
                }
                //绑定邮箱
                $scope.bind = function(){
                    $.ajax({
                        url: '/sys/user/'+$rootScope.userInfo.id+'/modify/email/send',
                        data: {"id":$rootScope.userInfo.id,"email":$scope.detailinput},
                        type: 'get'
                    }).then(function(data) {
                        if(data.code==200){
                            var msg = layer.msg('<div class="toaster"><span>激活邮件已经发送到'+$scope.detailinput+'</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0
                            });
                            // $scope.movebind = false
                            // $scope.emailbind = true
                            $rootScope.$apply()
                        }else{
                            var msg = layer.msg('<div class="toaster"><span>'+data.msg+'</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0
                            });
                        }
                    })
                }
        } ]);
