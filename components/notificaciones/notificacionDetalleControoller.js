angular.module('notificaciones')
.controller('notificacionDetalleController', ['$scope', '_', '$log', 'Notificacion', 'LoginService', '$rootScope', '$stateParams', function($scope, _, $log, Notificacion, LoginService, $rootScope, $stateParams){ 
	var user = LoginService.currentUser();
	var notificacionModel = new Notificacion(user.id);


	$rootScope.showLoading();	
	notificacionModel.getById($stateParams.id).then(function(notificacion){
		$rootScope.hideLoading();
		
		$scope.notificacion = notificacion.parsed;
		
		notificacionModel.update(notificacion.original);
		
		//$log.log('notificacion.original', notificacion.original);
		if(!_.isNull(notificacion.original.idNotificacionRelacionada)){
			getAsociacion(notificacion.original.idNotificacionRelacionada);		
		}
		
	}, function(){
		$rootScope.hideLoading();
	});

	function getAsociacion(notificationId){
		notificacionModel.getById(notificationId).then(function(notificacion){
					
			$scope.notificacionResp = notificacion.parsed;
			
		});
	}

}]);