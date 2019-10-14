'use strict'
app.factory('advertenciaDocumentacion', ['$state', 'ngDialog', function ($state, ngDialog) {
  console.log('advertenciaDocumentacion');

  return function (situacion, ruta, params) {
    var dialogoAdverten = ngDialog.open({
      template: 'components/solicitud_prestamo/templates/popup_advertencia_documentacion.html',
      className: 'ngdialog-theme-default',
      closeByEscape: false,
      closeByDocument: false,
      closeByNavigation: false,
      params:params,
      showClose: false,
      controller: ['$scope', '$state', 'avisoPrivacidadSimp','CLIENT_STATUS', function ($scope, $state, avisoPrivacidadSimp, CLIENT_STATUS) {
        console.log('state: ', $state);
        $scope.situacionCliente = situacion;
        $scope.continuar = function () {
          dialogoAdverten.close();
          avisoPrivacidadSimp('Nuevo', CLIENT_STATUS.REGISTRO_CLIENTE.state,params);
        }
      }]

    });
  }

}]);