angular.module('buscador')
.controller('incidenciasController', ['$scope', 'incidencias', function($scope, incidencias){ 
	$scope.incidencias = incidencias;
}]);