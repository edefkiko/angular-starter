app.factory('StatusService', ['CLIENT_STATUS', '_', function(CLIENT_STATUS, _){

	function getFullStatusByValue(statusValue){
		return  _(_.values(CLIENT_STATUS)).find(function(item) {
			if(_(item.value).isEqual(statusValue) ){			
				return item;
			}
		});
	}

	function next(statusValue){
		var next = null;

		var status = getFullStatusByValue(statusValue);
		
		if(status){
			var nextIndex = status.index + 1;
			_(_.values(CLIENT_STATUS)).find(function(item) {
	
				if(_(item.index).isEqual(nextIndex)){	
					next = item.state;
					return item;
				}
			});
		}
		return next;
	}

	return{
		getFullStatusByValue: getFullStatusByValue,
		next: next
	};

}]);