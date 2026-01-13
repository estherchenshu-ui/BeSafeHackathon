import { useState } from 'react';
import PropTypes from 'prop-types';
import CommentCard from './CommentCard/CommentCard';
import TrendChart from './TrendChart';
import AddComment from './AddComment';
import UserSummaryCard from './UserSummaryCard';
import ScoreCircle from './ScoreCircle';

function LiveFeed({ stats, refreshData }) {
  const [showModal, setShowModal] = useState(false);

  // חילוץ נתונים מתוך ה-stats שמגיע מהפרופס
  const safeComments = stats?.liveComments || [];
  const currentScore = stats?.healthScore ?? 100;

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
      <div className="page-title-row">
        <h1 className="live-feed-title">Live Feed</h1>
      </div>

      <div className="live-feed-layout-fixed">
        <div className="feed-center">
          <div className="add-comment-top">
            <button className="add-btn" onClick={() => setShowModal(true)}>
              ➕ הוספת תגובה
            </button>
          </div>

          <div className="comments-summary-row">
            <div className="summary-item positive">✔ חיוביות {positiveCount}</div>
            <div className="summary-item negative">✖ שליליות {negativeCount}</div>
            <div className="summary-item neutral">● ניטרליות {neutralCount}</div>
          </div>

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

        <div className="right-panel">
          {/* הציון שמתעדכן מהשרת */}
          <ScoreCircle score={currentScore} />

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