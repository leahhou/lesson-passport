const passport = require("passport");
const LocalStrategy = require("passport-local"); //naming convention from passport website
const UserModel = require("./../database/models/user_model") // passport need to get info from database

passport.serializeUser((user, done)=>{
    done(null, user._id); //use user is instead of username as someone can change the username
});
passport.deserializeUser(async (id, done)=>{
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
            if (user.verifyPasswordSync(password)) {
               return done(null, user); // success path
            }
            return done(null, false); // null on both case means no error
        } catch(error) {
            done(error); // error path, done behave like next that when pass on an error, it will go down the error path (which is next error);
        }

     }
)); 