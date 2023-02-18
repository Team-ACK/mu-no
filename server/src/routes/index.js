const home = require("./home");
const auth = require("./auth");
const router = require("express").Router();

module.exports = () => {
    auth(router);
    home(router);
    return router;
};
