'use strict';
angular.module('chat')
.factory('Message', ['$log', '$q', '_', function($log, $q, _){
	
	function create(item, asesor){
		return	{
          uuid: item.uuid,
          source: item.reference,
          type: item.type.id,
          msg: item.value,
          class: asesor? 'mensajeAsesor': 'mensajeCliente',
          status: item.read ? 3: 2,
          createAt: item.createAt
        };
	};

	return {
		create: create
	};
}]);