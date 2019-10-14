app.service('MotorRiesgo', ['$q', '$log', 'motorRiesgoService', '_', function($q, $log, motorRiesgoService, _){
	
	var evaluaPsico;
	var concluyo;
	var mensajeMotor;
	var status;
	function init(idSolicitud, idProceso, idcliente){
		$log.debug('MotorRiesgo -> init[idSolicitud, idProceso, idcliente]', idSolicitud, idProceso, idcliente);
		var deferred = $q.defer();

		var request = {
		 	idSolicitud: idSolicitud,
		    idProceso: idProceso,
		    idcliente: idcliente
		};
		

		motorRiesgoService.ejecutaMotor(request).then(function(response){
			$log.debug('MotorRiesgo ejecutaMotor', response);
			evaluaPsico = response.evaluaPsico;
			concluyo = response.concluyo;
			mensajeMotor = response.mensajeOperacion;
			status = response.estatus;
			deferred.resolve();

		}, function(err){
			deferred.reject(err);
		});

		return deferred.promise;
	}

	function iseEvaluaPsicoRequired(){
		return !_(evaluaPsico).isEmpty();
	}

	function isConcluded(){		
		return _(true).isEqual(concluyo);
	}

	function getSessionUid(){
		return evaluaPsico;
	}

	function getMensajeMotor(){
		return mensajeMotor;
	}

	function getStatus(){
		return status;
	}

	return{
		init: init,
		iseEvaluaPsicoRequired: iseEvaluaPsicoRequired,
		getSessionUid: getSessionUid,
		isConcluded: isConcluded,
		getMensajeMotor: getMensajeMotor,
		getStatus: getStatus
	}
}])