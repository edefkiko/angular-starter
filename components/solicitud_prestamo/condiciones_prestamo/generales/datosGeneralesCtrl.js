'use strict';
angular.module('solicitudPrestamo')
.controller('datosGeneralesController', [ '$scope','DatosGenerales', 'ProductoPadre' ,'$state', 'prestamosService', 'clienteService', 'CLIENT_STATUS', 'StatusService', 'LoginService', '$rootScope', '$log', 'Cliente', 'Solicitud', 'Simulator', 'localStorageService', '$timeout', 'alertService', function($scope, DatosGenerales, ProductoPadre, $state, prestamosService, clienteService, CLIENT_STATUS, StatusService, LoginService, $rootScope, $log, Cliente, Solicitud, Simulator, localStorageService, $timeout, alertService){
  var memorySolicitud = localStorageService.get('solicitud');
  if(_(memorySolicitud).isEmpty()){
    alertService.addAlert('ERROR', 'Solicitud inválida', "No tienes un estado de solicitud válida");
    return;
  };

  var userId = LoginService.currentUser().id;
  $scope.generales = {};
  var solicitud = new Solicitud(memorySolicitud);
 $scope.mostrarDetalle = true; 
 $scope.verDetalle = function(){
  $log.info('mostrar detalle');
  $scope.detallePagos = true;
  $scope.mostrarDetalle = false;
  $scope.ocultarDetalle = true;
 }
 $scope.ocultaDetalle = function(){
   $scope.mostrarDetalle = true;
   $scope.detallePagos = false; 
   $scope.ocultarDetalle = false;
 }

 $scope.mostrarSimulador = function(){
  $scope.modificarCondiciones = true;
  $scope.dataloadingModificar = true;

  $timeout(function () {
      $scope.$broadcast('rzSliderForceRender');
  }, 1000);
}
  
  $rootScope.showLoading();
  var cliente = new Cliente({id: userId});
  cliente.updateStatus(CLIENT_STATUS.CONDICIONES_GRALES.value).then(function(result){
    $rootScope.hideLoading();
  }, function(){
    $rootScope.hideLoading();
  });
  init();
  
  function init(){
    $rootScope.showLoading()

    ProductoPadre.load().then(function(){
      
      solicitud.getSolicitudActiva(userId, true).then(function(solicitudActiva){  
        $log.log('solicitudActiva', solicitudActiva);
        $rootScope.hideLoading();

        $scope.producto.montoMin = ProductoPadre.getMontoMinimo();
        $scope.producto.montoMax = solicitudActiva.montoSolicitudMotor;

        $scope.producto.prestamo = solicitudActiva.montoSolicitudMotor;
        $scope.producto.plazo = solicitudActiva.plazo;
        $scope.producto.tasa = solicitudActiva.tasaSolicitudMotor;        
        $scope.producto.frecuencia = solicitudActiva.frecuencia; 
        $scope.producto.periodo = solicitudActiva.peridoPagos; 

        if(solicitudActiva.montoSolicitudMotor < solicitudActiva.monto){
          $scope.montoState = 'LESS';
        }else if(solicitudActiva.monto === solicitudActiva.montoSolicitudMotor){
          $scope.montoState = 'EQUAL';
        }else{
          $scope.montoState = 'HIGHER';
        }

        if(solicitudActiva.tasaSolicitudMotor < solicitudActiva.tasa){
          $scope.tasaState = 'LESS';
        }else if(solicitudActiva.tasa === solicitudActiva.tasaSolicitudMotor){
          $scope.tasaState = 'EQUAL';
        }else{
          $scope.tasaState = 'HIGHER';
        }

      });

    });
  }
  $scope.generales.pagosAnticipados = 'plazo';

  $scope.guardar = function(generales){
    $scope.dataloading = true;

    memorySolicitud.monto = $scope.producto.prestamo;
    memorySolicitud.frecuencia = $scope.producto.frecuencia;
    memorySolicitud.frecuenciaEn = $scope.producto.frecuenciaEn;
    memorySolicitud.peridoPagos = $scope.producto.periodo;
    memorySolicitud.plazo = $scope.producto.plazo;
    memorySolicitud.tasa = $scope.producto.tasa;

    $log.debug('Solicitud a actualizar -> ', memorySolicitud);

    solicitud = new Solicitud(memorySolicitud);

    $rootScope.showLoading()
    solicitud.actualizarSolicitudPrestamo(userId).then(function(){

        cliente.getBasicData().then(function(cliente){   
            $scope.$emit('loadUserData', cliente);
            
            ProductoPadre.load().then(function(){       
                var datosGenerales = new DatosGenerales(generales, memorySolicitud, cliente);   
                
                datosGenerales.actualizar(userId, memorySolicitud).then(function(){
                  $rootScope.hideLoading();
                  $state.go('prestamo.condiciones');
                }); 

            });
               
      });
    });
          
 
 }

}]);