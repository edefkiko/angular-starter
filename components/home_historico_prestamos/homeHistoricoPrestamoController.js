'use strict';
angular.module("homeHistoricoPrestamo")
.controller('homeHistoricoPrestamoController', ['$scope', '$state', '$stateParams', 'LoginService', 'prestamosService', '$log', '$rootScope', 'Solicitud',
	function($scope, $state, $stateParams, LoginService, prestamosService, $log, $rootScope, Solicitud) {
	var userId = LoginService.currentUser().id;
	var indicePrimerpagina = 0;
	var registrosPorPagina = 10;
	$scope.unoAlaVez = true;
	$scope.max = 100;
	$scope.paginas = [];
	var arregloExt= [];
	
	

	$scope.$watch("init", function(){
		/* 
		Se realiza la busqueda de prestamos por id de idUsuario/cliente	
		*/
		$rootScope.showLoading();
		prestamosService.getLoansIdByClientId(userId).then(function(resultadoCredito){
			
			var paginas = [];
	        var tabsDecimal = (resultadoCredito.length/registrosPorPagina).toFixed(2);
	        var tabsEntero =  parseInt(tabsDecimal.toString().split(".")[0]);
	        var arregloInt= [];
			var indiceExterno=0;
	      	var indiceInterno=0; 
	      	var j=0;
	       
	        if(tabsDecimal.valueOf()>tabsEntero){
	        	tabsEntero+=1;
	        }
	        
	        /*
	        	Se construyen las paginas.
	        */
	      	for(var i=0;i<tabsEntero;i++){
	      		arregloExt[i]=[];
	      		paginas.push(i+1);   		
	      	}

	      	/*
	      		Se realiza la iteracion para construir en base al numero de paginas y numero de registros los acordeones.
	      	*/
	      	for(;j<=registrosPorPagina;j++){

	      		var interno;
	      		
	      		if(!_.isUndefined(arregloExt[indiceExterno]) && indiceExterno<registrosPorPagina && !_.isUndefined(resultadoCredito[j])){
	      			
	      			interno= arregloExt[indiceExterno];
	      			interno[indiceInterno]= resultadoCredito[j];
	      			arregloExt[indiceExterno]=interno;
	      			indiceExterno++;

	      		}else{
	      			if(indiceExterno<registrosPorPagina && !_.isUndefined(resultadoCredito[j])){
		      			interno= arregloExt[indiceExterno];
		      			interno[indiceInterno] = resultadoCredito[j];
		      			arregloExt[indiceExterno]=interno;
		      		}else{

		      			interno= arregloExt[indiceExterno];
		      			if(!_.isUndefined(resultadoCredito[j])){
		      				interno[indiceInterno] = resultadoCredito[j];
		      				arregloExt[indiceExterno]=interno;
		      			}
		      		}
	      		}
	      		
	      		if(indiceExterno >= arregloExt.length){
	      				indiceExterno--;
	      				indiceInterno++;
	      			}else 

	      			if(indiceInterno >= interno.length){
	      				indiceInterno++;
	      			}
	      	}

	        $scope.paginas = paginas;
	        
	        /*
	        	Se ejecuta el metodo para que se visualizen los resulatos de la primer pagina.
	        */
	        mostrarPrimerPagina(arregloExt);

		}, function(){
				$log.error("No se obtuvieron resultados para el id: "+ clienteId);			
		});

		function mostrarPrimerPagina (arregloExt){
			$scope.resultadoCredito = arregloExt[indicePrimerpagina];
			$rootScope.hideLoading();
		}
				
	});

	/*
		Metodo que realiza consulta de prestamos por id de credito.
	*/
	$scope.consultarPrestamos= function (creditoId){
			$rootScope.showLoading();
			refrescarValores();

			prestamosService.obtenerPrestamo(creditoId).then(function(prestamo){
			$scope.producto = prestamo.producto;
			$scope.hoy = prestamo.hoy;			
			$scope.saldoPagosHoy = prestamo.saldoPagosHoy;
			$scope.pagos = prestamo.pagos;
			$scope.detener = false;
			$scope.dynamic = 0;	
			$rootScope.hideLoading();	
			}, function(){
				$log.error("No se obtuvieron resultados para el id: "+ creditoId);
			});
	}

	/*
		Metodo que obtiene la lista de acordeones del arreglo.
	*/
	$scope.obtenerAcordeones = function (llaveLista){

		var indicePagina = parseInt(llaveLista);
		$scope.resultadoCredito = arregloExt[indicePagina-1];		
	}

	/*
		Metodo que limpia las variables.
	*/
	function refrescarValores(){
		$scope.detener = true;
		$scope.producto = {};
		$scope.hoy = "";			
		$scope.saldoPagosHoy = "";
		$scope.pagos = [];
	}


}]);


	


