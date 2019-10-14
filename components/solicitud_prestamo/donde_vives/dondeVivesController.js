'use strict';
angular.module('solicitudPrestamo')
  .controller('dondeVivesController', ['$scope', 'DondeVives', 'DondeVivesAnterior', 'cpService', 'LoginService', '$state', '$log', '$rootScope', 'catalogs', 'Cliente', '_', function($scope, DondeVives, DondeVivesAnterior, cpService, LoginService, $state, $log, $rootScope, catalogs, Cliente, _) {
    var userId = LoginService.currentUser().id;
    var situacion = LoginService.currentUser().situacion;
    $log.info('situacion: ', situacion);
    var cliente = new Cliente({
      id: userId
    });
    $scope.domicilio = {};
    $scope.estatusResidencial = catalogs.estatusResidencial;
    var dondeVivesAnterior = new DondeVivesAnterior({});
    var dondeVives = new DondeVives({});

    $rootScope.showLoading();
    dondeVives.updateStatus(userId).then(function() {
      $rootScope.hideLoading();
    }, function() {
      $rootScope.hideLoading();
    });
    $scope.mostrarMunicipio = false;
    $scope.mostrarColonia = false;
    $scope.mostrarCiudad = false;
    $scope.mostrarEstado = false;
    cliente.getUserData().then(function(profile) {
      $log.info('profile: ', profile);
      if (situacion === 'Desertor') {
        $scope.activedDesertor = true;
        $scope.domicilio.calle = profile.calleClientes;
        $scope.domicilio.numExt = profile.NumExtClientes;
        $scope.activedDesertorNumInt = true;
        $scope.domicilio.estatus = profile.EstatusResidencialClientes;

        $scope.activedDesertorDepaClientes = true;
        if (profile.NumIntClientes === ' ') {
          $scope.activedDesertorNumInt = false;
        }
        if (profile.DepaClientes === ' ') {
          $scope.activedDesertorDepaClientes = false;
        }
        $scope.domicilio.numInt = profile.NumIntClientes;
        $scope.domicilio.numDepto = profile.DepaClientes;
        $scope.domicilio.codigoPostal = profile.CPClientes;
      }
      $scope.$watch('domicilio.codigoPostal', function() {
        $scope.cambiarEstado = function() {
          situacion = 'Prospecto';
        };
        if ($scope.domicilio.codigoPostal && $scope.domicilio.codigoPostal.length >= 5) {
          $log.info('===domicilio.codigoPostal:', $scope.domicilio.codigoPostal);
          dondeVives.obtenerColonias($scope.domicilio.codigoPostal).then(function(catalogo) {
            $log.info('catalogo colonias:', catalogo);
            if (_(catalogo).isEmpty()) {
              $log.info('Cp invalido');
              $scope.codigoPostalInvalido = true;
            } else {
              $scope.mostrarColonia = true;
            }
            var seleccionColonia;
            if (catalogo.length > 1) {
              seleccionColonia = '';
            } else if (catalogo.length === 1) {
              seleccionColonia = catalogo[0];
            }

            var coloniaDesertor = _.find(catalogo, function(item) {
              if (_.isEqual(item.descOpcion, profile.ColoniaClientes)) {
                return item;
              }
            })
            var opcColonia;
            if (situacion === 'Desertor') {
              opcColonia = coloniaDesertor;
            } else if (situacion === 'Prospecto') {
              opcColonia = seleccionColonia;
            }

            $scope.domicilio.dataColonias = {
              opcionesColonia: catalogo,
              coloniaSeleccionada: opcColonia
            };

          });
          dondeVives.obtenerMunicipios($scope.domicilio.codigoPostal).then(function(catalogo) {
            $log.info('length catalogo mpios', catalogo.length);
            $log.info('catalogo municipios:', catalogo);
            if (_(catalogo).isEmpty()) {
              $log.info('Cp invalido');
              $scope.codigoPostalInvalido = true;
            } else {
              $scope.mostrarMunicipio = true;
            }
            var seleccionMunicipio;
            if (catalogo.length > 1) {
              seleccionMunicipio = '';
              $scope.seleccionarValor = true;
            } else if (catalogo.length === 1) {
              seleccionMunicipio = catalogo[0];
            }
            var municipioDesertor = _.find(catalogo, function(item) {
              if (_.isEqual(item.descOpcion, profile.MunDelClientes)) {
                return item;
              }
            })
            var opcMunicipio;
            if (situacion === 'Desertor') {
              opcMunicipio = municipioDesertor;
            } else if (situacion === 'Prospecto') {
              opcMunicipio = seleccionMunicipio;
            }
            $scope.domicilio.dataMunicipios = {
              opcionesMunicipio: catalogo,
              municipioSeleccionada: opcMunicipio
            };
          });
          dondeVives.obtenerCiudades($scope.domicilio.codigoPostal).then(function(catalogo) {
            $log.info('length catalogo ciudades', catalogo.length);
            $log.info('catalogo ciudades:', catalogo);
            if (_(catalogo).isEmpty()) {
              $log.info('Cp invalido');
              $scope.codigoPostalInvalido = true;
            } else {
              $scope.mostrarCiudad = true;
            }
            var seleccionCiudad;
            if (catalogo.length > 1) {
              seleccionCiudad = '';
            } else if (catalogo.length === 1) {
              seleccionCiudad = catalogo[0];
            }
            var ciudadDesertor = _.find(catalogo, function(item) {
              if (_.isEqual(item.descOpcion, profile.CiudadClientes)) {
                return item;
              }
            })
            var opcCiudad;
            if (situacion === 'Desertor') {
              opcCiudad = ciudadDesertor;
            } else if (situacion === 'Prospecto') {
              opcCiudad = seleccionCiudad;
            }
            $scope.domicilio.dataCiudades = {
              opcionesCiudad: catalogo,
              ciudadSeleccionada: opcCiudad
            };
          });
          dondeVives.obtenerEstados($scope.domicilio.codigoPostal).then(function(catalogo) {
            $log.info('length catalogo estados', catalogo.length);
            $log.info('catalogo estados:', catalogo);
            if (_(catalogo).isEmpty()) {
              $log.info('Cp invalido');
              $scope.codigoPostalInvalido = true;
            } else {
              $scope.mostrarEstado = true;
            }
              var seleccionEstado;
            if (catalogo.length > 1) {
              seleccionEstado = '';
            } else if (catalogo.length === 1) {
              seleccionEstado = catalogo[0];
            }
            var estadoDesertor = _.find(catalogo, function(item) {
              if (_.isEqual(item.descOpcion, profile.EstadoClientes)) {
                return item;
              }
            })
              var opcEstado;
            if (situacion === 'Desertor') {
              opcEstado = estadoDesertor;
            } else if (situacion === 'Prospecto') {
              opcEstado = seleccionEstado;
            }

            $scope.domicilio.dataEstados = {
              opcionesEstado: catalogo,
              estadoSeleccionada: opcEstado
            };
          });
        } else {
          // $scope.domicilio.dataColonias='';
          $scope.domicilio.dataMunicipios = '';
          $scope.domicilio.dataCiudades = '';
          $scope.domicilio.dataEstados = '';
          $scope.codigoPostalInvalido = false;
          $scope.seleccionarValor = false;
          $scope.mostrarMunicipio = false;
          $scope.mostrarColonia = false;
          $scope.mostrarEstado = false;
          $scope.mostrarCiudad = false;


        }
      });
    });

    $scope.guardar = function(domicilio) {
      $scope.dataloading = true;

      $log.info(domicilio);

      cliente.getUserData().then(function(profile) {
        $log.debug('profileCtrl', profile);

        if (profile.SituacionPersonaClientes === 'Desertor') {
          $log.info('Guardando datos anteriores')
          var dondeVivesAnterior = new DondeVivesAnterior(profile);
          dondeVivesAnterior.actualizar(userId, profile);
        } else if (profile.SituacionPersonaClientes === 'Prospecto') {
          $log.info('Prospecto, sin datos anteriores');
        }

        var dondeVives = new DondeVives(domicilio, profile);
        dondeVives.actualizar(userId, profile).then(function() {
          $state.go('prestamo.datosLaborales', {
            datos: 'hola mundo'
          });
        }, function() {
          $scope.dataloading = false;
        });
      });
    }


  }]);