import { useState, useEffect } from 'react'
import { FaGraduationCap, FaChartLine, FaBook, FaComment } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const MesNotes = () => {
  const { user, isEtudiant } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [moyenne, setMoyenne] = useState(null)

  useEffect(() => {
    const fetchMesNotes = async () => {
      try {
        const response = await api.get('/profile')
        if (response.data.notes) {
          setNotes(response.data.notes)
          if (response.data.notes.length > 0) {
            const sum = response.data.notes.reduce((acc, n) => acc + n.valeur, 0)
            setMoyenne(sum / response.data.notes.length)
          }
        }
      } catch (err) {
        console.error('Error fetching notes:', err)
        setError('Erreur lors du chargement des notes')
      } finally {
        setLoading(false)
      }
    }

    if (isEtudiant()) {
      fetchMesNotes()
    } else {
      setLoading(false)
    }
  }, [isEtudiant])

  const getBadgeColor = (note) => {
    if (note >= 16) return 'success'
    if (note >= 12) return 'primary'
    if (note >= 10) return 'warning'
    return 'danger'
  }

  const getMoyenneStyle = (moy) => {
    if (moy >= 16) return { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }
    if (moy >= 12) return { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white' }
    if (moy >= 10) return { background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }
    return { background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', color: 'white' }
  }

  if (loading) {
    return (
      <div className="page-content">
        <div className="modern-spinner">
          <div className="spinner"></div>
          <p>Chargement de vos notes...</p>
        </div>
      </div>
    )
  }

  if (!isEtudiant()) {
    return (
      <div className="page-content">
        <div className="alert-modern error">
          <span>⚠️</span> Cette page est réservée aux étudiants.
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem'}}>
        <div className="page-header" style={{marginBottom: 0}}>
          <h1><FaGraduationCap style={{marginRight: '0.5rem', color: 'var(--accent-emerald)'}} /> Mes Notes</h1>
          <p>Consultez vos notes et votre moyenne générale</p>
        </div>
        
        {moyenne !== null && (
          <div style={{
            ...getMoyenneStyle(moyenne),
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <FaChartLine style={{fontSize: '1.5rem'}} />
            <div>
              <div style={{fontSize: '0.75rem', opacity: 0.9}}>Moyenne générale</div>
              <div style={{fontSize: '1.5rem', fontWeight: '700'}}>{moyenne.toFixed(2)}/20</div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="alert-modern error">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="modern-table-card">
        {notes.length === 0 ? (
          <div className="empty-state">
            <div className="icon">
              <FaGraduationCap />
            </div>
            <h4>Aucune note enregistrée</h4>
            <p>Vous n'avez pas encore de notes pour le moment.</p>
          </div>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th>Cours</th>
                <th>Note</th>
                <th>Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note, index) => (
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
                        <strong style={{color: 'var(--gray-900)'}}>{note.coursTitre || 'N/A'}</strong>
                        {note.coursCode && <div style={{fontSize: '0.8rem', color: 'var(--gray-500)'}}>{note.coursCode}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge-modern ${getBadgeColor(note.valeur)}`} style={{fontSize: '1rem', padding: '0.5rem 1rem'}}>
                      {note.valeur}/20
                    </span>
                  </td>
                  <td>
                    {note.commentaire ? (
                      <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-600)'}}>
                        <FaComment style={{color: 'var(--gray-400)'}} /> {note.commentaire}
                      </span>
                    ) : (
                      <span style={{color: 'var(--gray-400)'}}>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default MesNotes
