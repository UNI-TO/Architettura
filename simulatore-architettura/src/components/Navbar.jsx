import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const links = [
  { to: '/',            label: 'Home',        icon: '🏠', match: /^\/$/ },
  { to: '/argomenti',  label: 'Argomenti',   icon: '📚', match: /^\/argomento/ },
  { to: '/esami',      label: 'Esami',       icon: '📝', match: /^\/esami$|^\/esame\// },
  { to: '/assembly',   label: 'Assembly',    icon: '💻', match: /^\/assembly/ },
  { to: '/alu',        label: 'ALU',         icon: '🔢', match: /^\/alu/ },
  { to: '/scheda',     label: 'Scheda',      icon: '📋', match: /^\/scheda/ },
  { to: '/statistiche',label: 'Statistiche', icon: '📊', match: /^\/statistiche/ },
];

function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🖥️ Architettura</Link>
      <div className="navbar-links">
        {links.map(({ to, label, icon, match }) => (
          <Link
            key={to}
            to={to}
            className={`nav-link ${match.test(pathname) ? 'active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
