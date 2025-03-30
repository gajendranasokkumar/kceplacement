const StudentModel = require("../models/StudentModel"); // Replace with actual student model
const TodoListModel = require("../models/TodoListModel"); // Replace with actual to-do list model

async function getStudents() {
  return await StudentModel.find();
}

async function getStatistics() {
  const totalStudents = await StudentModel.countDocuments();
  const totalTeachers = 10; // Replace with actual logic
  const totalCourses = 5; // Replace with actual logic
  const totalDepartments = 3; // Replace with actual logic
  return { totalStudents, totalTeachers, totalCourses, totalDepartments };
}

async function getTodoLists() {
  return await TodoListModel.find();
}

async function addTodoList(title) {
  return await TodoListModel.create({ title, todos: [] });
}

async function updateTodoList(id, title) {
  return await TodoListModel.findByIdAndUpdate(id, { title }, { new: true });
}

async function deleteTodoList(id) {
  return await TodoListModel.findByIdAndDelete(id);
}

async function addTodoItem(listId, text, dueDate) {
  const todo = { text, dueDate, completed: false };
  const list = await TodoListModel.findById(listId);
  list.todos.push(todo);
  await list.save();
  return todo;
}

async function updateTodoItem(listId, todoId, completed) {
  const list = await TodoListModel.findById(listId);
  const todo = list.todos.id(todoId);
  todo.completed = completed;
  await list.save();
  return todo;
}

async function deleteTodoItem(listId, todoId) {
  const list = await TodoListModel.findById(listId);
  list.todos.id(todoId).remove();
  await list.save();
}

module.exports = {
  getStudents,
  getStatistics,
  getTodoLists,
  addTodoList,
  updateTodoList,
  deleteTodoList,
  addTodoItem,
  updateTodoItem,
  deleteTodoItem,
};