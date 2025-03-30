import React, { useState } from "react";

const Popup = ({ isOpen, onClose, onConfirm, fileName }) => {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p className="text-gray-700 mb-4">
          To delete <strong>{fileName}</strong>, type <strong>delete/{fileName}</strong> below:
        </p>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          placeholder={`delete/${fileName}`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              inputValue === `delete/${fileName}`
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={onConfirm}
            disabled={inputValue !== `delete/${fileName}`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;