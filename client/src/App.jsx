import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import LiveFeed from './components/LiveFeed.jsx';

function App() {
  const [comments, setComments] = useState([
  { from: 'נועה', to: 'דנה', text: 'זה נראה לי חשוד', createdAt: new Date().toISOString() },
  { from: 'דנה', to: 'מאיה', text: 'לא בטוחה שזה אמין', createdAt: new Date().toISOString() },
  { from: 'מאיה', to: 'נועה', text: 'ראיתי את זה גם בטיקטוק', createdAt: new Date().toISOString() },
]);


  return (
    <div>
      <Navbar />
      <LiveFeed comments={comments} setComments={setComments} />
    </div>
  );
}

export default App;