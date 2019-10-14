app.directive('loanTable',  function(){

	return {
		scope: {
			producto: '=producto',
			mostrar: '=mostrar'
		}, 
		restrict: 'E', 
		templateUrl: 'common/directive/loan/loan.html',
		controller: function($scope){
			$scope.$watch('producto.frecuencia', function(){
				if($scope.producto && $scope.producto.frecuencia){		
					if($scope.producto.frecuencia === 'QUINCENA'){
						$scope.producto.cat = 123;					
					}else if($scope.producto.frecuencia === 'SEMANA'){
						$scope.producto.cat = 139;
					}else if($scope.producto.frecuencia === 'MES'){
						$scope.producto.cat = 116;
					}			
				}
			});
	    }	
	};
});