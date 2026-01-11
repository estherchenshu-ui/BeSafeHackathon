import styles from './CommentCard.module.css';
import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';

const CommentCard = ({ comment }) => {
  const sentimentClass = styles[comment.sentiment] || '';
  const [timeAgo, setTimeAgo] = useState('עכשיו');

  // שימוש ב-score אם קיים, אחרת impact, אחרת 0
  const scoreValue = comment.score !== undefined ? comment.score : (comment.impact || 0);

  const calculateTimeAgo = useCallback(() => {
    if (!comment.createdAt) return 'עכשיו';

    const now = new Date();
    const created = new Date(comment.createdAt);
    const diffInSeconds = Math.floor((now - created) / 1000);

    if (diffInSeconds < 60) return 'עכשיו';
    if (diffInSeconds < 3600) return `לפני ${Math.floor(diffInSeconds / 60)} דקות`;
    if (diffInSeconds < 86400) return `לפני ${Math.floor(diffInSeconds / 3600)} שעות`;
    return `לפני ${Math.floor(diffInSeconds / 86400)} ימים`;
  }, [comment.createdAt]);

  useEffect(() => {
    const updateTime = () => {
      setTimeAgo(calculateTimeAgo());
    };

    updateTime(); 
    const interval = setInterval(updateTime, 1000); 

    return () => clearInterval(interval);
  }, [calculateTimeAgo]);

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
            {/* כאן התיקון: משתמשים ב-scoreValue שחישבנו למעלה */}
            {scoreValue > 0 ? (
              <span className={styles.posImpact}>
                הציון עלה ב-{Math.round(scoreValue)} נקודות 📈
              </span>
            ) : scoreValue < 0 ? (
              <span className={styles.negImpact}>
                הציון ירד ב-{Math.abs(scoreValue)} נקודות 📉
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
    username: PropTypes.string,
    text: PropTypes.string.isRequired,
    sentiment: PropTypes.string,
    createdAt: PropTypes.string,
    impact: PropTypes.number,
    score: PropTypes.number, // הוספנו גם את זה
  }).isRequired,
};

export default CommentCard;