app.filter('range', function() {
  return function(input, min, max, step) {
    max = parseInt(max);
    min = parseInt(min);

    if(!step){
    	step = 1;	
    }
    for (var i=min; i<=max; i = i + step) {
      input.push(i);
    }

    return input;
  };
});