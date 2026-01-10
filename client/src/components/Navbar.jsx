import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        🛡 SafeTok
      </div>

      <div className="nav-links">
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Dashboard
        </span>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Live Feed
        </span>
        <span onClick={() => navigate('/history')} style={{ cursor: 'pointer' }}>
          History
        </span>
        <span style={{ cursor: 'pointer' }}>
          Settings
        </span>
        <span style={{ cursor: 'pointer' }}>
          Help
        </span>
      </div>
    </div>
  );
}

export default Navbar;
