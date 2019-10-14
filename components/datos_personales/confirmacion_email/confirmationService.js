'use strict'
angular.module('datosPersonales')
.factory('confirmationService', ['$http', '$q', 'EnvironmentConfig',  function($http, $q, EnvironmentConfig){
  var apiUrl = EnvironmentConfig.backend + '/rest/registroServicio/verificaRegistroConfirmacion';

  return{
     verificaCodigo:  function(canal, codigo){
     var deferred = $q.defer();

     $http({ method: 'POST', url: apiUrl, data: {canal: canal, codigo: codigo}})
        .success(function(response, status){
          console.info('===verificaCodigo->success:'+JSON.stringify(response));
          if(response.resultado === '0'){
            deferred.resolve(response.mensajeOperacion);   
          }else{
            deferred.reject(response.mensajeOperacion);
          }
         
        })
        .error(function(err){
          console.info('===error:'+JSON.stringify(err));
          deferred.reject(err);
        });
      
      return deferred.promise;
    }
  };

}]);
