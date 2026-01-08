import { useState } from 'react';
import CommentCard from './CommentCard/CommentCard';
import ScoreBox from './ScoreBox';
import AddComment from './AddComment';
import PropTypes from 'prop-types';

function LiveFeed({ comments, setComments }) {
  const [showModal, setShowModal] = useState(false);

  const safeComments = comments || [];

  const suspiciousCount = safeComments.filter(c =>
    c.text.includes('חשוד') || c.text.includes('לא בטוחה')
  ).length;

  const score = 100 - suspiciousCount * 20;

  const positiveCount = safeComments.filter(c => c.sentiment === 'positive').length;
  const negativeCount = safeComments.filter(c => c.sentiment === 'negative').length;
  const neutralCount  = safeComments.filter(c => !c.sentiment || c.sentiment === 'neutral').length;

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

        {/* Score בצד שמאל */}
        <div className="score-section">
          <ScoreBox score={score} />
        </div>

        {/* אזור הפיד המרכזי */}
        <div className="feed-center">

          {/* סרגל סנטימנטים */}
          <div className="sentiment-bar">
            <span className="positive">✔ חיוביות {positiveCount}</span>
            <span className="negative">✖ שליליות {negativeCount}</span>
            <span className="neutral">● ניטרליות {neutralCount}</span>
          </div>

          {/* רשימת תגובות */}
          <div className="comments-section">
            {safeComments.map((comment, index) => (
              <CommentCard
                key={index}
                comment={{
                  username: comment.from,
                  text: comment.text,
                  sentiment: comment.sentiment || 'neutral',
                  createdAt: comment.createdAt,
                  impact: comment.impact || 0,
                }}
              />
            ))}
          </div>

        </div>
      </div>

      {/* מודאל */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <AddComment setComments={setComments} />
            <button className="close-btn" onClick={() => setShowModal(false)}>סגור</button>
          </div>
        </div>
      )}
    </div>
  );
}

LiveFeed.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  setComments: PropTypes.func.isRequired,
};

export default LiveFeed;
