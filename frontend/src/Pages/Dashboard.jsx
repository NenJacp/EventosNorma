import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/dashboard.css'

const posts = [
  {
    id: 1,
    cat: 'Tech',
    title: 'DevFest LATAM 2026 — Todo lo que debes saber',
    meta: 'Publicado · hace 2 días',
    status: 'pub',
    stats: [{ val: '1.2k' }, { val: '34' }, { val: '18' }],
    bg: 'linear-gradient(135deg,#0A0A0A,#1a1010)',
  },
  {
    id: 2,
    cat: 'Diseño',
    title: '5 herramientas que uso para organizar mis meetups',
    meta: 'Borrador · hace 4 días',
    status: 'draft',
    stats: [],
    bg: 'linear-gradient(135deg,#0d1a10,#1a2a12)',
  },
]

const initialEvents = [
  {
    day: '27',
    mon: 'Mar',
    name: 'DevFest LATAM 2026',
    loc: 'CDMX · 342 registrados',
    status: 'pub',
  },
]

const feed = [
  {
    id: 1,
    ava: 'JL',
    bg: '#e8d4f0',
    user: 'Jorge López',
    text: 'Comentó tu publicación',
    time: 'hace 15 min',
  },
]

const quickActions = [
  { label: 'Explorar eventos', sub: 'Ver conferencias' },
  { label: 'Nueva publicación', sub: 'Crear contenido' },
]

function PillStatus({ status }) {
  const map = { pub: 'pill-pub', draft: 'pill-draft', review: 'pill-review' }
  const labels = { pub: 'Publicado', draft: 'Borrador', review: 'En revisión' }
  return <span className={`pill ${map[status]}`}>{labels[status]}</span>
}

function getMonthShort(dateStr) {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const d = new Date(dateStr)
  return months[d.getMonth()] || ''
}

export default function Dashboard() {
  const navigate = useNavigate()

  const [events, setEvents] = useState(initialEvents)
  const [openModal, setOpenModal] = useState(false)

  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    place: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewEvent((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateEvent = (e) => {
    e.preventDefault()

    if (!newEvent.name || !newEvent.date || !newEvent.place) return

    const d = new Date(newEvent.date)
    const day = String(d.getDate()).padStart(2, '0')
    const mon = getMonthShort(newEvent.date)

    const eventItem = {
      day,
      mon,
      name: newEvent.name,
      loc: newEvent.place,
      status: 'pub',
    }

    setEvents((prev) => [eventItem, ...prev])
    setNewEvent({ name: '', date: '', place: '' })
    setOpenModal(false)
  }

  return (
      <div className="app">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-brand">Eventos</div>

          <div className="topbar-center">
            <div className="topbar-greeting">BIENVENIDA, ANA</div>
            <div className="topbar-sub">Dashboard general</div>
          </div>

          <div className="topbar-right">
            <button className="btn-new" onClick={() => setOpenModal(true)}>
              + Nuevo evento
            </button>

            <button
                type="button"
                className="avatar"
                onClick={() => navigate('/perfil')}
                aria-label="Ir al perfil"
                title="Perfil"
            >
              AG
            </button>
          </div>
        </header>

        {/* SIDEBAR */}
        <aside className="sidebar">
          <Link to="/dashboard" className="nav-item active">
            <span>Inicio</span>
          </Link>

          <Link to="#" className="nav-item">
            <span>Publicaciones</span>
          </Link>

          <Link to="#" className="nav-item">
            <span>Eventos</span>
          </Link>

          <Link to="#" className="nav-item">
            <span>Comunidad</span>
          </Link>

          <div
              className="nav-item"
              onClick={() => navigate('/login')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') navigate('/login')
              }}
          >
            <span>Cerrar sesión</span>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="stats">
            <div className="stat-card featured">
              <div className="stat-label">Eventos activos</div>
              <div className="stat-value">{events.length}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Publicaciones</div>
              <div className="stat-value">8</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Asistentes</div>
              <div className="stat-value">342</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Vistas</div>
              <div className="stat-value">1.2k</div>
            </div>
          </div>

          <div className="two-col">
            <div className="panel">
              <div className="panel-title">Publicaciones</div>

              {posts.map((p) => (
                  <div className="post-item" key={p.id}>
                    <div className="post-thumb" style={{ background: p.bg }}>
                      <span className="post-cat">{p.cat}</span>
                    </div>

                    <div className="post-body">
                      <div className="post-title">{p.title}</div>
                      <div className="post-meta">{p.meta}</div>

                      <div className="post-stats">
                        {p.stats.length === 0 ? (
                            <span className="ps">Sin publicar</span>
                        ) : (
                            p.stats.map((s, i) => <span key={i}>{s.val}</span>)
                        )}
                      </div>
                    </div>

                    <PillStatus status={p.status} />
                  </div>
              ))}
            </div>

            <div className="panel">
              <div className="panel-title">Acciones rápidas</div>

              <div className="qa-grid">
                {quickActions.map((qa, i) => (
                    <div key={i} className="qa">
                      <div className="qa-label">{qa.label}</div>
                      <div className="qa-sub">{qa.sub}</div>
                    </div>
                ))}
              </div>
            </div>
          </div>

          <div className="two-col">
            <div className="panel">
              <div className="panel-title">Eventos</div>

              {events.map((ev, i) => (
                  <div className="ev-row" key={`${ev.name}-${i}`}>
                    <div className="ev-date-box">
                      <div className="ev-day">{ev.day}</div>
                      <div className="ev-mon">{ev.mon}</div>
                    </div>

                    <div className="ev-info">
                      <div className="ev-name">{ev.name}</div>
                      <div className="ev-loc">{ev.loc}</div>
                    </div>

                    <PillStatus status={ev.status} />
                  </div>
              ))}
            </div>

            <div className="panel">
              <div className="panel-title">Actividad</div>

              {feed.map((f) => (
                  <div className="feed-item" key={f.id}>
                    <div className="feed-ava" style={{ background: f.bg }}>
                      {f.ava}
                    </div>

                    <div className="feed-body">
                      <div className="feed-user">{f.user}</div>
                      <div className="feed-text">{f.text}</div>
                      <div className="feed-time">{f.time}</div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </main>

        {/* MODAL NUEVO EVENTO */}
        {openModal && (
            <div className="modal-backdrop" onClick={() => setOpenModal(false)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Crear nuevo evento</h3>
                  <button className="modal-close" onClick={() => setOpenModal(false)}>
                    ×
                  </button>
                </div>

                <form className="modal-form" onSubmit={handleCreateEvent}>
                  <label>
                    Nombre del evento
                    <input
                        type="text"
                        name="name"
                        value={newEvent.name}
                        onChange={handleChange}
                        placeholder="Ej. React Summit CDMX"
                        required
                    />
                  </label>

                  <label>
                    Fecha
                    <input
                        type="date"
                        name="date"
                        value={newEvent.date}
                        onChange={handleChange}
                        required
                    />
                  </label>

                  <label>
                    Lugar
                    <input
                        type="text"
                        name="place"
                        value={newEvent.place}
                        onChange={handleChange}
                        placeholder="Ej. CDMX"
                        required
                    />
                  </label>

                  <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setOpenModal(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-save">
                      Guardar evento
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  )
}