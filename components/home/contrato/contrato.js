'use strict';
angular.module('home')
.controller('homeContratoController', ['$scope', 'contratoServicio', '$sce', 'LoginService', 'pagareServicio', function($scope, contratoServicio, $sce, LoginService, pagareServicio) {
	var idUsuario = LoginService.currentUser().id;
	
	if(_($scope.loan.loanId).isEmpty()){
		return;
	}
		
	$scope.descargar = function(){
		$scope.dataloading = true;

		contratoServicio.consultaContratoCredito(idUsuario, $scope.loan.loanId).then(function(attachment){
			$scope.dataloading = false;


			$scope.descargado = true;

			var byteCharacters = atob(attachment);

	        var byteNumbers = new Array();
	        for (var i = 0; i < byteCharacters.length; i++) {
	            byteNumbers[i] = byteCharacters.charCodeAt(i);
	        }
        	var byteArray = new Uint8Array(byteNumbers);

			var fileName = "TuContrato"+new Date().getTime()+".pdf";
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
	$scope.descargarPagare = function(){
		$scope.dataloadingPagare = true;

		// contratoServicio.consultaContratoCredito(idUsuario, $scope.loan.loanId).then(function(attachment){
		pagareServicio.consultaPagareCliente(idUsuario, $scope.loan.loanId).then(function(attachment){
			$scope.dataloadingPagare = false;
			$scope.descargadoPagare = true;

			var byteCharacters = atob(attachment);

	        var byteNumbers = new Array();
	        for (var i = 0; i < byteCharacters.length; i++) {
	            byteNumbers[i] = byteCharacters.charCodeAt(i);
	        }
        	var byteArray = new Uint8Array(byteNumbers);

			var fileName = "TuPagare"+new Date().getTime()+".pdf";
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
			$scope.dataloadingPagare = false;
			$scope.invalidPDF = true;
			$scope.mensajePDF = err;
		});
	};


}]);