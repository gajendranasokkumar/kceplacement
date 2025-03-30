import React from "react";

const Notification = ({ notification, onClick }) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-md cursor-pointer transition-all ${
        notification.viewed
          ? "bg-gray-100 hover:bg-gray-200"
          : "bg-white hover:bg-gray-100"
      }`}
      onClick={() => onClick(notification)}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {notification.title}
        </h3>
        {!notification.viewed && (
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
        )}
      </div>
      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
    </div>
  );
};

export default Notification;