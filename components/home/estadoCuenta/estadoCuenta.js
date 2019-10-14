'use strict';
angular.module('home')
.controller('homeEstadoCuentaController', ['$scope', '$sce', 'homeServices', 'LoginService', 'Cliente', 'PasswordForgotService', '$state', '$rootScope', 'MENSAJE', 'semillaService', function($scope, $sce, homeServices, LoginService, Cliente, PasswordForgotService, $state, $rootScope, MENSAJE, semillaService) {
	$scope.content = null;
	$scope.invalido = false;
	$scope.invalidPDF = false;

	var cliente = new Cliente({id: LoginService.currentUser().id});
	var idUsuario = LoginService.currentUser().id;
	
	var intentos = 0;
	var semilla = "";
	$rootScope.showLoading();
	$scope.$watch("init", function() {
		semillaService.getSemilla().then(function(response) {
			semilla = response.semilla;
		}).finally(function() {
			$rootScope.hideLoading();
		});
	});
	
	$scope.validPassword = function(crendentials){
		var encPassword = md5(crendentials.password, semilla);

      	$scope.dataloading = true;
		PasswordForgotService.validaPassword(idUsuario, encPassword).then(function(usuarioResponse){                                        
				$scope.tieneAutorizacion = true;
				showPDF();
			}, function(response){
				$scope.dataloading = false;
				$scope.invalido = true;
				$scope.mensaje = response;              
				intentos = intentos + 1;

				if(intentos === 3) {
					$rootScope.showMessage(MENSAJE.INTENTOS_ERROR);
					
					LoginService.logout().finally(function () {
				           $rootScope.hideLoading();               
          
                    $state.go('root');
				    });                 
				}
		});

	};

	function showPDF(){
		$scope.dataloading = true;

		homeServices.getEstadoDeCuenta().then(function(attachment){
			$scope.dataloading = false;
			$scope.descargado = true;		
			var byteCharacters = atob(attachment);

	        var byteNumbers = new Array();
	        for (var i = 0; i < byteCharacters.length; i++) {
	            byteNumbers[i] = byteCharacters.charCodeAt(i);
	        }
        	var byteArray = new Uint8Array(byteNumbers);

			var fileName = "EstadoDeCuenta"+new Date().getTime()+".pdf";
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";

            var file = new Blob([byteArray], {type: 'application/pdf'});
            var fileURL = window.URL.createObjectURL(file);
            a.href = fileURL;
            a.download = fileName;
            a.click();

            $scope.content = $sce.trustAsResourceUrl(fileURL);

		}, function(err){
			$scope.dataloading = false;
			$scope.invalidPDF = true;
			$scope.mensajePDF = err;
		});
	};

	$scope.downloadPDF = function(){

	};
		
}]);