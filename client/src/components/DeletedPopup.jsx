import React from "react";

const DeletedPopup = ({ isOpen, onClose, onConfirm, fileName, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {message ? "Operation Result" : "Confirm Deletion"}
        </h2>
        {message ? (
          <p className="text-gray-600">{message}</p>
        ) : (
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{fileName}</strong>?
          </p>
        )}
        <div className="flex justify-end space-x-4 mt-4">
          {!message && (
            <>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                onClick={onConfirm}
              >
                Delete
              </button>
            </>
          )}
          {message && (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeletedPopup;