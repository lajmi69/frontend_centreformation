import api from './api'

const StatistiquesService = {
  getGenerales: async () => {
    const response = await api.get('/stats/dashboard')
    return response.data
  },

  getStatistiquesParSpecialite: async () => {
    const response = await api.get('/stats/par-specialite')
    return response.data
  },

  getStatistiquesParCours: async () => {
    const response = await api.get('/stats/cours-populaires')
    return response.data
  },

  getStatistiquesParFormateur: async () => {
    const response = await api.get('/stats/par-formateur')
    return response.data
  },

  getStatistiquesParSession: async () => {
    const response = await api.get('/stats/inscriptions')
    return response.data
  }
}

export default StatistiquesService
