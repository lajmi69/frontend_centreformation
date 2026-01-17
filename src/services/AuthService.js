import api from './api'

const AuthService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password })
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/profile')
    return response.data
  },

  updateProfile: async (data) => {
    const response = await api.put('/profile', data)
    return response.data
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/profile/password', passwordData)
    return response.data
  }
}

export default AuthService
