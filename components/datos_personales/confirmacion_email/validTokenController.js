angular.module('datosPersonales')
.controller('validTokenController', ['$scope', '$stateParams', 'base64Util', 'LoginService', 'CLIENT_STATUS', 'StatusService', '$state', 'Cliente', '$rootScope', '$log', 'Solicitud', 'Confirmation', 'ngDialog', 'utils', function($scope, $stateParams, base64Util, LoginService, CLIENT_STATUS, StatusService, $state, Cliente, $rootScope, $log, Solicitud, Confirmation, ngDialog, utils){

	var statusSolicitud;
	var dialog;
	$scope.$watch('init', function(){	

		if(LoginService.isLoggedIn()){	
			
			var cliente = new Cliente({id: LoginService.currentUser().id});

			cliente.getBasicData().then(function(user){			
				
				$scope.$emit('loadUserData', user);

				$scope.emailAddress = utils.hideEmail(user.emailAddress);
				$scope.mobilePhone1 = utils.hidePhone(user.mobilePhone1);	

				$scope.sendConfirmation();			
			});

		}else{
			$state.go('login');
		}

	});

	$scope.resend = function(){
		$scope.dataloading = true;	
		$scope.dataloadingResend = true;
		if($scope.canal === 'SMS'){
			Confirmation.sendSMS().then(function(){
				$scope.dataloading = false;
				$scope.dataloadingResend = false;
			});
		}else{
			Confirmation.sendMail().then(function(){
				$scope.dataloading = false;
				$scope.dataloadingResend = false;
			});;	
		}
		
	}

	$scope.sendConfirmation = function(){
		var userId = LoginService.currentUser().id;	
		var idSolicitud = LoginService.currentUser().idSolicitud;
		Confirmation.init(userId, idSolicitud);	

		$rootScope.showLoading();
		
		Confirmation.isFirstConfirmation(userId).then(function(result){
			if(result){
				Confirmation.sendFirstConfirmation().then(function(result){											
					statusSolicitud = CLIENT_STATUS.PRIMERA_CONFIRMACION;
					$scope.canal = result;
					
					$rootScope.hideLoading();
					openDialog();
				});
			}else{
				Confirmation.sendSecondConfirmation().then(function(result){
					statusSolicitud = CLIENT_STATUS.SEGUNDA_CONFIRMACION;
					$scope.canal = result;						

					$rootScope.hideLoading();
					openDialog();
				});
			}				
		});		
	}

	function openDialog(){
		dialog = ngDialog.open({ 
			template: 'components/datos_personales/confirmacion_email/confirmacionTemplate.html', 
			className: 'ngdialog-theme-default',
			scope: $scope,
			closeByEscape: false,
			closeByDocument: false,
			closeByNavigation: false,
			showClose: false
		});
	};

	$scope.verificaCodigo = function(cliente){			
		$scope.dataloading = true;		
		var canal = $scope.canal.toLowerCase();

		Confirmation.verificaCodigo(canal, cliente.codigo).then(function(response){
			var cliente = new Cliente({id: LoginService.currentUser().id});

			if($scope.canal === 'SMS'){
				cliente.confirmSMS().then(function(){	
					$log.debug('Confirmation -> confirmSMS -> success');	
					ngDialog.closeAll();		
					$state.go(StatusService.next(statusSolicitud.value));
				});
			}else{
				cliente.confirmEmail().then(function(){		
					$log.debug('Confirmation -> confirmEmail -> success');	
					ngDialog.closeAll();	
					$state.go(StatusService.next(statusSolicitud.value));				
				});	
			}						
		}, function(response){
			$scope.invalido = true;
			$scope.mensaje = response;
			$scope.dataloading = false;
			return;		
		});

	};
		
}]);

	