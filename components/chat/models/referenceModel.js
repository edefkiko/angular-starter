'use strict';
angular.module('chat')
.factory('Reference', ['$log', 'commRest', 'commSocket', 'localStorageService', '$q', function($log, commRest, commSocket, localStorageService, $q){
	
	function Reference(reference){
		this.user = {};		
		if(_(reference).isNull()){
			
			var userStorage = localStorageService.get('anonymousUser');
			if(_(userStorage).isNull()){

				localStorageService.set('anonymousUser', createAnonymousUser());
				this.user = localStorageService.get('anonymousUser');
			}else{
				this.user = localStorageService.get('anonymousUser');
			}
		}else{			
			this.user = reference;	
		}
		//$log.debug('Chat -> Reference: ', this.user);
	};

	function createAnonymousUser(){
		var timestamp = new Date().getTime().toString();
		var externalId = 'anonimo_' + timestamp;
		
		$log.debug('Chat -> Reference -> createAnonymousUser: ', externalId);
		return {
			externalId: externalId,
			name: externalId,
			rolId: 0 //0 = default, 1 = operaciones
		}
	}
	
	Reference.prototype.validate = function(){
		var self = this;
		
		var deferred = $q.defer();
		
	   	commRest.validateReference(self.getId()).then(function(reference){
	   		
	   		$log.debug('Chat -> Reference ->  validatedReference -> reference', reference);	   	
	   		self.user = reference;

	   		deferred.resolve();	

	   	}, function(err){
	   		
	   		$log.info('Chat -> Reference ->  validateReference', err);
	   		$log.debug('Chat -> Reference ->  registerReference', self.user);

	   		commRest.registerReference(self.user).then(function(reference){	
	   			$log.debug('Chat -> Reference ->  registeredReference', reference);	
	   			
	   			self.user.externalId = reference;   		 		
	   			deferred.resolve();
		   	}, function(err){
		   		$log.error('Chat -> Reference ->  RegisterFail', err);		   		
		   	});
		   	
	   	});
		
		return deferred.promise;		
	};

	Reference.prototype.getRoomsOfReference = function(){
		var self = this;
		var deferred = $q.defer();
		
		commRest.getRoomsOfReference(self.getId()).then(function(rooms){

			$log.debug('Chat -> room -> getRoomsOfReference', rooms);
			deferred.resolve(rooms);

		}, function(err){
			$log.error('Chat -> room -> getRoomsOfReference -> ',  err);
		});		

		return deferred.promise;	

	};
	/*Reference.prototype.joinToRoom = function(userRoom){
		var self = this;		
		var deferred = $q.defer();
		commRest.join(self.getId(), userRoom).then(function(){

			$log.info('Chat -> Reference -> joinedToRoom ');
			commSocket.emit('join', {room: userRoom, reference: self.getId()}, function(ackData){
		    	deferred.resolve();
		    });	  

	    }, function(err){        
	    	$log.error('Chat -> Reference -> err -> ',  err);

	    	if(!_(err).isEmpty() && !_(err.error).isEmpty() && _('ERROR_JOIN_ROOM_DUPLICATED').isEqual(err.error.value)){

	    		$log.info('Chat -> Reference -> joinedToRoom ', userRoom, self.getId());
	    		commSocket.emit('join', {room: userRoom, reference: self.getId()}, function(ackData){
		    		deferred.resolve();
		    	});	
	    	}      	    	
	    });
		return deferred.promise;	
	}*/

	Reference.prototype.getId = function(){
		var self = this;
		
		if(self.user){
			return self.user.externalId;
		}else{
			return;
		}
	}

	Reference.prototype.isAgent = function(){
		var self = this;
		if(_(1).isEqual(self.user.rolId)){
			return true;
		}else{
			return false;
		}
	}

	return Reference;
}]);