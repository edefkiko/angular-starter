'use strict'
app.factory('avisoPrivacidadSimp',['$state', 'ngDialog', function($state, ngDialog){
    return function(situacion, ruta, params) {
      var dialogoAviso = ngDialog.open({
        template: 'components/solicitud_prestamo/templates/aviso-privacidad-simplificado.html',
        className: 'ngdialog-theme-default',
        closeByEscape: false,
        closeByDocument: false,
        closeByNavigation: false,
        showClose: false,
        controller: ['$scope', '$state', 'EnvironmentConfig', function($scope, $state, EnvironmentConfig) {
          $scope.yeiInfo = EnvironmentConfig.yeiInfo;
          $scope.continuar = function() {            
            $state.go(ruta, params);
            dialogoAviso.close();
          }
        }]

      });
    }

}]);