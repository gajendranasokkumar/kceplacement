import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../components/Notification";
import { useAppContext } from "../context/AppContext";

const NotificationSection = () => {
  const { API_URL } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/notifications`);
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, [API_URL]);

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);

    // Mark the notification as viewed
    try {
      const { data } = await axios.put(`${API_URL}/notifications/${notification._id}`, {
        viewed: true,
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === data._id ? data : n))
      );
    } catch (error) {
      console.error("Failed to update notification:", error);
    }
  };

  const handleDeleteNotification = async () => {
    try {
      await axios.delete(`${API_URL}/notifications/${selectedNotification._id}`);
      setNotifications((prev) =>
        prev.filter((n) => n._id !== selectedNotification._id)
      );
      setSelectedNotification(null); // Close the popup after deletion
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
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
              key={notification._id}
              notification={notification}
              onClick={handleNotificationClick}
            />
          ))}
      </div>

      {/* View Notification Popup */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-9/12 max-w-8xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedNotification.title}
            </h2>
            <p className="text-gray-600 mt-2">{selectedNotification.message}</p>

            {/* Display Failure Documents in a Scrollable Table */}
            {selectedNotification.failureDocuments &&
              selectedNotification.failureDocuments.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Failure Details
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Roll No</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Department</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">LeetCode Username</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedNotification.failureDocuments.map((doc, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-1">{doc.row.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{doc.row.rollNo}</td>
                            <td className="border border-gray-300 px-4 py-2">{doc.row.department}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <a
                                href={doc.row.leetcodeUsername}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {doc.row.leetcodeUsername}
                              </a>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-red-600">
                              {doc.error}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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