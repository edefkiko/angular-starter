'use strict'
angular.module('buscador')
.factory('incidenciaService', function($http, $q, EnvironmentConfig, $log, _){
  var apiUrl = EnvironmentConfig.backend + '/rest/incidencias/registrar';

  return{    
    registrar:function(incidencia){       
      var deferred = $q.defer();

      $http.post(apiUrl,incidencia)
      .success(function(response, status){

        if(_("0").isEqual(response.resultado)){
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

  };
});

    