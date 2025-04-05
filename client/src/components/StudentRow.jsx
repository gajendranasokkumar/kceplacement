import React from "react";
import { FaCode } from "react-icons/fa"; // Import LeetCode symbol (or any icon library)

const StudentRow = ({ index, student, stats, leetcodeProfile }) => {
  const isLoading = !stats || Object.keys(stats).length === 0;

  return (
    <tr
      className={`${
        index % 2 === 0 ? "bg-gray-100" : "bg-white"
      } hover:bg-gray-200 border-b-gray-500 border-b-2`}
    >
      <td className="px-4 py-2">{index + 1}</td>
      <td className="px-4 py-2 whitespace-nowrap">{student.rollNo}</td>
      <td className="px-4 py-2 whitespace-nowrap">{student.name}</td>
      <td className="px-4 py-2 text-center">{student.year}</td>
      <td className="px-4 py-2 text-center whitespace-nowrap">{student.batchName}</td>
      <td className="px-4 py-2 text-center whitespace-nowrap">{student.department}</td>
      <td
        className="px-4 py-2 text-center font-bold"
        style={{ backgroundColor: "#d4f8e8" }} // Light green background
      >
        {isLoading ? (
          <span className="animate-spin text-green-600">⏳</span>
        ) : (
          <span className="text-green-600">{stats.easySolved || 0}</span>
        )}
      </td>
      <td
        className="px-4 py-2 text-center font-bold"
        style={{ backgroundColor: "#fff4cc" }} // Light yellow background
      >
        {isLoading ? (
          <span className="animate-spin text-yellow-600">⏳</span>
        ) : (
          <span className="text-yellow-600">{stats.mediumSolved || 0}</span>
        )}
      </td>
      <td
        className="px-4 py-2 text-center font-bold"
        style={{ backgroundColor: "#f8d7da" }} // Light red background
      >
        {isLoading ? (
          <span className="animate-spin text-red-600">⏳</span>
        ) : (
          <span className="text-red-600">{stats.hardSolved || 0}</span>
        )}
      </td>
      <td className="px-4 py-2 text-center font-bold">
        {isLoading ? (
          <span className="animate-spin text-gray-600">⏳</span>
        ) : (
          stats.totalSolved || 0
        )}
      </td>
      <td className="px-4 py-2 text-center ">
        <a
          href={leetcodeProfile}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 text-center"
        >
          <FaCode size={20} /> 
        </a>
      </td>
      {/* <td className="px-4 py-2 text-center">
        <a
          href={leetcodeProfile}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
        >
          View Profile
        </a>
      </td> */}
      <td className="px-4 py-2 text-center font-bold">
        {isLoading ? (
          <span className="animate-spin text-gray-600">⏳</span>
        ) : (
          stats.gfgProblemsSolved || 0
        )}
      </td>
      <td className="px-4 py-2 text-center">
        {student.gfgUsername ? (
          <a
            href={student.gfgUsername}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
          <FaCode size={20} /> 
          </a>
        ) : (
          "N/A"
        )}
      </td>
      <td className="px-4 py-2 text-center font-bold">
        {isLoading ? (
          <span className="animate-spin text-gray-600">⏳</span>
        ) : (
          stats.codechefProblemsSolved || 0
        )}
      </td>
      <td className="px-4 py-2 text-center">
        {student.codechefUsername ? (
          <a
            href={student.codechefUsername}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
          <FaCode size={20} /> 
          </a>
        ) : (
          "N/A"
        )}
      </td>
    </tr>
  );
};

export default StudentRow;