import PropTypes from 'prop-types';
import './ReportTrends.css';

function HalfYearTrendChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="report-trend-chart report-bars-6">
      {data.map((value, index) => (
        <div key={index} className="report-bar-wrapper">
          <div
            className={`report-bar ${
              value > 70 ? 'positive' : value > 40 ? 'neutral' : 'negative'
            }`}
            style={{ height: `${value}%` }}
          />
          <span className="report-bar-label">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

HalfYearTrendChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default HalfYearTrendChart;
