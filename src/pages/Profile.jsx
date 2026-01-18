import { useState } from 'react'
import { FaUser, FaKey, FaEnvelope, FaIdCard, FaUserTag, FaSave, FaLock, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const Profile = () => {
  const { user, updateProfile, changePassword, isEtudiant } = useAuth()
  
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

  const getInitials = () => {
    if (user?.prenom && user?.nom) {
      return `${user.prenom[0]}${user.nom[0]}`.toUpperCase()
    }
    return user?.username?.[0]?.toUpperCase() || 'U'
  }

  const displayName = user?.prenom 
    ? `${user.prenom} ${user.nom}` 
    : (user?.nom || user?.username)

  return (
    <div className="page-content">
      <div className="page-header">
        <h1><FaUser style={{marginRight: '0.5rem', color: 'var(--primary-500)'}} /> Mon Profil</h1>
        <p>Gérez vos informations personnelles et votre sécurité</p>
      </div>

      {/* Profile Header Card */}
      <div className="profile-card-modern" style={{marginBottom: '1.5rem'}}>
        <div className="profile-header-section">
          <div className="profile-avatar-large">{getInitials()}</div>
          <h3>{displayName}</h3>
          <span className="role-badge">
            {isEtudiant() ? <FaGraduationCap /> : <FaChalkboardTeacher />}
            {user?.type}
          </span>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem'}}>
        {/* Profile Information Form */}
        <div className="modern-table-card">
          <div className="card-header">
            <h3><FaUser /> Informations personnelles</h3>
          </div>
          <div className="card-body" style={{padding: '1.5rem'}}>
            {profileError && (
              <div className="alert-modern error" style={{marginBottom: '1rem'}}>
                <span>⚠️</span> {profileError}
              </div>
            )}
            
            <form onSubmit={handleProfileSubmit}>
              {hasLinkedProfile && (
                <div className="form-row" style={{marginBottom: '1rem'}}>
                  <div className="modern-input-group">
                    <label>Prénom</label>
                    <div className="modern-input-wrapper">
                      <input
                        type="text"
                        className="modern-input"
                        value={user?.prenom || ''}
                        disabled
                        style={{background: 'var(--gray-100)', cursor: 'not-allowed'}}
                      />
                      <FaUser className="input-icon" />
                    </div>
                    <small style={{color: 'var(--gray-500)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block'}}>
                      Modifiable par l'administration
                    </small>
                  </div>
                  <div className="modern-input-group">
                    <label>Nom</label>
                    <div className="modern-input-wrapper">
                      <input
                        type="text"
                        className="modern-input"
                        value={user?.nom || ''}
                        disabled
                        style={{background: 'var(--gray-100)', cursor: 'not-allowed'}}
                      />
                      <FaUser className="input-icon" />
                    </div>
                    <small style={{color: 'var(--gray-500)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block'}}>
                      Modifiable par l'administration
                    </small>
                  </div>
                </div>
              )}

              <div className="modern-input-group">
                <label>Identifiant</label>
                <div className="modern-input-wrapper">
                  <input
                    type="text"
                    className="modern-input"
                    value={user?.username || ''}
                    disabled
                    style={{background: 'var(--gray-100)', cursor: 'not-allowed'}}
                  />
                  <FaIdCard className="input-icon" />
                </div>
              </div>

              <div className="modern-input-group">
                <label>Email</label>
                <div className="modern-input-wrapper">
                  <input
                    type="email"
                    className="modern-input"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                  />
                  <FaEnvelope className="input-icon" />
                </div>
              </div>

              <div className="modern-input-group">
                <label>Rôle</label>
                <div className="modern-input-wrapper">
                  <input
                    type="text"
                    className="modern-input"
                    value={user?.type || ''}
                    disabled
                    style={{background: 'var(--gray-100)', cursor: 'not-allowed'}}
                  />
                  <FaUserTag className="input-icon" />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-modern btn-modern-primary"
                disabled={profileLoading}
                style={{marginTop: '0.5rem'}}
              >
                {profileLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm"></span>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <FaSave /> Enregistrer les modifications
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="modern-table-card">
          <div className="card-header">
            <h3><FaKey /> Changer le mot de passe</h3>
          </div>
          <div className="card-body" style={{padding: '1.5rem'}}>
            {passwordError && (
              <div className="alert-modern error" style={{marginBottom: '1rem'}}>
                <span>⚠️</span> {passwordError}
              </div>
            )}
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="modern-input-group">
                <label>Mot de passe actuel</label>
                <div className="modern-input-wrapper">
                  <input
                    type="password"
                    className="modern-input"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Entrez votre mot de passe actuel"
                  />
                  <FaLock className="input-icon" />
                </div>
              </div>

              <div className="modern-input-group">
                <label>Nouveau mot de passe</label>
                <div className="modern-input-wrapper">
                  <input
                    type="password"
                    className="modern-input"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    placeholder="Minimum 6 caractères"
                  />
                  <FaLock className="input-icon" />
                </div>
                <small style={{color: 'var(--gray-500)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block'}}>
                  Minimum 6 caractères
                </small>
              </div>

              <div className="modern-input-group">
                <label>Confirmer le nouveau mot de passe</label>
                <div className="modern-input-wrapper">
                  <input
                    type="password"
                    className="modern-input"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Confirmez le nouveau mot de passe"
                  />
                  <FaLock className="input-icon" />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-modern btn-modern-primary"
                disabled={passwordLoading}
                style={{marginTop: '0.5rem', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'}}
              >
                {passwordLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm"></span>
                    Modification...
                  </>
                ) : (
                  <>
                    <FaKey /> Changer le mot de passe
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
