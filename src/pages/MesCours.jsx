import { useState, useEffect } from 'react'
import { Card, Table, Spinner, Alert, Badge } from 'react-bootstrap'
import { FaBook } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const MesCours = () => {
  const { user, isEtudiant, isFormateur } = useAuth()
  const [cours, setCours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMesCours = async () => {
      try {
        let response
        if (isEtudiant()) {
          // Récupérer les cours via les inscriptions de l'étudiant
          response = await api.get('/api/profile')
          // Les cours de l'étudiant seront dans son profil ou via inscriptions
          if (response.data.inscriptions) {
            setCours(response.data.inscriptions.map(i => ({
              ...i.cours,
              dateInscription: i.dateInscription,
              statut: i.statut
            })))
          }
        } else if (isFormateur()) {
          // Récupérer les cours du formateur
          response = await api.get('/api/profile')
          if (response.data.coursDispenses) {
            setCours(response.data.coursDispenses)
          }
        }
      } catch (err) {
        console.error('Error fetching cours:', err)
        setError('Erreur lors du chargement des cours')
      } finally {
        setLoading(false)
      }
    }

    fetchMesCours()
  }, [isEtudiant, isFormateur])

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><FaBook className="me-2" /> Mes Cours</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          {cours.length === 0 ? (
            <Alert variant="info">
              {isEtudiant() 
                ? "Vous n'êtes inscrit à aucun cours pour le moment."
                : "Vous n'avez aucun cours assigné pour le moment."
              }
            </Alert>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Durée</th>
                  {isEtudiant() && <th>Date inscription</th>}
                  {isEtudiant() && <th>Statut</th>}
                </tr>
              </thead>
              <tbody>
                {cours.map((c, index) => (
                  <tr key={index}>
                    <td><strong>{c.titre}</strong></td>
                    <td>{c.description}</td>
                    <td>{c.duree} heures</td>
                    {isEtudiant() && <td>{c.dateInscription}</td>}
                    {isEtudiant() && (
                      <td>
                        <Badge bg={c.statut === 'CONFIRMEE' ? 'success' : 'warning'}>
                          {c.statut}
                        </Badge>
                      </td>
                    )}
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

export default MesCours
