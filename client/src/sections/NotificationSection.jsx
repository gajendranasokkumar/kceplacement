import React, { useState } from "react";
import Notification from "../components/Notification";

const NotificationSection = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Update", message: "Version 1.2 is now live!", viewed: false },
    { id: 2, title: "Reminder", message: "Meeting at 3 PM today.", viewed: true },
    { id: 3, title: "Alert", message: "Server maintenance scheduled.", viewed: false },
  ]);

  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);

    // Mark the notification as viewed
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, viewed: true } : n
      )
    );
  };

  const handleDeleteNotification = () => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== selectedNotification.id)
    );
    setSelectedNotification(null); // Close the popup after deletion
  };

  const closePopup = () => {
    setSelectedNotification(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        Notifications
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notifications
          .sort((a, b) => Number(a.viewed) - Number(b.viewed)) // Sort new notifications first
          .map((notification) => (
            <Notification
              key={notification.id}
              notification={notification}
              onClick={handleNotificationClick}
            />
          ))}
      </div>

      {/* View Notification Popup */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedNotification.title}
            </h2>
            <p className="text-gray-600 mt-2">{selectedNotification.message}</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
                onClick={closePopup}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                onClick={handleDeleteNotification}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSection;