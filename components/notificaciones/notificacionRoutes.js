angular.module('notificaciones')
.config(function($stateProvider, VIEW_PATH) {
	$stateProvider
	.state("notificaciones", {
		url: "/notificaciones",
		authenticate: true,
		gaViewName: VIEW_PATH.notificaciones,
		templateUrl: "components/notificaciones/notificaciones.html",
		controller: "notificacionesController"
	})
	.state("notificacionDetalle", {
		url: "/notificacionDetalle/:id",
		authenticate: true,
		gaViewName: VIEW_PATH.notificacionDetalle,
		templateUrl: "components/notificaciones/notificacionDetallle.html",
		controller: "notificacionDetalleController"
	});
});