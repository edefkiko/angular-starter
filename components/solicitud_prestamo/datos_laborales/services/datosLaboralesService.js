'use strict'
var config = {
  headers : {
    'Content-Type': 'application/json'
  }
};
angular.module('solicitudPrestamo')
.factory('datosLaboralesService', ['ngDialog', '$http', '$q', 'EnvironmentConfig', 'mambuUtil', 'CLIENT_STATUS', 'StatusService', '$state', '$log', 'LoginService' , function(ngDialog, $http, $q, EnvironmentConfig, mambuUtil, CLIENT_STATUS, StatusService, $state, $log, LoginService){
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
    actualizaDatosLaborales:  function(clientId, laborales){
     var deferred = $q.defer();

     $http({ method: 'PATCH', url: apiUrl, params: {path: 'clients/'+clientId + "/custominformation"}, data: laborales})
        .success(function(response, status){
          console.info('===actualizaDireccion->success:'+JSON.stringify(response));
          
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
