const Room = require("../../models/class/room");

module.exports = (io, socket, roomList, getUsersInfo) => {
    socket.on("create-room", (done) => {
        const roomID = new Date().getTime().toString(36);

        socket.admin = true;
        socket.join(roomID);

        const RoomObj = new Room();
        roomList[roomID] = RoomObj;
        done(roomID);
    });

    socket.on("join-room", ({ nickname, userColor, roomID, isMember }, done) => {
        const isValidRoom = roomID in roomList;
        if (isValidRoom) {
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
            if (!socket.admin) socket.join(roomID);
            if (!socket.admin) socket.admin = false;
            socket.isMember = isMember ? true : false;
            socket.nickname = nickname;
            socket.userColor = userColor;
            socket.isReady = false;
            socket.isAlive = true;

            const targetRoom = roomList[roomID];
            const usersInfo = getUsersInfo(roomID);
            targetRoom.setUserList(socket.id);
            io.to(roomID).emit("user-list", { userList: usersInfo });
            done({ isValid: true });
        } else {
            done({ isValid: false, reason: "notExist" });
        }
    });

    socket.on("set-max-players", ({ roomID, maxPlayers }) => {
        roomList[roomID].setMaxPlayers(maxPlayers);
        const getMaxPlayers = roomList[roomID].getMaxPlayers();
        io.to(roomID).emit("get-max-players", { maxPlayers: getMaxPlayers });
    });

    socket.on("get-max-players", ({ roomID }, done) => {
        const getMaxPlayers = roomList[roomID].getMaxPlayers();
        done({ maxPlayers: getMaxPlayers });
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
                    const gameTitle = await roomList[roomID].gameData.getGameTitle();
                    io.to(adminID).emit(`${gameTitle}-last-user-exit`);
                }
                socket.leave(roomID);
                const usersInfo = await getUsersInfo(roomID);
                io.to(roomID).emit("user-list", { userList: usersInfo });
            }
        }
    });
};
