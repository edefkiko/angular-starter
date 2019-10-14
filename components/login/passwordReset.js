app.controller('passwordResetCtrl', ['$scope' , '$state', 'PasswordForgotService', 'ngDialog', 'semilla', 'LoginService', '$log', '$stateParams', 'localStorageService', function($scope, $state, PasswordForgotService, ngDialog, semilla, LoginService, $log, $stateParams, localStorageService){
	$scope.credentials = {
		newPassword: '',
		encNewPassword: ''
	};	
	
	$scope.passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/;

	$scope.passwordReset = function(credentials){
		$scope.dataloading = true;
		var credentials = localStorageService.get('resetPasswordCredentials');

		$scope.credentials.encNewPassword = md5($scope.credentials.newPassword, semilla);

		var request ={
		    codigoSms: credentials.codigoSms,
		    mailUsuario: credentials.mailUsuario,
		    clave: $scope.credentials.encNewPassword
		}

		PasswordForgotService.cambioClave(request).then(function(){
			localStorageService.remove('resetPasswordCredentials');

			$scope.dataloading = false;
			
			$state.go('login');

			return;
		}, function(err){
			$scope.dataloading = false;
			$scope.invalido = true;
			$scope.mensaje = err;
			$log.error('passwordFailReset');
			return;
		});
		
	};
    
    $scope.abrirParaQueSirve = function(){
      logoutDialog = ngDialog.open({
            template:'\
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

}])