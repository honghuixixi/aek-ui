angular.module('app')
    .controller('repairIdentifyController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
        $rootScope.currentmodule = "维修管理";
        $rootScope.userInfo = $localStorage.userInfo;
        $rootScope.applyid=$stateParams.applyid;
        $rootScope.assetsId=$stateParams.assetsId;
        $scope.nine = false;
        $scope.resolveAttitude=[false,false,false,false,false];
        $scope.resolveRespond=[false,false,false,false,false];
        $scope.resolveMass=[false,false,false,false,false];
        $scope.attitudeArr=[{text:"很差",scroe:'2分'},{text:"差",scroe:'4分'},
            {text:"一般",scroe:'6分'},{text:"满意",scroe:'8分'},{text:"非常满意",scroe:'10分'}];
        $scope.qualityArr=[{text:"很差",scroe:'2分'},{text:"差",scroe:'4分'},{text:"一般",scroe:'6分'},
            {text:"好",scroe:'8分'},{text:"非常好",scroe:'10分'}];
        $scope.speedArr= [{text:"很慢",scroe:'2分'},{text:"慢",scroe:'4分'},{text:"一般",scroe:'6分'},
            {text:"快",scroe:'8分'},{text:"非常快",scroe:'10分'}]
        $scope.imgArr=[];
        $scope.severStatus=''

        // 维修时间
$scope.repairDate1 = 0;
$scope.repairDate2 = 0;
$scope.repairTime = {day:'',hour:''};
// 等待时间
$scope.repairWait1 = 0;
$scope.repairWait2 = 0;
$scope.repairWait = {day:'',hour:''};
// 真实时间
$scope.repairTrue1 = 0;
$scope.repairTrue2 = 0;
$scope.repairTrue = {day:'',hour:''};
        // 图片路径问题
        $scope.imgUrl = function(uri){
            return 'http://'+window.location.host + '/api/file'+uri;
        }
        // 各个经过的过程
        $scope.getApplyDetails = function(){
            $.ajax({
                type: "get",
                url: "/repair/apply/getApplyDetails/" + $rootScope.applyid,
                async:false,
                // data: {'id': $rootScope.applyid},
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        $scope.listMsg = res.responseJSON.data
                        $scope.repairDate1 = res.responseJSON.data.reportRepairDate;
                        if(res.responseJSON.data.repairDate){
                            $scope.severStatus = true;
                        }
                        $scope.repairTrue1 = res.responseJSON.data.identifyDate;
                        // $scope.initcalendar(0,$scope.repairDate1,0,'.data-startDate');
                        // $scope.initcalendar(0,$scope.repairTrue1,$scope.repairDate1,'.true-startDate');
                    }
                }
            });
        };
        $scope.getApplyDetails();
        // 查看维修报告单的请求
        $scope.lookRepair = function(){
            $.ajax({
                type: "get",
                url: "/repair/repRepairReport/search/"+$rootScope.applyid,
                data:{id:$rootScope.applyid},
                async:false,
                complete: function (res) {
                    if(res.responseJSON.code == 200){
                        var _data=res.responseJSON.data;
                        $scope.findRepair=_data;
                        var t1 =_data.repairPeriodEnd - _data.repairPeriodStart;
                        $scope.findTimed=Math.floor(t1/3600000/24);
                        $scope.findTimeh=Math.floor(t1/3600000)%24;
                        $scope.findTimem=Math.ceil(t1/1000/60)%60;
                        if($scope.findTimem>0){
                            $scope.findTimeh=$scope.findTimeh+1
                        }
                        var t2 = _data.actualEnd - _data.actualStart;
                        $scope.findTimed2=Math.floor(t2/3600000/24);
                        $scope.findTimeh2=Math.floor(t2/3600000)%24;
                        $scope.findTimem2=Math.ceil(t1/1000/60)%60;
                        if($scope.findTimem2>0){
                            $scope.findTimeh2=$scope.findTimeh2+1
                        }
                        $scope.findTypeKey=_data.repairTypeKey;
                        $scope.findResultKey=_data.repairResultKey;
                        if(_data.faultPhenomenonKeys){
                            $scope.findPhenomenonKeys=_data.faultPhenomenonKeys.split(',');
                        }
                       if(_data.faultReasonKeys){
                           $scope.findReasonKeys=_data.faultReasonKeys.split(',');
                       }
                       if(_data.workContentKeys){
                           $scope.findworkContentKeys=_data.workContentKeys.split(',');
                           console.log($scope.findworkContentKeys)
                       }

                        var reg = new RegExp("^[0-9]*$");
                        if($scope.findPhenomenonKeys){
                            for(var i=0;i<$scope.findPhenomenonKeys.length;i++){
                                if($scope.findPhenomenonKeys[i]){
                                    if(reg.test($scope.findPhenomenonKeys[i])){
                                        $.ajax({
                                            type: "get",
                                            url: "/repair/repairDictionary/selectkey/" + $scope.findPhenomenonKeys[i],
                                            data: {key: $scope.findPhenomenonKeys[i]},
                                            async:false,
                                            complete: function (res) {
                                                if (res.responseJSON.code == 200){
                                                    $scope.findPhenomenonKeys[i]=res.responseJSON.data.name;
                                                    console.log($scope.findPhenomenonKeys)
                                                }
                                            }
                                        })
                                    }
                                }
                            };
                        }
                        if($scope.findReasonKeys){
                            for(var i=0;i<$scope.findReasonKeys.length;i++){
                                if($scope.findReasonKeys[i]){
                                    if(reg.test($scope.findReasonKeys[i])){
                                        $.ajax({
                                            type: "get",
                                            url: "/repair/repairDictionary/selectkey/" + $scope.findReasonKeys[i],
                                            data: {key: $scope.findReasonKeys[i]},
                                            async:false,
                                            complete: function (res) {
                                                if (res.responseJSON.code == 200){
                                                    $scope.findReasonKeys[i]=res.responseJSON.data.name;
                                                }
                                            }
                                        })
                                    }
                                }
                            };
                        }
                        console.log($scope.findworkContentKeys)
                        if($scope.findworkContentKeys){
                            for(var i=0;i<$scope.findworkContentKeys.length;i++){
                                if($scope.findworkContentKeys[i]){
                                    if(reg.test($scope.findworkContentKeys[i])){
                                        $.ajax({
                                            type: "get",
                                            url: "/repair/repairDictionary/selectkey/" + $scope.findworkContentKeys[i],
                                            data: {key: $scope.findworkContentKeys[i]},
                                            async:false,
                                            complete: function (res) {
                                                if (res.responseJSON.code == 200){
                                                    $scope.findworkContentKeys[i]=res.responseJSON.data.name;
                                                }
                                            }
                                        })
                                    }

                                }
                            };
                        }

                        $.ajax({
                            type: "get",
                            url: "/repair/repairDictionary/selectkey/" +$scope.findTypeKey,
                            data: {key: $scope.findTypeKey},
                            async:false,
                            complete: function (res) {
                                if (res.responseJSON.code == 200){
                                    $scope.findTypeKey=res.responseJSON.data.name;
                                }
                            }
                        })
                        $.ajax({
                            type: "get",
                            url: "/repair/repairDictionary/selectkey/" + $scope.findResultKey,
                            data: {key: $scope.findResultKey},
                            async:false,
                            complete: function (res) {
                                if (res.responseJSON.code == 200){
                                    $scope.findResultKey=res.responseJSON.data.name;
                                    $scope.findResultName=res.responseJSON.data.name
                                }
                            }
                        })
                        $.ajax({
                            type: "get",
                            url: "/repair/repRepairParts/search/" + $rootScope.applyid,
                            data: {id: _data.id},
                            async:false,
                            complete: function (res) {
                                if (res.responseJSON.code == 200) {
                                    $scope.findList = res.responseJSON.data;
                                    if( $scope.findList){
                                        var _length = $scope.findList.length
                                        for (var i = 0; i < _length; i++) {
                                            $.ajax({
                                                type: "get",
                                                url: "/repair/repairDictionary/selectkey/" + $scope.findList[i].unitKey,
                                                data: {key: $scope.findList[i].unitKey},
                                                async:false,
                                                complete: function (res) {
                                                    if (res.responseJSON.code == 200){
                                                        $scope.findList[i].unitKey=res.responseJSON.data.name;
                                                    }
                                                }
                                            })
                                        }
                                    }

                                }
                            }
                        })
                    }
                    }
            });
        }
        // 根据列表传来的状态分别发送请求
        $scope.search = function(){
            $.ajax({
                type: "get",
                url: "/repair/apply/search/"+ $rootScope.applyid,
                complete: function (res) {
                    if (res.responseJSON.code == 200) {
                        $scope.data = res.responseJSON.data
                        if($scope.data.status!=1){
                            $scope.witeident = true
                        }
                        if($scope.data.urgentLevel==1){
                            // 待故障鉴定
                            $scope.urgent='不紧急'
                            $scope.urgentImg=['../../../res/img/huoh.png','../../../res/img/huohs.png','../../../res/img/huohs.png','../../../res/img/huohs.png']
                        }else if($scope.data.urgentLevel==2){
                            $scope.urgent='一般'
                            $scope.urgentImg=['../../../res/img/huoh.png','../../../res/img/huoh.png','../../../res/img/huohs.png','../../../res/img/huohs.png']
                        }else if($scope.data.urgentLevel==3){
                            $scope.urgent='紧急'
                            $scope.urgentImg=['../../../res/img/huoh.png','../../../res/img/huoh.png','../../../res/img/huoh.png','../../../res/img/huohs.png']
                        }else{
                            $scope.urgent='非常紧急'
                            $scope.urgentImg=['../../../res/img/huoh.png','../../../res/img/huoh.png','../../../res/img/huoh.png','../../../res/img/huoh.png']
                        }
                        if($scope.data.assetsImg){
                            var list=$scope.data.assetsImg.split(',')
                            $scope.imgList = list
                            for(var i=0;i<$scope.imgList.length;i++){
                                $scope.imgArr[i]={src:$scope.imgList[i]}
                            }
                        }else{
                            $scope.imgList=['../../../res/img/dt.png'];
                            $scope.imgArr = [{src:'../../../res/img/dt.png'}];

                        }
                        if($scope.data.status==2||$scope.data.status==3){
                            // 现场解决和待维修
                            $scope.listOne=true;
                            $scope.listTwo=false;
                            $scope.listThree=false;
                            $scope.listFour=false;
                        }
                        if($scope.data.status==4){
                            // 已维修待验收
                            $scope.listOne=true;
                            $scope.listTwo=true;
                            $scope.listThree=false;
                            $scope.listFour=false;
                        }
                        if($scope.data.status==5){
                            // 验收通过
                            if($scope.severStatus){
                                $scope.lookRepair();
                            }
                            $scope.listOne=true;
                            $scope.listTwo=true;
                            $scope.listThree=true;
                            $scope.listFour=false;
                        }
                        if($scope.data.status==6){
                            // 验收不通过
                            if($scope.severStatus){
                                $scope.lookRepair();
                            }
                            $scope.listOne=true;
                            $scope.listTwo=true;
                            $scope.listThree=false;
                            $scope.listFour=true;
                        }
                        $rootScope.$apply();
                    }
                }
            })
        }
        $scope.search();
        $scope.transform = function(l){
            if(l==1){
                return '待故障鉴定';
            }else if(l==2){
                return '已现场解决';
            }else if(l==3){
                return '待维修';
            }else if(l==4){
                return '已维修待验收';
            }else if(l==5){
                return '已完成';
            }else{
                return '验收未通过';
            }
        };

        // // 设备信息
        // $scope.getAssetsDetails = function(){
        //     $.ajax({
        //         type: "get",
        //         url: "/repair/apply/getAssetsDetails/" + $rootScope.assetsId,
        //         data: {'id': $rootScope.assetsId},
        //         complete: function (res) {
        //             if (res.responseJSON.code == 200) {
        //                 $scope.assetsList = res.responseJSON.data;
        //                 $rootScope.$apply();
        //             }
        //         }
        //     });
        // }
        // $scope.getAssetsDetails()
        $rootScope.role=$stateParams.role
        $scope.addParts=false  // 新增配件
        $scope.addWork=[] // 添加工作内容
        // $scope.unitArr=['个','盒','支']
        $scope.unitArr=[]
        $scope.addReason=[]
        $scope.addphenom=[]
        $scope.partList=[]
        $scope.unitInput='';
        $scope.reasonChoose=['人为因素','设备故障','外界环境因素']
        $scope.workList=[];
        // 字典表查询
        $scope.pheno = 3;
        $scope.peopleReason = 4;
        $scope.facilityReason = 5;
        $scope.environment = 6;
        $scope.workMatter = 7;
        $scope.danwei = 1;
        $scope.repairType = 2;
        $scope.repairResult = 8;
        $scope.dictionary = function(id){
            $.ajax({
                type: "get",
                url: "/repair/repairDictionary/search/"+id,
                async: false,
                data: {'id':id},
                complete: function (res) {
                    if(res.responseJSON.code == 200){
                        var _length=res.responseJSON.data.length
                        if(id == $scope.danwei){
                            $scope.unitArr=res.responseJSON.data
                            $scope.part={
                                name:'',
                                model:'',
                                product:'',
                                number:'',
                                unitInput:$scope.unitArr[1].name,
                                price:'',
                                unitkey:$scope.unitArr[1].key
                            }
                        }
                        if(id == $scope.repairType ){
                            $scope.optionType2 = res.responseJSON.data;
                        }
                        if(id == $scope.repairResult ){
                            $scope.optionType3 = res.responseJSON.data;
                        }
                        if(id == $scope.pheno){
                            $scope.troubleList=res.responseJSON.data
                            for(var i=0;i<_length;i++){
                                $scope.troubleList[i].checked=false
                                $scope.troubleList[i].choose=false
                            }
                            // $rootScope.$apply()
                        }
                        if(id==$scope.peopleReason){
                            $scope.peopleList=res.responseJSON.data
                            for(var i=0;i<_length;i++){
                                $scope.peopleList[i].checked=false
                                $scope.peopleList[i].choose=false
                            }
                        }
                        if(id==$scope.facilityReason){
                            $scope.machineList=res.responseJSON.data
                            for(var i=0;i<_length;i++){
                                $scope.machineList[i].checked=false
                                $scope.machineList[i].choose=false
                            }
                        }
                        if(id==$scope.environment){
                            $scope.environList=res.responseJSON.data
                            for(var i=0;i<_length;i++){
                                $scope.environList[i].checked=false
                                $scope.environList[i].choose=false
                            }
                        }
                        if(id==$scope.workMatter){
                            $scope.workList=res.responseJSON.data;
                            for(var i=0;i<_length;i++){
                                $scope.workList[i].checked=false;
                                $scope.workList[i].choose=false
                            }
                        }
                        // $rootScope.$apply();
                    }
                }
            })
        }
        $scope.dictionary(1);
        $scope.dictionary(2);
        $scope.dictionary(8);
        $scope.troubleList=[];
        $scope.peopleList=[];
        $scope.machineList=[];
        $scope.environList=[];
        // 选择工作内容
        $scope.workAdd=function(){
            for(var i=0;i<$scope.workList.length;i++){
                if($scope.workList[i].name==$scope.workcontent){
                    $scope.workSame = true;
                }
            }
            if(!$scope.workSame){
            $scope.workList.push({'name':$scope.workcontent,'checked':true,'key':$scope.workcontent})
            $scope.workcontent = ''
            }
        }
        $scope.workChange = function(){
            $scope.workSame = false;
        }
        $scope.workClick = function(){
            $scope.workSame = false;
            $scope.workcontent = '';
        }
        // 选择故障现象
        $scope.errorAddp=function(){
            for(var i=0;i<$scope.troubleList.length;i++){
                if($scope.troubleList[i].name==$scope.newError){
                    $scope.errorSame = true;
                }
            }
            if(!$scope.errorSame) {
                $scope.troubleList.push({'name': $scope.newError, 'checked': true, 'key': $scope.newError})
                $scope.newError = ''
            }
        }
        $scope.errorChange = function(){
            $scope.errorSame = false;
        }
        $scope.errorClick = function(){
            $scope.errorSame = false;
            $scope.newError = ''
        }
        // 故障原因
        $scope.troubleClick = function($event,$index){
            $scope.troubleErr = $($event.target).text()
            $scope.errList = false
            $scope.errorindex=$index
        }
        $scope.errorAdd = function(){
            for(var i=0;i<$scope.peopleList.length;i++){
                if($scope.peopleList[i].name==$scope.error){
                    $scope.errormSame = true;
                }
            }
            for(var i=0;i<$scope.machineList.length;i++){
                if($scope.machineList[i].name==$scope.error){
                    $scope.errormSame = true;
                }
            }
            for(var i=0;i<$scope.environList.length;i++){
                if($scope.environList[i].name==$scope.error){
                    $scope.errormSame = true;
                }
            }
            if($scope.errorindex==0&&!$scope.errormSame){
                $scope.peopleList.push({name:$scope.error,checked:true,'key':$scope.error})
                $scope.error=''
            }else if($scope.errorindex==1&&!$scope.errormSame){
                $scope. machineList.push({name:$scope.error,checked:true,'key':$scope.error})
                $scope.error=''
            }else if($scope.errorindex==2&&!$scope.errormSame){
                $scope. environList.push({name:$scope.error,checked:true,'key':$scope.error})
                $scope.error=''
            }

        }
        $scope.errormChange = function(){
            $scope.errormSame = false;
        }
        $scope.errormClick = function(){
            $scope.errormSame = false;
            $scope.error='';
        }
        // 点击放大图片
        $scope.bigImg = function(){
            // 查看大图

            $scope.currentImg= $scope.imgArr[0];
            $scope.currentImg.index=0;
            $scope.repairPicsShow = true;
            $scope.repairPicChange=function(a,b){
                if($scope.currentImg.index==0&&a==-1||$scope.currentImg.index==($scope.imgArr.length-1)&&a==1){
                    return;
                }
                if(a!=2){
                    var index= $scope.currentImg.index+a;
                    $scope.currentImg= $scope.imgArr[index];
                    $scope.currentImg.index = index;
                }else {
                    $scope.currentImg= $scope.imgArr[b];
                    $scope.currentImg.index = b;
                }
            }
            // 查看大图 END
        }
        // 故障鉴定
        // 计算数字300
        $scope.currentNum = 0
        $scope.sum = function(){
            $scope.worntwo = false
            $scope.currentNum = $scope.identifyComent.length
            if( $scope.currentNum >300){
                // $scope.overnum = true
                $scope.identifyComent = $scope.identifyComent.substring(0,300)
                $scope.currentNum=300
            }
        }
        // 验收计算300字
        $scope.currentAccept = 0
        $scope.sumAccept = function(){
            $scope.currentAccept = $scope.assessComent.length
            if( $scope.assessComent.length >=300){
                // $scope.overDis = true
                $scope.assessComent = $scope.assessComent.substring(0,300)
                $scope.currentAccept=300
            }
        }
        $scope.errorSure = function(){
            // $scope.identifyComent = '';
            // angular.element('.noIdenti').prop('checked','checked');
            $scope.repairIndetifyShow = true;
            var index=layer.open({
                time: 0 //不自动关闭
                ,type: 1
                ,content: $('.repairIdentifyDetail')
                ,title: ['故障鉴定','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                ,closeBtn: 1
                ,shade: 0.3
                ,shadeClose: true
                ,btn: 0
                ,area: ['650px','450px']
            });
            $scope.erroryes = function(){
                $scope.errorDisabled = true;
                var _index=angular.element('.repairIdentifyDetailOne input:checked').parent().parent().index()
                if(_index==2){
                    $scope.locale=1
                }else{
                    $scope.locale=2
                }
                $.ajax({
                    type: "post",
                    url: "/repair/repRepairAppraisal/appraisal",
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify({
                        "applyId": $rootScope.applyid,
                        "identifyComent":$scope.identifyComent ,
                        "sceneFlag": $scope.locale,
                    }),
                    complete: function (res) {
                        if (res.responseJSON.code == 200) {
                            $scope.identiyes=true;
                            $scope.search();
                            $scope.getApplyDetails();
                            // $scope.getAssetsDetails();
                            $scope.repairIndetifyShow = false;
                            layer.close(index);
                        }else{
                            $scope.errorDisabled = false;
                        }
                    }
                })
            }
            $scope.errorno = function(){
                $scope.repairIndetifyShow = false
                layer.close(index)
            }
        }
        // 点击验收
        $scope.acceptRes = function(){
            $scope.repairCheckShow = true;
            var index=layer.open({
                time: 0 //不自动关闭
                ,type: 1
                ,content: $('.repairCheckAccpet')
                ,title: ['验收','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
                ,closeBtn: 1
                ,shade: 0.3
                ,shadeClose: true
                ,success:function () {

                }
                ,btn: 0
                ,area: ["630px","590px"]
            });
            $scope.acceptyes = function(){
                if(!$scope.acceptStatus){
                    $scope.acceptTop=true
                }
                if(!$scope.repairAttitude.txt||!$scope.repairRespond.txt||!$scope.repairMass.txt){
                    $scope.acceptBtn=true
                }
                if(!$scope.acceptTop&&!$scope.acceptBtn) {
                    $scope.acceptButton = true;
                    if ($scope.acceptCheck) {
                        $scope.checkStatus = 1
                    } else {
                        $scope.checkStatus = 2
                    }
                    if ($scope.acceptCheck&&$scope.checkModel == '正常工作') {
                        $scope.assetsStatus = 1
                    }
                    if ($scope.acceptCheck&&$scope.checkModel == '基本正常') {
                        $scope.assetsStatus = 2
                    }
                    if($scope.acceptCheck&&$scope.checkModel == '其他'){
                        $scope.assetsStatus = 3
                    }
                    if(!$scope.acceptCheck&&$scope.checkModel == '需进一步维修'){
                        $scope.assetsStatus = 4
                    }
                    if(!$scope.acceptCheck&&$scope.checkModel == '需外送维修'){
                        $scope.assetsStatus = 5
                    }
                    if(!$scope.acceptCheck&&$scope.checkModel == '其他'){
                        $scope.assetsStatus = 6
                    }
                    $.ajax({
                        type: "post",
                        url: "/repair/repRepairCheck/check",
                        contentType: "application/json;charset=UTF-8",
                        data: JSON.stringify({
                            "applyId": $rootScope.applyid,
                            "assessComent": $scope.assessComent,
                            "assetsStatus": $scope.assetsStatus,
                            "checkStatus": $scope.checkStatus,
                            "repairAttitude": $scope.repairattitude,
                            "repairQuality": $scope.repairQuality,
                            "responseSpeed": $scope.responseSpeed
                        }),
                        complete: function (res) {
                            if (res.responseJSON.code == 200) {
                                $scope.search();
                                $scope.getApplyDetails();
                                // $scope.getAssetsDetails();
                                $scope.repairIndetifyShow = false;
                                layer.close(index);
                            }else{
                                $scope.acceptButton = false;
                                var msg = layer.msg('<div class="toaster"><span>' + res.responseJSON.msg + '</span></div>', {
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
            $scope.acceptno = function(){
                $scope.repairCheckShow = false
                layer.close(index)
            }
        }
        $scope.repairCheckSelected =false;
        $scope.repairCheckHadSelected=function(a){
            $scope.repairCheckSelected = true;
            $scope.acceptStatus = true
            $scope.acceptTop=false
            $scope.acceptBtn=false
            $scope.acceptCheck=a
            if(a){
                $scope.optionCheck = [{
                    id: '',
                    name: '正常工作'
                },{
                    id: 1,
                    name: '基本正常'
                }, {
                    id: 2,
                    name: '其他'
                }];
            }else {
                $scope.optionCheck = [{
                    id: '',
                    name: '需进一步维修'
                },{
                    id: 1,
                    name: '需外送维修'
                }, {
                    id: 2,
                    name: '其他'
                }];
            }
            $scope.checkModel = $scope.optionCheck[0].name;
            $scope.checkList = false;
            if($scope.repairCheckSelected) return;
            $rootScope.$apply();
        }
        $scope.repairCheckHadSelected(1)
        // 验收END
// repair server star
$scope.repairAttitude={
    star1: false,
    star2: false,
    star3: false,
    star4: false,
    star5: false,
    txtArr: ["很差","差","一般","满意","非常满意"],
    txt: '',
    score: ''
}
$scope.repairRespond={
    star1: false,
    star2: false,
    star3: false,
    star4: false,
    star5: false,
    txtArr: ["很慢","慢","一般","快","非常快"],
    txt: '',
    score: ''
}
$scope.repairMass={
    star1: false,
    star2: false,
    star3: false,
    star4: false,
    star5: false,
    txtArr: ["很差","差","一般","好","非常好"],
    txt: '',
    score: ''
}
$scope.repairServerStar = function(a,b,c){
    $scope.acceptBtn=false;
    if(c=='attitude'){
        $scope.repairattitude=b;
    }
    if(c=='respond'){
        $scope.responseSpeed=b;
    }
    if(c=='quality'){
        $scope.repairQuality=b;
    }

    for (var i = 1; i < 6; i++) {
        $scope[a]["star"+i]=false;
    };
    switch (b){
        case 1:
            $scope[a].txt=$scope[a].txtArr[b-1];
            $scope[a].score='2.0分';
            break;
        case 2:
            $scope[a].txt=$scope[a].txtArr[b-1];
            $scope[a].score='4.0分';
            break;
        case 3:
            $scope[a].txt=$scope[a].txtArr[b-1];
            $scope[a].score='6.0分';
            break;
        case 4:
            $scope[a].txt=$scope[a].txtArr[b-1];
            $scope[a].score='8.0分';
            break;
        case 5:
            $scope[a].txt=$scope[a].txtArr[b-1];
            $scope[a].score='10.0分';
            break;
        default:
            break;
    }
    do {
        $scope[a]["star"+b]=true;
        b--;
    }while(b>0)
}
// END
// 下拉菜单
$scope.typeList = false;
$scope.typeModel = '紧急程度';
$scope.option = function(list, value, item) {
    $rootScope.fixWrapShow = false;
    $scope[list] = false;
    $scope[value] = item.name;
}
$scope.listShow = function(str) {
    if($rootScope.fixWrapShow)
        return $scope.menuHide();
    $scope[str] = true;
    $rootScope.fixWrapShow = true;
}
$rootScope.fixWrapShow = false;
$scope.menuHide = function() {
    $rootScope.fixWrapShow = false;
    $scope.stateList = false;
    $scope.typeList = false;
    $scope.operateList = false;
}
$scope.optionType = [{
    id: '',
    name: '紧急'
},{
    id: 1,
    name: '非常紧急'
}, {
    id: 2,
    name: '不紧急'
}];
// 下拉菜单2
$scope.typeList2 = false;
$scope.typeModel2={name:'',key:''};
$scope.typeModel2.name = '请选择维修内容';
$scope.option2 = function(list, value, item) {
    $scope.first=false
    $scope[list] = false;
    $scope[value].name = item.name;
    $scope[value].key = item.key;
}
$scope.menuHide2 = function() {
    $rootScope.fixWrapShow = false;
    $scope.stateList = false;
    $scope.typeList2 = false;
    $scope.operateList = false;
}
$scope.listShow2 = function(str) {
    if($rootScope.fixWrapShow)
        return $scope.menuHide2();
    $scope[str] = true;
    $rootScope.fixWrapShow = true;
}

// 下拉菜单3
$scope.typeList = false;
$scope.typeModel3={name:'',key:''};
$scope.typeModel3.name = '选择维修后状态';
$scope.option3 = function(list, value, item) {
    $scope.six = false;
    $rootScope.fixWrapShow = false;
    $scope[list] = false;
    $scope[value].name = item.name;
    $scope[value].key = item.key;
}
$scope.listShow3 = function(str) {
    if($rootScope.fixWrapShow)
        return $scope.menuHide3();
    $scope[str] = true;
    $rootScope.fixWrapShow = true;
}
$rootScope.fixWrapShow = false;
$scope.menuHide3 = function() {
    $rootScope.fixWrapShow = false;
    $scope.stateList = false;
    $scope.typeList = false;
    $scope.operateList = false;
}
// END
// 维修时间错误消失
$scope.changeTime = function(){
    $scope.seven=false
}
$scope.trueTime = function(){
    $scope.nine=false
}
// 填写维修报告
$scope.lookRepairReportConShow = false;
$scope.lookRepairReportPartsShow = false;
$scope.lookRepairReportResultShow = false;
$scope.lookRepairReportMenuShow = function(a){
    $scope[a]=!$scope[a];
}
// 删除配件
$scope.deldectPart = function($index){
    $scope.partList.splice($index,1);
}
$scope.writenum = 0
$scope.writesum = function(){
    $scope.writenum = $scope.remark.length
    if( $scope.remark.length >= 300){
        // $scope.writeDisabled = true
        $scope.remark = $scope.remark.substring(0,300)
        $scope.writenum=300
    }
}
$scope.lookRepairReportShow = false;
$scope.service = function(){
    var time = new Date().getTime();
    $scope.repairDate2=time;
    $scope.repairTrue2=time;
    $('.daterangepicker').remove();
    // $('.true-startDate').remove();
    // $('.true-endDate').data('daterangepicker').remove();
    // $('.date-endDate').data('daterangepicker').remove();
    $scope.initcalendar($scope.repairDate1,$scope.repairDate2,$scope.repairDate1,'.date-endDate');
    $scope.initcalendar($scope.repairTrue1,$scope.repairTrue2,$scope.repairTrue1,'.true-endDate');
    $scope.initcalendar(0,$scope.repairDate1,0,'.date-startDate');
    $scope.initcalendar($scope.repairDate1,$scope.repairTrue1,$scope.repairDate1,'.true-startDate');
    var t = $scope.repairDate2-$scope.repairDate1;
    if(t<=0){
        $scope.repairDate2 = $scope.repairDate1+1000;
        t=1000;
    }
    $scope.repairDate1&&$scope.repairDate2&&(
            
            $scope.repairTime.day=Math.floor(t/3600000/24),
            $scope.repairTime.hour=Math.ceil(t/3600000)%24
    );
    var t = $scope.repairTrue2-$scope.repairTrue1;
    if(t<=0){
        $scope.repairTrue2 = $scope.repairTrue1+1000;
        t=1000;
    }
    $scope.repairTrue1&&$scope.repairTrue2&&(
            
            $scope.repairTrue.day=Math.floor(t/3600000/24),
            $scope.repairTrue.hour=Math.ceil(t/3600000)%24
    );
    var t = $scope.repairWait2-$scope.repairWait1;
    if(t<=0){
        $scope.repairWait2 = $scope.repairWait1+1000;
        t=1000;
    }
    $scope.repairWait1&&$scope.repairWait2&&(
            
            $scope.repairWait.day=Math.floor(t/3600000/24),
            $scope.repairWait.hour=Math.ceil(t/3600000)%24
    );
    $scope.first = false;
    $scope.two = false;
    $scope.three = false;
    $scope.four = false;
    $scope.five = false;
    $scope.six = false;
    $scope.seven = false;
    $scope.nine = false;
    $scope.eleven = false;
    $scope.twolve = false;
    $scope.initTime=time;
    $scope.partList=[]
    $scope.writeRepairReportShow = true;
    var index=layer.open({
        time: 0 //不自动关闭
        ,
        type: 1
        ,
        content: $('.writeRepairReport')
        ,
        title: ['填写维修报告', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
        ,
        closeBtn: 1
        ,
        shade: 0.3
        ,
        shadeClose: true
        ,
        btn: ['确定', '取消']
        ,
        area: ['900px', '600px'],
        yes: function () {
            if ($scope.typeModel2.name == '请选择维修内容') {
                $scope.first = true;
            }
            if ($scope.addphenom.length == 0) {
                $scope.two = true
            }
            if ($scope.addReason.length == 0) {
                $scope.three = true
            }
            if ($scope.addWork.length == 0) {
                $scope.four = true
            }
            if ($scope.typeModel3.name == '选择维修后状态') {
                $scope.six = true
            }
            if (!$scope.repairCost) {
                $scope.eleven = true
            }
            if (!$scope.materiaCost) {
                $scope.twolve = true
            }
            if ($scope.typeModel2.name != '请选择维修内容' && $scope.addphenom.length != 0 && $scope.addReason.length != 0 && $scope.addWork.length != 0
                && $scope.typeModel3.name != '选择维修后状态' && $scope.repairCost && $scope.materiaCost) {
                $scope.writeReport = true;
                $scope.faultPhenomenonKeys = ''
                var phenomlength = $scope.addphenom.length
                for (var i = 0; i < phenomlength; i++) {
                    $scope.faultPhenomenonKeys = $scope.faultPhenomenonKeys + $scope.addphenom[i].key + ','
                }
                $scope.faultReasonKeys = ''
                var Reasonlength = $scope.addReason.length
                for (var i = 0; i < Reasonlength; i++) {
                    $scope.faultReasonKeys = $scope.faultReasonKeys + $scope.addReason[i].key + ','
                }
                $scope.workContentKeys = ''
                var Worklength = $scope.addWork.length
                for (var i = 0; i < Worklength; i++) {
                    $scope.workContentKeys = $scope.workContentKeys + $scope.addWork[i].key + ','
                }
                var partLength = $scope.partList.length
                $scope.writeList = []
                for (var i = 0; i < partLength; i++) {
                    $scope.writeList.push({
                        "num": $scope.partList[i].number,
                        "partName": $scope.partList[i].name,
                        "partId": $scope.partList[i].id,
                        "partPrice": Number($scope.partList[i].price) * 100,
                        "partProduce": $scope.partList[i].product,
                        "partSpec": $scope.partList[i].model,
                        "reportId": $rootScope.applyid,
                        "unitKey": $scope.partList[i].unitList,
                        "operationTime": new Date().getTime(),
                        'status': 1,
                        "tenantId": $stateParams.tenantId || $localStorage.userInfo.tenantId
                    })
                }
                $.ajax({
                    type: "post",
                    url: "/repair/repRepairReport/save",
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify({
                        "actualEnd": $scope.repairTrue2,
                        "actualStart": $scope.repairTrue1,
                        "applyId": $rootScope.applyid,
                        "faultPhenomenonKeys": $scope.faultPhenomenonKeys,
                        "faultReasonKeys": $scope.faultReasonKeys,
                        "list": $scope.writeList,
                        "partsCost": Number($scope.materiaCost) * 100,
                        "partsWaitingEnd": $scope.repairWait2,
                        "partsWaitingStart": $scope.repairWait1,
                        "repairComent": $scope.remark,
                        "repairCost": Number($scope.repairCost) * 100,
                        "repairPeriodEnd": $scope.repairDate2,
                        "repairPeriodStart": $scope.repairDate1,
                        "repairResultKey": $scope.typeModel3.key,
                        "repairTypeKey": $scope.typeModel2.key,
                        "totalCost": Number($scope.totalCost) * 100,
                        "workContentKeys": $scope.workContentKeys
                    }),
                    complete: function (res) {
                        if (res.responseJSON.code == 200) {
                            // accessory

                            $scope.search();
                            $scope.getApplyDetails();
                            // $scope.getAssetsDetails();
                            $scope.writeRepairReportShow = false;
                            layer.close(index);
                            $rootScope.$apply();
                        } else {
                            $scope.writeReport = false;
                        }
                    }
                })
            }
        },
        end: function(){
            $scope.writeRepairReportShow = false;
            layer.close(index);
        }
    });
    // $scope.writeno = function(){
    //     $scope.writeRepairReportShow = false;
    //     layer.close(index);
    // }
    // $scope.writeyes = function(){
    //     if($scope.typeModel2.name == '请选择维修内容'){
    //         $scope.first=true;
    //     }
    //     if($scope.addphenom.length==0){
    //         $scope.two=true
    //     }
    //     if($scope.addReason.length==0){
    //         $scope.three=true
    //     }
    //     if($scope.addWork.length==0){
    //         $scope.four=true
    //     }
    //     if($scope.typeModel3.name =='选择维修后状态'){
    //         $scope.six = true
    //     }
    //     if(!$scope.repairCost){
    //         $scope.eleven = true
    //     }
    //     if(!$scope.materiaCost){
    //         $scope.twolve = true
    //     }
    //     if($scope.typeModel2.name != '请选择维修内容'&&$scope.addphenom.length!=0&&$scope.addReason.length!=0&&$scope.addWork.length!=0
    //        &&$scope.typeModel3.name !='选择维修后状态' &&$scope.repairCost&&$scope.materiaCost){
    //         $scope.writeReport = true;
    //         $scope.faultPhenomenonKeys=''
    //         var phenomlength=$scope.addphenom.length
    //         for(var i=0;i<phenomlength;i++){
    //             $scope.faultPhenomenonKeys=$scope.faultPhenomenonKeys + $scope.addphenom[i].key + ','
    //         }
    //         $scope.faultReasonKeys=''
    //         var Reasonlength=$scope.addReason.length
    //         for(var i=0;i<Reasonlength;i++){
    //             $scope.faultReasonKeys=$scope.faultReasonKeys + $scope.addReason[i].key + ','
    //         }
    //         $scope.workContentKeys=''
    //         var Worklength=$scope.addWork.length
    //         for(var i=0;i<Worklength;i++){
    //             $scope.workContentKeys=$scope.workContentKeys + $scope.addWork[i].key + ','
    //         }
    //         var partLength = $scope.partList.length
    //         $scope.writeList=[]
    //         for(var i=0;i<partLength;i++){
    //             $scope.writeList.push({
    //                 "num": $scope.partList[i].number,
    //                 "partName": $scope.partList[i].name,
    //                 "partId": $scope.partList[i].id,
    //                 "partPrice": Number($scope.partList[i].price)*100,
    //                 "partProduce": $scope.partList[i].product,
    //                 "partSpec": $scope.partList[i].model,
    //                 "reportId": $rootScope.applyid,
    //                 "unitKey": $scope.partList[i].unitList,
    //                 "operationTime": new Date().getTime(),
    //                 'status': 1,
    //                 "tenantId": $stateParams.tenantId||$localStorage.userInfo.tenantId
    //             })
    //         }
    //         console.log($scope.partList);
    //         $.ajax({
    //             type: "post",
    //             url: "/repair/repRepairReport/save" ,
    //             contentType: "application/json;charset=UTF-8",
    //             data: JSON.stringify({
    //                 "actualEnd": $scope.repairTrue2,
    //                 "actualStart": $scope.repairTrue1,
    //                 "applyId": $rootScope.applyid ,
    //                 "faultPhenomenonKeys": $scope.faultPhenomenonKeys,
    //                 "faultReasonKeys": $scope.faultReasonKeys,
    //                 "list":$scope.writeList,
    //                 "partsCost": Number($scope.materiaCost)*100,
    //                 "partsWaitingEnd": $scope.repairWait2,
    //                 "partsWaitingStart": $scope.repairWait1,
    //                 "repairComent": $scope.remark,
    //                 "repairCost": Number($scope.repairCost)*100,
    //                 "repairPeriodEnd": $scope.repairDate2,
    //                 "repairPeriodStart": $scope.repairDate1,
    //                 "repairResultKey":$scope.typeModel3.key,
    //                 "repairTypeKey": $scope.typeModel2.key,
    //                 "totalCost": Number($scope.totalCost)*100,
    //                 "workContentKeys": $scope.workContentKeys
    //             }),
    //             complete: function (res) {
    //                 if (res.responseJSON.code == 200) {
    //                     // accessory
    //
    //                     $scope.search();
    //                     $scope.getApplyDetails();
    //                     // $scope.getAssetsDetails();
    //                     $scope.writeRepairReportShow = false;
    //                     layer.close(index);
    //                     $rootScope.$apply();
    //                 }else{
    //                     $scope.writeReport = false;
    //                 }
    //             }
    //         })
    //     }
    // }
}
// 配件操作
$scope.accessoryResult = [];
$scope.accessorySearch = false;
$scope.accessoryResultNone = false;
$scope.accessoryKeyWord = '';
$scope.hrefAccessory=function(){
    layer.closeAll();
    $state.go('repair.accessory.classify',{
        tenantId: $stateParams.tenantId
    });
}
$scope.accessoryClick=function(){
    $scope.accessoryKeyWord = '';
    $scope.accessoryResult = [];
    $scope.accessorySearch = !$scope.accessorySearch;
}
$scope.changeAccessoryKindName=function(a){
    $scope.part.classify=a.kindName;
    $scope.part.id=a.id;
    $scope.accessorySearch=false;
}
$scope.getAccessroyResult=function(){
    var data = {
            pageNo: 1,
            pageSize: 99,
            orderByField: '',
            kindName: $scope.accessoryKeyWord,
            isAsc: true,
            status: 1,
            tenantId: $stateParams.tenantId||$localStorage.userInfo.tenantId
        };

    $.ajax({
        type: "get",
        url: "/repair/repParts/search" ,
        data: data,
        complete: function(res){
            if(res.responseJSON.code==200){
                $scope.accessoryResult=res.responseJSON.data.records;
                $scope.accessoryResultNone=false;
                !$scope.accessoryResult.length&&($scope.accessoryResultNone=true);
                $rootScope.$apply();
            }
        }
    });
}
function accessoryOperate(a){
    $.ajax({
        type: "post",
        url: "/repair/repPartsRecord/add" ,
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify({
            "num": a.number,
            "operationTime": new Date().getTime(),
            "partName": a.name,
            "partPrice": a.price,
            "partProduce": a.product,
            "partSpec": a.model,
            "tenantId": $stateParams.tenantId||$localStorage.userInfo.tenantId
        }),
        complete: function(res){

        }
    });
}
// 提交填写维修报告的错误提示消失
$scope.change1 = function(){
    $scope.first=false;
}
// 删除故障原因，现象
$scope.delectpart = function($event){
    angular.element($event.target).parent().hide()
}
// 新增工作内容
$scope.addJob = function(){
    $scope.workSame = false;
    $scope.workcontent = ''
    $scope.dictionary(7);
    $scope.four=false;
    angular.element('.checkboxFive input').prop('checked',false);
    $scope.workList=$scope.workList.splice(0,$scope.workList.length);
    $scope.work = true;
    var index = layer.open({
        time: 0,//不自动关闭
        type: 1,
        content: $(".workOne"),
        title: ['添加工作内容', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
        closeBtn: 1,
        shade: 0.3,
        btn: ['确定', '取消'],
        shadeClose: true,
        area: ['600px', '340px'],
        success:function () {
            if($scope.addWork.length!=0) {
                var length1 = $scope.addWork.length;
                var length2 = $scope.workList.length;
                for (var i = 0; i < length1; i++) {
                    for (var j = 0; j < length2; j++) {
                        if ($scope.addWork[i].name == $scope.workList[j].name) {
                            $scope.workList[j].choose = 'disabled';
                        }
                    }
                }
            }
        },
        yes: function() {
            var _length=angular.element('.checkboxFive input:checked').length
            for(var i=0;i<_length;i++){
                var _data=angular.element('.checkboxFive input:checked').eq(i).parent('div').next('span').text()
                var listLength=$scope.workList.length;
                for(var j=0;j<listLength;j++){
                    if($scope.workList[j].name==_data){
                        $scope.addWork.push({name:_data,key:$scope.workList[j].key})
                    }
                }
            }
            if(_length>0){
                $scope.work = false;
                layer.close(index)
            }
        },
        end: function(){
            $scope.work = false;
            $rootScope.$apply();
        }
    });
    layer.style(index, {
        fontSize: '16px',
        backgroundColor: '#fff',

    });
}
// 添加故障原因
$scope.troubleReason = function(){
    $scope.error= ''
    $scope.errormSame = false;
    $scope.dictionary(4)
    $scope.dictionary(5)
    $scope.dictionary(6)
    $scope.three=false
    $scope.peopleList=$scope.peopleList.splice(0,$scope.peopleList.length)
    $scope.machineList=$scope.machineList.splice(0,$scope.machineList.length)
    $scope.environList=$scope.environList.splice(0,$scope.environList.length)
    $scope.troubleErr = ''
    $scope.error = ''
    $scope.errorRea = true
    var index = layer.open({
        time: 0,//不自动关闭
        type: 1,
        content: $(".reason"),
        title: ['选择故障原因', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
        closeBtn: 1,
        btn: 0,
        shade: 0.3,
        btn: ['确定', '取消'],
        shadeClose: true,
        area: ['600px', '600px'],
        success:function () {
            if($scope.addReason.length!=0){
                var length1=$scope.addReason.length;
                var length2=$scope.peopleList.length;
                var length3=$scope.machineList.length;
                var length4=$scope.environList.length;
                for(var i=0;i<length1;i++){
                    for(var j=0;j<length2;j++){
                        if($scope.addReason[i].name==$scope.peopleList[j].name){
                            $scope.peopleList[j].choose='disabled';
                        }
                    }
                };
                for(var i=0;i<length1;i++){
                    for(var j=0;j<length3;j++){
                        if($scope.addReason[i].name==$scope.machineList[j].name){
                            $scope.machineList[j].choose='disabled';
                        }
                    }
                };
                for(var i=0;i<length1;i++){
                    for(var j=0;j<length4;j++){
                        if($scope.addReason[i].name==$scope.environList[j].name){
                            $scope.environList[j].choose='disabled';
                        }
                    }
                }
            }
        },
        yes: function() {
            var _length=angular.element('.errorReason input:checked').length;
            for(var i=0;i<_length;i++){
                var _data=angular.element('.errorReason input:checked').eq(i).parent('div').next('span').text();
                var listLength1=$scope.peopleList.length
                for(var j=0;j<listLength1;j++){
                    if($scope.peopleList[j].name==_data){
                        $scope.addReason.push({name:_data,key:$scope.peopleList[j].key})
                    }
                }
                var listLength2=$scope.machineList.length
                for(var n=0;n<listLength2;n++){
                    if($scope.machineList[n].name==_data){
                        $scope.addReason.push({name:_data,key:$scope.machineList[n].key})
                    }
                }
                var listLength3=$scope.environList.length
                for(var m=0;m<listLength3;m++){
                    if($scope.environList[m].name==_data){
                        $scope.addReason.push({name:_data,key:$scope.environList[m].key})
                    }
                }
            }
            if(_length>0){
                $scope.errorRea = false;
                layer.close(index)
            }
        },
        end: function(){
            $scope.errorRea = false;
            $rootScope.$apply();
        }
    });
    layer.style(index, {
        fontSize: '16px',
        backgroundColor: '#fff',

    });
}
// 选择故障现象
$scope.phenomenon = function(){
    $scope.newError=''
    $scope.errorSame = false;
    $scope.dictionary(3)
    $scope.two=false
    angular.element('.checkboxFive input').prop('checked',false);
    $scope.troubleList= $scope.troubleList.splice(0,6);
    $scope.trouble = true;
    var index = layer.open({
        time: 0,//不自动关闭
        type: 1,
        content: $(".workTwo"),
        title: ['选择故障现象', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
        closeBtn: 1,
        btn: 0,
        shade: 0.3,
        btn: ['确定', '取消'],
        shadeClose: true,
        area: ['600px', '310px'],
        success:function () {
            if($scope.addphenom.length!=0) {
                var length1 = $scope.addphenom.length;
                var length2 = $scope.troubleList.length;
                for (var i = 0; i < length1; i++) {
                    for (var j = 0; j < length2; j++) {
                        if ($scope.addphenom[i].name == $scope.troubleList[j].name) {
                            $scope.troubleList[j].choose = 'disabled';
                        }
                    }
                }
            }
        },
        yes: function() {
            var _length=angular.element('.checkboxFive input:checked').length
            for(var i=0;i<_length;i++){
                var _data=angular.element('.checkboxFive input:checked').eq(i).parent('div').next('span').text()
                var listLength=$scope.troubleList.length
                for(var j=0;j<listLength;j++){
                    if($scope.troubleList[j].name==_data){
                        $scope.addphenom.push({name:_data,key:$scope.troubleList[j].key})
                    }
                }
            }
            if(_length>0){
                $scope.trouble = false;
                layer.close(index)
            }
        },
        end: function(){
            $scope.trouble = false;
            $rootScope.$apply();
        }
    });
    layer.style(index, {
        fontSize: '16px',
        backgroundColor: '#fff',

    });
}
// 添加配件
$scope.unitList = function($event,l){
    $scope.part.unitInput = $($event.target).text();
    $scope.part.unitList = l.key;
    $scope.unit = false;

};

$scope.addPart = function(){
    $scope.partsone = false;
    $scope.partstwo = false;
    $scope.partsthree = false;
    $scope.partsfour = false;
    $scope.partssix = false;
    $scope.part={
        name:'',
        model:'',
        product:'',
        number:'',
        unitInput:$scope.unitArr[1].name,
        price:'',
        unitkey:$scope.unitArr[1].key
    }
    // $scope.five=false;
    $scope.addParts = true;
    var index = layer.open({
        time: 0,//不自动关闭
        type: 1,
        content: $(".hd_addParts"),
        title: ['添加配件', 'font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;'],
        closeBtn: 1,
        btn: 0,
        shade: 0.3,
        btn: ['确定', '取消'],
        shadeClose: true,
        area: ['618px', '462px'],
        yes: function() {
            if(!$scope.part.name){
                $scope.partsone=true;
                $rootScope.$apply();
            }
            if(!$scope.part.model){
                $scope.partstwo=true;
                $rootScope.$apply();
            }
            if(!$scope.part.product){
                $scope.partsthree=true;
                $rootScope.$apply();
            }
            if(!$scope.part.number){
                $scope.partsfour=true;
                $rootScope.$apply();
            }
            if(!$scope.part.price){
                $scope.partssix=true;
                $rootScope.$apply();
            }
            if($scope.part.name&&$scope.part.model&&$scope.part.product&&$scope.part.number&&$scope.part.price){
                $scope.addParts = false;
                layer.close(index);
                $scope.lookRepairReportPartsShow=false;
                $scope.partList.push($scope.part);
                $scope.part={};
                $rootScope.$apply();
            }
        },
        end: function(){
            $scope.addParts = false;
            $scope.accessoryResult = [];
            $scope.accessorySearch = false;
            $scope.accessoryResultNone = false;
            $scope.accessoryKeyWord = '';
            $rootScope.$apply();
        }
    });
    layer.style(index, {
        fontSize: '16px',
        backgroundColor: '#fff',

    });
}
// 日历

// 维修费用
// $scope.repairCost = '￥';
// $scope.materiaCost = '￥';
// $scope.totalCost = null;
$scope.totalCostChange = function(m){
    if(m==1){
        $scope.eleven=false
    }else{
        $scope.twolve=false
    }
    // if($scope.repairCost=='￥'||$scope.materiaCost=='￥'){
    //     return
    // }else if(/^[0-9]+$/.test($scope.repairCost)){
    //     $scope.repairCost = '￥'+$scope.repairCost;
    // }else if(/^[0-9]+$/.test($scope.materiaCost)){
    //     $scope.materiaCost = '￥'+$scope.materiaCost;
    // }
    $scope.totalCost =(Number($scope.repairCost)+Number($scope.materiaCost));
}
// 获取维修时间
// $.ajax({
//     type: 'get',
//     url: '/repair/apply/getApplyDetails/'+$rootScope.applyid,
//     data: {'id': $rootScope.applyid},
//     complete: function(res) {
//         var data = res.responseJSON.data;
//         console.log(data)
//         $scope.repairDate1 = data.reportRepairDate;
//         $scope.repairTrue1 = data.identifyDate;
//         $rootScope.$apply();
//     }
// });
function repairHour(date, enddate, el) {
    var t,temp=$scope[$(this.element).attr('attrVar')];
        $scope[$(this.element).attr('attrVar')]=new Date(date).getTime();
        t = ($scope.repairDate2-$scope.repairDate1<0)?-1:(($scope.repairTrue2-$scope.repairTrue1<0)?-1:1);
        if(t<0){
            $scope[$(this.element).attr('attrVar')]=temp;
            $scope.initcalendar($scope.repairDate1,$scope.repairDate2,$scope.repairDate1,'.date-endDate');
            $scope.initcalendar($scope.repairTrue1,$scope.repairTrue2,$scope.repairTrue1,'.true-endDate');
            $scope.initcalendar(0,$scope.repairDate1,0,'.date-startDate');
            $scope.initcalendar($scope.repairDate1,$scope.repairTrue1,$scope.repairDate1,'.true-startDate');
            return;
        }
        var currentel = $(this.element).attr("name");
        currentel == "expireDate" && ($scope.expireStr = date.format('YYYY-MM-DD HH:mm'));
        t = $scope.repairDate2-$scope.repairDate1;
        $scope.repairDate1&&$scope.repairDate2&&(
            $scope.repairTime.day=Math.floor(t/3600000/24),
            $scope.repairTime.hour=Math.ceil(t/3600000)%24
        );
        t = $scope.repairTrue2-$scope.repairTrue1;
        $scope.repairTrue1&&$scope.repairTrue2&&(
            $scope.repairTrue.day=Math.floor(t/3600000/24),
            $scope.repairTrue.hour=Math.ceil(t/3600000)%24
        );
        $rootScope.$apply();
    }
$scope.$watch('repairDate1', function(newValue, oldValue, scope) {
                // var option = {
                //     format: 'YYYY-MM-DD HH:mm',
                //     startDate: new Date(newValue),
                //     endDate: new Date("2050-01-01"),
                //     maxDate: new Date("2050-01-01"),
                //     timePicker: true,
                //     timePicker12Hour:false,
                //     opens: "top",
                //     singleDatePicker: true
                // };
                // angular.element('.date-endDate').daterangepicker($.extend({}, option, {
                //     minDate:new Date(newValue),
                //     startDate: new Date()
                // }), repairHour);
                // angular.element('.true-startDate').daterangepicker($.extend({}, option, {
                //     minDate:new Date(newValue)
                //     startDate: new Date()
                // }), repairHour);
    $scope.initcalendar(newValue,$scope.repairDate2,newValue,'.date-endDate');
    $scope.initcalendar(newValue,$scope.repairTrue1,newValue,'.true-startDate');
            });
$scope.$watch('repairTrue1', function(newValue, oldValue, scope) {
                // var option = {
                //     format: 'YYYY-MM-DD HH:mm',
                //     startDate: new Date(newValue),
                //     endDate: new Date("2050-01-01"),
                //     maxDate: new Date("2050-01-01"),
                //     timePicker: true,
                //     timePicker12Hour:false,
                //     opens: "top",
                //     singleDatePicker: true
                // }
                // angular.element('.true-endDate').daterangepicker($.extend({}, option, {
                //     minDate:new Date(newValue)
                //     startDate: new Date()
                // }), repairHour);
    console.log(arguments)
    $scope.initcalendar(newValue,$scope.repairTrue2,newValue,'.true-endDate');
            });
$scope.initcalendar = function(start,current,min,ele) {
    var option = {
        format: 'YYYY-MM-DD HH:mm',
        // startDate: new Date(start),
        // endDate: new Date(),
        timePicker:true,
        // minDate:new Date(new Date()-24*60*60*1000),
        maxDate: new Date("2050-01-01"),
        timePicker12Hour:false,
        //timePicker: false,
        opens: "top",
        singleDatePicker: true
    }
    var obj = {};
    current&&(obj.startDate=new Date(current));
    min&&(obj.minDate=new Date(min));
    angular.element(ele).daterangepicker($.extend({}, option, obj), repairHour);
}
// $scope.initcalendar(new Date(),new Date(),0,'.date_startDate');
// 日历 END
// 故障鉴定详情
$scope.authenticate = function(){
    $.ajax({
        type: "get",
        url: "/repair/repRepairAppraisal/search/"+$rootScope.applyid,
        data: {id:$rootScope.applyid},
        complete: function (res) {
            if(res.responseJSON.code == 200){
                if(res.responseJSON.data.sceneFlag==1){
                    $scope.flagStatus=true;
                }else{
                    $scope.flagStatus=false;
                }
                $scope.errorContent=res.responseJSON.data.identifyComent
                $rootScope.$apply();
            }
        }
    })
    $scope.troubleShow = true;
    var index=layer.open({
        time: 0 //不自动关闭
        ,type: 1
        ,content: $('.troubleIdenfy')
        ,title: ['故障鉴定','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
        ,closeBtn: 1
        ,shade: 0.3
        ,shadeClose: true
        ,btn: 0
        ,area: ['650px','370px']
    });
    $scope.idenfyYes = function(){
        $scope.troubleShow = false;
        layer.close(index);
    }
    $scope.idenfyCalcel = function(){
        $scope.troubleShow = false;
        layer.close(index);
    }
}
// 查看维修报告单
// 根据key查字典表
$scope.maintain = function(){
    $scope.lookRepair();
    $scope.lookRepairReportShow2 = true;
    var index=layer.open({
        time: 0 //不自动关闭
        ,type: 1
        ,content: $('.lookReport')
        ,title: ['查看维修报告单','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
        ,closeBtn: 1
        ,shade: 0.3
        ,btn: ['关闭']
        ,shadeClose: true
        ,area: ['900px','600px']
        ,yes: function() {
            $scope.lookRepairReportShow2 = false;
            layer.close(index);
        }
        ,end: function(){
            $scope.lookRepairReportShow2 = false;
            layer.close(index);
        }
    });
}
// 验收结果详情
$scope.pass = function(){
    $.ajax({
        type: "get",
        url: "/repair/repRepairCheck/search/"+$rootScope.applyid,
        data:{id:$rootScope.applyid},
        complete: function (res) {
            if(res.responseJSON.code == 200){
                $scope.assessComent = res.responseJSON.data.assessComent;
                $scope.assetsStatus = res.responseJSON.data.assetsStatus;
                if($scope.assetsStatus==1){
                    $scope.assetsStatus='正常工作'
                }else if($scope.assetsStatus==2){
                    $scope.assetsStatus='基本正常'
                }else{
                    $scope.assetsStatus='其他'
                };
                for(var i=0;i<res.responseJSON.data.repairAttitude;i++){
                    $scope.resolveAttitude[i]=true;
                };
                for(var i=0;i<res.responseJSON.data.repairQuality;i++){
                    $scope.resolveMass[i]=true;
                };
                for(var i=0;i<res.responseJSON.data.responseSpeed;i++){
                    $scope.resolveRespond[i]=true;
                };
                $scope.attitudeTxt=$scope.attitudeArr[res.responseJSON.data.repairAttitude-1];
                $scope.qualityTxt=$scope.qualityArr[res.responseJSON.data.repairQuality-1];
                $scope.speedTxt=$scope.speedArr[res.responseJSON.data.responseSpeed-1];
                $rootScope.$apply();

            }
        }
    })
   $scope.lookRepairCheckShow1 = true;
    var index=layer.open({
        time: 0 //不自动关闭
        ,type: 1
        ,content: $('#accpetPass')
        ,title: ['查看验收详情','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
        ,closeBtn: 1
        ,shade: 0.3
        ,shadeClose: true
        ,btn: 0
        ,shadeClose: true
        ,btn: 0
        ,area: ['620px','515px']
    });

    $scope.acceptYes = function(){
        $scope.lookRepairCheckShow1 = false;
        layer.close(index);
    }
    $scope.acceptCanael = function(){
        $scope.lookRepairReportShow1 = false;
        layer.close(index);
    }
}
// 验收未通过
$scope.dontpass = function(){
    $.ajax({
        type: "get",
        url: "/repair/repRepairCheck/search/"+$rootScope.applyid,
        data:{id:$rootScope.applyid},
        complete: function (res) {
            if(res.responseJSON.code == 200){
                $scope.assessComent = res.responseJSON.data.assessComent;
                $scope.assetsStatus = res.responseJSON.data.assetsStatus;
                if($scope.assetsStatus==4){
                    $scope.assetsStatus='需进一步维修'
                }else if($scope.assetsStatus==5){
                    $scope.assetsStatus='需外送维修'
                }else{
                    $scope.assetsStatus='其他'
                };
                for(var i=0;i<res.responseJSON.data.repairAttitude;i++){
                    $scope.resolveAttitude[i]=true;
                };
                for(var i=0;i<res.responseJSON.data.repairQuality;i++){
                    $scope.resolveMass[i]=true;
                };
                for(var i=0;i<res.responseJSON.data.responseSpeed;i++){
                    $scope.resolveRespond[i]=true;
                };
                $scope.attitudeTxt=$scope.attitudeArr[res.responseJSON.data.repairAttitude-1];
                $scope.qualityTxt=$scope.qualityArr[res.responseJSON.data.repairQuality-1];
                $scope.speedTxt=$scope.speedArr[res.responseJSON.data.responseSpeed-1];
                $rootScope.$apply();
            }
        }
    })
    $scope.lookRepairCheckShow2 = true;
    var index=layer.open({
        time: 0 //不自动关闭
        ,type: 1
        ,content: $('.acceptNopass')
        ,title: ['查看验收详情','font-size: 14px;color: #fff;background-color: #4ab29b;line-height: 40px;padding: 0px 10px;border: none;textAlign: left;']
        ,closeBtn: 1
        ,shade: 0.3
        ,shadeClose: true
        ,btn: 0
        ,area: ['620px','515px']
    });
    $scope.acceptYes = function(){
        $scope.lookRepairCheckShow2 = false;
        layer.close(index);
    }
    $scope.acceptCanael = function(){
        $scope.lookRepairReportShow2 = false;
        layer.close(index);
    }
}
$scope.print = function(){
     angular.element(".lookReport").jqprint({
     	 printContainer:false,
         operaSupport: false,
     });
}
}])
