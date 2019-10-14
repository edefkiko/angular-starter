'use strict';
angular.module('chat')
.controller('chatController', ['$scope', 'Chat', 'LoginService', 'utils', '$log', '$rootScope', 'deviceDetector', function($scope, Chat, LoginService, utils, $log, $rootScope, deviceDetector){
  $scope.isMobile = deviceDetector.isMobile();

  $scope.connectedUsers=[];
  $scope.connectedOpUsers=[];

  $scope.rooms = [];
  $scope.currentRoom = {};
  var user = null;
  var chat = null;

  $rootScope.$on('initChat', function (event, user) {      
    $scope.openChat = true;
    $scope.maximizar = true;
    if(_(chat).isEmpty()){
      initChat(user);
    }else{
      chat.setCurrentChat(chat.rooms[0].getId());
    }
      
  });

  function initChat(user){
    chat = new Chat(user, $scope.rooms,  $scope.currentRoom);
    
    chat.init().then(function(){

      chat.login().then(function(){

        chat.conectToRooms($scope.rooms).then(function(){
            $scope.user = chat.reference;

            if(!chat.reference.isAgent()){              
              chat.setCurrentChat(chat.rooms[0].getId());    
            }else{
              $('header').hide();
              $('footer').hide();
            }
        });

      });  
    
    }); 

  };
  

  $scope.send = function(){

    if($scope.msg && $scope.msg !==''){
      chat.send($scope.msg, function(resp){
        $scope.msg = null;
      });
    }

  };

  $scope.closeChat = function(roomId){
    //console.debug("closeChat->roomId: ", roomId);
    chat.closeChat(roomId);
  };
  
  $scope.transferir = function(){
    //console.debug("transferir->$scope.selectedOpUser: ",  $scope.selectedOpUser);

    chat.redirectToAgent($scope.selectedOpUser).then(function(){
      $scope.addPerson = false;
    });
  };

  $scope.selectOpUser = function(opUser){
    $scope.selectedOpUser = opUser;
    //console.debug("selectOpUser->opUser: ", opUser);
  };

  $scope.closeWindowChat = function(){
    //console.debug("closeWindowChat->$scope.currentRoom.getId(): ", $scope.currentRoom.getId());
    $scope.openChat = false;

    $rootScope.$emit('closeChat');

    if(!_($scope.currentRoom).isEmpty()){
      chat.closeChat($scope.currentRoom.getId());
    }
  };

  $scope.setCurrentChat = function(roomId){
    console.debug("setCurrentChat->roomId: ", roomId);
    chat.setCurrentChat(roomId);    
  };
  
  $scope.joinUserToRoom = function(user){
    $scope.open = true;
    $log.debug('joinUserToRoom', user);
    
    //user.messageCount = 0;
    chat.joinUserToRoom(user.externalId);
  };
  
  $scope.$on('socket:message', function(ev, data){            
    console.debug("commSocket[on]->newMessage->Data: ", data);
    if(!_.isEqual(chat.reference.getId(), data.reference)){
      chat.onMessage(data);
    }
  });
  
    $scope.$on('socket:messageRead', function(ev, data){            
      console.debug("commSocket[on]->messageRead->Data: ", data); 
      chat.onMessageRead(data);
    }); 
/*    
    $scope.$on('socket:messageOk', function(ev, uuid){      
      console.debug("commSocket[on]->messageOk->Data: ", uuid);
      _.find($scope.messages, function(message){
        if(_.isEqual(message.uuid, uuid)){
          message.status = 2;
        }
      });

    }); 
    
    $scope.$on('socket:connect', function(ev, data){
      console.debug("commSocket[on]->connect->connected...!!!"); 
       $scope.serverStatus = 'connect';         
    });
  
    $scope.$on('socket:reconnecting', function(ev, data){         
      console.debug("commSocket[on]->reconnecting...!!!"); 
      $scope.serverStatus = 'reconnecting';        
    });
*/
    $scope.$on('socket:loginOk', function(ev, data){      
      console.debug("chatSocket[on]->loginOk->Data: ", data);  
      $scope.serverStatus = 'loginOk';
    });
/*
    $scope.$on('socket:disconnect', function(ev, data){      
      console.debug("commSocket[on]->disconnect->Data: ", data);  
      $scope.serverStatus = 'disconnect';    
      //$state.go('chat.status', {status: 'DISCONNECTED'});   
    });
*/  
    $scope.$on('socket:referenceJoined', function(ev, data){      
      console.debug("commSocket[on]->referenceJoined->Data: ", data);  
      $scope.serverStatus = 'referenceJoined';

      chat.userJoined(data);

      $scope.maximizar = true;
    });

    $scope.$on('socket:referenceLeft', function(ev, data){
      console.debug("commSocket[on]->referenceLeft->Data: ", data);  
      $scope.serverStatus = 'referenceLeft';
      
      chat.referenceLeftRoom(data);
    });

     $scope.$on('socket:updateDefaultReferences', function(ev, resp){
      console.debug("commSocket[on]->updateDefaultReferences->Data: ", resp);
      $scope.serverStatus = 'updateDefaultReferences';        

      /*var connectedUsers = _.difference(_(resp).pluck('externalId'), _($scope.connectedUsers).pluck('externalId'));

      _(connectedUsers).each( function( externalId ) {
        $scope.connectedUsers.push(_(resp).findWhere({externalId: externalId}));
      })*/
      if(!_(chat).isEmpty() && chat.reference.isAgent()){     

        $scope.connectedUsers = [];
        
        _(resp).each( function( reference ) {
          $scope.connectedUsers.push(reference);
        });

      }

    });

    $scope.$on('socket:updateOperationalReferences', function(ev, resp){
      console.debug("commSocket[on]->updateOperationalReferences->Data: ", resp);
      $scope.serverStatus = 'updateOperationalReferences';        
    
      /*var connectedOpUsers; 
      if(!_(chat).isEmpty()){
        connectedOpUsers = _.difference(_(resp).pluck('externalId'), _([{externalId: chat.reference.getId()}]).pluck('externalId'));
      }else{
        connectedOpUsers = _(resp).pluck('externalId');
      }

      connectedOpUsers = _.difference(connectedOpUsers, _($scope.connectedOpUsers).pluck('externalId'));
      
      _(connectedOpUsers).each( function( externalId ) {
        $scope.connectedOpUsers.push(_(resp).findWhere({externalId: externalId}));
      });*/
      if(!_(chat).isEmpty() && chat.reference.isAgent()){  
        var connectedOpUsers; 

        connectedOpUsers = _.difference(_(resp).pluck('externalId'), _([{externalId: chat.reference.getId()}]).pluck('externalId'));

        $scope.connectedOpUsers = [];    
        _(connectedOpUsers).each( function( externalId ) {
          $scope.connectedOpUsers.push(_(resp).findWhere({externalId: externalId}));
        });    
      }  
            
    });

    $scope.$on('socket:redirectOk', function(ev, resp){
      console.debug("commSocket[on]->redirectOk->Data: ", resp);
      $scope.serverStatus = 'redirectOk';  
      var newRoom = {
        id: parseInt(resp.newRoom),
      };
      
      $scope.room = newRoom;

      var data = {
        reference: $scope.user.externalId,
        room: resp.newRoom
      };

      /*chat.emit('login', data, function(ackData){
        console.info("login->ackData: ", ackData); 
      });*/     
    });
/*    
    $scope.$on('$destroy', function (event) {
      chat.removeAllListeners();
    });
  */
} ] );
