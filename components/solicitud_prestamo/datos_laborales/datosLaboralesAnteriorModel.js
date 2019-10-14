angular.module('solicitudPrestamo')
	.factory('DatosLaboralesAnterior', ['datosLaboralesService', '_', '$log', 'CLIENT_STATUS', '$q', 'Cliente', 'LoginService', 'clienteService', function(datosLaboralesService, _, $log, CLIENT_STATUS, $q, Cliente, LoginService, clienteService) {

		function DatosLaboralesAnterior(profile) {
			$log.info('En DatosLaboralesAnterior: ', profile);
			this.customInformation = [];
			this.addCustomInformation = function(name, value) {
				if (!_.isEmpty(value) || _(value).isNumber()) {
					this.customInformation.push({
						customFieldID: name,
						value: value
					});
				}
			};
			this.addCustomInformation('Puesto_Anterior_Clientes', profile.PuestoTrabajoClientes);
			this.addCustomInformation('Area_Anterior_Clientes', profile.AreaClientes);
			this.addCustomInformation('Giro_Empresa_Anterior_Clientes', profile.GiroEmpresaClientes);
			this.addCustomInformation('Empresa_Anterior_Clientes', profile.NombreEmpresaClientes);
			this.addCustomInformation('Sueldo_Anterior_Clientes', profile.SueldoClientes);
			this.addCustomInformation('Gasto_Anterior_Clientes', profile.GastoClientes);
			this.addCustomInformation('Dependientes_Anteriores_Clientes', profile.DependientesEconomicosClientes);
			this.addCustomInformation('Destino_Cred_Anterior_Clientes', profile.DestinoCreditoClientes);
			this.addCustomInformation('Actividad_Ec_Anterior_Clientes', profile.ActividadEconomicaClientes);
			this.addCustomInformation('Sin_Trabajo_Anterior_Clientes', profile.SinTrabajoClientes);
			this.addCustomInformation('Antig_Años_Anterior_Clientes', profile.AntiguedadAñosClientes);
			this.addCustomInformation('Negocio_Anterior_Clientes', profile.NegocioAnosClientes);
			this.addCustomInformation('Tipo_Trabajo_Anterior_Cliente', profile.TipoTrabajoCliente);
			this.addCustomInformation('ID_Solicitud_Lab_Ant_Cliente', profile.iDSolicitudClientes);

		};


		DatosLaboralesAnterior.prototype.actualizar = function(clientId, laborales) {
			datosLaboralesService.actualizaDatosLaborales(clientId, this).then(function() {
				$log.info('laborales delete: ', laborales);
				//en empresa

				if (_(laborales.antiguedadCliente).isEmpty() || laborales.antiguedadCliente === "null") {
					$log.info('===Borrando Antiguedad_Años_Clientes ...');
					clienteService.deleteAntiguedad_Años_Clientes(clientId).then(function() {
						$log.info('Antiguedad_Años_Clientes Borrado');
					});
				}

				if (_(laborales.areaClientes).isEmpty()) {
					$log.info('===Borrando Area_Clientes ...');
					clienteService.deleteArea_Clientes(clientId).then(function() {
						$log.info('Area_Clientes Borrado');
					});
				}

				if (_(laborales.giroEmpresa).isEmpty()) {
					$log.info('===Borrando GiroEmpresaClientes ...');
					clienteService.deleteNombreEmpresaClientes(clientId).then(function() {
						$log.info('GiroEmpresaClientes Borrado');
					});
				}
				if (_(laborales.nombreEmpresa).isEmpty()) {
					$log.info('===Borrando NombreEmpresaClientes ...');
					clienteService.deleteGiroEmpresaClientes(clientId).then(function() {
						$log.info('NombreEmpresaClientes Borrado');
					});
				}
				if (_(laborales.puesto).isEmpty()) {
					$log.info('===Borrando Puesto_Trabajo_Clientes ...');
					clienteService.deletePuestoTrabajoClientes(clientId).then(function() {
						$log.info('Puesto_Trabajo_Clientes Borrado');
					});
				}
				if (_(laborales.sueldo).isEmpty()) {
					$log.info('===Borrando Sueldo_Clientes ...');
					clienteService.deleteSueldo_Clientes(clientId).then(function() {
						$log.info('Sueldo_Clientes Borrado');
					});
				}
				if (_(laborales.gasto).isEmpty()) {
					$log.info('===Borrando Gasto_Clientes ...');
					clienteService.deleteGasto_Clientes(clientId).then(function() {
						$log.info('Gasto_Clientes Borrado');
					});
				}
				//negocio
				if (_(laborales.actividadClientes).isEmpty()) {
					$log.info('===Borrando ActividadEconomicaClientes ...');
					clienteService.deleteActividadEconomicaClientes(clientId).then(function() {
						$log.info('ActividadEconomicaClientes Borrado');
					});
				}
				$log.info('laborales.antiguedadNegocio: ', laborales.antiguedadNegocio);
				if (_(laborales.aniosClienteNegocio).isEmpty() || laborales.aniosClienteNegocio === "null") {
					$log.info('===Borrando Negocio_Anos_Clientes ...');
					clienteService.deleteNegocio_Anos_Clientes(clientId).then(function() {
						$log.info('Negocio_Anos_Clientes Borrado');
					});
				}

				//no trabja
				if (_(laborales.situacionActual).isEmpty()) {
					$log.info('===Borrando Sin_Trabajo_Clientes ...');
					clienteService.deleteSin_Trabajo_Clientes(clientId).then(function() {
						$log.info('Sin_Trabajo_Clientes Borrado');
					});
				}


			});

		};
		$log.info('DatosLaborales', DatosLaboralesAnterior);
		return DatosLaboralesAnterior;

	}]);