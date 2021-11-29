const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const iconSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Icon', iconSchema);