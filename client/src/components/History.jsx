import { useState } from 'react';
import PropTypes from 'prop-types';
import CommentCard from './CommentCard/CommentCard';

const History = ({ comments }) => {
  const [filter, setFilter] = useState('all');

  const now = new Date();

  const filteredComments = comments.filter((comment) => {
    if (!comment.createdAt) return false;

    if (filter === 'all') return true;

    const created = new Date(comment.createdAt);
    const diffInHours = Math.abs(now - created) / (1000 * 60 * 60);

    if (filter === '1h') return diffInHours <= 1;
    if (filter === '6h') return diffInHours <= 6;
    if (filter === '24h') return diffInHours <= 24;

    return true;
  });

  return (
    <div className="live-feed-container">

      {/* כותרת */}
      <div className="live-feed-title">History</div>

      {/* פילטרים */}
      <div className="history-filters">
        <button
          className={`history-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          הכל
        </button>

        <button
          className={`history-filter-btn ${filter === '1h' ? 'active' : ''}`}
          onClick={() => setFilter('1h')}
        >
          שעה אחרונה
        </button>

        <button
          className={`history-filter-btn ${filter === '6h' ? 'active' : ''}`}
          onClick={() => setFilter('6h')}
        >
          6 שעות
        </button>

        <button
          className={`history-filter-btn ${filter === '24h' ? 'active' : ''}`}
          onClick={() => setFilter('24h')}
        >
          24 שעות
        </button>
      </div>

      {/* תוכן */}
      <div className="comments-section">
        {filteredComments.length === 0 ? (
          <p className="no-comments-text">אין תגובות בטווח הזמן הזה</p>
        ) : (
          filteredComments.map((comment, index) => (
            <CommentCard
              key={index}
              comment={{
                username: comment.username || comment.from,
                text: comment.text,
                sentiment: comment.sentiment || 'neutral',
                createdAt: comment.createdAt,
                score: comment.score !== undefined ? comment.score : (comment.impact || 0),
                impact: comment.impact
              }}
            />
          ))
        )}
      </div>

    </div>
  );
};

History.propTypes = {
  comments: PropTypes.array.isRequired,
};

export default History;
