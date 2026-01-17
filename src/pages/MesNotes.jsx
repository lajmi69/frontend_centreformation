import { useState, useEffect } from 'react'
import { Card, Table, Spinner, Alert, Badge } from 'react-bootstrap'
import { FaGraduationCap } from 'react-icons/fa'
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
        // Récupérer le profil qui contient les notes
        const response = await api.get('/api/profile')
        if (response.data.notes) {
          setNotes(response.data.notes)
          // Calculer la moyenne
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

  const getBadgeVariant = (note) => {
    if (note >= 16) return 'success'
    if (note >= 12) return 'primary'
    if (note >= 10) return 'warning'
    return 'danger'
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  if (!isEtudiant()) {
    return (
      <Alert variant="warning">
        Cette page est réservée aux étudiants.
      </Alert>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><FaGraduationCap className="me-2" /> Mes Notes</h2>
        {moyenne !== null && (
          <Badge bg={getBadgeVariant(moyenne)} className="fs-5 p-2">
            Moyenne: {moyenne.toFixed(2)}/20
          </Badge>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          {notes.length === 0 ? (
            <Alert variant="info">
              Vous n'avez pas encore de notes enregistrées.
            </Alert>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Cours</th>
                  <th>Note</th>
                  <th>Commentaire</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note, index) => (
                  <tr key={index}>
                    <td><strong>{note.cours?.titre || 'N/A'}</strong></td>
                    <td>
                      <Badge bg={getBadgeVariant(note.valeur)} className="fs-6">
                        {note.valeur}/20
                      </Badge>
                    </td>
                    <td>{note.commentaire || '-'}</td>
                    <td>{note.dateNote || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default MesNotes
