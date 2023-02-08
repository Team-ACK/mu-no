const Room = require('../../models/room')

module.exports = (io, socket, roomList) => {
    const getUserList = (roomId) => {
        const room = io.sockets.adapter.rooms.get(roomId);
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
        const roomId = new Date().getTime().toString(36); // 프런트 쪽에서 roomID다시 날려주는거 구현되면 이거

        socket.admin = true;
        socket.nickname = nickname;
        socket.userColor = userColor;

        socket.join(roomId);
        const RoomObj = new Room(roomId, getUserList(roomId));
        roomList.push(RoomObj);

        done(roomId);
    });

    socket.on("join-room", (data, done) => {
        const { nickname, userColor, roomId } = data;
        let isValidRoom, targetRoom = 0;

        roomList.forEach((room) => {  // 방을 굳이 선회를 해야할까요 유빈선생님??
            isValidRoom = (room.getRoomId() === roomId);
            targetRoom = room;
            if (isValidRoom) {return false;} 
        })
        
        
        if(!socket.admin) socket.admin = false;
        socket.nickname = nickname;
        socket.userColor = userColor;

        if (isValidRoom) {
            socket.join(roomId);
            const userList = getUserList(roomId);
            targetRoom.setUserList(userList);
            io.to(roomId).emit("user-list", userList);
        }

        done(isValidRoom);
    });

    socket.on("disconnect", (roomId, done) => {
        // room ID 넘겨 받기
        socket.leave(roomId);
        const userList = getUserList(roomId);
        io.to(roomId).emit("user-list", userList);
    });
};