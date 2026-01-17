import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    userType: '',
    nom: '',
    prenom: '',
    telephone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    // Validate user type
    if (!formData.userType) {
      setError('Veuillez sélectionner votre type de compte')
      return
    }

    setLoading(true)

    try {
      await register({
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        email: formData.email,
        userType: formData.userType,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone || null
      })
      toast.success('Compte créé avec succès! Vous pouvez vous connecter.')
      navigate('/login')
    } catch (err) {
      console.error('Register error:', err)
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '550px' }}>
        <div className="login-logo">
          <h2>🎓 Centre Formation</h2>
          <p className="text-muted">Créez votre compte</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Type d'utilisateur */}
          <Form.Group className="mb-3">
            <Form.Label>Je suis un(e) <span className="text-danger">*</span></Form.Label>
            <div className="d-flex gap-3">
              <Form.Check
                type="radio"
                id="etudiant"
                name="userType"
                value="ETUDIANT"
                label="📚 Étudiant"
                checked={formData.userType === 'ETUDIANT'}
                onChange={handleChange}
                className="flex-fill p-3 border rounded"
                style={{ 
                  backgroundColor: formData.userType === 'ETUDIANT' ? '#e3f2fd' : 'transparent',
                  cursor: 'pointer'
                }}
              />
              <Form.Check
                type="radio"
                id="formateur"
                name="userType"
                value="FORMATEUR"
                label="👨‍🏫 Formateur"
                checked={formData.userType === 'FORMATEUR'}
                onChange={handleChange}
                className="flex-fill p-3 border rounded"
                style={{ 
                  backgroundColor: formData.userType === 'FORMATEUR' ? '#e8f5e9' : 'transparent',
                  cursor: 'pointer'
                }}
              />
            </div>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nom <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="nom"
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prénom <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="prenom"
                  placeholder="Votre prénom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Nom d'utilisateur <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Choisissez un nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Téléphone (affiché uniquement pour les formateurs) */}
          {formData.userType === 'FORMATEUR' && (
            <Form.Group className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="tel"
                name="telephone"
                placeholder="Votre numéro de téléphone"
                value={formData.telephone}
                onChange={handleChange}
              />
            </Form.Group>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mot de passe <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Min. 6 caractères"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Confirmer <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmez"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Inscription...
              </>
            ) : (
              'S\'inscrire'
            )}
          </Button>
        </Form>

        <div className="text-center mt-4">
          <p className="text-muted mb-0">
            Déjà un compte? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
