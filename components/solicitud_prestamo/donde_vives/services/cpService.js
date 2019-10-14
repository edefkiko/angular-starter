'use strict'
angular.module('solicitudPrestamo')
.factory('cpService', ['$http', '$q', 'EnvironmentConfig', 'mambuUtil', '$log',  function($http, $q, EnvironmentConfig, mambuUtil,$log){
  var apiUrl = EnvironmentConfig.backend + '/rest/catalogoServicio';
  
  return{
    codigoPostalService:  function(catalogo, filtro){
     var deferred = $q.defer();

     $log.info('apiUrl', apiUrl);
     $http({ method: 'POST', url: apiUrl, data: {
        catalogo: catalogo,
        filtroCodigo: filtro
       }
     }).success(function(response, status){
        $log.info('===codigoPostalService->success:'+JSON.stringify(response));
        if(response && response.resultado === '0'){
          deferred.resolve(response.catalogo);
        }else{
          deferred.reject(response.mensajeOperacion);
        }
        
      })
      .error(function(err){
        $log.info('===error:'+JSON.stringify(err));
        deferred.reject(err);
      });

      return deferred.promise;
    }
  };

}]);