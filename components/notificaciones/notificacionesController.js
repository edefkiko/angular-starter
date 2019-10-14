angular.module('notificaciones')
.controller('notificacionesController', ['$scope', '_', '$log', 'Notificacion', 'LoginService', '$rootScope', '$anchorScroll', function($scope, _, $log, Notificacion, LoginService, $rootScope, $anchorScroll){ 
	var user = LoginService.currentUser();
	var notificacion = new Notificacion(user.id);

	$rootScope.showLoading();	
	notificacion.get().then(function(notificaciones){
		$rootScope.hideLoading();


		$scope.notificaciones = notificacion.remove(notificaciones);

		$rootScope.$emit('loadNotifications', user.id, notificaciones);
		

		$scope.configPages();	
	}, function(){
		$rootScope.hideLoading();
	});


	$scope.goToTop = function(){
		$anchorScroll();
	};

	$scope.notificaciones = [];
	$scope.currentPage = 0;
	$scope.pageSize = 10; // Esta la cantidad de registros que deseamos mostrar por página
	$scope.pages = [];

	$scope.configPages = function() {
	   $scope.pages.length = 0;

	   var ini = $scope.currentPage - 4;
	   var fin = $scope.currentPage + 5;

	   if (ini < 1) {
	      ini = 1;
	      if (Math.ceil($scope.notificaciones.length / $scope.pageSize) > 10) {
	      	fin = 10;
	      }
	      else {
	      	fin = Math.ceil($scope.notificaciones.length / $scope.pageSize);
	      }
	   } else {
	      if (ini >= Math.ceil($scope.notificaciones.length / $scope.pageSize) - 10) {
	         ini = Math.ceil($scope.notificaciones.length / $scope.pageSize) - 10;
	         fin = Math.ceil($scope.notificaciones.length / $scope.pageSize);
	      }
	   }
	   if (ini < 1) {
	   	ini = 1
	   };
	   for (var i = ini; i <= fin; i++) {
	      $scope.pages.push({ no: i });
	   }
	   if ($scope.currentPage >= $scope.pages.length){
	      $scope.currentPage = $scope.pages.length - 1;
	   }
	};

	$scope.setPage = function(index) {
	   $scope.currentPage = index - 1;
	};
    

}]);