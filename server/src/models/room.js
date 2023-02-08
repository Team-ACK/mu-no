class Room{
    constructor(roomID, userList, isGaming=false){
        this.roomId = roomId; // String
        this.userList = userList; // Array
        this.isGaming = isGaming; // Boolean
        this.resultArray = [];
    };
    
    getRoomId(){
        return this.roomId;
    }

    setUserList(userList){
        this.userList = userList;
    }
    // result Array for reaction test game (이건 나중에 뭐 게임마다 나누든 뭐든 어케든 해야함 ㅇㅇ)
    // 게임마다 이걸 나눌까요??

    // RoomId => String
    // UserList => Array
    // isGaming (게임 중이면 join 할 때 날려버려) => Boolean
}

module.exports = () => { Room }