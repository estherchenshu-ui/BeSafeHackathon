import { useState } from 'react';
import PropTypes from 'prop-types';

function AddComment({ setComments }) {
  const [to, setTo] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newComment = {
      from: 'מיכל',
      to,
      text,
      createdAt: new Date().toISOString(),
      sentiment: 'neutral',
      impact: 0,
    };

    setComments(prev => [...prev, newComment]);

    setTo('');
    setText('');
  };

  return (
    <div className="add-comment-box">
      <h2>הוספת תגובה חדשה</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>אל:</label>
          <input
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder="UserName"
            required
          />
        </div>

        <div>
          <label>תוכן התגובה:</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Comment here"
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
