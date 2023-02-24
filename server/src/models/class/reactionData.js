const GameData = require("./gameData");

class ReactionData extends GameData {
    constructor(gameTitle, targetResultCounts) {
        super(gameTitle);
        this.targetResultCounts = targetResultCounts;
        this.speed = 0;
    }
    setSpeed(speed) {
        this.speed = speed;
    }
    setTargetResultCounts(targetResultCounts) {
        this.targetResultCounts = targetResultCounts;
    }
    getSpeed() {
        return this.speed;
    }
    getTargetResultCounts() {
        return this.targetResultCounts;
    }

    removeExitUser() {
        setTargetResultCounts(this.targetResultCounts - 1);
    }

    setEmptyResult() {
        this.gameResult = [];
    }
}

module.exports = ReactionData;
