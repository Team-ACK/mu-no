const path = require("path");

module.exports = (router) => {
    router.get("*", (req, res) => {
        return res.sendFile(path.join(__dirname, "../../../../client/build/index.html"));
    });
};
