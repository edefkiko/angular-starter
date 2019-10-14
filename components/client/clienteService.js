angular.module('client')
.factory('clienteService', function($http, $q, EnvironmentConfig, $log){
  var apiUrl = EnvironmentConfig.backend + '/rest/mambuServicio/';
  var apiUrlPublic = EnvironmentConfig.backend + '/rest/clienteServicio/';
  var SUCCESS_CODE = 200;
  var OK_CODE = 201;

  function validResponse(deferred, response, status){
    if(_(SUCCESS_CODE).isEqual(status) || _(OK_CODE).isEqual(status)  && _(response.errorSource).isEmpty()){
      deferred.resolve(response);  
    } else{
      
      deferred.reject(response);  
      
    }
  }

  return{
    create:function(user){    
      var deferred = $q.defer();
      $http({ method: 'POST', url: apiUrlPublic + 'registra', params: {path:'clients'}, data:user})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    update:function(user, idClienteActualizar){
    $log.info('user:) ', user);
    $log.info('idClienteActualizar:) ', idClienteActualizar);    

      var deferred = $q.defer();
      $http({ method: 'PATCH', url: apiUrlPublic + 'actualiza', params: {path:'clients/'+idClienteActualizar}, data:user, headers:{"USUARIO": idClienteActualizar} })
      .success(function(response, status){
        deferred.resolve(response);
      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
     updateCustominformation:function(user, idClienteActualizar){    
    $log.info('idClienteActualizar2: ', idClienteActualizar);    

      var deferred = $q.defer();
      $http({ method: 'PATCH', url: apiUrl, params: {path:'clients/'+idClienteActualizar+'/custominformation'}, data:user, headers:{"USUARIO": idClienteActualizar}})
      .success(function(response, status){
        deferred.resolve(response);
      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },


    getProfile:function(clientId, fullDetails){

      var deferred = $q.defer();

      if(_(fullDetails).isUndefined()){
        fullDetails = 'true';
      }
      $http({ method: 'GET', url: apiUrl, params: {path:'clients/'+ clientId+'?fullDetails='+ fullDetails}, data:{}})
      .success(function(response, status){  

        validResponse(deferred, response, status);
        
      })
      .error(function(err){
        $log.log('response err', response);    
        deferred.reject(err);

      });

      return deferred.promise;
    },
    getPrestamoAnterior:function(clientId){

      var deferred = $q.defer();

      $http({ method: 'GET', url: apiUrl, params: {path:'clients/'+ clientId+'/loans?fullDetails=true'}, data:{}})
      .success(function(response, status){        
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    updateCorreoOpcional:function(clientId, newEmail){

      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Email_Opcional_Clientes'}, data:{ value: newEmail}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    updatePagoRealizadoSms:function(clientId, pagoRealizadoSms){

      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Notif_Pago_SMS_PUSH_Clientes'}, data:{ value: pagoRealizadoSms}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
      updatePagoRealizadoMail:function(clientId, pagoRealizadoMail){

      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Notif_Pago_Email_Clientes'}, data:{ value: pagoRealizadoMail}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
     updateRecordarPagoSms:function(clientId, RecordarPagoSms){

      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Record_SMS_PUSH_Clientes'}, data:{ value: RecordarPagoSms}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    updateRecordarPagoMail:function(clientId, RecordarPagoMail){

      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Record_Email_Clientes'}, data:{ value: RecordarPagoMail}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
     updateGeneralesSms:function(clientId, GeneralesSms){

      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Notif_SMS_PUSH_Clientes'}, data:{ value: GeneralesSms}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    updateGeneralesMail:function(clientId, GeneralesMail){

      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Notif_Email_Clientes'}, data:{ value: GeneralesMail}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    deleteActividadEconomicaClientes:function(clientId){

      var deferred = $q.defer();

      $http({ method: 'DELETE', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Actividad_Economica_Clientes'}, data:{ value: ''}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    deleteAntiguedad_Años_Clientes:function(clientId){

      var deferred = $q.defer();

      $http({ method: 'DELETE', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Antiguedad_Años_Clientes'}, data:{ value: ''}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    deleteNegocio_Anos_Clientes:function(clientId){

      var deferred = $q.defer();

      $http({ method: 'DELETE', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Negocio_Anos_Clientes'}, data:{ value: ''}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    deleteArea_Clientes:function(clientId){

      var deferred = $q.defer();

      $http({ method: 'DELETE', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Area_Clientes'}, data:{ value: ''}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    deletePuestoTrabajoClientes:function(clientId){

      var deferred = $q.defer();

      $http({ method: 'DELETE', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Puesto_Trabajo_Clientes'}, data:{ value: ''}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    deleteGiroEmpresaClientes:function(clientId){

      var deferred = $q.defer();

      $http({ method: 'DELETE', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Giro_Empresa_Clientes'}, data:{ value: ''}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    deleteNombreEmpresaClientes:function(clientId){

      var deferred = $q.defer();

      $http({ method: 'DELETE', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Nombre_Empresa_Clientes'}, data:{ value: ''}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    deleteSin_Trabajo_Clientes:function(clientId){

      var deferred = $q.defer();

      $http({ method: 'DELETE', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Sin_Trabajo_Clientes'}, data:{ value: ''}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
     deleteSueldo_Clientes:function(clientId){

      var deferred = $q.defer();

      $http({ method: 'DELETE', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Sueldo_Clientes'}, data:{ value: ''}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    deleteGasto_Clientes:function(clientId){

      var deferred = $q.defer();

      $http({ method: 'DELETE', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Gasto_Clientes'}, data:{ value: ''}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    deleteSegundo_Apellido_Clientes:function(clientId){

      var deferred = $q.defer();

      $http({ method: 'DELETE', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Segundo_Apellido_Clientes'}, data:{ value: ''}, headers:{"USUARIO": clientId}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    deleteEmail_Opcional_Clientes:function(clientId){

      var deferred = $q.defer();

      $http({ method: 'DELETE', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Email_Opcional_Clientes'}, data:{ value: ''}, headers:{"USUARIO": clientId}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    updateDiasRecordar:function(clientId, dias){

      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Dias_Aviso_Clientes'}, data:{ value: dias}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    updatePhoneOpcional:function(clientId, newHomePhone){

      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId}, data:{ client:{homePhone:newHomePhone}}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    updateDondeEstas:function(clientId, opcion){
      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/DondeEstas_Clientes'}, data:{ value: opcion}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    updateSituacion:function(clientId, opcion){
      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Situacion_Persona_Clientes'}, data:{ value: opcion}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    changeState:function(clientId, state){

      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId}, data:{ client:{state: state}}})
      .success(function(response, status){

        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    passwordReset: function (clientId, encNewPassword){ 
      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Contrasena_Clientes'}, data:{ value: encNewPassword}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    passwordLlaveReset: function(clientId, PasswordLLaveCliente){ 
      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Contrasena_Llave_Clientes'}, data:{ value: PasswordLLaveCliente}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },

    confirmEmail: function(clientId){ 
      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/Email_Confirmado_Clientes'}, data:{ value: 'TRUE'}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    }
    ,

    confirmSMS: function(clientId){ 
      var deferred = $q.defer();

      $http({ method: 'PATCH', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/SMS_Confirmado_Clientes'}, data:{ value: 'TRUE'}})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    getCustomField: function(clientId, fieldId){ 
      var deferred = $q.defer();

      $http({ method: 'GET', url: apiUrl, params:{path:'clients/'+ clientId +'/custominformation/'+ fieldId}, data:''})
      .success(function(response, status){
        
        validResponse(deferred, response, status);

      })
      .error(function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    }
  };

});
