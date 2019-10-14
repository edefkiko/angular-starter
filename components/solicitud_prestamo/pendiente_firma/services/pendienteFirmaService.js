angular.module('solicitudPrestamo')
.factory('pendienteFirmaService', ['ngDialog', '$http', '$q', 'EnvironmentConfig', 'mambuUtil', 'CLIENT_STATUS', 'StatusService', '$state', '$log', 'LoginService' , function(ngDialog, $http, $q, EnvironmentConfig, mambuUtil, CLIENT_STATUS, StatusService, $state, $log, LoginService){
  var apiUrl = EnvironmentConfig.backend + '/rest/mambuServicio/';
  var SUCCESS_CODE = 200;

  return{
    autorizarFirma: function(idUsuario, password){
      var deferred = $q.defer();

      $http({ method: 'GET', url: apiUrl, params: {path: 'customfields/Contrasena_Clientes'}, data: ''})
        .success(function(customField, status){
          var encondedKey = customField.encodedKey;
          $http({ method: 'POST', url: apiUrl, params: {path: 'clients/search/'}, data:''})        
          .success(function(response, status){
            $log.debug("usuario: ", response, "status", status);  
            
            if(_(SUCCESS_CODE).isEqual(status) || _(OK_CODE).isEqual(status)  &&  !_(response).isEmpty() && response.resultado === '0'){
              if(response.length === 1){                
                deferred.resolve(response);
              }else{
                deferred.reject("Contraseña incorrecta");
                 
              } 
            } else{
              
              deferred.reject(usuarios);  
              
            }   
            
        }).error(function(err){
          deferred.reject();
        });
        
      }).error(function(err){
        deferred.reject();
      });
      return deferred.promise;
    }
  };

}]);