import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext"; // Import the context for API URL

const Upload = () => {
  const { API_URL } = useAppContext(); // Access the centralized API URL
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // CRUD states for Batches, Class, and Section
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [newBatch, setNewBatch] = useState("");
  const [newClass, setNewClass] = useState("");
  const [newSection, setNewSection] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    fetchBatches();
    fetchClasses();
    fetchSections();
  }, []);

  // Fetch Batches
  const fetchBatches = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/upload/batches`);
      setBatches(data);
    } catch (error) {
      toast.error("Failed to fetch batches");
    }
  };

  // Fetch Classes
  const fetchClasses = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/upload/classes`);
      setClasses(data);
    } catch (error) {
      toast.error("Failed to fetch classes");
    }
  };

  // Fetch Sections
  const fetchSections = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/upload/sections`);
      setSections(data);
    } catch (error) {
      toast.error("Failed to fetch sections");
    }
  };

  // Add Batch
  const addBatch = async () => {
    if (!newBatch.trim()) {
      toast.error("Batch name cannot be empty");
      return;
    }
    try {
      const { data } = await axios.post(`${API_URL}/upload/batches`, { name: newBatch });
      setBatches([...batches, data]);
      setNewBatch("");
      toast.success("Batch added successfully");
    } catch (error) {
      toast.error("Failed to add batch");
    }
  };

  // Delete Batch
  const deleteBatch = async (id) => {
    try {
      await axios.delete(`${API_URL}/upload/batches/${id}`);
      setBatches(batches.filter((batch) => batch._id !== id));
      toast.success("Batch deleted successfully");
    } catch (error) {
      toast.error("Failed to delete batch");
    }
  };

  // Add Class
  const addClass = async () => {
    if (!newClass.trim()) {
      toast.error("Class name cannot be empty");
      return;
    }
    try {
      const { data } = await axios.post(`${API_URL}/upload/classes`, { name: newClass });
      setClasses([...classes, data]);
      setNewClass("");
      toast.success("Class added successfully");
    } catch (error) {
      toast.error("Failed to add class");
    }
  };

  // Delete Class
  const deleteClass = async (id) => {
    try {
      await axios.delete(`${API_URL}/upload/classes/${id}`);
      setClasses(classes.filter((cls) => cls._id !== id));
      toast.success("Class deleted successfully");
    } catch (error) {
      toast.error("Failed to delete class");
    }
  };

  // Add Section
  const addSection = async () => {
    if (!newSection.trim()) {
      toast.error("Section name cannot be empty");
      return;
    }
    try {
      const { data } = await axios.post(`${API_URL}/upload/sections`, { name: newSection });
      setSections([...sections, data]);
      setNewSection("");
      toast.success("Section added successfully");
    } catch (error) {
      toast.error("Failed to add section");
    }
  };

  // Delete Section
  const deleteSection = async (id) => {
    try {
      await axios.delete(`${API_URL}/upload/sections/${id}`);
      setSections(sections.filter((section) => section._id !== id));
      toast.success("Section deleted successfully");
    } catch (error) {
      toast.error("Failed to delete section");
    }
  };

  const handleFileSelect = (event) => {
    const files = event.target.files || event.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0].name);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      alert(`File "${selectedFile}" uploaded successfully!`);
      setSelectedFile(null); // Clear the selected file after upload
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFileSelect(event);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        Upload Section
      </h1>

      {/* Drag-and-Drop Area */}
      <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-10">
        <div
          className={`border-4 ${
            dragging ? "border-gray-400 bg-gray-100" : "border-dashed border-gray-300"
          } rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload").click()}
        >
          <label
            htmlFor="file-upload"
            className="text-gray-700 font-semibold text-lg cursor-pointer"
          >
            Drag and drop an Excel file here, or click to upload
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
        {selectedFile && (
          <p className="mt-4 text-gray-700 font-medium">
            Selected File: <span className="font-bold">{selectedFile}</span>
          </p>
        )}
        <div className="flex justify-end mt-6">
          <button
            className={`px-8 py-3 ${
              selectedFile
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } font-semibold rounded-lg hover:bg-gray-700 transition-all shadow-lg`}
            onClick={handleFileUpload}
            disabled={!selectedFile}
          >
            Confirm Upload
          </button>
        </div>
      </div>

      {/* CRUD Operations */}
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Options</h2>

        {/* CRUD Sections in a Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Batches Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Batches</h3>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                value={newBatch}
                onChange={(e) => setNewBatch(e.target.value)}
                placeholder="Add new batch"
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              />
              <button
                onClick={addBatch}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
              >
                Add
              </button>
            </div>
            <ul className="list-disc pl-6">
              {batches.map((batch) => (
                <li key={batch._id} className="flex justify-between items-center">
                  <span>{batch.name}</span>
                  <button
                    onClick={() => deleteBatch(batch._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Classes Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Classes</h3>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                value={newClass}
                onChange={(e) => setNewClass(e.target.value)}
                placeholder="Add new class"
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              />
              <button
                onClick={addClass}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
              >
                Add
              </button>
            </div>
            <ul className="list-disc pl-6">
              {classes.map((cls) => (
                <li key={cls._id} className="flex justify-between items-center">
                  <span>{cls.name}</span>
                  <button
                    onClick={() => deleteClass(cls._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sections Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Sections</h3>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                placeholder="Add new section"
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              />
              <button
                onClick={addSection}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
              >
                Add
              </button>
            </div>
            <ul className="list-disc pl-6">
              {sections.map((section) => (
                <li key={section._id} className="flex justify-between items-center">
                  <span>{section.name}</span>
                  <button
                    onClick={() => deleteSection(section._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;