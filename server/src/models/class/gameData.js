class GameData {
    constructor(gameTitle) {
        this.gameTitle = gameTitle;
        this.gameResult = [];
        if (this.constructor === GameData) {
            throw new Error("추상 클래스로 인스턴스를 생성하였습니다.");
        }
    }
    setGameTitle(gameTitle) {
        this.gameTitle = gameTitle;
    }
    setGameResult(gameResult) {
        this.gameResult.push(gameResult);
    }
    getGameTitle() {
        return this.gameTitle;
    }
    getGameResult() {
        return this.gameResult;
    }
    removeExitUser() {
        throw new Error("추상 메소드는 꼭 오버라이딩 되어야 합니다.");
    }
    addEntranceUser() {
        throw new Error("추상 메소드는 꼭 오버라이딩 되어야 합니다.");
    }
}

module.exports = GameData;
