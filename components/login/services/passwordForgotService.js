'use strict'
angular.module('authServices')
.factory('PasswordForgotService', ['$http', '$rootScope', 'EnvironmentConfig', '$state', '$q', '_', '$log', function($http, $rootScope, EnvironmentConfig, $state, $q, _, $log){
	var apiUrl = EnvironmentConfig.backend + '/rest/olvidoCambioClaveServicio/';
	var apiUrlValidaPass = EnvironmentConfig.backend + '/rest/validaPassword/';
	
	function passwordForgot (credentials){ 
		var deferred = $q.defer();
		$http.post(apiUrl+'enviarMail/',{mailUsuario: credentials.username})
	      .success(function(response, status){
		  
		  $log.debug("passwordForgot: ", response, "status", status);	   
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

	function verificarMail(mailUsuario){
		var deferred = $q.defer();
		$http.post(apiUrl+'verificarMail/',{mailUsuario: mailUsuario})
	      .success(function(response, status){
		  
		  $log.debug("verificarMail: ", response, "status", status);	   
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

	function validarCodigoSms(credentials){ 
		var deferred = $q.defer();
		$http.post(apiUrl+'validarCodigoSms/', credentials)
	      .success(function(response, status){
		  
		  $log.debug("validarCodigoSms: ", response, "status", status);	   
		  if(response.resultado === '0'){
	      	deferred.resolve(response);	
		  }else{
		  	deferred.reject(response.mensajeOperacion);	
		  }
	      
	    })
	    .error(function(err){
	  	  deferred.reject(err);
	    });

		return deferred.promise;
	}

	function enviarSms(mailUsuario){ 
		var deferred = $q.defer();
		$http.post(apiUrl+'enviarSms/',{mailUsuario: mailUsuario})
	      .success(function(response, status){
		  
		  $log.debug("enviarSms: ", response, "status", status);	   
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

	function cambioClave(mailUsuario){ 
		var deferred = $q.defer();
		$http.post(apiUrl+'cambioClavePasswordServicio/', mailUsuario)
	      .success(function(response, status){
		  
		  $log.debug("enviarSms: ", response, "status", status);	   
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

	function validaPassword(idUsuario, encPassword){ 
		var deferred = $q.defer();
		$http.post(apiUrlValidaPass, {password: encPassword})
	      .success(function(response, status){
		  
		  $log.debug("cambioClave: ", response, "status", status);	   
		  if(!_(response).isEmpty() && _(true).isEqual(response.esValida)){
	      	deferred.resolve(response.esValida);	
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
		passwordForgot: passwordForgot,
		validarCodigoSms: validarCodigoSms,
		verificarMail: verificarMail,
		enviarSms: enviarSms,
		cambioClave: cambioClave,
		validaPassword: validaPassword
	};
}]);