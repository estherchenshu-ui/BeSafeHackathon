import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axiosInstance from './utils/axiosInstance';

import Navbar from './components/Navbar.jsx';
import LiveFeed from './components/LiveFeed.jsx';
import History from './components/History.jsx';
import ExportReport from './components/ExportReport.jsx'; // 👈 חדש

function App() {
  const [comments, setComments] = useState([
    {
      _id: 'default1',
      username: 'System',
      text: 'מערכת: טוען נתונים...',
      createdAt: new Date().toISOString(),
      sentiment: 'neutral',
      score: 50,
      impact: 0,
    }
  ]);

  const [stats, setStats] = useState({
    healthScore: 100,
    breakdown: { positive: 0, negative: 0, neutral: 0 },
    today: 0,
    trendData: []
  });

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [historyRes, statsRes] = await Promise.all([
        axiosInstance.get('/history'),
        axiosInstance.get('/stats')
      ]);

      if (historyRes.data && historyRes.data.length > 0) {
        setComments(historyRes.data);
      }

      if (statsRes.data) {
        setStats(statsRes.data);
      }

    } catch (error) {
      console.error("⚠️ שגיאה בטעינת נתונים:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />

      {loading ? (
        <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
          טוען נתונים...
        </div>
      ) : (
        <Routes>
          {/* Live Feed */}
          <Route
            path="/"
            element={
              <LiveFeed
                comments={comments}
                stats={stats}
                refreshData={fetchData}
              />
            }
          />

          {/* History */}
          <Route
            path="/history"
            element={<History comments={comments} />}
          />

          {/* Export Report */}
          <Route
            path="/export-report"
            element={
              <ExportReport
                comments={comments}
                stats={stats}
              />
            }
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
