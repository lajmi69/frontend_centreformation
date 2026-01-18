import { useState, useEffect, useMemo } from 'react'
import { Spinner, Alert } from 'react-bootstrap'
import { 
  FaCalendarAlt, 
  FaChevronLeft, 
  FaChevronRight, 
  FaClock,
  FaMapMarkerAlt,
  FaUserTie,
  FaBook,
  FaUsers,
  FaCalendarWeek,
  FaCalendarDay,
  FaList
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import './EmploiDuTemps.css'

const EmploiDuTemps = () => {
  const { user, isEtudiant, isFormateur } = useAuth()
  const [seances, setSeances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('week') // 'week', 'day', 'list'

  // Jours de la semaine
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const joursShort = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  
  // Heures de la journée (8h - 19h)
  const heures = Array.from({ length: 12 }, (_, i) => i + 8)

  // Calculer le début et la fin de la semaine courante
  const getWeekRange = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Ajuster si dimanche
    const debut = new Date(d.setDate(diff))
    const fin = new Date(debut)
    fin.setDate(debut.getDate() + 5) // Samedi
    return { debut, fin }
  }

  const { debut: weekStart, fin: weekEnd } = useMemo(() => getWeekRange(currentDate), [currentDate])

  // Générer les jours de la semaine avec leurs dates
  const weekDays = useMemo(() => {
    const days = []
    const start = new Date(weekStart)
    for (let i = 0; i < 6; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      days.push(d)
    }
    return days
  }, [weekStart])

  useEffect(() => {
    const fetchEmploiDuTemps = async () => {
      try {
        setLoading(true)
        
        // Utiliser l'API profile qui retourne maintenant l'emploi du temps
        const response = await api.get('/profile')
        
        if (response?.data?.emploiDuTemps) {
          // Filtrer les séances pour la semaine courante
          const debutStr = weekStart.toISOString().split('T')[0]
          const finStr = weekEnd.toISOString().split('T')[0]
          
          const seancesFiltrees = response.data.emploiDuTemps.filter(s => {
            return s.date >= debutStr && s.date <= finStr
          })
          
          setSeances(seancesFiltrees)
        } else {
          setSeances([])
        }
        setError('')
      } catch (err) {
        console.error('Error fetching emploi du temps:', err)
        setError('Erreur lors du chargement de l\'emploi du temps')
      } finally {
        setLoading(false)
      }
    }

    fetchEmploiDuTemps()
  }, [weekStart, weekEnd])

  // Navigation
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Formater la date pour l'affichage
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  }

  // Trouver les séances pour un jour et une heure spécifiques
  const getSeancesForSlot = (day, hour) => {
    return seances.filter(seance => {
      const seanceDate = new Date(seance.date)
      const isSameDay = seanceDate.toDateString() === day.toDateString()
      const startHour = parseInt(seance.heureDebut.split(':')[0])
      const endHour = parseInt(seance.heureFin.split(':')[0])
      return isSameDay && hour >= startHour && hour < endHour
    })
  }

  // Calculer la durée d'une séance en heures
  const getSeanceDuration = (seance) => {
    const startHour = parseInt(seance.heureDebut.split(':')[0])
    const endHour = parseInt(seance.heureFin.split(':')[0])
    return endHour - startHour
  }

  // Vérifier si c'est la première heure de la séance
  const isFirstHourOfSeance = (seance, hour) => {
    const startHour = parseInt(seance.heureDebut.split(':')[0])
    return hour === startHour
  }

  // Couleurs pour les différents cours
  const courseColors = useMemo(() => {
    const colors = [
      { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#fff' },
      { bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', text: '#fff' },
      { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: '#fff' },
      { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: '#fff' },
      { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', text: '#fff' },
      { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', text: '#333' },
      { bg: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', text: '#333' },
      { bg: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', text: '#fff' },
    ]
    
    const colorMap = {}
    seances.forEach((seance, index) => {
      const coursId = seance.coursId || seance.cours?.id || index
      if (!colorMap[coursId]) {
        colorMap[coursId] = colors[Object.keys(colorMap).length % colors.length]
      }
    })
    return colorMap
  }, [seances])

  const getSeanceColor = (seance) => {
    const coursId = seance.coursId || seance.cours?.id
    return courseColors[coursId] || courseColors[0]
  }

  // Vérifier si un jour est aujourd'hui
  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Rendu d'une séance dans la grille
  const renderSeanceCard = (seance) => {
    const color = getSeanceColor(seance)
    const duration = getSeanceDuration(seance)
    
    return (
      <div 
        key={seance.id}
        className="seance-card"
        style={{ 
          background: color.bg,
          color: color.text,
          height: `${duration * 60 - 8}px`
        }}
      >
        <div className="seance-title">{seance.coursTitre || seance.cours?.titre || 'Cours'}</div>
        <div className="seance-info">
          <span><FaClock size={10} /> {seance.heureDebut} - {seance.heureFin}</span>
        </div>
        <div className="seance-info">
          <span><FaMapMarkerAlt size={10} /> {seance.salle || 'Salle non définie'}</span>
        </div>
        {isEtudiant() && seance.formateur && (
          <div className="seance-info">
            <span><FaUserTie size={10} /> {typeof seance.formateur === 'string' ? seance.formateur : seance.formateur.nom}</span>
          </div>
        )}
        {seance.groupe && (
          <div className="seance-info">
            <span><FaUsers size={10} /> {typeof seance.groupe === 'string' ? seance.groupe : seance.groupe.nom}</span>
          </div>
        )}
      </div>
    )
  }

  // Rendu de la vue Liste
  const renderListView = () => {
    const sortedSeances = [...seances].sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.heureDebut)
      const dateB = new Date(b.date + 'T' + b.heureDebut)
      return dateA - dateB
    })

    const groupedByDate = sortedSeances.reduce((acc, seance) => {
      const dateKey = seance.date
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(seance)
      return acc
    }, {})

    return (
      <div className="list-view">
        {Object.keys(groupedByDate).length === 0 ? (
          <div className="no-seances">
            <FaCalendarAlt size={48} />
            <p>Aucune séance cette semaine</p>
          </div>
        ) : (
          Object.entries(groupedByDate).map(([date, daySeances]) => (
            <div key={date} className="list-day">
              <div className="list-day-header">
                {new Date(date).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </div>
              <div className="list-seances">
                {daySeances.map(seance => {
                  const color = getSeanceColor(seance)
                  return (
                    <div 
                      key={seance.id} 
                      className="list-seance-card"
                      style={{ borderLeftColor: color.bg.includes('#667eea') ? '#667eea' : '#11998e' }}
                    >
                      <div className="list-seance-time">
                        <FaClock /> {seance.heureDebut} - {seance.heureFin}
                      </div>
                      <div className="list-seance-content">
                        <h5>{seance.coursTitre || seance.cours?.titre || 'Cours'}</h5>
                        <div className="list-seance-details">
                          <span><FaMapMarkerAlt /> {seance.salle || 'N/A'}</span>
                          {isEtudiant() && seance.formateur && (
                            <span><FaUserTie /> {typeof seance.formateur === 'string' ? seance.formateur : `${seance.formateur.nom} ${seance.formateur.prenom}`}</span>
                          )}
                          {seance.groupe && (
                            <span><FaUsers /> {typeof seance.groupe === 'string' ? seance.groupe : seance.groupe.nom}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Chargement de l'emploi du temps...</p>
      </div>
    )
  }

  return (
    <div className="emploi-du-temps">
      {/* Header */}
      <div className="edt-header">
        <div className="edt-title">
          <FaCalendarAlt className="title-icon" />
          <div>
            <h1>Mon Emploi du Temps</h1>
            <p className="subtitle">{formatMonthYear(currentDate)}</p>
          </div>
        </div>
        
        <div className="edt-controls">
          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
              title="Vue semaine"
            >
              <FaCalendarWeek />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Vue liste"
            >
              <FaList />
            </button>
          </div>

          {/* Navigation */}
          <div className="nav-controls">
            <button className="nav-btn" onClick={goToPreviousWeek}>
              <FaChevronLeft />
            </button>
            <button className="today-btn" onClick={goToToday}>
              Aujourd'hui
            </button>
            <button className="nav-btn" onClick={goToNextWeek}>
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {/* Stats rapides */}
      <div className="quick-stats">
        <div className="stat-item">
          <div className="stat-value">{seances.length}</div>
          <div className="stat-label">Séances cette semaine</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {seances.reduce((acc, s) => {
              const start = parseInt(s.heureDebut.split(':')[0])
              const end = parseInt(s.heureFin.split(':')[0])
              return acc + (end - start)
            }, 0)}h
          </div>
          <div className="stat-label">Heures de cours</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {new Set(seances.map(s => s.cours?.id)).size}
          </div>
          <div className="stat-label">Cours différents</div>
        </div>
      </div>

      {/* Calendrier */}
      {viewMode === 'week' ? (
        <div className="calendar-container">
          <div className="calendar-grid">
            {/* Header avec les jours */}
            <div className="calendar-header">
              <div className="time-column-header"></div>
              {weekDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`day-header ${isToday(day) ? 'today' : ''}`}
                >
                  <span className="day-name">{joursShort[index]}</span>
                  <span className={`day-number ${isToday(day) ? 'today-number' : ''}`}>
                    {day.getDate()}
                  </span>
                </div>
              ))}
            </div>

            {/* Grille horaire */}
            <div className="calendar-body">
              {heures.map(hour => (
                <div key={hour} className="time-row">
                  <div className="time-label">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  {weekDays.map((day, dayIndex) => {
                    const slotSeances = getSeancesForSlot(day, hour)
                    const firstSeance = slotSeances.find(s => isFirstHourOfSeance(s, hour))
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className={`time-slot ${isToday(day) ? 'today-slot' : ''}`}
                      >
                        {firstSeance && renderSeanceCard(firstSeance)}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        renderListView()
      )}

      {/* Légende des cours */}
      {seances.length > 0 && (
        <div className="legend">
          <h6><FaBook /> Légende des cours</h6>
          <div className="legend-items">
            {Object.entries(
              seances.reduce((acc, s) => {
                if (s.cours && !acc[s.cours.id]) {
                  acc[s.cours.id] = s.cours.titre
                }
                return acc
              }, {})
            ).map(([id, titre]) => (
              <div key={id} className="legend-item">
                <span 
                  className="legend-color"
                  style={{ background: courseColors[id]?.bg }}
                ></span>
                <span>{titre}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EmploiDuTemps
