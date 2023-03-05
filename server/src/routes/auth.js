const passport = require("passport");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");

const config = require("../config");
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
                return res.status(200).send(info);
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
        const { email, password, nickname } = req.body;
        const emailRegex =
            /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

        if (!emailRegex.test(email))
            return res.status(409).send({ success: false, message: "Invalid email regex" });

        const dupEmail = await User.exists({ email: email });
        const dupNickname = await User.exists({ nickname: nickname });

        if (dupEmail || dupNickname) {
            return res.status(409).send({ success: false, message: "Duplicate email or nickname" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password, salt);

        /*  나중에 게임마다 인스턴스를 만들어야 하니까 후에 js파일 만들어서 나누기  */
        const reactionInstance = new Reaction({
            rank_sum: 0,
            num_people_together_sum: 0,
            click_speed_sum: 0,
            foul_count_sum: 0,
            click_pos_sum: [0, 0],
            total_rounds: 0,
            total_games: 0,
        });

        const user = new User({
            nickname: nickname,
            email: email,
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

            res.status(200).send({ message: "success" });
        } catch (e) {
            res.status(500).send({ message: "Server Error" });
        }
    });

    router.post("/password/reset", async (req, res) => {
        User.findOne({ email: req.body.email }, (e, user) => {
            if (!user) return res.status(404).send({ success: false, message: "Not Exist" });
            if (e) return res.status(500).send({ success: false, message: "Server Error" });

            const userEmail = user.email;
            const date = "$" + new Date().getTime();

            let code = CryptoJS.AES.encrypt(`${userEmail}${date}`, config.aesKey).toString();
            code = code.replace(/\//gi, "-");

            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: config.mailAddress,
                    pass: config.mailPassword,
                },
                port: 465,
                host: "smtp.gmail.com",
            });

            let mailOptions = {
                from: `MUNO <${config.mailAddress}}>`,
                to: userEmail,
                subject: "MUNO 비밀번호 재설정 요청",
                html: `
                    <div style="border: grey 0.5px solid; border-radius: 4px; margin: 3rem; padding: 1rem; max-width: 500px; font-family: Arial">
                        <div style="font-size: 1rem">
                            <strong>${user.nickname} 님, 안녕하세요.</strong><br><br>
                            아래의 버튼을 눌러 MUNO 비밀번호를 재설정할 수 있어요. 본인이 새로운 비밀번호를 요청하지 않았다면 이 이메일은 무시해 주세요.
                        </div>
                        </br>
                        <div style="margin: 0.2rem; text-align:center"><br>
                            <a
                                style="background-color: #696eff; border-radius: 3px; padding: 0.5rem; color: #fff; text-decoration: none"
                                href='http://muno.fun/password/reset/${code}'>비밀번호 재설정</a>                                
                        </div>
                        <br><br><br>
                        <hr><br>
                        도움이 필요하신가요? 지원팀에 문의하거나 Instagram으로 연락하세요@MUNO<br>
                        피드백을 주고 싶습니까? 저희의 피드백 사이트에서 당신의 생각을 들려주세요.
                    </div>
                    `,
            };
            transporter.sendMail(mailOptions, function (e, info) {
                if (e) {
                    console.log("error: ", e);
                    res.status(500).send({ message: "Server Error" });
                } else {
                    console.log("Email sent: " + info.response);
                    res.status(200).send({ success: true, message: "메일 보내기 성공" });
                }
                transporter.close();
            });
        });
    });

    router.put("/password/reset", async (req, res) => {
        const code = req.body.code.replace(/\-/gi, "/");
        const bytes = CryptoJS.AES.decrypt(code, config.aesKey);
        const decryptedCode = bytes.toString(CryptoJS.enc.Utf8);
        const codeEmail = decryptedCode.substring(0, decryptedCode.indexOf("$"));
        const codeDate = decryptedCode.substring(decryptedCode.indexOf("$") + 1);
        const now = new Date();

        if (now - codeDate > 30 * 60 * 1000) {
            return res.status(404).send({ success: false, message: "expired" });
        } else {
            const newPassword = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hashed_password = await bcrypt.hash(newPassword, salt);
            await User.updateOne({ email: codeEmail }, { $set: { password: hashed_password } });

            return res.status(200).send({ success: true, message: "success" });
        }
    });

    router.get("/user", async (req, res) => {
        isAuthenticated = req.isAuthenticated();
        let nickname;
        if (isAuthenticated) nickname = req.user.nickname;
        res.status(200).send({ success: isAuthenticated, nickname: nickname });
    });
};
