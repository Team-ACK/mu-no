const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/schemas/user");
const bcrypt = require("bcrypt");

module.exports = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                session: true,
                passReqToCallback: false,
            },
            (input_email, input_password, done) => {
                try {
                    User.findOne({ email: input_email }, async (err, res) => {
                        if (err) return done(err);

                        if (!res) return done(null, false, { message: "존재하지않는 아이디" });

                        const validPassword = await bcrypt.compare(input_password, res.password); // (요청 pw, DB pw)
                        // console.log(validPassword);
                        if (validPassword) {
                            return done(null, res);
                        } else {
                            return done(null, false, { message: "비밀번호 오류" });
                        }
                    });
                } catch (err) {
                    console.error(err);
                    done(err);
                }
            }
        )
    );
};
