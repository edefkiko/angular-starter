app.factory('geolocationService', function($q, $log){
	var result = [];
	function isSupported(){
		return navigator.geolocation === true;
	}

	function getCurrentPosition(){
		var deferred = $q.defer();

		 if (!navigator.geolocation){
		    $log.debug('Geolocation is not supported by your browser');
		    deferred.reject();	
		  }

		navigator.geolocation.getCurrentPosition(function(position){
			$log.debug('geolocationService -> position', position);
			
			var lat = position.coords.latitude;
		    var lon = position.coords.longitude;
		    result.push(lat, lon);   
		    
			deferred.resolve(result);			
		}, function(err){
			$log.debug('geolocationService -> position -> err', err);
			deferred.reject(err);
		}, {
		  enableHighAccuracy: true,
		  timeout: 27000,
		  maximumAge: 30000
		});

		return deferred.promise;
	}

	return{
		isSupported: isSupported,
		getCurrentPosition: getCurrentPosition
	};
})