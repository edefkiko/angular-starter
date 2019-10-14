'use strict'
angular.module('solicitudPrestamo')
.factory('contratacionIneService', ['$http', '$q', 'EnvironmentConfig', 'mambuUtil',  function($http, $q, EnvironmentConfig, mambuUtil){
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
    actualizaContratacion:  function(clientId, datosContratacionIne){
     var deferred = $q.defer();

     $http({ method: 'POST', url: apiUrl, params: {path: 'clients/'+clientId + "/documents"}, data: datosContratacionIne})
        .success(function(response, status){
          console.info('===actualizaContratacionIne->success:'+JSON.stringify(response));
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
