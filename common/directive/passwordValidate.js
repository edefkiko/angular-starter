app.directive('passwordValidate', function($log, _){

	return {
		require: 'ngModel',
		link: function($scope, iElm, iAttrs, controller) {
			
			function isEqualToUsername(username, viewValue){
				return _(username).contains(viewValue)
			}

			controller.$parsers.unshift(function(viewValue){
				if($scope.username){
					$scope.isEqualToUsername = isEqualToUsername($scope.username, viewValue);
				}				
			});
			
		}
	};
});