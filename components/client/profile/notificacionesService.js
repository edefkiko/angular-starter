'use strict'
angular.module('profile')
.factory('notificacionesService', ['$http', '$q', 'EnvironmentConfig',  function($http, $q, EnvironmentConfig){
  var apiUrl = EnvironmentConfig.backend + '/rest/notificacionMensajeServicio/enviarNotificacion';

  return{
     enviarNotificacion:  function(clienteId, claveTipoMensaje){
     var deferred = $q.defer();

     $http({ method: 'POST', url: apiUrl, data: {clienteId: clienteId, claveTipoMensaje: claveTipoMensaje}})
        .success(function(response, status){
          console.info('===enviarNotificacion->success:'+JSON.stringify(response));
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
