import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { useApi } from "../api/api"; // Import useApi

const Company = () => {
  const api = useApi(); // Use the configured Axios instance
  const [companies, setCompanies] = useState([]); // Ensure companies is initialized as an empty array
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    website: "",
  });
  const [editingCompanyId, setEditingCompanyId] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data } = await api.get("/companies");
      if (Array.isArray(data)) {
        setCompanies(data); // Ensure the response is an array before setting state
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to fetch companies");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address) {
      toast.error("Name and address are required");
      return;
    }

    try {
      if (editingCompanyId) {
        // Update company
        const { data } = await api.put(`/companies/${editingCompanyId}`, formData);
        toast.success(data.message);
      } else {
        // Create company
        const { data } = await api.post("/companies", formData);
        toast.success(data.message);
      }

      setFormData({ name: "", address: "", description: "", website: "" });
      setEditingCompanyId(null);
      fetchCompanies();
    } catch (error) {
      console.error("Error saving company:", error);
      toast.error("Failed to save company");
    }
  };

  const handleEdit = (company) => {
    setFormData({
      name: company.name,
      address: company.address,
      description: company.description,
      website: company.website,
    });
    setEditingCompanyId(company._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;

    try {
      const { data } = await api.delete(`/companies/${id}`);
      toast.success(data.message);
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Failed to delete company");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
        Company Management
      </h1>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white shadow-md rounded-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Company Name"
            value={formData.name}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            name="website"
            placeholder="Website"
            value={formData.website}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg col-span-1 md:col-span-2"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {editingCompanyId ? "Update Company" : "Add Company"}
        </button>
      </form>

      {/* Company List Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Company List</h2>
          <p className="text-black font-bold">
            {"Total Companies: "}
            <span className="text-white bg-black font-bold px-5 py-1 rounded-md">
              {companies.length}
            </span>
          </p>
        </div>
        {Array.isArray(companies) && companies.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Address</th>
                <th className="border border-gray-300 px-4 py-2">Website</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => (
                <React.Fragment key={company._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{company.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{company.address}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {company.website}
                      </a>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => handleEdit(company)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(company._id)}
                        className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td
                      colSpan="5"
                      className="border border-gray-300 px-4 py-2 text-gray-700 italic"
                    >
                      <strong>Description:</strong>{" "}
                      {company.description || "No description available"}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No companies found.</p>
        )}
      </div>
    </div>
  );
};

export default Company;
