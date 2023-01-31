const router = require("express").Router();
const path = require("path");

module.exports = (app) => {
    app.use("/", router);
    router.get("/",  (req, res) => {
        return res.sendFile(path.join(__dirname, '../../../../client/build/index.html'));
    });
}