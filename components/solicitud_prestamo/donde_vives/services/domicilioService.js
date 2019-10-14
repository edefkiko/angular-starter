'use strict'
angular.module('solicitudPrestamo')
.factory('domicilioService', ['$http', '$q', 'EnvironmentConfig', 'mambuUtil',  function($http, $q, EnvironmentConfig, mambuUtil){
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
    actualizaDireccion:  function(clientId, domicilio){
     var deferred = $q.defer();

     $http({ method: 'PATCH', url: apiUrl, params: {path: 'clients/'+clientId + "/custominformation"}, data: domicilio})
        .success(function(response, status){
          //console.info('===actualizaDireccion->success:'+JSON.stringify(response));
          validResponse(deferred, response, status);
        })
        .error(function(err){
          //console.info('===error:'+JSON.stringify(err));
          deferred.reject(err);
        });

      return deferred.promise;
    }
  };

}]);
