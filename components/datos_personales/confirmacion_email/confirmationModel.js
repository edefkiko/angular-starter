angular.module('datosPersonales')
.service('Confirmation', ['$q', '$log', '_', 'deviceDetector', 'Solicitud', 'CLIENT_STATUS', 'Cliente', 'confirmationService', 'localStorageService', function($q, $log, _, deviceDetector, Solicitud, CLIENT_STATUS, Cliente, confirmationService, localStorageService){
	var memorySolicitud = localStorageService.get('solicitud');

	var cliente;
	var solicitud;
	function init(userId, idSolicitud){
		$log.debug('Confirmation -> Inicializando Client');
		cliente = new Cliente({id: userId});
		solicitud = new Solicitud({id: idSolicitud});
	}

	function isMobile(){
		return deviceDetector.isMobile();
	}

	function sendSMS(){
		$log.debug('Confirmation -> Enviando SMS');
		var deferred = $q.defer();

		cliente.sendSMS().then(function(){
			deferred.resolve();
		}, function(){
			deferred.resolve();
		});

		return deferred.promise;
	}

	function sendMail(){
		$log.debug('Confirmation -> Enviando Mail');
		var deferred = $q.defer();

		cliente.sendEmail().then(function(){
			deferred.resolve();		
		});

		return deferred.promise;
	}

	function isEmailConfirmed(){
		$log.debug('isEmailConfirmed -> Enviando Mail');
		
		return cliente.isEmailConfirmed();
	}

	function isSMSConfirmed(){
		$log.debug('isSMSConfirmed -> Enviando SMS');
		
		return cliente.isSMSConfirmed();
	}

	function sendConfirmation(){
		var deferred = $q.defer();

		$log.debug('isEmailConfirmed ?');
		if(isMobile()){
			isSMSConfirmed().then(function(result){

				$log.debug('isSMSConfirmed ->' + result);

				if(result){				
					sendMail().then(function(){
						deferred.resolve('EMAIL');
					});
				}else{
					sendSMS().then(function(){
						deferred.resolve('SMS');
					});
				}

			});		
		}else{
			isEmailConfirmed().then(function(result){

				$log.debug('isEmailConfirmed ->' + result);

				if(result){				
					sendSMS().then(function(){
						deferred.resolve('SMS');
					});
				}else{
					sendMail().then(function(){
						deferred.resolve('EMAIL');
					});
				}

			});		
		}


		return deferred.promise;
	}

	function isFirstConfirmation(){
		var deferred = $q.defer();

		solicitud.getSolicitudActiva(cliente.client.id, true).then(function(solicitud){
			$log.debug('Confirmation -> isFirstConfirmation: ', solicitud.estatusCliente);
			deferred.resolve(_(CLIENT_STATUS.REGISTRO_CLIENTE.value).isEqual(solicitud.estatusCliente) || 
				_(CLIENT_STATUS.PRIMERA_CONFIRMACION.value).isEqual(solicitud.estatusCliente));			
		});

		return deferred.promise;
	}

	function sendFirstConfirmation(){
		$log.debug('Confirmation -> Primera confirmacion');
		var deferred = $q.defer();
		sendConfirmation().then(function(result){
			
			updateStatus(CLIENT_STATUS.PRIMERA_CONFIRMACION).then(function(){				
				deferred.resolve(result);
			});

		});

		return deferred.promise;
	}

	function sendSecondConfirmation(){
		$log.debug('Confirmation -> Segunda confirmacion');
		var deferred = $q.defer();
		sendConfirmation().then(function(result){

			updateStatus(CLIENT_STATUS.SEGUNDA_CONFIRMACION).then(function(){	
				$log.debug('Confirmation -> updateStatus-> success', result);
				deferred.resolve(result);
			});
	
		});

		return deferred.promise;
	}

	function updateStatus(status){
		$log.debug('Confirmation -> Actualizando a status', status.value);
		return cliente.updateStatus(status.value);
	}

	function verificaCodigo(canal, codigo){
		codigo = codigo.toUpperCase();
		$log.debug('Confirmation -> verificaCodigo:', canal, codigo);
		return confirmationService.verificaCodigo(canal, codigo);
	}

	return{
		init: init,
		isFirstConfirmation: isFirstConfirmation,
		sendFirstConfirmation: sendFirstConfirmation,
		sendSecondConfirmation: sendSecondConfirmation,
		verificaCodigo: verificaCodigo,
		sendSMS: sendSMS, 
		sendMail: sendMail
	}
}])