const lobbyHandler = require("./lobby");
const reactionHandler = require("./reaction");
module.exports = (io) => {
    io.on("connection", (socket) => {
    lobbyHandler(socket);
    reactionHandler(socket);
    });
}