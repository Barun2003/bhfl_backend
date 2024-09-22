const express = require("express");
const bodyParser = require("body-parser");
const base64js = require("base64-js");
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Helper function to extract numbers and alphabets
function extractNumbersAndAlphabets(data) {
  const numbers = data.filter(item => /^\d+$/.test(item));
  const alphabets = data.filter(item => /^[a-zA-Z]+$/.test(item));
  return { numbers, alphabets };
}

// Helper function to get the highest lowercase alphabet
function getHighestLowercase(alphabets) {
  const lowercaseLetters = alphabets.filter(item => /^[a-z]+$/.test(item));
  return lowercaseLetters.length > 0 ? lowercaseLetters.sort().pop() : "";
}

// POST request endpoint
app.post("/bfhl", (req, res) => {
  try {
    const { user_id, email, roll_number, data: requestData } = req.body;
    const { data, file_b64 } = requestData;

    // Extract numbers and alphabets
    const { numbers, alphabets } = extractNumbersAndAlphabets(data);

    // Get highest lowercase alphabet
    const highestLowercase = getHighestLowercase(alphabets);

    // Handle file validation and processing
    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKb = 0;

    if (file_b64) {
      try {
        // Decode base64 file
        const fileData = base64js.toByteArray(file_b64);
        fileValid = true;
        fileMimeType = "application/octet-stream"; // You can modify this based on actual file analysis
        fileSizeKb = (fileData.length / 1024).toFixed(2);
      } catch (error) {
        fileValid = false;
        fileMimeType = null;
        fileSizeKb = 0;
      }
    }

    // Response
    res.json({
      is_success: true,
      user_id: "barun81",
      email: "bg2601@srmist.edu.in",
      roll_number: "RA2111026050060",
      numbers: numbers,
      alphabets: alphabets,
      highest_lowercase_alphabet: highestLowercase,
      file: {
        file_valid: fileValid,
        file_mime_type: fileMimeType,
        file_size_kb: fileSizeKb,
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid input" });
  }
});

// GET request endpoint
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Set the server to listen on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
