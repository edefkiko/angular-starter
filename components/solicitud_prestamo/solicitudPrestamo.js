'use strict';
angular.module('solicitudPrestamo')
.controller('prestamoController', function($scope, ngDialog, $rootScope, _, $log) {
  
  function includes(){
      if (!String.prototype.includes) {
        String.prototype.includes = function(search, start) {
          'use strict';
          if (typeof start !== 'number') {
            start = 0;
          }
          
          if (start + search.length > this.length) {
            return false;
          } else {
            return this.indexOf(search, start) !== -1;
          }
        };
      }
  }
  
  includes();

  $rootScope.setStatusView = function(status){
      var pasos = document.getElementById('contenedorBotones').getElementsByTagName('a');
      var porcentaje = status.statusView;
      var elem = document.getElementById('miBarra');
      elem.className = 'w3-progressbar ' + porcentaje;
      pasos[porcentaje].className = 'activo';

      if(porcentaje.includes('3')){
        pasos['paso3'].className = 'activo';
        pasos['paso2'].className = 'activo';
        pasos['paso1'].className = 'activo';
      } else if(porcentaje.includes('2')){
        pasos['paso2'].className = 'activo';
        pasos['paso1'].className = 'activo';
      }
      $log.log('porcentaje', porcentaje);
      $log.log('porcentaje.includes(2)', porcentaje.includes('2'));
  };

})

function maxLengthCheck(object) {
  if (object.value.length > object.maxLength){
    object.value = object.value.slice(0, object.maxLength);
  }
}

function isNumeric (evt) {
 var theEvent = evt || window.event;
 var key = theEvent.keyCode || theEvent.which;
 key = String.fromCharCode (key);
 // $log.log(key);
 var regex = /[0-9]|\./;
 if ( !regex.test(key) ) {
   theEvent.returnValue = false;
   if(theEvent.preventDefault){
     // theEvent.preventDefault();
   }
 }
 // console.info('evt', evt);
}