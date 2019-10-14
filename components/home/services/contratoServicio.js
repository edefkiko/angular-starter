'use strict'
angular.module('home')
.factory('contratoServicio', function($http, $q, EnvironmentConfig, $log, _){
  var apiUrl = EnvironmentConfig.backend + '/rest/contratoCreditoServicio';
  return{    
    altaContratoCredito:function(idCliente, idPrestamo){       
      var deferred = $q.defer();

      $http.post(apiUrl+'/altaContratoCredito',{ idCliente: idCliente, idPrestamo: idPrestamo })
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
    consultaContratoCredito:function(idCliente, idPrestamo){       
      var deferred = $q.defer();

      $http.post(apiUrl+'/consultaContratoCredito',{ idCliente: idCliente, idPrestamo: idPrestamo })
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
    consultaDatosContratoCredito:function(idCliente, idPrestamo){       
      var deferred = $q.defer();

      $http.post(apiUrl+'/consultaDatosContratoCredito',{ idCliente: idCliente, idPrestamo: idPrestamo })
      .success(function(response, status){

        if( _("0").isEqual(response.resultado) && _(response.datosContratoCredito).size() > 0 ){
          deferred.resolve(response.datosContratoCredito[0]);
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

    