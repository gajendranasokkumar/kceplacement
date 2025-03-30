import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup";

const Edit = () => {
  const navigate = useNavigate();

  // Sample JSON data for already uploaded files
  const sampleUploadedFiles = [
    "Report_Q1.xlsx",
    "Employee_Data.xls",
    "Sales_2025.xlsx",
  ];

  const [uploadedFiles, setUploadedFiles] = useState(sampleUploadedFiles);
  const [popupOpen, setPopupOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState("");

  const borderColors = [
    "border-blue-500",
    "border-green-500",
    "border-yellow-500",
    "border-purple-500",
    "border-pink-500",
  ];

  const handleDelete = (fileName) => {
    setUploadedFiles((prev) => prev.filter((file) => file !== fileName));
    setPopupOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        Edit Section
      </h1>

      {/* Uploaded Files */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {uploadedFiles.map((file, index) => (
          <div
            key={index}
            className={`relative bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center text-center border-t-4 ${
              borderColors[index % borderColors.length]
            } transition-transform transform hover:scale-105 hover:shadow-2xl`}
          >
            <span className="text-gray-800 font-semibold text-lg mb-4">
              {file}
            </span>
            <div className="flex space-x-4">
              <button
                className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-100 transition-all"
                onClick={() => navigate(`/edit-file/${file}`)}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-600 hover:bg-red-100 transition-all"
                onClick={() => {
                  setFileToDelete(file);
                  setPopupOpen(true);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Popup */}
      <Popup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={() => handleDelete(fileToDelete)}
        fileName={fileToDelete}
      />
    </div>
  );
};

export default Edit;