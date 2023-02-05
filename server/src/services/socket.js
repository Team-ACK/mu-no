module.exports = (io) => {
    let roomList = [];

    io.on("connection", (socket) => {
        socket.on("create-room", (data, done) => {
            const { nickname, userColor } = data;
            const roomID = new Date().getTime().toString(36);

            socket.admin = true;
            socket.nickname = nickname;
            socket.userColor = userColor;

            socket.join(roomID);
            roomList.push(roomID);
            done(roomID);
        });

        socket.on("join-room", (data, done) => {
            const { nickname, userColor, roomID } = data;
            const isValidRoom = roomList.includes(roomID);

            socket.admin = false;
            socket.nickname = nickname;
            socket.userColor = userColor;

            if (isValidRoom) socket.join(roomID);

            done(isValidRoom);
        });

        socket.on("user-list", (data, done) => {
            const { roomID } = data;
            const room = io.sockets.adapter.rooms.get(roomID);
            const users = [];

            for (const item of io.sockets.sockets) {
                if (room.has(item[0])) {
                    let userInfo = {
                        admin: item[1].admin,
                        nickname: item[1].nickname,
                        userColor: item[1].userColor,
                    };
                    users.push(userInfo);
                }
            }

            done(users);
        });
    });
};
