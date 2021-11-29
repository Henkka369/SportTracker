const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sportSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Sport', sportSchema);