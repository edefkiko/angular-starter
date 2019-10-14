app.controller('passwordConfirmationCtrl', ['$scope', 'ngDialog', function($scope, ngDialog){
	
	$scope.$watch('init', function(){
		ngDialog.open({
			template: 'components/login/templates/passwordConfirmationSuccess.html',
			controller: ['$scope', function($scope){
				
			}],
			scope: $scope
		});
	});

}])