import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap'
import { 
  FaHome, 
  FaBook, 
  FaGraduationCap,
  FaUser, 
  FaSignOutAlt,
  FaCalendarAlt,
  FaClipboardList,
  FaPenAlt,
  FaChevronDown,
  FaChalkboardTeacher
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Layout = () => {
  const { user, logout, isFormateur, isEtudiant } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const displayName = user?.prenom 
    ? `${user.prenom} ${user.nom}` 
    : (user?.nom || user?.username)

  const getInitials = () => {
    if (user?.prenom && user?.nom) {
      return `${user.prenom[0]}${user.nom[0]}`.toUpperCase()
    }
    return user?.username?.[0]?.toUpperCase() || 'U'
  }

  return (
    <div style={{display: 'flex', minHeight: '100vh'}}>
      {/* Sidebar */}
      <aside className="modern-sidebar" style={{width: '260px', flexShrink: 0}}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="logo-wrapper">IIT</div>
          <h5>Institut IIT</h5>
          <small>Espace Utilisateur</small>
        </div>
        
        {/* Navigation */}
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaHome /> Tableau de bord
          </NavLink>
          
          <NavLink to="/mes-cours" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaBook /> Mes Cours
          </NavLink>
          
          {isEtudiant() && (
            <NavLink to="/mes-notes" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaGraduationCap /> Mes Notes
            </NavLink>
          )}
          
          <NavLink to="/emploi-du-temps" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaCalendarAlt /> Emploi du temps
          </NavLink>
          
          <div className="nav-divider"></div>
          
          {isFormateur() && (
            <NavLink to="/saisie-notes" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <FaPenAlt /> Saisie Notes
            </NavLink>
          )}
          
          <NavLink to="/profile" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaUser /> Mon Profil
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="modern-main" style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        {/* Top Navbar */}
        <header className="modern-navbar">
          <span className="navbar-title">
            {isEtudiant() ? 'Espace Étudiant' : 'Espace Formateur'}
          </span>
          
          <div className="navbar-user">
            <Dropdown align="end" className="modern-dropdown">
              <Dropdown.Toggle as="button" style={{
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}>
                <div className="user-info">
                  <div className="name">{displayName}</div>
                  <div className="role">{user?.type}</div>
                </div>
                <div className="user-avatar">{getInitials()}</div>
                <FaChevronDown style={{color: 'var(--gray-400)', fontSize: '0.75rem'}} />
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate('/profile')}>
                  <FaUser /> Mon Profil
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <FaSignOutAlt /> Déconnexion
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>

        {/* Page Content */}
        <div style={{flex: 1, overflow: 'auto'}}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
