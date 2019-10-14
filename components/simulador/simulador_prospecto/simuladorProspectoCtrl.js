angular.module('simulador')
.controller('simuladorProspectoController', ['$scope', '$rootScope', 'CLIENT_STATUS', '$state', 'Solicitud', 'ProductoPadre', 'ngDialog', 'LoginService', 'Cliente', '$log', 'localStorageService', '$timeout', function($scope, $rootScope, CLIENT_STATUS, $state, Solicitud, ProductoPadre, ngDialog, LoginService, Cliente, $log, localStorageService, $timeout){
	var user = LoginService.currentUser();
	var solicitudModel = new Solicitud({});

	function init(){
		$rootScope.showLoading()

		ProductoPadre.load().then(function(){
			$rootScope.hideLoading();
			$scope.producto = {};
			$scope.producto.prestamo= ProductoPadre.getDefaultMonto();
			$scope.producto.montoMin= ProductoPadre.getMontoMinimo();
			$scope.producto.montoMax= ProductoPadre.getMontoMaximo();
			$scope.producto.tasa= ProductoPadre.getDefaultTasa();
			$scope.producto.frecuencia= ProductoPadre.getDefaultFrecuencia();
			$scope.producto.plazo= ProductoPadre.getDefaultPlazo();
			$scope.producto.periodo= ProductoPadre.getDefaultPeriodo();

			$log.log('$scope.producto', $scope.producto);
			 $timeout(function () {
				$scope.$broadcast('rzSliderForceRender');
			}, 1000);
		});

	}

	$scope.loQuiero = function(){
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
		solicitudModel.setSolicitudOnMemory(solicitud);
		registerDialog();

		//Función google analytics
		ga('send', 'event', 'homePublica', 'Click', 'loQuiero');
	};

	var registerDialogProm;

	function registerDialog(){
		$scope.origen='root';
		registerDialogProm = ngDialog.open({
			template: 'components/login/facebook/registerFacebook.html',
			controller: 'loginFacebookCtrl',
			scope: $scope
		});

		registerDialogProm.closePromise.then(function (data) {
			if(_(data.value).isEqual('$escape') || _(data.value).isEqual('$closeButton')){
				$scope.loQuieroClicked = false;
			}

		});
	}

	$scope.$on('$viewContentLoaded', function(){
		loadnoUISlider();
	});

    init();

}]);