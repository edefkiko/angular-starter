app.service('AuthInterceptor', function(localStorageService, $q, $injector, $exceptionHandler, _, $rootScope, EnvironmentConfig) {
    var service = this;
    
    var UNAUTHORIZED_CODE = "2";

    service.request = function(config) {          
        var currentUser = localStorageService.get('user');
        var access_token = currentUser ? currentUser.token : null;
        var idUsuario = currentUser ? currentUser.id : null;

        $injector.get('Idle').watch(); 

        if (access_token) {
            config.headers["TOKEN"] = access_token;
            config.headers["USUARIO"] = idUsuario;                    
        }
        config.headers["Content-Type"] = 'application/json';
        config.headers["CANAL"] = "FRONT";        
        
        return config;
    };

    service.response = function(response) {
        var deferred = $q.defer();
        var currentUser = localStorageService.get('user');
        
        $injector.get('Idle').watch();   

        if (!_(currentUser).isEmpty() && !_(response.data).isEmpty()  && _(UNAUTHORIZED_CODE).isEqual(response.data.resultado)) {
            var message = "¡Debido al periodo de inactividad se ha cerrado tu sesión!"; 

            if(!_(response.data.mensajeOperacion).isEmpty()){
                message = response.data.mensajeOperacion;
            }
            
            $rootScope.logoutAndLogin(message);            
        }else{
            deferred.resolve(response);
        }

        return deferred.promise;
    };
     
    service.responseError = function(response) {    
        $injector.get('Idle').watch(); 
        
        switch (response.status) {
            case 401:
                if(_(true).isEqual(EnvironmentConfig.isMobile)){
                    $injector.get('$state').transitionTo('loginApp');
                }else{
                    $injector.get('$state').transitionTo('login');
                }
            break;
            case 501:
            case 606:            
            break;               
            case -1:
                $injector.get('$state').transitionTo('maintenance');
            break;        
            default:
                $exceptionHandler("Hubo un problema con la petición HTTP: " + JSON.stringify(response.config) + ". Status: " + response.status);
        }
                
        return response;
    };    
})