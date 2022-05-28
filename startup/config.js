const config = require("config");


module.exports = function(){
    if(!config.get('jwtPrivateKey')){
        throw new Error("FATAL ERROR: jwtPrivateKey does not have a value");
        // console.log(config.get('jwtPrivateKey1'));
        
      }
}