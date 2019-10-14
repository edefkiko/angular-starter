app.service('Facebook', ['_', '$log', '$q', function(_, $log, $q){
	var profile = {
		me: {},
		friends: undefined,
	};

	function init(){
		var deferred = $q.defer();

		FB.getLoginStatus(function(response) {
			$log.info(response);

			if(response.status === 'connected'){
				$log.debug('Facebook -> connected');
				profile.me.userID = response.authResponse.userID;	
				
				deferred.resolve();			
			}
			else{
				$log.debug('Facebook -> status' + response.status);

				FB.login(function(response){	
					if(response.authResponse){						
						$log.debug('Facebook -> response', response);
						profile.me.userID = response.authResponse.userID;
						
						deferred.resolve();
					}else{						
						$log.error('User Cancelled login or did  not fully authorize.');

						deferred.reject();
					}
					
				}, {
					scope: 'email, public_profile', 
					return_scopes: true,
					 auth_type: 'rerequest'
				});
			}		    
		});		

		return deferred.promise;
	}

	function getProfile(){
		var deferred = $q.defer();

		FB.api('/me?fields=email', function(me){
			$log.debug('/me'+ JSON.stringify(me));
			profile.me = me;

			deferred.resolve(profile); 		
			/* FB.api('/me/friends', function(friends){		
				$log.debug('/me/friends'+ JSON.stringify(friends));
				
				profile.friends = friends.data;
				deferred.resolve(profile); 		
			});	*/

		});	


		

		return deferred.promise;
	}

	return{
		init: init,
		getProfile: getProfile
	};

}]);