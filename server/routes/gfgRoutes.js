const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();

// Route to fetch GeeksforGeeks stats
router.get("/stats/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Add browser-like headers to avoid being blocked
    const response = await axios.get(`https://auth.geeksforgeeks.org/user/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://auth.geeksforgeeks.org/'
      },
      timeout: 10000 // 10 seconds timeout
    });
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    // DEBUG: Log a small section of the HTML to see what we're working with
    // console.log("HTML sample:", html.substring(0, 500));
    
    let problemsSolved = 0;
    
    // NEW METHOD 1: Look for the practice stats section
    const practiceStatsSection = $('div:contains("Practice Stats")').first();
    if (practiceStatsSection.length) {
      // console.log("Found Practice Stats section");
      
      // Find all score cards within or after this section
      const container = practiceStatsSection.closest('.widget-container');
      if (container.length) {
        const allCards = container.find('.score_card_value');
        // console.log(`Found ${allCards.length} score cards in practice section`);
        
        allCards.each((i, el) => {
          const cardText = $(el).text().trim();
          // console.log(`Card ${i} text: ${cardText}`);
          
          // Look for numbers in this card
          const match = cardText.match(/(\d+)/);
          if (match) {
            const value = parseInt(match[0], 10);
            
            // Find the label for this card
            const labelElement = $(el).prev('.score_card_name');
            if (labelElement.length) {
              const labelText = labelElement.text().trim();
              // console.log(`Card ${i} label: ${labelText}`);
              
              if (labelText.includes("Problem") && labelText.includes("Solved")) {
                problemsSolved = value;
                console.log(`Found problems solved in card: ${problemsSolved}`);
              }
            }
          }
        });
      }
    }
    
    // NEW METHOD 2: Look for the specific problem section directly
    if (problemsSolved === 0) {
      const problemSectionTitle = $('.rankStats-title:contains("Problem Solved")');
      if (problemSectionTitle.length) {
        // console.log("Found Problem Solved section title");
        
        // The count should be in the next element with class rankStats-value
        const countElement = problemSectionTitle.next('.rankStats-value');
        if (countElement.length) {
          const countText = countElement.text().trim();
          // console.log(`Count text: ${countText}`);
          
          const match = countText.match(/(\d+)/);
          if (match) {
            problemsSolved = parseInt(match[0], 10);
            console.log(`Found problems solved in rankStats: ${problemsSolved}`);
          }
        }
      }
    }
    
    // NEW METHOD 3: Look for stat boxes anywhere
    if (problemsSolved === 0) {
      $('.stat-box').each((i, el) => {
        const boxText = $(el).text().trim();
        // console.log(`Stat box ${i}: ${boxText}`);
        
        if (boxText.includes("Problem") && boxText.includes("Solved")) {
          const match = boxText.match(/(\d+)/);
          if (match) {
            problemsSolved = parseInt(match[0], 10);
          }
        }
      });
      console.log(`Found problems solved in stat box: ${problemsSolved}`);
    }
    
    // NEW METHOD 4: Look for problem count in any format
    if (problemsSolved === 0) {
      // Get all elements that might contain problems solved info
      const elements = $('*:contains("Problem Solved"), *:contains("Problems Solved")');
      elements.each((i, el) => {
        if ($(el).children().length === 0 || $(el).find('*:contains("Problem")').length === 0) {
          // Only look at elements that don't have children with "Problem" text
          // This helps focus on the most specific elements
          const elText = $(el).text().trim();
          if (elText.length < 100) { // Avoid large text blocks
            // console.log(`Potential element ${i}: ${elText}`);
            
            // Try to extract number after the "Problem(s) Solved" text
            const parentElement = $(el).parent();
            const parentText = parentElement.text().trim();
            const match = parentText.match(/Problem(?:s)?\s+Solved[^\d]*(\d+)/i) || 
                         parentText.match(/(\d+)\s+Problem(?:s)?\s+Solved/i);
            
            if (match) {
              problemsSolved = parseInt(match[1], 10);
            }
          }
        }
      });
      console.log(`Found problems solved in text parsing: ${problemsSolved}`);
    }

    console.log('GFG Username: ' + username + ', Problems Solved: ' + problemsSolved);

    // If we still couldn't find the value, add more debugging info
    if (problemsSolved === 0) {
      // console.log("Could not find problems solved count. Here are some potential element texts:");
      // Output text from a variety of elements that might contain our info
      ['h1', 'h2', 'h3', 'h4', 'h5', '.score_card_value', '.score_card_name', '.stat-box', '.rankStats-value'].forEach(selector => {
        const elements = $(selector);
        // console.log(`${selector} elements (${elements.length}):`);
        elements.each((i, el) => {
          if (i < 5) { // Limit to first 5 of each type
            // console.log(`  ${i}: ${$(el).text().trim()}`);
          }
        });
      });
    }

    res.status(200).json({
      problemsSolved,
    });
  } catch (error) {
    console.error("Error fetching GeeksforGeeks stats:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response headers:", JSON.stringify(error.response.headers));
    }
    res.status(500).json({ error: "Failed to fetch GeeksforGeeks stats", message: error.message });
  }
});

module.exports = router;