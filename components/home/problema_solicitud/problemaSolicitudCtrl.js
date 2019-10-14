'use strict'
angular.module('solicitudPrestamo')
.controller('problemaSolicitudCtrl',['$scope', 'EnvironmentConfig', function($scope, EnvironmentConfig){  
  
  $scope.yeiInfo = EnvironmentConfig.yeiInfo;
  
}]);

 