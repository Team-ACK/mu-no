const mongoose = require("mongoose");
const { Schema } = mongoose;
const Reaction = require("./reaction");

const UserSchema = new Schema(
    {
        nickname: {
            type: String,
            trim: true,
            required: true,
        },

        email: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },

        reactionResult: {
            type: Schema.Types.ObjectId,
            ref: "Reaction",
            required: true,
        },
    },
    { timestamps: true }
);

// UserSchema.methods.verifyPassword = function (pass, next) {};

module.exports = mongoose.model("User", UserSchema);
