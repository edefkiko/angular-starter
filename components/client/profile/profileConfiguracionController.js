angular.module('profile')
	.controller('profileConfiguracionController', ['$scope', 'LoginService', '$log', '_', 'clienteService', 'Cliente', '$rootScope', 'notificacionesService', function($scope, LoginService, $log, _, clienteService, Cliente, $rootScope, notificacionesService) {
		var userId = LoginService.currentUser().id;
		var cliente = new Cliente({
			id: userId
		});
		$rootScope.showLoading();
		cliente.getUserData().then(function(profile) {
			loadNotifications();

			function loadNotifications() {
				var valuePagoRealizadoSms;
				if (profile.notif_Pago_SMS_PUSH_Clientes === 'TRUE') {
					valuePagoRealizadoSms = true;
				} else if (profile.notif_Pago_SMS_PUSH_Clientes === 'FALSE') {
					valuePagoRealizadoSms = false;
				}
				var valuePagoRealizadoMail;
				if (profile.notif_Pago_Email_Clientes === 'TRUE') {
					valuePagoRealizadoMail = true;
				} else if (profile.notif_Pago_Email_Clientes === 'FALSE') {
					valuePagoRealizadoMail = false;
				}
				var valueRecordarPagoSms = true;
				if (profile.record_SMS_PUSH_Clientes === 'TRUE') {
					valueRecordarPagoSms = true;
				} else if (profile.record_SMS_PUSH_Clientes === 'FALSE') {
					valueRecordarPagoSms = false;
				}
				var valueRecordarPagoMail;
				if (profile.record_Email_Clientes === 'TRUE') {
					valueRecordarPagoMail = true;
				} else if (profile.record_Email_Clientes === 'FALSE') {
					valueRecordarPagoMail = false;
				}
				var valueGeneralesSmse;
				if (profile.Notif_SMS_PUSH_Clientes === 'TRUE') {
					valueGeneralesSms = true;
				} else if (profile.Notif_SMS_PUSH_Clientes === 'FALSE') {
					valueGeneralesSms = false;
				}
				var valueGeneralesMail;
				if (profile.notif_Email_Clientes === 'TRUE') {
					valueGeneralesMail = true;
				} else if (profile.notif_Email_Clientes === 'FALSE') {
					valueGeneralesMail = false;
				}

				$scope.pagoRealizadoSms = {
					value1: valuePagoRealizadoSms
				}
				$scope.pagoRealizadoMail = {
					value1: valuePagoRealizadoMail
				}
				$scope.recordarPagoSms = {
					value1: valueRecordarPagoSms
				}
				$scope.recordarPagoMail = {
					value1: valueRecordarPagoMail
				}
				$scope.generalesSms = {
					value1: valueGeneralesSms
				}
				$scope.generalesMail = {
					value1: valueGeneralesMail
				}

				$scope.dataDias = {
					availableOptions: [{
						id: '1',
						value: '1'
					}, {
						id: '2',
						value: '2'
					}, {
						id: '3',
						value: '3'
					}, {
						id: '4',
						value: '4'
					}, {
						id: '5',
						value: '5'
					}],
					selectedOption: {
						id: profile.dias_Aviso_Clientes,
						value: profile.dias_Aviso_Clientes
					}
				};
				$rootScope.hideLoading();
			}
		});
		$scope.desabilitarGuardarConfiguracion = true;
		$scope.actualizarPagoRealizadoSms = function() {
			$scope.dataloading = true;
			$scope.configuracionActualizada = false;
			$log.info('$scope.pagoRealizadoSms.value1: ', $scope.pagoRealizadoSms.value1);
			if ($scope.pagoRealizadoSms.value1 === true) {
				valuePagoRealizadoSms = 'TRUE';
			} else if ($scope.pagoRealizadoSms.value1 === false) {
				valuePagoRealizadoSms = 'FALSE';
			}
			clienteService.updatePagoRealizadoSms(userId, valuePagoRealizadoSms).then(function() {
				$scope.dataloading = false;
				$scope.desabilitarGuardarConfiguracion = false;
			});
		}
		$scope.actualizarPagoRealizadoMail = function() {
			$scope.dataloadingPagoRealizadoMail = true;
			$scope.configuracionActualizada = false;
			$log.info('$scope.pagoRealizadoMail.value1: ', $scope.pagoRealizadoMail.value1);
			if ($scope.pagoRealizadoMail.value1 === true) {
				valuepagoRealizadoMail = 'TRUE';
			} else if ($scope.pagoRealizadoMail.value1 === false) {
				valuepagoRealizadoMail = 'FALSE';
			}
			clienteService.updatePagoRealizadoMail(userId, valuepagoRealizadoMail).then(function() {
				$scope.dataloadingPagoRealizadoMail = false;
				$scope.desabilitarGuardarConfiguracion = false;
			});
		}
		$scope.actualizarRecordarPagoSms = function() {
			$scope.dataloadingRecordarPagoSms = true;
			$scope.configuracionActualizada = false;
			$log.info('$scope.recordarPagoSms.value1: ', $scope.recordarPagoSms.value1);
			if ($scope.recordarPagoSms.value1 === true) {
				valueRecordarPagoSms = 'TRUE';
			} else if ($scope.recordarPagoSms.value1 === false) {
				valueRecordarPagoSms = 'FALSE';
			}
			clienteService.updateRecordarPagoSms(userId, valueRecordarPagoSms).then(function() {
				$scope.dataloadingRecordarPagoSms = false;
				$scope.desabilitarGuardarConfiguracion = false;
			});
		}
		$scope.actualizarRecordarPagoMail = function() {
			$scope.dataloadingRecordarPagoMail = true;
			$scope.configuracionActualizada = false;
			$log.info('$scope.recordarPagoMail.value1: ', $scope.recordarPagoMail.value1);
			if ($scope.recordarPagoMail.value1 === true) {
				valueRecordarPagoMail = 'TRUE';
			} else if ($scope.recordarPagoMail.value1 === false) {
				valueRecordarPagoMail = 'FALSE';
			}
			clienteService.updateRecordarPagoMail(userId, valueRecordarPagoMail).then(function() {
				$scope.dataloadingRecordarPagoMail = false;
				$scope.desabilitarGuardarConfiguracion = false;
			});
		}
		$scope.actualizarGeneralesSms = function() {
			$scope.dataloadingGeneralesSms = true;
			$scope.configuracionActualizada = false;
			$log.info('$scope.generalesSms.value1: ', $scope.generalesSms.value1);
			if ($scope.generalesSms.value1 === true) {
				valueGeneralesSms = 'TRUE';
			} else if ($scope.generalesSms.value1 === false) {
				valueGeneralesSms = 'FALSE';
			}
			clienteService.updateGeneralesSms(userId, valueGeneralesSms).then(function() {
				$scope.dataloadingGeneralesSms = false;
				$scope.desabilitarGuardarConfiguracion = false;
			});
		}
		$scope.actualizarGeneralesMail = function() {
			$scope.dataloadingGeneralesMail = true;
			$scope.configuracionActualizada = false;
			$log.info('$scope.generalesMail.value1: ', $scope.generalesMail.value1);
			if ($scope.generalesMail.value1 === true) {
				valueGeneralesMail = 'TRUE';
			} else if ($scope.generalesMail.value1 === false) {
				valueGeneralesMail = 'FALSE';
			}
			clienteService.updateGeneralesMail(userId, valueGeneralesMail).then(function() {
				$scope.dataloadingGeneralesMail = false;
				$scope.desabilitarGuardarConfiguracion = false;
			});
		}
		$scope.diasRecordarPago = function() {
			$scope.dataloadingDiaspago = true;
			$scope.configuracionActualizada = false;
			$log.info('dataDias.selectedOption: ', $scope.dataDias.selectedOption.value);
			clienteService.updateDiasRecordar(userId, $scope.dataDias.selectedOption.value).then(function() {
				$scope.dataloadingDiaspago = false;
				$scope.desabilitarGuardarConfiguracion = false;
			});
		}
		$scope.configuracionActualizada = false;
		$scope.guardarConfiguracion = function() {
			$scope.dataloadingGuardar = true;
			notificacionesService.enviarNotificacion(userId, 3).then(function() {
				$scope.dataloadingGuardar = false;
				$log.info('===Notificacion 3 Enviada');
				$scope.desabilitarGuardarConfiguracion = true;
				$scope.configuracionActualizada = true;
			});
		};
		$scope.currentNavItem = 'page1';

	}]);