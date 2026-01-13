import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import MonthlyTrendChart from './MonthlyTrendChart';
import HalfYearTrendChart from './HalfYearTrendChart';
import YearTrendChart from './YearTrendChart';
import ScoreCircle from './ScoreCircle';
import CommentCard from './CommentCard/CommentCard';
import BehaviorChangeCard from './BehaviorChangeCard';

function ExportReport() {
  const [period, setPeriod] = useState('month');
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axiosInstance.get(`/report?period=${period}`);
        setReportData(res.data);
      } catch (err) {
        console.error("Error fetching report:", err);
      }
    };
    fetchReport();
  }, [period]);

  if (!reportData) return <div style={{color: 'white'}}>טוען דוח...</div>;

  const chartData = reportData.data.map(d => d.avgScore);

  return (
    <div className="export-report-container">
      <div className="export-report-header">
        <h1>Report</h1>
        <button className="send-report-btn">📤 שלח דוח במייל</button>
      </div>

      <div className="report-period-tabs">
        {['month', '6months', 'year'].map((p) => (
          <button
            key={p}
            className={period === p ? 'report-tab active' : 'report-tab'}
            onClick={() => setPeriod(p)}
          >
            {p === 'month' ? 'חודש אחרון' : p === '6months' ? 'חצי שנה' : 'שנה אחרונה'}
          </button>
        ))}
      </div>

      <div className="export-report-top-grid">
        <div className="report-card">
          <BehaviorChangeCard 
            positiveChange={reportData.changes.positive} 
            negativeChange={reportData.changes.negative} 
          />
        </div>
        <div className="report-card">
          <h3>מגמת ציון</h3>
          {period === 'month' && <MonthlyTrendChart data={chartData} />}
          {period === '6months' && <HalfYearTrendChart data={chartData} />}
          {period === 'year' && <YearTrendChart data={chartData} />}
        </div>
        <div className="report-card">
          <h3>ציון בריאות ממוצע</h3>
          <ScoreCircle score={reportData.data.length ? Math.round(reportData.data.reduce((a,b)=>a+b.avgScore,0)/reportData.data.length) : 0} />
        </div>
      </div>

      <div className="export-report-bottom-grid">
        {reportData.worstComment && (
          <div className="report-card wide">
            <h3>⬇️ התגובה שהורידה הכי הרבה</h3>
            <CommentCard comment={reportData.worstComment} />
          </div>
        )}
        {reportData.bestComment && (
          <div className="report-card wide">
            <h3>⬆️ התגובה שהעלתה הכי הרבה</h3>
            <CommentCard comment={reportData.bestComment} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ExportReport;