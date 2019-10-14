angular.module('solicitudPrestamo')
.factory('datosGeneralesService', ['$http', '$q', 'EnvironmentConfig', 'mambuUtil', '$log', function($http, $q, EnvironmentConfig, mambuUtil,$log){
	var apiUrl = EnvironmentConfig.backend + '/rest/mambuServicio/';
	var SUCCESS_CODE = 200;
	var OK_CODE = 201;

	function validResponse(deferred, response, status){
		if((_(SUCCESS_CODE).isEqual(status) || _(OK_CODE).isEqual(status))  && _(response.errorSource).isEmpty()){
		  deferred.resolve(response);  
		} else{
		  
		  deferred.reject(response);  
		  
		}
	}
	return{
		actualizaDatosGenerales: function(clientId, loanAccount){
			var deferred = $q.defer();
			$log.info('api :', apiUrl);
			$log.info('datosGenerales: _', loanAccount);

			$http({method: 'POST', url: apiUrl, params: {path: 'clients/'+clientId+ "/loans"}, data: loanAccount})
						
			.success(function(response, status){
				$log.info('===actualizarDatosGenerales->success: '+JSON.stringify(response));
				validResponse(deferred, response, status);
				$log.info('clientId: ', clientId);	
			})
			.error(function(err){
				$log.info('===error:'+JSON.stringify(err));
				deferred.reject(err);
			});
			return deferred.promise;
		}

	};
}]);