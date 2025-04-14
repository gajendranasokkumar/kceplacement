import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

import Login from "./sections/Login";
import Dashboard from "./sections/Dashboard";
import Upload from "./sections/Upload";
import Edit from "./sections/Edit";
import NotificationSection from "./sections/NotificationSection";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LeetCode from "./sections/LeetCode";
import ShowStudents from "./sections/ShowStudents";
import Company from "./sections/Company";
import HelpSection from "./sections/HelpSection";
import CustomToast from "./components/CustomToast";
import AppWrapper from "./sections/Appwrapper"; // 👈 We'll move navigation logic there

const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;
