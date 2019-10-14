app.config(['$provide',function($provide) {
	$provide.decorator('$exceptionHandler', function($delegate, $injector, EnvironmentConfig){
		return function(exception, cause){

			var $rootScope = $injector.get('$rootScope');
		
			if(EnvironmentConfig.debugEnabled){
				$rootScope.addAlert({type: 'Exception', title:'Exception', message: exception});
			}

			$delegate(exception, cause);
		}
	});
}]);