app.controller('footerCtrl', ['$scope', 'EnvironmentConfig', 'ngDialog', function ($scope, EnvironmentConfig, ngDialog) {

	$scope.yeiInfo = EnvironmentConfig.yeiInfo;


	$scope.openMailbox = function () {
		$scope.origen = 'root';

		registerDialogProm = ngDialog.open({
			template: 'components/core/views/complaintMailbox.html',
			controller: 'complaintMailboxCtrl',
			scope: $scope
		});

		registerDialogProm.closePromise.then(function (data) {
			if (_(data.value).isEqual('$escape') || _(data.value).isEqual('$closeButton')) {
				// $scope.loQuieroClicked = false;
			}

		});
	}

	$scope.datosUnidadAtencionEspecializada = function () {
		registerDialogProm = ngDialog.open({
			template: 'components/core/footer/unidadAtencionEspecializada.html',
			controller: 'loginFacebookCtrl',
			scope: $scope
		});
	};


}]);