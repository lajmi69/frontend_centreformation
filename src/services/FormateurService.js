import api from './api'

const FormateurService = {
  getAll: async () => {
    const response = await api.get('/formateurs')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/formateurs/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/formateurs', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/formateurs/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    await api.delete(`/formateurs/${id}`)
  },

  getBySpecialite: async (specialiteId) => {
    const response = await api.get(`/formateurs/specialite/${specialiteId}`)
    return response.data
  }
}

export default FormateurService
