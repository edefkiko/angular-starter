angular.module('login')
.controller('redirectCtrl', ['$scope', 'Simulator', 'StatusService', 'CLIENT_STATUS', 'LoginService', '$state', 'Solicitud', '$stateParams', '$log', 'Cliente', '$rootScope', '$q', function($scope, Simulator, StatusService, CLIENT_STATUS, LoginService, $state, Solicitud, $stateParams, $log, Cliente, $rootScope, $q){

	var status;
	var situacion = LoginService.currentUser().situacion;

	$scope.$watch('init', function(){
		var cliente = new Cliente({id: LoginService.currentUser().id});

		$rootScope.showLoading();	
		cliente.getBasicData().then(function(user){		
			
			$scope.$emit('loadUserData'); 

			isSolicitudActive().then(function(response){
				$rootScope.hideLoading();

				status = StatusService.getFullStatusByValue(response.estatusCliente);
				

				if(!_(CLIENT_STATUS.PRIMERA_CONFIRMACION).isEqual(status) 
					&& !_(CLIENT_STATUS.SEGUNDA_CONFIRMACION).isEqual(status)
					&& !_(CLIENT_STATUS.DOCUMENTACION_COMPLETA).isEqual(status)){

					switch(situacion){
						case 'Prospecto':
							if(_(CLIENT_STATUS.PENDIENTE_FIRMA).isEqual(status)){
								$state.go(status.state);
							}else if(_(CLIENT_STATUS.RACHAZADO_PLD).isEqual(status) || _(CLIENT_STATUS.RECHAZADO_POR_BURO).isEqual(status) || _(CLIENT_STATUS.RECHAZADO_EFEL).isEqual(status)){
								$state.go('problemaSolicitud');
							}else{
								loadSolicitudData(status, response);
							}

							break;
						case 'Cliente':
							$state.go('home');
						break;
						case 'Desertor':
							$log.log('response.estatusSolicitud', response.estatusSolicitud);
							if(_('Activa').isEqual(response.estatusSolicitud)){
								loadSolicitudData(status, response);
							}else{
								$state.go('homeRecontratacion');
							}						
						break;
						default:
							if(status){
								$state.go(status.state);	
							}					
					}
				}else{
					$state.go(status.state);
				}		
			}, function(){
				$rootScope.hideLoading();
				switch(situacion){
					case 'Prospecto':
						loadSolicitudData(status, response);
						break;
					case 'Cliente':
						$state.go('home');
					break;
					case 'Desertor':					
						$state.go('homeRecontratacion');						
					break;				
				}
			})
			.finally(function () {
			    $rootScope.hideLoading();
			});


		});
	});

	function isSolicitudActive(){
		var deferred = $q.defer();

		if(_(LoginService.currentUser().idSolicitud).isNull()){

			deferred.reject(false);

		}else{
			var solicitud = new Solicitud({id: LoginService.currentUser().idSolicitud});
			solicitud.getSolicitudActiva(LoginService.currentUser().id, true).then(function(response){
				$log.log('isSolicitudActive', response);
				deferred.resolve(response);	
			});	
		}
		return deferred.promise;
	}
	function loadSolicitudData(status, solicitudActiva){
		if(_(CLIENT_STATUS.PENDIENTE_FIRMA).isEqual(status)){
			$state.go(status.state);
		}else{
			$scope.producto = {
				prestamo:solicitudActiva.monto,
				frecuencia: solicitudActiva.frecuencia,
				plazo: solicitudActiva.plazo,
				tasa: solicitudActiva.tasa
			};

			Simulator.calculate(solicitudActiva.monto, solicitudActiva.frecuencia, solicitudActiva.plazo, solicitudActiva.tasa).then(function(prestamoCalculado){
		      $scope.producto.interes = prestamoCalculado.totalInteres;
		      $scope.producto.ivaInteres = prestamoCalculado.totalIvaInteres;
		      $scope.producto.total = prestamoCalculado.totalTotal;
		    });

			$scope.status = 'PENDIENTE';
		}
	}
	$scope.siguiente = function(){
		if(status){
			$state.go(status.state);	
		}
	};

}])