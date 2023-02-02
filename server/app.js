const http = require("http");
const express = require("express");

const config = require("./src/config");
const loaders = require("./src/loaders");
const socketHandler = require("./src/services/socket");

const startServer = async () => {
    const app = express();
    const server = http.createServer(app);
    const { Server } = require("socket.io");
    const io = new Server(server);

    await loaders(app);
    socketHandler(io);

    server.listen(config.port);
    app.on("error", onError);
    app.on("listening", onListening);
};

const onError = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const onListening = () => {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
};

startServer();
