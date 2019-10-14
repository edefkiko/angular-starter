/*jslint indent:2, regexp:true*/
(function (global) {
  'use strict';
  var comunes = [ 'MARIA', 'MA', 'MA.', 'JOSE', 'J', 'J.' ];
  /**
    curp.js
    Función para generar el CURP, de acuerdo a las especificaciones oficiales.
    Se puede usar con node.js y directamente en el navegador.

    INSTALACION:
    Navegador : <script src="curp.js"></script>
    Node.js   : var generaCurp = require('curp');

    MODO DE USO:
    var curp = generaCurp({
      nombre            : 'Juan',
      apellido_paterno  : 'Perez',
      apellido_materno  : 'Ramirez',
      sexo              : 'H',
      estado            : 'DF',
      fecha_nacimiento  : [31, 1, 1981]
    });


    Licencia: MIT ( http://opensource.org/licenses/MIT )
  */

  /**
  * filtraInconvenientes()
  * Filtra palabras altisonantes en los primeros 4 caracteres del CURP
  * @param {string} str - Los primeros 4 caracteres del CURP
  */
  function filtraInconvenientes(str) {
    var inconvenientes = [ 'BACA', 'LOCO', 'BUEI', 'BUEY', 'MAME', 'CACA', 'MAMO',
      'CACO', 'MEAR', 'CAGA', 'MEAS', 'CAGO', 'MEON', 'CAKA', 'MIAR', 'CAKO', 'MION',
      'COGE', 'MOCO', 'COGI', 'MOKO', 'COJA', 'MULA', 'COJE', 'MULO', 'COJI', 'NACA',
      'COJO', 'NACO', 'COLA', 'PEDA', 'CULO', 'PEDO', 'FALO', 'PENE', 'FETO', 'PIPI',
      'GETA', 'PITO', 'GUEI', 'POPO', 'GUEY', 'PUTA', 'JETA', 'PUTO', 'JOTO', 'QULO',
      'KACA', 'RATA', 'KACO', 'ROBA', 'KAGA', 'ROBE', 'KAGO', 'ROBO', 'KAKA', 'RUIN',
      'KAKO', 'SENO', 'KOGE', 'TETA', 'KOGI', 'VACA', 'KOJA', 'VAGA', 'KOJE', 'VAGO',
      'KOJI', 'VAKA', 'KOJO', 'VUEI', 'KOLA', 'VUEY', 'KULO', 'WUEI', 'LILO', 'WUEY',
      'LOCA' ];

    if (inconvenientes.indexOf(str) > -1) {
      str = str.replace(/^(\w)\w/, '$1X');
    }

    return str;
  }

  /**
   * ajustaCompuesto()
   * Cuando el nombre o los apellidos son compuestos y tienen
   * proposiciones, contracciones o conjunciones, se deben eliminar esas palabras
   * a la hora de calcular el CURP.
   * @param {string} str - String donde se eliminarán las partes que lo hacen compuesto
   */
  function ajustaCompuesto(str) {
    var compuestos = [ /\bDA\b/, /\bDAS\b/, /\bDE\b/, /\bDEL\b/, /\bDER\b/, /\bDI\b/,
        /\bDIE\b/, /\bDD\b/, /\bEL\b/, /\bLA\b/, /\bLOS\b/, /\bLAS\b/, /\bLE\b/,
        /\bLES\b/, /\bMAC\b/, /\bMC\b/, /\bVAN\b/, /\bVON\b/, /\bY\b/ ];

    compuestos.forEach(function (compuesto) {
      if (compuesto.test(str)) {
        str = str.replace(compuesto, '');
      }
    });

    return str;
  }

  /**
  * zeropad()
  * Rellena con ceros un string, para que quede de un ancho determinado.
  * @param {number} ancho - Ancho deseado.
  * @param {number} num - Numero que sera procesado.
  */
  function zeropad(ancho, num) {
    var pad = Array.apply(0, Array.call(0, ancho)).map(function () { return 0; }).join('');

    return (pad + num).replace(new RegExp('^.*([0-9]{' + ancho + '})$'), '$1');
  }
  /**
  * primerConsonante()
  * Saca la primer consonante interna del string, y la devuelve.
  * Si no hay una consonante interna, devuelve X.
  * @param {string} str - String del cual se va a sacar la primer consonante.
  */
  function primerConsonante(str) {
    str = str.trim().substring(1).replace(/[AEIOU]/ig, '').substring(0, 1);
    return (str === '' || str === 'Ñ') ? 'X' : str;
  }

  /**
  * filtraCaracteres()
  * Filtra convirtiendo todos los caracteres no alfabeticos a X.
  * @param {string} str - String el cual sera convertido.
  */
  function filtraCaracteres(str) {
    return str.toUpperCase().replace(/[\d_\-\.\/\\,]/g, 'X');
  }

  /**
  * estadoValido()
  * Valida si el estado esta en la lista de estados, de acuerdo a la RENAPO.
  * @param {string} str - String con el estado.
  */
  function estadoValido(str) {
    var estado = [ 'AS', 'BC', 'BS', 'CC', 'CS', 'CH', 'CL', 'CM', 'DF', 'DG',
        'GT', 'GR', 'HG', 'JC', 'MC', 'MN', 'MS', 'NT', 'NL', 'OC', 'PL', 'QT',
        'QR', 'SP', 'SL', 'SR', 'TC', 'TS', 'TL', 'VZ', 'YN', 'ZS', 'NE' ];

    return (estado.indexOf(str.toUpperCase()) > -1);
  }


  /**
  * normalizaString()
  * Elimina los acentos, eñes y diéresis que pudiera tener el nombre.
  * @param {string} str - String con el nombre o los apellidos.
  */
  function normalizaString(str) {
    var origen, destino, salida;
    origen  = [ 'Ã', 'À', 'Á', 'Ä', 'Â', 'È', 'É', 'Ë', 'Ê', 'Ì', 'Í', 'Ï', 'Î',
             'Ò', 'Ó', 'Ö', 'Ô', 'Ù', 'Ú', 'Ü', 'Û', 'ã', 'à', 'á', 'ä', 'â',
             'è', 'é', 'ë', 'ê', 'ì', 'í', 'ï', 'î', 'ò', 'ó', 'ö', 'ô', 'ù',
             'ú', 'ü', 'û', 'Ç', 'ç' ];
    destino = [ 'A', 'A', 'A', 'A', 'A', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I',
             'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'a', 'a', 'a', 'a', 'a',
             'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'u',
             'u', 'u', 'u', 'c', 'c' ];
    str     = str.split('');
    salida  = str.map(function (char) {
      var pos = origen.indexOf(char);
      return (pos > -1) ? destino[pos] : char;
    });

    return salida.join('');
  }


  /**
  * agregaDigitoVerificador()
  * Agrega el dígito que se usa para validar el CURP.
  * @param {string} curp_str - String que contiene los primeros 17 caracteres del CURP.
  */
  function agregaDigitoVerificador(curp_str) {
    var curp, caracteres, curpNumerico, suma, digito;

    // Convierte el CURP en un arreglo
    curp = curp_str.substring(0, 17).toUpperCase().split('');
    caracteres  = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E',
      'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S',
      'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];

    // Convierte el curp a un arreglo de números, usando la posición de cada
    // carácter, dentro del arreglo `caracteres`.
    curpNumerico = curp.map(function (caracter) {
      return caracteres.indexOf(caracter);
    });

    suma = curpNumerico.reduce(function (prev, valor, indice) {
      return prev + (valor * (18 - indice));
    }, 0);

    digito = (10 - (suma % 10));

    if (digito === 10) {
      digito = 0;
    }

    return curp_str + digito;
  }

  /**
   * extraerInicial()
   * Funcion que extrae la inicial del primer nombre, o, si tiene mas de 1 nombre Y el primer
   * nombre es uno de la lista de nombres comunes, la inicial del segundo nombre
   * @param {string} nombre - String que representa todos los nombres (excepto los apellidos) separados por espacio
   */
  function extraerInicial(nombre) {
    var nombres, primerNombreEsComun;
    nombres = nombre.toUpperCase().trim().split(/\s+/);
    primerNombreEsComun = (nombres.length > 1 && comunes.indexOf(nombres[0]) > -1);

    if (primerNombreEsComun) {
      return nombres[1].substring(0, 1);
    }

    return nombres[0].substring(0, 1);
  }

  /**
  * generaCurp()
  * Función principal que genera el CURP.
  * @param {object} param - Objeto que tiene los parámetros necesarios para poder generar el curp,
  * Las propiedasdes del objeto param son:
  * @param {string} nombre - Nombre(s).
  * @param {string} apellido_paterno - Apellido materno.
  * @param {string} apellido_materno - Apellido materno.
  * En caso de haber conjunciones en los apellidos, estas deben ir aqui.
  * @param {string} sexo - Sexo. H para hombre, M para mujer.
  * @param {string} estado - Estado, usando las abreviaturas oficiales.
  * @param {array} fecha_nacimiento - Arreglo con [ día, mes, año ], cada uno como numero.
  * @param {string} [homonimia] - Opcional. Valor usado para evitar repeticiones, es asignado por gobernación.
  * Por default es 0 si la fecha de nacimiento es menor o igual a 1999, o A, si es igual o mayor a 2000.
  */
  function generaCurp(param) {
    var inicial_nombre, vocal_apellido, posicion_1_4, posicion_14_16, curp, primera_letra_paterno, primera_letra_materno, nombres, nombre_a_usar, pad;

    pad = zeropad.bind(null, 2);
    if (!estadoValido(param.estado)) {
      return false;
    }

    param.nombre = ajustaCompuesto(normalizaString(param.nombre.toUpperCase())).trim();
    param.apellido_paterno = ajustaCompuesto(normalizaString(param.apellido_paterno.toUpperCase())).trim();

    param.apellido_materno = param.apellido_materno || "";
    param.apellido_materno = ajustaCompuesto(normalizaString(param.apellido_materno.toUpperCase())).trim();

    inicial_nombre = extraerInicial(param.nombre);

    vocal_apellido = param.apellido_paterno.trim().substring(1).replace(/[BCDFGHJKLMNÑPQRSTVWXYZ]/g, '').substring(0, 1);
    vocal_apellido = (vocal_apellido === '') ? 'X' : vocal_apellido;

    primera_letra_paterno = param.apellido_paterno.substring(0, 1);
    primera_letra_paterno = primera_letra_paterno === 'Ñ' ? 'X' : primera_letra_paterno;

    if (!param.apellido_materno || param.apellido_materno === "") {
      primera_letra_materno = 'X';
    } else {
      primera_letra_materno = param.apellido_materno.substring(0, 1);
      primera_letra_materno = primera_letra_materno === 'Ñ' ? 'X' : primera_letra_materno;
    }

    posicion_1_4 = [
      primera_letra_paterno,
      vocal_apellido,
      primera_letra_materno,
      inicial_nombre
    ].join('');

    posicion_1_4 = filtraInconvenientes(filtraCaracteres(posicion_1_4));

    nombres = param.nombre.split(" ").filter(function (palabra) {
      return palabra !== "";
    });
    nombre_a_usar = comunes.indexOf(nombres[0]) > -1 ? nombres[1] : nombres[0];

    posicion_14_16 = [
      primerConsonante(param.apellido_paterno),
      primerConsonante(param.apellido_materno),
      primerConsonante(nombre_a_usar)
    ].join('');

    curp = [
      posicion_1_4,
      pad(param.fecha_nacimiento[2] - 1900),
      pad(param.fecha_nacimiento[1]),
      pad(param.fecha_nacimiento[0]),
      param.sexo.toUpperCase(),
      param.estado.toUpperCase(),
      posicion_14_16,
      param.homonimia || (param.fecha_nacimiento[2] > 1999 ? 'A' : 0)
    ].join('');

    return agregaDigitoVerificador(curp);
  }

  //RFC
  function generaRFC(param) {
    var inicial_nombre, vocal_apellido, posicion_1_4, posicion_14_16, curp, primera_letra_paterno, primera_letra_materno, nombres, nombre_a_usar, pad;

    pad = zeropad.bind(null, 2);
    if (!estadoValido(param.estado)) {
      return false;
    }

    param.nombre = ajustaCompuesto(normalizaString(param.nombre.toUpperCase())).trim();
    param.apellido_paterno = ajustaCompuesto(normalizaString(param.apellido_paterno.toUpperCase())).trim();

    param.apellido_materno = param.apellido_materno || "";
    param.apellido_materno = ajustaCompuesto(normalizaString(param.apellido_materno.toUpperCase())).trim();
//

    //
    inicial_nombre = extraerInicial(param.nombre);

    vocal_apellido = param.apellido_paterno.trim().substring(1).replace(/[BCDFGHJKLMNÑPQRSTVWXYZ]/g, '').substring(0, 1);
    vocal_apellido = (vocal_apellido === '') ? 'X' : vocal_apellido;

    primera_letra_paterno = param.apellido_paterno.substring(0, 1);
    primera_letra_paterno = primera_letra_paterno === 'Ñ' ? 'X' : primera_letra_paterno;

    if (!param.apellido_materno || param.apellido_materno === "") {
      primera_letra_materno = 'X';
    } else {
      primera_letra_materno = param.apellido_materno.substring(0, 1);
      primera_letra_materno = primera_letra_materno === 'Ñ' ? 'X' : primera_letra_materno;
    }

    posicion_1_4 = [
      primera_letra_paterno,
      vocal_apellido,
      primera_letra_materno,
      inicial_nombre
    ].join('');

    posicion_1_4 = filtraInconvenientes(filtraCaracteres(posicion_1_4));

    nombres = param.nombre.split(" ").filter(function (palabra) {
      return palabra !== "";
    });
    nombre_a_usar = comunes.indexOf(nombres[0]) > -1 ? nombres[1] : nombres[0];

    posicion_14_16 = [
      primerConsonante(param.apellido_paterno),
      primerConsonante(param.apellido_materno),
      primerConsonante(nombre_a_usar)
    ].join('');

    curp = [
      posicion_1_4,
      pad(param.fecha_nacimiento[2] - 1900),
      pad(param.fecha_nacimiento[1]),
      pad(param.fecha_nacimiento[0]),
    ].join('');
    calculoHomoclave(param, curp);
    return calculoHomoclave(param, curp);
  }

// #una manera de asignar defaults.
  function rfcset(a, b) {
        if (!a) return b; else return a;
  }
//funcion calcula la homonimia del RFC
  function calculoHomoclave(parametro, rfcFinal){

    var nombreCompleto = parametro.nombre+" " + parametro.apellido_paterno + " " + parametro.apellido_materno;
    var tablaValoresRFC1 = "0123456789&ABCDEFGHI;JKLMNOPQR;;STUVWXYZÑ";
    var tablaHomonimia = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
    var nombreNumero="0";
    var tempSuma = 0;
    var tempRes = 0;
    var cociente = 0;
    var residuo = 0;
    var tempRFCClaveHomonimia;
//  for para convertir el nombre completo en numero de acuerdo a la tablaValoresRFC1, tambien si valida los espacion en blanco asignadole "00"
    for (var i = 0; i < nombreCompleto.length; i++) {
      if (nombreCompleto[i] === " ") {
        nombreNumero = nombreNumero + "00";
      }
      for (var j = 0; j < tablaValoresRFC1.length; j++) {
        if (tablaValoresRFC1.substring(j, j + 1) === nombreCompleto.substring(i, i + 1)) {
          nombreNumero = nombreNumero + j;
        }
      }
    }
/* Se efectuaran las multiplicaciones de los números tomados de dos en dos para la posición de la pareja:
01 * 1 = 1		 90 * 0 = 0		 90 * 0 = 0
17 * 7 = 115	 00 * 0 = 0	   00 * 0 = 0
72 * 2 = 144	 01 * 1 = 1		 01 * 1 = 1
26 * 6 = 156	 14 * 4 = 56	 15 * 5 = 75
62 * 2 = 124	 41 * 1 = 41	 52 * 2 = 104
24 * 4 = 96		 19 * 9 = 171	 24 * 4 = 96

*/
    for (var i = 0; i < nombreNumero.length; i++) {
      if (nombreNumero.length - 1 != i){
        var temp = nombreNumero[i] + "" + nombreNumero[i + 1]
        var SegundoIndice = nombreNumero[i + 1];
        tempSuma = parseInt(temp) * parseInt(SegundoIndice);
        tempRes = tempRes + tempSuma;
      }
    }
/*
Se suma el resultado de las multiplicaciones y del resultado obtenido,
se tomaran las tres ultimas cifras y estas se dividen entre el factor 34
*/
    var resultado = tempRes.toString();
    var splitUltimosDigitos = resultado[1] + resultado[2] + resultado[3];
    cociente = parseInt(splitUltimosDigitos) / 34;
    residuo = parseInt(splitUltimosDigitos) % 34;
/*
Con el cociente y el residuo se consulta la tabla tablaHomonimia y se asigna la homonimia.
*/
    tempRFCClaveHomonimia = rfcFinal + tablaHomonimia[Math.floor(cociente)] + tablaHomonimia[residuo];
    var RFCFinal = CodigoVerificador(tempRFCClaveHomonimia);
    return RFCFinal;

  }

//calcular el digito verificador del RFC
  function CodigoVerificador(tempRFC){

    var tablaValores = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ";
    var resSuma = 0;
    var factor = 13;
    var residuo = 0;
    var digitoVerificador;
  /*
    Se asignaran los valores de la tablaValores a las letras y números del registro federal de contribuyentes formado a 12 posiciones.
    Ejemplo: GODE561231GR
    G = 16, O = 25, D = 13, E = 14, 5 = 05, 6 = 06, 1 = 01, 2 = 02, 3 = 03, 1 = 01, G = 16, R = 28
    **********************************************************************************************
    Una vez asignados los valores se aplicara la siguiente forma tomando como base el factor 13 en orden descendente a cada letra y número del R.F.C.
    para su multiplicación, de acuerdo a la siguiente formula:
    (Vi * (Pi + 1)) + (Vi * (Pi + 1)) + ..............+ (Vi * (Pi + 1))      MOD 11

    Vi    Valor asociado al carácter de acuerdo a la tablaValores.
    Pi    Posición que ocupa el i-esimo carácter tomando de derecha a izquierda es decir P toma los valores de 1 a 12.

    Ejemplo:
    D = (16(13) + 25 (12)+13 (11) +14 (10) + 05 (9) + 06 (8) + 01 (7) + 02 (6) + 03 (5) + 01 (4)+16 (3) + 28 (2)) = 1026
    Donde el resultado será: 1026

  */
    for (var i = 0; i < tempRFC.length; i++) {
      for (var j = 0; j < tablaValores.length; j++) {
        if (tablaValores[j] === tempRFC[i] && factor > 1) {
          resSuma = resSuma +(j * factor);
          factor--;
        }
      }
    }
  /*
  El resultado de la suma se divide entre el factor 11.

  Si el residuo es igual a cero, este será el valor que se le asignará al dígito verificador.
  Si el residuo es mayor a cero se restará este al factor 11: 11-3 =8
  Si el residuo es igual a 10 el dígito verificador será “ A”.
  Si el residuo es igual a cero el dígito verificador será cero. Por lo tanto “8 “ es el dígito verificador de este ejemplo: GODE561231GR8
  */
    residuo = resSuma % 11;
    console.log("residuo");
    if (residuo > 0) {
      digitoVerificador = 11 - residuo;
      residuo = digitoVerificador;
    }else if (residuo === 10) {
      digitoVerificador = "A"
    }else if (residuo === 0) {
      digitoVerificador = "0"
    }
    return tempRFC + digitoVerificador;
  }

  // Si es un navegador, exporta 'generaCurp' a una variable global.
  // Si es node.js, exporta esa función en module.exports
  if (global.hasOwnProperty('window') && global.window === global) {
    global.generaCurp = generaCurp;
    global.generaRFC = generaRFC;
  }

}(this));
