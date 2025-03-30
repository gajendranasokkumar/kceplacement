const express = require("express");
const router = express.Router();
const CompanyModel = require("../models/CompanyModel");

// Get all companies
router.get("/", async (req, res) => {
  try {
    const companies = await CompanyModel.find().sort({ createdAt: -1 });
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

// Get a single company by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const company = await CompanyModel.findById(id);

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({ error: "Failed to fetch company" });
  }
});

// Create a new company
router.post("/", async (req, res) => {
  const { name, address, description, website } = req.body;

  if (!name || !address) {
    return res.status(400).json({ error: "Name and address are required" });
  }

  try {
    const newCompany = await CompanyModel.create({ name, address, description, website });
    res.status(201).json({ message: "Company created successfully", company: newCompany });
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({ error: "Failed to create company" });
  }
});

// Update a company
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, address, description, website } = req.body;

  try {
    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      id,
      { name, address, description, website },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json({ message: "Company updated successfully", company: updatedCompany });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ error: "Failed to update company" });
  }
});

// Delete a company
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCompany = await CompanyModel.findByIdAndDelete(id);

    if (!deletedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ error: "Failed to delete company" });
  }
});

module.exports = router;