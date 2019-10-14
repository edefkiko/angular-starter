angular.module('buscador')
.config(function($stateProvider, VIEW_PATH) {
	$stateProvider
	.state("search", {
		url: "/search/:item/:descOpcion",
		authenticate: true,
		gaViewName: VIEW_PATH.resultadosBusqueda,
		templateUrl: "components/buscador/buscadorResult.html",
		controller: "buscadorResultCtrl",
		resolve:{
				incidencias: ['catalogService', '$q', function(catalogService, $q){
					var deferred = $q.defer();

					catalogService.catalogTest().then(function(data){
						var incidencias = catalogService.datosCatalogos(data, 'Tipo_Incidencias_Usuario');
						
						deferred.resolve(incidencias.customFieldSelectionOptions);
					});
					return deferred.promise;

				}]
			}
	})
	.state("incidencias", {
		url: "/incidencias",
		authenticate: true,
		gaViewName: VIEW_PATH.incidencias,
		templateUrl: "components/buscador/incidencias/incidencias.html",
		controller: "incidenciasController",
		resolve:{
				incidencias: ['catalogService', '$q', function(catalogService, $q){
					var deferred = $q.defer();

					catalogService.catalogTest().then(function(data){
						var incidencias = catalogService.datosCatalogos(data, 'Tipo_Incidencias_Usuario');
						
						deferred.resolve(incidencias.customFieldSelectionOptions);
					});
					return deferred.promise;

				}]
			}
	});
});