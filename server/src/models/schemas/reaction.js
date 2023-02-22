const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReactionSchema = new Schema({
    rank_avg: {
        type: Number,
        required: true,
    },
    num_people_together_avg: {
        type: Number,
        required: true,
    },
    click_pos: {
        type: { x: Number, y: Number },
        required: true,
    },
    click_speed_avg: {
        type: Number,
        required: true,
    },
    foul_count_avg: {
        type: Number,
        required: true,
    },
    total_games: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Reaction", ReactionSchema);
