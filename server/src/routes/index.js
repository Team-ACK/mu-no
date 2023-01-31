const home = require("./home/home");
const app = require("express").Router();

module.exports = () => {
    home(app);
    return app;
};
