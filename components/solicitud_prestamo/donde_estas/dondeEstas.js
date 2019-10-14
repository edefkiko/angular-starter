'use strict'
angular.module('solicitudPrestamo')
.controller('dondeEstasController',['$scope', 'LoginService', '$state','$log', '$rootScope', 'CLIENT_STATUS', 'ngDialog', '_', 'Cliente', 'opciones', function($scope, LoginService, $state, $log, $rootScope, CLIENT_STATUS, ngDialog, _, Cliente, opciones){  
    var cliente = new Cliente({id: LoginService.currentUser().id});

    $scope.opciones = opciones;
    $scope.dondeEstas = {};
    $scope.$watch('init', function(){
        $rootScope.showLoading();

        cliente.updateStatus(CLIENT_STATUS.DONDE_ESTAS.value).then(function(){
          $rootScope.hideLoading();         
        }, function(){
          $rootScope.hideLoading();
        });  
    });

    $scope.continuar = function(dondeEstas){
      $scope.dataloading = true;

      cliente.updateDondeEstas(dondeEstas.opcion).then(function(){        
        $state.go(CLIENT_STATUS.DATOS_DOMICILIO.state);   
      }, function(){
        $scope.dataloading = false;
      });
      
    }

}]);

 