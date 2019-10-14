'use strict'
angular.module('solicitudPrestamo')
  .controller('pendienteFirmaController', ['$scope', 'LoginService', '$state', '$log', 'Prestamo', 'Cliente', 'Solicitud', '$rootScope', 'localStorageService', 'CLIENT_STATUS', 'contratoServicio', 'pagareServicio', '_', function($scope, LoginService, $state, $log, Prestamo, Cliente, Solicitud, $rootScope, localStorageService, CLIENT_STATUS, contratoServicio, pagareServicio, _) {
    var userId = LoginService.currentUser().id;
    var cliente = new Cliente({
      id: userId
    });
    var memorySolicitud = localStorageService.get('solicitud');

    $rootScope.showLoading();
    cliente.getBasicData().then(function(user) {
      $scope.$emit('loadUserData');

      contratoServicio.consultaDatosContratoCredito(userId, memorySolicitud.idPrestamo).then(function(datos) {
        $rootScope.hideLoading();
        $scope.contrato = datos;
        datos.cat = parseFloat(datos.cat.replace(",","."));
      });
      pagareServicio.consultaDatosPagare(userId, memorySolicitud.idPrestamo).then(function(datosPagare) {
        $rootScope.hideLoading();
        $scope.pagare = datosPagare;
      });
    });

    $scope.firmar = function() {
      $state.go(CLIENT_STATUS.AUTORIZAR_FIRMA.state);
    };
    $scope.verContrato = false;
    $scope.verPagare = false;
    $scope.mostrarContrato = function() {
      $scope.verContrato = !$scope.verContrato;
      $scope.verPagare = false;
    };

    $scope.mostrarPagare = function() {
      $scope.verPagare = !$scope.verPagare;
      $scope.verContrato = false;
    };
  }]);