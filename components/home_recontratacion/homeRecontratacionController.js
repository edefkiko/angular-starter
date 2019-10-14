'use strict';
angular.module("homeRecontratacion")
.controller('homeRecontratacionController', ['$scope', '$rootScope', '$state', '$stateParams', 'LoginService', 'prestamosService', '$log', 'Solicitud', '$filter',  '$q', 'localStorageService',
	function($scope, $rootScope, $state, $stateParams, LoginService, prestamosService, $log, Solicitud, $filter, $q, localStorageService) {

	var userId = LoginService.currentUser().id;
	$scope.mostrarCreditoNuevo = false;
	$scope.isSolicitudActive = false;
	$scope.tienePrestamoActivo = false;

	function init(){
		
		var prestamoId = null;
		var rechazado = null;

		//Se realiza la conuslta de productos por cliente logado.317435753 057123733
		$rootScope.showLoading();
		prestamosService.getLoansByClientId(userId).then(function(prestamos){			
			
			var lastClosedLoad;

			_.each(prestamos, function(prestamo){ 
					
		          if(_.isEqual(prestamo.accountState,"CLOSED")){
		          	 lastClosedLoad = prestamo;		            
		          }else if(_.isEqual(prestamo.accountState,"ACTIVE")){
		          	$log.debug('TIENE PRESTAMOS ACTIVOS', prestamo.accountState);
		          	$scope.tienePrestamoActivo = true
		          }
			}); 

			if(!_(lastClosedLoad).isEmpty()){
				prestamoId = lastClosedLoad.id;
		        rechazado = lastClosedLoad.encodedKey;
		        $scope.fechaLiquidacion = $filter('date')(lastClosedLoad.closedDate, "dd/MM/yyyy")
		        $scope.mostrarBtnhistorial = false;	
			}
				

				obtenerNumeroMaximoDiasAtraso(prestamoId);
				//Se evalua  si se encontro un crdito activo.
				//console.info('===rechazado:'+rechazado); 
				 if(prestamoId == null){
				 	$scope.mostrarBtnhistorial = true;
				 	$log.error("El cliente no tiene creditos activos. ");
				 }else if(rechazado== null){
				 	$scope.mostrarBtnhistorial = true;
				 }else{	
				 	consultaPrestamos(prestamoId);
					}
					
					
		}, function(){
				$log.error("No se obtuvieron resultados para el prestamo con id:: "+ prestamoId);			
		});

		//Definicion de funciones

		function obtenerNumeroMaximoDiasAtraso(creditoId, tienePrestamoActivo){
				
			prestamosService.obtenerCustomInformation(creditoId,"Maximo_Dias_Cuentas_de_Prestamo").then(function(customField){
			$log.info('===obtenNumeroMaximoDiasAtraso customField:'+ customField);//JSON.stringify(customField[0])
			$log.info('===customField:'+JSON.stringify(customField));  

			var tieneBuenHistorialCred;
			if(!_.isEmpty(customField)){
				tieneBuenHistorialCred = customField[0].value < 46?true:false;
			}else{
				tieneBuenHistorialCred = true;
			}
			// = customField==null?true:(customField[0].value < 46?true:false);
			
			$log.info('===tieneBuenHistorialCred: '+tieneBuenHistorialCred);

			isSolicitudActive().then(function(isSolicitudActive){
				$log.info('===isSolicitudActive: '+isSolicitudActive);

				$scope.mostrarCreditoNuevo = tieneBuenHistorialCred && !isSolicitudActive && !$scope.tienePrestamoActivo;
			});

			$log.info('$scope.mostrarCreditoNuevo ->'+$scope.mostrarCreditoNuevo);

			}, function(){
				$log.error("No fue posible validar el estatus del credito con id: "+ creditoId);
			});
		}


		function consultaPrestamos(prestamoId){
			
			 prestamosService.obtenerPrestamo(prestamoId).then(function(prestamo){

			 	$scope.producto = prestamo.producto;
				$scope.hoy = prestamo.hoy;			
				$scope.saldoPagosHoy = prestamo.saldoPagosHoy;
				$scope.pagosVencidos = prestamo.pagosVencidos;
				$scope.pagos = prestamo.pagos;
				$rootScope.hideLoading();
								
			}, function(){
				$log.error("No se obtuvieron resultados para el prestamo con id: "+ prestamoId);
			});	 	
		}

	}

	function isSolicitudActive(){
		var deferred = $q.defer();

		if(!_(LoginService.currentUser().idSolicitud).isEmpty()){

			var solicitudMem = localStorageService.get('solicitud');
			var solicitudModel;

			if(_(solicitudMem).isNull()){
				solicitudModel = new Solicitud({id: LoginService.currentUser().idSolicitud});
			}else{
				solicitudModel = new Solicitud(solicitudMem);
			}
			
			solicitudModel.getSolicitudActiva(LoginService.currentUser().id, true).then(function(response){
				$log.debug('solicitud.estatusSolicitud: "', response);
				
				if(response.estatusSolicitud === "Activa"){
					deferred.resolve(true);
				}else{
					deferred.resolve(false);
				}

			});

		}else{
			deferred.resolve(false);
		}

		return deferred.promise;
	}

	init();

}]);