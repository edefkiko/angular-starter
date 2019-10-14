app.factory('alertService', ['ngToast', '_', function(ngToast, _){

	function addAlert(type, title,  message){
		ngToast.create({
			content:' <strong>'+title+'</strong>:' + message,
			className: 'background-azul',
			dismissOnTimeout: false,
			dismissButton: true,
			dismissOnClick: true
		});		
	}

	return{
		addAlert: addAlert
	};

}]);