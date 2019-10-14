angular.module('buscador')
.controller('buscadorResultCtrl', ['$scope', '_', '$stateParams', 'catalogoService', '$log', 'incidencias', function($scope, _, $stateParams, catalogoService, $log, incidencias){ 
	$scope.incidencias = incidencias;
	$scope.classButtonLike = 'button sinFondo';
	$scope.classButtonUnlike = 'button sinFondo';
	$scope.disableBotonLikes = false;
	
	if(_($stateParams.item).isEmpty()){
		result= false;
	}else {

		$scope.result = {};
		catalogoService.ejecutaConsltaDescripcion($stateParams.item).then(function(result){
			$log.debug('ejecutaConsltaDescripcion', result);
			$scope.ayudasRelacionadas = result.ayudasRelacionadas;
			$scope.result.title = $stateParams.descOpcion;
			$scope.result.description = result.descripcionLarga;
		});			
	}


	$scope.botonesAceptacion = function(titulo) {
		var substring = "unlike";
		var seleccionado = " seleccionado"
		$log.debug(titulo.indexOf(substring) !== -1);
		$log.debug(titulo);
		if(titulo.indexOf(substring) !== -1) {
			$scope.classButtonUnlike = $scope.classButtonUnlike + seleccionado;
			$scope.disableBotonLikes = true;
		} else {
			$scope.classButtonLike = $scope.classButtonLike + seleccionado;
			$scope.disableBotonLikes = true;
		}
		ga('send', 'event', 'buscador', 'Click', titulo);
	}

}]);