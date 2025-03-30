import React, { useEffect } from "react";
import { io } from "socket.io-client";

const SocketListener = ({ onNotification }) => {
  useEffect(() => {
    // Replace with your actual backend socket server URL
    const socket = io("http://localhost:3000", {
      transports: ["websocket"], // Ensure WebSocket is used
    });

    // Listen for the `excelProcessingComplete` event
    socket.on("excelProcessingComplete", (data) => {
      console.log("Received notification:", data);

      // Pass the notification data to the parent component
      if (onNotification) {
        onNotification(data);
      }
    });

    // Cleanup the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [onNotification]);

  return null; // This component doesn't render anything
};

export default SocketListener;