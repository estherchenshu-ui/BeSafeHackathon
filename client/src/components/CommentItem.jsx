import PropTypes from 'prop-types';

function CommentItem({ from, to, text }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
      <strong>{from}</strong> → <strong>{to}</strong>
      <p>{text}</p>
    </div>
  );
}

CommentItem.propTypes = {
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default CommentItem;
