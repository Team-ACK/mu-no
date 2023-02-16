class Room {
    constructor(userList, gameTitle = "undefined", isGaming = false) {
        this.userList = userList; // Array
        this.gameTitle = gameTitle; // String
        this.isGaming = isGaming; // Boolean
        this.targetResultCounts = this.userList.length;
        this.gameResult = {};
    }

    setUserList(userList) {
        this.userList = userList;
    }

    setTargetResultCounts(targetResultCounts) {
        this.targetResultCounts = targetResultCounts;
    }

    getTargetResultCounts() {
        return this.targetResultCounts;
    }

    setGameTitle(gameTitle) {
        this.gameTitle = gameTitle;
    }

    setEmptyResult() {
        this.gameResult[this.gameTitle] = [];
    }

    setGameResult(data) {
        const { socketID, speed } = data;
        if (!(this.gameTitle in this.gameResult)) {
            this.gameResult[this.gameTitle] = [{ socketID: socketID, speed: speed }];
        } else {
            this.gameResult[this.gameTitle].push({
                socketID: socketID,
                speed: speed,
            });
        }
    }

    getGameResult() {
        return this.gameResult[this.gameTitle];
    }
}
module.exports = Room;
