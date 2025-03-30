import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa"; // Added FaTimes for close button

const ShowStudents = () => {
  const { API_URL } = useAppContext();
  const [searchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered students
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [batchName, setBatchName] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null); // Track the student being edited
  const [editedStudent, setEditedStudent] = useState({}); // Store the edited student details
  const [departments, setDepartments] = useState([]); // Available departments
  const [batches, setBatches] = useState([]); // Available batches
  const [companies, setCompanies] = useState([]); // Available companies
  const [selectedCompany, setSelectedCompany] = useState(""); // Selected company for placement
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Selected department filter
  const [selectedBatch, setSelectedBatch] = useState(""); // Selected batch filter
  
  // Company popup state
  const [showCompanyPopup, setShowCompanyPopup] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(50);

  const batch = searchParams.get("batch");
  const year = searchParams.get("year");

  useEffect(() => {
    fetchStudents();
    fetchFilters();
    fetchCompanies();
  }, [batch, year]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/students?${batch ? `batch=${batch}` : `year=${year}`}`
      );
      setStudents(data);
      setFilteredStudents(data); // Initialize filtered students
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/students/filters`);
      setDepartments(data.departments);
      setBatches(data.batches);
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/companies`); // Fetch available companies
      setCompanies(data);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  // Fetch company details
  const fetchCompanyDetails = async (companyId) => {
    try {
      setLoadingCompany(true);
      const { data } = await axios.get(`${API_URL}/companies/${companyId}`);
      setCompanyDetails(data);
      setShowCompanyPopup(true);
    } catch (error) {
      console.error("Failed to fetch company details:", error);
      toast.error("Failed to load company details");
    } finally {
      setLoadingCompany(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredStudents(students); // Reset to show all students
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = students.filter((student) =>
      Object.values(student).some((value) =>
        String(value).toLowerCase().includes(lowerCaseQuery)
      )
    );

    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((student) => student._id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleBatchUpdate = async () => {
    if (!batchName.trim()) {
      toast.error("Please enter a batch name");
      return;
    }

    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    try {
      const { data } = await axios.put(`${API_URL}/students/update-batch`, {
        studentIds: selectedStudents,
        batchName,
      });

      toast.success(data.message);
      fetchStudents(); // Refresh the student list
      setBatchName(""); // Clear the input field
      setSelectedStudents([]); // Clear selected students
      setSelectAll(false); // Reset the "Select All" checkbox
    } catch (error) {
      console.error("Failed to update batch:", error);
      toast.error("Failed to update batch for students");
    }
  };

  const handlePlacementUpdate = async () => {
    if (!selectedCompany.trim()) {
      toast.error("Please select a company");
      return;
    }

    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    try {
      const { data } = await axios.put(`${API_URL}/students/update-placement`, {
        studentIds: selectedStudents, // Array of student ObjectIds
        companyName: selectedCompany, // Company ObjectId
      });

      toast.success(data.message);
      fetchStudents(); // Refresh the student list
      setSelectedStudents([]); // Clear selected students
      setSelectAll(false); // Reset the "Select All" checkbox
      setSelectedCompany(""); // Clear the selected company
    } catch (error) {
      console.error("Failed to update placement:", error);
      toast.error("Failed to update placement for students");
    }
  };

  const handleRemoveCompany = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    try {
      const { data } = await axios.put(`${API_URL}/students/remove-company`, {
        studentIds: selectedStudents, // Array of student ObjectIds
      });

      toast.success(data.message);
      fetchStudents(); // Refresh the student list
      setSelectedStudents([]); // Clear selected students
      setSelectAll(false); // Reset the "Select All" checkbox
    } catch (error) {
      console.error("Failed to remove company:", error);
      toast.error("Failed to remove company for students");
    }
  };

  const handleEditClick = (student) => {
    setEditingStudentId(student._id); // Set the student ID being edited
    setEditedStudent({ ...student }); // Initialize the edited student with the current student details
  };

  const handleInputChange = (field, value) => {
    setEditedStudent((prev) => ({ ...prev, [field]: value })); // Update the edited student details
  };

  const handleSaveClick = async () => {
    try {
      const { data } = await axios.put(
        `${API_URL}/students/${editingStudentId}`,
        editedStudent
      ); // Update the student in the backend
      toast.success(data.message);
      fetchStudents(); // Refresh the student list
      setEditingStudentId(null); // Exit edit mode
    } catch (error) {
      console.error("Failed to save student details:", error);
      toast.error("Failed to save student details");
    }
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStudentsPerPageChange = (e) => {
    setStudentsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  // Close the company popup
  const closeCompanyPopup = () => {
    setShowCompanyPopup(false);
    setCompanyDetails(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        {batch ? `Students in Batch: ${batch}` : `Students in Year: ${year}`}
      </h1>

      {/* Search and Selected Count Section */}
      <div className="sticky top-0 bg-white z-10 p-4 shadow-md mb-5">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg flex-1"
          />
          <p className="ml-4 text-lg font-bold text-black bg-amber-500 px-4 py-2 rounded-lg">
            Selected: {selectedStudents.length}
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex items-center gap-4 mb-6">
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Batches</option>
          {batches.map((batch) => (
            <option key={batch} value={batch}>
              {batch}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setSelectedDepartment("");
            setSelectedBatch("");
            setFilteredStudents(students); // Reset to show all students
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Clear Filters
        </button>
      </div>

      {/* Batch and Placement Update Section */}
      <div className="flex flex-col gap-6 mb-6 w-full">
        {/* Batch Update Section */}
        <div className="flex items-center gap-4 w-full">
          <input
            type="text"
            placeholder="Enter new batch name"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg flex-1"
          />
          <button
            onClick={handleBatchUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-1/4"
          >
            Update Batch
          </button>
        </div>

        {/* Placement Update Section */}
        <div className="flex items-center gap-4 w-full">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg flex-1"
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
          <button
            onClick={handlePlacementUpdate}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-1/4"
          >
            Update Company
          </button>
          <button
            onClick={handleRemoveCompany}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-1/4"
          >
            Remove Company
          </button>
        </div>
      </div>

      {/* Student Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : currentStudents.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Roll No</th>
                <th className="border border-gray-300 px-4 py-2">Department</th>
                <th className="border border-gray-300 px-4 py-2">Batch/Year</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => (
                <React.Fragment key={student._id}>
                  <tr
                    className={`hover:bg-gray-50 ${
                      student.isPlaced ? "bg-green-100 hover:bg-green-200" : ""
                    }`}
                  >
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => handleCheckboxChange(student._id)}
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {indexOfFirstStudent + index + 1}
                    </td>
                    {editingStudentId === student._id ? (
                      <>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="text"
                            value={editedStudent.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            className="p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="text"
                            value={editedStudent.rollNo}
                            onChange={(e) =>
                              handleInputChange("rollNo", e.target.value)
                            }
                            className="p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="text"
                            value={editedStudent.department}
                            onChange={(e) =>
                              handleInputChange("department", e.target.value)
                            }
                            className="p-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="text"
                            value={editedStudent.batchName || editedStudent.year}
                            onChange={(e) =>
                              handleInputChange("batchName", e.target.value)
                            }
                            className="p-1 border border-gray-300 rounded"
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border border-gray-300 px-4 py-2">
                          {student.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {student.rollNo}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {student.department}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {student.batchName || student.year}
                        </td>
                      </>
                    )}
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {editingStudentId === student._id ? (
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          onClick={handleSaveClick}
                        >
                          <FaSave />
                        </button>
                      ) : (
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          onClick={() => handleEditClick(student)}
                        >
                          <FaEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                  {student.isPlaced && student.company && (
                    <tr className="bg-green-50">
                      <td
                        colSpan="7"
                        className="border border-gray-300 px-4 py-2 text-center"
                      >
                        {/* <strong>Company:</strong>{" "} */}
                        <button
                          className="text-blue-600 underline"
                          onClick={() => fetchCompanyDetails(student.company)}
                        >
                          {"Company"}
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No students found.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <label htmlFor="studentsPerPage" className="mr-2">
            Students per page:
          </label>
          <select
            id="studentsPerPage"
            value={studentsPerPage}
            onChange={handleStudentsPerPageChange}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Company Details Popup */}
      {showCompanyPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Company Details</h2>
              <button
                onClick={closeCompanyPopup}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <FaTimes />
              </button>
            </div>

            {loadingCompany ? (
              <div className="text-center py-10">
                <p>Loading company details...</p>
              </div>
            ) : companyDetails ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">{companyDetails.name}</h3>
                  <p className="text-gray-700 mb-2"><strong>Address:</strong> {companyDetails.address}</p>
                  {/* <p className="text-gray-700 mb-2"><strong>Location:</strong> {companyDetails.location}</p> */}
                  {companyDetails.website && (
                    <p className="text-gray-700 mb-2">
                      <strong>Website:</strong>{" "}
                      <a href={companyDetails.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        {companyDetails.website}
                      </a>
                    </p>
                  )}
                  
                  {companyDetails.description && (
                    <div className="mt-4">
                      <h4 className="font-bold mb-1">Description:</h4>
                      <p className="text-gray-700">{companyDetails.description}</p>
                    </div>
                  )}
                  
                  {companyDetails.contactPerson && (
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <h4 className="font-bold mb-1">Contact Person:</h4>
                      <p className="text-gray-700"><strong>Name:</strong> {companyDetails.contactPerson.name}</p>
                      <p className="text-gray-700"><strong>Email:</strong> {companyDetails.contactPerson.email}</p>
                      <p className="text-gray-700"><strong>Phone:</strong> {companyDetails.contactPerson.phone}</p>
                      <p className="text-gray-700"><strong>Designation:</strong> {companyDetails.contactPerson.designation}</p>
                    </div>
                  )}
                  
                  {companyDetails.placementHistory && companyDetails.placementHistory.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-bold mb-2">Placement History:</h4>
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-3 py-2 text-left">Year</th>
                            <th className="border border-gray-300 px-3 py-2 text-left">Students Placed</th>
                            <th className="border border-gray-300 px-3 py-2 text-left">Avg. Package</th>
                          </tr>
                        </thead>
                        <tbody>
                          {companyDetails.placementHistory.map((history, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2">{history.year}</td>
                              <td className="border border-gray-300 px-3 py-2">{history.studentsPlaced}</td>
                              <td className="border border-gray-300 px-3 py-2">{history.averagePackage}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center py-4">No company details available.</p>
            )}
            
            <div className="mt-6 text-center">
              <button
                onClick={closeCompanyPopup}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowStudents;