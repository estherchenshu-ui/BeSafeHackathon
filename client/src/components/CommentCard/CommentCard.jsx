import React from 'react';
import PropTypes from 'prop-types';
import styles from './CommentCard.module.css';

const CommentCard = ({ 
    username, 
    avatarUrl,  // <--- הוספנו מקום לקבלת תמונה מהבאקנד
    time, 
    text, 
    impact, 
    sentiment, 
    onBlock, 
    onDelete 
}) => {

  return (
    <div className={styles.card}> {/* בלי סיווג צבעים כרגע, זה למשימה הבאה */}
      
      <div className={styles.header}>
        <div className={styles.userInfo}>
          
          {/* --- הטיפול באווטר (לוגיקה) --- */}
          <div className={styles.avatar}>
            {avatarUrl ? (
              // אם יש תמונה - מציגים אותה בתוך העיגול
              <img src={avatarUrl} alt={username} className={styles.avatarImage} />
            ) : (
              // אם אין תמונה - מציגים אות
              username ? username.charAt(0).toUpperCase() : '?'
            )}
          </div>
          
          <div>
            <div className={styles.username}>{username}</div>
            <div className={styles.time}>{time}</div>
          </div>
        </div>

        <div className={styles.impact}>
          {impact} נק'
        </div>
      </div>

      <div className={styles.text}>
        {text}
      </div>

      <div className={styles.footer}>
        {/* Badge - כרגע רק טקסט, העיצוב הצבעוני שייך למשימה הבאה */}
        <span className={styles.badge}>
            {sentiment === 'negative' ? 'פוגעני' : 'תקין'}
        </span>
        
        {/* --- הטיפול בכפתורים (לוגיקה) --- */}
        <div className={styles.actions}>
          {/* הפעולה היא פשוט לקרוא לפונקציה שהתקבלה מבחוץ */}
          <button onClick={onDelete} className={styles.btn}>מחק</button>
          <button onClick={onBlock} className={styles.btn}>חסום</button>
        </div>
      </div>

    </div>
  );
};

CommentCard.propTypes = {
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string, // לא חובה (יכול להיות ריק)
  time: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  impact: PropTypes.number.isRequired,
  sentiment: PropTypes.string,
  onBlock: PropTypes.func,
  onDelete: PropTypes.func
};

export default CommentCard;