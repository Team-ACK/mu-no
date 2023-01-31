const mongoose = require("mongoose");
const config = require("../config");

mongoose.set("strictQuery", false);

module.exports = async () => {
    const connection = await mongoose
        .connect(config.databaseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .catch((error) => handleError(error));

    return connection.connection.db;
};
