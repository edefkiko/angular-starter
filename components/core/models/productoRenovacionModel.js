app.service('ProductoRenovacion', ['$q', '$log', 'productoRenovacionService', function($q, $log, productoRenovacionService){
	var productoRenovacion = {
		importeMinimo: undefined,
		importeMaximo: undefined,
		tasa: undefined
	};

	function load(idCliente){
		var mainPromise = $q.defer(); 		

		productoRenovacionService.consulta(idCliente).then(function(response){
			productoRenovacion.importeMinimo= response.importeMinimo;
			productoRenovacion.importeMaximo= response.importeMaximo;
			productoRenovacion.tasa= response.tasa;
			$log.info('ProductoRenovacionService: ', response);
			mainPromise.resolve();

		}, function(err){
			$log.error('ProductoRenovacionService: ', err);
		});

		return mainPromise.promise;
	}

	function getMontoMaximo(){
		return parseInt(productoRenovacion.importeMaximo) | 0;
	}

	function getMontoMinimo(){
		return parseInt(productoRenovacion.importeMinimo) | 0;
	}

	function getTasa(){
		return parseInt(productoRenovacion.tasa) | 0;
	}

	return{
		load: load,
		getMontoMaximo: getMontoMaximo,
		getMontoMinimo: getMontoMinimo,
		getTasa: getTasa

	}
}])