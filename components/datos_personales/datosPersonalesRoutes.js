angular.module('datosPersonales')
	.config(function($stateProvider, VIEW_PATH) {
		$stateProvider
			.state("datos", {
				url: "/datos",
				gaViewName: VIEW_PATH.datosPersonales,
				params: {
					containsFacebookData: false
				},
				resolve: {
					catalogs: ['catalogService', 'datosService', '$q', '$log', function(catalogService, datosService, $q, $log) {
						var deferred = $q.defer();
						var catalogs = {};

						catalogs.estadosIniciales = datosService.dataEstados();

						catalogService.catalogTest().then(function(data) {
							catalogs.sexo = catalogService.datosCatalogos(data, 'Sexo_Details_Clientes');
							catalogs.estadoCivil = catalogService.datosCatalogos(data, 'Estado_Civil_Clientes');
							catalogs.nivelEstudios = catalogService.datosCatalogos(data, 'Nivel_Estudios_Clientes');
							catalogs.adquisicion = catalogService.datosCatalogos(data, 'Adquisición_Clientes');
							catalogs.estados = catalogService.datosCatalogos(data, 'Lugar_Nac_Clientes');

							deferred.resolve(catalogs);
						});

						return deferred.promise;
					}],
					semilla: ['semillaService', '$q', function(semillaService, $q) {
						var deferred = $q.defer();

						semillaService.getSemilla().then(function(response) {
							deferred.resolve(response.semilla);
						});

						return deferred.promise;
					}],
					geolocation: ['geolocationService', '$q', '$log', function(geolocationService, $q, $log) {
						var deferred = $q.defer();

						geolocationService.getCurrentPosition().then(function(position) {
							deferred.resolve(position);
						}, function(err) {
							$log.warn('Invalid geolocation', err);
							deferred.resolve({});
						});

						return deferred.promise;
					}]
				},
				controller: "datoPersonalesCtrl",
				templateUrl: 'components/datos_personales/datosPersonales.html'
			})
			.state("reSendEmail", {
				url: "/resend",
				authenticate: true,
				ignoreState: true,
				params: {
					confirmationSource: null,
					statusSolicitud: null
				},
				views: {
					"": {
						controller: "confirmationEmailController",
						templateUrl: 'components/datos_personales/confirmacion_email/estatusConfirmacionEmail.html'
					}
				}
			})
			.state("confirm", {
				url: "/confirm/:token",
				ignoreState: true,
				views: {
					"": {
						controller: "validTokenController",
						templateUrl: 'components/datos_personales/confirmacion_email/validToken.html'
					}
				},
				params: {
					token: { squash: true, value: 'token' }
				}
			});
	});