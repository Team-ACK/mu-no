const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReactionSchema = new Schema({
    rank_sum: {
        type: Number,
        required: true,
    },
    num_people_together_sum: {
        type: Number,
        required: true,
    },
    click_speed_sum: {
        type: Number,
        required: true,
    },
    foul_count_sum: {
        type: Number,
        required: true,
    },
    click_pos_sum: {
        type: [Number, Number],
        required: true,
    },
    total_rounds: {
        type: Number,
        required: true,
    },
    total_games: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Reaction", ReactionSchema);
