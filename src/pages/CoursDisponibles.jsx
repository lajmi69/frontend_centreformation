import { useState, useEffect } from 'react'
import { Spinner, Alert, Modal, Form } from 'react-bootstrap'
import { 
  FaSearch, 
  FaBook, 
  FaUserTie, 
  FaClock, 
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaGraduationCap,
  FaInfoCircle,
  FaPlus,
  FaMinus
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import './CoursDisponibles.css'

const CoursDisponibles = () => {
  const { user, isEtudiant } = useAuth()
  const [cours, setCours] = useState([])
  const [mesInscriptions, setMesInscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecialite, setFilterSpecialite] = useState('')
  const [specialites, setSpecialites] = useState([])
  const [selectedCours, setSelectedCours] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [inscriptionLoading, setInscriptionLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Récupérer tous les cours disponibles
      const coursResponse = await api.get('/cours')
      setCours(coursResponse.data.content || coursResponse.data || [])
      
      // Récupérer les spécialités pour le filtre
      const specsResponse = await api.get('/specialites')
      setSpecialites(specsResponse.data.content || specsResponse.data || [])
      
      // Récupérer mes inscriptions actuelles
      if (isEtudiant() && user?.etudiantId) {
        const inscriptionsResponse = await api.get(`/api/inscriptions/etudiant/${user.etudiantId}`)
        setMesInscriptions(inscriptionsResponse.data || [])
      }
      
      setError('')
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Erreur lors du chargement des cours')
    } finally {
      setLoading(false)
    }
  }

  // Vérifier si l'étudiant est déjà inscrit à un cours
  const isInscrit = (coursId) => {
    return mesInscriptions.some(
      insc => insc.cours?.id === coursId && insc.statut !== 'ANNULEE'
    )
  }

  // Filtrer les cours
  const filteredCours = cours.filter(c => {
    const matchSearch = c.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.formateur?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchSpecialite = !filterSpecialite || c.specialite?.id?.toString() === filterSpecialite
    return matchSearch && matchSpecialite
  })

  // Inscription à un cours
  const handleInscription = async () => {
    if (!selectedCours || !user?.etudiantId) return
    
    try {
      setInscriptionLoading(true)
      await api.post('/inscriptions', {
        etudiantId: user.etudiantId,
        coursId: selectedCours.id
      })
      
      toast.success(`Inscription au cours "${selectedCours.titre}" réussie !`)
      setShowModal(false)
      setSelectedCours(null)
      fetchData() // Rafraîchir les données
    } catch (err) {
      console.error('Error inscription:', err)
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription')
    } finally {
      setInscriptionLoading(false)
    }
  }

  // Désinscription d'un cours
  const handleDesinscription = async (coursId) => {
    const inscription = mesInscriptions.find(
      insc => insc.cours?.id === coursId && insc.statut !== 'ANNULEE'
    )
    
    if (!inscription) return
    
    try {
      await api.delete(`/api/inscriptions/${inscription.id}`)
      toast.success('Désinscription effectuée avec succès')
      fetchData()
    } catch (err) {
      console.error('Error desinscription:', err)
      toast.error(err.response?.data?.message || 'Erreur lors de la désinscription')
    }
  }

  // Ouvrir le modal de détails/inscription
  const openModal = (coursItem) => {
    setSelectedCours(coursItem)
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Chargement des cours disponibles...</p>
      </div>
    )
  }

  return (
    <div className="cours-disponibles">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <FaGraduationCap className="header-icon" />
          <div>
            <h1>Cours Disponibles</h1>
            <p>Découvrez et inscrivez-vous aux cours qui vous intéressent</p>
          </div>
        </div>
        
        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-number">{cours.length}</span>
            <span className="stat-text">Cours</span>
          </div>
          <div className="stat-badge inscrit">
            <span className="stat-number">{mesInscriptions.filter(i => i.statut !== 'ANNULEE').length}</span>
            <span className="stat-text">Inscriptions</span>
          </div>
        </div>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {/* Filtres */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un cours, formateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-box">
          <FaFilter className="filter-icon" />
          <select
            value={filterSpecialite}
            onChange={(e) => setFilterSpecialite(e.target.value)}
          >
            <option value="">Toutes les spécialités</option>
            {specialites.map(spec => (
              <option key={spec.id} value={spec.id}>{spec.nom}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grille des cours */}
      {filteredCours.length === 0 ? (
        <div className="no-results">
          <FaBook size={48} />
          <p>Aucun cours trouvé</p>
          <span>Essayez de modifier vos critères de recherche</span>
        </div>
      ) : (
        <div className="cours-grid">
          {filteredCours.map(coursItem => {
            const inscrit = isInscrit(coursItem.id)
            
            return (
              <div 
                key={coursItem.id} 
                className={`cours-card ${inscrit ? 'inscrit' : ''}`}
                onClick={() => openModal(coursItem)}
              >
                <div className="cours-card-header">
                  <span className="cours-code">{coursItem.code}</span>
                  {inscrit && (
                    <span className="inscrit-badge">
                      <FaCheckCircle /> Inscrit
                    </span>
                  )}
                </div>
                
                <h3 className="cours-title">{coursItem.titre}</h3>
                
                <p className="cours-description">
                  {coursItem.description?.substring(0, 100)}
                  {coursItem.description?.length > 100 ? '...' : ''}
                </p>
                
                <div className="cours-meta">
                  {coursItem.formateur && (
                    <div className="meta-item">
                      <FaUserTie />
                      <span>{coursItem.formateur.prenom} {coursItem.formateur.nom}</span>
                    </div>
                  )}
                  
                  <div className="meta-item">
                    <FaClock />
                    <span>{coursItem.nombreHeures || coursItem.duree || 0}h</span>
                  </div>
                  
                  {coursItem.groupes && coursItem.groupes.length > 0 && (
                    <div className="meta-item">
                      <FaUsers />
                      <span>{coursItem.groupes.length} groupe(s)</span>
                    </div>
                  )}
                </div>
                
                <div className="cours-card-footer">
                  {inscrit ? (
                    <button 
                      className="btn-desinscription"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDesinscription(coursItem.id)
                      }}
                    >
                      <FaMinus /> Se désinscrire
                    </button>
                  ) : (
                    <button className="btn-inscription">
                      <FaPlus /> S'inscrire
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de détails */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        centered
        className="cours-modal"
      >
        {selectedCours && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                <FaBook className="me-2" />
                {selectedCours.titre}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="modal-cours-code">
                <span className="code-badge">{selectedCours.code}</span>
                {isInscrit(selectedCours.id) && (
                  <span className="status-inscrit">
                    <FaCheckCircle /> Vous êtes inscrit à ce cours
                  </span>
                )}
              </div>
              
              <div className="modal-section">
                <h6><FaInfoCircle /> Description</h6>
                <p>{selectedCours.description || 'Aucune description disponible.'}</p>
              </div>
              
              <div className="modal-details">
                <div className="detail-item">
                  <FaClock className="detail-icon" />
                  <div>
                    <span className="detail-label">Durée</span>
                    <span className="detail-value">{selectedCours.nombreHeures || selectedCours.duree || 0} heures</span>
                  </div>
                </div>
                
                {selectedCours.formateur && (
                  <div className="detail-item">
                    <FaUserTie className="detail-icon" />
                    <div>
                      <span className="detail-label">Formateur</span>
                      <span className="detail-value">
                        {selectedCours.formateur.prenom} {selectedCours.formateur.nom}
                      </span>
                    </div>
                  </div>
                )}
                
                {selectedCours.specialite && (
                  <div className="detail-item">
                    <FaGraduationCap className="detail-icon" />
                    <div>
                      <span className="detail-label">Spécialité</span>
                      <span className="detail-value">{selectedCours.specialite.nom}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {selectedCours.groupes && selectedCours.groupes.length > 0 && (
                <div className="modal-section">
                  <h6><FaUsers /> Groupes associés</h6>
                  <div className="groupes-list">
                    {selectedCours.groupes.map(groupe => (
                      <span key={groupe.id} className="groupe-badge">
                        {groupe.nom}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <button 
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Fermer
              </button>
              {isInscrit(selectedCours.id) ? (
                <button 
                  className="btn-danger"
                  onClick={() => {
                    handleDesinscription(selectedCours.id)
                    setShowModal(false)
                  }}
                >
                  <FaTimesCircle /> Se désinscrire
                </button>
              ) : (
                <button 
                  className="btn-primary"
                  onClick={handleInscription}
                  disabled={inscriptionLoading}
                >
                  {inscriptionLoading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Inscription...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Confirmer l'inscription
                    </>
                  )}
                </button>
              )}
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  )
}

export default CoursDisponibles
