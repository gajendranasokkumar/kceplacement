import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Login from "./sections/Login";
import Dashboard from "./sections/Dashboard";
import Upload from "./sections/Upload";
import Edit from "./sections/Edit";
import NotificationSection from "./sections/NotificationSection"; // Import NotificationSection
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";
import LeetCode from "./sections/LeetCode";
import SocketListener from "./components/SocketListener"; // Import SocketListener
import ShowStudents from "./sections/ShowStudents"; // Import ShowStudents component
import Company from "./sections/Company"; // Import the Company component
import HelpSection from "./sections/HelpSection"; // Import HelpSection

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isNavbarOpen, setIsNavbarOpen] = useState(
    JSON.parse(localStorage.getItem("navbarState")) || false
  );

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem("navbarState", JSON.stringify(isNavbarOpen));
  }, [isNavbarOpen]);

  return (
    <Router>
      <Toaster />
      <div className="flex">
        {/* Navbar */}
        {token || <Navbar isOpen={isNavbarOpen} setIsOpen={setIsNavbarOpen} />}

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-500 ${
            isNavbarOpen ? "ml-64" : "ml-16"
          }`}
        >
          <Routes>
            <Route
              path="/"
              element={
                token ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Login setToken={setToken} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute
                  token={token}
                  element={<Dashboard token={token} />}
                />
              }
            />
            <Route
              path="/upload"
              element={<PrivateRoute token={token} element={<Upload />} />}
            />
            <Route
              path="/edit"
              element={<PrivateRoute token={token} element={<Edit />} />}
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute token={token} element={<NotificationSection />} />
              }
            />
            <Route
              path="/leetcode"
              element={<PrivateRoute token={token} element={<LeetCode />} />}
            />
            <Route
              path="/show-students"
              element={<PrivateRoute token={token} element={<ShowStudents />} />}
            />
            <Route
              path="/company"
              element={<PrivateRoute token={token} element={<Company />} />} // Add the Company route
            />
            <Route
              path="/help"
              element={<PrivateRoute token={token} element={<HelpSection />} />}
            />
          </Routes>

          {/* Socket Listener */}
          <SocketListener
            onNotification={(data) => {
              toast.success("Excel processing completed!"); // Show a toast notification
            }}
          />
        </div>
      </div>
    </Router>
  );
};

export default App;
