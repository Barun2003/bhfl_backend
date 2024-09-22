import express from "express";
import cors from "cors";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Helper function to validate Base64
const isValidBase64 = (str) => {
  try {
    Buffer.from(str, "base64").toString("binary");
    return true;
  } catch (err) {
    return false;
  }
};

// GET request
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// POST request
app.post("/bfhl", (req, res) => {
  try {
    const requestData = JSON.parse(req.body.data);
    const file_b64 = req.body.file_b64;

    // Validate file if provided
    let fileValid = false;
    let fileType = null;
    let fileSizeKb = 0;

    if (file_b64 && isValidBase64(file_b64)) {
      fileValid = true;
      const fileBuffer = Buffer.from(file_b64, "base64");
      fileType = "application/octet-stream"; // Set appropriate MIME type
      fileSizeKb = (fileBuffer.length / 1024).toFixed(2);
    }

    let numbers = [];
    let alphabets = [];
    let highestLowerCase = null;

    requestData.data.forEach((item) => {
      if (!isNaN(item)) {
        numbers.push(item);
      } else if (typeof item === "string" && item.length === 1) {
        alphabets.push(item);
        if (item === item.toLowerCase() && (!highestLowerCase || item > highestLowerCase)) {
          highestLowerCase = item;
        }
      }
    });

    const response = {
      is_success: true,
      user_id: "barun81",
      email: "bg2601@srmist.edu.in",
      roll_number: "RA2111026050060",
      numbers: numbers,
      alphabets: alphabets,
      highest_lowercase_alphabet: highestLowerCase ? [highestLowerCase] : [],
      file_valid: fileValid,
      file_mime_type: fileType,
      file_size_kb: fileSizeKb
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid input or request failed" });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
