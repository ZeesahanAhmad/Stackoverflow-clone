var JwtStrategy=require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var key=require('../setup/myURL');
//  var Person=require('../models/Person');
var mongoose=require('mongoose');
var Person=mongoose.model("myPerson");

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secret;

module.exports=(passport)=>{
    passport.use(new JwtStrategy(opts,(jwt_payload, done)=> {
        Person.findById(jwt_payload.id)
        .then((person)=>{
            if(person){
                return done(null, person);
            }
            return done(null, false);
        })
        .catch((err)=>console.log(err));
    }));
};