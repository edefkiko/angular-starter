angular.module('solicitudPrestamo')
	.factory('Condiciones', ['datosCondicionesService', '_', '$log', 'CLIENT_STATUS', '$q', 'clienteService', function(datosCondicionesService, _, $log, CLIENT_STATUS, $q, clienteService) {
		function Condiciones(datosCondiciones) {
			this.customInformation = [];
			this.addCustomInformation = function(name, value) {
				if (!_.isEmpty(value)) {
					this.customInformation.push({
						customFieldID: name,
						value: value
					});
				}
			};


			var tipoPago;
			if (datosCondiciones.dispersionCuentas === 'electronica') {
				tipoPago = "Transferencia electrónica";
			} else if (datosCondiciones.dispersionCuentas === 'ordenPago') {
				tipoPago = "Orden de pago";
			}
			$log.info('tipoPago: ', tipoPago);
			this.addCustomInformation('Dispersion_Cuentas_de_Prestamo', tipoPago);
			$log.info('datosCondiciones.dispersionCuentas:', datosCondiciones.dispersionCuentas);
			if (datosCondiciones.dispersionCuentas === 'electronica') {
				this.addCustomInformation('Banco_Cuentas_de_Prestamo', datosCondiciones.banco);
				this.addCustomInformation('CLABE_Cuentas_de_Prestamo', datosCondiciones.clabeCuenta);
			}
			var pagoPrestamoOpc;
			if (datosCondiciones.pagoPrestamoDomiciliacion === 'siDomiciliacion') {
				pagoPrestamoOpc = 'Domiciliación';
				this.addCustomInformation('Pago_Cuentas_de_Prestamo', pagoPrestamoOpc);
			}
			$log.info('pagoPrestamoOpc: ', pagoPrestamoOpc);


		};
		Condiciones.prototype.actualizar = function(loanId) {
			return datosCondicionesService.actualizaDatosCondiciones(loanId, this);

		};

		return Condiciones;
	}]);