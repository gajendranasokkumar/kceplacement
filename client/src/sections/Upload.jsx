import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useApi } from "../api/api"; // Import the API utility
import SocketListener from "../components/SocketListener"; // Import the existing SocketListener

const Upload = () => {
  const api = useApi(); // Get the configured Axios instance
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [batches, setBatches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [years, setYears] = useState([]);

  const [newBatch, setNewBatch] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newYear, setNewYear] = useState("");

  useEffect(() => {
    fetchBatches();
    fetchDepartments();
    fetchYears();
  }, []);

  const fetchBatches = async () => {
    try {
      const { data } = await api.get("/upload/batches");  
      setBatches(data);
    } catch (error) {
      toast.error("Failed to fetch batches");
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get("/upload/departments");
      setDepartments(data);
    } catch (error) {
      toast.error("Failed to fetch departments");
    }
  };

  const fetchYears = async () => {
    try {
      const { data } = await api.get("/upload/years");
      setYears(data);
    } catch (error) {
      toast.error("Failed to fetch years");
    }
  };

  const addBatch = async () => {
    if (!newBatch.trim()) {
      toast.error("Batch name cannot be empty");
      return;
    }
    try {
      const { data } = await api.post("/upload/batches", { name: newBatch });
      setBatches([...batches, data]);
      setNewBatch("");
      toast.success("Batch added successfully");
    } catch (error) {
      toast.error("Failed to add batch");
    }
  };

  const deleteBatch = async (id) => {
    try {
      await api.delete(`/upload/batches/${id}`);
      setBatches(batches.filter((batch) => batch._id !== id));
      toast.success("Batch deleted successfully");
    } catch (error) {
      toast.error("Failed to delete batch");
    }
  };

  const addDepartment = async () => {
    if (!newDepartment.trim()) {
      toast.error("Department name cannot be empty");
      return;
    }
    try {
      const { data } = await api.post("/upload/departments", { name: newDepartment });
      setDepartments([...departments, data]);
      setNewDepartment("");
      toast.success("Department added successfully");
    } catch (error) {
      toast.error("Failed to add department");
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await api.delete(`/upload/departments/${id}`);
      setDepartments(departments.filter((dept) => dept._id !== id));
      toast.success("Department deleted successfully");
    } catch (error) {
      toast.error("Failed to delete department");
    }
  };

  const addYear = async () => {
    if (!newYear.trim()) {
      toast.error("Year name cannot be empty");
      return;
    }
    try {
      const { data } = await api.post("/upload/years", { name: newYear });
      setYears([...years, data]);
      setNewYear("");
      toast.success("Year added successfully");
    } catch (error) {
      toast.error("Failed to add year");
    }
  };

  const deleteYear = async (id) => {
    try {
      await api.delete(`/upload/years/${id}`);
      setYears(years.filter((year) => year._id !== id));
      toast.success("Year deleted successfully");
    } catch (error) {
      toast.error("Failed to delete year");
    }
  };

  const handleFileSelect = (event) => {
    const files = event.target.files || event.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", "user123");

    try {
      setUploading(true);
      const response = await api.post("/upload/upload-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
      setSelectedFile(null);
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
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
      {/* Socket Listener Component */}
      {/* <SocketListener 
        eventName="uploadProgress" 
        onMessage={() => {}} 
      /> */}
      
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        Upload Section
      </h1>
      {/* Drag-and-Drop Area */}
      <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-10">
        <div
          className={`border-4 ${
            dragging
              ? "border-gray-400 bg-gray-100"
              : "border-dashed border-gray-300"
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
            Selected File:{" "}
            <span className="font-bold">{selectedFile.name}</span>
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
            disabled={!selectedFile || uploading}
          >
            {uploading ? "Uploading..." : "Confirm Upload"}
          </button>
        </div>
      </div>

      {/* CRUD Operations */}
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Manage Options
        </h2>

        {/* CRUD Sections in a Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Batches Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Batches
            </h3>
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
                <li
                  key={batch._id}
                  className="flex justify-between items-center mb-2"
                >
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

          {/* Departments Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Departments
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                placeholder="Add new department"
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              />
              <button
                onClick={addDepartment}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
              >
                Add
              </button>
            </div>
            <ul className="list-disc pl-6">
              {departments.map((dept) => (
                <li
                  key={dept._id}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{dept.name}</span>
                  <button
                    onClick={() => deleteDepartment(dept._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Years Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Years
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                placeholder="Add new year"
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              />
              <button
                onClick={addYear}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
              >
                Add
              </button>
            </div>
            <ul className="list-disc pl-6">
              {years.map((year) => (
                <li
                  key={year._id}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{year.name}</span>
                  <button
                    onClick={() => deleteYear(year._id)}
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