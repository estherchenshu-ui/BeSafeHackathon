import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import MonthlyTrendChart from './MonthlyTrendChart';
import HalfYearTrendChart from './HalfYearTrendChart';
import YearTrendChart from './YearTrendChart';

import ScoreCircle from './ScoreCircle';
import CommentCard from './CommentCard/CommentCard';
import BehaviorChangeCard from './BehaviorChangeCard';

/* ================= פונקציות עזר לחישוב נתונים ================= */

function calculateMonthlyAverages(comments) {
  const now = new Date();
  const weeks = [[], [], [], []]; // שבוע 1 (ישן) -> שבוע 4 (אחרון)

  comments.forEach((comment) => {
    if (!comment.createdAt) return;
    const created = new Date(comment.createdAt);
    const diffInDays = (now - created) / (1000 * 60 * 60 * 24);

    if (diffInDays <= 7) weeks[3].push(comment.score || 0);
    else if (diffInDays <= 14) weeks[2].push(comment.score || 0);
    else if (diffInDays <= 21) weeks[1].push(comment.score || 0);
    else if (diffInDays <= 30) weeks[0].push(comment.score || 0);
  });

  return weeks.map((week) =>
    week.length === 0
      ? 0
      : Math.round(week.reduce((a, b) => a + b, 0) / week.length)
  );
}

function calculateHalfYearAverages(comments) {
  const now = new Date();
  const months = [[], [], [], [], [], []]; // 6 חודשים אחרונים

  comments.forEach((comment) => {
    if (!comment.createdAt) return;
    const created = new Date(comment.createdAt);
    const diffInMonths =
      (now.getFullYear() - created.getFullYear()) * 12 +
      (now.getMonth() - created.getMonth());

    if (diffInMonths < 6) {
      months[5 - diffInMonths].push(comment.score || 0);
    }
  });

  return months.map((month) =>
    month.length === 0
      ? 0
      : Math.round(month.reduce((a, b) => a + b, 0) / month.length)
  );
}

function calculateYearAverages(comments) {
  const now = new Date();
  const months = Array.from({ length: 12 }, () => []);

  comments.forEach((comment) => {
    if (!comment.createdAt) return;
    const created = new Date(comment.createdAt);
    const diffInMonths =
      (now.getFullYear() - created.getFullYear()) * 12 +
      (now.getMonth() - created.getMonth());

    if (diffInMonths < 12) {
      months[11 - diffInMonths].push(comment.score || 0);
    }
  });

  return months.map((month) =>
    month.length === 0
      ? 0
      : Math.round(month.reduce((a, b) => a + b, 0) / month.length)
  );
}

/* ================= קומפוננטה ראשית ================= */

function ExportReport({ comments }) {
  const [period, setPeriod] = useState('month'); // month | halfYear | year
  const [filteredComments, setFilteredComments] = useState([]);

  /* ================= פילטור לפי תקופה ================= */

  useEffect(() => {
    const now = new Date();

    const filtered = comments.filter((comment) => {
      if (!comment.createdAt) return false;

      const created = new Date(comment.createdAt);
      const diffInDays = Math.abs(now - created) / (1000 * 60 * 60 * 24);

      if (period === 'month') return diffInDays <= 30;
      if (period === 'halfYear') return diffInDays <= 180;
      if (period === 'year') return diffInDays <= 365;

      return true;
    });

    setFilteredComments(filtered);
  }, [period, comments]);

  /* ================= חישובים ================= */

  const averageScore =
    filteredComments.length === 0
      ? 0
      : Math.round(
          filteredComments.reduce((sum, c) => sum + (c.score || 0), 0) /
            filteredComments.length
        );

  const mostNegativeComment = [...filteredComments].sort(
    (a, b) => (a.score || 0) - (b.score || 0)
  )[0];

  const mostPositiveComment = [...filteredComments].sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  )[0];

  const positiveCount = filteredComments.filter(
    (c) => c.sentiment === 'positive'
  ).length;

  const negativeCount = filteredComments.filter(
    (c) => c.sentiment === 'negative'
  ).length;

  /* ================= נתונים לגרפים ================= */

  const monthlyData = calculateMonthlyAverages(filteredComments);
  const halfYearData = calculateHalfYearAverages(filteredComments);
  const yearData = calculateYearAverages(filteredComments);

  const sendReportByEmail = () => {
    alert('📧 הדוח נשלח למייל בהצלחה (דמו)');
  };

  return (
    <div className="export-report-container">

      {/* ================= Header ================= */}
      <div className="export-report-header">
        <h1>Report</h1>
        <button className="send-report-btn" onClick={sendReportByEmail}>
          📤 שלח דוח במייל
        </button>
      </div>

      {/* ================= Tabs ================= */}
      <div className="report-period-tabs">
        <button
          className={period === 'month' ? 'report-tab active' : 'report-tab'}
          onClick={() => setPeriod('month')}
        >
          חודש אחרון
        </button>

        <button
          className={period === 'halfYear' ? 'report-tab active' : 'report-tab'}
          onClick={() => setPeriod('halfYear')}
        >
          חצי שנה אחרונה
        </button>

        <button
          className={period === 'year' ? 'report-tab active' : 'report-tab'}
          onClick={() => setPeriod('year')}
        >
          שנה אחרונה
        </button>
      </div>

      {/* ================= TOP GRID ================= */}
      <div className="export-report-top-grid">

        {/* שמאל – שינוי התנהגות (קומפוננטה אינטרקטיבית) */}
        <div className="report-card">
          <BehaviorChangeCard
            positiveChange={positiveCount}
            negativeChange={negativeCount}
          />
        </div>

        {/* אמצע – גרף מגמה (לפי תקופה) */}
        <div className="report-card">
          <h3>מגמת ציון לאורך התקופה</h3>

          {period === 'month' && <MonthlyTrendChart data={monthlyData} />}
          {period === 'halfYear' && <HalfYearTrendChart data={halfYearData} />}
          {period === 'year' && <YearTrendChart data={yearData} />}

        </div>

        {/* ימין – ציון ממוצע */}
        <div className="report-card">
          <h3>ציון בריאות ממוצע לתקופה</h3>
          <ScoreCircle score={averageScore} />
        </div>

      </div>

      {/* ================= BOTTOM GRID ================= */}
      <div className="export-report-bottom-grid">

        {mostNegativeComment && (
          <div className="report-card wide">
            <h3>⬇️ התגובה שהורידה הכי הרבה ציון</h3>
            <CommentCard comment={mostNegativeComment} />
          </div>
        )}

        {mostPositiveComment && (
          <div className="report-card wide">
            <h3>⬆️ התגובה שהעלתה הכי הרבה ציון</h3>
            <CommentCard comment={mostPositiveComment} />
          </div>
        )}

      </div>
    </div>
  );
}

ExportReport.propTypes = {
  comments: PropTypes.array.isRequired
};

export default ExportReport;
