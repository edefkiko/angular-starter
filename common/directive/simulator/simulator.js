app.directive('simulator', function (Simulator, $log) {
	function link(scope, element, attrs) {

	}

	return {
		scope: {
			producto: '=producto',
			mostrar: '=mostrar'
		},
		restrict: 'E',
		templateUrl: 'common/directive/simulator/simulator.html',
		link: link,
		controller: function ($scope, consultaCatService) {

			$scope.onEndPrestamo = function () {
				$scope.producto.prestamo = $scope.producto.prestamoTemp;
			};

			$scope.onEndFrecuencia = function () {
				$scope.producto.frecuencia = $scope.producto.frecuenciaTemp;
			};

			$scope.onEndPlazo = function () {
				$scope.producto.plazo = $scope.producto.plazoTemp;
			};

			if (!$scope.producto) {

				$scope.producto = {};
				$scope.producto.frecuenciaValues = ['SEMANA', 'QUINCENA', 'MES'];
				$scope.producto.plazoMin = 0;
				$scope.producto.plazoMax = 0;
				$scope.producto.prestamoTemp = 0;
				$scope.producto.frecuenciaTemp = 0;
				$scope.producto.plazoTemp = 0;
			} else {
				$scope.producto.frecuenciaValues = ['SEMANA', 'QUINCENA', 'MES'];
				$scope.producto.prestamoTemp = $scope.producto.prestamo;
				$scope.producto.frecuenciaTemp = $scope.producto.frecuencia;
				updateRangePLazo();
				$scope.producto.plazoTemp = $scope.producto.plazo;
			}

			var hashParams;

			$scope.calculate = function () {
				$log.info('calculate [$scope.producto.prestamo, $scope.producto.frecuencia, $scope.producto.plazo, $scope.producto.tasa]', $scope.producto.prestamo, $scope.producto.frecuencia, $scope.producto.plazo, $scope.producto.tasa);

				Simulator.calculate($scope.producto.prestamo, $scope.producto.frecuencia, $scope.producto.plazo, $scope.producto.tasa).then(function (response) {
					$scope.producto.interes = response.totalInteres;
					$scope.producto.ivaInteres = response.totalIvaInteres;
					$scope.producto.total = response.totalTotal;
					if (_.size(response.pagos) > 0) {
						$scope.producto.pagos = response.pagos;
						$scope.producto.totalPagos = _.size(response.pagos);
						$scope.producto.pago = response.pagos[0].total;
					}
					$scope.producto.periodo = response.periodo;
					$scope.producto.frecuenciaEn = response.frecuenciaEn;
				});

				if (_(true).isEqual($scope.mostrar)) {
					consultaCatService.calculate($scope.producto.frecuencia, $scope.producto.tasa, $scope.producto.plazo).then(function (cat) {
						$log.log('cat', cat);
						$log.log('TypeOfcat', typeof (cat));
						$scope.producto.cat = parseInt(cat);
					});
				}

			}

			$scope.update = function () {
				$scope.producto.prestamo = $scope.producto.prestamoTemp;
				$scope.producto.frecuencia = $scope.producto.frecuenciaTemp;
				$scope.producto.plazo = $scope.producto.plazoTemp;
			}

			$scope.$watch('producto.prestamo', function () {
				if (!_($scope.producto).isUndefined()) {
					$scope.producto.prestamoTemp = $scope.producto.prestamo;

					if (isValidParams()) {
						$scope.calculate();
					}
				}
			});

			$scope.$watch('producto.frecuencia', function (newFrecuenciaValue, oldFrecuenciaValue) {
				if (!_($scope.producto).isUndefined()) {
					var originalPlazo = $scope.producto.plazo;
					if (_($scope.producto.frecuencia).isString()) {

						$scope.producto.frecuenciaTemp = $scope.producto.frecuencia;

						updateRangePLazo();

						if (isValidParams()) {
							$scope.producto.plazo = updatePlazo(originalPlazo, newFrecuenciaValue, oldFrecuenciaValue);
							$scope.calculate();
						}

					}
				}
			});

			$scope.$watch('producto.plazo', function () {
				if (!_($scope.producto).isUndefined()) {
					$scope.producto.plazoTemp = $scope.producto.plazo;

					if (isValidParams()) {
						$scope.calculate();
					}
				}
			});

			function updateRangePLazo() {
				if ($scope.producto.frecuencia === 'QUINCENA') {
					$scope.producto.plazoMin = 4;
					$scope.producto.plazoMax = 26;
				} else if ($scope.producto.frecuencia === 'SEMANA') {
					$scope.producto.plazoMin = 8;
					$scope.producto.plazoMax = 52;
				} else if ($scope.producto.frecuencia === 'MES') {
					$scope.producto.plazoMin = 2;
					$scope.producto.plazoMax = 12;
				}
			}
			function updatePlazo(originalPlazo, newFrecuenciaValue, oldFrecuenciaValue) {
				if (!_(newFrecuenciaValue).isEqual(oldFrecuenciaValue)) {
					$log.debug('originalPlazo', originalPlazo);
					$log.debug('newFrecuenciaValue', newFrecuenciaValue);
					$log.debug('oldFrecuenciaValue', oldFrecuenciaValue);

					var newPlazo;

					if (_('SEMANA').isEqual(oldFrecuenciaValue)) {
						if (_('QUINCENA').isEqual(newFrecuenciaValue)) {
							newPlazo = Math.round(originalPlazo / 2);
						} else if (_('MES').isEqual(newFrecuenciaValue)) {
							newPlazo = Math.round(originalPlazo / 4);
						}
					} else
						if (_('QUINCENA').isEqual(oldFrecuenciaValue)) {
							if (_('SEMANA').isEqual(newFrecuenciaValue)) {
								newPlazo = originalPlazo * 2;
							} else if (_('MES').isEqual(newFrecuenciaValue)) {
								newPlazo = Math.round(originalPlazo / 2);
							}
						} else
							if (_('MES').isEqual(oldFrecuenciaValue)) {
								if (_('SEMANA').isEqual(newFrecuenciaValue)) {
									newPlazo = originalPlazo * 4;
								} else if (_('QUINCENA').isEqual(newFrecuenciaValue)) {
									newPlazo = originalPlazo * 2;
								}
							} else {
								newPlazo = originalPlazo;
							}

					return newPlazo;

				} else {
					return originalPlazo;
				}

			}

			function isValidParams() {
				var result = true;
				if (!_($scope.producto.prestamo).isNumber() || _($scope.producto.prestamo).isNaN()) {
					result = false;
				}
				if (!_($scope.producto.plazo).isNumber() || _($scope.producto.plazo).isNaN()) {
					result = false;
				}
				if (!_($scope.producto.frecuencia).isString()) {
					result = false;
				}

				if (result) {
					var newHashParams = calculateHashParams();

					if (_(hashParams).isEqual(newHashParams)) {
						result = false;
					} else {
						hashParams = newHashParams;
					}
				}
				return result;
			}

			function calculateHashParams() {
				var indexFrecuencia = _($scope.producto.frecuenciaValues).indexOf($scope.producto.frecuencia);

				return $scope.producto.prestamo + $scope.producto.plazo + indexFrecuencia;
			}

			$scope.combined = function (item) {
				if (item.frecuencia === 'MES') {
					return item.frecuencia + "ES";
				}
				else {
					return item.frecuencia + "S";
				}
			}

		}
	};
});