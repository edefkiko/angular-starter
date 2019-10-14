app.controller('headerCtrl', function($scope, $state, LoginService, catalogoService, ngDialog, $http, EnvironmentConfig, $rootScope, $window, $sce, $q, catalogoService, $log){
	$scope.yeiInfo = EnvironmentConfig.yeiInfo;

	$scope.loadSession = function(){
		ngDialog.open({
			template: 'components/login/facebook/login-facebook.html',
			controller: 'loginFacebookCtrl'
		});
	};

	$scope.searchAPI = function(userInputString, timeoutPromise) {
		$log.debug('getWords', userInputString);
	 	return catalogoService.ejecutaConslta("AYUDAS", userInputString);
	};
	
	$scope.selectedWord = function($item) {
		$log.debug('selectedWord', $item.originalObject);
		$state.go("search", {item:$item.originalObject.idOpcion, descOpcion:$item.originalObject.descOpcion});
	  	
	};

});