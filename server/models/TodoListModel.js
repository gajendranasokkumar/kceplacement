const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  text: { type: String, required: true },
  dueDate: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const todoListSchema = new Schema({
  title: { type: String, required: true },
  todos: [todoSchema],
});

module.exports = mongoose.model("TodoList", todoListSchema);