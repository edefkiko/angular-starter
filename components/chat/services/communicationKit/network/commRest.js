angular.module('communicationKit')
.factory('commRest', function($http, $q, EnvironmentConfig, _){
  var apiUrl = EnvironmentConfig.rest + '/communicationKit';
  var CODE_OK = 200;

  return{
    registerReference: function(user){
      var deferred = $q.defer();
      
      $http.put(apiUrl+'/reference', {reference: user.externalId, rol: user.rolId}).success(function(response, status){
        if(_(CODE_OK).isEqual(status)){
          deferred.resolve(response.data);
        }else{
          deferred.reject(response);
        }
      }).error(function(err){
        //console.error("chatService->registerReference->status->err:" + JSON.stringify(err));
        deferred.reject(err);
      });
      
      return deferred.promise;
    },
    registerRoom: function(room){
      var deferred = $q.defer();          
      $http.put(apiUrl+'/room', room).success(function(response, status){
        if(_(CODE_OK).isEqual(status)){
          deferred.resolve(response.data);
        }else{
          deferred.reject(response);
        }
      }).error(function(err){
        //console.error("chatService->registerRoom->status->err:" + JSON.stringify(err));
        deferred.reject(err);
      });
      
      return deferred.promise;
    },
    getRoomByName: function(room){
      var deferred = $q.defer();          
      $http.post(apiUrl+'/room/name', {room:room}).success(function(response, status){
        if(_(CODE_OK).isEqual(status)){
          deferred.resolve(response.data);
        }else{
          deferred.reject(response);
        }
      }).error(function(err){
        //console.error("chatService->registerRoom->status->err:" + JSON.stringify(err));
        deferred.reject(err);
      });
      
      return deferred.promise;
    },
    join: function(reference, room){
      var deferred = $q.defer();          
      $http.put(apiUrl+'/room/join', {reference: reference, room: room}).success(function(response, status){
        if(_(CODE_OK).isEqual(status)){
          deferred.resolve(response.data);
        }else{
          deferred.reject(response);
        }
      }).error(function(err){
        //console.error("chatService->joinRoom->status->err:" + JSON.stringify(err));
        deferred.reject(err);
      });
      
      return deferred.promise;
    },
    left: function(reference, room){
      var deferred = $q.defer();          
      $http.post(apiUrl+'/room/left', {reference: reference, room: room}).success(function(response, status){
        if(_(CODE_OK).isEqual(status)){
          deferred.resolve(response.data);
        }else{
          deferred.reject(response);
        }
      }).error(function(err){
        //console.error("chatService->left->status->err:" + JSON.stringify(err));
        deferred.reject(err);
      });
      
      return deferred.promise;
    },
    getUsersOfRoom: function(room){
      var deferred = $q.defer();          
      $http.post(apiUrl+'/room/references', {room:room.id}).success(function(response, status){  
        if(_(CODE_OK).isEqual(status)){
          deferred.resolve(response.data);
        }else{
          deferred.reject(response);
        }
      }).error(function(err){
        //console.error("chatService->getUsersOfRoom->status->err:" + JSON.stringify(err));
        deferred.reject(err);
      });
      
      return deferred.promise;
    },
    getRoomsOfReference: function(reference){
      var deferred = $q.defer();          
      $http.post(apiUrl+'/reference/rooms', {reference:reference}).success(function(response, status){      
        if(_(CODE_OK).isEqual(status)){
          deferred.resolve(response.data);
        }else{
          deferred.reject(response);
        }
      }).error(function(err){
        //console.error("chatService->getRoomsOfReference->status->err:" + JSON.stringify(err));
        deferred.reject(err);
      });
      
      return deferred.promise;
    },
    validateReference: function(reference){
      var deferred = $q.defer();
      
      $http.post(apiUrl+'/reference/validate', {reference: reference}).success(function(response, status){
        if(_(CODE_OK).isEqual(status)){
          deferred.resolve(response.data);
        }else{
          deferred.reject(response);
        }
        
      }).error(function(err){
        //console.error("chatService->validateReference->status->err:" + JSON.stringify(err));
        deferred.reject(err);
      });
      
      return deferred.promise;
    },
    getPackagesOfRoom: function(roomId){
      var deferred = $q.defer();          
      $http.post(apiUrl+'/room/packages', {room: roomId}).success(function(response, status){
        if(_(CODE_OK).isEqual(status)){
          deferred.resolve(response.data);
        }else{
          deferred.reject(response);
        }
      }).error(function(err){
        //console.error("chatService->getPackagesOfRoom->status->err:" + JSON.stringify(err));
        deferred.reject(err);
      });
      
      return deferred.promise;
    },
    getAllReferences: function(){
      var deferred = $q.defer();          
      $http.post(apiUrl+'/reference/all', {}).success(function(response, status){ 
        if(_(CODE_OK).isEqual(status)){
          deferred.resolve(response.data);
        }else{
          deferred.reject(response);
        }
      }).error(function(err){
        //console.error("chatService->getAllReferences->status->err:" + JSON.stringify(err)); 
        deferred.reject(err);
      });
      
      return deferred.promise;
    }
  };
  
});