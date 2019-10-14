app.service('ProductoPadre', ['$q', '$log', 'productoPadreService', function($q, $log, productoPadreService){
	var productoPadre = {};

	function load(){
		var mainPromise = $q.defer(); 		

		productoPadreService.consulta().then(function(response){
			if(response.productos){

			    var productos = [
				    {nombreProducto: response.productos[0].productoPlazoId},
					{nombreProducto: response.productos[0].productoMontoId}
				];

            	productoPadreService.consultaDetalle(productos).then(function(response){
            		$log.log('productos', response.productos)
            		productoPadre.productoMonto = _(response.productos).find( function(item) {
            			$log.log('item.nombreProducto', item.nombreProducto);
            		  if(item.nombreProducto.indexOf('monto') != -1){
            		  	return item;
            		  }
            		});

            		productoPadre.productoPlazo = _(response.productos).find( function(item) {
            		  if(item.nombreProducto.indexOf('plazo') != -1){
            		  	return item;
            		  }
            		});;

            		productoPadre.montoMinimo = response.montoMinimo;
            		productoPadre.montoMaximo = response.montoMaximo;
            		productoPadre.defaultMonto = response.defaultMonto;
            		productoPadre.defaultFrecuencia = response.defaultFrecuencia; 
            		productoPadre.defaultPeriodo = response.defaultPeriodo;     
            		productoPadre.defaultTasa = response.defaultTasa;
            		productoPadre.defaultPlazo = response.defaultPlazo;      	

            		mainPromise.resolve();	
            	});

            }else{
            	$log.error('No hay Producto padre');
            }
		});
		return mainPromise.promise;
	}

	function getMontoMaximo(){
		return parseInt(productoPadre.montoMaximo) | 0;
	}

	function getMontoMinimo(){
		return parseInt(productoPadre.montoMinimo) | 0;
	}

	function getDefaultMonto(){
		return parseInt(productoPadre.defaultMonto) | 0;
	}

	function getDefaultPlazo(){
		return parseInt(productoPadre.defaultPlazo) | 0;
	}

	function getDefaultTasa(){
		return parseInt(productoPadre.defaultTasa) | 0;
	}

	function getEncodedKeyProductoMonto(){
		return productoPadre.productoMonto.encodedKey;
	}

	function getEncodedKeyProductoPlazo(){
		return productoPadre.productoPlazo.encodedKey;
	}

	function getProductoPadre(){
		return productoPadre;
	}

	function getDefaultFrecuencia(){
		var result;
		if(_('WEEKS').isEqual(productoPadre.defaultFrecuencia)){
            result = 'SEMANA';
          }else if(_('DAYS').isEqual(productoPadre.defaultFrecuencia)){
            result = 'QUINCENA';
          }else if(_('MONTHS').isEqual(productoPadre.defaultFrecuencia)){
            result = 'MES';
          }else{
            result = productoPadre.defaultFrecuencia;
          }

		return result;
	}

	function getDefaultPeriodo(){
		return parseInt(productoPadre.defaultPeriodo) | 0;;
	}
	

	return{
		load: load,
		getEncodedKeyProductoMonto: getEncodedKeyProductoMonto,
		getEncodedKeyProductoPlazo: getEncodedKeyProductoPlazo,
		getMontoMaximo: getMontoMaximo,
		getMontoMinimo: getMontoMinimo,
		getDefaultMonto: getDefaultMonto,
		getDefaultPlazo: getDefaultPlazo,
		getDefaultTasa: getDefaultTasa,
		getProductoPadre: getProductoPadre,
		getDefaultFrecuencia: getDefaultFrecuencia,
		getDefaultPeriodo: getDefaultPeriodo

	}
}])