app.factory('pdfUtil', function(){

	function convertTbase64ToBlob(base64){
		//var name = 'EstadoCuenta'  + '_'  + new Date().getTime();

		var file = new Blob([base64], {type: 'application/pdf'});

       	var fileURL = URL.createObjectURL(file);

       	return fileURL;

	}

	return {
		base64ToBlob : convertTbase64ToBlob
	};
})