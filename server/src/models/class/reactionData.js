const GameData = require("./gameData");

class ReactionData extends GameData {
    constructor(gameTitle, targetResultCounts) {
        super(gameTitle);
        this.roundResult = [];
        this.targetResultCounts = targetResultCounts;
    }
    setInitResult(userList) {
        userList.forEach((user) => {
            this.gameResult[user] = {
                rank: 0,
                num_people_together: 0,
                click_speed: 0,
                foul_count: 0,
                total_rounds: 0,
                total_games: 0,
            };
        });
    }

    setTargetResultCounts(targetResultCounts) {
        this.targetResultCounts = targetResultCounts;
    }

    setRoundResult(gameResult) {
        this.roundResult.push(gameResult);
    }

    getTargetResultCounts() {
        return this.targetResultCounts;
    }

    getRoundResult() {
        return this.roundResult;
    }
    removeExitUser(socket) {
        this.roundResult.forEach((result, index) => {
            if (socket.id === result.socketID) this.roundResult.splice(index, 1);
        });

        if (socket.isAlive) this.setTargetResultCounts(this.targetResultCounts - 1);
        return this.getTargetResultCounts() === this.roundResult.length;
    }
    emptyResult() {
        this.roundResult.forEach((result) => {
            this.gameResult[result.socketID].click_speed += result.speed;
            // 여기 나중에 제대로 처리해야함
        });

        this.roundResult = [];
    }
}

module.exports = ReactionData;
