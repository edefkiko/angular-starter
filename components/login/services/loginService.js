angular.module('authServices', [])
.factory('LoginService', ['$http', '$rootScope', 'localStorageService', 'EnvironmentConfig', '$state', '$q', '_', '$log', 'alertService', 'deviceDetector', 'tokenService', function($http, $rootScope, localStorageService, EnvironmentConfig, $state, $q, _, $log, alertService, deviceDetector, tokenService){
	var apiUrl = EnvironmentConfig.backend + '/rest/';
	var auth = {};
	auth.init = function(){
		if(auth.isLoggedIn()){
			$rootScope.$emit('loadUserSesion', auth.currentUser());
		}
	};

	auth.login = function(credentials, origen){ //username, password
		var deferred = $q.defer();
		$http.post(apiUrl+'loginServicio/login',{mail: credentials.username, clave: credentials.encPassword})
	      .success(function(response, status){		  
		  $log.debug("login: ", response, "status", status);	   
		  if(response.resultado === '0'){
		  	localStorageService.set('user', {
				id: response.idUsuario,
				name: credentials.username,
				token: response.token,
				situacion: response.situacion,
				idSolicitud: response.idSolicitud,
				ultimoLogin: response.ultimoLogin,
				tieneHistorial: response.tieneHistorial
			});

		  	$rootScope.$emit('loadUserSesion', localStorageService.get('user'));
		  	$rootScope.$emit('loadNotifications', response.idUsuario);
		  	
		  	if(_(true).isEqual(EnvironmentConfig.isMobile)){
				registerToken();
		  	}


		  	if(_(true).isEqual(response.temporal)){
		  		$state.go('profile', {origin: "LOGIN"});
		  		deferred.resolve();
		  	}else{
		  		$state.go('root');

	      		deferred.resolve(response);	
		  	}
		  		  	
		  }else{
		  	deferred.reject(response.mensajeOperacion);	
		  }
	      
	    })
	    .error(function(err){
	  	  deferred.reject();
	    });

		//$rootScope.$broadcast(AUTH_EVENS.loginSuccess);
		

		return deferred.promise;
	};

	auth.validaMail = function(credentials, origen){ //username, password
		var deferred = $q.defer();
		$http({method: 'POST', url: apiUrl+'validaMail', data: {mail: credentials.username}})
	      .success(function(response, status){		  
		  $log.debug("validaMail: ", response, "status", status);	   
		  if(response.resultado === '0'){
		  	
		  	deferred.resolve(response.nombreUsuario);	
		  }else{
		  	deferred.reject(response.mensajeOperacion);	
		  }
	      
	    })
	    .error(function(err){
	  	  deferred.reject();
	    });

		return deferred.promise;
	};

	auth.loadSession = function(data){ //username, password
		localStorageService.set('user', {
			id: data.id,
			name: data.name,
			token: data.token
		});
	};

	auth.logout = function(){				
		return $http.post(apiUrl+'loginServicio/logout',{})
	      .success(function(response, status){
	      	$log.debug("logout: ", response, "status", status);	   		  
	      	
	      	localStorageService.remove('user', 'solicitud', 'userBasicData', 'solicitud', 'resetPasswordCredentials', 'facebookData');
			
			$rootScope.$emit('unloadUserSesion');  			
	    }, function(err){
	    	$log.error("logout: ", err);	   		  

	    	localStorageService.remove('user', 'solicitud', 'userBasicData', 'solicitud', 'resetPasswordCredentials', 'facebookData');
			
			$rootScope.$emit('unloadUserSesion');
	    });
	};

	auth.currentUser = function(){
		return localStorageService.get('user');
	};

	auth.isLoggedIn = function(){
		return !_.isUndefined(localStorageService.get('user')) && !_.isNull(localStorageService.get('user')) && !_.isEmpty(localStorageService.get('user'));
	};

	function registerToken(){
		if(isAndroid()){

		}else if(isIos()){
			//window.FirebasePlugin.grantPermission();
		}

		/* //TODO: Habilitar para cuanod se integré firebase
		window.FirebasePlugin.onTokenRefresh(function(token) {
		    $log.log("Token: ", token);

		    tokenService.sendToken(auth.currentUser().id, token).then(function(resp){
		    	$log.log("tokenService.sendToken: ", resp);
		    }, function(err){
		    	$log.error("tokenService.sendToken: ", err);
		    });

		}, function(error) {
		    $log.error(error);
		});
		*/
	}

	function isAndroid(){
		return deviceDetector.raw.os.android;
	}

	function isIos(){
		return deviceDetector.raw.os.ios;
	}

	return auth;
}]);