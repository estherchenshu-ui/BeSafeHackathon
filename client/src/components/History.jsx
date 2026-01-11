// import { useState } from 'react';
// import PropTypes from 'prop-types';
// import CommentCard from './CommentCard/CommentCard';

// const History = ({ comments }) => {
//   const [filter, setFilter] = useState('1h');

//   const now = new Date();

//   const filteredComments = comments.filter((comment) => {
//     if (!comment.createdAt) return false;

//     const created = new Date(comment.createdAt);
//     const diffInHours = (now - created) / (1000 * 60 * 60);

//     if (filter === '1h') return diffInHours <= 1;
//     if (filter === '6h') return diffInHours <= 6;
//     if (filter === '24h') return diffInHours <= 24;

//     return true;
//   });

//   return (
//     <div style={{ padding: '30px' }}>
//       <h1>History</h1>

//       {/* טאבים */}
//       <div className="history-tabs">
//         <button
//           className={filter === '1h' ? 'tab active' : 'tab'}
//           onClick={() => setFilter('1h')}
//         >
//           שעה אחרונה
//         </button>

//         <button
//           className={filter === '6h' ? 'tab active' : 'tab'}
//           onClick={() => setFilter('6h')}
//         >
//           6 שעות
//         </button>

//         <button
//           className={filter === '24h' ? 'tab active' : 'tab'}
//           onClick={() => setFilter('24h')}
//         >
//           24 שעות
//         </button>
//       </div>

//       {filteredComments.length === 0 && (
//         <p>אין תגובות בטווח הזמן הזה</p>
//       )}

//       {filteredComments.map((comment, index) => (
//         <CommentCard
//           key={index}
//           comment={{
//             username: comment.username || comment.from,
//             text: comment.text,
//             sentiment: comment.sentiment || 'neutral',
//             createdAt: comment.createdAt,
//             impact: comment.impact || 0,
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// History.propTypes = {
//   comments: PropTypes.arrayOf(
//     PropTypes.shape({
//       username: PropTypes.string,
//       from: PropTypes.string,
//       text: PropTypes.string.isRequired,
//       createdAt: PropTypes.string.isRequired,
//       sentiment: PropTypes.oneOf(['positive', 'negative', 'neutral']),
//       impact: PropTypes.number,
//     })
//   ).isRequired,
// };

// export default History;
import { useState } from 'react';
import PropTypes from 'prop-types';
import CommentCard from './CommentCard/CommentCard';

const History = ({ comments }) => {
  // שינינו את ברירת המחדל ל-'all' כדי שתמיד יראו משהו בהתחלה
  const [filter, setFilter] = useState('all');

  const now = new Date();

  const filteredComments = comments.filter((comment) => {
    if (!comment.createdAt) return false;
    
    // אם נבחר 'הכל' - מחזירים הכל
    if (filter === 'all') return true;

    const created = new Date(comment.createdAt);
    // הוספת Math.abs לתיקון בעיות שעון
    const diffInHours = Math.abs(now - created) / (1000 * 60 * 60);

    if (filter === '1h') return diffInHours <= 1;
    if (filter === '6h') return diffInHours <= 6;
    if (filter === '24h') return diffInHours <= 24;

    return true;
  });

  return (
    <div style={{ padding: '30px' }}>
      <h1>History</h1>

      <div className="history-tabs">
        {/* כפתור חדש: הכל */}
        <button
          className={filter === 'all' ? 'tab active' : 'tab'}
          onClick={() => setFilter('all')}
        >
          הכל
        </button>

        <button
          className={filter === '1h' ? 'tab active' : 'tab'}
          onClick={() => setFilter('1h')}
        >
          שעה אחרונה
        </button>

        <button
          className={filter === '6h' ? 'tab active' : 'tab'}
          onClick={() => setFilter('6h')}
        >
          6 שעות
        </button>

        <button
          className={filter === '24h' ? 'tab active' : 'tab'}
          onClick={() => setFilter('24h')}
        >
          24 שעות
        </button>
      </div>

      {filteredComments.length === 0 && (
        <p>אין תגובות בטווח הזמן הזה</p>
      )}

      {filteredComments.map((comment, index) => (
        <CommentCard
          key={index}
          comment={{
            username: comment.username || comment.from,
            text: comment.text,
            sentiment: comment.sentiment || 'neutral',
            createdAt: comment.createdAt,
            // שימוש ב-score אם קיים, אחרת impact
            score: comment.score !== undefined ? comment.score : (comment.impact || 0),
            impact: comment.impact
          }}
        />
      ))}
    </div>
  );
};

History.propTypes = {
  comments: PropTypes.array.isRequired,
};

export default History;