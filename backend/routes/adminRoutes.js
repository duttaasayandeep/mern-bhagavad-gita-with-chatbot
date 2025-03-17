// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getContent,
  updateHomeContent,
  addBenefitsVideo,
  editBenefitsVideo,
  deleteBenefitsVideo,
} = require('../controllers/adminController');

router.get('/content', protect, admin, getContent);
router.put('/content/home', protect, admin, updateHomeContent);
router.post('/content/benefits/video', protect, admin, addBenefitsVideo);
router.put('/content/benefits/video/:videoId', protect, admin, editBenefitsVideo);
router.delete('/content/benefits/video/:videoId', protect, admin, deleteBenefitsVideo);

module.exports = router;
