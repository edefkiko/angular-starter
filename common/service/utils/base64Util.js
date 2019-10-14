app.factory('base64Util', function(base64){
  return{
    
    encode: function(string){
        return base64.encode(string);
    },
    decode: function(encodedString){
        return base64.decode(encodedString);
    }
  }
});