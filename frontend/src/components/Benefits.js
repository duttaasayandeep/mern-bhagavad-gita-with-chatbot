// frontend/src/components/Benefits.js
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

const Benefits = () => {
  const [videos, setVideos] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Function to fetch benefits content from backend
  const fetchContent = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/content`);
      if (data && data.benefits && data.benefits.videos) {
        setVideos(data.benefits.videos);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error(
        'Error fetching benefits content:',
        error.response ? error.response.data.message : error.message
      );
    }
  };

  // Fetch benefits content on component mount
  useEffect(() => {
    fetchContent();
  }, [API_URL]);

  return (
    <div className="benefits">
      <h2>Benefits of Gita</h2>
      {/* Refresh Button to manually fetch updated content */}
      <button onClick={fetchContent} className="btn refresh-btn">
        Refresh Benefits
      </button>
      {videos.length === 0 ? (
        <p>No videos available.</p>
      ) : (
        videos.map((video) => (
          <div key={video._id} className="benefit-video">
            {video.youtubeUrl && video.youtubeUrl.trim() !== "" && (
              <div className="video-container">
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${extractVideoId(
                    video.youtubeUrl
                  )}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            <div className="solution-container">
              <h3>{video.problemTitle}</h3>
              <p>{video.solutionDescription}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Benefits;
