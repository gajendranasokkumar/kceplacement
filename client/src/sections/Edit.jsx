import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import Popup from "../components/Popup"; // Import Popup component
import DeletedPopup from "../components/DeletedPopup"; // Import DeletedPopup component

const Edit = () => {
  const { API_URL } = useAppContext();
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [years, setYears] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false); // Track if the confirmation popup is open
  const [responsePopupOpen, setResponsePopupOpen] = useState(false); // Track if the response popup is open
  const [deleteTarget, setDeleteTarget] = useState(null); // Store the target for deletion
  const [popupMessage, setPopupMessage] = useState(""); // Store the response message

  useEffect(() => {
    fetchBatches();
    fetchYears();
  }, []);

  const fetchBatches = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/upload/batches`);
      setBatches(data);
    } catch (error) {
      console.error("Failed to fetch batches:", error);
    }
  };

  const fetchYears = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/upload/years`);
      setYears(data);
    } catch (error) {
      console.error("Failed to fetch years:", error);
    }
  };

  const handleView = (type, name) => {
    navigate(`/show-students?${type}=${name}`);
  };

  const confirmDelete = (type, name) => {
    setDeleteTarget({ type, name });
    setPopupMessage(""); // Clear any previous message
    setPopupOpen(true); // Open the confirmation popup
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const { type, name } = deleteTarget;

    try {
      const { data } = await axios.delete(`${API_URL}/students`, {
        params: { [type]: name },
      });

      // Remove the deleted batch or year from the UI
      if (type === "batch") {
        setBatches((prev) => prev.filter((batch) => batch.name !== name));
      } else if (type === "year") {
        setYears((prev) => prev.filter((year) => year.name !== name));
      }

      // Show the response message in the response popup
      setPopupMessage(data.message + " " + data.studentResult.deletedCount + " students deleted.");
      setResponsePopupOpen(true); // Open the response popup
    } catch (error) {
      console.error("Failed to delete students:", error);
      setPopupMessage("Failed to delete students. Please try again.");
      setResponsePopupOpen(true); // Open the response popup
    } finally {
      setPopupOpen(false); // Close the confirmation popup
    }
  };

  const borderColors = [
    "border-blue-500",
    "border-green-500",
    "border-yellow-500",
    "border-purple-500",
    "border-pink-500",
  ];

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        Edit Section
      </h1>

      {/* Batches Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Batches</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {batches.map((batch, index) => (
            <div
              key={batch._id}
              className={`relative bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center text-center border-t-4 ${
                borderColors[index % borderColors.length]
              } transition-transform transform hover:scale-105 hover:shadow-2xl`}
            >
              <span className="text-gray-800 font-semibold text-lg mb-4">
                {batch.name}
              </span>
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={() => handleView("batch", batch.name)}
                >
                  View
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={() => confirmDelete("batch", batch.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Years Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Years</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {years.map((year, index) => (
            <div
              key={year._id}
              className={`relative bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center text-center border-t-4 ${
                borderColors[index % borderColors.length]
              } transition-transform transform hover:scale-105 hover:shadow-2xl`}
            >
              <span className="text-gray-800 font-semibold text-lg mb-4">
                {year.name}
              </span>
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={() => handleView("year", year.name)}
                >
                  View
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={() => confirmDelete("year", year.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Popup */}
      <Popup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={handleDelete}
        fileName={deleteTarget?.name || ""}
      />

      {/* Response Popup */}
      <DeletedPopup
        isOpen={responsePopupOpen}
        onClose={() => setResponsePopupOpen(false)}
        message={popupMessage}
      />
    </div>
  );
};

export default Edit;