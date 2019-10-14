'use strict';
app.factory('userService', ['$http', '$q', 'EnvironmentConfig', 'localStorageService', '_', function($http, $q, EnvironmentConfig, localStorageService, _){
  var apiUrl = EnvironmentConfig.backend + '/rest/usuarioServicio/';
  //var apiUrl = EnvironmentConfig.backend + '/rest/catalogoServicio';
  var config = {
                headers : {
                    'Content-Type': 'application/json'
                }
          };
  var SUCCESS_CODE = 200;
  var OK_CODE = 201;

  return{
    getUser:function(userId){
      var deferred = $q.defer();
      
      $http({ method: 'GET', url: apiUrl, params:{path:'users/' + userId}, data:{}})
        .success(function(response, status){
        
          if(_(SUCCESS_CODE).isEqual(status) || _(OK_CODE).isEqual(status)  && _(response.errorSource).isEmpty()){
            deferred.resolve(response);  
          } else{
            
            deferred.reject(response);  
            
          }

        })
        .error(function(err){
          deferred.reject(err);
        });      

      return deferred.promise;
    }

  };
}]);
