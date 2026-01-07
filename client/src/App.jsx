// import { useState, useEffect } from 'react';
// import './styles/App.module.css'; 

// function App() {
//   const [comments, setComments] = useState([]);

//   useEffect(() => {
//     // הפונקציה שמביאה תגובה מהשרת
//     const fetchComment = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/live-comments');
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const newComment = await response.json();

//         // הוספת התגובה החדשה לרשימה
//         setComments((prevComments) => {
//              // אופציונלי: שומר רק את ה-5 האחרונות כדי שהמסך לא יתפוצץ
//              const updatedList = [...prevComments, newComment];
//              return updatedList.slice(-5); 
//         });
        
//       } catch (error) {
//         console.error("Error fetching comment:", error);
//       }
//     };

//     // הגדרת הטיימר - כל 4000 מילישניות (4 שניות)
//     const intervalId = setInterval(fetchComment, 4000);

//     // ניקוי כשיוצאים מהדף
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <div className="App">
//       <header>
//          {/* כאן הכותרת והלוגו שלך */}
//          <h1>Duck It</h1>
//       </header>

//       <main>
//         <button className="pink-button">Show Random Duck</button>
        
//         {/* אזור התגובות החיות */}
//         <div className="comments-section" style={{ marginTop: '20px', padding: '20px' }}>
//           <h2>Live Comments:</h2>
//           <ul style={{ listStyle: 'none', padding: 0 }}>
//             {comments.map((comment, index) => (
//               <li key={index} style={{ 
//                   backgroundColor: comment.type === 'positive' ? '#d4edda' : '#f8d7da', // ירוק לחיובי, אדום לשלילי
//                   margin: '10px 0', 
//                   padding: '10px', 
//                   borderRadius: '5px',
//                   border: '1px solid #ccc'
//               }}>
//                 {/* שימוש בשמות השדות כפי שמופיעים בקובץ CommentsPull.js שלך */}
//                 <strong>{comment.username}: </strong> {comment.text}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;
import HomePage from "./pages/HomePage/HomePage"
import './styles/global.css'; // שימוש בסטייל הכללי שלך

function App() {
  return (
    <div className="App">
      <HomePage />
    </div>
  );
}

export default App;