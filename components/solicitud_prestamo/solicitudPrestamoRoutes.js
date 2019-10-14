angular.module('solicitudPrestamo')
	.config(function ($stateProvider, VIEW_PATH) {

		$stateProvider
			// vistas para el wizard
			.state('prestamo', {
				abstract: true,
				url: '/prestamo',
				authenticate: true,
				gaViewName: VIEW_PATH.prestamo,
				templateUrl: 'components/solicitud_prestamo/contenedor.html'
			})
			.state('prestamo.dondevives', {
				url: '/dondevives',
				authenticate: true,
				gaViewName: VIEW_PATH.dondeVives,
				params: {
					datos: null
				},
				templateUrl: 'components/solicitud_prestamo/donde_vives/dondeVives.html',
				controller: 'dondeVivesController',
				resolve: {
					catalogs: ['catalogService', '$q', function (catalogService, $q) {
						var deferred = $q.defer();
						var catalogs = {};
						catalogService.catalogTest().then(function (data) {
							catalogs.estatusResidencial = catalogService.datosCatalogos(data, 'Estatus_Residencial_Clientes');

							deferred.resolve(catalogs);
						});
						return deferred.promise;

					}]
				}
			})
			.state('prestamo.datosLaborales', {
				url: '/datosLaborales',
				authenticate: true,
				gaViewName: VIEW_PATH.datosLaborales,
				params: {
					datos: null
				},
				templateUrl: 'components/solicitud_prestamo/datos_laborales/datosLaborales.html',
				controller: 'datosLaboralesController',
				resolve: {
					catalogs: ['catalogService', '$q', function (catalogService, $q) {
						var deferred = $q.defer();
						var catalogs = {};

						catalogService.catalogTest().then(function (data) {
							catalogs.testPublica = catalogService.datosCatalogos(data, 'Funcion_Publica_Clientes');
							catalogs.giroEmpresa = catalogService.datosCatalogos(data, 'Giro_Empresa_Clientes');
							catalogs.puesto = catalogService.datosCatalogos(data, 'Puesto_Trabajo_Clientes');
							catalogs.areaTrabajo = catalogService.datosCatalogos(data, 'Area_Clientes');
							catalogs.actividadCliente = catalogService.datosCatalogos(data, 'Actividad_Economica_Clientes');// "Actividad_Economica_Clientes"
							catalogs.destinoPrestamo = catalogService.datosCatalogos(data, 'Destino_Credito_Clientes');
							catalogs.situacionActual = catalogService.datosCatalogos(data, 'Sin_Trabajo_Clientes');
							catalogs.funcionCliente = catalogService.datosCatalogos(data, 'Relacion_Funcion_Clientes');// "Relacion_Funcion_Clientes"

							deferred.resolve(catalogs);
						});

						return deferred.promise;
					}]
				}
			})
			.state('prestamo.datosgenerales', {
				url: '/datosgenerales',
				authenticate: true,
				gaViewName: VIEW_PATH.datosGenerales,
				resolve: {
					productoPadre: ['ProductoPadre', '$q', function (ProductoPadre, $q) {
						var deferred = $q.defer();
						ProductoPadre.load().then(function () {
							deferred.resolve();
						});
						return deferred.promise;

					}]
				},
				templateUrl: 'components/solicitud_prestamo/condiciones_prestamo/generales/datosGenerales.html',
				controller: 'datosGeneralesController'
			})
			.state('prestamo.condiciones', {
				url: '/condiciones',
				authenticate: true,
				gaViewName: VIEW_PATH.condicionesPrestamo,
				params: {
					datos: null
				},
				templateUrl: 'components/solicitud_prestamo/condiciones_prestamo/condiciones.html',
				controller: 'condicionesController',
				resolve: {
					catalogs: ['catalogService', '$q', function (catalogService, $q) {
						var deferred = $q.defer();
						var catalogs = {};
						catalogService.catalogTest().then(function (data) {
							catalogs.bancoDispersion = catalogService.datosCatalogos(data, 'Banco_Cuentas_de_Prestamo');

							deferred.resolve(catalogs);
						});
						return deferred.promise;

					}]
				}
			})
			.state('prestamo.contratacion', {
				url: '/contratacion',
				authenticate: true,
				gaViewName: VIEW_PATH.contratacion,
				templateUrl: 'components/solicitud_prestamo/contratacion/contratacion.html',
				controller: 'contratacionController',
				resolve: {
					selfieCatalog: ['catalogService', '$q', function (catalogService, $q) {
						var deferred = $q.defer();
						var catalog = {};
						catalogService.catalogTest().then(function (data) {
							catalog = catalogService.datosCatalogos(data, 'Palabra_Selfie_Clientes');
							deferred.resolve(catalog.values);
						});
						return deferred.promise;

					}]
				}
			})
			.state('prestamo.evaluacion', {
				url: '/evaluacion',
				authenticate: true,
				ignoreState: true,
				templateUrl: 'components/solicitud_prestamo/evaluacion/motorRiesgo.html',
				controller: 'motorRiesgoCtrl'
			})
			.state('prestamo.evaluacionNext', {
				url: '/evaluacionNext',
				authenticate: true,
				templateUrl: 'components/solicitud_prestamo/evaluacion/evaluacionNext.html',
				ignoreState: true
			})
			.state('prestamo.confirmBuro', {
				url: '/confirmBuro',
				authenticate: true,
				ignoreState: true,
				templateUrl: 'components/solicitud_prestamo/datos_laborales/confirmacion_buro/confirmacion_buro.html',
				controller: 'confirmacionBuroController'
			})
			.state('prestamo.dondeEstas', {
				url: '/dondeEstas',
				authenticate: true,
				gaViewName: VIEW_PATH.dondeEstas,
				templateUrl: 'components/solicitud_prestamo/donde_estas/donde_estas.html',
				controller: 'dondeEstasController',
				resolve: {
					opciones: ['catalogService', '$q', function (catalogService, $q) {
						var deferred = $q.defer();
						var catalogs = {};
						catalogService.catalogTest().then(function (data) {
							opciones = catalogService.datosCatalogos(data, 'DondeEstas_Clientes');

							deferred.resolve(opciones.values);
						});
						return deferred.promise;

					}]
				}
			})
			.state('docCompleta', {
				url: '/docCompleta',
				authenticate: true,
				ignoreState: true,
				templateUrl: 'components/solicitud_prestamo/solicitud_completa/solicitud_completa.html',
				controller: 'solicitudCompletaController'
			})
			.state('pendienteFirma', {
				url: '/pendienteFirma',
				gaViewName: VIEW_PATH.pendienteFirma,
				authenticate: true,
				templateUrl: 'components/solicitud_prestamo/pendiente_firma/pendiente_firma.html',
				controller: 'pendienteFirmaController'
			})
			.state('autorizarFirma', {
				url: '/autorizarFirma',
				authenticate: true,
				ignoreState: true,
				templateUrl: 'components/solicitud_prestamo/pendiente_firma/autorizar_firma/autorizar_firma.html',
				controller: 'autorizarFirmaController'
			});

	});