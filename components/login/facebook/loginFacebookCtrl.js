app.controller('loginFacebookCtrl', ['$scope', '$log', 'Facebook', 'Cliente', '$state', 'CLIENT_STATUS', 'advertenciaDocumentacion', '$rootScope', function ($scope, $log, Facebook, Cliente, $state, CLIENT_STATUS, advertenciaDocumentacion, $rootScope) {
	$log.debug('origen', $scope.origen);
	$scope.origenPag = $scope.origen;
	$scope.FBLogin = function () {
		$scope.isFBSelected = true;

		Facebook.init().then(function () {
			Facebook.getProfile().then(function (profile) {
				$log.debug('profile', profile);
			});
		});
	};

	$scope.FBRegister = function () {
		$scope.dataloading = true;
		$scope.isFBSelected = true;

		Facebook.init().then(function () {
			Facebook.getProfile().then(function (profile) {
				$log.debug('profile', profile);

				new Cliente({}).setFacebookData(profile);
				$scope.closeThisDialog();
				advertenciaDocumentacion('Nuevo', CLIENT_STATUS.AVISO_PRIVACIDAD_SIMPLIFICADO.state, { containsFacebookData: true });
				//advertenciaDocumentacion('Nuevo', CLIENT_STATUS.REGISTRO_CLIENTE.state, {containsFacebookData: true });
				//$state.go(CLIENT_STATUS.REGISTRO_CLIENTE.state, { containsFacebookData: true });
			});
		}, function () {
			$scope.dataloading = false;
			$scope.isFBSelected = false;
		});
	};

	$scope.showWarning = function () {
		// advertenciaDocumentacion('Nuevo', CLIENT_STATUS.AVISO_PRIVACIDAD_SIMPLIFICADO.state);
		advertenciaDocumentacion('Nuevo', CLIENT_STATUS.REGISTRO_CLIENTE.state);
		$scope.closeThisDialog();
	};

	$scope.goToLogin = function () {
		if ($rootScope.isMobile) {
			$state.go('loginApp');
		} else {
			$state.go('login', { pagOrigen: $scope.origen });
		}

	};

}]);