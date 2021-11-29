const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    userId: String,
    sport: String,
    icon: String,
    durationH: String,
    durationMin: String,
    distance: String,
    date: Date,
    imageUrl: String
});

module.exports = mongoose.model('Exercise', exerciseSchema);