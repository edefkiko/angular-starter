'use strict'
app.factory('buroCreditoService', function($http, $q, EnvironmentConfig){
  //var apiUrl = EnvironmentConfig.backend + '/rest/buroCreditoServicio/consulta';
  return{
    buroService:function(){
      // $log.log("el correo es: ", correo);
      return true;
      // var deferred = $q.defer();
      //
      // $http.post(apiUrl,{}, config, config.headers)
      // .success(function(response, status){
      //   deferred.resolve(response);
      // })
      // .error(function(err){
      //   deferred.reject(err);
      // });
      //
      // return deferred.promise;
    }

  };
})
.factory('listaNegraService', function($http, $q, EnvironmentConfig){
  //var apiUrl = EnvironmentConfig.backend + '/rest/listaNegraServicio';
  return{
    listaService:function(){
      return false;
      // var deferred = $q.defer();
      //
      // $http.post(apiUrl,{}, config, config.headers)
      // .success(function(response, status){
      //   deferred.resolve(response);
      // })
      // .error(function(err){
      //   deferred.reject(err);
      // });
      //
      // return deferred.promise;
    }

  };
})
.factory('semillaService', function($http, $q, EnvironmentConfig){
  var apiUrl = EnvironmentConfig.backend + '/rest/semillaServicio/consulta';
  return{
    getSemilla:function(){
      var deferred = $q.defer();

      $http.post(apiUrl,{}, config, config.headers)
      .success(function(response, status){
        //$log.debug('===consultaDetalle->consulta->success:'+JSON.stringify(response));
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
    }

  };
});
