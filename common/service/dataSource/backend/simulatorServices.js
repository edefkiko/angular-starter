app.factory('Simulator', ['$http', '$q', 'EnvironmentConfig', 'mambuUtil', 'ProductoPadre', function($http, $q, EnvironmentConfig, mambuUtil, ProductoPadre){
	var apiUrl = EnvironmentConfig.backend + '/rest/clienteServicio/simulador/';
	var SUCCESS_CODE = 200;
  	var OK_CODE = 201;

	return{
		calculate: function(monto, frecuencia, plazos, tasa){			
			var deferred = $q.defer();
			var periodo = 1;
			var frecuenciaEn;
			if(_('SEMANA').isEqual(frecuencia)){
				frecuenciaEn = 'WEEKS';
			}else if(_('QUINCENA').isEqual(frecuencia)){
				frecuenciaEn = 'DAYS';
				periodo = 15;
			}else if(_('MES').isEqual(frecuencia)){
				frecuenciaEn = 'DAYS';
				periodo = 30;
			}

			var params = 'loanAmount=%loanAmount%&interestRate=%interestRate%&repaymentInstallments=%repaymentInstallments%&repaymentPeriodUnit=%repaymentPeriodUnit%&repaymentPeriodCount=%repaymentPeriodCount%';
			params = params.replace("%loanAmount%", monto);
			params = params.replace("%interestRate%", tasa);
			params = params.replace("%repaymentPeriodCount%", periodo);
			params = params.replace("%repaymentPeriodUnit%", frecuenciaEn);
			params = params.replace("%repaymentInstallments%", plazos);//plazos

			
			var productoPadre = ProductoPadre.getProductoPadre();

			if(_(productoPadre).isEmpty()){
				
				ProductoPadre.load().then(function(){					
					productoPadre = ProductoPadre.getProductoPadre();

					calculate(productoPadre.productoMonto.nombreProducto, params, periodo, frecuenciaEn, deferred);
				});

			}else{								
				calculate(productoPadre.productoMonto.nombreProducto, params, periodo, frecuenciaEn, deferred);
			}
			
	      
	    	return deferred.promise;
		}
	};

	function calculate(productId, params, periodo, frecuenciaEn, deferred){

		$http({ method: 'GET', url: apiUrl, params:{path: ''+ productId +'/schedule?'+ params}, data: ''})
	        .success(function(response, status){
	        
		        if(_(SUCCESS_CODE).isEqual(status) || _(OK_CODE).isEqual(status)  && _(response.errorSource).isEmpty()){
			      	 var response = mambuUtil.mapearPagosResponse(response.repayments,{});
			         
			         response.periodo = periodo;
			         response.frecuenciaEn = frecuenciaEn;

			         deferred.resolve(response);
			    } else{
			      
			      deferred.reject(response);  
			      
			  	}
		      

	        })
	        .error(function(err){
	          console.info('===error:'+JSON.stringify(err));
	          deferred.reject(err);
	        });

	}

}])