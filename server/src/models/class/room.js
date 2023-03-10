class Room {
    constructor(maxPlayers = 4, isGaming = false, gameData = null) {
        this.userList = []; // Array
        this.maxPlayers = maxPlayers; // Number
        this.isGaming = isGaming; // Boolean
        this.gameData = gameData;
    }
    setUserList(socketID) {
        this.userList.push(socketID);
    }

    setMaxPlayers(maxPlayers) {
        this.maxPlayers = maxPlayers;
    }

    setIsGaming(isGaming) {
        this.isGaming = isGaming;
    }
    setGameData(gameData) {
        this.gameData = gameData;
    }

    getUserList() {
        return this.userList;
    }

    getMaxPlayers() {
        return this.maxPlayers;
    }

    getIsGaming() {
        return this.isGaming;
    }

    getGameData() {
        try {
            if (this.gameData !== null) return this.gameData;
            else return null;
        } catch (e) {
            throw new Error("방과 게임데이터가 연결되지 않았습니다.");
        }
    }

    removeExitUser(socket) {
        try {
            const idx = this.userList.indexOf(socket.id);
            if (idx > -1) this.userList.splice(idx, 1);

            if (this.gameData !== null) {
                let lastUser;
                lastUser = this.gameData.removeExitUser(socket);
                return lastUser;
            } else {
                return false;
            }
        } catch (e) {
            throw new Error("방과 게임데이터가 연결되지 않았습니다.");
        }
    }
    endGame(io) {
        this.setIsGaming(false);
        for (let socket of io.sockets.sockets) {
            socket[1].isLobbyReady = false;
            socket[1].isGameReady = false;
            socket[1].isAlive = true;
        }
    }

    // addEntranceUser() {
    //
    // }
}
module.exports = Room;
