'use strict';
angular.module('chat')
.factory('ChatNotificacion', ['$log', '$q', '_', function($log, $q, _){
	
	function create(msg){
		return {
			source: "SYSTEM",
			msg: msg,
			type: 'NOTIFICATION',
			class: 'sistema center'
		}
	};


	

	return {
		create: create
	};
}]);