app.factory('utils', function(){

    function repeat(){
        if (!String.prototype.repeat) {
          String.prototype.repeat = function(count) {
            'use strict';
            if (this == null) {
              throw new TypeError('can\'t convert ' + this + ' to object');
            }
            var str = '' + this;
            count = +count;
            if (count != count) {
              count = 0;
            }
            if (count < 0) {
              throw new RangeError('repeat count must be non-negative');
            }
            if (count == Infinity) {
              throw new RangeError('repeat count must be less than infinity');
            }
            count = Math.floor(count);
            if (str.length == 0 || count == 0) {
              return '';
            }
            // Ensuring count is a 31-bit integer allows us to heavily optimize the
            // main part. But anyway, most current (August 2014) browsers can't handle
            // strings 1 << 28 chars or longer, so:
            if (str.length * count >= 1 << 28) {
              throw new RangeError('repeat count must not overflow maximum string size');
            }
            var rpt = '';
            for (;;) {
              if ((count & 1) == 1) {
                rpt += str;
              }
              count >>>= 1;
              if (count == 0) {
                break;
              }
              str += str;
            }
            return rpt;
          }
        }
    }

    repeat();

  return{
    guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    hideEmail: function(email){
        if(!email){
            return;
        }
    	var censorWord = function (str) {
		   return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
		}

		var censorEmail = function (email){
		     var arr = email.split("@");
		     return censorWord(arr[0]) + "@" + arr[1];
		}

		return censorEmail(email);
    },
    hidePhone: function(phone){
        if(!phone){
            return;
        }

        var censorWord = function (str) {
           return "*".repeat(str.length - 4) + str.slice(str.length-4, str.length);
        }

        return censorWord(phone);
    },
    includes: function(str){

    }

  }
});