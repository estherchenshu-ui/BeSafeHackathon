import styles from './CommentCard.module.css';

const CommentCard = ({ comment }) => {
  // קביעת סוג הסנטימנט לצורך עיצוב (positive/negative/neutral)
  const sentimentClass = styles[comment.sentiment] || '';

  return (
    <div className={`${styles.commentCard} ${sentimentClass}`}>
      <div className={styles.cardHeader}>
        {/* צד שמאל: אווטר ופרטי משתמש */}
        <div className={styles.leftSection}>
          <div className={styles.avatar}>
            {/* לוגיקה לשליפת האות הראשונה מה-username והפיכתה לאות גדולה */}
            {comment.username ? comment.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.username}>{comment.username}</span>
            <span className={styles.time}>{comment.time || 'עכשיו'}</span>
          </div>
        </div>

        {/* צד ימין: תגית סנטימנט (Badge) */}
        <div className={`${styles.badge} ${sentimentClass}`}>
          {comment.sentiment === 'positive' ? '💚 חיובי' : 
           comment.sentiment === 'negative' ? '⚠️ פוגעני' : '💬 ניטרלי'}
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.commentText}>{comment.text}</p>
        
        <div className={styles.footer}>
          <span className={styles.heartIcon}>❤️</span>
          <div className={styles.impactRow}>
            {comment.impact > 0 ? (
              <span className={styles.posImpact}>הציון עלה ב-{comment.impact} נקודות 📈</span>
            ) : comment.impact < 0 ? (
              <span className={styles.negImpact}>הציון ירד ב-{Math.abs(comment.impact)} נקודות 📉</span>
            ) : (
              <span className={styles.neutImpact}>ללא שינוי בציון ↔️</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;