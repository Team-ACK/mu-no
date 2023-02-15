const lobbyHandler = require("./lobby");
const reactionHandler = require("./reaction");

module.exports = (io) => {
    const roomList = {};

    const getUserList = (roomID) => {
        const room = io.sockets.adapter.rooms.get(roomID);
        const users = [];

        try {
            for (const item of io.sockets.sockets) {
                if (room.has(item[0])) {
                    const userInfo = {
                        admin: item[1].admin,
                        nickname: item[1].nickname,
                        userColor: item[1].userColor,
                        socketID: item[1].id,
                        isReady: item[1].isReady,
                    };
                    users.push(userInfo);
                }
            }
        } catch {
            console.log("Can not find matching room");
        }
        return users;
    };

    io.on("connection", (socket) => {
        lobbyHandler(io, socket, roomList, getUserList);
        reactionHandler(io, socket, roomList, getUserList);
    });
};
