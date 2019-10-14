'use strict'
angular.module('solicitudPrestamo')
.controller('solicitudCompletaController',['$scope', 'LoginService', '$state','$log', '$rootScope', 'CLIENT_STATUS', 'ngDialog', '_', 'Cliente', 'ProductoPadre', 'Solicitud', 'Simulator', 'localStorageService', function($scope, LoginService, $state, $log, $rootScope, CLIENT_STATUS, ngDialog, _, Cliente, ProductoPadre, Solicitud, Simulator, localStorageService){  
    var userId = LoginService.currentUser().id;
    var cliente = new Cliente({id: userId});
    var memorySolicitud = localStorageService.get('solicitud');
    var solicitud = new Solicitud(memorySolicitud);

    $scope.$watch('init', function(){
        
        $rootScope.showLoading();
        
        cliente.getBasicData().then(function(user){   
      
          $scope.$emit('loadUserData'); 
          
          solicitud.getSolicitudActiva(userId, true).then(function(response){  

            if(_(CLIENT_STATUS.PENDIENTE_FIRMA.value).isEqual(response.estatusCliente)){
              $state.go(CLIENT_STATUS.PENDIENTE_FIRMA.state);
            }else{
              cliente.updateStatus(CLIENT_STATUS.DOCUMENTACION_COMPLETA.value).then(function(){
                $rootScope.hideLoading();     
                  init();    
              }, function(){
                $rootScope.hideLoading();
              }); 
              
            }
            
          });

        });
           
    });

    function init(){
        

        $rootScope.showLoading()

        ProductoPadre.load().then(function(){     
          $scope.producto = {};    
          $scope.producto.montoMin = ProductoPadre.getMontoMinimo();
          $scope.producto.montoMax = ProductoPadre.getMontoMaximo();

            solicitud.getSolicitudActiva(userId).then(function(solicitudActiva){  
                var loanId = solicitudActiva.idPrestamo; 
                $log.info('solicitudActiva.: ', solicitudActiva);

                $scope.producto.prestamo = solicitudActiva.monto;
                $scope.producto.plazo = solicitudActiva.plazo;
                $scope.producto.tasa = solicitudActiva.tasaSolicitudMotor;
                $scope.producto.montoMax = solicitudActiva.montoSolicitudMotor;
                $scope.producto.frecuencia = solicitudActiva.frecuencia; 
                
                Simulator.calculate(solicitudActiva.monto, solicitudActiva.frecuencia, solicitudActiva.plazo, solicitudActiva.tasa).then(function(prestamoCalculado){
                  $rootScope.hideLoading();
                  $scope.producto.interes = prestamoCalculado.totalInteres;
                  $scope.producto.ivaInteres = prestamoCalculado.totalIvaInteres;
                  $scope.producto.total = prestamoCalculado.totalTotal;
                  $scope.producto.pagos = prestamoCalculado.pagos;
                  if(_( prestamoCalculado.pagos).size() > 0){
                    $scope.producto.pago = prestamoCalculado.pagos[0].total;  
                  }
                  
                });
            });
        });
    }

}]);

 