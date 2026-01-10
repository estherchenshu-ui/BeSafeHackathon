import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import LiveFeed from './components/LiveFeed.jsx';
import History from './components/History.jsx';

function App() {
  const [comments, setComments] = useState([
    {
      username: 'dana_cohen',
      text: 'זה נראה לי חשוד',
      createdAt: new Date().toISOString(),
      sentiment: 'negative',
      impact: -10,
    },
    {
      username: 'shira_levi',
      text: 'לא בטוחה שזה אמין',
      createdAt: new Date().toISOString(),
      sentiment: 'neutral',
      impact: 0,
    },
    {
      username: 'maya_katz',
      text: 'ראיתי את זה גם בטיקטוק',
      createdAt: new Date().toISOString(),
      sentiment: 'positive',
      impact: 5,
    },
  ]);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<LiveFeed comments={comments} setComments={setComments} />}
        />

        <Route
          path="/history"
          element={<History comments={comments} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
