'use strict'

app.factory('mambuUtils', function(_){

  function getCustomFieldValue(customInformation, fieldId){
		var value = "";
		
		_.find(customInformation, function(item) {
			
		  if(_.isEqual(fieldId, item.customFieldID)){		  	
		  	 value = item.value;
		  	 return;
		  }
		})

		return value;
	}

  return{
    getCustomFieldValue : getCustomFieldValue
  };

});
