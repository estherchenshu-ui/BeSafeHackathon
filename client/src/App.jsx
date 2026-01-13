import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axiosInstance from './utils/axiosInstance';

import Navbar from './components/Navbar.jsx';
import LiveFeed from './components/LiveFeed.jsx';
import History from './components/History.jsx';
import ExportReport from './components/ExportReport.jsx';

function App() {
  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState({
    healthScore: 100,
    breakdown: { positive: 0, negative: 0, neutral: 0 },
    today: 0,
    trendData: [],
    liveComments: [],
    percentages: { positive: 0, negative: 0 }
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [historyRes, statsRes] = await Promise.all([
        axiosInstance.get('/history'),
        axiosInstance.get('/stats')
      ]);

      if (historyRes.data) setComments(historyRes.data);
      if (statsRes.data) setStats(statsRes.data);
    } catch (error) {
      console.error("⚠️ Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      {loading ? (
        <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>טוען נתונים...</div>
      ) : (
        <Routes>
          <Route path="/" element={<LiveFeed stats={stats} refreshData={fetchData} />} />
          <Route path="/history" element={<History comments={comments} />} />
          <Route path="/export-report" element={<ExportReport comments={comments} />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;