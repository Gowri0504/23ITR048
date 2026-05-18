import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Send, RefreshCcw } from 'lucide-react';
import { Log } from './utils/logger';
import './App.css';

interface Notification {
  id: number;
  type: string;
  message: string;
  status: string;
  timestamp: string;
}

const API_URL = 'http://localhost:5000/api';

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [type, setType] = useState('Email');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    await Log('frontend', 'info', 'api', 'Fetching notifications from backend');
    try {
      const response = await axios.get(`${API_URL}/notifications`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    try {
      await Log('frontend', 'info', 'api', `Sending new ${type} notification`);
      await axios.post(`${API_URL}/notifications`, { type, message });
      setMessage('');
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1><Bell /> Notification System</h1>
      </header>

      <main className="App-main">
        <section className="form-section">
          <h2>Send New Notification</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Channel</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
                <option value="Push">Push Notification</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message here..."
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              <Send size={18} /> Send Notification
            </button>
          </form>
        </section>

        <section className="list-section">
          <div className="list-header">
            <h2>Recent Notifications</h2>
            <button onClick={fetchNotifications} className="refresh-btn">
              <RefreshCcw size={18} /> Refresh
            </button>
          </div>
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="notification-list">
              {notifications.length === 0 ? (
                <p>No notifications yet.</p>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="notification-card">
                    <div className="notif-type">{notif.type}</div>
                    <div className="notif-message">{notif.message}</div>
                    <div className="notif-footer">
                      <span className={`status ${notif.status.toLowerCase()}`}>{notif.status}</span>
                      <span className="timestamp">{new Date(notif.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
