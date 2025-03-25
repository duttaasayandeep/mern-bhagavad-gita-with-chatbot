// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contentRoutes = require('./routes/contentRoutes');
const User = require('./models/User');
const Content = require('./models/Content');
dotenv.config();
const cors = require('cors');


// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/content', contentRoutes);

// Create default admin account if it does not exist
const createAdmin = async () => {
  try {
    const adminEmail = 'sayandeepdutta08@gmail.com';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin',
        age: 30,
        email: adminEmail,
        password: 'toor',
        phone: '0000000000',
        role: 'admin',
      });
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
};
createAdmin();

// Create default content if not exists
const createDefaultContent = async () => {
  try {
    let content = await Content.findOne({});
    if (!content) {
      const defaultVideos = [];
      for (let i = 1; i <= 10; i++) {
        defaultVideos.push({
          youtubeUrl: "your_default_video_id", // Replace with an actual default video id if needed
          problemTitle: `Problem Statement ${i}`,
          solutionDescription: `Solution placeholder description for video ${i}`,
          bgImage: `/images/solution${i}.jpg` // NEW: background image path
        });
      }
      content = new Content({
        home: {
          youtubeUrl: "your_home_video_id", // Replace with a default home video id
          description: "Default home description. Please update as needed.",
        },
        benefits: {
          videos: defaultVideos,
        },
      });
      await content.save();
      console.log('Default content created');
    }
  } catch (error) {
    console.error('Error creating default content:', error.message);
  }
};
createDefaultContent();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
