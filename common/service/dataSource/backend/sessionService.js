'use strict'
app.factory('sessionService', function($http, $q, EnvironmentConfig, $log, _){
  var apiBackendUrl = EnvironmentConfig.backend + '/rest/sesionServicio';

  return{
    sesionServicio:function(){
      var deferred = $q.defer();

      $http({ method: 'GET', url: apiBackendUrl, data: {}})
          .success(function(response, status){
            //$log.debug('===sesionServicio->consulta->success:'+JSON.stringify(response));
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
