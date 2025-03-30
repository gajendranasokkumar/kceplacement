import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentRow from "../components/StudentRow"; // Import the StudentRow component
import { useAppContext } from "../context/AppContext";

const LeetCode = () => {
  const { API_URL } = useAppContext();
  const [students, setStudents] = useState([]); // Fetch students from backend
  const [stats, setStats] = useState({});
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false); // Track if filtering has been applied

  // Filter states
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedClassSection, setSelectedClassSection] = useState("");

  const [years, setYears] = useState([]); // State for years
  const [batches, setBatches] = useState([]); // State for batches

  useEffect(() => {
    // Fetch years and batches from the backend
    const fetchFilters = async () => {
      try {
        const [yearResponse, batchResponse] = await Promise.all([
          axios.get(`${API_URL}/upload/years`), // Backend endpoint for years
          axios.get(`${API_URL}/upload/batches`), // Backend endpoint for batches
        ]);
        setYears(Array.isArray(yearResponse.data) ? yearResponse.data : []); // Ensure years is an array
        setBatches(Array.isArray(batchResponse.data) ? batchResponse.data : []); // Ensure batches is an array
      } catch (error) {
        console.error("Failed to fetch filters", error);
        setYears([]); // Fallback to an empty array
        setBatches([]); // Fallback to an empty array
      }
    };

    fetchFilters();
  }, []);

  const handleFilter = async () => {
    try {
      const query = [];
      if (selectedYear) query.push(`year=${selectedYear}`);
      if (selectedBatch) query.push(`batch=${selectedBatch}`);
      const queryString = query.length > 0 ? `?${query.join("&")}` : "";

      const { data } = await axios.get(`${API_URL}/students${queryString}`); // Fetch students based on filters
      setStudents(data);
      setFilteredStudents(data);
      setIsFiltered(true); // Mark that filtering has been applied
    } catch (error) {
      console.error("Failed to fetch students", error);
      setStudents([]);
      setFilteredStudents([]);
      setIsFiltered(true); // Mark that filtering has been applied even if no data is fetched
    }
  };

  useEffect(() => {
    if (isFiltered) {
      const fetchStats = async () => {
        const newStats = {};
        for (const student of filteredStudents) {
          try {
            // Extract the username from the leetcodeUsername link
            const urlParts = student.leetcodeUsername.replace(/\/$/, "").split("/");
            const username = urlParts[urlParts.length - 1]; // Get the last part of the URL

            console.log(`Fetching stats for ${username}`);

            // GraphQL query to fetch LeetCode statistics
            const query = `
              query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                  username
                  submitStatsGlobal {
                    acSubmissionNum {
                      difficulty
                      count
                    }
                  }
                }
              }
            `;

            // Make a POST request to the backend proxy
            const { data } = await axios.post(`${API_URL}/leetcode/graphql`, {
              query,
              variables: { username },
            });

            // Parse the response to extract statistics
            const stats = data.data.matchedUser.submitStatsGlobal.acSubmissionNum.reduce(
              (acc, item) => {
                if (item.difficulty === "Easy") acc.easySolved = item.count;
                if (item.difficulty === "Medium") acc.mediumSolved = item.count;
                if (item.difficulty === "Hard") acc.hardSolved = item.count;
                return acc;
              },
              { easySolved: 0, mediumSolved: 0, hardSolved: 0 }
            );

            stats.totalSolved =
              stats.easySolved + stats.mediumSolved + stats.hardSolved;

            newStats[student._id] = stats;
          } catch (error) {
            console.error(`Failed to fetch stats for ${student.leetcodeUsername}`, error);
            newStats[student._id] = {
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
          {years.map((year) => (
            <option key={year._id} value={year.name}>
              {year.name}
            </option>
          ))}
        </select>

        {/* Batch Dropdown */}
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Batch</option>
          {batches.map((batch) => (
            <option key={batch._id} value={batch.name}>
              {batch.name}
            </option>
          ))}
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
                <th className="px-4 py-2 text-center">Department</th>
                <th className="px-4 py-2 text-center">Easy</th>
                <th className="px-4 py-2 text-center">Medium</th>
                <th className="px-4 py-2 text-center">Hard</th>
                <th className="px-4 py-2 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <StudentRow
                  key={student._id}
                  index={index}
                  student={student}
                  stats={stats[student._id] || {}}
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