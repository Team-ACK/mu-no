class Room{
    constructor(userList, isGaming=false){
        this.userList = userList; // Array
        this.isGaming = isGaming; // Boolean
        this.gameResult = {}
    };
    
    setUserList(userList){
        this.userList = userList;
    }
    // result Array for reaction test game (이건 나중에 뭐 게임마다 나누든 뭐든 어케든 해야함 ㅇㅇ)
    // 게임마다 이걸 나눌까요??

    // RoomId => String
    // UserList => Array
    // isGaming (게임 중이면 join 할 때 날려버려) => Boolean
    // 게임종류 : 반응속도테스트 혹은 마피아 혹은 라이어게임 => String?
    
    // setGameResult(gameTitle){
    //     if (!(gameTitle in gameResult)){
    //         gameResult[gameTitle] = [result]

    //     }
    //     else {
    //         gameResult[gameTitle].push(result) // 결과
    //     }
    // }
    
    // getGameResult(){
    //     return this.gameResult[gameTitle];
    // }
}

module.exports = Room;