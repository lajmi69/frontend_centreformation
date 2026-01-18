import { useState, useEffect } from 'react'
import { FaBook, FaClock, FaCheckCircle, FaTimesCircle, FaPlus, FaUser, FaCalendar, FaHourglassHalf, FaUsers } from 'react-icons/fa'
import { Spinner, Modal, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const MesCours = () => {
  const { user, isEtudiant, isFormateur } = useAuth()
  const [mesInscriptions, setMesInscriptions] = useState([])
  const [coursDisponibles, setCoursDisponibles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loadingCours, setLoadingCours] = useState(false)
  const [inscribing, setInscribing] = useState(null)

  useEffect(() => {
    fetchMesCours()
  }, [])

  const fetchMesCours = async () => {
    try {
      setLoading(true)
      
      if (isEtudiant()) {
        const response = await api.get('/profile')
        // Récupérer les inscriptions de l'étudiant
        if (response.data.inscriptions) {
          setMesInscriptions(response.data.inscriptions)
        }
      } else if (isFormateur()) {
        const response = await api.get('/profile')
        if (response.data.coursDispenses) {
          // Transformer en format similaire pour l'affichage
          const coursFormateur = response.data.coursDispenses.map(c => ({
            cours: c,
            statut: 'FORMATEUR'
          }))
          setMesInscriptions(coursFormateur)
        }
      }
    } catch (err) {
      console.error('Error fetching cours:', err)
      setError('Erreur lors du chargement des cours')
    } finally {
      setLoading(false)
    }
  }

  // Charger les cours disponibles pour inscription
  const loadCoursDisponibles = async () => {
    try {
      setLoadingCours(true)
      const response = await api.get('/cours/all')
      const allCours = response.data || []
      
      // Filtrer les cours où l'étudiant n'est pas déjà inscrit
      const inscritIds = mesInscriptions
        .filter(i => i.statut !== 'ANNULEE')
        .map(i => i.cours?.id)
      
      const disponibles = allCours.filter(c => !inscritIds.includes(c.id))
      setCoursDisponibles(disponibles)
      setShowModal(true)
    } catch (err) {
      console.error('Error loading cours:', err)
      toast.error('Erreur lors du chargement des cours disponibles')
    } finally {
      setLoadingCours(false)
    }
  }

  // S'inscrire à un cours
  const handleInscrire = async (coursId) => {
    try {
      setInscribing(coursId)
      await api.post('/inscriptions/inscrire', {
        etudiantId: user.etudiantId,
        coursId: coursId
      })
      toast.success('Demande d\'inscription envoyée ! Elle sera validée par l\'administration.')
      setShowModal(false)
      fetchMesCours() // Recharger la liste
    } catch (err) {
      console.error('Error inscription:', err)
      const msg = err.response?.data?.message || err.response?.data?.error || "Erreur lors de l'inscription"
      toast.error(msg)
    } finally {
      setInscribing(null)
    }
  }

  // Annuler une inscription
  const handleAnnuler = async (inscriptionId) => {
    if (!window.confirm('Voulez-vous vraiment annuler cette inscription ?')) return
    
    try {
      await api.put(`/inscriptions/${inscriptionId}/annuler`)
      toast.success('Inscription annulée')
      fetchMesCours()
    } catch (err) {
      console.error('Error annulation:', err)
      toast.error("Erreur lors de l'annulation")
    }
  }

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return <span className="badge-modern warning"><FaHourglassHalf /> En attente</span>
      case 'VALIDEE':
        return <span className="badge-modern success"><FaCheckCircle /> Validée</span>
      case 'REFUSEE':
        return <span className="badge-modern danger"><FaTimesCircle /> Refusée</span>
      case 'ANNULEE':
        return <span className="badge-modern danger"><FaTimesCircle /> Annulée</span>
      case 'FORMATEUR':
        return <span className="badge-modern primary"><FaUser /> Formateur</span>
      default:
        return <span className="badge-modern secondary">{statut}</span>
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('fr-FR')
  }

  if (loading) {
    return (
      <div className="page-content">
        <div className="modern-spinner">
          <Spinner animation="border" variant="primary" />
          <p>Chargement de vos cours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1><FaBook style={{marginRight: '0.5rem', color: 'var(--primary-500)'}} /> Mes Cours</h1>
          <p>{isEtudiant() ? 'Consultez vos inscriptions aux cours' : 'Consultez les cours que vous dispensez'}</p>
        </div>
        {isEtudiant() && (
          <button 
            className="btn-modern primary"
            onClick={loadCoursDisponibles}
            disabled={loadingCours}
            style={{ marginTop: '0.5rem' }}
          >
            {loadingCours ? <Spinner size="sm" /> : <FaPlus />}
            S'inscrire à un cours
          </button>
        )}
      </div>

      {error && (
        <div className="alert-modern error">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="modern-table-card">
        {mesInscriptions.length === 0 ? (
          <div className="empty-state">
            <div className="icon">
              <FaBook />
            </div>
            <h4>Aucun cours trouvé</h4>
            <p>
              {isEtudiant() 
                ? "Vous n'êtes inscrit à aucun cours. Cliquez sur 'S'inscrire à un cours' pour commencer."
                : "Vous n'avez aucun cours assigné pour le moment."
              }
            </p>
          </div>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th>Cours</th>
                <th>Formateur</th>
                {isEtudiant() && <th>Groupe</th>}
                {isEtudiant() && <th>Date d'inscription</th>}
                <th>Statut</th>
                {isEtudiant() && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {mesInscriptions.map((inscription, index) => {
                const c = inscription.cours || inscription
                return (
                  <tr key={index}>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--primary-100)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primary-600)',
                          flexShrink: 0
                        }}>
                          <FaBook />
                        </div>
                        <div>
                          <strong style={{color: 'var(--gray-900)'}}>{c.titre}</strong>
                          {c.code && <div style={{fontSize: '0.8rem', color: 'var(--gray-500)'}}>{c.code}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      {c.formateur ? (
                        <span>{c.formateur.prenom} {c.formateur.nom}</span>
                      ) : '-'}
                    </td>
                    {isEtudiant() && (
                      <td>
                        {inscription.groupe ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <FaUsers style={{ color: 'var(--primary-500)' }} /> 
                            {inscription.groupe.nom}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    )}
                    {isEtudiant() && (
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--gray-600)' }}>
                          <FaCalendar /> {formatDate(inscription.dateInscription)}
                        </span>
                      </td>
                    )}
                    <td>{getStatutBadge(inscription.statut)}</td>
                    {isEtudiant() && (
                      <td>
                        {(inscription.statut === 'EN_ATTENTE' || inscription.statut === 'VALIDEE') && (
                          <button 
                            className="btn-modern danger small"
                            onClick={() => handleAnnuler(inscription.id)}
                          >
                            Annuler
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal pour s'inscrire à un cours */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaPlus style={{ marginRight: '0.5rem' }} />
            S'inscrire à un cours
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {coursDisponibles.length === 0 ? (
            <div className="text-center py-4">
              <FaBook size={48} style={{ color: 'var(--gray-400)', marginBottom: '1rem' }} />
              <p>Aucun cours disponible pour inscription.</p>
            </div>
          ) : (
            <div className="list-group">
              {coursDisponibles.map(cours => (
                <div key={cours.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{cours.titre}</strong>
                    <span className="text-muted ms-2">({cours.code})</span>
                    {cours.formateur && (
                      <div className="text-muted small">
                        <FaUser style={{ marginRight: '0.25rem' }} />
                        {cours.formateur.prenom} {cours.formateur.nom}
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleInscrire(cours.id)}
                    disabled={inscribing === cours.id}
                  >
                    {inscribing === cours.id ? (
                      <Spinner size="sm" />
                    ) : (
                      <>S'inscrire</>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default MesCours
