var
    passport = require("passport"),
    LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport, config) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findOne({ _id: id }, function (err, user) {
			done(err, user);
		});
	});

  	passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
    },
	function(username, password,done){
    	if(username != password){
      	  return done(null, false, { message: 'Incorrect username or password.' });
    	}
    	return done(null, username);
	}));
}

