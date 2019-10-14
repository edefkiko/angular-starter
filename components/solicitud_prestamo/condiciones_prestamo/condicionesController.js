  'use strict';
  angular.module('solicitudPrestamo')
    .controller('condicionesController', ['$scope', 'Condiciones', 'prestamosService', '$state', 'LoginService', '$log', 'catalogs', 'catalogService', '$rootScope', 'CLIENT_STATUS', 'StatusService', 'clienteService', 'Cliente', 'Solicitud', 'advertenciaDocumentacion', '$filter', 'localStorageService', function($scope, Condiciones, prestamosService, $state, LoginService, $log, catalogs, catalogService, $rootScope, CLIENT_STATUS, StatusService, clienteService, Cliente, Solicitud, advertenciaDocumentacion, $filter, localStorageService) {
      var userId = LoginService.currentUser().id;
      var condicionCliente = LoginService.currentUser().situacion;
      var memorySolicitud = localStorageService.get('solicitud');

      $rootScope.showLoading();
      $scope.datosCondiciones = {};
      $scope.desactivarOpcionesPago = false;
      var cliente = new Cliente({
        id: userId
      });
      cliente.updateStatus(CLIENT_STATUS.SOLICITUD_COMPLETA.value).then(function(result) {
        $rootScope.hideLoading();
      }, function() {
        $rootScope.hideLoading();
      });
      var loanId;

      $scope.$watch('init', function() {
        var solicitud = new Solicitud(memorySolicitud);
        solicitud.getSolicitudActiva(userId).then(function(solicitudResp) {
          loanId = solicitudResp.idPrestamo; //loan creado
          $log.info('solicitudResp: ', loanId);

        });
      });



      $scope.bancoDispersion = catalogs.bancoDispersion;


      $scope.$watch('datosCondiciones.banco', function() {
        $log.info('cambio de valor', $scope.datosCondiciones.banco);
        if ($scope.datosCondiciones.banco) {
          $scope.clabe = null;
          if ($scope.datosCondiciones.banco === 'BBVA') {
            $log.debug('banamex');
            $scope.maxClabe = 11;
            $scope.minClabe = 11;
            $scope.clabeOCuenta = 'Cuenta BBVA';
          } else {
            $log.debug('otro banco');
            $scope.maxClabe = 18;
            $scope.minClabe = 18;
            $scope.clabeOCuenta = 'CLABE Interbancaria';

          }
        }
      });

      $scope.activaTransferencia = function(value) {
        $log.info('value ', value);
        $scope.desabilitarTransferencia = false;
        $scope.datosCondiciones.pagoPrestamoDomiciliacion = 'siDomiciliacion';
      }
      $scope.desactivarDomiciliacion = function() {
        $scope.datosCondiciones.pagoPrestamoDomiciliacion = null;
      }
      $scope.activaOrdenPago = function(value) {
        $log.info('value ', value);
        $scope.datosCondiciones.pagoPrestamo = 'opcTransferenciaElectronica';
        $scope.desabilitarTransferencia = true;
        $scope.datosCondiciones.clabeCuenta = "";
        $scope.datosCondiciones.banco = "";
        $scope.datosCondiciones.domiciliacion = "";
        $scope.datosCondiciones.pagoPrestamoDomiciliacion = "";
        $scope.desactivarOpcionesPago = false;
      }

      $scope.limpiarCuenta = function() {
        $scope.datosCondiciones.clabeCuenta = "";
      }
      var condiciones = new Condiciones({});


      $scope.guardar = function(datosCondiciones) {
        $log.debug('datosCondiciones: ', datosCondiciones);
        var condiciones = new Condiciones(datosCondiciones);
        $scope.dataloading = true;

        condiciones.actualizar(loanId).then(function() {
          if (_('Desertor').isEqual(condicionCliente)) {
            $state.go(CLIENT_STATUS.DOCUMENTACION_PERSONAL.state);
          } else {
            $state.go(CLIENT_STATUS.SEGUNDA_CONFIRMACION.state);
          }
        });
      }
    }]);