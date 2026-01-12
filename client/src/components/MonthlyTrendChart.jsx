import './ReportTrends.css';

function MonthlyTrendChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="report-trend-chart report-bars-4">
      {data.map((value, index) => (
        <div key={index} className="report-bar-wrapper">
          <div
            className={`report-bar ${
              value > 70 ? 'positive' : value > 40 ? 'neutral' : 'negative'
            }`}
            style={{ height: `${value}%` }}
          />
          <span className="report-bar-label">שבוע {index + 1}</span>
        </div>
      ))}
    </div>
  );
}

export default MonthlyTrendChart;
