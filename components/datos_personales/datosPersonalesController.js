angular.module('datosPersonales')
  .controller('datoPersonalesCtrl', ['$scope', 'datosService', 'vcRecaptchaService', 'ngDialog', 'emailService', 'Cliente', '$state', 'semilla', '$stateParams', 'catalogs', 'CLIENT_STATUS', '$log', 'geolocation', 'EnvironmentConfig', 'catalogService', 'clienteService', 'curpRfcUtil', function ($scope, datosService, vcRecaptchaService, ngDialog, emailService, Cliente, $state, semilla, $stateParams, catalogs, CLIENT_STATUS, $log, geolocation, EnvironmentConfig, catalogService, clienteService, curpRfcUtil) {
    $scope.isMobileApp = EnvironmentConfig.isMobile;
    $scope.dataloading = false
    $scope.cliente = {};
    $scope.formData = {};
    $scope.sexo = catalogs.sexo;
    $scope.estadoCivil = catalogs.estadoCivil;
    $scope.nivelEstudios = catalogs.nivelEstudios;
    $scope.adquisicion = catalogs.adquisicion;
    $scope.estados = catalogs.estados;
    $scope.meses = catalogService.meses();

    //min y max para el limite del input del dia
    $scope.minDia = 1;
    $scope.maxDia = 31;

    $scope.minYear = 1;

    $scope.cliente.geolocation = geolocation;
    // obtiene los nombres de los estados en el select
    $scope.estadosIniciales = catalogs.estadosIniciales;

    // Set the default value of inputType
    $scope.inputType = 'password';

    // Hide & show password function
    $scope.typePassword = true;
    $scope.typeText = false;
    $scope.hideShowPassword = function () {
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

    var cliente = new Cliente({});
    if ($stateParams.containsFacebookData) {
      loadFBData();
    }

    $scope.$watch("init", function() {
      if(_.isEmpty(geolocation)) {
        locationDialog();
      }
    });

    function locationDialog(){

      var registerDialogProm = ngDialog.open({
        template: 'components/datos_personales/templates/error-location.html',
        controller: function alerMessage($scope, $window){
	      		$scope.reload = function () {
              $window.location.reload();
            }
	      }
      });

      registerDialogProm.closePromise.then(function (data) {
        if(_(data.value).isEqual('$escape') || _(data.value).isEqual('$closeButton')){
          $scope.loQuieroClicked = false;
        }

      });

    }

    function loadFBData() {
      var faceboookData = cliente.getFacebookData();

      $scope.cliente.firstName = faceboookData.me.first_name;
      $scope.activedNombre = true;

      $scope.formData.aPaterno = faceboookData.me.last_name;
      $scope.activedLastName = true;

      $scope.cliente.email = faceboookData.me.email;
      $scope.activedEmail = true;

      $scope.cliente.gender = faceboookData.me.gender;
    }
    //verficar correo alternativo igual a principal
    $scope.correoDiferente = false;
    $scope.$watch('cliente.emailOpcional', function () {
      $scope.$watch('cliente.email', function () {
        if ($scope.cliente.email && $scope.cliente.emailOpcional) {
          $scope.cliente.emailOpcional = $scope.cliente.emailOpcional.toLowerCase();
          $scope.cliente.email = $scope.cliente.email.toLowerCase();
          if ($scope.cliente.emailOpcional === $scope.cliente.email) {
            $log.info('mails iguales');
            $scope.correoDiferente = true;
          } else {
            $log.info('mails diferentes');
            $scope.correoDiferente = false;
          }
        }
      });
    });
    //verficar telefono alternativo igual a principal
    $scope.telefonoDiferente = false;
    $scope.$watch('cliente.homePhone', function () {
      $scope.$watch('cliente.mobilePhone1', function () {
        if ($scope.cliente.mobilePhone1) {
          if ($scope.cliente.homePhone === $scope.cliente.mobilePhone1) {
            $log.info('telefonos iguales');
            $scope.telefonoDiferente = true;
          } else {
            $log.info('telefonos diferentes');
            $scope.telefonoDiferente = false;
          }
        }
      });
    });


    $scope.$watch('cliente.curp', function () {
      // $log.info('curp', $scope.cliente.curp);
      if ($scope.cliente.curp && $scope.cliente.curp.length >= 18) {

        // $log.info('===cliente.curp:', $scope.cliente.curp);
        validateNameCurp();

      } else {
        $scope.estadoDiferente = false;
        $scope.generoDiferente = false;
        $scope.anoNacimientoDiferente = false;
        $scope.mesNacimientoDiferente = false;
        $scope.diaNacimientoDiferente = false;
        $scope.curpDiferente = false;
        $scope.cliente.lugarNac = "";
        $scope.formData.diaNacimiento = "";
        $scope.formData.opcionMes = "";
        $scope.formData.anioNacimiento = "";
        $scope.cliente.gender = "";
        $scope.edadValida = false;

      }


    });

    function validateNameCurp() {

      if ($scope.cliente.curp && $scope.cliente.curp.length >= 18 && $scope.dataloading == false) {

        var dataCurpCliente = $scope.cliente.curp;

        var dataCurp = dataCurpCliente.toUpperCase();

        //edo
        var cadena = dataCurp,
          inicio = 11,
          fin = 13,
          estadoOrigenCliente = cadena.substring(inicio, fin);
        // $log.info('estadoOrigenCliente:', estadoOrigenCliente);
        var estadoCliente;
        if (estadoOrigenCliente === "AS") { $scope.cliente.lugarNac = "Aguascalientes"; estadoCliente = "Aguascalientes"; }
        else if (estadoOrigenCliente === "BC") { $scope.cliente.lugarNac = "Baja California"; estadoCliente = "Baja California"; }
        else if (estadoOrigenCliente === "BS") { $scope.cliente.lugarNac = "Baja California Sur"; estadoCliente = "Baja California Sur"; }
        else if (estadoOrigenCliente === "CC") { $scope.cliente.lugarNac = "Campeche"; estadoCliente = "Campeche"; }
        else if (estadoOrigenCliente === "CS") { $scope.cliente.lugarNac = "Chiapas"; estadoCliente = "Chiapas"; }
        else if (estadoOrigenCliente === "CH") { $scope.cliente.lugarNac = "Chihuahua"; estadoCliente = "Chihuahua"; }
        else if (estadoOrigenCliente === "CL") { $scope.cliente.lugarNac = "Coahuila"; estadoCliente = "Coahuila"; }
        else if (estadoOrigenCliente === "CM") { $scope.cliente.lugarNac = "Colima"; estadoCliente = "Colima"; }
        else if (estadoOrigenCliente === "DF") { $scope.cliente.lugarNac = "Distrito Federal"; estadoCliente = "Distrito Federal"; }
        else if (estadoOrigenCliente === "CX") { $scope.cliente.lugarNac = "Ciudad de México"; estadoCliente = "Ciudad de México"; }
        else if (estadoOrigenCliente === "DG") { $scope.cliente.lugarNac = "Durango"; estadoCliente = "Durango"; }
        else if (estadoOrigenCliente === "GT") { $scope.cliente.lugarNac = "Guanajuato"; estadoCliente = "Guanajuato"; }
        else if (estadoOrigenCliente === "GR") { $scope.cliente.lugarNac = "Guerrero"; estadoCliente = "Guerrero"; }
        else if (estadoOrigenCliente === "HG") { $scope.cliente.lugarNac = "Hidalgo"; estadoCliente = "Hidalgo"; }
        else if (estadoOrigenCliente === "JC") { $scope.cliente.lugarNac = "Jalisco"; estadoCliente = "Jalisco"; }
        else if (estadoOrigenCliente === "MC") { $scope.cliente.lugarNac = "Estado de México"; estadoCliente = "Estado de México"; }
        else if (estadoOrigenCliente === "MN") { $scope.cliente.lugarNac = "Michoacan"; estadoCliente = "Michoacan"; }
        else if (estadoOrigenCliente === "MS") { $scope.cliente.lugarNac = "Morelos"; estadoCliente = "Morelos"; }
        else if (estadoOrigenCliente === "NT") { $scope.cliente.lugarNac = "Nayarit"; estadoCliente = "Nayarit"; }
        else if (estadoOrigenCliente === "NL") { $scope.cliente.lugarNac = "Nuevo León"; estadoCliente = "Nuevo León"; }
        else if (estadoOrigenCliente === "OC") { $scope.cliente.lugarNac = "Oaxaca"; estadoCliente = "Oaxaca"; }
        else if (estadoOrigenCliente === "PL") { $scope.cliente.lugarNac = "Puebla"; estadoCliente = "Puebla"; }
        else if (estadoOrigenCliente === "QT") { $scope.cliente.lugarNac = "Querétaro"; estadoCliente = "Querétaro"; }
        else if (estadoOrigenCliente === "QR") { $scope.cliente.lugarNac = "Quintana Roo"; estadoCliente = "Quintana Roo"; }
        else if (estadoOrigenCliente === "SP") { $scope.cliente.lugarNac = "San Luis Potosí"; estadoCliente = "San Luis Potosí"; }
        else if (estadoOrigenCliente === "SL") { $scope.cliente.lugarNac = "Sinaloa"; estadoCliente = "Sinaloa"; }
        else if (estadoOrigenCliente === "SR") { $scope.cliente.lugarNac = "Sonora"; estadoCliente = "Sonora"; }
        else if (estadoOrigenCliente === "TC") { $scope.cliente.lugarNac = "Tabasco"; estadoCliente = "Tabasco"; }
        else if (estadoOrigenCliente === "TS") { $scope.cliente.lugarNac = "Tamaulipas"; estadoCliente = "Tamaulipas"; }
        else if (estadoOrigenCliente === "TL") { $scope.cliente.lugarNac = "Tlaxcala"; estadoCliente = "Tlaxcala"; }
        else if (estadoOrigenCliente === "VZ") { $scope.cliente.lugarNac = "Veracruz"; estadoCliente = "Veracruz"; }
        else if (estadoOrigenCliente === "YN") { $scope.cliente.lugarNac = "Yucatán"; estadoCliente = "Yucatán"; }
        else if (estadoOrigenCliente === "ZS") { $scope.cliente.lugarNac = "Zacatecas"; estadoCliente = "Zacatecas"; }


        $scope.$watch('cliente.lugarNac', function () {
          // $log.info($scope.cliente.lugarNac);

          if (estadoCliente === $scope.cliente.lugarNac) {
            // $log.info('edo igual');
            $scope.estadoDiferente = false;
          } else {
            // $log.info('edo diferente');
            $scope.estadoDiferente = true;
          }

        });

        //dia
        var cadenaDia = dataCurp,
          inicioDia = 8,
          finDia = 10,
          diaNacimientoCliente = cadenaDia.substring(inicioDia, finDia);
        // $log.info('diaNacimientoCliente:', diaNacimientoCliente);
        $scope.formData.diaNacimiento = parseInt(diaNacimientoCliente);

        $scope.$watch('formData.diaNacimiento', function () {
          // $log.info('$scope.formData.diaNacimiento:', $scope.formData.diaNacimiento);
          if (parseInt(diaNacimientoCliente) === parseInt($scope.formData.diaNacimiento)) {
            // $log.info('fecha igual a curp');
            $scope.diaNacimientoDiferente = false;
          } else {
            // $log.info('fecha diferentes a curp');
            $scope.diaNacimientoDiferente = true;
          }

        });
        //mes
        var cadenaMes = dataCurp,
          inicioMes = 6,
          finMes = 8,
          MesNacimientoCliente = cadenaMes.substring(inicioMes, finMes);
        // $log.info('MesNacimientoCliente:', MesNacimientoCliente);
        $scope.formData.opcionMes = MesNacimientoCliente;

        $scope.$watch('formData.opcionMes', function () {
          // $log.info('$scope.formData.opcionMes:', $scope.formData.opcionMes);
          if (parseInt(MesNacimientoCliente) === parseInt($scope.formData.opcionMes)) {
            // $log.info('fecha igual a curp');
            $scope.mesNacimientoDiferente = false;
          } else {
            // $log.info('fecha diferentes a curp');
            $scope.mesNacimientoDiferente = true;
          }

        });
        //anio
        var cadenaAnio = dataCurp,
          inicioAnio = 4,
          finAnio = 6,
          anioNacimientoCliente = cadenaAnio.substring(inicioAnio, finAnio);

        var ano = new Date();
        var anoActual = ano.getFullYear();
        // $log.info('anoActualCliente: ', anoActual);
        var edadPermitida = anoActual - 71;
        // $log.info('edadPermitida: ', edadPermitida);

        var cadenaEdad = String(edadPermitida),
          inicioEdad = 2,
          finEdad = 4,
          anioEdadPermitida = cadenaEdad.substring(inicioEdad, finEdad);
        // $log.info('anioEdadPermitida:', anioEdadPermitida);
        var anioCliente;
        if (anioNacimientoCliente >= anioEdadPermitida && anioNacimientoCliente <= 99) {
          $scope.formData.anioNacimiento = parseInt('19' + anioNacimientoCliente);
          anioCliente = parseInt('19' + anioNacimientoCliente);
        } else if (anioNacimientoCliente >= 0 && anioNacimientoCliente < anioEdadPermitida) {
          $scope.formData.anioNacimiento = parseInt('20' + anioNacimientoCliente);
          anioCliente = parseInt('20' + anioNacimientoCliente);
        }

        $log.info('anioNacimientoCliente:', anioNacimientoCliente);
        $scope.edadValida = false;
        if ($scope.formData.anioNacimiento && $scope.formData.opcionMes && $scope.formData.diaNacimiento) {
          var fechaNacimientoCliente = String($scope.formData.anioNacimiento) + ' ' + $scope.formData.opcionMes + ' ' + String($scope.formData.diaNacimiento);
          var now = moment();
          $log.info('now: ', now.format("YYYY MM DD"));
          var fechaDeNacimiento = moment(fechaNacimientoCliente, "YYYY MM DD");
          $log.info('fechaDeNacimiento: ', fechaDeNacimiento.format("YYYY MM DD"));
          var diferencia = now.diff(fechaDeNacimiento, "years");
          $log.info('diferencia: ', diferencia);
          if (diferencia >= 18 && diferencia <= 70) {
            $log.info('=========fecha permitida');
            $scope.edadInvalida = false;
          } else {
            $log.info('=========fecha  No permitida');
            $scope.edadInvalida = true;
          }
        }
        $scope.$watch('formData.anioNacimiento', function () {
          // $log.info('$scope.formData.anioNacimiento:', $scope.formData.anioNacimiento);
          var ano = new Date();
          var anoActual = ano.getFullYear();
          $scope.maxAnio = anoActual;
          // $scope.validateAnio = function(){
          var resultado = anoActual - $scope.formData.anioNacimiento;
          if (resultado < 18 || resultado > 70) {
            $scope.edadValida = true;
          } else {
            $scope.edadValida = false;
          }
          if (parseInt(anioCliente) === parseInt($scope.formData.anioNacimiento)) {
            // $log.info('fecha igual a curp');
            $scope.anoNacimientoDiferente = false;
          } else {
            // $log.info('fecha diferentes a curp');
            $scope.anoNacimientoDiferente = true;
          }
        });


        var fullName;

        if ($scope.cliente.middleName === undefined || $scope.cliente.middleName === '') {
          fullName = $scope.cliente.firstName;
        } else {
          fullName = $scope.cliente.firstName + ' ' + $scope.cliente.middleName;
        }

        //genero
        var cadenaGenero = dataCurp,
          inicioGenero = 10,
          finGenero = 11,
          generoCliente = cadenaGenero.substring(inicioGenero, finGenero);
        var generoIntroducido;

        if (generoCliente === "H") {
          $scope.cliente.gender = "MALE";
          generoIntroducido = "MALE";
        } else if (generoCliente === "M") {
          $scope.cliente.gender = "FEMALE";
          generoIntroducido = "FEMALE";
        }

        if (generoIntroducido === $scope.cliente.gender) {
          $scope.generoDiferente = false;
        } else {
          $scope.generoDiferente = true;
        }

        if ($scope.formData.aPaterno && $scope.cliente.firstName && $scope.cliente.curp) {
          var fullDate = dataCurp.substring(4, 10);

          var personalData = {
            ap_paterno: $scope.formData.aPaterno,
            ap_materno: $scope.formData.aMaterno,
            nombre: fullName,
            dteNacimiento: fullDate,
            sexo: generoCliente,  //h :  hombre  m: mujer
            estado: estadoOrigenCliente  //falta validacion de estados
          }

          var requestCurp = curpRfcUtil.generate(personalData);

          if (requestCurp.curp) {
            $scope.cliente.rfc = requestCurp.rfc;

          }

          if (requestCurp.curp) {

            var curpRequest = requestCurp.curp;
            var valoresInicialesCurp = curpRequest.substring(0, 4);

            var cadenaCurpData = dataCurp,
              inicioInciales = 0,
              finInciales = 4,
              valoresInicialesCurpCliente = cadenaCurpData.substring(inicioInciales, finInciales);

            if (valoresInicialesCurp === valoresInicialesCurpCliente) {
              $scope.curpDiferente = false;
            } else {
              $scope.curpDiferente = true;

            }

          } else {

          }

          if ($scope.cliente.curp) {
            $scope.validClientCurp = true;
          } else {
            $scope.validClientCurp = false;
          }

        }

      }

    }
    // validacion de inputs de numero de telefono
    $scope.textTelephone = /^(?=.{10,})/;
    // Validacion de Correo
    $scope.emailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    //Validacion de formato de CURP
    $scope.curpFormat = /^[a-zA-Z]{4}\d{6}[a-zA-Z]{6}\d{2}$/;
    $scope.rfcFormat = /^(([A-Z]|[a-z]|\s){1})(([A-Z]|[a-z]){3})([0-9]{6})((([A-Z]|[a-z]|[0-9]){3}))$/;
    $scope.passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/;
    // valida si la contraseña tiene los 2 caracteres iguales

    $scope.$watch('formData.aPaterno', function () {
      validateNameCurp();
    });
    $scope.$watch('formData.aMaterno', function () {
      validateNameCurp();
    });
    $scope.$watch('cliente.firstName', function () {
      validateNameCurp();
    });
    $scope.$watch('cliente.middleName', function () {
      validateNameCurp();
    });

    $scope.$watch('cliente.gender', function () {
      // $log.info('$scope.cliente.gender:', $scope.cliente.gender);
      validateNameCurp();
    });

    // modal
    $scope.crear = function () {
      $scope.dataloading = true;

      // estado del cliente
      $scope.cliente.segundoApellido = $scope.formData.aMaterno;
      $scope.cliente.contrasena = md5($scope.formData.password, semilla);
      if ($scope.validClientCurp === true) {

        var fechaNacimiento = String($scope.formData.anioNacimiento) + '-' + $scope.formData.opcionMes + '-' + String($scope.formData.diaNacimiento);
        $scope.cliente.lastName = $scope.formData.aPaterno;
        $scope.cliente.birthDate = fechaNacimiento;
        $scope.cliente.email = $scope.cliente.email.toLowerCase();
        //

        cliente = new Cliente($scope.cliente);
        cliente.guardar().then(function (response) {

          if (response.existe === 1 && response.mensajeOperacion === 'Existe') {
            $log.info('duplicado con password, verificar');
            $scope.dataloading = false;
            ngDialog.open({
              template: 'components/datos_personales/templates/error_validaDatosCliente.html',
              className: 'ngdialog-theme-default',
            });
          } else {
            cliente.loadSession().then(function (response) {
            });
          }

        }, function (err) {

          $scope.dataloading = false;

          ngDialog.open({
            template: 'components/datos_personales/templates/error_peticion.html',
            className: 'ngdialog-theme-default',
            controller: ['$scope', function ($scope) {
              $scope.returnStatus = err.errorSource;
            }]
          });
        });

      } else {
        ngDialog.open({ template: 'components/datos_personales/templates/error.html', className: 'ngdialog-theme-default' });
      }
    };
    // $log.log("this is your app's controller");
    $scope.response = null;
    $scope.widgetId = null;
    $scope.model = {
      key: EnvironmentConfig.reCaptchaApiKey
    };
    $scope.setResponse = function (response) {
      $scope.response = response;
    };
    $scope.setWidgetId = function (widgetId) {
      $scope.widgetId = widgetId;
    };
    $scope.cbExpiration = function () {
      vcRecaptchaService.reload($scope.widgetId);
      $scope.response = null;
    };
    $scope.submit = function () {
      // var valid;
      /**
       * SERVER SIDE VALIDATION
       *
       * You need to implement your server side validation here.
       * Send the reCaptcha response to the server and use some of the server side APIs to validate it
       * See https://developers.google.com/recaptcha/docs/verify
       */
      // $log.log('sending the captcha response to the server', $scope.response);
      if ($scope.response !== '') {
      } else {
        // $log.log('Failed validation');
        // In case of a failed validation you need to reload the captcha
        // because each response can be checked just once
        vcRecaptchaService.reload($scope.widgetId);
      }
    };

    $scope.abrirPolitica = function () {
      logoutDialog = ngDialog.open({
        templateUrl: 'components/core/views/politicaPrivacidad.html',
        width: 800,
        showClose: false,
        closeByEscape: true,
        closeByDocument: false,
        closeByNavigation: false,
        className: 'ngdialog ngdialog-theme-default ngdialog-aviso-registro'
      });

    }
    $scope.abrirParaQueSirve = function () {
      logoutDialog = ngDialog.open({
        template: '\
                <div class="dialogCuerpo avisoContrasena">\
                    <div class="small-12 medium-11 large-11 small-centered">\
                        <h5>Contraseñas y nombre de usuario</h5>\
                        <p>El Usuario acepta que los medios electrónicos que Digifin  ponga a su disposición, constituirán los medios y forma de creación, transmisión, modificación o extinción de los derechos y obligaciones de las operaciones y servicios, por lo que en términos de las disposiciones legales aplicables, los medios de identificación, en sustitución de la firma autógrafa, producirán los mismos efectos que las leyes otorgan a los documentos correspondientes y en consecuencia, tendrán el mismo valor probatorio.\
                        La contraseña es considerada homóloga de la firma escrita, al considerarse personal e intransferible, como un medio de identificación y nombre de usuario para determinar de forma fehaciente quien realiza una operación o movimiento, toda vez que se manejarán datos críticos y confidenciales, por lo que acepto siempre observar lo siguiente:</p>\
                        <ul>\
                        <li>•	Ingresar al Portal con el nombre de usuario que fue aceptado como válido.</li>\
                        <li>•	La contraseña es personal e intransferible, por lo que jamás deberá ser compartida con terceras personas, ni comunicarse por ningún medio escrito. Lo contrario supondría tolerar una suplantación de personalidad.</li>\
                        <li>•	En caso de olvidar la contraseña, se solicitará una nueva.</li>\
                        <li>•	La contraseña deberá tener una longitud no mayor a los caracteres permitidos por Digifin y no debe coincidir con ninguna palabra o clave que facilite que un tercero la adivine.</li>\
                        <li>•	La contraseña deberá ser cambiada por lo menos cada 3 meses.</li>\
                        <li>•	El Usuario, reconoce el carácter personal, confidencial e intransferible de las claves y contraseñas; en consecuencia, es responsable de su uso, liberando a Digifin de cualquier responsabilidad, reservándose este último la facultad de rescindir el mismo y cancelar el servicio, en caso de que el Usuario otorgue un uso distinto al señalado en el presente aviso.</li>\
                        </ul>\
                    </div>\
                </div>\
                <div class="margin-top-bottom separador-yei"></div>\
                <div class="dialogFooter small-12 medium-10 large-11 small-centered">\
                    <button class="button float-right" type="button" ng-click="closeThisDialog(0)">Aceptar</button>\
                    <div class="clear"></div>\
                </div>',
        plain: true,
        showClose: false,
        className: 'ngdialog ngdialog-theme-default ngdialog-aviso-contrasena'
      });

    }

  }]);
