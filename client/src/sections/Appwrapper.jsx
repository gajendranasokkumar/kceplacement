import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import Login from "../sections/Login";
import Dashboard from "../sections/Dashboard";
import Upload from "../sections/Upload";
import Edit from "../sections/Edit";
import NotificationSection from "../sections/NotificationSection";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import LeetCode from "../sections/LeetCode";
import ShowStudents from "../sections/ShowStudents";
import Company from "../sections/Company";
import HelpSection from "../sections/HelpSection";
import CustomToast from "../components/CustomToast";
import { Toaster } from "react-hot-toast";

const AppWrapper = () => {
  const [token, setToken] = useState(Cookies.get("token"));
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cookieToken = Cookies.get("token");
    if (cookieToken) setToken(cookieToken);
    else setToken(null);
  }, []);

  useEffect(() => {
    if (!token) {
      Cookies.remove("token");
      navigate("/"); // 👈 navigate works now
    }
  }, [token, navigate]);

  useEffect(() => {
    localStorage.setItem("navbarState", JSON.stringify(isNavbarOpen));
  }, [isNavbarOpen]);

  const handleNotification = (data) => {
    setNotification(data);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <>
      <Toaster />
      <div className="flex">
        {token && (
          <Navbar
            isOpen={isNavbarOpen}
            setIsNavbarOpen={setIsNavbarOpen}
            setToken={setToken}
          />
        )}
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

          {/* Custom Notification */}
          {notification && (
            <CustomToast message={notification} onClose={closeNotification} />
          )}
        </div>
      </div>
    </>
  );
};

export default AppWrapper;
