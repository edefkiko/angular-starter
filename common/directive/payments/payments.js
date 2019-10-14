app.directive('payments', function() {

  return {
    scope: {
      pagosRealizados: '=',
      transaccionesRealizadas: '=',
      pagosPendientes: '=',
      pagosParciales: '=',
      pagosTardios: '=',
      desplegarTransacciones: '=',
      desplegarRealizados: '=',
      desplegarPendientes: '=',
      desplegarParciales: '=',
      desplegarTardios: '='
    },
    restrict: 'E',
    templateUrl: 'common/directive/payments/payments.html',
    controller: function($scope, $log) {

      $log.log("pendientes " + $scope.desplegarPendientes);

      $scope.limit1 = 3;
      $scope.limit2 = 1;
      $scope.limit3 = 3;
      $scope.limit4 = 3;

      if ($scope.desplegarRealizados === "true") {
        $scope.limit1 = $scope.pagosRealizados.length;
      }
      if ($scope.desplegarTransacciones === "true") {
        $scope.limit1 = $scope.transaccionesRealizadas.length;
      }
      if ($scope.desplegarPendientes === "true") {
        $scope.limit2 = $scope.pagosPendientes.length;
      }
      if ($scope.desplegarParciales === "true") {
        $scope.limit3 = $scope.pagosParciales.length;
      }
      if ($scope.desplegarTardios === "true") {
        $scope.limit4 = $scope.pagosTardios.length;
      }

      $scope.despliegueRealizados = function() {
        $scope.limit1 = $scope.pagosRealizados.length;
        $scope.desplegarRealizados = "true";
      }
      $scope.despliegueTransacciones = function() {
        $scope.limit1 = $scope.transaccionesRealizadas.length;
        $scope.desplegarTransacciones = "true";
      }
      $scope.ocultarRealizados = function() {
        $scope.limit1 = 3;
        $scope.desplegarRealizados = "false";
      }
       $scope.ocultarTransacciones = function() {
        $scope.limit1 = 3;
        $scope.desplegarTransacciones = "false";
      }
      $scope.desplieguePendientes = function() {
        $scope.limit2 = $scope.pagosPendientes.length;
        $scope.desplegarPendientes = "true";
      }
      $scope.ocultarPendientes = function() {
        $scope.limit2 = 1;
        $scope.desplegarPendientes = "false";
      }
      $scope.despliegueParciales = function() {
        $scope.limit3 = $scope.pagosParciales.length;
        $scope.desplegarParciales = "true";
      }
      $scope.despliegueTardios = function() {
        $scope.limit4 = $scope.pagosTardios.length;
        $scope.desplegarTardios = "true";
      }
      $scope.ocultarTardios = function() {
        $scope.limit4 = 3;
        $scope.desplegarTardios = "false";
      }

    }
  };
});