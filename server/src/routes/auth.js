const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/schemas/user");
const Reaction = require("../models/schemas/reaction");

const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

module.exports = (router) => {
    router.post("/signin", isNotLoggedIn, (req, res, next) => {
        passport.authenticate("local", (authError, user, info) => {
            if (authError) {
                console.error(authError);
                return next(authError);
            }

            if (!user) {
                return res.status(400).send(info);
            }

            return req.login(user, (loginError) => {
                if (loginError) {
                    console.error(loginError);
                    return next(loginError);
                }
                return res.status(200).send(info);
            });
        })(req, res, next);
    });

    router.get("/logout", isLoggedIn, (req, res, next) => {
        req.logout((err) => {
            req.session.destroy();
            if (err) {
                console.log(err);
            } else {
                res.status(200).send({ message: "로그아웃" });
            }
        });
    });

    router.get("/checkEmail", async (req, res) => {
        const dupEmail = await User.exists({ email: req.query.email });
        if (dupEmail)
            return res.status(200).send({ message: "등록된 이메일입니다", isDuplicate: true });
        else
            return res
                .status(200)
                .send({ message: "사용 가능한 이메일입니다", isDuplicate: false });
    });

    router.get("/checkNickname", async (req, res) => {
        const dupNickname = await User.exists({ nickname: req.query.nickname });
        if (dupNickname)
            return res.status(200).send({ message: "등록된 닉네임입니다", isDuplicate: true });
        else
            return res
                .status(200)
                .send({ message: "사용 가능한 닉네임입니다", isDuplicate: false });
    });

    router.post("/signup", async (req, res) => {
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(req.body.password, salt);

        /*  나중에 게임마다 인스턴스를 만들어야 하니까 후에 js파일 만들어서 나누기  */
        const reactionInstance = new Reaction({
            rank_avg: 0,
            num_people_together_avg: 0,
            click_pos: { x: 0, y: 0 },
            click_speed_avg: 0,
            foul_count_avg: 0,
            total_games: 0,
        });

        const user = new User({
            nickname: req.body.nickname,
            email: req.body.email,
            password: hashed_password,
            reactionResult: reactionInstance,
        });

        try {
            user.save((e) => {
                if (e) {
                    console.log("user save error: ", e);
                    res.status(500).send({ message: "Server Error" });
                }
            });

            reactionInstance.save((e) => {
                if (e) {
                    console.log("reaction save error: ", e);
                    res.status(500).send({ message: "Server Error" });
                }
            });

            res.status(200).send("success");
        } catch (e) {
            res.status(500).send({ message: "Server Error" });
        }
    });
};
