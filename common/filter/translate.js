app.filter('plural', function(){

	return function(input){
		var output;
		if(_.isEqual(input, 'MES')){
	      output= 'MENSUALES';
	    }else if(_.isEqual(input, 'SEMANA')){
	      output= 'SEMANALES';
	    }else if(_.isEqual(input, 'QUINCENA')){
	      output= 'QUINCENALES';
	    }else{      
	      output= input;
	    }
		return output;
	};
	
});