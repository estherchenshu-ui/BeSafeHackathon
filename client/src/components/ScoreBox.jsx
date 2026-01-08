import PropTypes from 'prop-types';

function ScoreBox({ score }) {
  return (
    <div>
      <h2>Score</h2>
      <h1>{score}</h1>
      <p>ציון אמינות</p>
    </div>
  );
}

ScoreBox.propTypes = {
  score: PropTypes.number.isRequired
};

export default ScoreBox;
