import api from './api'

const CoursService = {
  getAll: async () => {
    const response = await api.get('/cours')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/cours/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/cours', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/cours/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    await api.delete(`/cours/${id}`)
  },

  getByFormateur: async (formateurId) => {
    const response = await api.get(`/cours/formateur/${formateurId}`)
    return response.data
  }
}

export default CoursService
