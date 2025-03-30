const express = require("express");
const axios = require("axios");
const router = express.Router();

// Proxy route to fetch LeetCode statistics
router.post("/graphql", async (req, res) => {
  const { query, variables } = req.body;

  try {
    const response = await axios.post("https://leetcode.com/graphql", { query, variables }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching LeetCode stats:", error.message);
    res.status(500).json({ error: "Failed to fetch LeetCode stats" });
  }
});

module.exports = router;
