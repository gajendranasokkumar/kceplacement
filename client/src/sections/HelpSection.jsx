import React from "react";

const HelpSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        Help & Support
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-700">
          For any issues or support, please contact the developers:
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Name:</strong> Gajendran A
          </li>
          <li>
            <strong>Email:</strong> gajendran2908@gamil.com
          </li>
          <li>
            <strong>Phone:</strong> +91 9944919805
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HelpSection;
