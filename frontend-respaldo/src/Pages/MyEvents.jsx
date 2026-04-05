import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { getMyEvents, createEvent, updateEvent, deleteEvent, getCountries, getStates, getCities, getEventCategories, getEventTypes, getCurrentUser, logout } from '../services/api'
import '../styles/dashboard.css'

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getDate()} ${months[d.getMonth()]}`
}

function EventCard({ event, onEdit, onDelete }) {
  return (
    <div className="ev-row">
      <div className="ev-date-box">
        <div className="ev-day">{new Date(event.startDate).getDate()}</div>
        <div className="ev-mon">{months[new Date(event.startDate).getMonth()]}</div>
      </div>
      <div className="ev-info">
        <div className="ev-name">{event.title}</div>
        <div className="ev-loc">{event.locationDetail || 'Sin ubicación'}</div>
      </div>
      <span className={`pill ${event.isActive ? 'pill-pub' : 'pill-draft'}`}>
        {event.isActive ? 'Activo' : 'Inactivo'}
      </span>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button className="btn-icon" onClick={() => onEdit(event)} title="Editar">
          ✎
        </button>
        <button className="btn-icon btn-delete" onClick={() => onDelete(event)} title="Eliminar">
          ✕
        </button>
      </div>
    </div>
  )
}

function EventModal({ isOpen, onClose, onSave, initialData, loading }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    locationDetail: '',
    countryId: '',
    stateId: '',
    cityId: '',
    eventCategoryId: '',
    eventTypeId: '',
    isPrivate: false,
    maxCapacity: 100
  })

  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [loadingCatalogs, setLoadingCatalogs] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
          endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
          locationDetail: initialData.locationDetail || '',
          countryId: '',
          stateId: '',
          cityId: initialData.cityId || '',
          eventCategoryId: initialData.eventCategoryId || '',
          eventTypeId: initialData.eventTypeId || '',
          isPrivate: initialData.isPrivate || false,
          maxCapacity: initialData.maxCapacity || 100
        })
      } else {
        setFormData({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          locationDetail: '',
          countryId: '',
          stateId: '',
          cityId: '',
          eventCategoryId: '',
          eventTypeId: '',
          isPrivate: false,
          maxCapacity: 100
        })
      }
    }
  }, [isOpen, initialData])

  useEffect(() => {
    if (isOpen) {
      setLoadingCatalogs(true)
      Promise.all([getCountries(), getEventCategories(), getEventTypes()])
        .then(([countriesData, categoriesData, typesData]) => {
          setCountries(countriesData)
          setEventCategories(categoriesData)
          setEventTypes(typesData)
        })
        .catch(() => toast.error('Error al cargar catálogos'))
        .finally(() => setLoadingCatalogs(false))
    }
  }, [isOpen])

  const [eventCategories, setEventCategories] = useState([])
  const [eventTypes, setEventTypes] = useState([])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleCountryChange = async (e) => {
    const countryId = e.target.value
    setFormData(prev => ({ ...prev, countryId, stateId: '', cityId: '' }))
    setStates([])
    setCities([])
    if (countryId) {
      try {
        const statesData = await getStates(countryId)
        setStates(statesData)
      } catch {
        toast.error('Error al cargar estados')
      }
    }
  }

  const handleStateChange = async (e) => {
    const stateId = e.target.value
    setFormData(prev => ({ ...prev, stateId, cityId: '' }))
    setCities([])
    if (stateId) {
      try {
        const citiesData = await getCities(stateId)
        setCities(citiesData)
      } catch {
        toast.error('Error al cargar ciudades')
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <h3>{initialData ? 'Editar evento' : 'Crear nuevo evento'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {loadingCatalogs ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6B6B6B' }}>Cargando catálogos...</div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <label>
              Título *
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Descripción
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                style={{ padding: '8px', border: '1px solid #E4E2DC', borderRadius: '4px', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <label>
                Fecha inicio *
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Fecha fin *
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label>
              Ubicación
              <input
                type="text"
                name="locationDetail"
                value={formData.locationDetail}
                onChange={handleChange}
                placeholder="Dirección o lugar"
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <label>
                País
                <select name="countryId" value={formData.countryId} onChange={handleCountryChange}>
                  <option value="">Seleccionar</option>
                  {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label>
                Estado
                <select name="stateId" value={formData.stateId} onChange={handleStateChange} disabled={!formData.countryId}>
                  <option value="">Seleccionar</option>
                  {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>
              <label>
                Ciudad
                <select name="cityId" value={formData.cityId} onChange={handleChange} disabled={!formData.stateId}>
                  <option value="">Seleccionar</option>
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <label>
                Categoría
                <select name="eventCategoryId" value={formData.eventCategoryId} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {eventCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label>
                Tipo
                <select name="eventTypeId" value={formData.eventTypeId} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  {eventTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <label>
                Capacidad máxima
                <input
                  type="number"
                  name="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={handleChange}
                  min={1}
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleChange}
                />
                Evento privado
              </label>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear evento')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function MyEvents() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)
  const [editingEvent, setEditingEvent] = useState(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const user = await getCurrentUser()
      const data = await getMyEvents(user.id)
      setEvents(data.items || [])
    } catch (err) {
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (formData) => {
    try {
      setSaving(true)
      await createEvent({
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        locationDetail: formData.locationDetail,
        cityId: formData.cityId ? parseInt(formData.cityId) : null,
        eventCategoryId: formData.eventCategoryId ? parseInt(formData.eventCategoryId) : null,
        eventTypeId: formData.eventTypeId ? parseInt(formData.eventTypeId) : null,
        isPrivate: formData.isPrivate,
        maxCapacity: parseInt(formData.maxCapacity) || 100
      })
      toast.success('Evento creado correctamente')
      setModalOpen(false)
      loadEvents()
    } catch (err) {
      toast.error(err.message || 'Error al crear evento')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (formData) => {
    if (!editingEvent) return
    try {
      setSaving(true)
      await updateEvent(editingEvent.id, {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        locationDetail: formData.locationDetail,
        cityId: formData.cityId ? parseInt(formData.cityId) : null,
        eventCategoryId: formData.eventCategoryId ? parseInt(formData.eventCategoryId) : null,
        eventTypeId: formData.eventTypeId ? parseInt(formData.eventTypeId) : null,
        isPrivate: formData.isPrivate,
        maxCapacity: parseInt(formData.maxCapacity) || 100
      })
      toast.success('Evento actualizado correctamente')
      setModalOpen(false)
      setEditingEvent(null)
      loadEvents()
    } catch (err) {
      toast.error(err.message || 'Error al actualizar evento')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!eventToDelete) return
    try {
      await deleteEvent(eventToDelete.id)
      toast.success('Evento eliminado correctamente')
      setDeleteModalOpen(false)
      setEventToDelete(null)
      loadEvents()
    } catch (err) {
      toast.error(err.message || 'Error al eliminar evento')
    }
  }

  const openDeleteModal = (event) => {
    setEventToDelete(event)
    setDeleteModalOpen(true)
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      navigate('/login')
    }
  }

  const openCreate = () => {
    setEditingEvent(null)
    setModalOpen(true)
  }

  const openEdit = (event) => {
    setEditingEvent(event)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className="app">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <span>Cargando eventos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-brand">Eventos</div>
        <div className="topbar-center">
          <div className="topbar-greeting">MIS EVENTOS</div>
          <div className="topbar-sub">Gestión de mis eventos</div>
        </div>
        <div className="topbar-right">
          <button className="btn-new" onClick={openCreate}>+ Nuevo evento</button>
          <button className="avatar" onClick={() => navigate('/perfil')}>U</button>
        </div>
      </header>

      <aside className="sidebar">
        <Link to="/dashboard" className="nav-item">
          <span>Inicio</span>
        </Link>
        <Link to="/my-events" className="nav-item active">
          <span>Mis Eventos</span>
        </Link>
        <Link to="/my-subscriptions" className="nav-item">
          <span>Mis Inscripciones</span>
        </Link>
        <div className="nav-item logout-item" onClick={handleLogout}>
          <span>Cerrar sesión</span>
        </div>
      </aside>

      <main className="main">
        {events.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
            <h3 style={{ marginBottom: '8px', color: '#0A0A0A' }}>No tienes eventos</h3>
            <p style={{ color: '#6B6B6B', marginBottom: '20px' }}>Crea tu primer evento para comenzar</p>
            <button className="btn-new" onClick={openCreate}>Crear mi primer evento</button>
          </div>
        ) : (
          <div className="panel">
            <div className="panel-title">
              <span>Mis eventos ({events.length})</span>
            </div>
            {events.map(ev => (
              <EventCard key={ev.id} event={ev} onEdit={openEdit} onDelete={openDeleteModal} />
            ))}
          </div>
        )}
      </main>

      <EventModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingEvent(null) }}
        onSave={editingEvent ? handleUpdate : handleCreate}
        initialData={editingEvent}
        loading={saving}
      />

      {deleteModalOpen && (
        <div className="modal-backdrop" onClick={() => { setDeleteModalOpen(false); setEventToDelete(null) }}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Confirmar eliminación</h3>
              <button className="modal-close" onClick={() => { setDeleteModalOpen(false); setEventToDelete(null) }}>×</button>
            </div>
            <p style={{ marginBottom: '20px', color: '#6B6B6B' }}>
              ¿Estás seguro de que deseas eliminar el evento "{eventToDelete?.title}"? Esta acción no se puede deshacer.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => { setDeleteModalOpen(false); setEventToDelete(null) }}>
                Cancelar
              </button>
              <button className="btn-save" style={{ background: '#D94F3D', color: '#fff' }} onClick={handleDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .btn-icon {
          width: 28px;
          height: 28px;
          border: 1px solid #E4E2DC;
          background: #fff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-icon:hover {
          border-color: #E8B84B;
          background: #FBF4E0;
        }
        .btn-delete:hover {
          border-color: #D94F3D;
          background: #fef2f0;
        }
        select {
          height: 38px;
          border: 1px solid #E4E2DC;
          border-radius: 4px;
          padding: 0 10px;
          font-size: 13px;
          background: #fff;
        }
      `}</style>
    </div>
  )
}