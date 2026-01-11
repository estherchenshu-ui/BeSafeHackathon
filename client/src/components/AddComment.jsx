// import { useState } from 'react';
// import PropTypes from 'prop-types';

// function AddComment({ setComments }) {
//   const [username, setUsername] = useState('');
//   const [text, setText] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const newComment = {
//       username: username.trim(),
//       text,
//       createdAt: new Date().toISOString(),
//       sentiment: 'neutral',
//       impact: 0,
//     };

//     setComments((prev) => [newComment, ...prev]); // חדש למעלה

//     setUsername('');
//     setText('');
//   };

//   return (
//     <div className="add-comment-box">
//       <h2>הוספת תגובה חדשה</h2>

//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>שם משתמש:</label>
//           <input
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="לדוגמה: dana_cohen"
//             required
//           />
//         </div>

//         <div>
//           <label>תוכן התגובה:</label>
//           <textarea
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             placeholder="כתבי תגובה כאן..."
//             required
//           />
//         </div>

//         <button type="submit">שלח תגובה</button>
//       </form>
//     </div>
//   );
// }

// AddComment.propTypes = {
//   setComments: PropTypes.func.isRequired,
// };

// export default AddComment;
// client/src/components/AddComment.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../utils/axiosInstance'; // ודאי שהנתיב נכון

function AddComment({ onCommentAdded }) { // שינינו את הפרופ ל-onCommentAdded
  const [username, setUsername] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // שליחה לשרת - השרת כבר יבצע את הניתוח (AI) ויחשב ניקוד
      await axiosInstance.post('/analyze', {
        username: username.trim(),
        text
      });

      // איפוס הטופס
      setUsername('');
      setText('');
      
      // בקשה לרענון הנתונים במסך הראשי
      if (onCommentAdded) {
        onCommentAdded();
      }
      
      // סגירת המודל תתבצע בקומפוננטת האב אם צריך, או שנשאיר פתוח להודעה הבאה
      
    } catch (error) {
      console.error("Error adding comment:", error);
      alert('שגיאה בשליחת התגובה');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-comment-box">
      <h2>הוספת תגובה חדשה</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>שם משתמש:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="לדוגמה: dana_cohen"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label>תוכן התגובה:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="כתבי תגובה כאן..."
            required
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'שולח ומנתח...' : 'שלח תגובה'}
        </button>
      </form>
    </div>
  );
}

AddComment.propTypes = {
  onCommentAdded: PropTypes.func.isRequired, // הפונקציה שמרעננת את הפיד
};

export default AddComment;