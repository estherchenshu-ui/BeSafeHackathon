import PropTypes from 'prop-types';
import './BehaviorChangeCard.css';

function BehaviorChangeCard({ positiveChange, negativeChange }) {
  const total = positiveChange + negativeChange || 1;
  const positivePercent = Math.round((positiveChange / total) * 100);
  const negativePercent = Math.round((negativeChange / total) * 100);

  return (
    <div className="behavior-card">
      <h3>שינוי בהתנהגות לעומת חודש קודם</h3>

      <div className="behavior-row positive">
        <div className="label">
          ⬆️ תגובות חיוביות
        </div>
        <div className="bar-container">
          <div
            className="bar-fill positive"
            style={{ width: `${positivePercent}%` }}
          />
        </div>
        <div className="value">{positiveChange}</div>
      </div>

      <div className="behavior-row negative">
        <div className="label">
          ⬇️ תגובות שליליות
        </div>
        <div className="bar-container">
          <div
            className="bar-fill negative"
            style={{ width: `${negativePercent}%` }}
          />
        </div>
        <div className="value">{negativeChange}</div>
      </div>
    </div>
  );
}

BehaviorChangeCard.propTypes = {
  positiveChange: PropTypes.number.isRequired,
  negativeChange: PropTypes.number.isRequired
};

export default BehaviorChangeCard;
