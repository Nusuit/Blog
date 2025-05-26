const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authController = require('../app/controller/authController');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback", // Sửa lại URL callback
    scope: ['profile', 'email']
}, authController.googleStrategy));

module.exports = passport;


// Comment toàn bộ phần Microsoft Strategy
/*
passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/outlook/callback"
}, authController.microsoftStrategy));
*/