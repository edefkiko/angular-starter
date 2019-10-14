angular.module('solicitudPrestamo')
.factory('DondeVives', ['domicilioService','cpService', '_', '$log', 'CLIENT_STATUS', 'Cliente', '$q', 'LoginService', function(domicilioService, cpService, _,$log, CLIENT_STATUS, Cliente, $q, LoginService){

	function DondeVives(domicilio){
		this.customInformation = [];
     	this.addCustomInformation = function(name, value){
     		 if(!_(value).isEmpty() || _(value).isNumber()){
     			this.customInformation.push({
					customFieldID: name,
					value: value
				});
     		}			
		};

		 this.addCustomInformation('Calle_Clientes', domicilio.calle);
		 this.addCustomInformation('Num_Ext_Clientes', domicilio.numExt);
		 if (domicilio.numInt) {
		 this.addCustomInformation('Num_Int_Clientes', domicilio.numInt);
		}else{
		 this.addCustomInformation('Num_Int_Clientes', ' ');
		}
		if (domicilio.numDepto) {
		 this.addCustomInformation('Depa_Clientes', domicilio.numDepto);	
		}else{
		 this.addCustomInformation('Depa_Clientes', ' ');	

		}
		 this.addCustomInformation('CP_Clientes', domicilio.codigoPostal);
		 if(domicilio.dataColonias) {
		 	this.addCustomInformation('Colonia_Clientes', domicilio.dataColonias.coloniaSeleccionada.descOpcion);
		 }
		 if(domicilio.dataMunicipios){
		 	this.addCustomInformation('Mun_Del_Clientes', domicilio.dataMunicipios.municipioSeleccionada.descOpcion);		 	
		 }
		 if (domicilio.dataCiudades) {
		 	this.addCustomInformation('Ciudad_Clientes', domicilio.dataCiudades.ciudadSeleccionada.descOpcion);
		 }
		 if (domicilio.dataEstados) {	 
		 this.addCustomInformation('Estado_Clientes', domicilio.dataEstados.estadoSeleccionada.descOpcion);
		 }	
		 this.addCustomInformation('Estatus_Residencial_Clientes', domicilio.estatus);	
		 this.addCustomInformation('ID_Solicitud_Domicilio_Cliente', LoginService.currentUser().idSolicitud);

	};
      
	DondeVives.prototype.actualizar = function(clientId, profile){
		var deferred = $q.defer();	
		// $log.info('profileModel:', profile);
		//  $log.info('clientId:',clientId); 
		domicilioService.actualizaDireccion(clientId, this).then(function(result){
			deferred.resolve(result);
			// var dondeVivesAnterior = new DondeVivesAnterior(profile);
		},function(result){
			deferred.reject(result);
		});

		return deferred.promise;
	}

	DondeVives.prototype.obtenerColonias = function(filtro){
		return cpService.codigoPostalService('COLONIAS',filtro);
	}
	DondeVives.prototype.obtenerMunicipios = function(filtro){
		return cpService.codigoPostalService('MUNICIPIOS',filtro);
	}
	DondeVives.prototype.obtenerCiudades = function(filtro){
		return cpService.codigoPostalService('CIUDADES',filtro);
	}
	DondeVives.prototype.obtenerEstados = function(filtro){
		return cpService.codigoPostalService('ESTADOS',filtro);
	}

	DondeVives.prototype.updateStatus = function(clientId){
		var deferred = $q.defer();	
		$log.debug('CLIENT_STATUS.DATOS_DOMICILIO', CLIENT_STATUS.DATOS_DOMICILIO);
		var cliente = new Cliente({id: clientId});
		cliente.updateStatus(CLIENT_STATUS.DATOS_DOMICILIO.value).then(function(result){
			if(result && result.errorSource){
				deferred.reject(result);
			}else{
				deferred.resolve(result);
			}
		});
		return deferred.promise;
	}

	return DondeVives;
}]);