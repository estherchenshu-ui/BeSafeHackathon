// import { useState } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import Navbar from './components/Navbar.jsx';
// import LiveFeed from './components/LiveFeed.jsx';
// import History from './components/History.jsx';

// function App() {
//   const [comments, setComments] = useState([
//     {
//       username: 'dana_cohen',
//       text: 'זה נראה לי חשוד',
//       createdAt: new Date().toISOString(),
//       sentiment: 'negative',
//       impact: -10,
//     },
//     {
//       username: 'shira_levi',
//       text: 'לא בטוחה שזה אמין',
//       createdAt: new Date().toISOString(),
//       sentiment: 'neutral',
//       impact: 0,
//     },
//     {
//       username: 'maya_katz',
//       text: 'ראיתי את זה גם בטיקטוק',
//       createdAt: new Date().toISOString(),
//       sentiment: 'positive',
//       impact: 5,
//     },
//   ]);

//   return (
//     <BrowserRouter>
//       <Navbar />

//       <Routes>
//         <Route
//           path="/"
//           element={<LiveFeed comments={comments} setComments={setComments} />}
//         />

//         <Route
//           path="/history"
//           element={<History comments={comments} />}
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axiosInstance from './utils/axiosInstance';

import Navbar from './components/Navbar.jsx';
import LiveFeed from './components/LiveFeed.jsx';
import History from './components/History.jsx';

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
    trendData: [] // הוספנו את זה כדי שלא יקרוס בהתחלה
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
    fetchData(); // קריאה ראשונה מיד

    // --- התיקון: רענון אוטומטי כל 5 שניות ---
    const interval = setInterval(() => {
        fetchData();
    }, 5000);

    return () => clearInterval(interval); // ניקוי ביציאה
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

          <Route
            path="/history"
            element={<History comments={comments} />}
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;