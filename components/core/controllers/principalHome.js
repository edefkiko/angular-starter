app.controller('principalHomeController', ['$scope', '$rootScope', 'CLIENT_STATUS', '$state', 'Solicitud', 'ProductoPadre', 'ngDialog', 'LoginService', 'Cliente', '$log', 'localStorageService', function($scope, $rootScope, CLIENT_STATUS, $state, Solicitud, ProductoPadre, ngDialog, LoginService, Cliente, $log, localStorageService){
	var currentUser = LoginService.currentUser();
	function init(){

		if( LoginService.isLoggedIn() ){

			var cliente = new Cliente({id: currentUser.id});
			$log.info("Usuario está logueado ", currentUser);

			$rootScope.showLoading();
			cliente.getBasicData().then(function(user){
				$rootScope.hideLoading();
				
				$scope.$emit('loadUserData', user);

				if( _(currentUser.situacion).isEqual('Cliente') ){
					
					$state.go('home.miPrestamo');

				} else if( _(currentUser.situacion).isEqual('Prospecto') ){
					//$log.log('Es prospecto');
					//$log.log('currentUser.idSolicitud:', currentUser.idSolicitud);
					if( _(currentUser.idSolicitud).isNull() ){
						$state.go('not-found');					
					}else {
						$state.go('redirect');
					}

				} else if( _(currentUser.situacion).isEqual('Desertor') ){
					if( _(currentUser.idSolicitud).isNumber() || !_(currentUser.idSolicitud).isEmpty()){
						$state.go('redirect');				
					}else {
						$state.go('homeRecontratacion');							
					}
				}

			});
		}else{
			$state.go('simuladorProspecto');			
		}	

	}

	init();

}]);