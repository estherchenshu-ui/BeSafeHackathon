// client/src/components/TrendChart.jsx
import PropTypes from 'prop-types';
import './TrendChart.css';

const TrendChart = ({ data }) => {
  const demoData = [70, 75, 68, 55, 82, 78, 74, 80, 85, 77];
  const chartData = data && data.length === 10 ? data : demoData;

  const getStatusClass = (score) => {
    if (score >= 80) return 'positive';
    if (score < 60) return 'negative';
    return 'neutral';
  };

  return (
    <div className="trend-card">
      <h3>📈 מגמת ציון – 10 ימים אחרונים</h3>

      <div className="trend-grid-wrapper">
        {/* שורת העמודות */}
        {chartData.map((score, index) => (
          <div
            key={index}
            className={`trend-bar ${getStatusClass(score)}`}
            style={{ height: `${score}%` }}
            data-value={score}
          ></div>
        ))}

        {/* תווית שמאל */}
        <span className="trend-edge-label left">עשרה ימים קודם</span>

        {/* תווית ימין */}
        <span className="trend-edge-label right">היום</span>
      </div>
    </div>
  );
};

TrendChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
};

export default TrendChart;
