const ReactionData = require("../../models/class/reactionData");

module.exports = (io, socket, roomList, getUserList) => {
    const playGame = (roomID) => {
        const randomTime = Math.floor(Math.random() * 3000 + 4000);
        io.to(roomID).emit("reaction-game-round-start", { randomTime: randomTime });
    };

    const endGame = (roomID) => {
        roomList[roomID].setIsGaming(false);
        console.log("finished game");
    };

    socket.on("reaction-selected", ({ roomID }) => {
        const room = roomList[roomID];
        const userLength = getUserList(roomID).length;
        room.setIsGaming(true);
        room.gameData = new ReactionData("reaction", userLength);
        io.to(roomID).emit("reaction-selected");
    });

    socket.on("reaction-game-user-result", ({ roomID, speed }) => {
        const reactionData = roomList[roomID].gameData;
        const targetResultCounts = reactionData.getTargetResultCounts();
        reactionData.setGameResult({ socketID: socket.id, speed: speed });

        const gameResult = reactionData.getGameResult();

        if (gameResult.length !== targetResultCounts) return;

        const getGameResult = reactionData.getGameResult();
        io.to(roomID).emit("reaction-game-round-result", { getGameResult: getGameResult });

        console.log("게임 결과 : ", gameResult);

        const lastResultCounts = 2;
        if (targetResultCounts === lastResultCounts) {
            endGame(roomID);
        } else {
            reactionData.setTargetResultCounts(targetResultCounts - 1);
            console.log("targetResultCounts(게임중) : ", reactionData.getTargetResultCounts());
            reactionData.setEmptyResult();
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
