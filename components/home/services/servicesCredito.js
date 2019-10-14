'use strict'
angular.module('home')
.factory('homeServices', function($http, $q, EnvironmentConfig, $log, _){
  var apiUrl = EnvironmentConfig.backend + '/rest/';
  return{    
    getEstadoDeCuenta:function(){       
      var deferred = $q.defer();

      $http.post(apiUrl+'estadoCuentaServicio/',{})
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
    }

  };
})
.factory('barcodeService', function($http, $q, EnvironmentConfig){
  var apiUrl = EnvironmentConfig.backend + '/rest/codigoBarrasServicio';
  return{
    getBase64Image:function(numeroCredito, monto){
      // $log.log("el correo es: ", correo);
      var deferred = $q.defer();

      $http.post(apiUrl,{numeroCredito: numeroCredito, monto: monto})
      .success(function(response, status){
        if(response.resultado === "0"){
          deferred.resolve("data:image/png;base64,"+response.attachment+"");  
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

    