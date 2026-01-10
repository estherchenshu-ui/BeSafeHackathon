import PropTypes from 'prop-types';
import './UserSummaryCard.css';

function UserSummaryCard({ username, avatar, todayCount, positivePercent, negativePercent }) {
  return (
    <div className="user-summary-card">
      <div className="user-header">
        <img src={avatar} alt={username} className="avatar" />
        <div className="user-info">
          <div className="name">{username}</div>
          <div className="handle">@{username}</div>
        </div>
      </div>

      <div className="user-stats">
        <div className="stat-box">
          <div className="stat-value">{negativePercent}%</div>
          <div className="stat-label">שליליות</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{positivePercent}%</div>
          <div className="stat-label">חיוביות</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{todayCount}</div>
          <div className="stat-label">תגובות היום</div>
        </div>
      </div>
    </div>
  );
}

UserSummaryCard.propTypes = {
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  todayCount: PropTypes.number.isRequired,
  positivePercent: PropTypes.number.isRequired,
  negativePercent: PropTypes.number.isRequired,
};

export default UserSummaryCard;
