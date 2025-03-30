const {
  getBatches,
  addBatch,
  deleteBatch,
  getClasses,
  addClass,
  deleteClass,
  getSections,
  addSection,
  deleteSection,
  getYears,
} = require("../services/uploadService"); // Destructure the service functions

const UploadController = {
  async getBatches(req, res) {
    try {
      const batches = await getBatches();
      res.status(200).json(batches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch batches" });
    }
  },

  async addBatch(req, res) {
    try {
      const { name } = req.body;
      const newBatch = await addBatch(name);
      res.status(201).json(newBatch);
    } catch (error) {
      res.status(500).json({ error: "Failed to add batch" });
    }
  },

  async deleteBatch(req, res) {
    try {
      const { id } = req.params;
      await deleteBatch(id);
      res.status(200).json({ message: "Batch deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete batch" });
    }
  },

  async getClasses(req, res) {
    try {
      const classes = await getClasses();
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch classes" });
    }
  },

  async addClass(req, res) {
    try {
      const { name } = req.body;
      const newClass = await addClass(name);
      res.status(201).json(newClass);
    } catch (error) {
      res.status(500).json({ error: "Failed to add class" });
    }
  },

  async deleteClass(req, res) {
    try {
      const { id } = req.params;
      await deleteClass(id);
      res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete class" });
    }
  },

  async getSections(req, res) {
    try {
      const sections = await getSections();
      res.status(200).json(sections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sections" });
    }
  },

  async addSection(req, res) {
    try {
      const { name } = req.body;
      const newSection = await addSection(name);
      res.status(201).json(newSection);
    } catch (error) {
      res.status(500).json({ error: "Failed to add section" });
    }
  },

  async deleteSection(req, res) {
    try {
      const { id } = req.params;
      await deleteSection(id);
      res.status(200).json({ message: "Section deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete section" });
    }
  },

  async getYears(req, res) {
    try {
      const years = await getYears();
      res.status(200).json(years);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch years" });
    }
  },
};

module.exports = UploadController;