'use strict'
app.factory('productoRenovacionService', function($http, $q, EnvironmentConfig, $log, localStorageService, _){
  var apiBackendUrl = EnvironmentConfig.backend + '/rest/procesos/renovacion';


  return{
    consulta: function(idCliente){
      var deferred = $q.defer();
      
      $http({ method: 'POST', url: apiBackendUrl, data: {idCliente: idCliente}})
      .success(function(response, status){
        $log.debug('===productoPadreService->consulta->success:',response);
        if(_("0").isEqual(response.resultado)){
          deferred.resolve(response);   
        }else{
          deferred.reject(response.mensajeOperacion);
        }                     
      })
      .error(function(err){
        $log.error('===error:'+JSON.stringify(err));
        deferred.reject(err);
      });
          
      return deferred.promise;
    }
  };
});
