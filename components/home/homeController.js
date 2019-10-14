'use strict';
angular.module('home')
.controller('homeController', ['$scope', '$state', '$stateParams', 'LoginService', 'prestamosService', '$log', 'Cliente', '$rootScope', 'localStorageService', 'alertService', 'EnvironmentConfig', function($scope, $state, $stateParams, LoginService, prestamosService, $log, Cliente, $rootScope, localStorageService, alertService, EnvironmentConfig) {
	$scope.isMobileApp = EnvironmentConfig.isMobile;
	$scope.loan = {
		isDomiciled: true
	};
	
	$scope.payments = {
		pagosRealizados: [],	
		pagosPendientes: [],
		pagosParciales: [],
		pagosVencidos: [], 
		transaccionesRealizadas: [],
        desplegarRealizados: "false", 
        desplegarTransacciones: "false", 
        desplegarPendientes: "false", 
        desplegarParciales: "false", 
        desplegarTardios: "false" 
	};
	
	$scope.$watch('init', function(){
			loadLoanInfo();
	});

	function loadLoanInfo(){
		var cliente = new Cliente({id: LoginService.currentUser().id});						   

		$rootScope.showLoading();	
		cliente.getBasicData().then(function(user){
			$scope.$emit('loadUserData', user);

				
			if(_($scope.loan.loanId).isEmpty()){
				
				prestamosService.getActiveLoanByClientId(user.encodedKey).then(function(response){				
					$rootScope.hideLoading();

					$scope.loan.loanId = response.id;
					$scope.loan.encodedKeyId = response.encodedKey;
					if(_($scope.loan.loanId).isEmpty()){
						alertService.addAlert('ERROR', 'Estado inválido ', "No hay préstamos para este usuario");
					}else{
						$state.go('home.miPrestamo', {loanId: response.id});	
					}
				}, function(){
					$rootScope.hideLoading();
				});
			}else{
				$state.go('home.miPrestamo', {loanId: $scope.loan.loanId});
			}

		});
	};	

}]);