const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");

const router = express.Router();
router.use(express.json()); // for application/json
router.use(express.urlencoded());

const db = admin.firestore();
const upload = multer();
const bucket = admin.storage().bucket();

router.post("/upload", upload.array("files[]"), (req, res) => {
  const files = req.files;
  const fileUrls = [];

  files.forEach((file) => {
    const extension = path.extname(file.originalname);
    const contentType = file.mimetype;

    let name = file.originalname.split(extension)[0];
    const blob = bucket.file(`${name}-${uuidv4()}${extension}`);
    const blobStream = blob.createWriteStream({
      metadata: { contentType },
      resumable: false,
    });

    blobStream.on("error", (err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to upload file." });
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      fileUrls.push(publicUrl);

      if (fileUrls.length === files.length) {
        res.status(200).json({ fileUrls });
      }
    });

    blobStream.end(file.buffer);
  });
});

module.exports = router;
