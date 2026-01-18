import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { FaUser, FaLock, FaGraduationCap, FaChalkboardTeacher, FaArrowRight, FaBook } from 'react-icons/fa'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      toast.success('Connexion réussie!')
      navigate('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.error || 'Identifiants invalides')
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
          <p>Plateforme de gestion de formation</p>
        </div>
        
        <div className="auth-features">
          <div className="auth-feature">
            <div className="auth-feature-icon purple">
              <FaGraduationCap />
            </div>
            <div className="auth-feature-text">
              <h4>Espace Étudiant</h4>
              <p>Accédez à vos cours et suivez vos notes</p>
            </div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon cyan">
              <FaChalkboardTeacher />
            </div>
            <div className="auth-feature-text">
              <h4>Espace Formateur</h4>
              <p>Gérez vos séances et évaluez vos étudiants</p>
            </div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon emerald">
              <FaBook />
            </div>
            <div className="auth-feature-text">
              <h4>Suivi Complet</h4>
              <p>Consultez votre progression en temps réel</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Connexion</h2>
            <p>Accédez à votre espace personnel</p>
          </div>

          {error && (
            <div className="alert-modern error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="modern-input-group">
              <label>Nom d'utilisateur</label>
              <div className="modern-input-wrapper">
                <input
                  type="text"
                  className="modern-input"
                  placeholder="Entrez votre identifiant"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
                <FaUser className="input-icon" />
              </div>
            </div>

            <div className="modern-input-group">
              <label>Mot de passe</label>
              <div className="modern-input-wrapper">
                <input
                  type="password"
                  className="modern-input"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <FaLock className="input-icon" />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-modern btn-modern-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter <FaArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Pas encore inscrit ? <Link to="/register">Créer un compte</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
