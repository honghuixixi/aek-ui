angular.module('app')
    .controller('detailController', [ '$rootScope', '$scope', '$http', '$state',
        function($rootScope, $scope, $http, $state) {
            $scope.prev=true
            $scope.next=true
            $scope.prevmess=function(){
                $scope.prev=false
                $scope.next=true
            }
            $scope.nextmess=function(){
                $scope.next=false
                $scope.prev=true
            }

   } ]);
