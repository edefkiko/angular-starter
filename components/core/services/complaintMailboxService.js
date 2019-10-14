'use strict'
app.factory('ComplaintMailboxService', ['$http', '$rootScope', 'EnvironmentConfig', '$state', '$q', '_', '$log', function($http, $rootScope, EnvironmentConfig, $state, $q, _, $log){
	var apiUrl = EnvironmentConfig.backend + '/rest/envioDenunciaServicio/enviarMail'; 
	
	function sendComplaint(message){ 
		var deferred = $q.defer();
		$http.post(apiUrl, message)
	      .success(function(response, status){
		  
		  $log.info("sendComplaint: ", response, "status", status);	   
		  if(response.resultado === '0'){
	      	deferred.resolve(response);	
		  }else{
		  	deferred.reject(response.mensajeOperacion);	
		  }
	      
	    })
	    .error(function(err){
	  	  deferred.reject();
	    });

		return deferred.promise;
	}

	return {
		sendComplaint: sendComplaint,
	};
}]);