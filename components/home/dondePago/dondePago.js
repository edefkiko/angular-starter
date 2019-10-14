'use strict';
angular.module('home')
	.controller('homeDondePagoController', ['$scope', 'barcodeService', 'homeServices', 'deviceDetector', 'prestamosService', 'LoginService', '$rootScope', '$log', function($scope, barcodeService, homeServices, deviceDetector, prestamosService, LoginService, $rootScope, $log) {
		var loanId = $scope.loan.loanId;

		$scope.$watch("init", function() {

			$scope.isMobile = deviceDetector.isMobile();

			$log.debug('$scope.proximoPago', $scope.loan);

			if ($scope.loan.proximoPago) {

				$scope.proximoPago = $scope.loan.proximoPago.restante;

				$rootScope.showLoading();
				prestamosService.getCreditData(loanId).then(function(response) {

					$log.debug('prestamosService.getCreditData', response);

					$scope.clabe = response.clabe;
					$scope.numReferencia = response.numReferencia;
					$scope.banco = response.banco;
					barcodeService.getBase64Image(loanId, $scope.proximoPago).then(function(base64Image) {
						$scope.barCode = base64Image;
					});

				}).finally(function() {
					$rootScope.hideLoading();
				});
			}
			$rootScope.showLoading();
			prestamosService.obtenerPrestamo($scope.loan.loanId).then(function(prestamo) {
				$log.info('prestamo: -->', prestamo);
				$scope.pagosVencidos = prestamo.pagosVencidos;
				prestamosService.obtenerPrestamoTransactions($scope.loan).then(function(prestamoTransacciones) {
					$scope.totalVencido = prestamo.pagosVencidos.totalAmortTotal;
					$rootScope.hideLoading();

				});
			});

		});


	}]);