require("express-async-errors");
const winston = require("winston");
// require("winston-mongodb");


module.exports = function(){
    process.on('uncaughtException', (ex) => {
        console.log("WE GOT AN UNCAUGHT exception");
        winston.error(ex.message, {ex});
        process.exit(1);
      });
      
    process.on('unhandledRejection', (ex) => {
        console.log("WE GOT AN UNCAUGHT rejection");
        winston.error(ex.message, {ex});
        process.exit(1);
      });
    
    winston.add(
      new winston.transports.File({ filename: "logfile.log", level:"info"})
    );
    // winston.add(
    //   new winston.transports.MongoDB({ db: "mongodb://localhost/vidly", level:"error" })
    // );

}