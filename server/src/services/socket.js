module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.on("clientEmit", () => {
            const msg = "welcome!";
            socket.emit("welcome", msg);
        })
    })

};
