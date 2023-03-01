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
                rank_avg: 0,
                num_people_together_avg: 0,
                click_pos: [0, 0],
                click_speed_avg: 0,
                foul_count_avg: 0,
                total_games: 0,
            };
        });
    }

    setTargetResultCounts(targetResultCounts) {
        this.targetResultCounts = targetResultCounts;
    }

    setGameResult(gameResult) {
        this.roundResult.push(gameResult);
    }

    getTargetResultCounts() {
        return this.targetResultCounts;
    }

    getGameRoundResult() {
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
        console.log(this.roundResult);
        this.roundResult.forEach((result) => {
            this.gameResult[result.socketID].click_speed_avg += result.speed;
        });

        this.roundResult = [];
    }
}

module.exports = ReactionData;
