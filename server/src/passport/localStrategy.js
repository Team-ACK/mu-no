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

                        if (!res)
                            return done(null, false, {
                                success: false,
                                message: "아이디 또는 비밀번호가 일치하지 않습니다",
                            });

                        const validPassword = await bcrypt.compare(input_password, res.password); // (요청 pw, DB pw)

                        if (validPassword) {
                            return done(null, res, { success: true, message: res.nickname });
                        } else {
                            return done(null, false, {
                                success: false,
                                message: "아이디 또는 비밀번호가 일치하지 않습니다",
                            });
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
