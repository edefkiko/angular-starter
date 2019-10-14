'use strict'
angular.module('datosPersonales')
.factory('emailService', function($http, $q, EnvironmentConfig){
  var apiUrl = EnvironmentConfig.backend + '/rest/registroServicio/registroConfirmacion';
  return{
    sendConfirmation:function(canal){
      var deferred = $q.defer();
      $http({ method: 'POST', url: apiUrl, data: {canal: canal}})
      .success(function(customField, status){
        console.info('===success:'+JSON.stringify(customField));
      
        deferred.resolve(customField);
      })
      .error(function(err){
        console.info('===error:'+JSON.stringify(err));
        deferred.reject(err);
      });
      
      return deferred.promise;
    }
  };
});
