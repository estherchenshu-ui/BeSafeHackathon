import styles from './CommentCard.module.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const CommentCard = ({ comment }) => {
  const sentimentClass = styles[comment.sentiment] || '';
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const calculateTimeAgo = () => {
      if (!comment.createdAt) return 'עכשיו';

      const now = new Date();
      const created = new Date(comment.createdAt);
      const diffInSeconds = Math.floor((now - created) / 1000);

      if (diffInSeconds < 60) return 'עכשיו';
      if (diffInSeconds < 3600) return `לפני ${Math.floor(diffInSeconds / 60)} דקות`;
      if (diffInSeconds < 86400) return `לפני ${Math.floor(diffInSeconds / 3600)} שעות`;
      return `לפני ${Math.floor(diffInSeconds / 86400)} ימים`;
    };

    setTimeAgo(calculateTimeAgo());

    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo());
    }, 1000); // כל שנייה – כדי שתראי שזה חי

    return () => clearInterval(interval);
  }, [comment.createdAt]);

  return (
    <div className={`${styles.commentCard} ${sentimentClass}`}>
      <div className={styles.cardHeader}>
        <div className={styles.leftSection}>
          <div className={styles.avatar}>
            {comment.username ? comment.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.username}>{comment.username}</span>
            <span className={styles.time}>{timeAgo}</span>
          </div>
        </div>

        <div className={`${styles.badge} ${sentimentClass}`}>
          {comment.sentiment === 'positive'
            ? '💚 חיובי'
            : comment.sentiment === 'negative'
            ? '⚠️ פוגעני'
            : '💬 ניטרלי'}
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.commentText}>{comment.text}</p>

        <div className={styles.footer}>
          <span className={styles.heartIcon}></span>
          <div className={styles.impactRow}>
            {comment.impact > 0 ? (
              <span className={styles.posImpact}>
                הציון עלה ב-{comment.impact} נקודות 📈
              </span>
            ) : comment.impact < 0 ? (
              <span className={styles.negImpact}>
                הציון ירד ב-{Math.abs(comment.impact)} נקודות 📉
              </span>
            ) : (
              <span className={styles.neutImpact}>ללא שינוי בציון ↔️</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

CommentCard.propTypes = {
  comment: PropTypes.shape({
    username: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    sentiment: PropTypes.oneOf(['positive', 'negative', 'neutral']),
    createdAt: PropTypes.string,
    impact: PropTypes.number,
  }).isRequired,
};

export default CommentCard;
