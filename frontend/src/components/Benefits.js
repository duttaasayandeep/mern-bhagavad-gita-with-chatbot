// frontend/src/components/Benefits.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function extractVideoId(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v') || url;
  } catch (error) {
    return url;
  }
}

const Benefits = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/content');
        if (data && data.benefits && data.benefits.videos) {
          setVideos(data.benefits.videos);
        }
      } catch (error) {
        console.error('Error fetching benefits content:', error.message);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="benefits">
      <h2>Benefits of Gita</h2>
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
                  src={`https://www.youtube.com/embed/${extractVideoId(video.youtubeUrl)}`}
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
