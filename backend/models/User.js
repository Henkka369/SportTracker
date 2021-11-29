const { Int32 } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    uid: String,
    name: String,
    height: String,
    weight: String,
    age: Number,
    email: String
});

module.exports = mongoose.model('User', userSchema);