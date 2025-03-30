const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/students", dashboardController.getStudents);
router.get("/statistics", dashboardController.getStatistics);

router.get("/todo-lists", dashboardController.getTodoLists);
router.post("/todo-lists", dashboardController.addTodoList);
router.put("/todo-lists/:id", dashboardController.updateTodoList);
router.delete("/todo-lists/:id", dashboardController.deleteTodoList);

router.post("/todo-lists/:id/todos", dashboardController.addTodoItem);
router.put("/todo-lists/:id/todos/:todoId", dashboardController.updateTodoItem);
router.delete("/todo-lists/:id/todos/:todoId", dashboardController.deleteTodoItem);

module.exports = router;