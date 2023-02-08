const Room = require('../../models/room')

module.exports = (io, socket, roomList) => {
    const getUserList = (roomID) => {
        const room = io.sockets.adapter.rooms.get(roomID);
        const users = [];

        try {
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
        } catch {
            console.log("Can not find matching room");
        }
        return users;
    };


    socket.on("create-room", (data, done) => {
        const { nickname, userColor } = data;
        const roomID = new Date().getTime().toString(36); // 프런트 쪽에서 roomID다시 날려주는거 구현되면 이거

        socket.admin = true;
        socket.nickname = nickname;
        socket.userColor = userColor;

        socket.join(roomID);
        const RoomObj = new Room(getUserList(roomID));
        roomList[roomID]= RoomObj;

        done(roomID);
    });

    socket.on("join-room", (data, done) => {
        const { nickname, userColor, roomID } = data;
        const isValidRoom = roomID in roomList;

        if(!socket.admin) socket.admin = false;
        
        socket.nickname = nickname;
        socket.userColor = userColor;

        if (isValidRoom) {
            const targetRoom = roomList[roomID];
            const userList = getUserList(roomID);
            if(!socket.admin) socket.join(roomID);
            targetRoom.setUserList(userList);
            io.to(roomID).emit("user-list", userList);
        }

        console.log(roomList);

        done(isValidRoom);
    });

    socket.on("disconnect", (roomID, done) => {
        // room ID 넘겨 받기
        socket.leave(roomID);
        const userList = getUserList(roomID);
        io.to(roomID).emit("user-list", userList);
    });
};