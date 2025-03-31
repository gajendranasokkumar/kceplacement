import React from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaUpload, FaEdit, FaBell, FaCode, FaBuilding, FaQuestionCircle } from "react-icons/fa"; // Import icons

const Navbar = ({ isOpen, setIsOpen }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-800 text-white flex flex-col justify-between ${
        isOpen ? "w-64" : "w-16"
      } transition-all duration-500 ease-in-out shadow-lg z-50`}
    >
      {/* Top Section */}
      <div>
        {/* Hamburger Menu */}
        <button
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
        </button>

        {/* Navbar Links */}
        <nav
          className={`flex flex-col ${
            isOpen ? "p-4 opacity-100 scale-100" : "p-2 opacity-100 scale-100"
          } space-y-4 transition-all duration-500 ease-in-out`}
        >
          <Link
            to="/dashboard"
            className="flex items-center hover:bg-gray-700 p-2 rounded transition-all duration-300 ease-in-out"
          >
            <FaTachometerAlt className="text-xl" />
            {isOpen && <span className="ml-4">Dashboard</span>}
          </Link>
          <Link
            to="/upload"
            className="flex items-center hover:bg-gray-700 p-2 rounded transition-all duration-300 ease-in-out"
          >
            <FaUpload className="text-xl" />
            {isOpen && <span className="ml-4">Upload</span>}
          </Link>
          <Link
            to="/edit"
            className="flex items-center hover:bg-gray-700 p-2 rounded transition-all duration-300 ease-in-out"
          >
            <FaEdit className="text-xl" />
            {isOpen && <span className="ml-4">Edit</span>}
          </Link>
          <Link
            to="/leetcode"
            className="flex items-center hover:bg-gray-700 p-2 rounded transition-all duration-300 ease-in-out"
          >
            <FaCode className="text-xl" />
            {isOpen && <span className="ml-4">LeetCode</span>}
          </Link>
          <Link
            to="/company"
            className="flex items-center hover:bg-gray-700 p-2 rounded transition-all duration-300 ease-in-out"
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
          className="flex items-center hover:bg-gray-700 p-2 rounded transition-all duration-300 ease-in-out"
        >
          <FaBell className="text-xl" />
          {isOpen && <span className="ml-4">Notifications</span>}
        </Link>
        <Link
          to="/help"
          className="flex items-center hover:bg-gray-700 p-2 rounded transition-all duration-300 ease-in-out"
        >
          <FaQuestionCircle className="text-xl" />
          {isOpen && <span className="ml-4">Help</span>}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;