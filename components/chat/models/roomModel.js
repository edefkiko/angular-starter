'use strict';
angular.module('chat')
.factory('Room', ['$log', 'commRest', 'commSocket', '$q', function($log, commRest, commSocket, $q){
	
	function Room(reference, room){
   		this.owner = reference;
   		this.messages = [];
   		if(_(room).isEmpty()){
   			this.room = {} 
   		} else{
   		 	this.room = room;
   		}

		$log.debug('Chat -> room -> owner: ', this.owner);
	};

	function createRoomData(reference){

		return {
			reference: reference.getId(),
	        name: reference.getId(),
	        description: 'Sala privada de '+ reference.getId(),
	        type: 1 //private, 0 = public
		};
	}

	Room.prototype.validate = function(){
		var self = this;
		var deferred = $q.defer();

		$log.debug('Chat -> room -> getActivedRoom');
		commRest.getRoomsOfReference(self.owner.getId()).then(function(rooms){
		
			//$log.debug('Chat -> room -> getRoomsOfReference -> ', rooms);
			if(_(rooms).size() > 0){				
				var roomSelected = rooms[_(rooms).size() - 1 ];
				$log.debug('Chat -> room -> roomSelected -> ',  roomSelected);
				self.room = roomSelected;//Asignamos el último

				deferred.resolve();
			}else{
				deferred.reject();
			}

		}, function(err){
			$log.error('Chat -> room -> getRoomsOfReference -> ',  err);
		});		

		return deferred.promise;	

	};

	Room.prototype.register = function(){
		var self = this;
		var deferred = $q.defer();

		$log.debug('Chat -> room -> registerRoom');
		commRest.registerRoom(createRoomData(self.owner)).then(function(room){
			$log.debug('Chat -> room -> registered Room -> ',  room);
			self.room = room;

			deferred.resolve();
		});

		return deferred.promise;	

	};

	Room.prototype.loadOwnerRoom = function(){
		var self = this;
		var deferred = $q.defer();

		
		commRest.getRoomByName(self.owner.getId()).then(function(room){
			
			$log.debug('Chat -> room -> getRoomByName', room);
			
			self.room = room;

			deferred.resolve();

		}, function(err){
			$log.error('Chat -> room -> getRoomByName -> ',  err);
		});		

		return deferred.promise;	

	};

	Room.prototype.join = function(reference){
		var self = this;
		var deferred = $q.defer();

		commRest.join(reference, self.getId()).then(function(){
			$log.debug('Chat -> room -> joined ');
			deferred.resolve();
        }, function(err){        
	    	$log.error('Chat -> room -> err -> ',  err);

	    	if(!_(err).isEmpty() && !_(err.error).isEmpty() && _('ERROR_JOIN_ROOM_DUPLICATED').isEqual(err.error.value)){

	    		$log.debug('Chat -> room -> joinedToRoom ', 'Reference:',reference, ' Room:', self.getId());

	    		//commSocket.emit('join', {room: self.getId(), reference: reference}, function(ackData){
		    		deferred.resolve();
		    	//});	
	    	}      	    	
	    });
		/*commRest.getRoomByName(roomName).then(function(room){
			$log.info('Chat -> room -> getRoomByName ', room);
			self.room = room;
			
			commRest.join(reference, self.getId()).then(function(){
				$log.info('Chat -> room -> joined ');
				deferred.resolve();
	        }, function(err){              
	        	$log.error('Chat -> room -> err -> ',  err);
	        });

		}, function(err){
			$log.error('Chat -> room -> getRoomByName -> ',  err);
		});*/			

		return deferred.promise;	
	};

	Room.prototype.left = function(reference){
		var self = this;
		var deferred = $q.defer();

		commRest.left(reference, self.getId()).then(function(){
			$log.debug('Chat -> room -> left ');
			deferred.resolve();
        }, function(err){        
	    	$log.error('Chat -> room -> err -> ',  err);    	    	
	    });

		return deferred.promise;	
	};

	Room.prototype.getId = function(){
		var self = this;
		
		if(self.room){
			return self.room.id;
		}else{
			return;
		}
	}

	Room.prototype.getName = function(){
		var self = this;
		
		if(self.room){
			return self.room.name;
		}else{
			return;
		}
	}

	return Room;
}]);