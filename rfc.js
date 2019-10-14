function QuitarArticulos(param) {
    var articulos = ["DEL ","LAS ","DE ","LA ","Y ","A "];
    param = param.replace(articulos, "", param);
    return param;
};

function calculaRFC(nombre, apellidoPaterno, apellidoMaterno, fecha){
  var nombre_val =QuitarArticulos(nombre.toUpperCase().trim());
  var APaterno = QuitarArticulos(apellidoPaterno.toUpperCase().trim());
  var AMaterno = QuitarArticulos(apellidoMaterno.toUpperCase().trim());

  var rfc = APaterno.substr(0,1);
  console.log(rfc);
  console.log();
  console.log();
  console.log(fecha);
};
