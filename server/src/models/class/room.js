class Room {
    constructor(userList, maxPlayers = 4, isGaming = false, gameData = null) {
        this.userList = userList; // Array
        this.maxPlayers = maxPlayers; // Number
        this.isGaming = isGaming; // Boolean
        this.gameData = gameData;
    }
    setUserList(userList) {
        this.userList = userList;
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

    removeExitUser(socketID) {
        try {
            const idx = this.userList.indexOf(socketID);
            if (idx > -1) this.userList.splice(idx, 1);
            if (this.gamaData) this.gameData.removeExitUser();
        } catch (e) {
            throw new Error("방과 게임데이터가 연결되지 않았습니다.");
        }
    }
}
module.exports = Room;
