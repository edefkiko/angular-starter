'use strict';
angular.module('chat')
.factory('Chat', ['$log', 'commRest', 'commSocket', 'Reference', 'Room', '$q', 'utils', 'ChatNotificacion', 'Message', function($log, commRest, commSocket, Reference, Room, $q, utils, ChatNotificacion, Message){

	function Chat(user, $rooms, $currentRoom){
	    this.reference = new Reference(user);
	    this.rooms = $rooms;
	    this.currentRoom = $currentRoom;
	    this.notificacion = ChatNotificacion;
	}

	Chat.prototype.init = function(){
		var self = this;
		var deferred = $q.defer();

		self.reference.validate().then(function(){

			var room;

	    	if(! self.reference.isAgent()){

	    		room = new Room(self.reference);

		    	room.register().then(function(){
	    			room.join(self.reference.getId()).then(function(){

		    			self.rooms.push(room);
		    			deferred.resolve();
		    		});
		    	});
	    	}else{
	    		deferred.resolve();
	    	}


	    });

		return deferred.promise;
	};

	Chat.prototype.join = function(roomId){
		var self = this;
		var deferred = $q.defer();

		self.reference.joinToRoom(roomId).then(function(){

			deferred.resolve();

		});

		return deferred.promise;
	};

	Chat.prototype.redirectToAgent = function(agent){
		var self = this;
		var deferred = $q.defer();

		var agentRef = new Reference(agent);

		$log.debug("redirectToAgent->agentRef: ", self.currentRoom.getName(), "-> to ->", agentRef.getId());

		var roomToLeft = _(self.currentRoom).clone();

		self.closeChat(roomToLeft.getId()).then(function(){

			roomToLeft.join(agentRef.getId()).then(function(){

				commSocket.emit('join', {room: roomToLeft.getId(), reference: agentRef.getId()}, function(){
					roomToLeft = null;

					deferred.resolve();
				});

			});

		});

		return deferred.promise;
	};

	Chat.prototype.login = function(){
		var self = this;
		var deferred = $q.defer();

		var data = {
	    	reference: self.reference.getId()
	    };

	    if(! self.reference.isAgent()){
	    	data.room = self.reference.getId()
	    }

	    commSocket.emit('login', data, function(ackData){
	        $log.debug("login -> ackData: "+JSON.stringify(ackData));
	        deferred.resolve();
	    });
	    return deferred.promise;
	};

	Chat.prototype.conectToRooms = function(){
		var self = this;
		var deferred = $q.defer();

		self.reference.getRoomsOfReference().then(function(rooms){
			_(rooms).each( function( room ) {

				if(_(1).isEqual(room.state.id)){ // 1: Sala abierta

					var roomModel = new Room(undefined, room);

					self.conectToRoom(roomModel);

				}

			});

			deferred.resolve();

		});

	    return deferred.promise;
	};

	Chat.prototype.conectToRoom = function(roomModel){
		var self = this;

		if( !self.existRoom(roomModel) ){
			self.rooms.push(roomModel);
		}

		commSocket.emit('join', {room: roomModel.getId(), reference: self.reference.getId()}, function(ackData){

		});

	};

	Chat.prototype.existRoom = function(roomModel){
		var self = this;

  		var room = _(self.rooms).find( function(item) {

  			if(_(roomModel.getId()).isEqual(item.getId())){
  				return item;
  			}

  		});

  		return !_(room).isEmpty();
	};

	Chat.prototype.joinUserToRoom = function(userRoom){
		var self = this;
		var room = new Room(new Reference({externalId:userRoom}));

		room.loadOwnerRoom().then(function(){
			room.join(self.reference.getId()).then(function(){
				self.conectToRoom(room);

				self.setCurrentChat(room.getId());
			});
		});

	};

	Chat.prototype.send = function(msg, callback){

		var data = {
          uuid: utils.guid(),
          reference: this.reference.getId(),
          room: this.currentRoom.getId(),
          type: 0,
          value: msg
        };

        commSocket.emit('message', data, callback);

        data.createAt = new Date();
        this.currentRoom.messages.push(Message.create(data));
	};

	Chat.prototype.onMessage = function(msg){
		commSocket.emit('messageRead', msg);

		var room = this.getRoomById(msg.room);

		if(! _(room.getId()).isEqual(this.currentRoom.getId())){
			room.hasMessage = true;
		}

		msg.createAt = new Date();
        room.messages.push(Message.create(msg, true));
	};

	Chat.prototype.onMessageRead = function(msg){
		var room = this.getRoomById(msg.room);

		_.find(room.messages, function(message){
	        if(_.isEqual(message.uuid, msg.uuid)){
	          message.status = 3;
	        }
	    });
	};

	Chat.prototype.setCurrentChat = function(roomId){
		var self = this;
		var room = self.getRoomById(roomId);
        _(self.currentRoom).extend(room);

        if(_(self.currentRoom.messages).size() < 1){
        	self.loadMessages().then(function(){
        		if(_(self.currentRoom.messages).size() > 1){
		        	self.currentRoom.messages.push(Message.create({type:{id:"SEPARATOR"}}));
		        }
        	});
        }
	};

	Chat.prototype.closeChat = function(roomId){
		var self = this;
		var deferred = $q.defer();

		var index = _(self.rooms).indexOf(self.getRoomById(roomId));

		if(!_(self.currentRoom).isEmpty() && _(roomId).isEqual(self.currentRoom.getId())){
			//$log.debug('closeChat -> this.currentRoom', self.currentRoom.room);
			self.currentRoom.room = {};
			self.currentRoom.messages.length = 0;
		}


		if(self.reference.isAgent()){
			self.rooms[index].left(self.reference.getId()).then(function(){

				commSocket.emit('leave', {room: roomId, reference: self.reference.getId()}, function(ackData){

		    		self.rooms.splice(index, 1);
					deferred.resolve();
		    	});

			});
		}else{
			deferred.resolve();
		}

		return deferred.promise;
	};

	Chat.prototype.referenceLeftRoom = function(reference){
		var self = this;
		if(! _(reference).isEmpty()){
			self.currentRoom.messages.push(self.notificacion.create("[" + reference.externalId + "] dejó la conversación...!!!"));
      	}

	};

	Chat.prototype.getRoomById = function(roomId){

        return _(this.rooms).find( function(item) {

  			if(_(roomId).isEqual(item.getId())){
  				return item;
  			}
  		});

	};


	Chat.prototype.loadMessages = function(){
		var self = this;
		var deferred = $q.defer();
		return commRest.getPackagesOfRoom(self.currentRoom.getId()).then(function(result){
			//$log.log('result', result);
	        _.map(result, function(item){
	        	//$log.log('item', item);
	        	var msg = Message.create(item);
	        	msg.status = {};
	            self.currentRoom.messages.push(msg);
	        });

	        deferred.resolve();

      	});

      	return deferred.promise;
	};

	Chat.prototype.userJoined = function(data){
		var self = this;

		//var room = self.getRoomById(data.room);
		if(!_(self.currentRoom).isEmpty() && _(data.room).isEqual(self.currentRoom.getId())){
			if(_(self.reference.getId()).isEqual(data.reference.externalId)){
		        self.currentRoom.messages.push(self.notificacion.create("¡Hola, bienvenido a nuestro chat, ¿En qué podemos ayudarte?"));
	      	}else{
	        	self.currentRoom.messages.push(self.notificacion.create("[" + data.reference.externalId + "] se unió a la conversación...!!!"));
	      	}
      	}else{
      		self.reference.getRoomsOfReference().then(function(rooms){
				_(rooms).each( function( room ) {

					if(_(1).isEqual(room.state.id)){ // 1: Sala abierta

						var roomModel = new Room(undefined, room);

						if( !self.existRoom(roomModel) ){
							self.rooms.push(roomModel);
						}

					}

				});

			});
      	}

	};

	Chat.prototype.userLeft = function(user){
		var self = this;

		if( !_(self.reference.getId()).isEqual(user.externalId)){
	        this.currentRoom.messages.push(self.notificacion.create("[" + user.externalId + "] se dejó la conversación...!!!"));
      	}

	};

	Chat.prototype.getReferenceId = function(){
		var self = this;

		return self.reference.getId();

	};


	Chat.prototype.removeAllListeners = function(data, callback){
		 commSocket.removeAllListeners();
	};



	return Chat;
}]);