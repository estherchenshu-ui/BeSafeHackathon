import { useState } from 'react';
import PropTypes from 'prop-types';
import CommentCard from './CommentCard/CommentCard';
import TrendChart from './TrendChart';
import AddComment from './AddComment';
import UserSummaryCard from './UserSummaryCard';
import ScoreCircle from './ScoreCircle';

function LiveFeed({ stats, refreshData }) {
  const [showModal, setShowModal] = useState(false);

  // --- התיקון הקריטי: משתמשים רק בתגובות היום שמגיעות מהבאקנד ---
  const safeComments = stats?.liveComments || [];

  const score = stats ? stats.healthScore : 100;
  
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
      <div className="live-feed-header">
        <h1>Live Feed</h1>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          ➕ הוספת תגובה
        </button>
      </div>

      <div className="live-feed-layout">
        {/* צד שמאל - סטטיסטיקות וגרפים */}
        <div className="score-section">
          <UserSummaryCard
            username="Community View" 
            avatar="https://cdn-icons-png.flaticon.com/512/1256/1256661.png"
            todayCount={todayCount}
            positivePercent={posPercent}
            negativePercent={negPercent}
          />

          <ScoreCircle score={score} />

          {/* הגרף מקבל נתוני מגמה בזמן אמת */}
          <TrendChart data={stats?.trendData || []} />
        </div>

        {/* צד ימין - רשימת תגובות חיה */}
        <div className="feed-center">
          <div className="comments-summary-row">
            <div className="summary-item positive">
              <span className="icon">✔</span> <span>חיוביות {positiveCount}</span>
            </div>
            <div className="summary-item negative">
              <span className="icon">✖</span> <span>שליליות {negativeCount}</span>
            </div>
            <div className="summary-item neutral">
              <span className="icon">●</span> <span>ניטרליות {neutralCount}</span>
            </div>
          </div>

          <div className="comments-section">
            {safeComments.length === 0 ? (
              <p style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
                אין תגובות חדשות להיום.
              </p>
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
      </div>

      {/* מודאל הוספת תגובה */}
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
  // הסרנו את comments המקורי כי אנחנו משתמשים ב-stats.liveComments
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