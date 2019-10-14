angular.module('client')
  .factory('Solicitud', ['solicitudService', '$q', 'CLIENT_STATUS', 'StatusService', 'clienteService', 'localStorageService', '$log', 'deviceDetector', function(solicitudService, $q, CLIENT_STATUS, StatusService, clienteService, localStorageService, $log, deviceDetector) {

    function Solicitud(solicitud) {
      this.customInformation = [];

      if (_(solicitud).isEmpty()) {
        $log.error('No existe una solitud valida para instanciar');
      } else {
        this.id = solicitud.id;
        this.index = solicitud.customFieldSetGroupIndex;
        this.setData(solicitud);
      }

    }

    Solicitud.prototype.setId = function(id) {
      this.id = id;
    };

    Solicitud.prototype.translateFrecuencia = function(frecuencia) {
      var frecuenciaEn;
      if (_('SEMANA').isEqual(frecuencia)) {
        frecuenciaEn = 'WEEKS';
      } else if (_('QUINCENA').isEqual(frecuencia)) {
        frecuenciaEn = 'DAYS';
        periodo = 15;
      } else if (_('MES').isEqual(frecuencia)) {
        frecuenciaEn = 'MONTHS';
      } else {
        frecuenciaEn = frecuencia;
      }

      return frecuenciaEn;
    };

    Solicitud.prototype.addCustomInformation = function(name, value, index) {
      if (!_(value).isEmpty() || _(value).isNumber()) {

        var entity = {
          customFieldID: name,
          value: value
        };

        if (_(index).isNumber()) {
          _.extend(entity, {
            customFieldSetGroupIndex: index
          });
        }

        this.customInformation.push(entity);

      }
    };

    Solicitud.prototype.getCustomField = function(name) {
      return _(this.customInformation).find(function(customField) {
        if (_(name).isEqual(customField.customFieldID)) {
          return customField;
        }
      })
    };

    Solicitud.prototype.setData = function(solicitud) {
      this.addCustomInformation('ID_Solicitud_Clientes', solicitud.id, this.index);
      this.addCustomInformation('Monto_Solicitud_Clientes', solicitud.monto, this.index);
      this.addCustomInformation('Monto_Solicitud_Clientes_Motor', solicitud.montoMotor, this.index);
      this.addCustomInformation('Plazo_Solicitud_Clientes', solicitud.plazo, this.index);
      this.addCustomInformation('Frecuencia_Solicitud_Clientes', solicitud.frecuenciaEn, this.index);
      this.addCustomInformation('Fecha_Aut_Clientes', solicitud.fechaAutoConsultaBuro, this.index);
      this.addCustomInformation('Fechacons_Clientes', solicitud.fechaConsultaBuro, this.index);
      this.addCustomInformation('Folio_SIC_Clientes', solicitud.folioSic, this.index);
      this.addCustomInformation('Score_Clientes', solicitud.scoreBuro, this.index);
      this.addCustomInformation('Sin_Hist_Clientes', solicitud.sinHistorial, this.index);
      this.addCustomInformation('MOP_Clientes', solicitud.claveMop, this.index);
      this.addCustomInformation('Aut_Buro_Clientes', solicitud.autoConsultaBuro, this.index);
      this.addCustomInformation('ICC_Clientes', solicitud.icc, this.index);
      this.addCustomInformation('Clave_Obs_Clientes', solicitud.claveObservacion, this.index);
      this.addCustomInformation('Tasa_Solicitud_Clientes', solicitud.tasa, this.index);
      this.addCustomInformation('Estatus_Solicitud_Clientes', solicitud.estatusSolicitud, this.index);
      this.addCustomInformation('ID_Prestamo_Clientes', solicitud.idPrestamo, this.index);
      this.addCustomInformation('Tiempo_Solicitud_Clientes', solicitud.tiempoSolicitud, this.index);
      this.addCustomInformation('Dispositivo_Solicitud_Clientes', solicitud.dispositivoUsado, this.index);
      this.addCustomInformation('Estatus_Cliente', solicitud.estatusCliente, this.index);
      this.addCustomInformation('Fecha_Inicio_Sol_Clientes', solicitud.fechaInicio, this.index);
      this.addCustomInformation('Periodo_Pagos_Clientes', solicitud.peridoPagos, this.index);
      this.addCustomInformation('FuncionP_Clientes', solicitud.funcionPublica, this.index);
      this.addCustomInformation('RelacionF_Clientes', solicitud.relacionPublica, this.index);
      
      this.addCustomInformation('ProveedorR_Clientes', solicitud.proveedor, this.index);
      this.addCustomInformation('PropietarioR_Clientes', solicitud.propietario, this.index);
      this.addCustomInformation('PropietarioR_Clientes_Name', solicitud.propietarioRecursos, this.index);

      this.addCustomInformation('Palabra_Selfie_Clientes', solicitud.palabraSelfie, this.index);
      this.addCustomInformation('Contrato_Firmado_Clientes', solicitud.contratoFirmado, this.index);
      this.addCustomInformation('Tasa_Solicitud_Clientes_Motor', solicitud.tasaSolicitudMotor, this.index);
      this.addCustomInformation('Monto_Solicitud_Clientes_Motor', solicitud.montoSolicitudMotor, this.index);

      this.addCustomInformation('Cargo_Politico_Clientes', solicitud.cargoPolitico, this.index);
      this.addCustomInformation('Nombre_Funcionario_Clientes', solicitud.relNomfuncionario, this.index);
      this.addCustomInformation('Funcionario_Relacionado_Clientes', solicitud.relPuestoFuncionario, this.index);

      this.addCustomInformation('Selfie_Clientes', solicitud.selfie, this.index);
      this.addCustomInformation('IFE_INE_Clientes', solicitud.ife, this.index);
      this.addCustomInformation('Comprobante_Dom_Clientes', solicitud.comprobante, this.index);
      this.addCustomInformation('Comprobante_Estado_Cuenta', solicitud.edoCuenta, this.index);
      this.addCustomInformation('Docs_Faltantes_Clientes', solicitud.docFaltantes, this.index);
      this.addCustomInformation('Acepto_Enviar_Documentos', solicitud.aceptoEnviarDocs, this.index);
    }

    Solicitud.prototype.setInitialData = function() {
      this.addCustomInformation('ID_Solicitud_Clientes', new Date().getTime().toString(), this.index);
      this.addCustomInformation('Estatus_Solicitud_Clientes', 'Activa', this.index);
      var today = new Date();
      var fechaInicio = moment(today).format("YYYY-MM-DD");
      this.addCustomInformation('Fecha_Inicio_Sol_Clientes', fechaInicio, this.index);
      this.addCustomInformation('Dispositivo_Solicitud_Clientes', getDeviceInfo(), this.index);

      $log.debug('fechaInicio', fechaInicio);
      $log.debug('getDeviceInfo', getDeviceInfo());
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

    Solicitud.prototype.updateStatusCliente = function(clientID) {
      var deferred = $q.defer();

      var fieldName = "Estatus_Cliente";

      var customInformation = {
        customInformation: [this.getCustomField(fieldName)]
      }

      solicitudService.updateCustomField(clientID, customInformation).then(function(result) {
        if (result && result.errorSource) {
          deferred.reject(result);
        } else {
          deferred.resolve(result);
        }
      });
      return deferred.promise;
    }

    Solicitud.prototype.firmar = function(clientID) {
      var deferred = $q.defer();

      var fieldName = "Estatus_Cliente";
      var fieldName2 = "Estatus_Solicitud_Clientes";
      var fieldName3 = "Contrato_Firmado_Clientes";
      var customInformation = {
        customInformation: [this.getCustomField(fieldName), this.getCustomField(fieldName2), this.getCustomField(fieldName3)]
      }

      solicitudService.updateCustomField(clientID, customInformation).then(function(result) {
        if (result && result.errorSource) {
          deferred.reject(result);
        } else {
          deferred.resolve(result);
        }
      });
      return deferred.promise;
    }

    Solicitud.prototype.updateSelfieWord = function(clientID) {
      var deferred = $q.defer();

      var fieldName = "Palabra_Selfie_Clientes";

      var customInformation = {
        customInformation: [this.getCustomField(fieldName)]
      }

      solicitudService.updateCustomField(clientID, customInformation).then(function(result) {
        if (result && result.errorSource) {
          deferred.reject(result);
        } else {
          deferred.resolve(result);
        }
      });
      return deferred.promise;
    }

    Solicitud.prototype.updateDocumentStatus = function(clientID, type) {
      var deferred = $q.defer();
      var field;
      switch (type) {
        case 'selfie':
          field = "Selfie_Clientes";
          break;
        case 'ife':
          field = "IFE_INE_Clientes";
          break;
        case 'comprobante':
          field = "Comprobante_Dom_Clientes";
          break;
        case 'edoCuenta':
            field = "Comprobante_Estado_Cuenta";
            break;
        default:
          $log.error('Tipo de documento a checar es incorrecto', type);
      }
      var customInformation = {
        customInformation: [
          this.getCustomField(field)
        ]

      }

      solicitudService.updateCustomField(clientID, customInformation).then(function(result) {
        if (result && result.errorSource) {
          deferred.reject(result);
        } else {
          deferred.resolve(result);
        }
      });
      return deferred.promise;
    }



    Solicitud.prototype.updateFuncionPublica = function(clientID) {
      var deferred = $q.defer();
      $log.info('En updateFuncionPublica');

      var fieldName = "FuncionP_Clientes";
      var fieldName2 = "RelacionF_Clientes";

      var cargoPolitico = "Cargo_Politico_Clientes";
      var relNomfuncionario = "Nombre_Funcionario_Clientes";
      var relPuestoFuncionario = "Funcionario_Relacionado_Clientes";
      var parentRelFuncionario = "Parentesco_Funcionario_Clientes";

      var proveedor = "ProveedorR_Clientes";
      var propietario = "PropietarioR_Clientes";
      var propietarioRecursos = "PropietarioR_Clientes_Name";

      var customInformation = {
        customInformation: [
          this.getCustomField(fieldName),
          this.getCustomField(fieldName2),
          this.getCustomField(cargoPolitico),
          this.getCustomField(relNomfuncionario),
          this.getCustomField(relPuestoFuncionario),
          this.getCustomField(parentRelFuncionario),
          this.getCustomField(proveedor),
          this.getCustomField(propietario),
          this.getCustomField(propietarioRecursos)
        ]
      };
      $log.info('customInformation', customInformation);


      solicitudService.updateCustomField(clientID, customInformation).then(function(result) {
        if (result && result.errorSource) {
          deferred.reject(result);
        } else {
          deferred.resolve(result);
        }
      });
      return deferred.promise;
    }
    Solicitud.prototype.actualizarSolicitudPrestamo = function(clientID) {
      var self = this;
      console.info('solicitudModel', this);
      var deferred = $q.defer();
      $log.info('En actualizarSolicitudPrestamo');

      var fieldName = "Monto_Solicitud_Clientes";
      var fieldName2 = "Frecuencia_Solicitud_Clientes";
      var fieldName3 = "Periodo_Pagos_Clientes";
      var fieldName4 = "Plazo_Solicitud_Clientes";
      var fieldName5 = "Tasa_Solicitud_Clientes";


      var customInformation = {
        customInformation: [self.getCustomField(fieldName), self.getCustomField(fieldName2), self.getCustomField(fieldName3), self.getCustomField(fieldName4), self.getCustomField(fieldName5)]
      };
      $log.info('customInformation', customInformation);


      solicitudService.updateCustomField(clientID, customInformation).then(function(result) {
        if (result && result.errorSource) {
          deferred.reject(result);
        } else {
          deferred.resolve(result);
        }
      });
      return deferred.promise;
    }

    Solicitud.prototype.update = function(clientID) {
      var deferred = $q.defer();

      solicitudService.updateStatusCliente(clientID, this).then(function(result) {
        if (result && result.errorSource) {
          deferred.reject(result);
        } else {
          deferred.resolve(result);
        }
      });
      return deferred.promise;
    }

    Solicitud.prototype.getSolicitudById = function(clientID) {
      var deferred = $q.defer();
      var self = this
      clienteService.getProfile(clientID).then(function(result) {
        if (result && result.errorSource) {
          deferred.reject({});
        } else {
          var solicitudes = self.mapToSolicitud(result.customInformation);
          $log.debug('solicitudes', solicitudes);

          if (_(solicitudes).size() > 0) {

            var solicitud = _(solicitudes).find(function(solicitud) {

              if (!_(solicitud.id).isEmpty() && _(self.id.toString()).isEqual(solicitud.id.toString())) {
                return solicitud;
              }
            })

            self.setSolicitudOnMemory(solicitud);

            deferred.resolve(solicitud);
          } else {
            deferred.resolve({});
          }
        }
      });

      return deferred.promise;
    }


    Solicitud.prototype.create = function(clientID) {
      var deferred = $q.defer();
      var self = this;

      this.setInitialData();

      solicitudService.create(clientID, this).then(function(result) {
        if (result && result.errorSource) {
          deferred.reject(result);
        } else {
          var id = self.getCustomField('ID_Solicitud_Clientes').value;
          deferred.resolve(id);
        }
      });
      return deferred.promise;
    }

    Solicitud.prototype.getStatusCliente = function(clientID) {
      var deferred = $q.defer();
      clienteService.getStatusCliente(clientID, this.this.index).then(function(result) {
        if (result && result.errorSource) {
          deferred.reject(result);
        } else {
          deferred.resolve(StatusService.getFullStatusByValue(result[this.index].value));
        }
      });
      return deferred.promise;
    }

    Solicitud.prototype.getLastSolicitud = function(clientID) {
      var self = this;
      var deferred = $q.defer();

      getSolicitudFromBackend(clientID, self).then(function(solicitudes) {
        var lastActiveIndex = _.findLastIndex(solicitudes, {
          estatusSolicitud: "Completa"
        });
        deferred.resolve(solicitudes[lastActiveIndex]);
      });

      return deferred.promise;
    }

    Solicitud.prototype.getSolicitudActiva = function(clientID, checkMambu) {
      var self = this;
      var deferred = $q.defer();

      if (_(checkMambu).isUndefined()) {
        checkMambu = false;
      }

      if (_(true).isEqual(checkMambu) || _(this.index).isUndefined()) {

        getSolicitudFromBackend(clientID, self).then(function(solicitudes) {

          if (_(solicitudes).size() > 0) {

            var solicitud = _(solicitudes).find(function(solicitud) {

              if (!_(solicitud.id).isEmpty() && _(self.id.toString()).isEqual(solicitud.id.toString())) {
                return solicitud;
              }
            })

            self.setSolicitudOnMemory(solicitud);

            deferred.resolve(solicitud);
          } else {
            deferred.resolve({});
          }
        });

      } else {
        deferred.resolve(localStorageService.get('solicitud'));
      }
      return deferred.promise;
    }

    function getSolicitudFromBackend(clientID, context) {
      var deferred = $q.defer();

      clienteService.getProfile(clientID).then(function(result) {
        if (result && result.errorSource) {
          deferred.reject({});
        } else {
          var solicitudes = context.mapToSolicitud(result.customInformation);
          $log.debug('result', solicitudes);

          deferred.resolve(solicitudes);
        }
      });

      return deferred.promise;
    }

    Solicitud.prototype.getSolicitudFromMemory = function() {
      return localStorageService.get('solicitud');
    }

    Solicitud.prototype.setSolicitudOnMemory = function(solicitud) {
      localStorageService.set('solicitud', solicitud);
    }

    Solicitud.prototype.mapToSolicitud = function(fields) {
     $log.info('fields: ', fields);
      var solicitud = [];


      _(fields).each(function(field) {
        if (field.customFieldSetGroupIndex >= 0) {
          if (_(solicitud[field.customFieldSetGroupIndex]).isUndefined()) {
            solicitud[field.customFieldSetGroupIndex] = {};
          }

          solicitud[field.customFieldSetGroupIndex].customFieldSetGroupIndex = field.customFieldSetGroupIndex;

          if (_(field.customFieldID).isEqual('ID_Solicitud_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].id = field.value;
          } else if (_(field.customFieldID).isEqual('Monto_Solicitud_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].monto = parseInt(field.value) | 0;
          } else if (_(field.customFieldID).isEqual('Plazo_Solicitud_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].plazo = parseInt(field.value) | 0;
          } else if (_(field.customFieldID).isEqual('Frecuencia_Solicitud_Clientes')) {
            // var result;

            // if (_('WEEKS').isEqual(field.value)) {
            //   result = 'SEMANA';
            // } else if (_('DAYS').isEqual(field.value)) {
            //   if (solicitud[field.customFieldSetGroupIndex].peridoPagos === 15) {
            //     result = 'QUINCENA';
            //   }else if ( solicitud[field.customFieldSetGroupIndex].peridoPagos === 30) {
            //     result = 'MES'; 
            //   }
            // }
            // else {
            //   result = field.value;
            // }

            // solicitud[field.customFieldSetGroupIndex].frecuencia = result;
            solicitud[field.customFieldSetGroupIndex].frecuenciaEn = field.value;

          } else if (_(field.customFieldID).isEqual('Fecha_Aut_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].fechaAutoConsultaBuro = field.value;
          } else if (_(field.customFieldID).isEqual('Fechacons_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].fechaConsultaBuro = field.value;
          } else if (_(field.customFieldID).isEqual('Folio_SIC_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].folioSic = field.value;
          } else if (_(field.customFieldID).isEqual('Score_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].scoreBuro = field.value;
          } else if (_(field.customFieldID).isEqual('Sin_Hist_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].sinHistorial = field.value;
          } else if (_(field.customFieldID).isEqual('MOP_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].claveMop = field.value;
          } else if (_(field.customFieldID).isEqual('Aut_Buro_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].autoConsultaBuro = field.value;
          } else if (_(field.customFieldID).isEqual('ICC_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].icc = field.value;
          } else if (_(field.customFieldID).isEqual('Clave_Obs_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].claveObservacion = field.value;
          } else if (_(field.customFieldID).isEqual('Tasa_Solicitud_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].tasa = parseInt(field.value) | 0;;
          } else if (_(field.customFieldID).isEqual('Estatus_Solicitud_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].estatusSolicitud = field.value;
          } else if (_(field.customFieldID).isEqual('ID_Prestamo_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].idPrestamo = field.value;
          } else if (_(field.customFieldID).isEqual('Tiempo_Solicitud_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].tiempoSolicitud = field.value;
          } else if (_(field.customFieldID).isEqual('Dispositivo_Solicitud_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].dispositivoUsado = field.value;
          } else if (_(field.customFieldID).isEqual('Estatus_Cliente')) {
            solicitud[field.customFieldSetGroupIndex].estatusCliente = field.value;
          } else if (_(field.customFieldID).isEqual('Fecha_Inicio_Sol_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].fechaInicio = field.value;
          } else if (_(field.customFieldID).isEqual('Periodo_Pagos_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].peridoPagos = parseInt(field.value) | 0;
          } else if (_(field.customFieldID).isEqual('Monto_Solicitud_Clientes_Motor')) {
            solicitud[field.customFieldSetGroupIndex].montoSolicitudMotor = parseInt(field.value) | 0;
          } else if (_(field.customFieldID).isEqual('Tasa_Solicitud_Clientes_Motor')) {
            solicitud[field.customFieldSetGroupIndex].tasaSolicitudMotor = parseInt(field.value) | 0;
          } else if (_(field.customFieldID).isEqual('FuncionP_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].funcionPublica = field.value;
          }  else if (_(field.customFieldID).isEqual('ProveedorR_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].proveedor = field.value;
          }  else if (_(field.customFieldID).isEqual('PropietarioR_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].propietario = field.value;
          }  else if (_(field.customFieldID).isEqual('PropietarioR_Clientes_Name')) {
            solicitud[field.customFieldSetGroupIndex].propietarioRecursos = field.value;
          } else if (_(field.customFieldID).isEqual('Palabra_Selfie_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].palabraSelfie = field.value;
          } else if (_(field.customFieldID).isEqual('Selfie_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].selfie = field.value;
          } else if (_(field.customFieldID).isEqual('IFE_INE_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].ife = field.value;
          } else if (_(field.customFieldID).isEqual('Comprobante_Dom_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].comprobante = field.value;
          } else if (_(field.customFieldID).isEqual('Comprobante_Estado_Cuenta')) {
            solicitud[field.customFieldSetGroupIndex].edoCuenta = field.value;
          } else if (_(field.customFieldID).isEqual('Docs_Faltantes_Clientes')) {
            solicitud[field.customFieldSetGroupIndex].docFaltantes = field.value;
          } else if (_(field.customFieldID).isEqual('Acepto_Enviar_Documentos')) {
            solicitud[field.customFieldSetGroupIndex].aceptoEnviarDocs = field.value;
          }

      $log.info('................... Solicitud:', solicitud.peridoPagos);

        }

      });
       _(fields).each(function(field) {

         if (field.customFieldSetGroupIndex >= 0) {
          if (_(solicitud[field.customFieldSetGroupIndex]).isUndefined()) {
            solicitud[field.customFieldSetGroupIndex] = {};
          }

          solicitud[field.customFieldSetGroupIndex].customFieldSetGroupIndex = field.customFieldSetGroupIndex;

          if (_(field.customFieldID).isEqual('Frecuencia_Solicitud_Clientes')) {
             var result;

            if (_('WEEKS').isEqual(field.value)) {
              result = 'SEMANA';
            } else if (_('DAYS').isEqual(field.value)) {
              if (solicitud[field.customFieldSetGroupIndex].peridoPagos === 15) {
                result = 'QUINCENA';
              }else if ( solicitud[field.customFieldSetGroupIndex].peridoPagos === 30) {
                result = 'MES'; 
              }
            }
            else {
              result = field.value;
            }

            solicitud[field.customFieldSetGroupIndex].frecuencia = result;
          }
        }

       });

      return solicitud;
    }


    //TODO: Solo se utlizará para la Demo
    Solicitud.prototype.actualizaMontoAndTasaMotor = function(clientID) {
      var self = this;
      console.info('solicitudModel', this);
      var deferred = $q.defer();
      $log.info('En actualizarSolicitudPrestamo');

      var fieldName = "Monto_Solicitud_Clientes_Motor";
      var fieldName2 = "Tasa_Solicitud_Clientes_Motor";
      var fieldName3 = "Estatus_Cliente";


      var customInformation = {
        customInformation: [self.getCustomField(fieldName), self.getCustomField(fieldName2), self.getCustomField(fieldName3)]
      };

      $log.info('customInformation', customInformation);


      solicitudService.updateCustomField(clientID, customInformation).then(function(result) {
        if (result && result.errorSource) {
          deferred.reject(result);
        } else {
          deferred.resolve(result);
        }
      });
      return deferred.promise;
    }

    Solicitud.prototype.setDocFaltatesToTrue = function(clientID) {
      var self = this;
      var deferred = $q.defer();

      var fieldName = "Docs_Faltantes_Clientes";

      var customInformation = {
        customInformation: [self.getCustomField(fieldName)]
      };

      solicitudService.updateCustomField(clientID, customInformation).then(function(result) {
        if (result && result.errorSource) {
          deferred.reject(result);
        } else {
          deferred.resolve(result);
        }
      });
      return deferred.promise;
    }

    Solicitud.prototype.setAceptSendDocs = function(clientID) {
      var self = this;
      var deferred = $q.defer();

      var fieldName = "Acepto_Enviar_Documentos";

      var customInformation = {
        customInformation: [self.getCustomField(fieldName)]
      };

      solicitudService.updateCustomField(clientID, customInformation).then(function(result) {
        if (result && result.errorSource) {
          deferred.reject(result);
        } else {
          deferred.resolve(result);
        }
      });
      return deferred.promise;
    }

    return Solicitud;

  }]);