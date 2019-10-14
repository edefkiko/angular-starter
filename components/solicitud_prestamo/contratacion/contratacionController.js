'use strict'
angular.module('solicitudPrestamo')
  .controller('contratacionController', ['$scope', 'DatosContratacion', 'DatosIneContratacion', 'DatosIneVueltaContratacion',
    'DatosComprobante', '$state', 'ngDialog', '$log', '$rootScope', 'CLIENT_STATUS', 'StatusService', 'LoginService', 'Solicitud',
    'clienteService', 'prestamosService', 'Cliente', '$q', 'selfieCatalog', 'mambuConvertUtil', 'DondeVivesAnterior', 'localStorageService', 'MENSAJE', 'Prestamo', 'notificacionesService', 'deviceDetector',
    function($scope, DatosContratacion, DatosIneContratacion, DatosIneVueltaContratacion, DatosComprobante, $state,
      ngDialog, $log, $rootScope, CLIENT_STATUS, StatusService, LoginService, Solicitud, clienteService, prestamosService, Cliente,
      $q, selfieCatalog, mambuConvertUtil, DondeVivesAnterior, localStorageService, MENSAJE, Prestamo, notificacionesService, deviceDetector) {
      //Variables para carga de archivos
      
      $scope.isMobile = deviceDetector.isMobile();

      var dialog;
      var userId = LoginService.currentUser().id;
      var cliente = new Cliente({id: userId});
      var memorySolicitud = localStorageService.get('solicitud');
      var prestamoModel = new Prestamo({id: memorySolicitud.idPrestamo});
      var datosContratacion = new DatosContratacion();
      var solicitud = new Solicitud(memorySolicitud);
      var userEncodedKey;

      var currentUser = LoginService.currentUser();
      var donveVives = new DondeVivesAnterior();

      var countIfeAdded = 0;
      $scope.selfieAdded = false;
      $scope.ineFrenteAdded = false;
      $scope.ineReversoAdded = false;
      $scope.comprobanteAdded = false;
      $scope.edoCuentaAdded = false;
      //Variables para validacion de documentos
      var situacion_Persona_Clientes = currentUser.situacion;
      var vigencia_Id_Clientes = null;

      //Valores para almacenar ultimo estado de docuemntos.
      var respuestaSolicitud = null;
      var respuestaCliente = null;

      $scope.documentos = {
        selfie: {},
        ineFrente: {},
        ineReverso: {},
        comprobante: {},
        edoCuenta: {}
      };
      $scope.palabraSelfie;

      //Variables para ocultar los documentos


      $scope.$watch("init", function() {
        $scope.ocultarBotonCamara = false;
        $scope.patOpts = {
          x: 0,
          y: 0,
          w: 25,
          h: 25
        };
        $scope.channel = {};
        $scope.webcamError = false;
        $rootScope.showLoading();

        cliente.updateStatus(CLIENT_STATUS.DOCUMENTACION_PERSONAL.value).then(function(result) {
          cliente.getBasicData().then(function(user) {

            $scope.$emit('loadUserData', user);
            userEncodedKey = user.encodedKey;
            $log.debug('userEncodedKey', userEncodedKey);
            datosContratacion.getSelfieWord(userId, selfieCatalog).then(function(value) {

              $scope.palabraSelfie = value;

              buscarValores().then(function() {
                $rootScope.hideLoading();
              }, function(){
                $rootScope.hideLoading();
              });

            });

          });

        }, function() {
          $rootScope.hideLoading();
        });

      });



      /*Metodo que realiza la comprobacion de la validadez de los documentos del cliente y en cbase a esto los muestra
      en la pantalla. 
      Realiza la busqueda del cliente.
      Metodo que recupera los siguientes datos: 
        1.-Situacion_Persona_Clientes 
        2.- Vigencia_ID_Clientes 
        3.- memorySolicitud.comprobante 
        4.- memorySolicitud.ife 
        5.- memorySolicitud.selfie 
        6.- Palabra_memorySolicitud.selfie
        7.- memorySolicitud.edoCuenta
        */
      function buscarValores() {
        var deferred = $q.defer();

        solicitud.getSolicitudActiva(userId, true).then(function(response) {
          
          respuestaSolicitud = response;

          cliente.getUserData().then(function(user) {

            memorySolicitud.selfie = respuestaSolicitud.selfie;
            memorySolicitud.ife = respuestaSolicitud.ife;
            memorySolicitud.comprobante = respuestaSolicitud.comprobante;
            memorySolicitud.edoCuenta = respuestaSolicitud.edoCuenta;
            memorySolicitud.aceptoEnviarDocs = respuestaSolicitud.aceptoEnviarDocs;
            vigencia_Id_Clientes = user.vigenciaIfe;

            $log.info('===situacion_Persona_Clientes:' + situacion_Persona_Clientes);
            $log.info('===memorySolicitud.selfie:' + memorySolicitud.selfie);
            $log.info('===memorySolicitud.ife:' + memorySolicitud.ife);
            $log.info('===memorySolicitud.comprobante:' + memorySolicitud.comprobante);
            $log.info('===memorySolicitud.edoCuenta:' + memorySolicitud.edoCuenta);
            $log.info('===vigencia_Id_Clientes:' + vigencia_Id_Clientes);
            $log.info('===aceptoEnviarDocs:' + memorySolicitud.aceptoEnviarDocs);

            //Validacion de perfil para ver cuando mostrar los documentos
            //Validaciones para el perfil de desertor.
            if (_.isEqual(situacion_Persona_Clientes, "Desertor")) {
              
              if(isDocumentsComplete()){
                 $log.info('===isDocumentsComplete: true');
                   updateStatusSolicitud().then(function(){
                    $log.info('===Cambiando solictud a pendiente de firma.');
                    deferred.resolve();                  
                  });
                
                }else{

                  obtenerDatos().then(function(){
                      deferred.resolve();
                  });

                }

            } else {
              //Sin validaciones para cualquier otro perfil.
              $log.info("El usuario con id-> " + userId + " tiene perfil: " + situacion_Persona_Clientes);
              acomodarElementos();
              deferred.resolve();
            }

            

          });

        });

        return deferred.promise;
      }


      // Metodo que obtiene el ultimo prestamo del cliente

      function obtenerDatos() {
        var deferred = $q.defer();
        //Despues de prebas borrar linea usuario de prueba "953984081"
        prestamoModel.getLastClosedLoan(userId).then(function(lastClosedLoan) {
          var diasAtraso = lastClosedLoan.maxDiasAtraso;
          $log.info('===getLastClosedLoan: ', lastClosedLoan);

          //Caso cliente desertor calificacion pagos 1-7 
          if (prestamoModel.esBuenPagador(lastClosedLoan.maxDiasAtraso)) {
            $log.info('=== esBuenPagador');       

            updateNoNecesitaComprobante().then(function(){
              acomodarElementos();
              deferred.resolve(); 
            });     
            

            //Caso cliente desertor calificacion pagos 8-45 
          } else if (prestamoModel.esUsuarioPromedio(lastClosedLoan.maxDiasAtraso)) {
            $log.info('=== esClientePromedio');

            validaCambioDomicilio().then(function(){
              acomodarElementos();
              deferred.resolve(); 
            });  

          } else {
            $log.error('=== Es un cliente Moroso, no debería estar acá');
          }

        }, function() {
          $log.error("Ocurrio un error al recuperar los creditos del usuario con id: " + userId);
          deferred.reject(); 
        });

        return deferred.promise;
      }

      function updateStatusSolicitud(){
        var deferred = $q.defer();
        cliente.updateStatus(CLIENT_STATUS.PENDIENTE_FIRMA.value).then(function(result) {
           $state.go(CLIENT_STATUS.DOCUMENTACION_COMPLETA.state);

          }, function() {
            $rootScope.hideLoading();
        });

        return deferred.promise;
      }

      function isDocumentsComplete(){
        return (_.isEqual(memorySolicitud.selfie, "Sí") && _.isEqual(memorySolicitud.ife, "Sí") && _.isEqual(memorySolicitud.comprobante, "Sí") && _.isEqual(memorySolicitud.aceptoEnviarDocs, "TRUE"));
      }


      //Metodo que realiza la comprobacion de cambio en el domicilio del cliente.
      function validaCambioDomicilio() {
        var deferred = $q.defer();
        
        $rootScope.showLoading();

        donveVives.haCambiadoDeDomicilio(currentUser.id, currentUser.idSolicitud).then(function(response, addressHash, oldAddressHash) {
          $log.debug('Respuesta cambio domicilio:', response, '-', addressHash, '-', oldAddressHash);

          if(_(false).isEqual(response)){

            $log.info('No ha cambiado de domicilio, no necesita comprobante');            
            
            updateNoNecesitaComprobante().then(function(){
              $rootScope.hideLoading();
              deferred.resolve();
            });
            
          }else{
             $rootScope.hideLoading();
             deferred.resolve();
          }


        });

        return deferred.promise;
      }

      function updateNoNecesitaComprobante(){
        var deferred = $q.defer();
        memorySolicitud.comprobante = "Sí";

        solicitud = new Solicitud(memorySolicitud);

        solicitud.updateDocumentStatus(userId, 'comprobante').then(function(){
          $rootScope.hideLoading();

          if(isDocumentsLoadded()){
            $scope.mostrarBoton = true;                
          }

          deferred.resolve();

        });

        return deferred.promise;
      }

      //Metodo que realiza el reacomodamiento de los docuemntos
      function acomodarElementos() {
        //_.isEqual(situacion_Persona_Clientes, "Desertor") && 

        if ((_.isEqual(memorySolicitud.selfie, "Sí") || _.isEqual(memorySolicitud.selfie, "Pendiente")) && (_.isEqual(memorySolicitud.ife, "Sí") || _.isEqual(memorySolicitud.ife, "Pendiente")) && (_.isEqual(memorySolicitud.comprobante, "Sí") || _.isEqual(memorySolicitud.comprobante, "Pendiente"))) {
          $log.info('Tiene todos lo documentos!!!');
          $scope.mostrarSelfie = false;
          $scope.mostrarIfeIne = false;
          $scope.mostrarComprobante = false;

          $scope.ineFrenteAdded = true;
          $scope.ineReversoAdded = true;
          $scope.selfieAdded = true;
          $scope.comprobanteAdded = true;

          cerrarAyudaSubidaDocumentos();

          if(_.isEqual(memorySolicitud.aceptoEnviarDocs, "TRUE")){
            $state.go(CLIENT_STATUS.DOCUMENTACION_COMPLETA.state);
          }

        } else

        if ((_.isEqual(memorySolicitud.selfie, "Sí") || _.isEqual(memorySolicitud.selfie, "Pendiente")) && (_.isEqual(memorySolicitud.ife, "Sí") || _.isEqual(memorySolicitud.ife, "Pendiente")) && (_.isEqual(memorySolicitud.comprobante, "No") || _.isUndefined(memorySolicitud.comprobante))) {
          $log.info('===Tiene Selfie e INE/IFE || Le falta comprobante');
          $scope.mostrarSelfie = false;
          $scope.mostrarIfeIne = false;
          $scope.mostrarComprobante = true;
          $scope.posicionSelfie = 0;
          $scope.posicionIne = 0;
          $scope.posicionComprobante = 1;

          $scope.ineFrenteAdded = true;
          $scope.ineReversoAdded = true;
          $scope.selfieAdded = true;

        } else

        if ((_.isEqual(memorySolicitud.selfie, "Sí") || _.isEqual(memorySolicitud.selfie, "Pendiente")) && (_.isEqual(memorySolicitud.ife, "No") || _.isUndefined(memorySolicitud.ife)) && (_.isEqual(memorySolicitud.comprobante, "No") || _.isUndefined(memorySolicitud.comprobante))) {
          $log.info('===Solo tiene Selfie || Le falta ine y comprobante');
          $scope.mostrarSelfie = false;
          $scope.mostrarIfeIne = true;
          $scope.mostrarComprobante = true;
          $scope.posicionSelfie = 0;
          $scope.posicionIne = 1;
          $scope.posicionComprobante = 2;

          $scope.selfieAdded = true;

        } else

        if ((_.isEqual(memorySolicitud.selfie, "No") || _.isUndefined(memorySolicitud.selfie)) && (_.isEqual(memorySolicitud.ife, "No") || _.isUndefined(memorySolicitud.ife)) && (_.isEqual(memorySolicitud.comprobante, "No") || _.isUndefined(memorySolicitud.comprobante))) {
          $log.info('===No tiene documentos ');
          $scope.mostrarSelfie = true;
          $scope.mostrarIfeIne = true;
          $scope.mostrarComprobante = true;
          $scope.posicionSelfie = 1;
          $scope.posicionIne = 2;
          $scope.posicionComprobante = 3;

        } else

        if ((_.isEqual(memorySolicitud.selfie, "Sí") || _.isEqual(memorySolicitud.selfie, "Pendiente")) && (_.isEqual(memorySolicitud.ife, "No") || _.isUndefined(memorySolicitud.ife)) && (_.isEqual(memorySolicitud.comprobante, "Sí") || _.isEqual(memorySolicitud.comprobante, "Pendiente"))) {
          $log.info('===Tiene Selfie y Comprobante || Le falta Ine');

          $scope.mostrarSelfie = false;
          $scope.mostrarIfeIne = true;
          $scope.mostrarComprobante = false;
          $scope.posicionSelfie = 0;
          $scope.posicionIne = 1;
          $scope.posicionComprobante = 0;

          $scope.selfieAdded = true;
          $scope.comprobanteAdded = true;

        } else

        if ((_.isEqual(memorySolicitud.selfie, "No") || _.isUndefined(memorySolicitud.selfie)) && (_.isEqual(memorySolicitud.ife, "Sí") || _.isEqual(memorySolicitud.ife, "Pendiente")) && (_.isEqual(memorySolicitud.comprobante, "Sí") || _.isEqual(memorySolicitud.comprobante, "Pendiente"))) {
          $log.info('===Tiene INE/IFE y Comprobante || Le falta selfie');
          $scope.mostrarSelfie = true;
          $scope.mostrarIfeIne = false;
          $scope.mostrarComprobante = false;
          $scope.posicionSelfie = 1;
          $scope.posicionIne = 0;
          $scope.posicionComprobante = 0;

          $scope.ineFrenteAdded = true;
          $scope.ineReversoAdded = true;
          $scope.comprobanteAdded = true;

        } else

        if ((_.isEqual(memorySolicitud.selfie, "No") || _.isUndefined(memorySolicitud.selfie)) && (_.isEqual(memorySolicitud.ife, "Sí") || _.isEqual(memorySolicitud.ife, "Pendiente")) && (_.isEqual(memorySolicitud.comprobante, "No") || _.isUndefined(memorySolicitud.comprobante))) {
          $log.info('===Solo tiene INE/IFE || Le falta selfie y comprobante');
          $scope.mostrarSelfie = true;
          $scope.mostrarIfeIne = false;
          $scope.mostrarComprobante = true;
          $scope.posicionSelfie = 1;
          $scope.posicionIne = 0;
          $scope.posicionComprobante = 2;

        } else

        if ((_.isEqual(memorySolicitud.selfie, "No") || _.isUndefined(memorySolicitud.selfie)) && (_.isEqual(memorySolicitud.ife, "No") || _.isUndefined(memorySolicitud.ife)) && (_.isEqual(memorySolicitud.comprobante, "Sí") || _.isEqual(memorySolicitud.comprobante, "Pendiente"))) {
          $log.info('===Solo tiene Comprobante || Le falta selfie e Ine');
          $scope.mostrarSelfie = true;
          $scope.mostrarIfeIne = true;
          $scope.mostrarComprobante = false;
          $scope.posicionSelfie = 1;
          $scope.posicionIne = 2;
          $scope.posicionComprobante = 0;

          $scope.comprobanteAdded = true;

        }

        if ((_.isEqual(memorySolicitud.edoCuenta, "No") || _.isUndefined(memorySolicitud.edoCuenta))) {
          $log.info('Le falta Estado de cuenta');
          $scope.mostrarEdoCuenta = true;
          $scope.posicionEdoCuenta = 4;
          $scope.edoCuentaAdded = false;

        }
      }

      function isDocumentsLoadded(){
        return ((_.isEqual(memorySolicitud.selfie, "Pendiente") || _.isEqual(memorySolicitud.selfie, "Sí")) && (_.isEqual(memorySolicitud.ife, "Pendiente") || _.isEqual(memorySolicitud.ife, "Sí")) && (_.isEqual(memorySolicitud.comprobante, "Pendiente") || _.isEqual(memorySolicitud.comprobante, "Sí")) && _.isEqual(memorySolicitud.aceptoEnviarDocs, "TRUE" ));
      }

      $scope.finalizarSolicitud = function() {
        $rootScope.showLoading();

        if (isDocumentsLoadded()) {

          $rootScope.hideLoading();
          
          var dialog = ngDialog.open({
            template: 'components/solicitud_prestamo/contratacion/templates/pasoFinal.html',
            className: 'ngdialog-theme-default',
            closeByEscape: false,
            closeByDocument: false,
            closeByNavigation: false,
            showClose: false,
            controller: ['$scope', '$state', 'CLIENT_STATUS', function($scope, $state, CLIENT_STATUS) {
              $scope.finalizar = function() {
                dialog.close();
                cerrarAyudaSubidaDocumentos();
                
                if(_.isEqual(memorySolicitud.aceptoEnviarDocs, "TRUE")){
                  $state.go(CLIENT_STATUS.DOCUMENTACION_COMPLETA.state);
                }
              }
            }]
          });

        } else {
            respuestaSolicitud.aceptoEnviarDocs = $scope.aceptoEnviarDocs ? 'TRUE': 'FALSE';

            solicitud = new Solicitud(respuestaSolicitud);
            solicitud.setAceptSendDocs(userId).then(function(){
              
              $rootScope.hideLoading();
              $state.go(CLIENT_STATUS.DOCUMENTACION_COMPLETA.state);

            });
        }

      }

      $scope.imageDropped = function() {
        $log.debug('$scope.uploadedFile', $scope.uploadedFile.file);
        $log.debug('$scope.uploadedFile', $scope.uploadedFile.target);

        var fileName = $scope.uploadedFile.file.name;
        var type = $scope.uploadedFile.file.type;
        var target = $scope.uploadedFile.target;
        var reader = new FileReader();

        reader.readAsDataURL($scope.uploadedFile.file, "UTF-8");

        reader.onload = function(e) {
          var data = e.target.result;
          $log.debug('imageDropped -> onload', e);

          var documento = {
            filename: fileName,
            filetype: type,
            base64: data.split(',')[1]
          };

          $log.debug('$scope.takePictureSuccess -> documento', documento);

          var event = {
            target: {
              id: target
            }
          };

          $scope.uploadImage(event, [documento]);
        };
        reader.onerror = function(e) {
          $log.debug('imageDropped -> onerror', e);
        };

        $scope.uploadedFile = null;
      };

      $scope.takePicture = function(origen) {
        $scope.origen = origen;

        dialog = ngDialog.open({
          template: 'components/solicitud_prestamo/contratacion/take_picture/takePicture.html',
          className: 'ngdialog-theme-default selfieModal',
          width: '70%',
          controller: 'takePictureController',
          scope: $scope
        });
      }
      $scope.takePictureSuccess = function(data) {
        $log.debug('takePictureSuccess', data);
        if (dialog) {
          dialog.close();
        }
        var documento = {
          filename: '' + new Date().getTime().toString() + '.png',
          base64: data.split(',')[1],
          filetype: 'image/png',
        };
        $log.debug('$scope.takePictureSuccess -> documento', documento);

        var event = {
          target: {
            id: $scope.origen
          }
        };

        $scope.uploadImage(event, [documento]);
      }

      $scope.uploadImage = function(event, fileObjs, fileList) {

        var imagenValida = validaExtensionImagenes(fileObjs[0].filename.split('.').pop());

        if (!imagenValida) {
          $rootScope.showMessage(MENSAJE.ARCHIVOS_ERROR);
        } else {
          var name = "_";
          switch (event.target.id) {
            case 'selfie':
              name = 'SELFIE_'+ memorySolicitud.idPrestamo;
              $scope.selfieDataloading = true;
              $scope.documentos.selfie.data = 'data:' + fileObjs[0].filetype + ';base64,' + fileObjs[0].base64;

              break;
            case 'ineFrente':
              name = 'IFE_F_'+ memorySolicitud.idPrestamo;
              $scope.ineFrenteDataloading = true;
              $scope.documentos.ineFrente.data = 'data:' + fileObjs[0].filetype + ';base64,' + fileObjs[0].base64;
              break;
            case 'ineReverso':
              name = 'IFE_T_'+ memorySolicitud.idPrestamo;
              $scope.ineReversoDataloading = true;
              $scope.documentos.ineReverso.data = 'data:' + fileObjs[0].filetype + ';base64,' + fileObjs[0].base64;
              break;
            case 'comprobante':
              name = 'COMP_DOM_'+ memorySolicitud.idPrestamo;
              $scope.comprobanteDataloading = true;
              $scope.documentos.comprobante.data = 'data:' + fileObjs[0].filetype + ';base64,' + fileObjs[0].base64;
              break;
            case 'edoCuenta':
                name = 'COMP_EDO_CUENTA_'+ memorySolicitud.idPrestamo;
                $scope.edoCuentaDataloading = true;
                $scope.documentos.edoCuenta.data = 'data:' + fileObjs[0].filetype + ';base64,' + fileObjs[0].base64;
                break;
          }
          var extension = fileObjs[0].filename.split('.').pop();
          $log.debug('extension imagen pop', fileObjs[0].filetype);
          fileObjs[0].filename = name + "." + extension;
          $log.debug('fileObjs', fileObjs.length);

          var datosContratacion = new DatosContratacion(fileObjs[0], userEncodedKey);

          $rootScope.showLoading();

          var type = event.target.id;
          datosContratacion.cargar(userId).then(function() {
            switch (event.target.id) {
              case 'selfie':
                $scope.selfieDataloading = false;
                $scope.selfieAdded = true;
                memorySolicitud.selfie = "Pendiente";
                break;
              case 'ineFrente':
                $scope.ineFrenteDataloading = false;
                $scope.ineFrenteAdded = true;
                countIfeAdded ++;
                type = 'ife';
                countIfeAdded > 1 ? memorySolicitud.ife = "Pendiente" : 0;
                break;
              case 'ineReverso':
                $scope.ineReversoDataloading = false;
                $scope.ineReversoAdded = true;
                countIfeAdded ++;
                countIfeAdded > 1 ? memorySolicitud.ife = "Pendiente" : 0;
                type = 'ife';
                break;
              case 'comprobante':
                $scope.comprobanteDataloading = false;
                $scope.comprobanteAdded = true;
                memorySolicitud.comprobante = "Pendiente";
                break;
              case 'edoCuenta':
                  $scope.edoCuentaDataloading = false;
                  $scope.edoCuentaAdded = true;
                  memorySolicitud.edoCuenta = "Pendiente";
                  break;
            }

            if(_('ife').isEqual(type) && countIfeAdded < 2){
              $rootScope.hideLoading();
            }else{
              solicitud = new Solicitud(memorySolicitud);
              solicitud.updateDocumentStatus(userId, type).then(function(){
                $rootScope.hideLoading();

                if(isDocumentsLoadded()){
                  $scope.mostrarBoton = true;
                }

              });
            }
            
          });
        }


      };

      /*
      Metodo que valida la extension de los archivos a subir por el cliente.
        JPG, JPEG, PNG, GIF, BMP, TIFF, DOC, DOCX, PDF
      */
      function validaExtensionImagenes(extension) {

        $log.debug('extension archivo', extension);
        switch (extension.toUpperCase()) {
          case 'JPG':
            return true;
          case 'JPEG':
            return true;
          case 'PNG':
            return true;
          case 'GIF':
            return true;
          case 'BMP':
            return true;
          case 'TIFF':
            return true;
          case 'DOC':
            return true;
          case 'DOCX':
            return true;
          case 'PDF':
            return true;
          default:
            return false;
        }
      }

      // base64_object is an object that contains compiled base64 image data from file.
      $scope.$on('$viewContentLoaded', function(){
        var isFirstTime = false;
        if ((_.isEqual(memorySolicitud.selfie, "No") || _.isUndefined(memorySolicitud.selfie)) && (_.isEqual(memorySolicitud.ife, "No") || _.isUndefined(memorySolicitud.ife)) && (_.isEqual(memorySolicitud.comprobante, "No") || _.isUndefined(memorySolicitud.comprobante))) {
          isFirstTime = true;
        }

        $log.debug('=====================isFirstTime: ', isFirstTime);
        if(_('Prospecto').isEqual(currentUser.situacion) && isFirstTime){
          ayudaSubidaDocumentos()
        }
      });
    }
  ]);