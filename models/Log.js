const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const logSchema = new Schema({
  artistId: String,
 	artistName: String,
 	isOHW: Object,
 	fitParams: Object,
 	date: Date,
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;