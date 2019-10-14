'use strict'
angular.module('home')
.factory('pagareServicio', function($http, $q, EnvironmentConfig, $log, _){
  var apiUrl = EnvironmentConfig.backend + '/rest/pagareServicio';
  return{    
    altaPagare:function(idCliente, idPrestamo){       
      var deferred = $q.defer();

      $http.post(apiUrl+'/altaPagare',{ idCliente: idCliente, idPrestamo: idPrestamo })
      .success(function(response, status){

        if(_("0").isEqual(response.resultado)){
          deferred.resolve(response.mensajeOperacion);
        }else{
          deferred.reject(response.mensajeOperacion);
        }   
      })
      .error(function(err){
        deferred.reject(err);
      });
      
      return deferred.promise;
    },
    consultaPagareCliente:function(idCliente, idPrestamo){       
      var deferred = $q.defer();

      $http.post(apiUrl+'/consultaPagare',{ idCliente: idCliente, idPrestamo: idPrestamo })
      .success(function(response, status){

        if(_("0").isEqual(response.resultado)){
          deferred.resolve(response.attachment);
        }else{
          deferred.reject(response.mensajeOperacion);
        }   
      })
      .error(function(err){
        deferred.reject(err);
      });
      
      return deferred.promise;
    },
    consultaDatosPagare:function(idCliente, idPrestamo){       
      var deferred = $q.defer();

      $http.post(apiUrl+'/consultaDatosPagare',{ idCliente: idCliente, idPrestamo: idPrestamo })
      .success(function(response, status){

        if( _("0").isEqual(response.resultado) && _(response.datosPagare).size() > 0 ){
          deferred.resolve(response.datosPagare);
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

    