const local = require("./localStrategy");
const passport = require("passport");
const User = require("../models/schemas/user");

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.email);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({ email: id })
            .then((user) => done(null, user))
            .catch((err) => done(err));
    });

    local();
};
