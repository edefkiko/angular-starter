angular.module('notificaciones')
.factory('Notificacion', ['$q', '$log', '_', 'notificacionService', function($q, $log, _, notificacionService){

	function Notificacion(idCliente){
		this.idCliente = idCliente;
	}

	Notificacion.prototype.get = function(){
		var deferred = $q.defer();
		notificacionService.consultar(this.idCliente).then(function(response){
			
			var notificaciones = [];
			
			_(response.notificaciones).each( function( item ) {
				
				var notificacion = {
					fechaAlta: moment(item.fechaAlta).format('DD/MM/YYYY h:mm'),
					fechaLectura: item.fechaLectura,
					texto: item.texto,
					idNotificacion: item.idNotificacion,
					idNotificacionRelacionada: item.idNotificacionRelacionada
				};

				notificaciones.push(notificacion);
			});

			deferred.resolve(notificaciones);
		});

		return deferred.promise;
	};

	Notificacion.prototype.getById = function(id){

		var deferred = $q.defer();
		notificacionService.consultaDetalle(id).then(function(response){
			$log.log('notificacion', response);
			var notificacion = {
				original: response,
				parsed: {}
			};
			
			notificacion.parsed.idNotificacion = response.idNotificacion;
			notificacion.parsed.texto = response.texto;
			notificacion.parsed.fechaAlta = moment(response.fechaAlta).format('DD/MM/YYYY h:mm');//'dd/MM/yyyy'new Date(response.fechaAlta);
			notificacion.parsed.idNotificacionRelacionada = response.idNotificacionRelacionada;

			deferred.resolve(notificacion);
		});

		return deferred.promise;

	};

	Notificacion.prototype.update = function(notificacion){
		var deferred = $q.defer();
		if(_(notificacion.fechaLectura).isEmpty()){ 
			var fechaTZ = moment(new Date(),"America/Mexico_City").format('YYYY-MM-DD HH:mm:ss');
			$log.log('fechaTZ', fechaTZ);			
			notificacion.fechaLectura = fechaTZ;
			notificacionService.actualizar(notificacion).then(function(response){
				deferred.resolve(response);
			});
		}else{
			deferred.resolve('Registro ya ha sido marcado como leído');
		}

		return deferred.promise;

	};

	Notificacion.prototype.remove = function(notificaciones){

		var relacionadas = _(notificaciones).filter( function(item) {
			if(!_(item.idNotificacionRelacionada).isEmpty()){
				return item;
			}
		});

		var notificacionesEliminar = _(relacionadas).map( function(item) {
		  
		  return _(notificaciones).find( function(notificacion) {

		  	var idNotificacionRelacionada = parseInt(item.idNotificacionRelacionada);		  		  		 	  
		  	var idNotificacion = notificacion.idNotificacion;
		  	
		    if(_(idNotificacionRelacionada).isEqual(idNotificacion)){ 
          		return notificacion;
		    }

		  });

		});

		_(notificaciones).find( function(notificacion) {

		    if(_(notificacion.idNotificacion).isEqual(7)){
		    	$log.log('notificacion7', notificacion7);
		    	return notificacion;
		    }
		});
		
		return _(notificaciones).difference(notificacionesEliminar);
	}

	return Notificacion;
}])