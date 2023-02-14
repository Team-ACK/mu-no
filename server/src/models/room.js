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

    // result Array for reaction test game (이건 나중에 뭐 게임마다 나누든 뭐든 어케든 해야함 ㅇㅇ)
    // 게임마다 이걸 나눌까요??

    // RoomId => String
    // UserList => Array
    // isGaming (게임 중이면 join 할 때 날려버려) => Boolean
    // 게임종류 : 반응속도테스트 혹은 마피아 혹은 라이어게임 => String?

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
