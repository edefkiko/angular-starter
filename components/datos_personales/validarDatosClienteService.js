'use strict'
angular.module('datosPersonales')
.factory('validarDatosClienteService', function($http, $q, EnvironmentConfig, $log){
  var apiUrl = EnvironmentConfig.backend + '/rest/validaDatosCliente';
    return{
    validaDatosCliente:  function(email,telefono,curp,rfc){
     var deferred = $q.defer(); 
     $http({ method: 'POST', url: apiUrl, data: {
       mail: email,
       telefono: telefono,
       curp: curp,
       rfc: rfc
       }
     }).success(function(response, status){
        $log.info('===validarDatosClienteService->success:'+JSON.stringify(response));
        if(response && response.resultado === '0'){
          deferred.resolve(response);
        }else{
          deferred.reject(response.mensajeOperacion);
        }
        
      })
      .error(function(err){
        $log.info('===error:'+JSON.stringify(err));
        deferred.reject(err);
      });

      return deferred.promise;
    }
  };

});
