import PropTypes from 'prop-types';
import styles from './StatCard.module.css';

const StatCard = ({ value, label, colorType = 'neutral' }) => {
  return (
    <div className={`${styles.pill} ${styles[colorType]}`}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
};

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  colorType: PropTypes.oneOf(['positive', 'negative', 'neutral'])
};

export default StatCard;
