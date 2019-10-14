angular.module('profile')
.config(function($stateProvider, VIEW_PATH) {
	$stateProvider
	.state("profile", {
	 	url: "/profile",
	 	authenticate: true,
		gaViewName: VIEW_PATH.perfil,
	 	templateUrl: "components/client/profile/profile.html",
	 	controller: "profileController",
	 	params: {
			origin: null
		},
	 	resolve: {
					semilla: ['semillaService', '$q', function(semillaService, $q) {
			        	var deferred = $q.defer();

			        	semillaService.getSemilla().then(function(response){
			        		deferred.resolve(response.semilla);
			        	});

			        	return deferred.promise;
			        }]
				}
	})
	.state("profile#contacto", {
		url: "/contacto",
		gaViewName: VIEW_PATH.perfilContacto,
		parent: "profile",
		authenticate: true,
		templateUrl: "components/client/profile/profile_contacto.html"
	})
	.state("profile#datosPersonales", {
		url: "/datosPersonales",
		gaViewName: VIEW_PATH.perfilDatosPersonales,
		parent: "profile",
		authenticate: true,
		templateUrl: "components/client/profile/profile_datosPersonales.html"
	})
	.state("profile#contrasena", {
		url: "/contrasena",
		gaViewName: VIEW_PATH.perfilContrasenia,
		parent: "profile",
		authenticate: true,
		templateUrl: "components/client/profile/profile_contrasena.html"
	})
	.state("profile#configuracion", {
		url: "/configuracion",
		gaViewName: VIEW_PATH.perfilConfiguracion,
		parent: "profile",
		authenticate: true,
		templateUrl: "components/client/profile/profile_configuracion.html",
		controller: "profileConfiguracionController"
	});
});