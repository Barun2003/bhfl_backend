import express from "express";
import cors from "cors";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const isValidBase64 = (str) => {
  try {
    Buffer.from(str, "base64").toString("binary");
    return true;
  } catch (err) {
    return false;
  }
};

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.post("/bfhl", upload.single("file_b64"), (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    const file = req.file;

    const fileValid = file && isValidBase64(file.buffer.toString("base64"));
    const fileType = file && file.mimetype;
    const fileSizeKb = file && (file.size / 1024).toFixed(2);

    let numbers = [];
    let alphabets = [];
    let highestLowerCase = null;

    data.data.forEach((item) => {
      if (!isNaN(item)) {
        numbers.push(item);
      } else if (typeof item === "string") {
        alphabets.push(item);
        if (
          item === item.toLowerCase() &&
          (!highestLowerCase || item > highestLowerCase)
        ) {
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

    if (!fileValid) {
      response.file_valid = false;
    }

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(200).json({ wrong: true });
  }
});

app.listen(port, () => {
  console.log("app listening at 3000 | http://localhost:3000");
});