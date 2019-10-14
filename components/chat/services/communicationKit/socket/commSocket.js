angular.module('communicationKit')
.factory('commSocket', function ($rootScope, EnvironmentConfig, socketFactory) {
    var socket = io.connect(EnvironmentConfig.socket);

    var mySocket = socketFactory({
      ioSocket: socket
    });

    mySocket.forward('message');
    mySocket.forward('messageOk');
    mySocket.forward('messageRead');    
    mySocket.forward('connect');
    mySocket.forward('reconnecting');
    mySocket.forward('loginOk');
    mySocket.forward('disconnect');
    mySocket.forward('referenceJoined');
    mySocket.forward('referenceLeft');
    mySocket.forward('updateDefaultReferences');    
    mySocket.forward('updateOperationalReferences');    
    mySocket.forward('redirectOk');    
    
    return mySocket;
});