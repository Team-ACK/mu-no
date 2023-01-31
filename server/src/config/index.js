const dotenv = require("dotenv");
const path = require("path");

if (process.env.NODE_ENV === "production") {
    dotenv.config({ path: path.join(__dirname, "../../.env.prod") });
} else if (process.env.NODE_ENV === "development") {
    dotenv.config({ path: path.join(__dirname, "../../.env.dev") });
} else {
    throw new Error("⚠️ Couldn't find .env file  ⚠️");
}

module.exports = {
    port: process.env.PORT,
};
