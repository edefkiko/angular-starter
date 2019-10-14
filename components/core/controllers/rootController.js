app.controller('rootController', ['$rootScope', 'alertService', 'ngDialog', 'blockUI', '$log', 'localStorageService', '$window', 'LoginService', 'Cliente', 'Notificacion', 'EnvironmentConfig', '$state', function($rootScope, alertService, ngDialog, blockUI, $log, localStorageService, $window, LoginService, Cliente, Notificacion, EnvironmentConfig, $state){
	$rootScope.isMobile = EnvironmentConfig.isMobile;
	
	if($rootScope.isMobile){
		$rootScope.header = 'components/core/header/header-app.html';	
	}else{
		$rootScope.header = 'components/core/header/header.html';	
	}
	

	$rootScope.addAlert = function(alert){
		if(EnvironmentConfig.debugEnabled){
			alertService.addAlert(alert.type, alert.title, alert.message);
		}
		
	}

	$rootScope.showMessage = function(message){
		ngDialog.open({
	      templateUrl: 'components/core/views/templates/alert_message.html',
	      controller: function alerMessage(msg, $scope){
	      	$scope.message = msg;	      	
	      },
	      resolve: {
	      	msg: function(){
	      		return message;
	      	}
	      },
	      showClose: true 
	    });
	};

	/*$rootScope.showRootLoading = function(){
		$("#rootContainer").addClass("hidden");
		$("#rootDataloading").removeClass("hidden");
	}

	$rootScope.hideRootLoading = function(){
		 $("#rootContainer").removeClass("hidden");	
		 $("#rootDataloading").addClass("hidden");	
	}*/	


	$rootScope.showLoading = function(){
		if(!blockUI.state().blocking) {			
		    blockUI.start();
		}
		/*var myBlock = blockUI.instances.get('rootContainerBlock');
		if(!myBlock.state().blocking) {			
		    myBlock.start();
		}*/
	}

	$rootScope.hideLoading = function(){
		blockUI.stop();
		/*var myBlock = blockUI.instances.get('rootContainerBlock');
		myBlock.stop();*/
	}	

	var cliente;
	$rootScope.$on('loadUserData', function (event, userBasicInfo) {
	    $log.info('loadUserData', userBasicInfo);

	    $rootScope.userBasicInfo = localStorageService.get('userBasicData');
	    
	    if(_($rootScope.userBasicInfo).isNull() && !_(LoginService.currentUser()).isEmpty()){
	    	
	    	cliente = new Cliente({id: LoginService.currentUser().id});
	    	
	    	cliente.getBasicData().then(function(user){		
	    		 $rootScope.userBasicInfo = user;
	    	});	    	
	    }

	    $rootScope.user = localStorageService.get('user');
	});

	var notificacion;
	$rootScope.$on('loadNotifications', function (event, userId, list) {
	   	notificacion = new Notificacion(userId);
	   	
	   	if(_(list).isEmpty()){
	    	notificacion.get().then(function(notificaciones){
				loadNotifications(notificaciones)
			});
		}else{
			loadNotifications(list)
		}

	});

	function loadNotifications(notificaciones){
		$rootScope.notifications = new Notificacion().remove(notificaciones);		
				
		$rootScope.unreadNotifications = _(notificaciones).filter( function(item) {
		  if(_(item.fechaLectura).isEmpty()){
		  	return item;
		  }
		});	
	}

	$rootScope.$on('loadUserSesion', function (event, sesion) {
	   $log.info('loadUserSesion', sesion);

	   $rootScope.user = sesion;

	});

	$rootScope.$on('unloadUserSesion', function (event) {
	    $log.info('unloadUserSesion');

	    $rootScope.user = undefined;

	});	


	var logoutDialog;
	$rootScope.logout = function(){

		logoutDialog = ngDialog.open({
            template:'\
                <div class="dialogCuerpo">\
                    <div class="small-10 medium-8 large-8 small-centered">\
                        <p>¿Estás seguro que deseas cerrar la sesión?</p>\
                    </div>\
                </div>\
                <div class="margin-top-bottom separador-yei"></div>\
                <div class="dialogFooter small-12 medium-10 large-11 small-centered">\
                    <button class="button hollow float-left" type="button" ng-click="closeThisDialog(0)">Cancelar</button>\
                    <div class="show-for-small-only space-blank"></div>\
                    <button class="button float-right" type="button" ng-click="confirmLogout()" ng-click="dataloading =true" ng-disabled="dataloading">Aceptar</button>\
                    <div class="clear"></div>\
                </div>',
            plain: true, 
            scope: $rootScope
        });	
	};

	$rootScope.confirmLogout = function(){
		ngDialog.closeAll();
		$rootScope.showLoading();	
		LoginService.logout().then(function () {
	        
			$rootScope.hideLoading();				        
	        
	        if(_(true).isEqual(EnvironmentConfig.isMobile)){
				$state.go('loginApp');
		  	}else{
		  		$state.go('root');
		  	}
	        
	    }, function(){
	    	$rootScope.hideLoading();
	    });                  
	};

	$rootScope.logoutAndLogin = function(msg){
		ngDialog.closeAll();
		            
		$rootScope.showMessage({value: msg, type: "CONFIRM"});            
		localStorageService.remove('user', 'solicitud', 'userBasicData', 'solicitud', 'resetPasswordCredentials', 'facebookData');
              
		$rootScope.$emit('unloadUserSesion');

		if(_(true).isEqual(EnvironmentConfig.isMobile)){
			$state.go('loginApp');
	  	}else{
	  		$state.go('root');
	  	}                        
	};

	$rootScope.initChat = function(){
		var user = null;
		if(LoginService.isLoggedIn()){
			user = { 
		      externalId: LoginService.currentUser().name, 
		      rolId: 0 
		    } 
		}
		
		$rootScope.chatInitialized = true;
        $rootScope.$emit('initChat', user);
	}

	$rootScope.$on('closeChat', function (event) {
		$rootScope.chatInitialized = false;
	});	
}]);