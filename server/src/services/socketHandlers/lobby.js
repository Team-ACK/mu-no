const Room = require("../../models/class/room");

module.exports = (io, socket, roomList, getUsersInfo) => {
    const isValidRoom = (roomID) => {
        return io.sockets.adapter.rooms.has(roomID);
    };

    socket.on("create-room", (done) => {
        const roomID = new Date().getTime().toString(36);

        socket.admin = true;
        socket.join(roomID);

        const RoomObj = new Room();
        roomList[roomID] = RoomObj;

        done(roomID);
    });

    socket.on("join-room", ({ nickname, userColor, roomID, isMember }, done) => {
        if (isValidRoom(roomID)) {
            const isGaming = roomList[roomID].getIsGaming();
            if (isGaming) {
                done({ isValid: false, reason: "isGaming" });
                return;
            }

            const maxPlayers = roomList[roomID].getMaxPlayers();
            const isFull = roomList[roomID].getUserList().length == maxPlayers;
            if (isFull) {
                done({ isValid: false, reason: "isFull" });
                return;
            }

            // set socket data
            if (!socket.admin) {
                socket.join(roomID);
                socket.admin = false;
            }
            socket.isMember = isMember;
            socket.nickname = nickname;
            socket.userColor = userColor;
            socket.isLobbyReady = false;
            socket.isGameReady = false;
            socket.isAlive = true;

            roomList[roomID].setUserList(socket.id);

            const usersInfo = getUsersInfo(roomID);
            io.to(roomID).emit("user-list", { userList: usersInfo });

            done({ isValid: true });
        } else {
            done({ isValid: false, reason: "notExist" });
        }
    });

    socket.on("set-max-players", ({ roomID, maxPlayers }) => {
        roomList[roomID].setMaxPlayers(maxPlayers);
        io.to(roomID).emit("get-max-players", { maxPlayers: maxPlayers });
    });

    socket.on("get-max-players", ({ roomID }, done) => {
        const maxPlayers = roomList[roomID].getMaxPlayers();
        done({ maxPlayers: maxPlayers });
    });

    socket.on("vaild-room", ({ roomID }, done) => {
        if (isValidRoom(roomID)) {
            done({ success: true });
        } else {
            done({ success: false, reason: "notExist" });
        }
    });

    socket.on("disconnecting", async () => {
        let roomID;

        for (let value of io.sockets.adapter.sids.get(socket.id).keys()) {
            if (value !== socket.id) {
                roomID = value;
            }
        }

        if (roomID !== undefined) {
            if (socket.admin) {
                socket.admin = false;
                io.to(roomID).emit("admin-exit");

                for (let socketID of io.sockets.adapter.rooms.get(roomID)) {
                    io.sockets.sockets.get(socketID).leave(roomID);
                }
                delete roomList[roomID];
            } else {
                const lastUser = await roomList[roomID].removeExitUser(socket);
                const isGaming = roomList[roomID].getIsGaming();
                if (lastUser && isGaming) {
                    const adminID = getUsersInfo(roomID)[0].socketID;
                    const gameTitle = roomList[roomID].gameData.getGameTitle();
                    if (socket.isReady) io.to(adminID).emit(`${gameTitle}-last-user-exit`);
                    else {
                        io.sockets.sockets.get(adminID).isGameReady = false;
                        io.to(adminID).emit(`${gameTitle}-no-ready-last-user-exit`);
                    }
                }
                socket.leave(roomID);
                const usersInfo = await getUsersInfo(roomID);
                io.to(roomID).emit("user-list", { userList: usersInfo });
            }
        }
    });
};
