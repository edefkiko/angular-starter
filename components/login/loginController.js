angular.module('login')
.controller('loginCtrl', ['$scope', '$state', 'LoginService', '$rootScope', 'semilla', '$stateParams', '$log', function($scope, $state, LoginService, $rootScope, semilla, $stateParams, $log){
	$scope.$on('$viewContentLoaded', function(){
		if($rootScope.isMobile){
			$('header').hide();
			$('footer').hide();
		}

	});

	$scope.$on("$destroy", function() {
		if($rootScope.isMobile){
			$('header').show();
			$('footer').show();
		}	
	});

	if($rootScope.isMobile){
		$scope.isLoginApp = true;
	}

	//----------------------------------------------------------------------
	var origen = $stateParams.pagOrigen;
	if(LoginService.isLoggedIn()){
		$state.go('root');
	}

	$scope.invalido = false;
	$scope.mensaje = "";
	
	$scope.credentials = {
		username: '',
		password: '',
		encPassword: '' 
	};
	$scope.emailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	
	$scope.login = function(credentials){
		if($scope.loginPaso2){
			return;
		}

		$scope.dataloading = true;

		LoginService.validaMail(credentials, origen).then(function(nombreUsuario){
			
			$scope.loginPaso2 = true;

			$scope.nombreUsuario = nombreUsuario;
			$scope.dataloading = false;
			$scope.invalido = false;
			$scope.mensaje = "";
		}, function(response){
			$scope.invalido = true;
			$scope.mensaje = response;
			$scope.dataloading = false;
		});

	};	

	$scope.regresar = function(credentials){
			$scope.loginPaso2 = false;
			
			$scope.nombreUsuario = "";
			$scope.dataloading = false;
			$scope.invalido = false;
			$scope.mensaje = "";
			if($scope.credentials2){
				$scope.credentials2.password = "";	
			}
			

	};	

	$scope.login2 = function(credentials2){
		if ($scope.loginForm2.$valid && $scope.loginPaso2) {
		
			$scope.dataloading = true;

			$scope.credentials.encPassword = md5(credentials2.password, semilla);
			
			LoginService.login($scope.credentials, origen).then(function(){
				$scope.dataloading = false;
			}, function(response){
				$scope.invalido = true;
				$scope.mensaje = response;
				$scope.dataloading = false;
			});
		}else{
			return;
		}
	};	
}])