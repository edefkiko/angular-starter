'use strict'
angular.module('solicitudPrestamo')
.factory('datosCondicionesService', ['$http', '$q', 'EnvironmentConfig', 'mambuUtil', '$log', function($http, $q, EnvironmentConfig, mambuUtil,$log){
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
		actualizaDatosCondiciones: function(loanId, datosCondiciones){
			var deferred = $q.defer();

			$http({method: 'PATCH', url: apiUrl, params: {path: 'loans/'+loanId+ "/custominformation"}, data: datosCondiciones})
			// $http({method: 'PATCH', url: apiUrl, params: {path: 'loans/'+loanId + "/custominformation"}, data: datosCondiciones})
			//TODO: Hardcode prestamo id
			
			.success(function(response, status){
				$log.info('===actualizarDatosCondiciones->success: '+JSON.stringify(response));
				validResponse(deferred, response, status);
				$log.info('loanId: ', loanId);	
			})
			.error(function(err){
				$log.info('===error:'+JSON.stringify(err));
				deferred.reject(err);
			});
			return deferred.promise;
		}

	};
}]);