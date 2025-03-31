import React from 'react';
import { FaTimes } from 'react-icons/fa';

const CustomToast = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm animate-slide-in">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{message.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Success: {message.successCount}, Errors: {message.errorCount}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={16} />
        </button>
      </div>
      {message.errorRows && message.errorRows.length > 0 && (
        <div className="mt-2 text-xs text-red-500">
          {message.errorRows.length} rows had errors
        </div>
      )}
    </div>
  );
};

export default CustomToast;
