'use strict'
angular.module('client')
.factory('solicitudService', function($http, $q, EnvironmentConfig, $log){
  var apiUrl = EnvironmentConfig.backend + '/rest/mambuServicio/';
  var SUCCESS_CODE = 200;
  var OK_CODE = 201;

  function validResponse(deferred, response, status){
    if((_(SUCCESS_CODE).isEqual(status) || _(OK_CODE).isEqual(status))  && _(response.errorSource).isEmpty()){
      deferred.resolve(response);  
    } else{
      
      deferred.reject(response);  
      
    }
  }
  return{
    updateCustomField:function(clientId, solicitud){    
      var deferred = $q.defer();
      $http({ method: 'PATCH', url: apiUrl, params: {path:'clients/'+clientId+'/custominformation/'}, data:solicitud})
      .success(function(response, status){
        validResponse(deferred, response, status);
      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },

    updateStatusCliente:function(clientId, solicitud){    
      var deferred = $q.defer();
      $http({ method: 'PATCH', url: apiUrl, params: {path:'clients/'+clientId+'/custominformation/'}, data:solicitud})
      .success(function(response, status){
        validResponse(deferred, response, status);
      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    
    create:function(clientId, solicitud){    
      var deferred = $q.defer();
      $http({ method: 'PATCH', url: apiUrl, params: {path:'clients/'+clientId+'/custominformation/'}, data:solicitud})
      .success(function(response, status){
        validResponse(deferred, response, status);
      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    
    getStatusCliente: function(clientId){ 
      var deferred = $q.defer();

      $http({ method: 'GET', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Estatus_Cliente'}, data:{}})
      .success(function(response, status){
        validResponse(deferred, response, status);
      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    }
  };

});
