//验证token

const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const moogoose = require("mongoose");
const User = moogoose.model("users");
const keys = require("../config/keys");

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport =>{
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        
                // or you could create a new account
      // console.log(jwt_payload);
      User.findById(jwt_payload.id)
                  .then(user =>{
                      if(user){
                        return done(null,user);
                      }

                      return done(null,false)
                  })  
                  .catch(err =>console.log(err))

    }));
}