const home = require("./home/home");
const router = require("express").Router();

module.exports = () => {
    home(router);
    return router;
};
