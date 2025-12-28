import styles from './CommentCard.module.css';

const CommentCard = () => {
  return (
    // משתמשים ב-styles כדי לגשת למחלקות ב-CSS
    // שימי לב: בגלל שהשמות ב-CSS הם עם מקף, משתמשים בסוגריים מרובעים
    <div className={`${styles['comment-card']} ${styles.negative}`}>
      
      {/* קומה 1: ראש הכרטיס */}
      <div className={styles['card-header']}>
        <div className={styles['user-group']}>
          <div className={styles.avatar}>ת</div>
          <div className={styles['user-text']}>
            <span className={styles.username}>@troll_99</span>
            <span className={styles.time}>לפני 5 דק'</span>
          </div>
        </div>
        <div className={styles.impact}>-5 נק'</div>
      </div>

      {/* קומה 2: הטקסט */}
      <div className={styles['comment-text']}>
        לדעתי הסרטון הזה ממש גרוע ומביך.
      </div>

      {/* קומה 3: תחתית */}
      <div className={styles['card-footer']}>
        <span className={styles['sentiment-badge']}>⚠️ פוגעני</span>
        
        <div className={styles.actions}>
          <button>מחק</button>
          <button>חסום</button>
        </div>
      </div>

    </div>
  );
};

export default CommentCard;