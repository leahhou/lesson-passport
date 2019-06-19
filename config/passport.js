const passport = require("passport");
const LocalStrategy = require("passport-local"); //naming convention from passport website
const UserModel = require("./../database/models/user_model") // passport need to get info from database

passport.serializeUser((user, done)=>{ //when user login, passport grab the user_id(serializeUser); however, the user info still saved at session
    done(null, user._id); //use user is instead of username as someone can change the username
});
passport.deserializeUser(async (id, done)=>{ //once user login & wanna go other pages, passport will use the user_id, and grab user's information from the session(deserializeUser)
// therefore, we need to change anywhere (controller & middleware) to use req.user instead of req.session.user
    try {
        const user = await UserModel.findById(id);
        return done(null, user);
    } catch(error) {
        return done(error);
    }
});

passport.use(new LocalStrategy( // take a configuration object + callback function 
     {usernameField:"email"},
     async (email,password,done) => { // the way how we authenticate the user
        try {
            const user = await UserModel.findOne({email});
            if (user & user.verifyPasswordSync(password)) {
               return done(null, user); // success path
            }
            return done(null, false); // null on both case means no error
        } catch(error) {
            done(error); // error path, done behave like next that when pass on an error, it will go down the error path (which is next error);
        }

     }
)); 