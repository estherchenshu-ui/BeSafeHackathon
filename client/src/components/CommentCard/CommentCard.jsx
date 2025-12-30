import PropTypes from 'prop-types';
import styles from './CommentCard.module.css';

const CommentCard = ({ 
    username, 
    avatarUrl, 
    time, 
    text, 
    impact, 
    sentiment, 
    onBlock, 
    onDelete 
}) => {

  return (
    <div className={`${styles.card} ${styles[sentiment] || ''}`}>
      
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={username} className={styles.avatarImage} />
            ) : (
             username ? (username.startsWith('@') ? username.charAt(1).toUpperCase() : username.charAt(0).toUpperCase()) : '?'
            )}
          </div>
          
          <div>
            <div className={styles.username}>{username}</div>
            <div className={styles.time}>{time}</div>
          </div>
        </div>

        <div className={styles.impact}>
          {impact} נק&apos;
        </div>
      </div>

      <div className={styles.text}>
        {text}
      </div>

      <div className={styles.footer}>
        <span className={`${styles.badge} ${styles['badge-' + sentiment] || ''}`}>
            {sentiment === 'negative' ? 'פוגעני' : (sentiment === 'positive' ? 'חיובי' : 'ניטרלי')}
        </span>
        
        {/* 👇 כאן השדרוג: אייקונים במקום מילים */}
        <div className={styles.actions}>
          
          {/* כפתור מחיקה (אייקון פח) */}
          <button onClick={onDelete} className={styles.actionBtn} title="מחק תגובה">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>

          {/* כפתור חסימה (אייקון חסימה/מגן) */}
          <button onClick={onBlock} className={`${styles.actionBtn} ${styles.blockBtn}`} title="חסום משתמש">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>
          </button>
          
        </div>
      </div>

    </div>
  );
};

CommentCard.propTypes = {
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  time: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  impact: PropTypes.number.isRequired,
  sentiment: PropTypes.string,
  onBlock: PropTypes.func,
  onDelete: PropTypes.func
};

export default CommentCard;