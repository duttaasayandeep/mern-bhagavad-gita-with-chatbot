// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Benefits from './components/Benefits';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import Chatbot from './components/Chatbot';

function App() {
  const [user, setUser] = useState(null); // store logged in user data
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <Router>
      <div className="App">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        {/* Display chatbot for any logged in user, including admin */}
        {user && (
          <div className="chatbot-container">
            <div className="chatbot-icon" onClick={() => setShowChatbot(!showChatbot)}>
              <img src="../images/chatbot-icon.png" alt="Chatbot" />
            </div>
            {showChatbot && <Chatbot />}
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
