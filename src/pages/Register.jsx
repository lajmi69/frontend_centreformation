import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { FaUser, FaLock, FaEnvelope, FaPhone, FaGraduationCap, FaChalkboardTeacher, FaArrowRight, FaIdCard, FaUserPlus } from 'react-icons/fa'

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

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleUserTypeSelect = (type) => {
    setFormData({
      ...formData,
      userType: type
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

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
    <div className="auth-container">
      {/* Left Side - Branding */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="logo">IIT</div>
          <h1>Institut IIT</h1>
          <p>Rejoignez notre communauté</p>
        </div>
        
        <div className="auth-features">
          <div className="auth-feature">
            <div className="auth-feature-icon purple">
              <FaGraduationCap />
            </div>
            <div className="auth-feature-text">
              <h4>Formation de qualité</h4>
              <p>Accédez à des cours dispensés par des experts</p>
            </div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon cyan">
              <FaIdCard />
            </div>
            <div className="auth-feature-text">
              <h4>Inscription simple</h4>
              <p>Créez votre compte en quelques étapes</p>
            </div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon emerald">
              <FaUserPlus />
            </div>
            <div className="auth-feature-text">
              <h4>Accès immédiat</h4>
              <p>Commencez dès votre inscription validée</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="auth-right">
        <div className="auth-card wide">
          <div className="auth-card-header">
            <h2>Créer un compte</h2>
            <p>Rejoignez Institut IIT</p>
          </div>

          {error && (
            <div className="alert-modern error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* User Type Selection */}
            <div className="modern-input-group">
              <label>Je suis un(e) <span style={{color: 'var(--accent-rose)'}}>*</span></label>
              <div className="user-type-selection">
                <div 
                  className={`user-type-card ${formData.userType === 'ETUDIANT' ? 'selected student' : ''}`}
                  onClick={() => handleUserTypeSelect('ETUDIANT')}
                >
                  <input 
                    type="radio" 
                    name="userType" 
                    value="ETUDIANT"
                    checked={formData.userType === 'ETUDIANT'}
                    onChange={() => {}}
                  />
                  <div className="type-icon">
                    <FaGraduationCap />
                  </div>
                  <span className="type-label">Étudiant</span>
                </div>
                <div 
                  className={`user-type-card ${formData.userType === 'FORMATEUR' ? 'selected teacher' : ''}`}
                  onClick={() => handleUserTypeSelect('FORMATEUR')}
                >
                  <input 
                    type="radio" 
                    name="userType" 
                    value="FORMATEUR"
                    checked={formData.userType === 'FORMATEUR'}
                    onChange={() => {}}
                  />
                  <div className="type-icon">
                    <FaChalkboardTeacher />
                  </div>
                  <span className="type-label">Formateur</span>
                </div>
              </div>
            </div>

            {/* Name Fields */}
            <div className="form-row">
              <div className="modern-input-group">
                <label>Nom <span style={{color: 'var(--accent-rose)'}}>*</span></label>
                <div className="modern-input-wrapper">
                  <input
                    type="text"
                    className="modern-input"
                    name="nom"
                    placeholder="Votre nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                  />
                  <FaUser className="input-icon" />
                </div>
              </div>
              <div className="modern-input-group">
                <label>Prénom <span style={{color: 'var(--accent-rose)'}}>*</span></label>
                <div className="modern-input-wrapper">
                  <input
                    type="text"
                    className="modern-input"
                    name="prenom"
                    placeholder="Votre prénom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                  />
                  <FaUser className="input-icon" />
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="modern-input-group">
              <label>Nom d'utilisateur <span style={{color: 'var(--accent-rose)'}}>*</span></label>
              <div className="modern-input-wrapper">
                <input
                  type="text"
                  className="modern-input"
                  name="username"
                  placeholder="Choisissez un identifiant"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                />
                <FaIdCard className="input-icon" />
              </div>
            </div>

            {/* Email */}
            <div className="modern-input-group">
              <label>Email <span style={{color: 'var(--accent-rose)'}}>*</span></label>
              <div className="modern-input-wrapper">
                <input
                  type="email"
                  className="modern-input"
                  name="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FaEnvelope className="input-icon" />
              </div>
            </div>

            {/* Phone (Formateur only) */}
            {formData.userType === 'FORMATEUR' && (
              <div className="modern-input-group">
                <label>Téléphone</label>
                <div className="modern-input-wrapper">
                  <input
                    type="tel"
                    className="modern-input"
                    name="telephone"
                    placeholder="Votre numéro de téléphone"
                    value={formData.telephone}
                    onChange={handleChange}
                  />
                  <FaPhone className="input-icon" />
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div className="form-row">
              <div className="modern-input-group">
                <label>Mot de passe <span style={{color: 'var(--accent-rose)'}}>*</span></label>
                <div className="modern-input-wrapper">
                  <input
                    type="password"
                    className="modern-input"
                    name="password"
                    placeholder="Min. 6 caractères"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <FaLock className="input-icon" />
                </div>
              </div>
              <div className="modern-input-group">
                <label>Confirmer <span style={{color: 'var(--accent-rose)'}}>*</span></label>
                <div className="modern-input-wrapper">
                  <input
                    type="password"
                    className="modern-input"
                    name="confirmPassword"
                    placeholder="Confirmez"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <FaLock className="input-icon" />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-modern btn-modern-primary"
              disabled={loading}
              style={{marginTop: '0.5rem'}}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Inscription...
                </>
              ) : (
                <>
                  Créer mon compte <FaArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Déjà inscrit ? <Link to="/login">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
