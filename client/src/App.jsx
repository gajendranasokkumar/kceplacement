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
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
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

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <Router>
      <Toaster />
      <div className="flex">
        {/* Conditionally render Navbar */}
        {token && (
          <Navbar
            isOpen={isNavbarOpen}
            setIsNavbarOpen={setIsNavbarOpen}
            setToken={setToken}
          />
        )}

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-500 ${
            token && isNavbarOpen ? "ml-64" : token ? "ml-20" : "ml-0"
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
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit"
              element={
                <ProtectedRoute>
                  <Edit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationSection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leetcode"
              element={
                <ProtectedRoute>
                  <LeetCode />
                </ProtectedRoute>
              }
            />
            <Route
              path="/show-students"
              element={
                <ProtectedRoute>
                  <ShowStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company"
              element={
                <ProtectedRoute>
                  <Company />
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <HelpSection />
                </ProtectedRoute>
              }
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
