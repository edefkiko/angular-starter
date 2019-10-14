angular.module('solicitudPrestamo')
.factory('DatosGenerales', ['datosGeneralesService', '_', '$log', 'CLIENT_STATUS', '$q', 'clienteService', 'LoginService', 'Solicitud', 'ProductoPadre', 'Cliente', 'localStorageService', function(datosGeneralesService, _, $log, CLIENT_STATUS, $q, clienteService, LoginService, Solicitud, ProductoPadre, Cliente, localStorageService){
	function DatosGenerales(generales, solicitud, cliente){	
			$log.info('solicitudModel:.', solicitud);
			$log.info('encodedKeyModel', cliente.encodedKey);

			this.loanAccount = {};
			this.datosGenerales = {};
	        $log.info('generalesModel: ) ', generales);
	        var TypeKey;
	        if (generales.pagosAnticipados === 'monto') {
			    TypeKey = ProductoPadre.getEncodedKeyProductoMonto();
			}else if (generales.pagosAnticipados === 'plazo') {
				TypeKey = ProductoPadre.getEncodedKeyProductoPlazo();
			}
			$log.info('TypeKey: ',TypeKey);
			$log.info('ProductoPadre: ', ProductoPadre.getEncodedKeyProductoMonto());

			var accountHolderTypeId = 'CLIENT';
			$log.info('cliente.client.encodedKey:', cliente.encodedKey);
			$log.info('TypeKey:', TypeKey);
			$log.info('solicitud.monto:', solicitud.monto);
			$log.info('accountHolderTypeId:', accountHolderTypeId);
			$log.info('solicitud.plazo:', solicitud.plazo);
			$log.info('solicitud.peridoPagos:', solicitud.peridoPagos);           
            $log.info('solicitud.frecuencia: ',solicitud.frecuenciaEn);
            $log.info('solicitud.tasa: ',solicitud.tasa);


			this.loanAccount.accountHolderKey = cliente.encodedKey;
			this.loanAccount.productTypeKey = TypeKey;
			this.loanAccount.loanAmount = solicitud.monto;
			this.loanAccount.accountHolderType = accountHolderTypeId;
			this.loanAccount.repaymentInstallments = solicitud.plazo;
		    this.loanAccount.repaymentPeriodCount = solicitud.peridoPagos;
			this.loanAccount.repaymentPeriodUnit = solicitud.frecuenciaEn;
			this.loanAccount.interestRate = solicitud.tasa;	

	};
	 DatosGenerales.prototype.actualizar = function(clientId, solicitudActiva){
      var deferred = $q.defer();  
      var self = this;
      new Cliente({id: clientId}).inactiveState().then(function(){

        datosGeneralesService.actualizaDatosGenerales(clientId, self).then(function(result){
        solicitudActiva.idPrestamo = result.loanAccount.id;
        
        var solicitud = new Solicitud(solicitudActiva);
        
        solicitud.update(clientId).then(function(){
          localStorageService.set('solicitud', solicitudActiva);

          deferred.resolve(result);
        });


      },function(result){
        deferred.reject(result);
      });

      });     


    return deferred.promise;

  };

    return DatosGenerales;
}]);

