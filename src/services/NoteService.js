import api from './api'

const NoteService = {
  getAll: async () => {
    const response = await api.get('/notes')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/notes/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/notes', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/notes/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    await api.delete(`/notes/${id}`)
  },

  getByEtudiant: async (etudiantId) => {
    const response = await api.get(`/notes/etudiant/${etudiantId}`)
    return response.data
  },

  getByCours: async (coursId) => {
    const response = await api.get(`/notes/cours/${coursId}`)
    return response.data
  },

  getMoyenneEtudiant: async (etudiantId) => {
    const response = await api.get(`/notes/etudiant/${etudiantId}/moyenne`)
    return response.data
  }
}

export default NoteService
