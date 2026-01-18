import { useState, useEffect } from 'react'
import { Spinner, Badge } from 'react-bootstrap'
import { 
  FaClipboardList,
  FaBook,
  FaUserGraduate,
  FaSave,
  FaSearch,
  FaCheck,
  FaTimes,
  FaEdit
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import './SaisieNotes.css'

const SaisieNotes = () => {
  const { user, isFormateur, isAdmin } = useAuth()
  const [mesCours, setMesCours] = useState([])
  const [selectedCours, setSelectedCours] = useState(null)
  const [etudiants, setEtudiants] = useState([])
  const [notes, setNotes] = useState({}) // Map etudiantId -> note data
  const [editingNotes, setEditingNotes] = useState({}) // Notes en cours d'édition
  const [loading, setLoading] = useState(true)
  const [loadingEtudiants, setLoadingEtudiants] = useState(false)
  const [savingNote, setSavingNote] = useState(null)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchMesCours()
  }, [])

  const fetchMesCours = async () => {
    try {
      setLoading(true)
      let response
      
      if (isAdmin()) {
        response = await api.get('/cours/all')
        setMesCours(response.data || [])
      } else if (isFormateur() && user?.formateurId) {
        response = await api.get(`/cours/formateur/${user.formateurId}/all`)
        setMesCours(response.data || [])
      }
      setError('')
    } catch (err) {
      console.error('Error fetching cours:', err)
      setError('Erreur lors du chargement des cours')
    } finally {
      setLoading(false)
    }
  }

  const fetchEtudiantsCours = async (coursId) => {
    try {
      setLoadingEtudiants(true)
      
      // Récupérer les inscriptions pour ce cours
      const inscriptionsResponse = await api.get(`/inscriptions/cours/${coursId}`)
      const inscriptions = inscriptionsResponse.data || []
      
      // Extraire les étudiants des inscriptions (seulement les actives)
      const etudiantsInscrits = inscriptions
        .filter(insc => insc.statut !== 'ANNULEE')
        .map(insc => insc.etudiant)
        .filter(e => e)
      
      // Récupérer les notes existantes pour ce cours
      const notesResponse = await api.get(`/notes/cours/${coursId}`)
      const existingNotes = notesResponse.data || []
      
      // Créer un map des notes par étudiant
      const notesMap = {}
      existingNotes.forEach(note => {
        if (note.etudiant?.id) {
          notesMap[note.etudiant.id] = {
            id: note.id,
            valeur: note.valeur,
            commentaire: note.commentaire || ''
          }
        }
      })
      
      setEtudiants(etudiantsInscrits)
      setNotes(notesMap)
      setEditingNotes({})
      setSearchTerm('')
    } catch (err) {
      console.error('Error fetching etudiants:', err)
      toast.error('Erreur lors du chargement des étudiants')
    } finally {
      setLoadingEtudiants(false)
    }
  }

  const handleCoursSelect = (cours) => {
    setSelectedCours(cours)
    fetchEtudiantsCours(cours.id)
  }

  // Commencer l'édition d'une note
  const startEdit = (etudiantId) => {
    const existingNote = notes[etudiantId]
    setEditingNotes(prev => ({
      ...prev,
      [etudiantId]: {
        valeur: existingNote?.valeur ?? '',
        commentaire: existingNote?.commentaire ?? ''
      }
    }))
  }

  // Annuler l'édition
  const cancelEdit = (etudiantId) => {
    setEditingNotes(prev => {
      const newState = { ...prev }
      delete newState[etudiantId]
      return newState
    })
  }

  // Mettre à jour une valeur en édition
  const handleNoteChange = (etudiantId, field, value) => {
    setEditingNotes(prev => ({
      ...prev,
      [etudiantId]: {
        ...prev[etudiantId],
        [field]: value
      }
    }))
  }

  // Sauvegarder une note
  const saveNote = async (etudiantId) => {
    const editData = editingNotes[etudiantId]
    if (!editData) return
    
    const valeur = parseFloat(editData.valeur)
    if (isNaN(valeur) || valeur < 0 || valeur > 20) {
      toast.error('La note doit être comprise entre 0 et 20')
      return
    }
    
    try {
      setSavingNote(etudiantId)
      
      const existingNote = notes[etudiantId]
      
      if (existingNote?.id) {
        // Modifier une note existante
        await api.put(`/notes/${existingNote.id}`, {
          valeur: valeur,
          commentaire: editData.commentaire || ''
        })
        toast.success('Note modifiée avec succès')
      } else {
        // Créer une nouvelle note
        await api.post('/notes/saisir', {
          etudiantId: etudiantId,
          coursId: selectedCours.id,
          valeur: valeur,
          commentaire: editData.commentaire || ''
        })
        toast.success('Note enregistrée avec succès')
      }
      
      // Rafraîchir les notes
      await fetchEtudiantsCours(selectedCours.id)
      
    } catch (err) {
      console.error('Error saving note:', err)
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Erreur lors de l\'enregistrement'
      toast.error(errorMsg)
    } finally {
      setSavingNote(null)
    }
  }

  // Vérifier si une note est en cours d'édition
  const isEditing = (etudiantId) => {
    return editingNotes[etudiantId] !== undefined
  }

  // Filtrer les étudiants par recherche
  const filteredEtudiants = etudiants.filter(etudiant => {
    const fullName = `${etudiant.nom} ${etudiant.prenom} ${etudiant.matricule || ''}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase())
  })

  // Calculer les statistiques
  const stats = {
    total: etudiants.length,
    notes: Object.keys(notes).length,
    moyenne: Object.values(notes).length > 0
      ? (Object.values(notes).reduce((sum, n) => sum + (n.valeur || 0), 0) / Object.values(notes).length).toFixed(2)
      : '-',
    reussite: Object.values(notes).length > 0
      ? Math.round((Object.values(notes).filter(n => n.valeur >= 10).length / Object.values(notes).length) * 100)
      : 0
  }

  // Couleur selon la note
  const getNoteClass = (valeur) => {
    if (valeur === null || valeur === undefined) return ''
    if (valeur >= 16) return 'excellent'
    if (valeur >= 14) return 'good'
    if (valeur >= 10) return 'passing'
    return 'failing'
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="saisie-notes">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <FaClipboardList className="header-icon" />
          <div>
            <h1>Gestion des Notes</h1>
            <p>Saisir et gérer les notes des étudiants</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <div className="saisie-notes-layout">
        {/* Liste des cours (sidebar) */}
        <div className="cours-sidebar">
          <h5 className="sidebar-title">
            <FaBook /> {isAdmin() ? 'Tous les Cours' : 'Mes Cours'}
          </h5>
          
          {mesCours.length === 0 ? (
            <div className="no-cours">
              <p>Aucun cours disponible</p>
            </div>
          ) : (
            <div className="cours-list">
              {mesCours.map(cours => (
                <div 
                  key={cours.id}
                  className={`cours-item ${selectedCours?.id === cours.id ? 'active' : ''}`}
                  onClick={() => handleCoursSelect(cours)}
                >
                  <span className="cours-code">{cours.code}</span>
                  <span className="cours-name">{cours.titre}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Zone principale */}
        <div className="notes-main">
          {!selectedCours ? (
            <div className="select-cours-prompt">
              <FaBook size={48} />
              <h4>Sélectionnez un cours</h4>
              <p>Choisissez un cours dans la liste pour gérer les notes</p>
            </div>
          ) : (
            <>
              {/* En-tête du cours */}
              <div className="selected-cours-header">
                <div className="cours-info">
                  <span className="code-badge">{selectedCours.code}</span>
                  <h3>{selectedCours.titre}</h3>
                </div>
              </div>

              {/* Statistiques */}
              <div className="notes-stats">
                <div className="stat-card">
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-label">Étudiants</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.notes}</div>
                  <div className="stat-label">Notes saisies</div>
                </div>
                <div className="stat-card highlight">
                  <div className="stat-value">{stats.moyenne}</div>
                  <div className="stat-label">Moyenne</div>
                </div>
                <div className="stat-card success">
                  <div className="stat-value">{stats.reussite}%</div>
                  <div className="stat-label">Taux réussite</div>
                </div>
              </div>

              {/* Recherche */}
              <div className="notes-search">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher un étudiant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Liste des étudiants */}
              {loadingEtudiants ? (
                <div className="loading-etudiants">
                  <Spinner animation="border" size="sm" />
                  <span>Chargement des étudiants...</span>
                </div>
              ) : filteredEtudiants.length === 0 ? (
                <div className="no-etudiants">
                  <FaUserGraduate size={32} />
                  <p>Aucun étudiant inscrit à ce cours</p>
                </div>
              ) : (
                <div className="etudiants-list">
                  {filteredEtudiants.map(etudiant => {
                    const note = notes[etudiant.id]
                    const editing = isEditing(etudiant.id)
                    const editData = editingNotes[etudiant.id]
                    const saving = savingNote === etudiant.id
                    
                    return (
                      <div 
                        key={etudiant.id} 
                        className={`etudiant-row ${note ? 'has-note' : ''} ${editing ? 'editing' : ''}`}
                      >
                        {/* Info étudiant */}
                        <div className="etudiant-info">
                          <div className="etudiant-avatar">
                            {etudiant.prenom?.[0]}{etudiant.nom?.[0]}
                          </div>
                          <div className="etudiant-details">
                            <span className="etudiant-name">
                              {etudiant.prenom} {etudiant.nom}
                            </span>
                            <span className="etudiant-matricule">
                              {etudiant.matricule}
                            </span>
                          </div>
                        </div>

                        {/* Zone de note */}
                        <div className="note-zone">
                          {editing ? (
                            // Mode édition
                            <div className="note-edit-form">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={editData?.valeur ?? ''}
                                onChange={(e) => handleNoteChange(etudiant.id, 'valeur', e.target.value)}
                                className="note-input"
                                placeholder="Note /20"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={editData?.commentaire ?? ''}
                                onChange={(e) => handleNoteChange(etudiant.id, 'commentaire', e.target.value)}
                                className="comment-input"
                                placeholder="Commentaire (optionnel)"
                              />
                              <div className="edit-actions">
                                <button 
                                  className="btn-save"
                                  onClick={() => saveNote(etudiant.id)}
                                  disabled={saving}
                                  title="Enregistrer"
                                >
                                  {saving ? <Spinner size="sm" /> : <FaCheck />}
                                </button>
                                <button 
                                  className="btn-cancel"
                                  onClick={() => cancelEdit(etudiant.id)}
                                  title="Annuler"
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            </div>
                          ) : note ? (
                            // Affichage de la note existante
                            <div className="note-display">
                              <span className={`note-value ${getNoteClass(note.valeur)}`}>
                                {note.valeur}/20
                              </span>
                              {note.commentaire && (
                                <span className="note-comment" title={note.commentaire}>
                                  {note.commentaire.substring(0, 30)}{note.commentaire.length > 30 ? '...' : ''}
                                </span>
                              )}
                              <button 
                                className="btn-edit"
                                onClick={() => startEdit(etudiant.id)}
                                title="Modifier"
                              >
                                <FaEdit />
                              </button>
                            </div>
                          ) : (
                            // Pas de note - bouton saisir
                            <div className="note-empty">
                              <span className="no-note-text">Non noté</span>
                              <button 
                                className="btn-saisir"
                                onClick={() => startEdit(etudiant.id)}
                              >
                                <FaSave /> Saisir
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SaisieNotes
