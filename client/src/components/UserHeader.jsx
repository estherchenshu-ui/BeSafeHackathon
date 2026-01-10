import PropTypes from 'prop-types';
import styles from './UserHeader.module.css';

const UserHeader = ({ 
  name = "שרה כהן",
  username = "@sarah_dance",
  avatarUrl = null
}) => {
  const getInitial = () => name.charAt(0);

  return (
    <div className={styles.userHeader}>
      <div className={styles.textInfo}>
        <h2 className={styles.userName}>{name}</h2>
        <span className={styles.userHandle}>{username}</span>
      </div>
      <div className={styles.avatarWrapper}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {getInitial()}
          </div>
        )}
      </div>
    </div>
  );
};

UserHeader.propTypes = {
  name: PropTypes.string,
  username: PropTypes.string,
  avatarUrl: PropTypes.string
};

export default UserHeader;