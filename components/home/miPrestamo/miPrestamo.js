'use strict';
angular.module('home')
	.controller('homeMiPrestamoController', ['$scope', '$stateParams', 'prestamosService', 'LoginService', '$log', '$rootScope', '$anchorScroll', function($scope, $stateParams, prestamosService, LoginService, $log, $rootScope, $anchorScroll) {
		$scope.progress = {};
		$scope.progress.size = 260;
		$scope.progress.progress = 0.85;
		$scope.progress.strokeWidth = 8;
		$scope.progress.stroke = '#DBDF2D';
		$scope.progress.counterClockwise = 'true';

		$scope.$watch("init", function() {
			var loanId = $stateParams.loanId;

			if (_(loanId).isEmpty()) {
				return;
			}
			$rootScope.showLoading();
			prestamosService.obtenerPrestamo(loanId).then(function(prestamo) {
				$log.info('prestamo: -->', prestamo);
					$scope.producto = prestamo.producto;
					$scope.hoy = prestamo.hoy;
					$scope.payments.pagosRealizados = prestamo.pagosRealizados;
					$scope.payments.transaccionesRealizadas = prestamo.transaccionesRealizadas;
					$scope.payments.pagosPendientes = prestamo.pagosPendientes;
					$scope.payments.pagosParciales = prestamo.pagosParciales;
					$scope.proximoPagoFecha = prestamo.proximoPago.proximoPagoFecha;
					$scope.saldoPagosHoy = prestamo.saldoPagosHoy;
					// $scope.saldoPendientesHoy = prestamo.saldoPendientesHoy;
					$scope.pagos = prestamo.pagos;

					$scope.pagosVencidos = prestamo.pagosVencidos;
					$scope.payments.pagosVencidos = prestamo.pagosVencidos.pagos;

					if ($scope.pagosVencidos.pagos.length > 0) {
						$scope.progress.stroke = '#ffc934';
					}

					$scope.configPages();

					$scope.loan.proximoPago = prestamo.proximoPago;

					$scope.progress.progress = ($scope.producto.total - $scope.saldoPagosHoy) / $scope.producto.total * 0.85;

					//transacciones
					prestamosService.obtenerPrestamoTransactions($scope.loan).then(function(prestamoTransacciones) {
						$scope.payments.transaccionesRealizadas = prestamoTransacciones.transaccionesRealizadas;
						$scope.sumaTransacciones = prestamoTransacciones.sumaTransacciones;
						$scope.saldoPendientesHoyTotal = prestamo.producto.restaPorPagar;
						$scope.totalVencido = prestamo.pagosVencidos.totalAmortTotal;

					});
				}, function() {
					$log.error("No se obtuvieron resultados para el id: " + $stateParams.id);
				})
				.finally(function() {
					$rootScope.hideLoading();
				});
		});


		$scope.pagos = [];
		$scope.currentPage = 0;
		$scope.pageSize = 10; // Esta la cantidad de registros que deseamos mostrar por página
		$scope.pages = [];

		$scope.configPages = function() {
			$scope.pages.length = 0;

			var ini = $scope.currentPage - 4;
			var fin = $scope.currentPage + 5;

			if (ini < 1) {
				ini = 1;
				if (Math.ceil($scope.pagos.length / $scope.pageSize) > 10) {
					fin = 10;
				} else {
					fin = Math.ceil($scope.pagos.length / $scope.pageSize);
				}
			} else {
				if (ini >= Math.ceil($scope.pagos.length / $scope.pageSize) - 10) {
					ini = Math.ceil($scope.pagos.length / $scope.pageSize) - 10;
					fin = Math.ceil($scope.pagos.length / $scope.pageSize);
				}
			}
			if (ini < 1) {
				ini = 1
			};
			for (var i = ini; i <= fin; i++) {
				$scope.pages.push({
					no: i
				});
			}
			if ($scope.currentPage >= $scope.pages.length) {
				$scope.currentPage = $scope.pages.length - 1;
			}
		};

		$scope.setPage = function(index) {
			$scope.currentPage = index - 1;
		};

		//$scope.$on('$viewContentLoaded', ayudaHomePrivada);	

	}]);