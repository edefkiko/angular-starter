'use strict'
angular.module('solicitudPrestamo')
.factory('contratacionService', ['$http', '$q', 'EnvironmentConfig', 'mambuUtil',  function($http, $q, EnvironmentConfig, mambuUtil){
  var apiUrl = EnvironmentConfig.backend + '/rest/mambuServicio/';
  
  var SUCCESS_CODE = 200;
  var OK_CODE = 201;

  function validResponse(deferred, response, status){
    if((_(SUCCESS_CODE).isEqual(status) || _(OK_CODE).isEqual(status))  && _(response.errorSource).isEmpty()){
      deferred.resolve(response);  
    } else{
      
      deferred.reject(response);  
      
    }
  }

  return{
    actualizaContratacion:  function(clientId, datosContratacion){
     var deferred = $q.defer();

     $http({ method: 'POST', url: apiUrl, params: {path: 'clients/'+clientId + "/documents"}, data: datosContratacion})
        .success(function(response, status){
          console.info('===actualizaContratacion->success:'+JSON.stringify(response));
          
          validResponse(deferred, response, status);

        })
        .error(function(err){
          console.info('===error:'+JSON.stringify(err));
          deferred.reject(err);
        });

      return deferred.promise;
    }
  };

}]);
