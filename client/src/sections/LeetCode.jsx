import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx"; // Import XLSX for Excel generation
import StudentRow from "../components/StudentRow"; // Import the StudentRow component
import { useAppContext } from "../context/AppContext";
import { useApi } from "../api/api"; // Import useApi

const LeetCode = () => {
  const api = useApi(); // Use the configured Axios instance
  const { API_URL } = useAppContext();
  const [students, setStudents] = useState([]); // Fetch students from backend
  const [stats, setStats] = useState({});
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false); // Track if filtering has been applied
  const [isFetchingCompleted, setIsFetchingCompleted] = useState(false); // Track if fetching is completed

  // Filter states
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(""); // State for selected department

  const [years, setYears] = useState([]); // State for years
  const [batches, setBatches] = useState([]); // State for batches
  const [departments, setDepartments] = useState([]); // State for departments

  useEffect(() => {
    // Fetch years, batches, and departments from the backend
    const fetchFilters = async () => {
      try {
        const [yearResponse, batchResponse, departmentResponse] = await Promise.all([
          api.get("/upload/years"), // Backend endpoint for years
          api.get("/upload/batches"), // Backend endpoint for batches
          api.get("/upload/departments"), // Backend endpoint for departments
        ]);
        setYears(Array.isArray(yearResponse.data) ? yearResponse.data : []); // Ensure years is an array
        setBatches(Array.isArray(batchResponse.data) ? batchResponse.data : []); // Ensure batches is an array
        setDepartments(Array.isArray(departmentResponse.data) ? departmentResponse.data : []); // Ensure departments is an array
      } catch (error) {
        console.error("Failed to fetch filters", error);
        setYears([]); // Fallback to an empty array
        setBatches([]); // Fallback to an empty array
        setDepartments([]); // Fallback to an empty array
      }
    };

    fetchFilters();
  }, [api]);

  const handleFilter = async () => {
    try {
      const query = [];
      if (selectedYear) query.push(`year=${selectedYear}`);
      if (selectedBatch) query.push(`batch=${selectedBatch}`);
      if (selectedDepartment) query.push(`department=${selectedDepartment}`); // Add department to query
      const queryString = query.length > 0 ? `?${query.join("&")}` : "";

      const { data } = await api.get(`/students${queryString}`); // Fetch students based on filters
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

  const clearFilters = () => {
    setSelectedYear("");
    setSelectedBatch("");
    setSelectedDepartment("");
    setFilteredStudents(students); // Reset to show all students
    setIsFiltered(false); // Reset filter state
  };

  useEffect(() => {
    if (isFiltered) {
      const fetchStats = async () => {
        const newStats = {};
        for (const student of filteredStudents) {
          try {
            // Extract the username from the leetcodeUsername link
            const leetcodeUrlParts = student.leetcodeUsername.replace(/\/$/, "").split("/");
            const leetcodeUsername = leetcodeUrlParts[leetcodeUrlParts.length - 1];

            // Extract the username from the gfgUsername link
            const gfgUrlParts = student.gfgUsername.replace(/\/$/, "").split("/");
            const gfgUsername = gfgUrlParts[gfgUrlParts.length - 1];

            // Extract the username from the codechefUsername link
            const codechefUrlParts = student.codechefUsername.replace(/\/$/, "").split("/");
            const codechefUsername = codechefUrlParts[codechefUrlParts.length - 1];

            console.log(`Fetching stats for LeetCode: ${leetcodeUsername}, GFG: ${gfgUsername}, CodeChef: ${codechefUsername}`);

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

            // Fetch LeetCode stats
            const { data: leetcodeData } = await api.post("/leetcode/graphql", {
              query,
              variables: { username: leetcodeUsername },
            });

            const leetcodeStats = leetcodeData.data.matchedUser.submitStatsGlobal.acSubmissionNum.reduce(
              (acc, item) => {
                if (item.difficulty === "Easy") acc.easySolved = item.count;
                if (item.difficulty === "Medium") acc.mediumSolved = item.count;
                if (item.difficulty === "Hard") acc.hardSolved = item.count;
                return acc;
              },
              { easySolved: 0, mediumSolved: 0, hardSolved: 0 }
            );

            leetcodeStats.totalSolved =
              leetcodeStats.easySolved + leetcodeStats.mediumSolved + leetcodeStats.hardSolved;

            // Fetch GFG stats
            const { data: gfgData } = await api.get(`/gfg/stats/${gfgUsername}`);
            const gfgStats = {
              gfgProblemsSolved: gfgData.problemsSolved || 0,
            };
            console.log(`GFG Username: ${gfgUsername}, Problems Solved: ${gfgStats.gfgProblemsSolved}`);
            

            // Fetch CodeChef stats
            const { data: codechefData } = await api.get(`/codechef/stats/${codechefUsername}`);
            const codechefStats = {
              codechefProblemsSolved: codechefData.problemsSolved || 0,
            };

            newStats[student._id] = {
              ...leetcodeStats,
              ...gfgStats,
              ...codechefStats,
            };
          } catch (error) {
            console.error(`Failed to fetch stats for ${student.leetcodeUsername}`, error);
            newStats[student._id] = {
              totalSolved: 0,
              easySolved: 0,
              mediumSolved: 0,
              hardSolved: 0,
              gfgProblemsSolved: 0,
              codechefProblemsSolved: 0,
            };
          }
        }
        setStats(newStats);
        setIsFetchingCompleted(true); // Mark fetching as completed
      };

      fetchStats();
    }
  }, [filteredStudents, isFiltered, api]);

  const downloadExcel = () => {
    const dataToExport = filteredStudents.map((student, index) => ({
      "S.No": index + 1,
      "Roll No": student.rollNo,
      Name: student.name,
      Year: student.year,
      Batch: student.batchName,
      Department: student.department,
      Easy: stats[student._id]?.easySolved || 0,
      Medium: stats[student._id]?.mediumSolved || 0,
      Hard: stats[student._id]?.hardSolved || 0,
      LeetcodeTotal: stats[student._id]?.totalSolved || 0,
      GFGTotal: stats[student._id]?.gfgProblemsSolved || 0,
      CodeChefTotal: stats[student._id]?.codechefProblemsSolved || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LeetCode Stats");

    XLSX.writeFile(workbook, "LeetCode_Stats.xlsx");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">LeetCode Statistics</h1>

      {/* Download Button
      <div className="mb-4">
        <button
          onClick={downloadExcel}
          disabled={!isFetchingCompleted} // Disable button until fetching is completed
          className={`px-4 py-2 rounded-lg ${
            isFetchingCompleted
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Download Excel
        </button>
      </div> */}

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

        {/* Department Dropdown */}
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department._id} value={department.name}>
              {department.name}
            </option>
          ))}
        </select>

        {/* Filter Button */}
        <button
          onClick={handleFilter}
          className="px-4 py-2 rounded-lg transition-all bg-blue-200 text-blue-600 font-bold border-2 border-blue-600 hover:bg-blue-600 hover:text-white"
        >
          Filter
        </button>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 rounded-lg transition-all bg-gray-200 text-gray-600 font-bold border-2 border-gray-600 hover:bg-gray-600 hover:text-white"
        >
          Clear Filters
        </button>

        {/* Download Button */}
        <button
          onClick={downloadExcel}
          disabled={!isFetchingCompleted} // Disable button until fetching is completed
          className={`px-4 py-2 rounded-lg transition-all ${
            isFetchingCompleted
              ? "bg-green-200 text-green-600 font-bold border-2 border-green-600 hover:bg-green-600 hover:text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Download Excel
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
                <th className="px-4 py-2 text-center">Leetcode</th>
                <th className="px-4 py-2 text-center">Profile</th>
                <th className="px-4 py-2 text-center">GFG</th>
                <th className="px-4 py-2 text-center">Profile</th>
                <th className="px-4 py-2 text-center">CodeChef</th>
                <th className="px-4 py-2 text-center">Profile</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <StudentRow
                  key={student._id}
                  index={index}
                  student={student}
                  stats={stats[student._id] || {}}
                  leetcodeProfile={student.leetcodeUsername}
                  gfgProfile={student.gfgUsername} // Pass GFG username
                  codechefProfile={student.codechefUsername} // Pass CodeChef username
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