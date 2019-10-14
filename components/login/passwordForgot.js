app.controller('passwordForgotCtrl', ['$scope', '$state', 'PasswordForgotService', function($scope, $state, PasswordForgotService) {


	$scope.credentials = {
		username: ''
	};
	$scope.invalido = false;

	// $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,15}$/;
	$scope.emailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;


	$scope.askForPasswordReset = function(credentials) {
		$scope.dataloading = true;
		credentials.username = credentials.username.toLowerCase();
		PasswordForgotService.verificarMail(credentials.username).then(function() {

			PasswordForgotService.passwordForgot(credentials).then(function() {
				$state.go('password.forgot.success');
			}, function(response) {
				$scope.invalido = true;
				$scope.mensaje = response;
				$scope.dataloading = false;
			});

		}, function(response) {
			$scope.invalido = true;
			$scope.mensaje = response;
			$scope.dataloading = false;
		});


	};


}])