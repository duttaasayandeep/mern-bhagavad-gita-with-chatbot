// backend/routes/contentRoutes.js
const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

router.get('/', async (req, res) => {
  try {
    const content = await Content.findOne({});
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
