const express = require("express");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const expressSession = require("express-session");
const MongoStore = require('connect-mongo')(expressSession); // this allows our session in our database, instead of memory
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const app = express();

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(cookieParser());

app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("combined"));

// the order of middleware is very important
// we wanna the app to passport before the app hits the routes, yet after the data is converted into json or urlencoded
const passport = require("./config/passport"); // it allows the app to DIRECTLY executed(require), instead of just bringing in the app(app.use).
app.use(passport.initialize()); // initialize the passport
app.use(passport.session()); //allow passport to get access to our session
// however, it doesn't tell passport which information to save in session

app.use(require("./routes"));

app.use(express.static("public"));

app.use(require("./middleware/error_handler_middleware"));

module.exports = app;