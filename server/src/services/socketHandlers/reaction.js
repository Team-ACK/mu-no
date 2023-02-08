module.exports = (socket) => {
    socket.on("reaction-game-start", (data, done) => {
        const randomTime = Math.floor((Math.random() * 1500) + 1700);
        
        
        done(randomTime);
    
    });
}
