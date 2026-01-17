import api from './api'

const InscriptionService = {
  getAll: async () => {
    const response = await api.get('/inscriptions')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/inscriptions/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/inscriptions', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/inscriptions/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    await api.delete(`/inscriptions/${id}`)
  },

  getByEtudiant: async (etudiantId) => {
    const response = await api.get(`/inscriptions/etudiant/${etudiantId}`)
    return response.data
  },

  getByCours: async (coursId) => {
    const response = await api.get(`/inscriptions/cours/${coursId}`)
    return response.data
  },

  inscrire: async (etudiantId, coursId) => {
    const response = await api.post('/inscriptions/inscrire', null, {
      params: { etudiantId, coursId }
    })
    return response.data
  },

  desinscrire: async (etudiantId, coursId) => {
    await api.delete('/inscriptions/desinscrire', {
      params: { etudiantId, coursId }
    })
  }
}

export default InscriptionService
