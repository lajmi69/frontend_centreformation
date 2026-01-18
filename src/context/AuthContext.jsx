import { createContext, useContext, useState, useEffect } from 'react'
import AuthService from '../services/AuthService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          const profile = await AuthService.getProfile()
          setUser(profile)
          setToken(storedToken)
        } catch (error) {
          console.error('Session expired', error)
          logout()
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (username, password) => {
    const response = await AuthService.login(username, password)
    const { access_token: newToken, username: userName, roles } = response
    
    localStorage.setItem('token', newToken)
    setToken(newToken)
    
    // Récupérer le profil complet
    const profile = await AuthService.getProfile()
    setUser(profile)
    
    return profile
  }

  const register = async (userData) => {
    return await AuthService.register(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const updateProfile = async (data) => {
    const updatedProfile = await AuthService.updateProfile(data)
    setUser(prev => ({ ...prev, ...updatedProfile }))
    return updatedProfile
  }

  const changePassword = async (passwordData) => {
    return await AuthService.changePassword(passwordData)
  }

  const hasRole = (role) => {
    if (!user?.roles) return false
    // Accepter les deux formats: ROLE_XXX ou XXX
    const roleWithPrefix = role.startsWith('ROLE_') ? role : `ROLE_${role}`
    const roleWithoutPrefix = role.startsWith('ROLE_') ? role.substring(5) : role
    return user.roles.includes(roleWithPrefix) || user.roles.includes(roleWithoutPrefix)
  }

  const isAdmin = () => hasRole('ADMIN')
  const isFormateur = () => hasRole('FORMATEUR')
  const isEtudiant = () => hasRole('ETUDIANT')

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    isAdmin,
    isFormateur,
    isEtudiant,
    isAuthenticated: !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
