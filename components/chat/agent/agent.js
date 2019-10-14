'use strict';

angular.module('chat')
.controller('chatAgentController', ['$scope', 'Chat', 'LoginService', 'utils', 'userService', '$rootScope', 'EnvironmentConfig', '$log', '$stateParams', function($scope, Chat, LoginService, utils, userService, $rootScope, EnvironmentConfig, $log, $stateParams){

  $scope.$on('$viewContentLoaded', function(){
      $('header').hide();
      $('footer').hide();
  });
  $scope.$on("$destroy", function() {
      $('header').show();
      $('footer').show();
  });

  $rootScope.showLoading();

  if(!_($stateParams.userKey).isEmpty()){
    userService.getUser($stateParams.userKey).then(function(resp){
        $rootScope.hideLoading();
        //$scope.user = resp.username;
        var user = {
          externalId: resp.username,
          rolId: 1
        }
        $rootScope.$emit('initChat', user);
    }); 
  }

} ] );