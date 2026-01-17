import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Nav, Navbar, Dropdown } from 'react-bootstrap'
import { 
  FaHome, 
  FaBook, 
  FaGraduationCap,
  FaUser, 
  FaSignOutAlt 
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Layout = () => {
  const { user, logout, isFormateur, isEtudiant } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={2} className="sidebar d-none d-md-block">
          <div className="p-4 text-center">
            <h4 className="text-white fw-bold">Centre Formation</h4>
            <small className="text-white-50">Espace Utilisateur</small>
          </div>
          
          <Nav className="flex-column mt-3">
            <Nav.Link as={NavLink} to="/dashboard">
              <FaHome /> Accueil
            </Nav.Link>
            
            <Nav.Link as={NavLink} to="/mes-cours">
              <FaBook /> Mes Cours
            </Nav.Link>
            
            {isEtudiant() && (
              <Nav.Link as={NavLink} to="/mes-notes">
                <FaGraduationCap /> Mes Notes
              </Nav.Link>
            )}
            
            <Nav.Link as={NavLink} to="/profile">
              <FaUser /> Mon Profil
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={10} className="main-content">
          {/* Top Navbar */}
          <Navbar className="px-4 py-3">
            <Navbar.Brand className="d-md-none">Centre Formation</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" className="user-dropdown">
                  <FaUser className="me-2" />
                  {user?.prenom ? `${user.prenom} ${user.nom}` : user?.username || user?.nom}
                  <span className="badge bg-primary ms-2">
                    {user?.type}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => navigate('/profile')}>
                    <FaUser className="me-2" /> Mon Profil
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <FaSignOutAlt className="me-2" /> Déconnexion
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Navbar.Collapse>
          </Navbar>

          {/* Page Content */}
          <div className="p-4">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Layout
