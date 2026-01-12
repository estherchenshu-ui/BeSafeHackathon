import PropTypes from 'prop-types';
import './BehaviorChangeCard.css';

function BehaviorChangeCard({ positiveChange, negativeChange }) {
  const total = positiveChange + negativeChange || 1;

  const positivePercent = Math.round((positiveChange / total) * 100);
  const negativePercent = Math.round((negativeChange / total) * 100);

  return (
    <div className="behavior-split-card">

      {/* צד ימין – חיובי */}
      <div className="behavior-side positive">
        <div className="behavior-title">תגובות חיוביות</div>
        <div className="behavior-percent positive">
          {positivePercent}%
        </div>
        <div className="behavior-subtext">
          שינוי ביחס לחודש הקודם
        </div>
      </div>

      {/* קו הפרדה */}
      <div className="behavior-divider" />

      {/* צד שמאל – שלילי */}
      <div className="behavior-side negative">
        <div className="behavior-title">תגובות שליליות</div>
        <div className="behavior-percent negative">
          {negativePercent}%
        </div>
        <div className="behavior-subtext">
          שינוי ביחס לחודש הקודם
        </div>
      </div>

    </div>
  );
}

BehaviorChangeCard.propTypes = {
  positiveChange: PropTypes.number.isRequired,
  negativeChange: PropTypes.number.isRequired
};

export default BehaviorChangeCard;
