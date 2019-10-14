app.directive('loanDetail',  function(){

	return {
		scope: {
			producto: '=producto'
		}, 
		restrict: 'E', 
		templateUrl: 'common/directive/loanDetail/loanDetail.html'
	};
});