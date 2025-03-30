import React, { useState } from "react";

const Upload = () => {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // CRUD states for Batches, Class, and Section
  const [batches, setBatches] = useState(["A", "B"]);
  const [classes, setClasses] = useState(["CS1", "CS2"]);
  const [sections, setSections] = useState(["2023", "2024"]);

  const [newBatch, setNewBatch] = useState("");
  const [newClass, setNewClass] = useState("");
  const [newSection, setNewSection] = useState("");

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

  // CRUD Handlers
  const addBatch = () => {
    if (newBatch.trim() && !batches.includes(newBatch)) {
      setBatches([...batches, newBatch]);
      setNewBatch("");
    }
  };

  const deleteBatch = (batch) => {
    setBatches(batches.filter((b) => b !== batch));
  };

  const addClass = () => {
    if (newClass.trim() && !classes.includes(newClass)) {
      setClasses([...classes, newClass]);
      setNewClass("");
    }
  };

  const deleteClass = (cls) => {
    setClasses(classes.filter((c) => c !== cls));
  };

  const addSection = () => {
    if (newSection.trim() && !sections.includes(newSection)) {
      setSections([...sections, newSection]);
      setNewSection("");
    }
  };

  const deleteSection = (section) => {
    setSections(sections.filter((s) => s !== section));
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
                <li key={batch} className="flex justify-between items-center">
                  <span>{batch}</span>
                  <button
                    onClick={() => deleteBatch(batch)}
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
                <li key={cls} className="flex justify-between items-center">
                  <span>{cls}</span>
                  <button
                    onClick={() => deleteClass(cls)}
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
                <li key={section} className="flex justify-between items-center">
                  <span>{section}</span>
                  <button
                    onClick={() => deleteSection(section)}
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