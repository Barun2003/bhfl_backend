const express = require("express");
const bodyParser = require("body-parser");
const base64js = require("base64-js");
const app = express();

app.use(bodyParser.json());

function extractNumbersAndAlphabets(data) {
  const numbers = data.filter(item => /^\d+$/.test(item));
  const alphabets = data.filter(item => /^[a-zA-Z]+$/.test(item));
  return { numbers, alphabets };
}

function getHighestLowercase(alphabets) {
  const lowercaseLetters = alphabets.filter(item => /^[a-z]+$/.test(item));
  return lowercaseLetters.length > 0 ? lowercaseLetters.sort().pop() : "";
}

app.post("/bfhl", (req, res) => {
  try {
    const { user_id, email, roll_number, data: requestData } = req.body;

    // Error: Missing required fields
    if (!user_id || !email || !roll_number || !requestData) {
      return res.status(400).json({ error: "Missing required fields: user_id, email, roll_number, or data" });
    }

    // Error: Data is not an array
    if (!Array.isArray(requestData.data)) {
      return res.status(400).json({ error: "Data field must be an array" });
    }

    // Extract numbers and alphabets from the data array
    const { numbers, alphabets } = extractNumbersAndAlphabets(requestData.data);

    const highestLowercase = getHighestLowercase(alphabets);

    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKb = 0;

    if (requestData.file_b64) {
      try {
        // Check if the base64 string is valid
        const fileData = base64js.toByteArray(requestData.file_b64);
        fileValid = true;
        fileMimeType = "application/octet-stream"; // You can replace this with a better MIME type check
        fileSizeKb = (fileData.length / 1024).toFixed(2);
      } catch (error) {
        return res.status(400).json({ error: "Invalid file_b64 encoding" });
      }
    }

    // Successful response
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
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
