'use strict'
app.factory('catalogoService', function($http, $q, EnvironmentConfig, $log, _){
  var apiBackendUrlCatalogo = EnvironmentConfig.backend + '/rest/catalogoServicio';
  var apiBackendUrlDescripcion = EnvironmentConfig.backend + '/rest/ayudaServicio/consultaAyuda';

  return{
    ejecutaConslta:function(catalogo,filtroDescripcion){
      var deferred = $q.defer();

      $http({ method: 'POST', url: apiBackendUrlCatalogo, data: {catalogo:catalogo, filtroDescripcion:filtroDescripcion}})
          .success(function(response, status){
            if(!_(response).isEmpty() && response.resultado === '0'){
              deferred.resolve(response.catalogo);
            }else{
              deferred.reject(response.mensajeOperacion);
            }                 
          })
          .error(function(err){
            $log.error('===error:'+JSON.stringify(err));
            deferred.reject(err);
          });
      
      return deferred.promise;
    },

  
    ejecutaConsltaDescripcion:function(identificador){
      var deferred = $q.defer();

      $http({ method: 'POST', url: apiBackendUrlDescripcion, data: {identificador:identificador}})
          .success(function(response, status){
            //$log.log('response', response);
            if(!_(response).isEmpty() && response.resultado === '0'){
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