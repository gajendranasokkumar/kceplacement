import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SocketListener = () => {
  const [messages, setMessages] = useState([]);
  const socket = io("wss://echo.websocket.events"); // Replace with your socket server URL

  useEffect(() => {
    // Listen for new messages from the socket
    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);

      // Automatically remove the message after 5 seconds
      setTimeout(() => {
        setMessages((prev) => prev.slice(1));
      }, 5000);
    });

    // Cleanup the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="fixed bottom-4 right-4 space-y-4 z-50">
      {messages.map((message, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-lg shadow-lg animate-slide-in"
        >
          <p className="font-semibold">{message.title}</p>
          <p className="text-sm">{message.body}</p>
        </div>
      ))}
    </div>
  );
};

export default SocketListener;