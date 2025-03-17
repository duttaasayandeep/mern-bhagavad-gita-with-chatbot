// frontend/src/components/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function extractVideoId(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v') || url;
  } catch (error) {
    return url; // fallback if URL parsing fails
  }
}

const Home = ({ user }) => {
  const [homeContent, setHomeContent] = useState({
    youtubeUrl: '',
    description: '',
  });

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const { data } = await axios.get('/api/content');
        if (data && data.home) {
          setHomeContent(data.home);
        }
      } catch (error) {
        console.error('Error fetching home content:', error.message);
      }
    };
    fetchHomeContent();
  }, []);

  return (
    <div className="home">
      <h1 className="home-title">Bhagavad Gita, The Song of God</h1>
      <p>
        {homeContent.description ||
          'Brief introduction on Bhagavad Gita scriptures... (Example text)'}
      </p>

      {/* Home video section */}
      <div className="video-container">
        {homeContent.youtubeUrl ? (
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${extractVideoId(homeContent.youtubeUrl)}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/your_video_id"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>

      {user && <p>Welcome back, {user.name}!</p>}

      {/* Teachings Section */}
      <div className="teachings-section">
        <h2 className="teachings-title">Teachings of the Bhagavad Gita</h2>
        <div className="teachings-cards">
          <div className="teachings-card">
            <h3>Impacts Brahma Vidya</h3>
            <p>
              Unable to deal with the immediate problem at hand, Arjun approached
              Shri Krishna for a palliative to overcome the anguish he was experiencing.
              Shri Krishna did not just offer any immediate palliative solution, but
              diagnosed a grave deficiency in Arjun’s knowledge. By removing this deficiency,
              through the discourse of the Bhagavad Gita, he was able to impart Brahma Vidya,
              the science of God-realization.
            </p>
          </div>
          <div className="teachings-card">
            <h3>Teaches the Practice of Yog</h3>
            <p>
              The Bhagavad Gita is not content with providing a lofty philosophical understanding;
              it also bestows clear-cut techniques for implementing its propositions of spiritual
              development. These techniques of applying the science of spirituality in our lives
              are termed “Yog.” Hence, the Bhagavad Gita is also called “Yog Shastra,” meaning a
              scripture that teaches the practice of Yog.
            </p>
          </div>
          <div className="teachings-card">
            <h3>Encompasses All Aspects of Life</h3>
            <p>
              Spirituality impersonal practitioners often separate spirituality from temporal life,
              some look on beatitude as something to be attained in the hereafter. But the Bhagavad
              Gita makes no such distinction, and aims at the conclusion of every aspect of man’s
              life in this world. Thus, all its eighteen chapters are designated as different types
              of “Yog” since they hold techniques for the application of spiritual knowledge to
              practical life.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
