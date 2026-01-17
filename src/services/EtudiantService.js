import api from './api'

const EtudiantService = {
  getAll: async () => {
    const response = await api.get('/etudiants')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/etudiants/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/etudiants', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/etudiants/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    await api.delete(`/etudiants/${id}`)
  },

  getByGroupe: async (groupeId) => {
    const response = await api.get(`/etudiants/groupe/${groupeId}`)
    return response.data
  },

  getBySpecialite: async (specialiteId) => {
    const response = await api.get(`/etudiants/specialite/${specialiteId}`)
    return response.data
  }
}

export default EtudiantService
