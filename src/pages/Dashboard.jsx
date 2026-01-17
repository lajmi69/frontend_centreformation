import { Row, Col, Card, ListGroup, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { 
  FaUser, 
  FaBook, 
  FaClipboardList,
  FaGraduationCap,
  FaCog
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user, isFormateur, isEtudiant } = useAuth()
  
  // Afficher le nom complet ou le username
  const displayName = user?.prenom 
    ? `${user.prenom} ${user.nom}` 
    : (user?.nom || user?.username)

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-4">
        <h2>Bonjour, {displayName}!</h2>
        <p className="text-muted">
          Bienvenue sur votre espace personnel
          <Badge bg="primary" className="ms-2">{user?.type}</Badge>
        </p>
      </div>

      <Row>
        {/* Profile Card */}
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-primary text-white">
              <FaUser className="me-2" />
              Mon Profil
            </Card.Header>
            <Card.Body>
              <p><strong>Identifiant:</strong> {user?.username}</p>
              {user?.prenom && <p><strong>Nom:</strong> {user?.nom}</p>}
              {user?.prenom && <p><strong>Prénom:</strong> {user?.prenom}</p>}
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Rôle:</strong> {user?.type}</p>
              {user?.specialite && (
                <p><strong>Spécialité:</strong> {user?.specialite}</p>
              )}
              <Link to="/profile" className="btn btn-outline-primary btn-sm mt-2">
                <FaCog className="me-1" /> Modifier mon profil
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col md={8} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-secondary text-white">
              <FaClipboardList className="me-2" />
              Accès rapide
            </Card.Header>
            <Card.Body>
              <Row>
                {/* Étudiant: Mes Cours, Mes Notes */}
                {isEtudiant() && (
                  <>
                    <Col md={6} className="mb-3">
                      <Card className="text-center h-100 border-primary">
                        <Card.Body>
                          <FaBook size={40} className="text-primary mb-3" />
                          <h5>Mes Cours</h5>
                          <p className="text-muted small">Consultez vos cours et inscriptions</p>
                          <Link to="/mes-cours" className="btn btn-primary">
                            Voir mes cours
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Card className="text-center h-100 border-success">
                        <Card.Body>
                          <FaGraduationCap size={40} className="text-success mb-3" />
                          <h5>Mes Notes</h5>
                          <p className="text-muted small">Consultez vos notes et résultats</p>
                          <Link to="/mes-notes" className="btn btn-success">
                            Voir mes notes
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  </>
                )}

                {/* Formateur: Mes Cours, Notes à saisir */}
                {isFormateur() && (
                  <>
                    <Col md={6} className="mb-3">
                      <Card className="text-center h-100 border-primary">
                        <Card.Body>
                          <FaBook size={40} className="text-primary mb-3" />
                          <h5>Mes Cours</h5>
                          <p className="text-muted small">Consultez les cours que vous dispensez</p>
                          <Link to="/mes-cours" className="btn btn-primary">
                            Voir mes cours
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Card className="text-center h-100 border-warning">
                        <Card.Body>
                          <FaClipboardList size={40} className="text-warning mb-3" />
                          <h5>Saisie des Notes</h5>
                          <p className="text-muted small">Saisissez les notes de vos étudiants</p>
                          <Link to="/saisie-notes" className="btn btn-warning">
                            Saisir les notes
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  </>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Info Section */}
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Informations</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Espace utilisateur :</strong> Cette application vous permet de gérer votre profil, 
                  consulter vos cours et notes.
                </ListGroup.Item>
                {isEtudiant() && (
                  <ListGroup.Item>
                    <strong>Étudiant :</strong> Vous pouvez consulter vos inscriptions aux cours et voir vos notes.
                  </ListGroup.Item>
                )}
                {isFormateur() && (
                  <ListGroup.Item>
                    <strong>Formateur :</strong> Vous pouvez consulter vos cours et saisir les notes des étudiants.
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <strong>Besoin d'aide ?</strong> Contactez l'administration du centre de formation.
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
