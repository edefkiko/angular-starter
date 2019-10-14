angular.module('client')
.factory('Prestamo', ['prestamosService', '$q', 'CLIENT_STATUS', 'StatusService', 'clienteService','$log', function(prestamosService, $q, CLIENT_STATUS, StatusService, clienteService, $log){
  
  function Prestamo(prestamo){ 
    if(!_(prestamo).isEmpty()){
      this.id = prestamo.id;  
    }    
  }

  Prestamo.prototype.disbursment = function(){  
    var self = this;
    var deferred = $q.defer();

    prestamosService.updateState(self.id, "PENDING_APPROVAL").then( function(){
      
      prestamosService.updateState(self.id, "APPROVAL").then( function(){
        
        prestamosService.updateState(self.id, "DISBURSMENT").then( function(){
          
          deferred.resolve(true);

        }, function(err){
          $log.error('disbursment [DISBURSMENT] error', err);
        } );

      }, function(err){
        $log.error('disbursment [APPROVAL] error', err);
      } );

    }, function(err){
      $log.error('disbursment [PENDING_APPROVAL] error', err);
    } );

    return deferred.promise;
  };

  Prestamo.prototype.getLastClosedLoan = function(userId){  
    var self = this;
    var deferred = $q.defer();
    var fullDetails = true;

    prestamosService.getLoansByClientId(userId, fullDetails).then(function(prestamos){

          var lastLoanClosedIndex = _.findLastIndex(prestamos, {accountState: "CLOSED"});
          
          if(lastLoanClosedIndex >= 0){
            deferred.resolve(parseToPrestamo(prestamos[lastLoanClosedIndex]));
          }else{
            deferred.reject('No se obtuvieron préstamos CERRADOS');
          }
    });

    return deferred.promise;
  }

  Prestamo.prototype.esTransferenciaLaDispersion = function(){  
    var self = this;
    var deferred = $q.defer();

    prestamosService.obtenerCustomInformation(this.id, 'Dispersion_Cuentas_de_Prestamo').then(function(customField){
      deferred.resolve(_('Transferencia electrónica').isEqual(customField[0].value));
    });

    return deferred.promise;
  }

  Prestamo.prototype.disbursmentFromServer = function(clienteId, solicitudId){  
    var self = this;
    var deferred = $q.defer();

    prestamosService.disbursment(clienteId, solicitudId).then(function(response){
      deferred.resolve(response);
    });

    return deferred.promise;
  };

  function traslateFrecuencia(value, periodo) {
   var result;
    if (_('WEEKS').isEqual(value)) {
      result = 'SEMANA';
    } else if (_('DAYS').isEqual(value)) {
      if (periodo === 15) {
        result = 'QUINCENA';
      } else if (periodo === 30) {
        result = 'MES'
      }
    } else {
      result = value;
    }

    return result;
  }


  

  function parseToPrestamo(loan){
    var prestamo = {};
    prestamo.id = loan.id;
    prestamo.monto = loan.loanAmount;
    prestamo.tasa = loan.interestRate;
    prestamo.frecuencia = traslateFrecuencia(loan.repaymentPeriodUnit, loan.repaymentPeriodCount);
    prestamo.plazo = loan.repaymentInstallments;
    prestamo.periodo = loan.repaymentPeriodCount;
    prestamo.maxDiasAtraso = 0;
    _(loan.customFieldValues).each( function(field) {
      //$log.debug('clientData.customInformation.field', field);
    
          if(_(field.customFieldID).isEqual('Maximo_Dias_Cuentas_de_Prestamo')){              
            prestamo.maxDiasAtraso = parseInt(field.value) | 0;
          }

      });
    
    $log.debug('parseToPrestamo -> prestamo', prestamo);

    return prestamo;
  }



  Prestamo.prototype.esBuenPagador = function(maxDiasAtraso){ 

    if (maxDiasAtraso < 8) {
      return true;
    } else {
      return false;
    }

  };

  Prestamo.prototype.esUsuarioPromedio = function(maxDiasAtraso){ 

    if (maxDiasAtraso < 46) {
      return true;
    } else {
      return false;
    }

  };

  Prestamo.prototype.isIfeValid = function(vigencia){
    var date = new Date();
    date.setHours(0,0,0,0);

    $log.log('vigencia',  vigencia , _(vigencia).isEmpty(), moment(date).isSameOrBefore(vigencia), date);
    if(_(vigencia).isEmpty()){
      return false;
    }


    return moment(date).isSameOrBefore(vigencia);    
  }
  
  
  return Prestamo;

}]);