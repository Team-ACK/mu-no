const lobbyHandler = require("./lobby");
const reactionHandler = require("./reaction");

module.exports = (io) => {
    const roomList = {};

    const getUsersInfo = (roomID) => {
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
                        isMember: item[1].isMember,
                        isAlive: item[1].isAlive,
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
        lobbyHandler(io, socket, roomList, getUsersInfo);
        reactionHandler(io, socket, roomList, getUsersInfo);
    });
};
