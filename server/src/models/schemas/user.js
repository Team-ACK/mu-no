const mongoose = require("mongoose");
const { Schema } = mongoose;

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

module.exports = mongoose.model("User", UserSchema);
