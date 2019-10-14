'use strict'
angular.module('solicitudPrestamo')
  .controller('datosLaboralesController', ['$scope', 'DatosLaborales', 'DatosLaboralesAnterior', 'LoginService', '$state', 'catalogs', 'catalogService', '$log', '$rootScope', 'CLIENT_STATUS', 'Cliente', 'ngDialog', '_', 'Solicitud', 'localStorageService', function ($scope, DatosLaborales, DatosLaboralesAnterior, LoginService, $state, catalogs, catalogService, $log, $rootScope, CLIENT_STATUS, Cliente, ngDialog, _, Solicitud, localStorageService) {
    var userId = LoginService.currentUser().id;
    var cliente = new Cliente({
      id: userId
    });
    var memorySolicitud = localStorageService.get('solicitud');

    $rootScope.showLoading();
    cliente.updateStatus(CLIENT_STATUS.DATOS_EMPLEO.value).then(function (result) {
      $rootScope.hideLoading();
    }, function () {
      $rootScope.hideLoading();
    });

    $scope.minDia = 1;
    $scope.maxDia = 31;
    $scope.minYear = 0;
    $scope.laborales = {};
    $scope.testPublica = catalogs.testPublica;
    $scope.giroEmpresa = catalogs.giroEmpresa;
    $scope.puesto = catalogs.puesto;
    $scope.areaTrabajo = catalogs.areaTrabajo;
    $scope.actividadCliente = catalogs.actividadCliente;
    $scope.destinoPrestamo = catalogs.destinoPrestamo;
    $scope.situacionActual = catalogs.situacionActual;
    $scope.funcionCliente = catalogs.funcionCliente;
    $scope.proveedorInvalido = false;
    $scope.propietarioInvalido = false;

    $scope.$watch('laborales.puesto', function () {
      $log.info('laborales.puesto: ', $scope.puesto.values);
    });
    $scope.activarRequeridos = function () {
      $scope.requiredSituacionActual = false;
    }
    $scope.activarRequeridosNo = function () {
      $scope.requiredSituacionActual = true;
    }
    $scope.resetValues = function (value) {
      $scope.laborales.relNomfuncionario = "";
      $scope.laborales.relPuestoFuncionario = "";
      $scope.laborales.parentRelFuncionario = "";
      $scope.laborales.relacionPublica = "";
      $scope.laborales.cargoPolitico = "";
      $scope.laborales.funcionPublica = "";
      $scope.laborales.proveedor = "";
      $scope.laborales.propietario = "";
      $scope.laborales.propietarioRecursos = "";
      $scope.laborales.giroEmpresa = "";
      $scope.laborales.nombreEmpresa = "";
      // $scope.laborales.trabajoActual ="";
      $scope.laborales.areaClientes = "";
      $scope.laborales.actividadClientes = "";
      $scope.laborales.situacionActual = "";

      $scope.laborales.sueldo = null;
      $scope.laborales.gasto = null;
      $scope.laborales.dependientes = "";
      $scope.laborales.destinoPrestamo = "";
      $scope.laborales.antiguedadAniosClientes = "";
      $scope.laborales.antiguedadNegocio = "";
      $scope.laborales.puesto = "";
    }
    $scope.activarRequeridoCargo = function () {
      $scope.requiredCargoPolitico = true;
    }
    $scope.activarRequeridoFunncion = function () {
      $scope.requiredRelacionPolitico = true;
    }
    $scope.resetCargoPolitico = function () {
      $scope.laborales.cargoPolitico = "";
      $scope.requiredCargoPolitico = false;
    }
    $scope.resetRelacionPolitico = function () {
      $scope.laborales.relNomfuncionario = "";
      $scope.laborales.relPuestoFuncionario = "";
      $scope.laborales.parentRelFuncionario = "";
      $scope.requiredRelacionPolitico = false;


    }
    $rootScope.showLoading();
    cliente.getUserData().then(function (profile) {
      $rootScope.hideLoading();
      $log.debug('profile', profile);
      if (profile.SituacionPersonaClientes === 'Desertor') {
        $log.info('Desertor');
        $scope.activedDesertor = true;
        $scope.laborales.puesto = profile.PuestoTrabajoClientes;
        $scope.laborales.giroEmpresa = profile.GiroEmpresaClientes;
        $scope.laborales.nombreEmpresa = profile.NombreEmpresaClientes;
        $scope.laborales.areaClientes = profile.AreaClientes;
        $scope.laborales.antiguedadAniosClientes = parseInt(profile.AntiguedadAñosClientes);
        $scope.laborales.sueldo = profile.SueldoClientes;
        $scope.laborales.gasto = profile.GastoClientes;
        $scope.laborales.dependientes = parseInt(profile.DependientesEconomicosClientes);
        //$scope.laborales.destinoPrestamo= profile.DestinoCreditoClientes;
        $scope.laborales.situacionActual = profile.SinTrabajoClientes;
        $scope.laborales.actividadClientes = profile.ActividadEconomicaClientes;
        $scope.laborales.antiguedadNegocio = parseInt(profile.NegocioAnosClientes);

        var trabajoActualAnterior = profile.TipoTrabajoCliente;
        $log.info('trabajoActualAnterior:', trabajoActualAnterior);
        if (trabajoActualAnterior === "Sí, en empresa o negocio") {
          $scope.laborales.trabajoActual = "trabajoEmpresa";
          $scope.laborales.actividadClientes = "";
          $scope.laborales.situacionActual = "";
          $scope.laborales.antiguedadNegocio = "";
        } else if (trabajoActualAnterior === "Sí, soy trabajador independiente") {
          $scope.laborales.trabajoActual = "trabajoIndependiente";
          $scope.laborales.situacionActual = "";
          $scope.laborales.giroEmpresa = "";
          $scope.laborales.nombreEmpresa = "";
          $scope.laborales.puesto = "";
          $scope.laborales.areaClientes = "";
          $scope.laborales.antiguedadAniosClientes = "";
          $scope.laborales.antiguedadCliente = "";

        } else
          if (trabajoActualAnterior === "No") {
            $scope.laborales.trabajoActual = "noTrabaja";
            $scope.laborales.giroEmpresa = "";
            $scope.laborales.nombreEmpresa = "";
            $scope.laborales.actividadClientes = "";
            $scope.laborales.antiguedadAniosClientes = "";
            $scope.laborales.antiguedadCliente = "";
            $scope.laborales.antiguedadNegocio = "";
            $scope.laborales.areaClientes = "";
            $scope.laborales.puesto = "";
            $scope.laborales.sueldo = "";
            $scope.laborales.gasto = "";
          }
      } else if (profile.SituacionPersonaClientes === 'Prospecto') {
        $log.info('Prospecto');
      }
    });
    $log.info('funcionPublica:', $scope.laborales.funcionPublica);
    $scope.meses = catalogService.meses();

    var maxSueldo = 99999;
    var maxGasto = 99999;
    $scope.$watch('laborales.sueldo', function () {
      if ($scope.laborales.sueldo) {
        $log.info('$scope.laborales.sueldo', $scope.laborales.sueldo);
        var sueldoCliente = String($scope.laborales.sueldo);
        var cadena = sueldoCliente,
          patron = ",",
          nuevoValor = "",
          sueldoSinComas = cadena.replace(patron, nuevoValor);

        if (parseInt(sueldoSinComas) > maxSueldo) {
          $scope.sueldoInvalido = true;
        } else {
          $scope.sueldoInvalido = false;
        }
      }

    });

    $scope.$watch('laborales.gasto', function () {
      if ($scope.laborales.gasto) {
        $log.info('$scope.laborales.gasto', $scope.laborales.gasto);
        var gastoCliente = String($scope.laborales.gasto);
        var cadena = gastoCliente,
          patron = ",",
          nuevoValor = "",
          gastoSinComas = cadena.replace(patron, nuevoValor);

        if (parseInt(gastoSinComas) > maxgasto) {
          $scope.gastoInvalido = true;
        } else {
          $scope.gastoInvalido = false;
        }
      }

    });
    $scope.textDependientes = /^(?=.{10,})/;

    $scope.guardar = function (laborales) {
      $scope.dataloading = true;
      $scope.laborales.aniosClienteNegocio = String($scope.laborales.antiguedadNegocio);
      var antiguedadClienteString = String($scope.laborales.antiguedadAniosClientes);
      $scope.laborales.antiguedadCliente = antiguedadClienteString;
      if (laborales.sueldo) {
        var salarioClientes = String($scope.laborales.sueldo).replace(',','');
        $scope.laborales.sueldoClientes = salarioClientes;
      }

      if (laborales.gasto) {
        var gastoClientes = String($scope.laborales.gasto).replace(',','');
        $scope.laborales.gastoClientes = gastoClientes;
      }
      cliente.getUserData().then(function (profile) {
        $log.debug('profile', profile);
        if (profile.SituacionPersonaClientes === 'Desertor') {
          $log.info('Desertor, Guardando datos anteriores');
          var datosLaboralesAnterior = new DatosLaboralesAnterior(profile, laborales);
          datosLaboralesAnterior.actualizar(userId, laborales);
          loadUpdateLaborales();
        } else if (profile.SituacionPersonaClientes === 'Prospecto') {
          $log.info('Prospecto, sin datos anteriores');
          loadUpdateLaborales();

        }
      });

      memorySolicitud.funcionPublica = laborales.funcionPublica;
      memorySolicitud.relacionPublica = laborales.relacionPublica;
      memorySolicitud.cargoPolitico = laborales.cargoPolitico;
      memorySolicitud.relNomfuncionario = laborales.relNomfuncionario;
      memorySolicitud.relPuestoFuncionario = laborales.relPuestoFuncionario;
      memorySolicitud.parentRelFuncionario = laborales.parentRelFuncionario;

      memorySolicitud.proveedor = laborales.proveedor;
      memorySolicitud.propietario = laborales.propietario;
      memorySolicitud.propietarioRecursos = laborales.propietarioRecursos;
      new Solicitud(memorySolicitud).updateFuncionPublica(userId);

      $log.info('laborales: ', laborales);

      function loadUpdateLaborales() {
        var datosLaborales = new DatosLaborales(laborales);
        $log.info('=== actualizando datosLaborales...')
        datosLaborales.actualizar(userId).then(function () {

          $log.info('===datosLaborales actualizados');
          $state.go(CLIENT_STATUS.AUTORIZAR_BURO.state);
        });
      }
    }
  }]);