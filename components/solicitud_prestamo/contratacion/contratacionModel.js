angular.module('solicitudPrestamo')
.factory('DatosContratacion', ['contratacionService', '_', '$log', 'CLIENT_STATUS', '$q', 'clienteService', 'Solicitud', 'localStorageService', function(contratacionService, _, $log, CLIENT_STATUS, $q, clienteService, Solicitud, localStorageService){
	
	function DatosContratacion(documento, encodedKey){
		this.document = {};

		if(documento){
	        var typeFile = documento.filename.split(".")[1];

			this.document.documentHolderKey = encodedKey;
			this.document.documentHolderType = 'CLIENT';
			this.document.name = documento.filename;
			this.document.type = typeFile;
			this.documentContent = documento.base64; 
		}
	};
	
	DatosContratacion.prototype.cargar = function(clientId){
		return contratacionService.actualizaContratacion(clientId, this);
	};

	DatosContratacion.prototype.getSelfieWord = function(userId, catalog){
		var deferred = $q.defer();
		
		var memorySolicitud = localStorageService.get('solicitud');

		new Solicitud(memorySolicitud).getSolicitudActiva(userId, true).then(function(solicitudActiva){
			
			if(_(solicitudActiva.palabraSelfie).isUndefined()){
				
				var selfieWord = catalog[Math.floor(Math.random() * catalog.length)];

				memorySolicitud.palabraSelfie = selfieWord;
				
				var solicitud = new Solicitud(memorySolicitud);
		
				solicitud.updateSelfieWord(userId).then(function(){
					deferred.resolve(selfieWord);	
				});				
			}else{
				deferred.resolve(solicitudActiva.palabraSelfie);
			}

		});

		return deferred.promise;
	};


    return DatosContratacion;

}]);
