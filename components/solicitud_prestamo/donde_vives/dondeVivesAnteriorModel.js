angular.module('solicitudPrestamo')
	.factory('DondeVivesAnterior', ['domicilioService', '_', '$log', 'CLIENT_STATUS', 'Cliente', '$q', 'LoginService', 'clienteService', function(domicilioService, _, $log, CLIENT_STATUS, Cliente, $q, LoginService, clienteService) {

		function DondeVivesAnterior(profile) {
			if (profile) {

				$log.info('En DondeVivesAnterior: ', profile);
				this.customInformation = [];
				this.addCustomInformation = function(name, value) {
					if (!_.isEmpty(value) || _(value).isNumber()) {
						this.customInformation.push({
							customFieldID: name,
							value: value
						});
					}
				};
				this.addCustomInformation('Calle_Anterior_Clientes', profile.calleClientes);
				this.addCustomInformation('Numext_anterior_Clientes', profile.NumExtClientes);
				this.addCustomInformation('Numint_Anterior_Clientes', profile.NumIntClientes);
				this.addCustomInformation('Depa_Anterior_Clientes', profile.DepaClientes);
				this.addCustomInformation('Colonia_Anterior_Clientes', profile.ColoniaClientes);
				this.addCustomInformation('Mun_Del_Anterior_Clientes', profile.MunDelClientes);
				this.addCustomInformation('Ciudad_Anterior_Clientes', profile.CiudadClientes);
				this.addCustomInformation('Estado_Anterior_Clientes', profile.EstadoClientes);
				this.addCustomInformation('CP_Anterior_Clientes', profile.CPClientes);
				this.addCustomInformation('Residencia_Anterior_Clientes', profile.EstatusResidencialClientes);
				this.addCustomInformation('ID_Solicitud_Dom_Ant_Cliente', profile.iDSolicitudClientes);
			}
		};


		DondeVivesAnterior.prototype.actualizar = function(clientId) {
			domicilioService.actualizaDireccion(clientId, this);
		};

		DondeVivesAnterior.prototype.getAllAddress = function(clientId) {
			var deferred = $q.defer();
			clienteService.getProfile(clientId).then(function(result) {
				if (result && result.errorSource) {
					deferred.reject(result);
				} else {
					deferred.resolve(mapToDondeVives(result.customInformation));
				}
			});
			return deferred.promise;
		}

		function getHashCode(address) {
			var hash = [];
			hash.push(address.calle);
			hash.push(address.numExt);
			hash.push(address.numInt);
			hash.push(address.numDepto);
			hash.push(address.codigoPostal);
			hash.push(address.colonia);
			hash.push(address.minicipio);
			hash.push(address.ciudad);
			hash.push(address.estado);
			hash.push(address.estatus);

			return hashCode(hash);
		}

		DondeVivesAnterior.prototype.haCambiadoDeDomicilio = function(userId, idSolicitud) {
			var deferred = $q.defer();

			this.getAllAddress(userId).then(function(response) {

				var oldAddress = _(response.domicilioAnterior).find(function(domicilioAnterior) {

					if (_(idSolicitud).isEqual(domicilioAnterior.idSolicitud)) {
						return domicilioAnterior;
					}

				});

				if (_(oldAddress).isEmpty()) {
					deferred.resolve(true);
				} else {
					var oldAddressHash = getHashCode(oldAddress);
					var addressHash = getHashCode(response.domicilioActual);

					if (_(addressHash).isEqual(oldAddressHash)) {
						deferred.resolve(false, addressHash, oldAddressHash);
					} else {
						deferred.resolve(true, addressHash, oldAddressHash);
					}

				}

			}, function(err) {
				$log.error('No se pudieron obtener Datos de Domicilio anteriores, verificar estado.', err);
			});

			return deferred.promise;
		}

		function mapToDondeVives(fields) {
			var address = {};
			var domicilioAnterior = [];
			var domicilioActual = {};
			_(fields).each(function(field) {

				if (field.customFieldSetGroupIndex >= 0) {
					if (_(domicilioAnterior[field.customFieldSetGroupIndex]).isUndefined()) {
						domicilioAnterior[field.customFieldSetGroupIndex] = {};
					}

					domicilioAnterior[field.customFieldSetGroupIndex].customFieldSetGroupIndex = field.customFieldSetGroupIndex;
					//$log.debug('clientData.customInformation.field', field);
					if (_(field.customFieldID).isEqual('Calle_Anterior_Clientes')) {
						domicilioAnterior[field.customFieldSetGroupIndex].calle = field.value;
					} else if (_(field.customFieldID).isEqual('Numext_anterior_Clientes')) {
						domicilioAnterior[field.customFieldSetGroupIndex].numExt = field.value;
					} else if (_(field.customFieldID).isEqual('Numint_Anterior_Clientes')) {
						domicilioAnterior[field.customFieldSetGroupIndex].numInt = field.value;
					} else if (_(field.customFieldID).isEqual('Depa_Anterior_Clientes')) {
						domicilioAnterior[field.customFieldSetGroupIndex].numDepto = field.value;
					} else if (_(field.customFieldID).isEqual('CP_Anterior_Clientes')) {
						domicilioAnterior[field.customFieldSetGroupIndex].codigoPostal = field.value;
					} else if (_(field.customFieldID).isEqual('Colonia_Anterior_Clientes')) {
						domicilioAnterior[field.customFieldSetGroupIndex].colonia = field.value;
					} else if (_(field.customFieldID).isEqual('Mun_Del_Anterior_Clientes')) {
						domicilioAnterior[field.customFieldSetGroupIndex].minicipio = field.value;
					} else if (_(field.customFieldID).isEqual('Ciudad_Anterior_Clientes')) {
						domicilioAnterior[field.customFieldSetGroupIndex].ciudad = field.value;
					} else if (_(field.customFieldID).isEqual('Estado_Anterior_Clientes')) {
						domicilioAnterior[field.customFieldSetGroupIndex].estado = field.value;
					} else if (_(field.customFieldID).isEqual('Residencia_Anterior_Clientes')) {
						domicilioAnterior[field.customFieldSetGroupIndex].estatus = field.value;
					} else if (_(field.customFieldID).isEqual('ID_Solicitud_Dom_Ant_Cliente')) {
						domicilioAnterior[field.customFieldSetGroupIndex].idSolicitud = field.value;
					}

				} else {
					if (_(field.customFieldID).isEqual('Calle_Clientes')) {
						domicilioActual.calle = field.value;
					} else if (_(field.customFieldID).isEqual('Num_Ext_Clientes')) {
						domicilioActual.numExt = field.value;
					} else if (_(field.customFieldID).isEqual('Num_Int_Clientes')) {
						domicilioActual.numInt = field.value;
					} else if (_(field.customFieldID).isEqual('Depa_Clientes')) {
						domicilioActual.numDepto = field.value;
					} else if (_(field.customFieldID).isEqual('Colonia_Clientes')) {
						domicilioActual.colonia = field.value;
					} else if (_(field.customFieldID).isEqual('Mun_Del_Clientes')) {
						domicilioActual.minicipio = field.value;
					} else if (_(field.customFieldID).isEqual('Ciudad_Clientes')) {
						domicilioActual.ciudad = field.value;
					} else if (_(field.customFieldID).isEqual('Estado_Clientes')) {
						domicilioActual.estado = field.value;
					} else if (_(field.customFieldID).isEqual('CP_Clientes')) {
						domicilioActual.codigoPostal = field.value;
					} else if (_(field.customFieldID).isEqual('Estatus_Residencial_Clientes')) {
						domicilioActual.estatus = field.value;
					}
				}

			});

			address.domicilioAnterior = domicilioAnterior;
			address.domicilioActual = domicilioActual;

			return address;
		}

		function hashCode(hash) {

			hash = hash.join().replace(/ /g, '').toUpperCase();
			return hash.split("").reduce(function(a, b) {
				a = ((a << 5) - a) + b.charCodeAt(0);
				return a & a
			}, 0);
		}
		return DondeVivesAnterior;
	}]);