angular.module('homeHistoricoPrestamo')
.config(function($stateProvider, VIEW_PATH) {
	$stateProvider
	.state("homeHistoricoPrestamo", {
	 	url: "/homeHistoricoPrestamo",
	 	authenticate: true,
	 	gaViewName: VIEW_PATH.homeHistoricoPrestamo,
	 	views: {
			"": {
				controller: "homeHistoricoPrestamoController",
				//controllerAs: "homeReContratacion",
				templateUrl: 'components/home_historico_prestamos/homeHistoricoPrestamo.html'
			}
		}
	});
});