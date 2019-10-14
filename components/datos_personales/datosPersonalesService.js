'use strict';
angular.module('datosPersonales')
.factory('datosService', function(){
  return{
    buildRFC:function(obj) {
      var RFC = generaCurp({
  		  nombre            : obj.nombre,
  		  apellido_paterno  : obj.apellidoPaterno,
  		  apellido_materno  : obj.apellidoMaterno,
  		  sexo              : obj.sexo,
  		  estado            : obj.estado,
  		  fecha_nacimiento  : obj.fechaNacimiento // dia - mes - año
  		});
      return RFC;
    },
    dataEstados:function() {
      var data = [{
    	  id: 0,
    	  label: 'Aguascalientes',
    		abreviatura : 'AS'
    	},{
    	  id: 1,
    	  label: 'Baja California',
    		abreviatura : 'BC'
    	}, {
    	  id: 2,
    	  label: 'Baja California Sur',
    		abreviatura : 'BS'
    	},{
    	  id: 3,
    	  label: 'Campeche',
    		abreviatura : 'CC'
    	},{
    	  id: 4,
        // label: 'COAHUILA DE ZARAGOZA',
    	  label: 'Coahuila',
    		abreviatura : 'CS'
    	},{
    	  id: 5,
    	  label: 'Colima',
    		abreviatura : 'CH'
    	},{
    	  id: 6,
    	  label: 'Chiapas',
    		abreviatura : 'CL'
    	},{
    	  id: 7,
    	  label: 'Chihuahua',
    		abreviatura : 'CM'
    	},{
    	  id: 8,
    	  label: 'Distrito Federal',
    		abreviatura : 'DF'
    	},{
    	  id: 9,
    	  label: 'Durango',
    		abreviatura : 'DG'
    	},{
    	  id: 10,
    	  label: 'Guanajuato',
    		abreviatura : 'GT'
    	},{
    	  id: 11,
    	  label: 'Guerrero',
    		abreviatura : 'GR'
    	},{
    	  id: 12,
    	  label: 'Hidalgo',
    		abreviatura : 'HG'
    	},{
    	  id: 13,
    	  label: 'Jalisco',
    		abreviatura : 'JC'
    	},{
    	  id: 14,
    	  label: 'México',
    		abreviatura : 'MC'
    	},{
    	  id: 15,
        // label: 'MICHOACAN DE OCAMPO',
    	  label: 'Michoacan',
    		abreviatura : 'MN'
    	},{
    	  id: 16,
    	  label: 'Morelos',
    		abreviatura : 'MS'
    	},{
    	  id: 17,
    	  label: 'Nayarit',
    		abreviatura : 'NT'
    	},{
    	  id: 18,
    	  label: 'Nuevo León',
    		abreviatura : 'NL'
    	},{
    	  id: 19,
    	  label: 'Oaxaca',
    		abreviatura : 'OC'
    	},{
    	  id: 20,
    	  label: 'Puebla',
    		abreviatura : 'PL'
    	},{
    	  id: 21,
        // label: 'QUERETARO DE ARTEAGA',
    	  label: 'Querétaro',
    		abreviatura : 'QT'
    	},{
    	  id: 22,
    	  label: 'Quintana Roo',
    		abreviatura :	'QR'
    	},{
    	  id: 23,
    	  label: 'San Luis Potosí',
    		abreviatura : 'SP'
    	},{
    	  id: 24,
    	  label: 'Sinaloa',
    		abreviatura : 'SL'
    	},{
    	  id: 25,
    	  label: 'Sonora',
    		abreviatura : 'SR'
    	},{
    	  id: 26,
    	  label: 'Tabasco',
    		abreviatura : 'TC'
    	},{
    	  id: 27,
    	  label: 'Tamaulipas',
    		abreviatura : 'TS'
    	},{
    	  id: 28,
    	  label: 'Tlaxcala',
    		abreviatura : 'TL'
    	},{
    	  id: 29,
    	  label: 'Veracruz',
    		abreviatura : 'VZ'
    	},{
    	  id: 30,
    	  label: 'Yucatán',
    		abreviatura : 'YN'
    	},{
    	  id: 31,
    	  label: 'Zacatecas',
    		abreviatura : 'ZS'
    	},{
    	  id: 32,
    	  label: 'Nacido en el Extranjero',
    		abreviatura : 'NE'
    	}];
      return data;
    }
  }
});
