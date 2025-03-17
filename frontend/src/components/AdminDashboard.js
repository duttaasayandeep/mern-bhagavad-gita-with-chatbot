// frontend/src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [homeContent, setHomeContent] = useState({ youtubeUrl: '', description: '' });
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({ youtubeUrl: '', problemTitle: '', solutionDescription: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchContent();
  }, [token]);

  const fetchContent = async () => {
    try {
      const { data } = await axios.get('/api/content');
      if (data) {
        setHomeContent(data.home || {});
        setVideos((data.benefits && data.benefits.videos) || []);
      }
    } catch (error) {
      console.error('Error fetching content:', error.response ? error.response.data.message : error.message);
    }
  };

  const updateHome = async () => {
    try {
      const { data } = await axios.put(
        '/api/admin/content/home',
        homeContent,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHomeContent(data.home);
      alert('Home content updated!');
    } catch (error) {
      console.error('Error updating home content:', error.response ? error.response.data.message : error.message);
    }
  };

  const addVideo = async () => {
    if (videos.length >= 10) {
      alert('Maximum of 10 videos allowed');
      return;
    }
    try {
      // Ensure youtubeUrl is explicitly set to an empty string if not provided
      const videoData = {
        youtubeUrl: newVideo.youtubeUrl ? newVideo.youtubeUrl : "",
        problemTitle: newVideo.problemTitle,
        solutionDescription: newVideo.solutionDescription
      };
      const { data } = await axios.post(
        '/api/admin/content/benefits/video',
        videoData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVideos(data);
      setNewVideo({ youtubeUrl: '', problemTitle: '', solutionDescription: '' });
      alert('Video added!');
    } catch (error) {
      console.error('Error adding video:', error.response ? error.response.data.message : error.message);
    }
  };

  const editVideo = async (videoId, updatedVideo) => {
    try {
      const videoData = {
        youtubeUrl: updatedVideo.youtubeUrl ? updatedVideo.youtubeUrl : "",
        problemTitle: updatedVideo.problemTitle,
        solutionDescription: updatedVideo.solutionDescription
      };
      const { data } = await axios.put(
        `/api/admin/content/benefits/video/${videoId}`,
        videoData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVideos(videos.map(video => video._id === videoId ? data : video));
      alert('Video updated!');
    } catch (error) {
      console.error('Error editing video:', error.response ? error.response.data.message : error.message);
    }
  };

  const deleteVideo = async (videoId) => {
    try {
      await axios.delete(
        `/api/admin/content/benefits/video/${videoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVideos(videos.filter(video => video._id !== videoId));
      alert('Video deleted!');
    } catch (error) {
      console.error('Error deleting video:', error.response ? error.response.data.message : error.message);
    }
  };

  // For inline editing
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editingData, setEditingData] = useState({ youtubeUrl: '', problemTitle: '', solutionDescription: '' });

  const startEditing = (video) => {
    setEditingVideoId(video._id);
    setEditingData({ 
      youtubeUrl: video.youtubeUrl, 
      problemTitle: video.problemTitle, 
      solutionDescription: video.solutionDescription 
    });
  };

  const cancelEditing = () => {
    setEditingVideoId(null);
    setEditingData({ youtubeUrl: '', problemTitle: '', solutionDescription: '' });
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="admin-section">
        <h3>Home Content</h3>
        <input
          type="text"
          placeholder="YouTube URL"
          value={homeContent.youtubeUrl}
          onChange={(e) => setHomeContent({ ...homeContent, youtubeUrl: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={homeContent.description}
          onChange={(e) => setHomeContent({ ...homeContent, description: e.target.value })}
        ></textarea>
        <button className="btn" onClick={updateHome}>Update Home Content</button>
      </div>
      <hr />
      <div className="admin-section">
        <h3>Benefits Videos</h3>
        <div className="add-video">
          <h4>Add New Video (Optional)</h4>
          <input
            type="text"
            placeholder="YouTube URL (Optional)"
            value={newVideo.youtubeUrl}
            onChange={(e) => setNewVideo({ ...newVideo, youtubeUrl: e.target.value })}
          />
          <input
            type="text"
            placeholder="Problem Statement Title"
            value={newVideo.problemTitle}
            onChange={(e) => setNewVideo({ ...newVideo, problemTitle: e.target.value })}
          />
          <textarea
            placeholder="Solution Description"
            value={newVideo.solutionDescription}
            onChange={(e) => setNewVideo({ ...newVideo, solutionDescription: e.target.value })}
          ></textarea>
          <button className="btn" onClick={addVideo}>Add Video</button>
        </div>
        <div className="existing-videos">
          <h4>Existing Videos</h4>
          {videos.length === 0 ? (
            <p>No videos available</p>
          ) : (
            videos.map((video) => (
              <div key={video._id} className="video-card">
                {editingVideoId === video._id ? (
                  <>
                    <input
                      type="text"
                      value={editingData.youtubeUrl}
                      onChange={(e) => setEditingData({ ...editingData, youtubeUrl: e.target.value })}
                      placeholder="YouTube URL (Optional)"
                    />
                    <input
                      type="text"
                      value={editingData.problemTitle}
                      onChange={(e) => setEditingData({ ...editingData, problemTitle: e.target.value })}
                      placeholder="Problem Statement Title"
                    />
                    <textarea
                      value={editingData.solutionDescription}
                      onChange={(e) => setEditingData({ ...editingData, solutionDescription: e.target.value })}
                      placeholder="Solution Description"
                    ></textarea>
                    <button className="btn" onClick={() => { editVideo(video._id, editingData); setEditingVideoId(null); }}>Save</button>
                    <button className="btn cancel" onClick={cancelEditing}>Cancel</button>
                  </>
                ) : (
                  <>
                    <p><strong>YouTube URL:</strong> {video.youtubeUrl || 'N/A'}</p>
                    <p><strong>Problem Title:</strong> {video.problemTitle}</p>
                    <p><strong>Solution Description:</strong> {video.solutionDescription}</p>
                    <button className="btn" onClick={() => startEditing(video)}>Edit</button>
                    <button className="btn delete" onClick={() => deleteVideo(video._id)}>Delete</button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
