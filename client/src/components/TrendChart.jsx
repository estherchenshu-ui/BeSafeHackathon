// client/src/components/TrendChart.jsx
import React from 'react';
import './TrendChart.css';

const TrendChart = ({ data }) => {
  // אם לא העבירו נתונים, נשתמש בנתונים פיקטיביים לתצוגה
  const chartData = data || [65, 70, 68, 75, 82, 80, 55, 60, 72, 78];

  // פונקציה שקובעת את הצבע לפי הציון (לוגיקה מהאפיון)
  const getStatusClass = (score) => {
    if (score >= 80) return 'positive'; // ירוק
    if (score < 60) return 'negative';  // אדום
    return 'neutral';                   // כתום
  };

  return (
    <div className="trend-card">
      <h3>📈 מגמת ציון - 10 דקות אחרונות</h3>
      
      <div className="trend-chart">
        {chartData.map((score, index) => (
          <div 
            key={index}
            className={`trend-bar ${getStatusClass(score)}`}
            style={{ height: `${score}%` }} // הגובה לפי הציון באחוזים
            data-value={score} // בשביל הטולטיפ ב-CSS
          ></div>
        ))}
      </div>

      <div className="trend-labels">
        <span>10 דק' קודם</span>
        <span>עכשיו</span>
      </div>
    </div>
  );
};

export default TrendChart;