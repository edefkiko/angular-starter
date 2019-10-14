angular.module('home')
.config(function($stateProvider, VIEW_PATH) {
	$stateProvider
	.state("home", {
	 	url: "/home",
	 	authenticate: true,
	 	gaViewName: VIEW_PATH.home,
	 	views: {
			"": {
				controller: "homeController",
				templateUrl: 'components/home/home.html'
			}
		},
		params: {
			loanId: null
		}
	}).state("home.miPrestamo", {
		url: "",
		authenticate: true,
		gaViewName: VIEW_PATH.miPrestamo,
		views: {
			"": {
				controller: "homeMiPrestamoController",
				templateUrl: "components/home/miPrestamo/miPrestamo.html"
			}
		}
	}).state("home.dondePago", {
		url: "",
		authenticate: true,
		gaViewName: VIEW_PATH.dondePago,
		params: {
			user: null
		},
		views: {
			"": {
				controller: "homeDondePagoController",
				templateUrl: "components/home/dondePago/dondePago.html"
			}
		}
	})
	.state("home.estadoCuenta", {
		url: "",
		authenticate: true,
		gaViewName: VIEW_PATH.estadoCuenta,
		views: {
			"": {
				controller: "homeEstadoCuentaController",
				templateUrl: "components/home/estadoCuenta/estadoCuenta.html"
			}
		}
	})
	.state("home.contrato", {
		url: "",
		authenticate: true,
		gaViewName: VIEW_PATH.homeContrato,
		views: {
			"": {
				controller: "homeContratoController",
				templateUrl: "components/home/contrato/contrato.html"
			}
		}
	})
	.state("problemaSolicitud", {
		url: "/problemaSolicitud",
		ignoreState : true,
		authenticate: true,
		views: {
			"": {
				controller: "problemaSolicitudCtrl",
				templateUrl: "components/home/problema_solicitud/problemaSolicitud.html"
			}
		}
	});
});