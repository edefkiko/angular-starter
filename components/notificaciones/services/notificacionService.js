'use strict'
angular.module('notificaciones')
.factory('notificacionService', function($http, $q, EnvironmentConfig, $log, _){
  var apiUrl = EnvironmentConfig.backend + '/rest/notificacionesServicio';

  return{    
    consultar:function(idCliente){       
      var deferred = $q.defer();

      $http.post(apiUrl + '/consultar/consultarNotificacionesCliente', {idCliente: idCliente})
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
    },
    consultaDetalle:function(idNotificacion){       
      var deferred = $q.defer();

      $http.post(apiUrl + '/consultar/consultarDetalleNotificacion', {idNotificacion: idNotificacion})
      .success(function(response, status){

        if(_("0").isEqual(response.resultado)){
          deferred.resolve(response.notificacion);
        }else{
          deferred.reject(response.mensajeOperacion);
        }   
      })
      .error(function(err){
        deferred.reject(err);
      });
      
      return deferred.promise;
    },
    actualizar:function(notificacion){       
      var deferred = $q.defer();

      $http.post(apiUrl + '/actualizar/actualizaNotificacion', {notificacion: notificacion})
      .success(function(response, status){

        if(_("0").isEqual(response.resultado)){
          deferred.resolve(response.notificacion);
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
