const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userId: { type: String, required: true }, // User ID for whom the notification is sent
    title: { type: String, required: true },
    message: { type: String, required: true },
    viewed: { type: Boolean, default: false },
    failureDocuments: { type: Array, default: [] }, // Add this field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);