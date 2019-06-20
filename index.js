require("dotenv").config();
require("./database/connect"); 
const app = require('./app');

//confused about it...
global.HTTPError = class HTTPError extends Error {
    constructor(statusCode, message) {
        super(message);
  
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HTTPError);
        }
        this.name = "HTTPError";
        this.statusCode = statusCode;
    }
};

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));