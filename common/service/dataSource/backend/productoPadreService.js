'use strict'
app.factory('productoPadreService', function($http, $q, EnvironmentConfig, $log, localStorageService, _){
  var apiBackendUrl = EnvironmentConfig.backend + '/rest/';

  var SUCCESS_CODE = 200;
  var OK_CODE = 201;

  return{
    consulta:function(){
      var deferred = $q.defer();
      
      var productoPadre = localStorageService.get('productoPadre');
      if(_(productoPadre).isNull()){

        $http({ method: 'POST', url: apiBackendUrl+ 'productoPadreServicio/consulta', data: {}})
        .success(function(response, status){
          $log.debug('===productoPadreService->consulta->success:',response);
          if(response  && _("0").isEqual(response.resultado)){
            localStorageService.set('productoPadre', response);
            deferred.resolve(response);   
          }else{
            deferred.reject(response ? response.mensajeOperacion: null);
          }                     
        })
        .error(function(err){
          $log.error('===error:'+JSON.stringify(err));
          deferred.reject(err);
        });

      }else{
        deferred.resolve(productoPadre);
      }
          
      return deferred.promise;
    },
    consultaDetalle:function(productos){
      var deferred = $q.defer();
      var productoPadreDetalle = localStorageService.get('productoPadreDetalle');

      if(_(productoPadreDetalle).isNull()){

        $http({ method: 'POST', url: apiBackendUrl+ 'productoServicio/consulta', data: {productos:productos} })
          .success(function(response, status){
            //$log.debug('===consultaDetalle->consulta->success:',response);  

           if(_(SUCCESS_CODE).isEqual(status) || _(OK_CODE).isEqual(status)  && _(response.errorSource).isEmpty()){
              localStorageService.set('productoPadreDetalle', response);
              deferred.resolve(response);  
            } else{
              
              deferred.reject(response);  
              
            }
                          
          })
          .error(function(err){
            $log.error('===error:'+JSON.stringify(err));
            deferred.reject(err);
          });
      }else{
        deferred.resolve(productoPadreDetalle);
      }
      
      
      return deferred.promise;
    }
  };
});
