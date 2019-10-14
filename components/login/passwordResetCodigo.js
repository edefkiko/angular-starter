app.controller('passwordResetCodigoCtrl', ['$scope' , '$state', 'PasswordForgotService', 'ngDialog', '$stateParams', 'base64Util', 'localStorageService', function($scope, $state, PasswordForgotService, ngDialog, $stateParams, base64Util, localStorageService){
	$scope.credentials = {
		mailUsuario: '',
		codigoSms: ''
	};	
	$scope.invalidEnviarSms = false;
	$scope.$watch('init', function(){
		$scope.dataloading = true;

		if($stateParams.codigo){
			var encodeString = $stateParams.codigo;
			var mailUsuario = base64Util.decode(encodeString);
			//var vigencia = encodeString.substring(lastEqual + 2, encodeString.length + 1); 

			$scope.credentials.mailUsuario = mailUsuario;

			PasswordForgotService.enviarSms(mailUsuario).then(function(response){
				$scope.digitosTelefono = response.digitosTelefono;
				$scope.dataloading = false;
			}, function(err){
				$scope.dataloading = false;
				$scope.invalidEnviarSms = true;
				$scope.mensaje = err;
			});			
		}else{
			$state.go('password.resetcodigo.fail');
		}
		
	});

	$scope.passwordCodigoReset = function(credentials){
		credentials.codigoSms = credentials.codigoSms.toUpperCase(); 
		console.info('credentials: ', credentials);
		$scope.dataloading = true;
		PasswordForgotService.validarCodigoSms(credentials).then(function(){
			
			localStorageService.set('resetPasswordCredentials', credentials);

			$state.go('password.reset');
		}, function(err){
			$scope.dataloading = false;
			$scope.invalido = true;
			$scope.mensaje = err;
		});
	};
	
}])