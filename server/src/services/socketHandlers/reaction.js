module.exports = (io, socket, roomList, getUserList) => {
    const playGame = (roomID) => {
        const randomTime = Math.floor(Math.random() * 3000 + 4000);
        io.to(roomID).emit("reaction-game-round-start", randomTime);
    };

    const endGame = () => {
        console.log("finished game");
    };

    socket.on("reaction-game-start", ({ roomID }) => {
        roomList[roomID].setGameTitle("reaction");
        roomList[roomID].setTargetResultCounts(getUserList(roomID).length);
        io.to(roomID).emit("reaction-game-start");
    });

    socket.on("reaction-game-user-result", ({ roomID, speed }) => {
        const targetResultCounts = roomList[roomID].getTargetResultCounts();
        roomList[roomID].setGameResult({ socketID: socket.id, speed: speed });

        const gameResult = roomList[roomID].getGameResult();

        if (gameResult.length !== targetResultCounts) return;

        io.to(roomID).emit("reaction-game-round-result", roomList[roomID].getGameResult());

        console.log("게임 결과 : ", gameResult);

        const lastResultCounts = 2;
        if (targetResultCounts === lastResultCounts) {
            endGame();
        } else {
            roomList[roomID].setTargetResultCounts(targetResultCounts - 1);
            console.log("targetResultCounts(게임중) : ", roomList[roomID].getTargetResultCounts());
            roomList[roomID].setEmptyResult();
            playGame(roomID);
        }
    });

    socket.on("reaction-game-ready", ({ roomID }) => {
        socket.isReady = !socket.isReady;
        const userList = getUserList(roomID);
        let allReady = true;
        userList.forEach((user) => {
            if (!user.isReady) {
                allReady = false;
            }
        });

        if (allReady) {
            playGame(roomID);
        }
    });
};
