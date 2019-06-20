const express = require("express");
const router = express.Router();
const PageController = require("./../controllers/page_controller");
const AuthenticationController = require("./../controllers/authentication_controller");
const { celebrate, Joi } = require("celebrate");
const { authRedirect, authorise } = require("./../middleware/authorisation_middleware");
const passport = require("passport");

router.get("/", PageController.index);

router.get("/logout", AuthenticationController.logout);

router.get("/register", authRedirect, AuthenticationController.registerNew);

router.post("/register", celebrate({ 
    body: {
        email: Joi.string().required(),
        password: Joi.string().required()
    }
}), AuthenticationController.registerCreate);

router.get("/dashboard", passport.authenticate("jwt",{ session: false }), PageController.dashboard);

router.get("/login", authRedirect, AuthenticationController.loginNew);

router.post("/login", celebrate({ //when log in, we want to use passport 
    body: {
        email: Joi.string().required(),
        password: Joi.string().required()
    }
}), passport.authenticate("local", {
    failureRedirect: "/login",

}), AuthenticationController.loginCreate);

//the route we send the request to google
router.get("/auth/googlelogin", passport.authenticate("google", {scoopt: ["email","profile"]}));

//the route where google come back to us
router.get("/auth/google",passport.authenticate("google"), AuthenticationController.loginCreate);

module.exports = router;