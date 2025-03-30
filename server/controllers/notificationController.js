const NotificationModel = require("../models/NotificationModel");

const NotificationController = {
  async getNotifications(req, res) {
    try {
      const notifications = await NotificationModel.find().sort({ createdAt: -1 });
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  },

  async addNotification(req, res) {
    try {
      const { userId, title, message, failureDocuments } = req.body;
      const newNotification = await NotificationModel.create({
        userId,
        title,
        message,
        failureDocuments,
      });
      res.status(201).json(newNotification);
    } catch (error) {
      res.status(500).json({ error: "Failed to add notification" });
    }
  },

  async updateNotification(req, res) {
    try {
      const { id } = req.params;
      const { viewed } = req.body;
      const updatedNotification = await NotificationModel.findByIdAndUpdate(
        id,
        { viewed },
        { new: true }
      );
      res.status(200).json(updatedNotification);
    } catch (error) {
      res.status(500).json({ error: "Failed to update notification" });
    }
  },

  async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      await NotificationModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete notification" });
    }
  },
};

module.exports = NotificationController;