const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exampleSchema = new Schema({
  name: String,
  value: Number
});

module.exports = mongoose.model('Example', exampleSchema);
        