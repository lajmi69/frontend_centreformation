import { useState } from 'react'
import { Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap'
import { FaUser, FaKey } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth()
  
  // Vérifier si l'utilisateur a un profil étudiant/formateur lié
  const hasLinkedProfile = user?.prenom && user?.prenom !== ''
  
  const [profileData, setProfileData] = useState({
    email: user?.email || ''
  })
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileLoading(true)

    try {
      await updateProfile(profileData)
      toast.success('Profil mis à jour avec succès!')
    } catch (err) {
      console.error('Profile update error:', err)
      setProfileError(err.response?.data?.error || 'Erreur lors de la mise à jour')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setPasswordLoading(true)

    try {
      await changePassword(passwordData)
      toast.success('Mot de passe modifié avec succès!')
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      console.error('Password change error:', err)
      setPasswordError(err.response?.data?.error || 'Erreur lors du changement de mot de passe')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div>
      <h2 className="mb-4">Mon Profil</h2>

      <Row>
        {/* Profile Information */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <FaUser className="me-2" />
              Informations personnelles
            </Card.Header>
            <Card.Body>
              {profileError && <Alert variant="danger">{profileError}</Alert>}
              
              <Form onSubmit={handleProfileSubmit}>
                {/* Afficher nom/prénom en lecture seule si lié à Etudiant/Formateur */}
                {hasLinkedProfile && (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                          type="text"
                          value={user?.prenom || ''}
                          disabled
                          className="bg-light"
                        />
                        <Form.Text className="text-muted">
                          Modifiable par l'administration
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                          type="text"
                          value={user?.nom || ''}
                          disabled
                          className="bg-light"
                        />
                        <Form.Text className="text-muted">
                          Modifiable par l'administration
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Identifiant</Form.Label>
                  <Form.Control
                    type="text"
                    value={user?.username || ''}
                    disabled
                    className="bg-light"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Rôle</Form.Label>
                  <Form.Control
                    type="text"
                    value={user?.type || ''}
                    disabled
                    className="bg-light"
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={profileLoading}
                >
                  {profileLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Enregistrement...
                    </>
                  ) : (
                    'Enregistrer les modifications'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Change Password */}
        <Col md={6}>
          <Card>
            <Card.Header>
              <FaKey className="me-2" />
              Changer le mot de passe
            </Card.Header>
            <Card.Body>
              {passwordError && <Alert variant="danger">{passwordError}</Alert>}
              
              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Mot de passe actuel</Form.Label>
                  <Form.Control
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nouveau mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                  />
                  <Form.Text className="text-muted">
                    Minimum 6 caractères
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="warning"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Modification...
                    </>
                  ) : (
                    'Changer le mot de passe'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Profile
