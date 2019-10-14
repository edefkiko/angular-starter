angular.module('datosPersonales')
	.factory('Cliente', ['clienteService', 'emailService', '_', 'LoginService',
		'$q', 'CLIENT_STATUS', 'StatusService', '$state', 'Solicitud',
		'deviceDetector', '$log', 'localStorageService',
		'validarDatosClienteService',
		function(clienteService, emailService, _, LoginService, $q, CLIENT_STATUS,
			StatusService, $state, Solicitud, deviceDetector, $log, localStorageService,
			validarDatosClienteService) {

			function Cliente(cliente, existSolicitud, solicitud) {
				$log.info('existSolicitud:', existSolicitud);

				this.client = {};
				this.client.id = cliente.id;
				this.client.preferredLanguage = 'Spanish';
				this.customInformation = [];
				this.setData(cliente, existSolicitud);
			}

			Cliente.prototype.addCustomInformation = function(name, value,
				setGroupIndex) {
				if (!_(value).isEmpty() || _(value).isNumber()) {

					var entity = {
						customFieldID: name,
						value: value
					};

					if (_(setGroupIndex).isNumber()) {
						_.extend(entity, {
							customFieldSetGroupIndex: setGroupIndex
						});
					}

					this.customInformation.push(entity);

				}
			};

			Cliente.prototype.getCustomField = function(name) {
				return _(this.customInformation).find(function(customField) {
					if (_(name).isEqual(customField.customFieldID)) {
						return customField;
					}
				})
			};

			Cliente.prototype.setData = function(cliente, existSolicitud) {
				this.client.firstName = cliente.firstName;
				if (cliente.middleName) {
					this.client.middleName = cliente.middleName;
				} else {
					this.client.middleName = null;
				}
				this.client.lastName = cliente.lastName;
				this.client.emailAddress = cliente.email;
				this.client.birthDate = cliente.birthDate;
				this.client.gender = cliente.gender;
				this.client.mobilePhone1 = cliente.mobilePhone1;
				if (cliente.homePhone) {
					this.client.homePhone = cliente.homePhone;
				} else {
					this.client.homePhone = null;
				}
				this.addCustomInformation('Email_Opcional_Clientes', cliente.emailOpcional);
				this.addCustomInformation('Contrasena_Clientes', cliente.contrasena);
				this.addCustomInformation('Lugar_Nac_Clientes', cliente.lugarNac);
				this.addCustomInformation('CURP_Clientes', cliente.curp);
				this.addCustomInformation('Contrasena_Llave_Clientes', cliente.curp);
				this.addCustomInformation('RFC_Clientes', cliente.rfc);
				this.addCustomInformation('Pais_Nacionalidad_Clientes', 'México');
				this.addCustomInformation('Pais_Origen_Clientes', 'México');
				this.addCustomInformation('Estado_Civil_Clientes', cliente.estadoCivil);
				this.addCustomInformation('Nivel_Estudios_Clientes', cliente.nivelEstudios);
				this.addCustomInformation('Adquisición_Clientes', cliente.adquisicion);
				this.addCustomInformation('Codigo_Promocion_Clientes', cliente.codigoPromocion);
				this.addCustomInformation('Segundo_Apellido_Clientes', cliente.segundoApellido);
				this.addCustomInformation('Situacion_Persona_Clientes', 'Prospecto');
				this.addCustomInformation('Notif_Pago_SMS_PUSH_Clientes', 'TRUE');
				this.addCustomInformation('Notif_Pago_Email_Clientes', 'TRUE');
				this.addCustomInformation('Record_SMS_PUSH_Clientes', 'TRUE');
				this.addCustomInformation('Record_Email_Clientes', 'TRUE');
				this.addCustomInformation('Notif_SMS_PUSH_Clientes', 'TRUE');
				this.addCustomInformation('Notif_Email_Clientes', 'TRUE');
				this.addCustomInformation('Dias_Aviso_Clientes', '1');
				this.addCustomInformation('Acepto_Aviso_Privacidad', cliente.aceptoAvisoPrivacidad ? 'TRUE': 'FALSE');
				this.addCustomInformation('Acepto_Proporcionar_Datos', cliente.aceptoProporcionarDatos ? 'TRUE': 'FALSE');

				this.addCustomInformation('DondeEstas_Clientes', cliente.dondeEstas);
				this.addCustomInformation('Geolocalizacion_Clientes', JSON.stringify(
					cliente.geolocation));



				//FacbookData
				if (this.getFacebookData()) {
					this.addCustomInformation('Data_Facebook_Clientes', JSON.stringify(this.getFacebookData()));
				}

				//Solicitud
				this.setSolicitud(existSolicitud);
			}

			Cliente.prototype.setSolicitud = function(existSolicitud) {
				var solicitud = new Solicitud({}).getSolicitudFromMemory();

				if (solicitud) {
					this.addCustomInformation('ID_Solicitud_Clientes', new Date().getTime().toString(),
						existSolicitud ? undefined : 0);
					this.addCustomInformation('Monto_Solicitud_Clientes', solicitud.monto,
						existSolicitud ? undefined : 0);
					this.addCustomInformation('Plazo_Solicitud_Clientes', solicitud.plazo,
						existSolicitud ? undefined : 0);
					this.addCustomInformation('Periodo_Pagos_Clientes', solicitud.peridoPagos,
						existSolicitud ? undefined : 0);

					this.addCustomInformation('Frecuencia_Solicitud_Clientes', solicitud.frecuenciaEn,
						existSolicitud ? undefined : 0);
					this.addCustomInformation('Tasa_Solicitud_Clientes', solicitud.tasa,
						existSolicitud ? undefined : 0);
					this.addCustomInformation('Estatus_Solicitud_Clientes', 'Activa',
						existSolicitud ? undefined : 0);
					this.addCustomInformation('Estatus_Cliente', CLIENT_STATUS.PRIMERA_CONFIRMACION
						.value, existSolicitud ? undefined : 0); //TODO: Verificar cuando sea la 2da solicitud de cliente
					var today = new Date();
					var fechaInicio = moment(today).format("YYYY-MM-DD");
					this.addCustomInformation('Fecha_Inicio_Sol_Clientes', fechaInicio,
						existSolicitud ? undefined : 0);
					this.addCustomInformation('Dispositivo_Solicitud_Clientes',
						getDeviceInfo(), existSolicitud ? undefined : 0);

					$log.debug('fechaInicio', fechaInicio);
					$log.debug('getDeviceInfo', getDeviceInfo());
				}
			}

			function getDeviceInfo() {
				var device = '';

				if (deviceDetector.isDesktop()) {
					device += 'Desktop';
				} else if (deviceDetector.isMobile()) {
					device += 'Mobile';
				} else if (deviceDetector.isTablet()) {
					device += 'Tablet';
				}

				device += '|' + deviceDetector.browser;
				device += '|' + deviceDetector.browser_version;
				device += '|' + deviceDetector.device;
				device += '|' + deviceDetector.os;
				device += '|' + deviceDetector.os_version;

				return device;
			}

			Cliente.prototype.sendEmail = function() {
				var deferred = $q.defer();

				emailService.sendConfirmation('email').then(function(response) {
					if (response.resultado === '0') {

						deferred.resolve(response);

					} else {
						deferred.reject(response.mensajeOperacion);
					}
				});
				return deferred.promise;
			}

			Cliente.prototype.sendSMS = function() {
				var deferred = $q.defer();

				emailService.sendConfirmation('sms').then(function(response) {
					if (response.resultado === '0') {

						deferred.resolve(response);

					} else {
						deferred.reject(response.mensajeOperacion);
					}
				});
				return deferred.promise;
			}

			Cliente.prototype.confirmEmail = function() {
				var deferred = $q.defer();

				clienteService.confirmEmail(this.client.id).then(function(response) {
					deferred.resolve(response);
				});
				return deferred.promise;
			}

			Cliente.prototype.confirmSMS = function() {
				var deferred = $q.defer();

				clienteService.confirmSMS(this.client.id).then(function(response) {
					deferred.resolve(response);
				});
				return deferred.promise;
			}

			Cliente.prototype.isEmailConfirmed = function() {
				var deferred = $q.defer();

				clienteService.getCustomField(this.client.id, 'Email_Confirmado_Clientes')
					.then(function(response) {
						if (_(response).size() > 0) {
							deferred.resolve(response[0].value === 'TRUE');
						} else {
							deferred.resolve(false);
						}
					});
				return deferred.promise;
			}

			Cliente.prototype.isSMSConfirmed = function() {
				var deferred = $q.defer();

				clienteService.getCustomField(this.client.id, 'SMS_Confirmado_Clientes').then(
					function(response) {
						if (_(response).size() > 0) {
							deferred.resolve(response[0].value === 'TRUE');
						} else {
							deferred.resolve(false);
						}
					});
				return deferred.promise;
			}

			Cliente.prototype.updateStatus = function(status) {
				var deferred = $q.defer();

				var memorySolicitud = localStorageService.get('solicitud');
				memorySolicitud.estatusCliente = status;

				var solicitud = new Solicitud(memorySolicitud);

				solicitud.updateStatusCliente(this.client.id).then(function(result) {
					if (result && result.errorSource) {
						deferred.reject(result);
					} else {
						deferred.resolve(result);
					}
				});

				return deferred.promise;
			}

			Cliente.prototype.firmar = function(solicitudActiva) {
				var deferred = $q.defer();
				solicitudActiva.estatusCliente = CLIENT_STATUS.DISPERSADO.value;
				solicitudActiva.estatusSolicitud = 'Completa';
				solicitudActiva.contratoFirmado = 'TRUE';

				var solicitud = new Solicitud(solicitudActiva);

				solicitud.firmar(this.client.id).then(function(result) {
					if (result && result.errorSource) {
						deferred.reject(result);
					} else {
						deferred.resolve(result);
					}
				});

				return deferred.promise;
			}
			Cliente.prototype.validarDatosCliente = function(email, telefono, curp, rfc) {
				return validarDatosClienteService.validaDatosCliente(email, telefono,
					curp, rfc);
			}
			Cliente.prototype.guardar = function() {
					var self = this;
					var deferred = $q.defer();
					clienteService.create(this).then(function(response) {

						$log.info('clienteService.create', response);
						if (response && response.errorSource) {
							deferred.reject(response);
						} else if(response.existe === 1 && response.mensajeOperacion === 'Existe') {
							deferred.resolve(response);						
						} else{

							//--Guardado en Caché-----------------------------------------------
							var solicitud = new Solicitud();
							var solicitudes = solicitud.mapToSolicitud(response.customInformation);
							solicitud.setSolicitudOnMemory(solicitudes[0]); //Se crea solicitud por default al crear cliente
							self.setBasicData(response.client);
							//------------------------------------------------------------------

							deferred.resolve(response);
						}
					});
					return deferred.promise;
				}
				// Cliente.prototype.actualizar = function(){
				// 	var customInformation = _.clone(customInformation);
				// 	var self = this;
				// 	delete customInformation
				// }
			Cliente.prototype.actualizar = function(idClienteActualizar) {

				var self = this;
				$log.info('this:', this);
				var clientUpdate = _.clone(this.client);
				var dataCliente = {
					client: clientUpdate
				};
				var customInformationUpdate = _.clone(this.customInformation);
				var dataCustomInformation = {
					customInformation: customInformationUpdate
				};

				$log.info('dataCliente: ', dataCliente);
				$log.info('dataCustomInformation: ', dataCustomInformation);
				var deferred = $q.defer();
				clienteService.update(dataCliente, idClienteActualizar).then(function(
					userBackend) {

					clienteService.updateCustominformation(dataCustomInformation,
						idClienteActualizar).then(function(result) {
						$log.info('clienteService.update', result);
						if (result && result.errorSource) {
							deferred.reject(result);
						} else {

							deferred.resolve(result);

						}
					});
				});
				return deferred.promise;
			}

			Cliente.prototype.getProfile = function() {
				var deferred = $q.defer();
				clienteService.getProfile(this.client.id).then(function(result) {
					if (result && result.errorSource) {
						deferred.reject(result);
					} else {
						deferred.resolve(result);
					}
				});
				return deferred.promise;
			}

			Cliente.prototype.inactiveState = function() {
				var deferred = $q.defer();
				clienteService.changeState(this.client.id, 'INACTIVE').then(function(
					result) {
					if (result && result.errorSource) {
						deferred.reject(result);
					} else {
						deferred.resolve(result);
					}
				});
				return deferred.promise;
			}

			Cliente.prototype.updateSituacionToCliente = function() {
				var deferred = $q.defer();
				var situacion = 'Cliente';
				clienteService.updateSituacion(this.client.id, situacion).then(function(
					result) {
					if (result && result.errorSource) {
						deferred.reject(result);
					} else {
						deferred.resolve(result);
					}
				});
				return deferred.promise;
			}

			Cliente.prototype.updateDondeEstas = function(value) {
				var deferred = $q.defer();
				clienteService.updateDondeEstas(this.client.id, value).then(function(
					result) {
					if (result && result.errorSource) {
						deferred.reject(result);
					} else {
						deferred.resolve(result);
					}
				});
				return deferred.promise;
			}

			Cliente.prototype.loadSession = function() {
				var clave = this.getCustomField('Contrasena_Clientes') || {};
				return LoginService.login({
					username: this.client.emailAddress,
					encPassword: clave.value
				});
			}

			Cliente.prototype.redirect = function() {
				$state.go(StatusService.next(CLIENT_STATUS.REGISTRO_CLIENTE.value));
			}


			Cliente.prototype.getFacebookData = function() {
				if (localStorageService.get('facebookData')) {
					return localStorageService.get('facebookData');
				} else {
					return undefined;
				}

			}

			Cliente.prototype.getUserData = function() {
				var deferred = $q.defer();
				clienteService.getProfile(this.client.id).then(function(result) {
					if (result && result.errorSource) {
						deferred.reject(result);
					} else {
						deferred.resolve(mapToClient(result));
					}
				});
				return deferred.promise;
			};

			Cliente.prototype.setBasicData = function(client) {
				var cliente = {};
				cliente.encodedKey = client.encodedKey;
				cliente.firstName = client.firstName;
				cliente.middleName = client.middleName;
				cliente.lastName = client.lastName;
				cliente.emailAddress = client.emailAddress;
				cliente.mobilePhone1 = client.mobilePhone1;
				cliente.homePhone = client.homePhone;

				localStorageService.set('userBasicData', cliente);
			}

			Cliente.prototype.getBasicData = function() {
				var self = this;
				var deferred = $q.defer();
				var userData = localStorageService.get('userBasicData');

				if (_(userData).isNull()) {
					clienteService.getProfile(this.client.id, false).then(function(result) {
						if (result && result.errorSource) {
							deferred.reject(result);
						} else {
							self.setBasicData(result);

							deferred.resolve(result);
						}
					});
				} else {
					deferred.resolve(userData);
				}

				return deferred.promise;
			};

			function mapToClient(clientData) {
				var cliente = {};
				cliente.firstName = clientData.client.firstName;


				_(clientData.customInformation).each(function(field) {
					//$log.debug('clientData.customInformation.field', field);

					if (_(field.customFieldID).isEqual('Calle_Clientes')) {
						cliente.calleClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Num_Ext_Clientes')) {
						cliente.NumExtClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Num_Int_Clientes')) {
						cliente.NumIntClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Depa_Clientes')) {
						cliente.DepaClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Colonia_Clientes')) {
						cliente.ColoniaClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Mun_Del_Clientes')) {
						cliente.MunDelClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Ciudad_Clientes')) {
						cliente.CiudadClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Estado_Clientes')) {
						cliente.EstadoClientes = field.value;
					} else if (_(field.customFieldID).isEqual('CP_Clientes')) {
						cliente.CPClientes = field.value;
					} else if (_(field.customFieldID).isEqual(
							'Estatus_Residencial_Clientes')) {
						cliente.EstatusResidencialClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Situacion_Persona_Clientes')) {
						cliente.SituacionPersonaClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Puesto_Trabajo_Clientes')) {
						cliente.PuestoTrabajoClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Tipo_Trabajo_Cliente')) {
						cliente.TipoTrabajoCliente = field.value;
					} else if (_(field.customFieldID).isEqual('Area_Clientes')) {
						cliente.AreaClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Giro_Empresa_Clientes')) {
						cliente.GiroEmpresaClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Nombre_Empresa_Clientes')) {
						cliente.NombreEmpresaClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Sueldo_Clientes')) {
						cliente.SueldoClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Gasto_Clientes')) {
						cliente.GastoClientes = field.value;
					} else if (_(field.customFieldID).isEqual(
							'Dependientes_Economicos_Clientes')) {
						cliente.DependientesEconomicosClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Destino_Credito_Clientes')) {
						cliente.DestinoCreditoClientes = field.value;
					} else if (_(field.customFieldID).isEqual(
							'Actividad_Economica_Clientes')) {
						cliente.ActividadEconomicaClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Sin_Trabajo_Clientes')) {
						cliente.SinTrabajoClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Antiguedad_Años_Clientes')) {
						cliente.AntiguedadAñosClientes = field.value;
					} else if (_(field.customFieldID).isEqual('Negocio_Anos_Clientes')) {
						cliente.NegocioAnosClientes = field.value;
					} else if (_(field.customFieldID).isEqual(
							'Notif_Pago_SMS_PUSH_Clientes')) {
						cliente.notif_Pago_SMS_PUSH_Clientes = field.value;
					} else if (_(field.customFieldID).isEqual('Notif_Pago_Email_Clientes')) {
						cliente.notif_Pago_Email_Clientes = field.value;
					} else if (_(field.customFieldID).isEqual('Record_SMS_PUSH_Clientes')) {
						cliente.record_SMS_PUSH_Clientes = field.value;
					} else if (_(field.customFieldID).isEqual('Record_Email_Clientes')) {
						cliente.record_Email_Clientes = field.value;
					} else if (_(field.customFieldID).isEqual('Dias_Aviso_Clientes')) {
						cliente.dias_Aviso_Clientes = field.value;
					} else if (_(field.customFieldID).isEqual('Notif_SMS_PUSH_Clientes')) {
						cliente.Notif_SMS_PUSH_Clientes = field.value;
					} else if (_(field.customFieldID).isEqual('Notif_Email_Clientes')) {
						cliente.notif_Email_Clientes = field.value;
					} else if (_(field.customFieldID).isEqual('Vigencia_ID_Clientes')) {
						cliente.vigenciaIfe = field.value;
					} else if (_(field.customFieldID).isEqual('ID_Solicitud_Clientes')) {
						cliente.iDSolicitudClientes = field.value;
					}



				});

				return cliente;
			}


			Cliente.prototype.setFacebookData = function(facebookData) {
				localStorageService.set('facebookData', facebookData);
			}

			return Cliente;
		}
	]);