import PropTypes from 'prop-types';
import styles from './StatCard.module.css';

const StatCard = ({ value, label, colorType = 'neutral' }) => {
  return (
    <div className={`${styles.statCard} ${styles[colorType]}`}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  colorType: PropTypes.oneOf(['positive', 'negative', 'neutral'])
};

export default StatCard;