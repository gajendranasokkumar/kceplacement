const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();

// Route to fetch CodeChef stats
router.get("/stats/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Add user-agent to mimic a browser request
    const response = await axios.get(`https://www.codechef.com/users/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      }
    });
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    // console.log("HTML fetched successfully, length:", html.length);
    
    // Debug: Find all potential problem count sections
    // console.log("==== DEBUG: Potential problem count sections ====");
    
    // Check different potential selectors
    let problemsSolved = 0;
    
    // 1. Look for the problems solved statistic in the user profile
    const profileStats = $(".profile-user-stats");
    if (profileStats.length) {
      // console.log("Found profile-user-stats section");
      profileStats.find(".rating-stat").each((i, el) => {
        const text = $(el).text().trim();
        // console.log(`Stat ${i}: ${text}`);
        if (text.includes("Solved")) {
          const match = text.match(/(\d+)/);
          if (match) {
            problemsSolved = parseInt(match[0], 10);
            console.log(`Found problems solved from .profile-user-stats: ${problemsSolved}`);
          }
        }
      });
    }
    
    // 2. Look for fully solved section
    if (problemsSolved === 0) {
      const fullySolvedSection = $("#fullySolved");
      if (fullySolvedSection.length) {
        // console.log("Found #fullySolved section");
        const headerText = fullySolvedSection.find("h3").text().trim();
        // console.log(`Header text: ${headerText}`);
        const match = headerText.match(/\((\d+)\)/);
        if (match) {
          problemsSolved = parseInt(match[1], 10);
          console.log(`Found problems solved from #fullySolved: ${problemsSolved}`);
        }
      }
    }
    
    // 3. Try another approach - look for practice section
    if (problemsSolved === 0) {
      const practiceSection = $(".problems-solved");
      if (practiceSection.length) {
        // console.log("Found .problems-solved section");
        const text = practiceSection.text().trim();
        // console.log(`Text: ${text}`);
        const match = text.match(/(\d+)/);
        if (match) {
          problemsSolved = parseInt(match[0], 10);
          console.log(`Found problems solved from .problems-solved: ${problemsSolved}`);
        }
      }
    }
    
    // 4. Try more generic approach
    if (problemsSolved === 0) {
      $("*:contains('Problems Solved')").each((i, el) => {
        const text = $(el).text().trim();
        // console.log(`Potential element ${i}: ${text}`);
        const match = text.match(/Problems Solved[^\d]*(\d+)/i);
        if (match) {
          problemsSolved = parseInt(match[1], 10);
        }
      });
      console.log(`Found problems solved from generic search: ${problemsSolved}`);
    }
    
    // 5. As a last resort, let's find numbers near "solved" text
    if (problemsSolved === 0) {
      $("*:contains('solved')").each((i, el) => {
        const text = $(el).text().trim();
        if (text.length < 100) { // Avoid large text blocks
          // console.log(`Text with 'solved' ${i}: ${text}`);
          const match = text.match(/(\d+)\s*(?:problems)?\s*solved/i) || text.match(/solved\s*(?:problems)?\s*(\d+)/i);
          if (match) {
            problemsSolved = parseInt(match[1], 10);
            console.log(`Found problems solved from 'solved' text: ${problemsSolved}`);
          }
        }
      });
    }
    
    // Save an HTML snippet for debugging
    // const htmlSnippet = html.substring(0, 5000) + "... [truncated]";
    // console.log(`HTML snippet: ${htmlSnippet}`);
    
    console.log('CodeChef Username: ' + username + ', Problems Solved: ' + problemsSolved);

    res.status(200).json({
      problemsSolved,
      debug: {
        htmlLength: html.length,
        found: problemsSolved > 0
      }
    });
  } catch (error) {
    console.error("Error fetching CodeChef stats:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    res.status(500).json({ error: "Failed to fetch CodeChef stats", message: error.message });
  }
});

module.exports = router;