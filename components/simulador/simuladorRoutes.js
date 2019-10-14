angular.module('simulador')
.config(function($stateProvider, VIEW_PATH) {
	$stateProvider
	.state("simuladorProspecto", {
	 	url: "/simuladorP",
		gaViewName: VIEW_PATH.simuladorProspecto,
	 	controller: "simuladorProspectoController",
		templateUrl: 'components/simulador/simulador_prospecto/simuladorProspecto.html',
		params: {
	        id: null
	    },
		resolve:{
			productoPadre: ['ProductoPadre', '$q', function(ProductoPadre, $q){
				var deferred = $q.defer();
				ProductoPadre.load().then(function(){			
					deferred.resolve();
				});
				return deferred.promise;

			}]
		}
	})
	.state("simuladorDesertor", {
	 	url: "/simuladorD",
	 	authenticate: true,
		gaViewName: VIEW_PATH.simuladorDesertor,
	 	controller: "simuladorDesertorController",
		templateUrl: 'components/simulador/simulador_desertor/simuladorDesertor.html',
		resolve:{
			productoPadre: ['ProductoPadre', '$q', function(ProductoPadre, $q){
				var deferred = $q.defer();
				ProductoPadre.load().then(function(){			
					deferred.resolve();
				});
				return deferred.promise;

			}]
		}
	});
});