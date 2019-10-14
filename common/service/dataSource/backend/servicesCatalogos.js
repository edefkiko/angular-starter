'use strict';
app.factory('catalogService', ['$http', '$q', 'EnvironmentConfig', 'localStorageService', '_', function ($http, $q, EnvironmentConfig, localStorageService, _) {
  var apiUrl = EnvironmentConfig.backend + '/rest/clienteServicio/catalogos';
  //var apiUrl = EnvironmentConfig.backend + '/rest/catalogoServicio';
  var config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  var SUCCESS_CODE = 200;
  var OK_CODE = 201;

  return {
    sexoService: function () {
      var deferred = $q.defer();

      $http.post(apiUrl, { catalogo: 'SEXO' }, config, config.headers)
        // .success(function(response, status){
        .success(function (response) {
          deferred.resolve(response.catalogo);
        })
        .error(function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    },
    estadoCivilService: function () {
      var deferred = $q.defer();

      $http.post(apiUrl, { catalogo: 'ESTADOCIVIL' }, config, config.headers)
        .success(function (response) {
          deferred.resolve(response.catalogo);
        })
        .error(function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    },
    adquisicionService: function () {
      var deferred = $q.defer();

      $http.post(apiUrl, { catalogo: 'ADQUISICION' }, config, config.headers)
        .success(function (response) {
          deferred.resolve(response.catalogo);
        })
        .error(function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    },
    giroEmpresa: function () {
      var data = [
        { id: 1, name: 'Comerciles - Comisionistas' },
        { id: 2, name: 'Comerciales - Mayoristas' },
        { id: 3, name: 'Comerciales - Menudeo' },
        { id: 4, name: 'Comerciales - Minoristas o detallistas' },
        { id: 5, name: 'Comunicación. (periódicos, tv, radio, telégrafos, telefonía, etc.)' },
        { id: 6, name: 'Educación. (escuelas, academias, institutos, etc.)' },
        { id: 7, name: 'Industriales - Agropecuaria' },
        { id: 8, name: 'Industriales - Extractivas' },
        { id: 9, name: 'Industriales - Manufactureras' },
        { id: 10, name: 'Instituciones Financieras. (bancos, financieras, hipotecarias, etc.)' },
        { id: 11, name: 'Transporte (autobuses, camiones, mudanzas, ferrocarriles, etc.)' },
        { id: 12, name: 'Turismo (hoteles, restaurantes, centros nocturnos, etc.)' },
        { id: 13, name: 'Salud (clínicas, hospitales, puestos de socorro, etc.)' },
        { id: 14, name: 'Servicios Públicos Varios (agua y drenaje, luz, gas, etc.)' },
        { id: 15, name: 'Servicios Profesionales (asesorías, despachos contables, jurídicos, administrativos, etc.)' }
      ];
      return data;
    },
    puesto: function () {
      var data = [
        { id: 1, name: 'Administrativo' },
        { id: 2, name: 'Analista' },
        { id: 3, name: 'Asistente' },
        { id: 4, name: 'Auxiliar' },
        { id: 5, name: 'Director/Subdirector' },
        { id: 6, name: 'Empleado de gobierno' },
        { id: 7, name: 'Empleado doméstico' },
        { id: 8, name: 'Gerente/Subgerente' },
        { id: 9, name: 'Jefe de departamento' }
      ];
      return data;
    },
    areaTrabajo: function () {
      var data = [
        { id: 1, name: 'Administración' },
        { id: 2, name: 'Comercial' },
        { id: 3, name: 'Compras' },
        { id: 4, name: 'Dirección General' },
        { id: 5, name: 'Finanzas' },
        { id: 6, name: 'Mantenimiento y Almacén' },
        { id: 7, name: 'Marketing' },
        { id: 8, name: 'Producción y logística' },
        { id: 9, name: 'Recursos humanos' },
        { id: 10, name: 'Sistemas de información' },
        { id: 11, name: 'Ventas' }
      ];
      return data;
    },
    actividadEconomica: function () {
      var data = [
        { id: 1, name: 'Actividades del Gobierno y de Organismos Internacionales y Extraterritoriales' },
        { id: 2, name: 'Agricultura, Ganadería, Aprovechamiento Forestal, Pesca y Caza' },
        { id: 3, name: 'Comercio al por Mayor' },
        { id: 4, name: 'Comercio al por Menor' },
        { id: 5, name: 'Construcción' },
        { id: 6, name: 'Dirección de Corporativos y Empresas' },
        { id: 7, name: 'Electricidad, Agua y Suministro de Gas por Ductos al Consumidor Final' },
        { id: 8, name: 'Industrias Manufactureras' },
        { id: 9, name: 'Información en Medios Masivos' },
        { id: 10, name: 'Otros Servicios Excepto Actividades del Gobierno' },
        { id: 11, name: 'Minería' },
        { id: 12, name: 'Servicios Educativos' },
        { id: 13, name: 'Servicios Financieros y de Seguros' },
        { id: 14, name: 'Servicios Inmobiliarios y de Alquiler de Bienes Muebles e Intangibles' },
        { id: 15, name: 'Servicios Profesionales, Científicos Y Técnicos' },
        { id: 16, name: 'Servicios de Alojamiento Temporal y de Preparación De Alimentos Y Bebidas' },
        { id: 17, name: 'Servicios de Apoyo a los Negocios y Manejo de Desechos y Servicios de Remediación' },
        { id: 18, name: 'Servicios de Esparcimiento Culturales Y Deportivos, y Otros Servicios Recreativos' },
        { id: 19, name: 'Servicios de Salud y de Asistencia Social' },
        { id: 20, name: 'Transportes, Correos y Almacenamiento' }
      ];
      return data;
    },
    situacionActual: function () {
      var data = [
        { id: 1, name: 'Amo/a de casa' },
        { id: 2, name: 'Desempleado' },
        { id: 3, name: 'Estudiante' },
        { id: 4, name: 'Licencia por incapacidad' },
        { id: 5, name: 'Pensionado' }
      ];
      return data;
    },
    meses: function () {
      var data = [
        { id: '01', name: 'Enero' },
        { id: '02', name: 'Febrero' },
        { id: '03', name: 'Marzo' },
        { id: '04', name: 'Abril' },
        { id: '05', name: 'Mayo' },
        { id: '06', name: 'Junio' },
        { id: '07', name: 'Julio' },
        { id: '08', name: 'Agosto' },
        { id: '09', name: 'Septiembre' },
        { id: '10', name: 'Octubre' },
        { id: '11', name: 'Noviembre' },
        { id: '12', name: 'Diciembre' }];
      return data;
    },
    motivoPrestamo: function () {
      var data = [
        { id: 1, name: 'Auto' },
        { id: 2, name: 'Comprar activos fijos' },
        { id: 3, name: 'Educación' },
        { id: 4, name: 'Mejorar tu casa' },
        { id: 5, name: 'Mejorar tu negocio' },
        { id: 6, name: 'Otros' },
        { id: 7, name: 'Pagar deudas' },
        { id: 8, name: 'Salud' },
        { id: 9, name: 'Vacaciones' }
      ];
      return data;
    },
    catalogTest: function () {
      var deferred = $q.defer();

      var catalogs = localStorageService.get('catalogs');

      if (_(catalogs).isNull()) {

        $http({ method: 'GET', url: apiUrl, params: { path: 'customfieldsets' }, data: {} })
          .success(function (response, status) {


            if (_(SUCCESS_CODE).isEqual(status) || _(OK_CODE).isEqual(status) && _(response.errorSource).isEmpty()) {
              localStorageService.set('catalogs', response);
              deferred.resolve(response);
            } else {

              deferred.reject(response);

            }

          })
          .error(function (err) {
            deferred.reject(err);
          });

      } else {
        deferred.resolve(catalogs);
      }


      return deferred.promise;
    },
    datosCatalogos: function (param, cat) {
      var data;
      for (var i = 0; i < param.length; i++) {
        if (param[i].customFields !== undefined) {
          for (var j = 0; j < param[i].customFields.length; j++) {
            if (param[i].customFields[j].dataType) {
              if (param[i].customFields[j].dataType === 'SELECTION') {
                if (param[i].customFields[j].id === cat) {
                  // data = param[i].customFields[j].values;
                  data = param[i].customFields[j];
                }
              }
            }
          }
        }
      }
      return data;
    }
  };
}]);
