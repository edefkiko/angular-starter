app.factory('consultaCatService', ['$http', '$q', 'EnvironmentConfig', function($http, $q, EnvironmentConfig){
	var apiUrl = EnvironmentConfig.backend + '/rest/consultaCat';
	var SUCCESS_CODE = 200;

	return{
		calculate: function(frecuencia, tasa, plazos){			
			var deferred = $q.defer();
			var frecuenciaEn;
			if(_('SEMANA').isEqual(frecuencia)){
				frecuenciaEn = 'SEMANAL';
			}else if(_('QUINCENA').isEqual(frecuencia)){
				frecuenciaEn = 'QUINCENAL';
				periodo = 15;
			}else if(_('MES').isEqual(frecuencia)){
				frecuenciaEn = 'MENSUAL';
			}

			$http({ method: 'POST', url: apiUrl, data: {
				   frecuencia: frecuenciaEn,
				   tasa: tasa,
				   plazo: plazos
				}
			})
	        .success(function(response, status){
	        
		        if(_(SUCCESS_CODE).isEqual(status) && _("0").isEqual(response.resultado)){			      	
			         deferred.resolve(response.cat);
			    } else{
			      
			      deferred.reject(response);  
			      
			  	}
		      
	        })
	        .error(function(err){
	          console.info('===error:'+JSON.stringify(err));
	          deferred.reject(err);
	        });
	      
	    	return deferred.promise;
		}
	};

}])