angular.module('homeRecontratacion')
.config(function($stateProvider, VIEW_PATH) {
	$stateProvider
	.state("homeRecontratacion", {
	 	url: "/homeRecontratacion",
	 	authenticate: true,
	 	gaViewName: VIEW_PATH.homeRecontratacion,
	 	views: {
			"": {
				controller: "homeRecontratacionController",
				controllerAs: "homeRecontratacionController",
				templateUrl: 'components/home_recontratacion/homeRecontratacion.html'
			}
		}
	});
});