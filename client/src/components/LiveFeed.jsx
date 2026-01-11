import { useState } from 'react';
import PropTypes from 'prop-types';
import CommentCard from './CommentCard/CommentCard';
import TrendChart from './TrendChart';
import AddComment from './AddComment';
import UserSummaryCard from './UserSummaryCard';
import ScoreCircle from './ScoreCircle';

function LiveFeed({ stats, refreshData }) {
  const [showModal, setShowModal] = useState(false);

  const safeComments = stats?.liveComments || [];

  const score = stats?.healthScore ?? 100;

  const positiveCount = stats?.breakdown?.positive || 0;
  const negativeCount = stats?.breakdown?.negative || 0;
  const neutralCount = stats?.breakdown?.neutral || 0;

  const todayCount = stats?.today || 0;
  const posPercent = stats?.percentages?.positive || 0;
  const negPercent = stats?.percentages?.negative || 0;

  const handleCommentAdded = () => {
    refreshData();
    setShowModal(false);
  };

  return (
    <div className="live-feed-container">

      {/* כותרת מתחת ללוגו */}
      <div className="page-title-row">
        <h1 className="live-feed-title">Live Feed</h1>
      </div>

      <div className="live-feed-layout-fixed">

        {/* מרכז – תגובות */}
        <div className="feed-center">

          {/* כפתור הוספת תגובה – מיושר לימין */}
          <div className="add-comment-top">
            <button className="add-btn" onClick={() => setShowModal(true)}>
              ➕ הוספת תגובה
            </button>
          </div>

          {/* שורת סיכום */}
          <div className="comments-summary-row">
            <div className="summary-item positive">✔ חיוביות {positiveCount}</div>
            <div className="summary-item negative">✖ שליליות {negativeCount}</div>
            <div className="summary-item neutral">● ניטרליות {neutralCount}</div>
          </div>

          {/* אזור תגובות */}
          <div className="comments-section">
            {safeComments.length === 0 ? (
              <p className="no-comments-text">אין תגובות חדשות להיום.</p>
            ) : (
              safeComments.map((comment, index) => (
                <CommentCard
                  key={comment._id || index}
                  comment={comment}
                />
              ))
            )}
          </div>
        </div>

        {/* ימין – פאנל */}
        <div className="right-panel">

          <ScoreCircle score={score} />

          <UserSummaryCard
            username="Community View"
            avatar="https://cdn-icons-png.flaticon.com/512/1256/1256661.png"
            todayCount={todayCount}
            positivePercent={posPercent}
            negativePercent={negPercent}
          />

          <TrendChart data={stats?.trendData || []} />

        </div>

      </div>

      {/* מודאל */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <AddComment onCommentAdded={handleCommentAdded} />
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
  refreshData: PropTypes.func.isRequired,
  stats: PropTypes.shape({
    healthScore: PropTypes.number,
    today: PropTypes.number,
    liveComments: PropTypes.array,
    trendData: PropTypes.array,
    breakdown: PropTypes.object,
    percentages: PropTypes.object
  })
};

export default LiveFeed;
