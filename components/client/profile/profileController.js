angular.module('profile')
	.controller('profileController', ['$scope', 'clienteService', 'mambuUtils', 'mambuConvertUtil', '_', 'LoginService', '$log', 'semilla', 'PasswordForgotService', 'semillaService', '$state', '$rootScope', 'MENSAJE', 'EnvironmentConfig', '$stateParams', 'notificacionesService', function($scope, clienteService, mambuUtils, mambuConvertUtil, _, LoginService, $log, semilla, PasswordForgotService, semillaService, $state, $rootScope, MENSAJE, EnvironmentConfig, $stateParams, notificacionesService) {
		$rootScope.$emit('loadUserData');
		var idUsuario = LoginService.currentUser().id;
		$scope.yeiInfo = EnvironmentConfig.yeiInfo;
		$scope.user = {};
		$scope.existTelefonoCasa = false;
		$scope.existCorreoOpcional = false;
		$scope.emailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
		$scope.textTelephone = /^(?=.{10,})/;
		$scope.passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/;
		$scope.inputType = 'password';
		$scope.typePassword = true;
		$scope.typeText = false;
		$scope.mostrarInvalido = false;
		$scope.hideShowPassword = function() {
			if ($scope.inputType === 'password') {
				$scope.inputType = 'text';
				$scope.typePassword = false;
				$scope.typeText = true;
			} else {
				$scope.inputType = 'password';
				$scope.typePassword = true;
				$scope.typeText = false;
			}
		};
		$scope.inputTypeLlave = 'password';
		$scope.typePasswordLlave = true;
		$scope.typeTextLlave = false;
		$scope.hideShowPasswordLlave = function() {
			if ($scope.inputTypeLlave === 'password') {
				$scope.inputTypeLlave = 'text';
				$scope.typePasswordLlave = false;
				$scope.typeTextLlave = true;
			} else {
				$scope.inputTypeLlave = 'password';
				$scope.typePasswordLlave = true;
				$scope.typeTextLlave = false;
			}
		};
		$scope.verActualizarMail = false;
		$scope.verBotonCambiar = true;
		$scope.verActualizarTel = false;
		$scope.verBotonCambiarTel = true;
		$scope.resetModificar = function() {
			$scope.ocultarInput = true;
			$scope.ocultarInputTel = true;
			$scope.verBotonCambiar = true;
			$scope.verBotonCambiarTel = true;
			$scope.user.correoOpcional = '';
			$scope.user.telefonoCasa = '';
			$scope.correosIguales = false;
			$scope.telefonosIguales = false;
			$scope.mostrarInvalido = false;
			$log.info('click');
		}
		$scope.mostrarActualizarMail = function() {
			$scope.mostrarInvalido = true;
			$scope.verActualizarMail = true;
			$scope.verBotonCambiar = false;
			$scope.ocultarInput = false;
			$log.info($scope.verActualizarMail);
		}
		$scope.mostrarActualizarTel = function() {
			$scope.verActualizarTel = true;
			$scope.verBotonCambiarTel = false;
			$scope.ocultarInputTel = false;
			$log.info('cambiar');
		}
		$scope.mostrarBotonTelefono = function() {
			$scope.verBotonTelefono = false;
			$log.info('desactivar');
		}
		loadData();
		function loadData() {
			$scope.$emit('loadUserData');
			$scope.mostrarInvalido = false;
			$scope.ocultarInput = true;
			$scope.ocultarInputTel = true;
			$scope.verBotonCambiar = true;
			$scope.verBotonCambiarTel = true;
			$rootScope.showLoading();
			clienteService.getProfile(LoginService.currentUser().id).then(function(resp) {
				$rootScope.hideLoading();

				if (_('LOGIN').isEqual($stateParams.origin)) {
					$state.go('profile#contrasena');
				} else {
					$state.go('profile#contacto');
				}
				var customInformation = resp.customInformation;
				var client = resp.client;
				var user = {};
				var address = {};
				var work = {};
				user.encodedKey = client.encodedKey;

				user.firstName = client.firstName;
				user.middleName = client.middleName;
				user.lastName = client.lastName;

				user.email = client.emailAddress;
				user.celular = client.mobilePhone1;
				if (client.birthDate) {
					user.fachaNacimiento = moment(client.birthDate).utc().format("DD / MM / YYYY");
				}
				user.lugarNacimiento = mambuUtils.getCustomFieldValue(customInformation, 'Lugar_Nac_Clientes');
				user.sexo = mambuConvertUtil.gender(client.gender);
				$log.info('user.sexo: ', user.sexo);
				if (user.sexo === 'HOMBRE') {
					$scope.sexoClientes = 'Hombre';
				} else if (user.sexo === 'MUJER') {
					$scope.sexoClientes = 'Mujer';
				}
				user.curp = mambuUtils.getCustomFieldValue(customInformation, 'CURP_Clientes');
				user.estadoCivil = mambuUtils.getCustomFieldValue(customInformation, 'Estado_Civil_Clientes');
				user.correoOpcional2 = mambuUtils.getCustomFieldValue(customInformation, 'Email_Opcional_Clientes');
				if (_(user.correoOpcional2).isEmpty()) {
					$scope.textoCorreoAlternativo = 'Agregar';
				} else {
					$scope.textoCorreoAlternativo = 'Cambiar';
				}
				user.telefonoCasaLabel = resp.client.homePhone;
				if (_(user.telefonoCasaLabel).isEmpty()) {
					$scope.textoTelefonoAlternativo = 'Agregar';
				} else {
					$scope.textoTelefonoAlternativo = 'Cambiar';
				}
				address.calle = mambuUtils.getCustomFieldValue(customInformation, 'Calle_Clientes');
				user.situacion = mambuUtils.getCustomFieldValue(customInformation, 'Situacion_Persona_Clientes');
				address.numExt = mambuUtils.getCustomFieldValue(customInformation, 'Num_Ext_Clientes');
				address.numInt = mambuUtils.getCustomFieldValue(customInformation, 'Num_Int_Clientes');
				if (!_.isEmpty(address.numInt)) {
					$scope.labelNumInt = 'No Int';
				}
				address.departamento = mambuUtils.getCustomFieldValue(customInformation, 'Depa_Clientes');
				if (!_.isEmpty(address.departamento)) {
					$scope.labelDepartamento = 'Departamento';
				}
				address.codigoPostal = mambuUtils.getCustomFieldValue(customInformation, 'CP_Clientes');
				address.municipio = mambuUtils.getCustomFieldValue(customInformation, 'Mun_Del_Clientes');
				address.ciudad = mambuUtils.getCustomFieldValue(customInformation, 'Ciudad_Clientes');
				address.estado = mambuUtils.getCustomFieldValue(customInformation, 'Estado_Clientes');
				work.tipoTrabajoCliente = mambuUtils.getCustomFieldValue(customInformation, 'Tipo_Trabajo_Cliente');
				if (!_.isEmpty(work.tipoTrabajoCliente)) {
					$scope.tipoTrabajoClienteLabel = 'Trabajo Actual';
				}
				work.sinTrabajoClientes = mambuUtils.getCustomFieldValue(customInformation, 'Sin_Trabajo_Clientes');
				if (!_.isEmpty(work.sinTrabajoClientes)) {
					$scope.sinTrabajoClientesLabel = 'Situación Actual';
				}
				$scope.mostrarSueldo = false;
				work.sueldoClientes = mambuUtils.getCustomFieldValue(customInformation, 'Sueldo_Clientes');
				if (!_.isEmpty(work.sueldoClientes)) {
					$scope.sueldoClientesLabel = 'Sueldo Mensual';
					$scope.mostrarSueldo = true;
				}
				work.dependientesEconomicosClientes = mambuUtils.getCustomFieldValue(customInformation, 'Dependientes_Economicos_Clientes');
				if (!_.isEmpty(work.dependientesEconomicosClientes)) {
					$scope.dependientesEconomicosClientesLabel = 'Dependientes Económicos';
				}
				work.nombreEmpresaClientes = mambuUtils.getCustomFieldValue(customInformation, 'Nombre_Empresa_Clientes');
				if (!_.isEmpty(work.nombreEmpresaClientes)) {
					$scope.nombreEmpresaClientesLabel = 'Nombre de la Empresa';
				}
				work.giroEmpresa = mambuUtils.getCustomFieldValue(customInformation, 'Giro_Empresa_Clientes');
				if (!_.isEmpty(work.giroEmpresa)) {
					$scope.giroDeLaEmpresa = 'Giro de la empresa';
				}
				work.actividadEconomica = mambuUtils.getCustomFieldValue(customInformation, 'Actividad_Economica_Clientes');
				if (!_.isEmpty(work.actividadEconomica)) {
					$scope.actividadEconomicaClientes = 'Actividad Económica';
				}
				work.puesto = mambuUtils.getCustomFieldValue(customInformation, 'Puesto_Trabajo_Clientes');
				if (!_.isEmpty(work.puesto)) {
					$scope.puesto = 'Puesto';
				}
				work.area = mambuUtils.getCustomFieldValue(customInformation, 'Area_Clientes');
				if (!_.isEmpty(work.area)) {
					$scope.area = 'Área';
				}
				work.desde = mambuUtils.getCustomFieldValue(customInformation, 'Antiguedad_Años_Clientes');
				if (!_.isEmpty(work.desde)) {
					$scope.desde = 'Desde';
				}
				if (work.desde > 1 || work.desde === '0') {
					$scope.desdeAnios = 'Años';
				} else if (work.desde === '1') {
					$scope.desdeAnios = 'Año';
				}
				work.desdeNegocio = mambuUtils.getCustomFieldValue(customInformation, 'Negocio_Anos_Clientes');
				if (!_.isEmpty(work.desdeNegocio)) {
					$scope.desdeNegocioClientes = 'Desde';
				}
				if (work.desdeNegocio > 1 || work.desdeNegocio === '0') {
					$scope.desdeAniosNegocio = 'Años';
				} else if (work.desdeNegocio === '1') {
					$scope.desdeAniosNegocio = 'Año';
				}
				work.ingresoMen = mambuUtils.getCustomFieldValue(customInformation, 'Sueldo_Clientes');
				work.dependientes = mambuUtils.getCustomFieldValue(customInformation, 'Dependientes_Economicos_Clientes');
				work.usoPrestamo = mambuUtils.getCustomFieldValue(customInformation, 'Destino_Credito_Clientes');
				$scope.user = user;
				$scope.address = address;
				$scope.work = work;
				$scope.validOpcionales();
				$scope.$watch('user.correoOpcional', function() {
					$log.info('user.correoOpcional: ', $scope.user.correoOpcional);
					if ($scope.user.correoOpcional) {
						$scope.user.correoOpcional = $scope.user.correoOpcional.toLowerCase();
						if (user.email === $scope.user.correoOpcional) {
							$log.info('iguales');
							$scope.correosIguales = true;
						} else {
							$log.info('Diferentes');
							$scope.correosIguales = false;
						}
						if (_(user.correoOpcional2).isEmpty()) {
							$log.info('no existe correo alternativo');
						} else {
							if (user.correoOpcional2 === $scope.user.correoOpcional) {
								$log.info('correo alternativo igual');
								$scope.correoDuplicado = true;
							} else {
								$scope.correoDuplicado = false;
							}
						}
					}

				});
				$scope.$watch('user.telefonoCasa', function() {
					$log.info('user.telefonoCasa: ', $scope.user.telefonoCasa);
					if (user.celular === $scope.user.telefonoCasa) {
						$log.info('iguales');
						$scope.telefonosIguales = true;
					} else {
						$log.info('Diferentes');
						$scope.telefonosIguales = false;
					}
					if (_(user.telefonoCasaLabel).isEmpty()) {
						$log.info('no existe telefono alternativo');
					} else {
						if (user.telefonoCasaLabel === $scope.user.telefonoCasa) {
							$log.info('telefono alternativo igual');
							$scope.telefonoDuplicado = true;
						} else {
							$scope.telefonoDuplicado = false;
						}
					}
				});
			}, function() {
				$rootScope.hideLoading();
			});
		}
		//confirmar contraseña actual
		var intentos = 0;
		$scope.passwordCorrecto = false;
		$scope.passwordLlaveCorrecto = false;
		$scope.validacionAnterior = true;
		$scope.validacionLlaveAnterior = true;
		$scope.passwordActualizado = false;

		$scope.mensajePassword = function() {
			$scope.invalido = false;
			$scope.passwordActualizado = false;
		}
		$scope.continuarAutorizacion = function(password, credentials) {
				$scope.dataloading = true;
				semillaService.getSemilla().then(function(response) {

					var encPassword = md5(password, response.semilla);
					var idUsuario = LoginService.currentUser().id;

					PasswordForgotService.validaPassword(idUsuario, encPassword).then(function() {
						$log.info('password valido');

						$scope.dataloadingNewPassword = true;
						var userId = LoginService.currentUser().id;
						var encNewPassword = md5(credentials.newPassword, semilla);
						clienteService.passwordReset(userId, encNewPassword).then(function() {
							notificacionesService.enviarNotificacion(idUsuario, 2).then(function() {
								$log.info('notificacion 2 enviada');
							});
							$log.info('password actualizado');
							$rootScope.showMessage({
								value: "Se ha actualizado correctamente tu contraseña..!!!",
								type: "CONFIRM"
							});
							$state.go("root");
							return;
						}, function() {
							$scope.dataloading = false;
							$log.error('passwordFailReset');
							return;
						});

						$scope.passwordCorrecto = true;
						$scope.validacionAnterior = false;
						$scope.dataloading = false;
						return;
					}, function(response) {
						$log.info('response: ', response);
						$log.info('password invalido');
						$scope.dataloading = false;
						$scope.invalido = true;
						$scope.mensaje = response;
						intentos = intentos + 1;

						if (intentos === 3) {
							$rootScope.showMessage(MENSAJE.INTENTOS_ERROR);
							LoginService.logout().finally(function() {
								$rootScope.hideLoading();
								$state.go('root');
							});
						}
						return;
					});
				});
			}
			//actualiza contraseña llave
		$scope.continuarAutorizacionLlave = function(passwordLlave, credentialsLlave) {
			$scope.dataloading = true;
			semillaService.getSemilla().then(function(response) {

				var encPassword = md5(passwordLlave, response.semilla);
				var idUsuario = LoginService.currentUser().id;

				PasswordForgotService.validaPassword(idUsuario, encPassword).then(function(usuarioResponse) {
					$log.info('password Llave valido');

					$scope.dataloadingNewPassword = true;
					var userId = LoginService.currentUser().id;
					var PasswordLLaveCliente = credentialsLlave.newPassword;
					clienteService.passwordLlaveReset(userId, PasswordLLaveCliente).then(function() {
						notificacionesService.enviarNotificacion(idUsuario, 8).then(function() {
							$log.info('notificacion 8 enviada');
						});
						$scope.dataloading = false;

						$log.info('password actualizado');
						$scope.passwordCorrecto = false;
						$scope.passwordActualizado = true;
						return;
					}, function() {
						$scope.dataloading = false;
						$log.error('passwordFailReset');
						return;
					});

					$scope.passwordCorrecto = true;
					$scope.validacionAnterior = false;
					$scope.dataloading = false;
					return;
				}, function(response) {
					$log.info('response: ', response);
					$log.info('password invalido L');
					$scope.dataloading = false;
					$scope.invalidoLlave = true;
					$scope.mensaje = response;
					intentos = intentos + 1;

					if (intentos === 3) {
						$rootScope.showMessage(MENSAJE.INTENTOS_ERROR);
						LoginService.logout().finally(function() {
							$rootScope.hideLoading();
							$state.go('root');
						});
					}
					return;
				});
			});
		}
		$scope.validOpcionales = function() {
			$scope.existTelefonoCasa = !(_.isNull($scope.user.correoOpcional) && _.isEmpty($scope.user.correoOpcional));
			$scope.existCorreoOpcional = !(_.isNull($scope.user.telefonoCasa) && _.isEmpty($scope.user.telefonoCasa));
		};

		$scope.updateData = function() {
			$scope.dataloadingMail = true;
			var clientId = LoginService.currentUser().id;

			$scope.user.correoOpcional = $scope.user.correoOpcional.toLowerCase();
			clienteService.updateCorreoOpcional(clientId, $scope.user.correoOpcional).then(function() {
				notificacionesService.enviarNotificacion(idUsuario, 1).then(function() {
					$log.info('notificacion 1 enviada');
				});
				$scope.verActualizarMail = false;
				$scope.verBotonCambiar = true;
				$scope.dataloadingMail = false;

				loadData();
			});
		}
		$scope.updateDataTel = function() {
			$scope.dataloadingTel = true;
			var clientId = LoginService.currentUser().id;

			clienteService.updatePhoneOpcional(clientId, $scope.user.telefonoCasa).then(function() {
				notificacionesService.enviarNotificacion(idUsuario, 1).then(function() {
					$log.info('notificacion 1 enviada');
				});
				$scope.verActualizarTel = false;
				$scope.verBotonCambiarTel = true;
				$scope.dataloadingTel = false;
				loadData();
			});
		}
		$scope.currentNavItem = 'page1';
	}]);