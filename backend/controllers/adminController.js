// backend/controllers/adminController.js
const Content = require('../models/Content');

// Get current content (for admin-protected view)
exports.getContent = async (req, res) => {
  try {
    const content = await Content.findOne({});
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Home Content (YouTube URL and description)
exports.updateHomeContent = async (req, res) => {
  const { youtubeUrl, description } = req.body;
  try {
    let content = await Content.findOne({});
    if (!content) {
      content = new Content();
    }
    content.home = { youtubeUrl, description };
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new benefits video (maximum 10 allowed)
exports.addBenefitsVideo = async (req, res) => {
  const { youtubeUrl, problemTitle, solutionDescription } = req.body;
  try {
    let content = await Content.findOne({});
    if (!content) {
      content = new Content({ benefits: { videos: [] } });
    }
    if (!content.benefits) {
      content.benefits = { videos: [] };
    }
    if (!content.benefits.videos) {
      content.benefits.videos = [];
    }
    if (content.benefits.videos.length >= 10) {
      return res.status(400).json({ message: 'Maximum of 10 videos allowed' });
    }
    content.benefits.videos.push({ youtubeUrl, problemTitle, solutionDescription });
    await content.save();
    res.status(201).json(content.benefits.videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit an existing benefits video
exports.editBenefitsVideo = async (req, res) => {
  const { videoId } = req.params;
  const { youtubeUrl, problemTitle, solutionDescription } = req.body;
  try {
    let content = await Content.findOne({});
    if (!content || !content.benefits || !content.benefits.videos) {
      return res.status(404).json({ message: 'Content not found' });
    }
    const video = content.benefits.videos.id(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    video.youtubeUrl = youtubeUrl;
    video.problemTitle = problemTitle;
    video.solutionDescription = solutionDescription;
    await content.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a benefits video using pull()
exports.deleteBenefitsVideo = async (req, res) => {
  const { videoId } = req.params;
  try {
    let content = await Content.findOne({});
    if (!content || !content.benefits || !content.benefits.videos) {
      return res.status(404).json({ message: 'Content not found' });
    }
    // Remove the video from the array
    content.benefits.videos.pull(videoId);
    await content.save();
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
