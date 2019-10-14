app.controller('maintenanceController', ['$scope', '$log', '$stateParams', function($scope, $log, $stateParams){

	if(!_($stateParams.problema).isEmpty()){
		$scope.problema = $stateParams.problema;
	}

}]);