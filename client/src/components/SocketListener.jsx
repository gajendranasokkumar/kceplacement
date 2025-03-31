import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAppContext } from "../context/AppContext";

const SocketListener = ({ onNotification }) => {
  const { API_URL } = useAppContext();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return; // Don't connect if no userId

    const socket = io(API_URL, {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        userId // Add userId to socket auth
      }
    });

    socket.on("connect", () => {
      socket.emit("join", userId);
    });

    socket.on("excelProcessingComplete", (data) => {
      console.log("Received notification:", data);
      if (onNotification) {
        onNotification({
          title: data.errorCount > 0 
            ? "Excel Processing Completed with Errors"
            : "Excel Processing Completed Successfully",
          ...data
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [API_URL, onNotification]);

  return null;
};

export default SocketListener;