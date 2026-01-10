import { useState } from 'react';
import CommentCard from './CommentCard/CommentCard';
import TrendChart from './TrendChart';
import AddComment from './AddComment';
import UserSummaryCard from './UserSummaryCard';
import ScoreCircle from './ScoreCircle'; // 🔹 חדש – במקום ScoreBox
import PropTypes from 'prop-types';

function LiveFeed({ comments, setComments }) {
  const [showModal, setShowModal] = useState(false);

  const safeComments = comments || [];

  const suspiciousCount = safeComments.filter(
    (c) => c.text.includes('חשוד') || c.text.includes('לא בטוחה')
  ).length;

  const score = 100 - suspiciousCount * 20;

  const positiveCount = safeComments.filter((c) => c.sentiment === 'positive').length;
  const negativeCount = safeComments.filter((c) => c.sentiment === 'negative').length;
  const neutralCount = safeComments.filter(
    (c) => !c.sentiment || c.sentiment === 'neutral'
  ).length;

  return (
    <div className="live-feed-container">
      {/* Header */}
      <div className="live-feed-header">
        <h1>Live Feed</h1>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          ➕ הוספת תגובה
        </button>
      </div>

      <div className="live-feed-layout">

        {/* צד שמאל – כרטיס משתמש, ציון עגול, גרף */}
        <div className="score-section">

          <UserSummaryCard
            username="sarah_dance"
            avatar="https://i.pravatar.cc/150?img=47"
            todayCount={25}
            positivePercent={48}
            negativePercent={20}
          />

          {/* 🔹 כאן מחובר הקומפוננטה החדשה */}
          <ScoreCircle score={score} />

          <TrendChart />
        </div>

        {/* אזור הפיד המרכזי */}
        <div className="feed-center">

          {/* שורת סיכום מעל התגובות */}
          <div className="comments-summary-row">
            <div className="summary-item positive">
              <span className="icon">✔</span>
              <span>חיוביות {positiveCount}</span>
            </div>
            <div className="summary-item negative">
              <span className="icon">✖</span>
              <span>שליליות {negativeCount}</span>
            </div>
            <div className="summary-item neutral">
              <span className="icon">●</span>
              <span>ניטרליות {neutralCount}</span>
            </div>
          </div>

          {/* רשימת תגובות */}
          <div className="comments-section">
            {safeComments.map((comment, index) => (
              <CommentCard key={index} comment={comment} />
            ))}
          </div>
        </div>
      </div>

      {/* מודאל */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <AddComment setComments={setComments} />
            <button className="close-btn" onClick={() => setShowModal(false)}>
              סגור
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

LiveFeed.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      sentiment: PropTypes.oneOf(['positive', 'negative', 'neutral']),
      createdAt: PropTypes.string.isRequired,
      impact: PropTypes.number,
    })
  ).isRequired,
  setComments: PropTypes.func.isRequired,
};

export default LiveFeed;
