angular.module('solicitudPrestamo')
	.factory('DatosLaborales', ['datosLaboralesService', '_', '$log', 'CLIENT_STATUS', '$q', 'Cliente', 'Solicitud', 'LoginService', function(datosLaboralesService, _, $log, CLIENT_STATUS, $q, Cliente, Solicitud, LoginService) {

		function DatosLaborales(laborales) {
			this.customInformation = [];
			this.addCustomInformation = function(name, value) {
				if (!_.isEmpty(value) || _(value).isNumber()) {
					this.customInformation.push({
						customFieldID: name,
						value: value
					});
				}
			};
			$log.info('laborales', laborales);
			var trabajoActualCliente;
			if (laborales.trabajoActual === 'trabajoEmpresa') {
				trabajoActualCliente = 'Sí, en empresa o negocio';
			} else if (laborales.trabajoActual === 'trabajoIndependiente') {
				trabajoActualCliente = 'Sí, soy trabajador independiente';
			} else if (laborales.trabajoActual === 'noTrabaja') {
				trabajoActualCliente = 'No';
			}
			this.addCustomInformation('Tipo_Trabajo_Cliente', trabajoActualCliente);
			this.addCustomInformation('Dependientes_Economicos_Clientes', String(laborales.dependientes));
			this.addCustomInformation('Sin_Trabajo_Clientes', laborales.situacionActual);
			this.addCustomInformation('Destino_Credito_Clientes', laborales.destinoPrestamo);
			this.addCustomInformation('Giro_Empresa_Clientes', laborales.giroEmpresa);
			this.addCustomInformation('Nombre_Empresa_Clientes', laborales.nombreEmpresa);
			this.addCustomInformation('Puesto_Trabajo_Clientes', laborales.puesto);
			this.addCustomInformation('Area_Clientes', laborales.areaClientes);
			this.addCustomInformation('Actividad_Economica_Clientes', laborales.actividadClientes);
			if (laborales.antiguedadAniosClientes || laborales.antiguedadCliente === '0') {
				this.addCustomInformation('Antiguedad_Años_Clientes', laborales.antiguedadCliente);
			}
			if (laborales.antiguedadNegocio || laborales.aniosClienteNegocio === '0') {
				this.addCustomInformation('Negocio_Anos_Clientes', laborales.aniosClienteNegocio);
			}
			if (laborales.sueldo) {
				this.addCustomInformation('Sueldo_Clientes', laborales.sueldoClientes);
			}

			if (laborales.gasto) {
				this.addCustomInformation('Gasto_Clientes', laborales.gastoClientes);
			}
			this.addCustomInformation('ID_Solicitud_Laboral_Cliente', LoginService.currentUser().idSolicitud);

		};


		DatosLaborales.prototype.actualizar = function(clientId) {
			return datosLaboralesService.actualizaDatosLaborales(clientId, this);
		};
		$log.info('DatosLaborales', DatosLaborales);
		return DatosLaborales;
	}]);