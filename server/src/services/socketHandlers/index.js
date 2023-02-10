const lobbyHandler = require("./lobby");
const reactionHandler = require("./reaction");
module.exports = (io) => {
    
    const roomList = {};
    io.on("connection", (socket) => {
        lobbyHandler(io, socket, roomList);
        reactionHandler(socket);
    });
};
