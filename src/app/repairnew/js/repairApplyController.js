angular.module('app')

    .controller('repairApplyController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
        $rootScope.currentmodule = "维修管理";
        $scope.add = false;
        $scope.url = [];
        $scope.urls = [];
        $scope.clickAdd = true
        $scope.torch = [1,2,3,4]
        $scope.statusAdd = false;
        $scope.addList = null;
        $scope.curRelaceIndex=0;
        // 取消新建
        $scope.calcel = function(){
            $state.go('repair.manage')
        }

        // 搜索科室
        $scope.officeCoSearch=false;
        $scope.officeSearchIds=function(){
            $scope.officeCoSearch=true;
            $scope.officeSearchId = '';
            $scope.officeResult=[];
            if(!$scope.searchOfficeCon){
                $scope.officeCoSearch=false;
                return;
            }
            $.ajax({
                    type: 'get',
                    url: '/sys/dept/search/tenant/'+($stateParams.tenantId||1),
                    data: {
                        'keyword': $scope.searchOfficeCon
                    },
                    complete: function(res) {
                        if(res.responseJSON.code==500){
                            $scope.onloading = false;
                            $scope.nocontent=true;
                            $rootScope.$apply();
                        }else if(res.responseJSON.code==200){
                            $scope.officeResult=res.responseJSON.data;
                            !$scope.officeResult.length&&($scope.officeCoSearch=false)
                            $rootScope.$apply();
                        }
                    }
                });
        }
        $scope.officeSearchId = '';
        $scope.searchOfficeLi=function(a){
            $scope.officeCoSearch=false;
            $scope.officeSearchId=a.id;
            $scope.searchOfficeCon=a.name;
            // $scope.addData=[];
            // $.ajax({
            //         type: 'get',
            //         url: '/assets/assetsInfo/getLedgerPage',
            //         data: {
            //             "page.current": $scope.pageInfo.current,
            //             "page.size": $scope.pageInfo.size,
            //             'deptId': $scope.officeSearchId,
            //             'keyword': $scope.searchDeptCon
            //         },
            //         complete: function(res) {
            //             $scope.onloading = false;
            //             $scope.nocontent = false;
            //             var code = res.responseJSON.code;
            //             if(code==500){
            //                 $scope.nocontent=true;
            //             }else if(code==200){
            //                 var resData = res.responseJSON.data;
            //                 $scope.pageInfo = res.responseJSON.data;
            //                 $scope.pageInfo.pstyle = 2;
            //                 if(!resData.records.length){
            //                     $scope.nocontent = true;
            //                 }else{
            //                     $scope.addData = resData.records;
            //                 }
            //             }
            //             $rootScope.$apply();
            //         }
            //     });
        }
        // 添加设备
        $scope.pageInfo={
            current: 1,
            size: 8
        }
        $scope.searchOfficeCon='';
        $scope.searchDeptCon='';
        $scope.addData = [];
        $scope.nocontent = false;
        $scope.onloading = false;
        $scope.pagination=function(page,size){
            $scope.addData = [];
            $scope.addList = null;
            $scope.hasChoose = false;
            $scope.onloading = true;
            $scope.nocontent = false;
            $scope.officeResult=[];
            if($scope.searchOfficeCon){
                $.ajax({
                    type: 'get',
                    url: '/sys/dept/search/tenant/'+($stateParams.tenantId||1),
                    data: {
                        'deptId': $scope.officeSearchId,
                        'keyword': $scope.searchOfficeCon
                    },
                    complete: function(res) {
                        $scope.onloading = false;
                        $scope.nocontent=false;
                        if(res.responseJSON.code==500){
                            
                            $scope.nocontent=true;
                            $rootScope.$apply();
                        }else if(res.responseJSON.code==200){
                            $scope.officeResult=res.responseJSON.data;
                            !$scope.officeResult.length&&($scope.nocontent=true)
                        }
                        $rootScope.$apply();
                    }
                });
            }else{
                $.ajax({
                    type: 'get',
                    url: '/assets/assetsInfo/getLedgerPage',
                    data: {
                        "page.current": page||$scope.pageInfo.current,
                        "page.size": size||$scope.pageInfo.size,
                        'deptId': $scope.officeSearchId,
                        'keyword': $scope.searchDeptCon,
                        'status': 99
                    },
                    complete: function(res) {
                        $scope.onloading = false;
                        $scope.nocontent = false;
                        var code = res.responseJSON.code;
                        if(code==500){
                            $scope.nocontent=true;
                        }else if(code==200){
                            var resData = res.responseJSON.data;
                            $scope.pageInfo = res.responseJSON.data;
                            $scope.pageInfo.pstyle = 2;
                            if(!resData.records.length){
                                $scope.nocontent = true;
                            }else{
                                $scope.addData = resData.records;
                            }
                        }
                        $rootScope.$apply();
                    }
                });
            }
        }
        $scope.pagination();
        console.log($scope.addData)
        $scope.searchDeptAndOffice=function(){
            $scope.addData = [];
            $.ajax({
                type: 'get',
                url: '/assets/assetsInfo/getLedgerPage',
                data: {
                    "page.current": 1,
                    "page.size": $scope.pageInfo.size,
                    'deptId': $scope.officeSearchId,
                    'keyword': $scope.searchDeptCon,
                    'status': 99
                },
                complete: function(res) {
                    $scope.onloading = false;
                    $scope.nocontent = false;
                    var code = res.responseJSON.code;
                    if(code==500){
                        $scope.nocontent=true;
                    }else if(code==200){
                        var resData = res.responseJSON.data;
                        $scope.pageInfo = res.responseJSON.data;
                        $scope.pageInfo.pstyle = 2;
                        if(!resData.records.length){
                            $scope.nocontent = true;
                        }else{
                            $scope.addData = resData.records;
                        }
                    }
                    $rootScope.$apply();
                }
            });
        }
        
        // 点击添加设备
        $scope.addMachine = function(){
            $.ajax({
                    type: 'get',
                    url: '/assets/assetsInfo/getLedgerPage',
                    data: {
                        "page.current": $scope.pageInfo.current,
                        "page.size": $scope.pageInfo.size,
                        'deptId': $scope.officeSearchId,
                        'keyword': $scope.searchDeptCon,
                        'status': 99
                    },
                    complete: function(res) {
                        $scope.onloading = false;
                        $scope.nocontent = false;
                        var code = res.responseJSON.code;
                        if(code==500){
                            $scope.nocontent=true;
                        }else if(code==200){
                            var resData = res.responseJSON.data;
                            $scope.pageInfo = res.responseJSON.data;
                            $scope.pageInfo.pstyle = 2;
                            if(!resData.records.length){
                                $scope.nocontent = true;
                            }else{
                                $scope.addData = resData.records;
                            }
                        }
                        $rootScope.$apply();
                    }
                });
            $scope.searchOfficeCon='';
            $scope.wornfirst=false
            $scope.officeCoSearch=false;
            $scope.repairAddDevShow = true;
            angular.element('.b-l-fff input').prop('checked',false)
            // add dev
            var index=layer.open({
                time: 0 //不自动关闭
                ,type: 1
                ,content: $('.repairAddDev')
                ,title: ['选择设备','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                ,closeBtn: 1
                ,shade: 0.3
                ,shadeClose: false
                ,btn: 0
                ,end: function(){
                    $scope.hasChoose=false
                    $scope.officeSearchId=''
                    $scope.searchOfficeCon=''
                    $scope.searchDeptCon='';
                }
                ,area: ['1324px','650px']
            });
            // 点击确定按钮
            $scope.addyes = function(){
                if($scope.hasChoose){
                    $scope.repairAddDevShow = false;
                    layer.close(index)
                    var _index=angular.element('.b-l-fff input:checked').parent().parent().index()-1
                    $scope.add = true;
                    $scope.statusAdd = true;
                    $scope.isDisabled = true;
                }
            }
            $scope.calceladd = function(){
                $scope.addList=null;
                $scope.repairAddDevShow = false;
                $scope.hasChoose=false
                layer.close(index)
            }
            // 点击复选框
            $scope.checkClick = function($event,item){
                angular.element('.b-l-fff input').prop('checked',false)
                angular.element($event.currentTarget).find('input').prop('checked',true)
                $scope.hasChoose=true
                $scope.addList=item;

            }
        }
        $scope.pageInfo = {
            pages: 3,
            total: 30,
            size: 8,
            current: 1
        };
        // end
        // 删除设备
        $scope.delectMachine = function($index){
            $scope.add = false;
            $scope.addList = null;
            $scope.statusAdd = false;
            $scope.isDisabled = false;
        }
        // 计算数字300
        $scope.currentNum = 0
        $scope.sum = function(){
            $scope.worntwo = false
            $scope.currentNum = $scope.describe.length
            if( $scope.currentNum >= 300){
                // $scope.overnum = true
                $scope.describe = $scope.describe.substring(0,300)
                $scope.currentNum=300
            }
        }

        $scope.addState = true;

        // 点击上传图片
        $scope.upload = function(){
        	angular.element('.muchinput').val('');
            angular.element('.muchinput').click()
        }
        angular.element('.muchinput').change(function(){
            var _length = $scope.url.length+$(this)[0].files.length;
            if(_length>5){
                var msg = layer.msg('<div class="toaster"><span>' + '最多上传五张' + '</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
            }else{
                for(var i=0;i<$(this)[0].files.length;i++){
                    var _type = $(this)[0].files[i].type
                    var _size = $(this)[0].files[i].size/(1024*1024)
                    if(_size>2){
                        var msg = layer.msg('<div class="toaster"><span>' + '图片大于2M，上传失败' + '</span></div>', {
                            area: ['100%', '60px'],
                            time: 3000,
                            offset: 'b',
                            shadeClose: true,
                            shade: 0
                        });
                    }
                    if(_type=='image/png'||_type=='image/jpg'||_type=='image/jpeg') {
                        if (_size <= 2) {
                            console.log(_size)
                            _length = _length - 1
                            if (_length == 5) {
                                $scope.clickAdd = false
                            }
                            var windowUrl = window.URL || window.webkitURL;
                            var _data = windowUrl.createObjectURL($(this)[0].files[i])
                            // 去重
                            if ($scope.url.join().indexOf(_data) == -1) {
                                $scope.url.push(_data)

                                // qiniuURL($(this)[0].files[0])
                                $scope.repairUploadImg($(this)[0].files[0]);
                            }
                            $rootScope.$apply();
                        }
                        if (_type != 'image/png' && _type != 'image/jpg' && _type != 'image/jpeg') {
                            var msg = layer.msg('<div class="toaster"><span>' + '图片格式错误，上传失败' + '</span></div>', {
                                area: ['100%', '60px'],
                                time: 3000,
                                offset: 'b',
                                shadeClose: true,
                                shade: 0
                            });
                        }
                    }
                }
            }
            // // 清除file
            // var obj = $('.muchinput')[0] ;
            // obj.outerHTML=obj.outerHTML;
        })
        $scope.repairUploadImg=function(a,b){
            $scope.imgLoading = true;
            var formData = new FormData();
            formData.append("files", a);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'api/upload');
            // xhr.setRequestHeader("X-AEK56-Token", $localStorage["X-AEK56-Token"]);
            xhr.send(formData);
            xhr.onreadystatechange = function () {
                var res = xhr.response;
                $scope.imgLoading = false;
                var resmsg = '网络故障，图片上传失败，请重试';
                if(xhr.readyState == 4){
                    if(JSON.parse(res).code == '200'){
                        resmsg='图片上传成功';
                        if(b){
                            $scope.urls[b]=JSON.parse(res).data[0];
                        }else{
                            $scope.urls.push(JSON.parse(res).data[0]);
                        }
                    }
                    var msg = layer.msg('<div class="toaster"><span>' + resmsg + '</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                }
            }
        }
        // 删除图片
        $scope.delect = function($index){
            $scope.delactInput=!$scope.delactInput;
            $scope.url.splice($index,1)
            $scope.urls.splice($index,1)
            if($scope.url.length<=4){
                $scope.clickAdd = true
            }
        }
        $scope.replaceImg=function(){
        	 var _type = $('.oneinput')[0].files[0].type
                var _size = $('.oneinput')[0].files[0].size/(1024*1024)
                if(_size>2){
                    var msg = layer.msg('<div class="toaster"><span>' + '图片大于2M，上传失败' + '</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                }
                if(_type!='image/png'&&_type!='image/jpg'&&_type!='image/jpeg'){
                    var msg = layer.msg('<div class="toaster"><span>' + '图片格式错误，上传失败' + '</span></div>', {
                        area: ['100%', '60px'],
                        time: 3000,
                        offset: 'b',
                        shadeClose: true,
                        shade: 0
                    });
                   $(".oneinput").val('');   
                    
                }
                if(_type=='image/png'||_type=='image/jpg'||_type=='image/jpeg'){
                    if(_size<=2) {
                        var windowUrl = window.URL || window.webkitURL;
                        var data = windowUrl.createObjectURL($('.oneinput')[0].files[0]);
                        $scope.url.splice($scope.curRelaceIndex, 1, data);
                        $scope.repairUploadImg($('.oneinput')[0].files[0], $scope.curRelaceIndex)
                    }
                }      	
        }
        // 更换图片
        $scope.replace = function($index){
            angular.element('.oneinput').click();
            $scope.curRelaceIndex=$index;
        }
        // 紧急程度
        function number($event,$index){
            angular.element($event.target).attr('src','../../../res/img/huoh.png')
            angular.element($event.target).prevAll('img').attr('src','../../../res/img/huoh.png')
            angular.element($event.target).nextAll('img').attr('src','../../../res/img/huohs.png')
            if($index==0){
                $scope.number='不紧急'
            }else if($index==1){
                $scope.number='一般'
            }else if($index==2){
                $scope.number='紧急'
            }else{
                $scope.number='非常紧急'
            }
        }
        $scope.level = function($event,$index){
            number($event,$index)
            $scope.urgentLevel = $index+1;
            $scope.wornthree = false
        }
        // 七牛img URL
        $scope.imgLoading = false;
        function qiniuURL(a,b){
            $scope.imgLoading = true;
            var formData = new FormData();
            formData.append("file", a);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/upload/api/qiniu/index/upload');
            // xhr.setRequestHeader("X-AEK56-Token", $localStorage["X-AEK56-Token"]);
            xhr.send(formData);
            xhr.onreadystatechange = function () {
                var res = xhr.response;
                $scope.imgLoading = false;
                var resmsg = '网络故障，图片上传失败，请重试';
                if(xhr.readyState == 4){
                    if(JSON.parse(res).code == 'OK'){
                        resmsg='图片上传成功';
                        if(b){
                            $scope.urls[b]=JSON.parse(res).data;
                        }else{
                            $scope.urls.push(JSON.parse(res).data);
                        }
                    }
                }
                var msg = layer.msg('<div class="toaster"><span>' + resmsg + '</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
            }
        }
        // 提交维修申请
        $scope.subApply = function(){
            console.log($scope.addList)
            // 点击一次就不能重复发送请求
            if(!$scope.addList){
                $scope.wornfirst= true;
            }
            if(!$scope.describe){
                $scope.worntwo= true
            }
            if(!$scope.number){
                $scope.wornthree= true
            }
            // {
            //         assetsNum: 123,
            //         assetsName: 'asdf',
            //         faultDesc: $scope.describe,
            //         urgentLevel: $scope.urgentLevel,
            //         assetsId: 123333,
            //         assetsDeptName: 'shiyongkeshi'
            //     }
            // var formData = new FormData();
            // formData.append('assetsNum',Math.floor(Math.random()*1000000000));
            // formData.append('assetsName','asdf'+Math.floor(Math.random()*100000));
            // formData.append('faultDesc',$scope.describe);
            // formData.append('urgentLevel',$scope.urgentLevel);
            // formData.append('assetsId',Math.floor(Math.random()*100000));
            // formData.append('assetsDeptName',"shiyongkeshi");
            // formData.append('files',$scope.urls);
            // console.log($scope.urls);
            // formData.append("files", file);
            if($scope.imgLoading){
                var msg = layer.msg('<div class="toaster"><span>' + '图片正在上传中，请稍后' + '</span></div>', {
                    area: ['100%', '60px'],
                    time: 3000,
                    offset: 'b',
                    shadeClose: true,
                    shade: 0
                });
                return;
            }
            if($scope.addList&&$scope.describe&&$scope.number){
                $scope.applyBtn = true;
                $.ajax({
                    type: 'post',
                    url: '/repair/apply/add',
                    // contentType: "multipart/form-data; boundary=AaB03x",
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify({
                        assetsNum: $scope.addList.assetsNum,
                        assetsName: $scope.addList.assetsName,
                        faultDesc: $scope.describe,
                        urgentLevel: $scope.urgentLevel,
                        assetsId: $scope.addList.id,
                        assetsDeptName:  $scope.addList.deptName,
                        assetsImg: $scope.urls.join(','),
                        tenantId: $stateParams.tenantId||$localStorage.userInfo.tenantId||1,
                        warrantyDate: $scope.addList.warrantyDate,
                        assetsSpec: $scope.addList.assetsSpec,
                        startUseDate: $scope.addList.startUseDate,
                        factoryNum: $scope.addList.factoryNum,
                        factoryName: $scope.addList.factoryName,
                        deptId:$scope.addList.deptId //部门id
                    }),
                    complete: function(res) {
                        if(res.responseJSON.code==200){
                            $state.go('repair.manage');
                        }else{
                            $scope.applyBtn = false;
                        }
                    }
                });
            }

//             var xhr = new XMLHttpRequest();
// 　　        xhr.open('POST', 'api/repair/apply/add');
//             xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=AaB03x");
//             xhr.setRequestHeader("X-AEK56-Token", $localStorage["X-AEK56-Token"]);
//              xhr.onreadystatechange = function(){
//                 if(xhr.readyState == 4){
//                     console.log(xhr);
//                 }
//             }　
//             xhr.send(formData);

            // if($scope.addList&&$scope.describe&&$scope.number){
            //     // 弹窗
            //     $scope.repairSubmitShow = true;
            //     var index=layer.open({
            //         time: 0 //不自动关闭
            //         ,type: 1
            //         ,content: $('#alertRepairSubmit')
            //         ,title: ['提示','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
            //         ,closeBtn: 1
            //         ,shade: 0.3
            //         ,shadeClose: true
            //         ,btn: 0
            //         ,area: ['540px','250px']
            //     });
            //     // 点击确定
            //     $scope.btnyes = function(){
            //         $state.go('repair.identify',{'status':'待故障鉴定'})
            //         layer.close(index)
            //         $scope.repairSubmitShow = false;
            //     }
            //     $scope.btncancel = function(){
            //         layer.close(index)
            //         $scope.repairSubmitShow = false;
            //     }
            // }
        }
        console.log($scope.url)
    }])

