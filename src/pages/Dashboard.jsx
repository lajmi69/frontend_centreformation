import { Link } from 'react-router-dom'
import { 
  FaUser, 
  FaBook, 
  FaClipboardList,
  FaGraduationCap,
  FaCog,
  FaArrowRight,
  FaEnvelope,
  FaIdBadge,
  FaInfoCircle,
  FaChalkboardTeacher
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user, isFormateur, isEtudiant } = useAuth()
  
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
    <div className="page-content">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2>👋 Bonjour, {displayName}!</h2>
        <p>Bienvenue sur votre espace personnel Institut IIT</p>
        <span className="user-badge">
          {isEtudiant() ? <FaGraduationCap /> : <FaChalkboardTeacher />}
          {user?.type}
        </span>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start'}}>
        {/* Profile Card */}
        <div className="profile-card-modern">
          <div className="profile-header-section">
            <div className="profile-avatar-large">{getInitials()}</div>
            <h3>{displayName}</h3>
            <span className="role-badge">
              {isEtudiant() ? <FaGraduationCap /> : <FaChalkboardTeacher />}
              {user?.type}
            </span>
          </div>
          <div className="profile-body">
            <div className="profile-info-item">
              <div className="info-icon"><FaUser /></div>
              <div>
                <div className="info-label">Identifiant</div>
                <div className="info-value">{user?.username}</div>
              </div>
            </div>
            <div className="profile-info-item">
              <div className="info-icon"><FaEnvelope /></div>
              <div>
                <div className="info-label">Email</div>
                <div className="info-value">{user?.email}</div>
              </div>
            </div>
            {user?.specialite && (
              <div className="profile-info-item">
                <div className="info-icon"><FaIdBadge /></div>
                <div>
                  <div className="info-label">Spécialité</div>
                  <div className="info-value">{user?.specialite}</div>
                </div>
              </div>
            )}
            <Link to="/profile" className="btn-modern btn-modern-primary" style={{marginTop: '1rem'}}>
              <FaCog /> Modifier mon profil
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '1.25rem'}}>
            Accès rapide
          </h3>
          <div className="action-cards" style={{marginTop: 0}}>
            {/* Étudiant Actions */}
            {isEtudiant() && (
              <>
                <Link to="/mes-cours" className="action-card cyan" style={{textDecoration: 'none'}}>
                  <div className="icon-box">
                    <FaBook />
                  </div>
                  <h4>Mes Cours</h4>
                  <p>Consultez vos cours et inscriptions</p>
                  <span className="btn-action">
                    Accéder <FaArrowRight />
                  </span>
                </Link>
                <Link to="/mes-notes" className="action-card emerald" style={{textDecoration: 'none'}}>
                  <div className="icon-box">
                    <FaGraduationCap />
                  </div>
                  <h4>Mes Notes</h4>
                  <p>Consultez vos notes et résultats</p>
                  <span className="btn-action">
                    Accéder <FaArrowRight />
                  </span>
                </Link>
              </>
            )}

            {/* Formateur Actions */}
            {isFormateur() && (
              <>
                <Link to="/mes-cours" className="action-card primary" style={{textDecoration: 'none'}}>
                  <div className="icon-box">
                    <FaBook />
                  </div>
                  <h4>Mes Cours</h4>
                  <p>Consultez les cours que vous dispensez</p>
                  <span className="btn-action">
                    Accéder <FaArrowRight />
                  </span>
                </Link>
                <Link to="/saisie-notes" className="action-card amber" style={{textDecoration: 'none'}}>
                  <div className="icon-box">
                    <FaClipboardList />
                  </div>
                  <h4>Saisie des Notes</h4>
                  <p>Saisissez les notes de vos étudiants</p>
                  <span className="btn-action">
                    Accéder <FaArrowRight />
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Info Card */}
          <div className="info-card">
            <h5><FaInfoCircle /> Informations utiles</h5>
            <ul>
              <li>
                <strong>Espace utilisateur :</strong> Cette application vous permet de gérer votre profil, 
                consulter vos cours et notes.
              </li>
              {isEtudiant() && (
                <li>
                  <strong>Étudiant :</strong> Vous pouvez consulter vos inscriptions aux cours et voir vos notes.
                </li>
              )}
              {isFormateur() && (
                <li>
                  <strong>Formateur :</strong> Vous pouvez consulter vos cours et saisir les notes des étudiants.
                </li>
              )}
              <li>
                <strong>Besoin d'aide ?</strong> Contactez l'administration du centre de formation.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
