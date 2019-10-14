'use strict'
app.factory('motorRiesgoService', function($http, $q, EnvironmentConfig, $log, _){
  var apiBackendUrl = EnvironmentConfig.backend + '/rest/motorServicio';

  return{
    ejecutaMotor:function(request){
      var deferred = $q.defer();

      $http({ method: 'POST', url: apiBackendUrl, data: request})
          .success(function(response, status){
            //$log.debug('===ejecutaMotor->consulta->success:'+JSON.stringify(response));
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
