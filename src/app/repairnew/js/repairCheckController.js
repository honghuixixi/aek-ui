angular.module('app')
    .controller('repairCheckController', ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$localStorage', function($scope, $stateParams, $rootScope, $state, $timeout, $localStorage) {
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
    }])