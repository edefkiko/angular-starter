angular.module('simulador')
	.controller('simuladorDesertorController', ['$scope', '$rootScope', 'CLIENT_STATUS', '$state', 'Solicitud', 'ProductoRenovacion', 'ngDialog', 'LoginService', 'Cliente', '$log', 'localStorageService', 'Simulator', 'alertService', 'Prestamo', '$q', '_', '$timeout', function($scope, $rootScope, CLIENT_STATUS, $state, Solicitud, ProductoRenovacion, ngDialog, LoginService, Cliente, $log, localStorageService, Simulator, alertService, Prestamo, $q, _, $timeout) {
		var currentUser = LoginService.currentUser();
		var prestamoModel = new Prestamo(currentUser.id);
		var solicitudModel = new Solicitud({});

		$scope.prestamoAnt = {};
		$scope.producto = {};

		var cliente = new Cliente({
			id: currentUser.id
		});
		var lastClosedLoan;

		function init() {

			$rootScope.showLoading();
			cliente.getBasicData().then(function(user) {

				$scope.$emit('loadUserData', user);

				prestamoModel.getLastClosedLoan(currentUser.id).then(function(lastLoan) {
					lastClosedLoan = lastLoan;

					$scope.prestamoAnt.monto = lastLoan.monto;
					$scope.prestamoAnt.tasa = lastLoan.tasa;
					$scope.prestamoAnt.frecuencia = lastLoan.frecuencia;
					$scope.prestamoAnt.plazo = lastLoan.plazo;
					$scope.prestamoAnt.periodo = lastLoan.periodo;

					$timeout(function() {
						$scope.$broadcast('rzSliderForceRender');
					}, 1000);

					Simulator.calculate($scope.prestamoAnt.monto, $scope.prestamoAnt.frecuencia, $scope.prestamoAnt.plazo, $scope.prestamoAnt.tasa).then(function(prestamoCalculado) {

						$scope.prestamoAnt.interes = prestamoCalculado.totalInteres;
						$scope.prestamoAnt.ivaInteres = prestamoCalculado.totalIvaInteres;
						$scope.prestamoAnt.total = prestamoCalculado.totalTotal;
						$scope.prestamoAnt.pago = prestamoCalculado.pagos[0].total;


						ProductoRenovacion.load(currentUser.id).then(function() {

							$rootScope.hideLoading();
							$scope.newTasa = ProductoRenovacion.getTasa() - $scope.prestamoAnt.tasa;

							$scope.producto.montoMin = ProductoRenovacion.getMontoMinimo();
							$scope.producto.montoMax = ProductoRenovacion.getMontoMaximo();

							$scope.producto.prestamo = parseInt($scope.prestamoAnt.monto);
							$scope.producto.plazo = $scope.prestamoAnt.plazo;
							$scope.producto.tasa = ProductoRenovacion.getTasa();
							$scope.producto.frecuencia = $scope.prestamoAnt.frecuencia;
							$scope.producto.periodo = $scope.prestamoAnt.periodo;

						});

					});

				}, function(err) {
					alertService.addAlert('ERROR', 'Estado inválido ', err);
				});


			});

		}

		function getVigenciaIfe() {
			var deferred = $q.defer();

			cliente.getUserData().then(function(user) {
				deferred.resolve(user.vigenciaIfe);
			});

			return deferred.promise;
		}

		$scope.loQuiero = function() {
			var solicitud = {};

			solicitud.iva = $scope.producto.iva;
			solicitud.monto = $scope.producto.prestamo;
			solicitud.interes = $scope.producto.interes;
			solicitud.ivaInteres = $scope.producto.ivaInteres;
			solicitud.total = $scope.producto.total;
			solicitud.plazo = $scope.producto.plazo;
			solicitud.frecuencia = $scope.producto.frecuencia;
			solicitud.tasa = $scope.producto.tasa;
			solicitud.peridoPagos = $scope.producto.periodo;
			solicitud.frecuenciaEn = $scope.producto.frecuenciaEn;

			solicitud.tasaSolicitudMotor = ProductoRenovacion.getTasa();
			solicitud.montoSolicitudMotor = ProductoRenovacion.getMontoMaximo();

			if (LoginService.isLoggedIn() && _(currentUser.situacion).isEqual('Desertor')) {

				$rootScope.showLoading();

				getVigenciaIfe().then(function(vigencia) {

					solicitud.estatusCliente = CLIENT_STATUS.DATOS_DOMICILIO.value;
					solicitud.selfie = "Sí";

					if (prestamoModel.isIfeValid(vigencia)) {
						$log.info('IFE es vigente: ', vigencia);

						solicitud.ife = "Sí"
					}

					if (prestamoModel.esBuenPagador(lastClosedLoan.maxDiasAtraso)) {
						$log.info('Es buen pagador, no necesita Comprobante ', lastClosedLoan.maxDiasAtraso);
						solicitud.comprobante = "Sí";
					}

					solicitudModel = new Solicitud(solicitud);

					solicitudModel.create(currentUser.id).then(function(idSolicitud) {

						solicitudModel.setId(idSolicitud);

						solicitudModel.getSolicitudById(currentUser.id).then(function(solicitudActiva) {
							$rootScope.hideLoading();

							solicitudModel.setSolicitudOnMemory(solicitudActiva);

							currentUser = localStorageService.get('user');
							currentUser.idSolicitud = idSolicitud;
							currentUser = localStorageService.set('user', currentUser);

							$state.go(CLIENT_STATUS.DATOS_DOMICILIO.state);
						});

					});

				});
			} else {
				$log.log('LoginService.isLoggedIn() && _(currentUser.situacion).isEqual(Desertor)', LoginService.isLoggedIn(), _(currentUser.situacion).isEqual('Desertor'));
			}
		};



		init();

	}]);