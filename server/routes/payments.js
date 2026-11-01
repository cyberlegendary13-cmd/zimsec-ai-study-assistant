const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { UPLOAD_DIR } = require('../config');
const { saveDocument } = require('../services/docStore');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${uuidv4()}-${safeName}`);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const record = {
      id: uuidv4(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      createdAt: new Date().toISOString()
    };

    await saveDocument(record);

    res.json({
      success: true,
      message: 'File uploaded and saved successfully',
      file: record
    });
  } catch (error) {
    console.error('Upload error', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

module.exports = router;
