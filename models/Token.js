const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const tokenSchema = new Schema({
  token: String,
  date: Date,
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;