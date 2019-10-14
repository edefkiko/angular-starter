'use strict'
jQuery(document).ready(function($) {
   
   

});
function maxLengthCheck(object) {
 if (object.value.length > object.maxLength)
   object.value = object.value.slice(0, object.maxLength)
}

function isNumeric (evt) {
 var theEvent = evt || window.event;
 var key = theEvent.keyCode || theEvent.which;
 key = String.fromCharCode (key);
 var regex = /[0-9]|\./;
 if ( !regex.test(key) ) {
   theEvent.returnValue = false;
   if(theEvent.preventDefault) theEvent.preventDefault();
 }
}
