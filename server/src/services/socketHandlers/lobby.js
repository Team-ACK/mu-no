module.exports = (io, socket, roomList, Room, getUserList) => {
    socket.on("create-room", (data, done) => {
        const roomID = new Date().getTime().toString(36);

        socket.admin = true;
        socket.join(roomID);

        const RoomObj = new Room(getUserList(roomID));
        roomList[roomID] = RoomObj;

        done(roomID);
    });

    socket.on("join-room", ({ nickname, userColor, roomID }, done) => {
        const isValidRoom = roomID in roomList;

        if (!socket.admin) socket.admin = false;
        socket.nickname = nickname;
        socket.userColor = userColor;
        socket.isReady = false;

        if (isValidRoom) {
            if (!socket.admin) socket.join(roomID);

            const targetRoom = roomList[roomID];
            const userList = getUserList(roomID);

            targetRoom.setUserList(userList);
            io.to(roomID).emit("user-list", userList);
        }
        done(isValidRoom);
    });

    socket.on("disconnect", ({ roomID }, done) => {
        // TODO: room ID 넘겨 받기
        if (socket.admin) socket.admin = false;
        socket.leave(roomID);
        const userList = getUserList(roomID);
        io.to(roomID).emit("user-list", userList);
    });
};
