const mongoose = require("mongoose");
const config = require("../config");

mongoose.set("strictQuery", false);

module.exports = async () => {
    await mongoose
        .connect(config.databaseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("Successfully connected database"))
        .catch((err) => console.error(err));

    mongoose.connection.on("disconnected", () => console.log("Disconnected database "));
    return mongoose.connection.db;
};
