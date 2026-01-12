import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      {/* לוגו */}
      <div
        className="logo"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        🛡 SafeTok
      </div>

      {/* קישורים */}
      <div className="nav-links">

        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Live Feed
        </span>

        <span onClick={() => navigate('/history')} style={{ cursor: 'pointer' }}>
          History
        </span>

        <span onClick={() => navigate('/export-report')} style={{ cursor: 'pointer' }}>
          Report
        </span>

      </div>
    </div>
  );
}

export default Navbar;
