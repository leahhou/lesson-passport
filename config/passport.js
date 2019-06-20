const passport = require("passport");
const LocalStrategy = require("passport-local"); //naming convention from passport website
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: GoogleStrategy } =require("passport-google-oauth20");
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

passport.use(new LocalStrategy({// take a configuration object + callback function 
        usernameField:"email"
    },
     async (email,password,done) => { // the way how we authenticate the user
        try {
            const user = await UserModel.findOne({email});
            if (user & user.verifyPasswordSync(password)) {
               return done(null, user); // success path
            }
            return done(null, false); // null on both case means no error
        } catch(error) {
            return done(error); // error path, done behave like next that when pass on an error, it will go down the error path (which is next error);
        }

     }
)); 

passport.use(new JwtStrategy( 
    {
        jwtFromRequest: (req)=> {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies["jwt"];
            }
            return token;
        },
        secretOrKey: process.env.JWT_SECRET
    },
    async (jwtPayload, done)=> {
        const user = await UserModel.findById(jwtPayload.sub).catch(done);
        if(user) {
            return done(null, user);
        }
        return done(null, false);
    })
)

passport.use(new GoogleStrategy(
    {
       clientID: process.env.GOOGLE_CLIENT_ID,
       clientSecret: process.env.GOOGLE_SECRET,
       callbackURL: "http://localhost:3000/auth/google"
    },
    async (accessToken, refreshToken, profile, done) => {
         const email = profile.emails[0].value;
         const user = await UserModel.findOne({ email });

         if(user) {
            return done(null, user);
        }
        user = await UserModel.create({email, password: "Testing"});
        
        return done(null, false);
    }

));

module.exports = passport;