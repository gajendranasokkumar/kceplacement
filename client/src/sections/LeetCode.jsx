import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentRow from "../components/StudentRow"; // Import the StudentRow component

const LeetCode = () => {
  // Sample student data with additional fields
  const [students] = useState([
    {
      id: 1,
      rollNo: "S12345",
      name: "Alice Johnson",
      year: "2023",
      batch: "A",
      classSection: "CS1",
      username: "alice123",
    },
    {
      id: 2,
      rollNo: "S12346",
      name: "Bob Smith",
      year: "2023",
      batch: "B",
      classSection: "CS2",
      username: "GajendranA",
    },
    {
      id: 3,
      rollNo: "S12347",
      name: "Charlie Brown",
      year: "2024",
      batch: "A",
      classSection: "CS1",
      username: "charliebrown",
    },
    {
      id: 4,
      rollNo: "S12348",
      name: "Diana Prince",
      year: "2024",
      batch: "B",
      classSection: "CS2",
      username: "dianap",
    },
  ]);

  const [stats, setStats] = useState({});
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false); // Track if filtering has been applied

  // Filter states
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedClassSection, setSelectedClassSection] = useState("");

  useEffect(() => {
    if (isFiltered) {
      const fetchStats = async () => {
        const newStats = {};
        for (const student of filteredStudents) {
          try {
            const { data } = await axios.get(
              `https://leetcode-stats-api.herokuapp.com/${student.username}`
            );
            newStats[student.id] = data;
          } catch (error) {
            console.error(`Failed to fetch stats for ${student.username}`, error);
            newStats[student.id] = {
              totalSolved: 0,
              easySolved: 0,
              mediumSolved: 0,
              hardSolved: 0,
            };
          }
        }
        setStats(newStats);
      };

      fetchStats();
    }
  }, [filteredStudents, isFiltered]);

  // Filter students based on selected criteria
  const handleFilter = () => {
    const filtered = students.filter((student) => {
      return (
        (selectedYear === "" || student.year === selectedYear) &&
        (selectedBatch === "" || student.batch === selectedBatch) &&
        (selectedClassSection === "" || student.classSection === selectedClassSection)
      );
    });
    setFilteredStudents(filtered);
    setIsFiltered(true); // Mark that filtering has been applied
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">LeetCode Statistics</h1>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Year Dropdown */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Year</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>

        {/* Batch Dropdown */}
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Batch</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>

        {/* Class Section Dropdown */}
        <select
          value={selectedClassSection}
          onChange={(e) => setSelectedClassSection(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Class Section</option>
          <option value="CS1">CS1</option>
          <option value="CS2">CS2</option>
        </select>

        {/* Filter Button */}
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          Filter
        </button>
      </div>

      {/* Show Table Only If Filter Is Applied */}
      {isFiltered && filteredStudents.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Roll No</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-center">Year</th>
                <th className="px-4 py-2 text-center">Batch</th>
                <th className="px-4 py-2 text-center">Class Section</th>
                <th className="px-4 py-2 text-center">Easy</th>
                <th className="px-4 py-2 text-center">Medium</th>
                <th className="px-4 py-2 text-center">Hard</th>
                <th className="px-4 py-2 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <StudentRow
                  key={student.id}
                  index={index}
                  student={student}
                  stats={stats[student.id] || {}}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Show Message If No Filter Is Applied */}
      {!isFiltered && (
        <p className="text-gray-500 text-center mt-6">
          Please select at least one filter option and click "Filter" to view the table.
        </p>
      )}

      {/* Show Message If No Students Match the Filter */}
      {isFiltered && filteredStudents.length === 0 && (
        <p className="text-red-500 text-center mt-6">
          No students match the selected filter criteria.
        </p>
      )}
    </div>
  );
};

export default LeetCode;