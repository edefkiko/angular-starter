angular.module('solicitudPrestamo')
.controller('motorRiesgoCtrl', ['$scope', 'LoginService', '$rootScope', 'Cliente', 'CLIENT_STATUS', '$state', 'MotorRiesgo', 'Solicitud', '$log', 'StatusService', 'localStorageService', function($scope, LoginService, $rootScope, Cliente, CLIENT_STATUS, $state, MotorRiesgo, Solicitud, $log, StatusService, localStorageService){
	var memorySolicitud = localStorageService.get('solicitud');
	
	var idcliente = LoginService.currentUser().id;
	var idProceso;
	$scope.statusMotor = false;
	
	if(LoginService.currentUser().situacion === 'Prospecto'){
		idProceso = 1;
	}else if(LoginService.currentUser().situacion === 'Desertor'){
		idProceso = 2;
	}

	//$rootScope.showLoading();
	var solicitudModel = new Solicitud(memorySolicitud);
	solicitudModel.getSolicitudActiva(LoginService.currentUser().id, true).then(function(solicitud){

			initMotor(solicitud.id);

	});

	function initMotor(idSolicitud){
		$scope.status = 'INICIAL';

		MotorRiesgo.init(idSolicitud, idProceso, idcliente).then(function(){
			//$rootScope.hideLoading();

			if(_(true).isEqual(MotorRiesgo.isConcluded())){
				$state.go(CLIENT_STATUS.CONDICIONES_GRALES.state); 			
			}else{
				if(MotorRiesgo.iseEvaluaPsicoRequired()){
					$log.error('ESTE ESTADO DEL MOTOR DE RIESGOS ES INCORRECTO, ', error);
				}else{
					$scope.statusMotor = true;
					$scope.status = MotorRiesgo.getStatus();

					initMotor(idSolicitud);
				}					
			}				
							
		}, function(error){
			$log.log('MotorRiesgo -> error', error);
			$state.go('problemaSolicitud');
		});

	}
	

}]);