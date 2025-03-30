const {
  getStudents,
  getStatistics,
  getTodoLists,
  addTodoList,
  updateTodoList,
  deleteTodoList,
  addTodoItem,
  updateTodoItem,
  deleteTodoItem,
} = require("../services/dashboardService");

const DashboardController = {
  async getStudents(req, res) {
    try {
      const students = await getStudents();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  },

  async getStatistics(req, res) {
    try {
      const statistics = await getStatistics();
      res.status(200).json(statistics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  },

  async getTodoLists(req, res) {
    try {
      const todoLists = await getTodoLists();
      res.status(200).json(todoLists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch to-do lists" });
    }
  },

  async addTodoList(req, res) {
    try {
      const { title } = req.body;
      const newList = await addTodoList(title);
      res.status(201).json(newList);
    } catch (error) {
      res.status(500).json({ error: "Failed to add to-do list" });
    }
  },

  async updateTodoList(req, res) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const updatedList = await updateTodoList(id, title);
      res.status(200).json(updatedList);
    } catch (error) {
      res.status(500).json({ error: "Failed to update to-do list" });
    }
  },

  async deleteTodoList(req, res) {
    try {
      const { id } = req.params;
      await deleteTodoList(id);
      res.status(200).json({ message: "To-do list deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete to-do list" });
    }
  },

  async addTodoItem(req, res) {
    try {
      const { id } = req.params;
      const { text, dueDate } = req.body;
      const newTodo = await addTodoItem(id, text, dueDate);
      res.status(201).json(newTodo);
    } catch (error) {
      res.status(500).json({ error: "Failed to add to-do item" });
    }
  },

  async updateTodoItem(req, res) {
    try {
      const { id, todoId } = req.params;
      const { completed } = req.body;
      const updatedTodo = await updateTodoItem(id, todoId, completed);
      res.status(200).json(updatedTodo);
    } catch (error) {
      res.status(500).json({ error: "Failed to update to-do item" });
    }
  },

  async deleteTodoItem(req, res) {
    try {
      const { id, todoId } = req.params;
      await deleteTodoItem(id, todoId);
      res.status(200).json({ message: "To-do item deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete to-do item" });
    }
  },
};

module.exports = DashboardController;