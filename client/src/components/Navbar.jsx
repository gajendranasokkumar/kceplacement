import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import {
  FaTachometerAlt,
  FaUpload,
  FaEdit,
  FaBell,
  FaCode,
  FaBuilding,
  FaQuestionCircle,
} from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi"; // Import HiOutlineLogout

const Navbar = ({ isOpen, setIsOpen, setToken }) => {
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/"); // Redirect to login page
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white flex flex-col justify-between ${
        isOpen ? "w-64" : "w-20"
      } transition-all duration-500 ease-in-out shadow-lg z-50`}
    >
      {/* Top Section */}
      <div>
        {/* Hamburger Menu */}
        {/* <button
          className="p-4 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={`block w-6 h-1 bg-white mb-1 transition-transform duration-300 ease-in-out ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-1 bg-white mb-1 transition-opacity duration-300 ease-in-out ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-1 bg-white transition-transform duration-300 ease-in-out ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button> */}

        {/* Navbar Links */}
        <nav className="mt-8 space-y-4 p-4">
          <Link
            to="/dashboard"
            className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-all duration-300"
          >
            <FaTachometerAlt className="text-xl" />
            {isOpen && <span className="ml-4">Dashboard</span>}
          </Link>
          <Link
            to="/upload"
            className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-all duration-300"
          >
            <FaUpload className="text-xl" />
            {isOpen && <span className="ml-4">Upload</span>}
          </Link>
          <Link
            to="/edit"
            className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-all duration-300"
          >
            <FaEdit className="text-xl" />
            {isOpen && <span className="ml-4">Edit</span>}
          </Link>
          <Link
            to="/leetcode"
            className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-all duration-300"
          >
            <FaCode className="text-xl" />
            {isOpen && <span className="ml-4">LeetCode</span>}
          </Link>
          <Link
            to="/company"
            className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-all duration-300"
          >
            <FaBuilding className="text-xl" />
            {isOpen && <span className="ml-4">Company</span>}
          </Link>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4">
        <Link
          to="/notifications"
          className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-all duration-300"
        >
          <FaBell className="text-xl" />
          {isOpen && <span className="ml-4">Notifications</span>}
        </Link>
        <Link
          to="/help"
          className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-all duration-300"
        >
          <FaQuestionCircle className="text-xl" />
          {isOpen && <span className="ml-4">Help</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center p-3 hover:bg-red-600 rounded-lg transition-all duration-300 w-full"
        >
          <HiOutlineLogout className="text-xl" />
          {isOpen && <span className="ml-4">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Navbar;