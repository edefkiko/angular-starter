angular.module('solicitudPrestamo')
.factory('DatosComprobante', ['contratacionService', '_', '$log', 'CLIENT_STATUS', '$q', 'clienteService', function(contratacionService, _, $log, CLIENT_STATUS, $q, clienteService){
    function DatosComprobante(documentosComprobante, cliente){
        $log.info('datosContratacion_image:', documentosComprobante);
    $log.info('clienteModel', cliente);
         this.document = {};
         this.datosContratacion = {};
            
         var file = documentosComprobante.image.filetype,
         separador = "/", // un espacio en blanco
         limite    = 2,
         type = file.split(separador, limite);
         $log.log(type[1]);
         var typeFile = type[1];

         if (type[1] === "vnd.openxmlformats-officedocument.wordprocessingml.document") {
            typeFile = 'docx';
         }else if (type[1] === "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            typeFile = 'xlsx';
         }else if (type[1] === "vnd.openxmlformats-officedocument.presentationml.presentation") {
            typeFile = 'pptx';
         }else if (type[1] === "plain") {
            typeFile = 'txt';
         }
        $log.info('typeFile: ', typeFile);   
        this.document.documentHolderKey = cliente.client.encodedKey;
        this.document.documentHolderType = 'CLIENT';
        this.document.name = documentosComprobante.image.filename;
        this.document.type = typeFile;
        this.documentContent = documentosComprobante.image.base64; 
       };
    
    DatosComprobante.prototype.cargar = function(clientId){
        return contratacionService.actualizaContratacion(clientId, this);

    };

    return DatosComprobante;

}]);
