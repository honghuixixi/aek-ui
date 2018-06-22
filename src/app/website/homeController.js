'use strict';

angular.module('app')
    .controller('homeController', [ '$rootScope', '$scope', '$http', '$state' , '$localStorage', '$stateParams',
        function($rootScope, $scope, $http, $state, $localStorage, $stateParams) {
            $scope.loginOrNot=function(){
                $rootScope.logined=false;
                ($localStorage.userInfo)&&($rootScope.logined=true);
            }
            $scope.scrollTO=function(){
                ($localStorage.websitego)&&($localStorage.websitego=null);
                ($state.current.name.search('website.home')>=0)&&window.scrollTo(0,1550);
            }
            $scope.othergo=function(){
                ($localStorage.websitego)&&$scope.scrollTO();
            }
            $scope.othergo();
            $scope.loginOrNot();
            $scope.models=[
                {txt:'资产管理'},
                {txt:'质控管理'},
                {txt:'维修管理'},
                {txt:'成员用户管理'},
                {txt:'角色管理'},
                {txt:'机构管理'},
                {txt:'字段管理'},
                {txt:'字典表管理'},
                {txt:'供应商管理'},
                {txt:'CMS内容管理'},
                {txt:'问卷调查'},
                {txt:'维修商城'},
                {txt:'BI商业智能'},
                {txt:'短信/邮件服务'},
                {txt:'第三方应用'},
            ];
            for (var i = 0; i<15; i++) {
                $scope.models[i].img='../../res/img/mod'+(i+1)+'.png';
            };
            $scope.sliderNext=function(){
                $scope.timeout=setTimeout(function(){
                    clearTimeout($scope.timeout);
                    clearInterval($scope.yourSwiper);
                    $scope.mySwiper.slideNext();
                },1500);
            }
            setTimeout(function(){
                $scope.mySwiper = new Swiper('.swiper-container', {
                    autoplay: 60000,//可选选项，自动滑动
                    loop: true,
                    watchSlidesProgress: true,
                    pagination: '.swiper-pagination',
                    paginationClickable :true,
                    watchSlidesVisibility: true,
                    autoHeight: true,
                    simulateTouch: false,
                    onSlideChangeStart: function(s){
                        clearInterval($scope.yourSwiper);
                        $scope.startSlider(s.activeIndex)
                    },
                    onSlideChangeEnd: function(s){
                        clearInterval($scope.yourSwiper);
                        $scope.startSlider(s.activeIndex)
                    }
                });
                $scope.mySwiper.stopAutoplay();
                // $scope.startSlider($scope.mySwiper.activeIndex);
                $('.fy_website_slider').mouseover(function(e){
                    // var src = $(e.currentTarget).find('img')[0];
                    // src.src=src.src.slice(0,src.src.length-5)+1+'.png'; 
                    $scope.stopSlider($scope.mySwiper.activeIndex);
                    $scope.mySwiper.stopAutoplay();
                });
                $('.fy_website_slider').mouseleave(function(e){
                    $scope.startSlider($scope.mySwiper.activeIndex);
                    // var src = $(e.currentTarget).find('img')[0];
                    $scope.mySwiper.startAutoplay();
                    // src.src=src.src.slice(0,src.src.length-5)+0+'.png'; 
                });
            });
            $scope.startSlider = function(a){
                $scope.realIndex = 1;
                // $('.fy_website_slide_timer').eq(a).find('.fy_website_slider').removeClass('fy_website_mod');
                $('.fy_website_slide_timer').eq(a).find('.fy_website_slider').eq(0).addClass('fy_website_mod');
                $scope.yourSwiper = setInterval(function(){
                    $('.fy_website_slide_timer').eq(a).find('.fy_website_slider').removeClass('fy_website_mod');
                    $('.fy_website_slide_timer').eq(a).find('.fy_website_slider').eq($scope.realIndex==2?3:($scope.realIndex==3?2:$scope.realIndex)).addClass('fy_website_mod');
                    $scope.realIndex++;
                    $scope.realIndex>3?$scope.sliderNext():'';
                    $scope.realIndex=$scope.realIndex>3?0:$scope.realIndex;
                },15000);
            }

            $scope.stopSlider = function(a){
                clearInterval($scope.yourSwiper);
                $('.fy_website_slide_timer').eq(a).find('.fy_website_slider').removeClass('fy_website_mod');
            }
            $scope.clouds = ['../../res/img/cloud10.png','../../res/img/cloud20.png','../../res/img/cloud30.png','../../res/img/cloud40.png'];
            $scope.mods = [
                [['../../res/img/slide110.png','../../res/img/slide111.png'],
                                ['../../res/img/slide120.png','../../res/img/slide121.png'],
                                ['../../res/img/slide130.png','../../res/img/slide131.png'],
                                ['../../res/img/slide140.png','../../res/img/slide141.png']],
                [['../../res/img/slide210.png','../../res/img/slide211.png'],
                                ['../../res/img/slide220.png','../../res/img/slide221.png'],
                                ['../../res/img/slide230.png','../../res/img/slide231.png'],
                                ['../../res/img/slide240.png','../../res/img/slide241.png']]
            ];

            $scope.imgchange=function(a,b,c){
                ($scope[a])&&($scope[a][b])&&($scope[a][b]=$scope[a][b].slice(0,$scope[a][b].length-5)+c+'.png');
            }
    } ]);