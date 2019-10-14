app.controller('complaintMailboxCtrl', ['$scope', '$state', 'ComplaintMailboxService', 'ngDialog', function($scope, $state, ComplaintMailboxService, ngDialog) {


	$scope.message = {
		name: null,
		comment:''
	};

	$scope.errorMsg = false;
	$scope.succesMsg = false;


	$scope.sendMessage = function(message) {
		var requestMsg = {
			nombreUsuario: $scope.message.name,
 			descripcion: $scope.message.comment
		}
		$scope.errorMsg = false;
		$scope.dataloading = true;
		
		ComplaintMailboxService.sendComplaint(requestMsg)
		.then(function(data) {
			$scope.dataloading = false;
			$scope.succesMsg = true;
			$scope.succesTxt = 'Tu denuncia se ha enviado correctamente.'
		}, function(error) {
			$scope.dataloading = false;
			$scope.errorMsg = true;
			$scope.error = error;
		});


	};

	$scope.close = function(){
		ngDialog.closeAll();
		$scope.errorMsg = false;
		$scope.succesMsg = false;
	}


}])