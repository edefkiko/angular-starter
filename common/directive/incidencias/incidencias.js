app.directive('incidencias',  function(){

	return {
		scope: {
			incidencias: '=incidencias'
		}, 
		restrict: 'E', 
		templateUrl: 'common/directive/incidencias/incidencias.html',
		controller: function($scope, LoginService, $rootScope, incidenciaService, $state, EnvironmentConfig, $log){
			var user = LoginService.currentUser();
			$scope.incidencia = {};
			$scope.yeiInfo = EnvironmentConfig.yeiInfo;

			$scope.uploadImage = function(event, fileObjs, fileList) {
		       
		        var imagenValida = validaExtensionImagenes(fileObjs[0].filename.split('.').pop());

		        if(!imagenValida){
		          $rootScope.addAlert({type: 'Info', title:'Archivo no valido', message: 'El tipo de imagen que intenta subir no es válida.'});
		          $scope.incidencia.documento= null;
		          event.preventDefault();
		        }else{
		        	$scope.documentoAdded = true;
		        }
		  
			};

			$scope.guardar = function(incidencia) {
				$log.debug('incidencia', incidencia);
				var problema = incidencia.problema.score;

				if(!_(incidencia.documentos).isUndefined()){
			   	    var documento = {
			    		nombre: incidencia.documentos.filename,
			    		formato: incidencia.documentos.filename.split('.').pop(),
			    		contenido: incidencia.documentos.base64
			    	};
			  
			    	incidencia.documentos = documento;
		    	}else{
		    		incidencia.documentos = null;
		    	}	    	

		    	incidencia.problema = problema;

		    	$scope.dataloading = true;
		    	$rootScope.showLoading();	    	
		    	incidenciaService.registrar(incidencia).then(function(){
		    		$rootScope.hideLoading();
		    		$rootScope.showMessage({value: "¡Se ha enviado satisfactoriamente tu solicitud!", type: "CONFIRM"});
		    		$state.go("root");
		    	}, function(err){
		    		$scope.dataloading = false;-
		    		$rootScope.hideLoading();
		    	});

				$log.debug('Guardar incidencia:', incidencia);
			};

			function validaExtensionImagenes(extension){
		        
		        $log.debug('extension archivo', extension);
			    switch (extension.toUpperCase()) {
			        case 'JPG':
			         return true;
			        case 'JPEG':
			         return true;
			        case 'PNG':
			         return true;
			        case 'GIF':
			         return true;
			          case 'BMP':
			         return true;
			        case 'TIFF':
			         return true;
			        case 'DOC':
			         return true;
			        case 'DOCX':
			         return true;
			        case 'PDF':
			         return true;
			         default:
			         return false;            
			    }      
		    }
	    }	
	};
});