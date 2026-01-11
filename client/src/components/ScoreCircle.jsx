import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ScoreCircle.module.css';

const ScoreCircle = ({ score }) => {
    const [animate, setAnimate] = useState(false);
    const circumference = 408;
    const offset = circumference - (score / 100) * circumference;

    // הפעלת האנימציה בכל פעם שהציון משתנה
    useEffect(() => {
  const triggerAnimation = () => {
    setAnimate(true);

    const timer = setTimeout(() => {
      setAnimate(false);
    }, 300);

    return () => clearTimeout(timer);
  };

  const cleanup = triggerAnimation();
  return cleanup;
}, [score]);

  // קביעת סטטוס לפי הציון
  const getStatusText = (s) => {
    if (s >= 80) return { text: 'מצב מצוין', class: styles.good };
    if (s >= 60) return { text: 'נדרשת תשומת לב', class: styles.warning };
    return { text: 'מצב קריטי', class: styles.danger };
  };

  const status = getStatusText(score);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>ציון בריאות דיגיטלית</h3>
      
      <div className={styles.circleWrapper}>
        <svg width="160" height="160" viewBox="0 0 160 160" className={styles.svg}>
        {/* מעגל הרקע (אפור שקוף) */}
          <circle 
            className={styles.bgCircle} 
            cx="80" cy="80" r="65" 
          />
        {/* מעגל ההתקדמות (הצבעוני) */}
          <circle 
            className={`${styles.progressCircle} ${status.class}`} // הוספת status.class כאן
            cx="80" cy="80" r="65"
            style={{ 
                strokeDasharray: circumference, 
                strokeDashoffset: offset 
            }}
          />
        </svg>

        <div className={styles.scoreValue}>
            <div className={`${styles.number} ${animate ? styles.pop : ''}`}>
                {score}
            </div>
          <div className={styles.label}>מתוך 100</div>
        </div>
      </div>

      <div className={`${styles.statusBadge} ${status.class}`}>
        {score < 80 ? '⚠️' : '✅'} {status.text}
      </div>
    </div>
  );
};

ScoreCircle.propTypes = {
  score: PropTypes.number.isRequired
};

export default ScoreCircle;