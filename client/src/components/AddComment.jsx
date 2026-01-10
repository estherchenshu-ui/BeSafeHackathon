import { useState } from 'react';
import PropTypes from 'prop-types';

function AddComment({ setComments }) {
  const [username, setUsername] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newComment = {
      username: username.trim(),
      text,
      createdAt: new Date().toISOString(),
      sentiment: 'neutral',
      impact: 0,
    };

    setComments((prev) => [newComment, ...prev]); // חדש למעלה

    setUsername('');
    setText('');
  };

  return (
    <div className="add-comment-box">
      <h2>הוספת תגובה חדשה</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>שם משתמש:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="לדוגמה: dana_cohen"
            required
          />
        </div>

        <div>
          <label>תוכן התגובה:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="כתבי תגובה כאן..."
            required
          />
        </div>

        <button type="submit">שלח תגובה</button>
      </form>
    </div>
  );
}

AddComment.propTypes = {
  setComments: PropTypes.func.isRequired,
};

export default AddComment;
