const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;

var opts = {}
opts.jwtFromRequest = (req) => {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwt'];
    }
    return token;
};
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    return done(null, jwt_payload.data)
}));

passport.use(new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: process.env.OAUTH_CALLBACK_URL
  },
(accessToken, refreshToken, profile, done) => {
  /*
   use the profile info (mainly profile id) to check if the user is registerd in ur db
   If yes select the user and pass him to the done callback
   If not create the user and then select him and pass to callback
  */
  return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  
passport.deserializeUser((user, done) => {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});
