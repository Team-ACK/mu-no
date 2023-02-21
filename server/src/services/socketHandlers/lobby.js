const Room = require("../../models/class/room");

module.exports = (io, socket, roomList, getUserList) => {
    socket.on("create-room", (done) => {
        const roomID = new Date().getTime().toString(36);

        socket.admin = true;
        socket.join(roomID);

        const RoomObj = new Room(getUserList(roomID));
        roomList[roomID] = RoomObj;

        done(roomID);
    });

    socket.on("join-room", ({ nickname, userColor, roomID }, done) => {
        const isValidRoom = roomID in roomList;

        if (isValidRoom) {
            const isGaming = roomList[roomID].getIsGaming();
            if (isGaming) {
                done({ isValid: false, reason: "isGaming" });
                return;
            }

            const maxPlayers = roomList[roomID].getMaxPlayers();
            const isFull = getUserList(roomID).length == maxPlayers;
            if (isFull) {
                done({ isValid: false, reason: "isFull" });
                return;
            }

            if (!socket.admin) socket.join(roomID);

            if (!socket.admin) socket.admin = false;
            socket.nickname = nickname;
            socket.userColor = userColor;
            socket.isReady = false;

            const targetRoom = roomList[roomID];
            const userList = getUserList(roomID);

            targetRoom.setUserList(userList);
            io.to(roomID).emit("user-list", userList);
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

    socket.on("disconnecting", () => {
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
            } else {
                socket.leave(roomID);
                const userList = getUserList(roomID);
                io.to(roomID).emit("user-list", { userList: userList });
            }
        }
    });
};
