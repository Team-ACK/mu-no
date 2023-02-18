const path = require("path");
const routes = require("../routes");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");

module.exports = (app) => {
    app.use(express.static(path.join(__dirname, "../../../client/build")));
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());

    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(session({ secret: "junad", resave: true, saveUninitialized: false }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(routes());
};
