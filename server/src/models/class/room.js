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

    getGameResult() {
        try {
            return this.gameData.getGameResult();
        } catch (e) {
            throw new Error("방과 게임데이터가 연결되지 않았습니다.");
        }
    }

    setEmptyResult() {
        try {
            return this.gameData.setEmptyResult();
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

    // addEntranceUser() {
    //
    // }
}
module.exports = Room;
