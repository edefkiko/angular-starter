app.factory('tokenService', ['$http', '$q', 'EnvironmentConfig', function($http, $q, EnvironmentConfig){
	var apiUrl = EnvironmentConfig.backend + '/rest/tokenServicio';
	var SUCCESS_CODE = 200;

	return{
		sendToken: function(idCliente, token){			
			var deferred = $q.defer();

			$http({ method: 'POST', url: apiUrl, data: {
					token: token,
					idCliente: idCliente
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