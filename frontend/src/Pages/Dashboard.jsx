// src/pages/Dashboard.jsx
import { useNavigate, Link } from 'react-router-dom'
import '../styles/dashboard.css'

const posts = [
  {
    id: 1, cat: 'Tech', title: 'DevFest LATAM 2026 — Todo lo que debes saber',
    meta: 'Publicado · hace 2 días', status: 'pub',
    stats: [{ icon: 'eye', val: '1.2k' }, { icon: 'msg', val: '34' }, { icon: 'chk', val: '18' }],
    bg: 'linear-gradient(135deg,#0A0A0A,#1a1010)'
  },
  {
    id: 2, cat: 'Diseño', title: '5 herramientas que uso para organizar mis meetups',
    meta: 'Borrador · hace 4 días', status: 'draft',
    stats: [], bg: 'linear-gradient(135deg,#0d1a10,#1a2a12)'
  },
  {
    id: 3, cat: 'Negocio', title: 'Cómo conseguí 300 asistentes en mi primer evento',
    meta: 'Publicado · hace 1 semana', status: 'pub',
    stats: [{ icon: 'eye', val: '842' }, { icon: 'msg', val: '21' }],
    bg: 'linear-gradient(135deg,#1a1500,#2a1f00)'
  },
]

const events = [
  { day: '27', mon: 'Mar', name: 'DevFest LATAM 2026 — Conferencia de desarrollo web', loc: 'Centro de Convenciones · CDMX · 342 registrados', status: 'pub' },
  { day: '16', mon: 'Abr', name: 'StartupMX Summit — Pitch & networking empresarial', loc: 'Hotel Crowne Plaza · Guadalajara · 217 registrados', status: 'review' },
]

const feed = [
  { id: 1, ava: 'JL', bg: '#e8d4f0', user: 'Jorge López', text: 'Comentó en tu publicación "DevFest LATAM 2026..."', time: 'hace 15 min' },
  { id: 2, ava: 'MR', bg: '#d4e8f0', user: 'Mariana Ríos', text: 'Se registró en tu evento DevFest LATAM 2026', time: 'hace 1 hora' },
  { id: 3, ava: 'CT', bg: '#f0e8d4', user: 'Carlos Torres', text: 'Le dio me gusta a tu artículo "300 asistentes..."', time: 'hace 3 horas' },
  { id: 4, ava: 'SV', bg: '#d4f0e4', user: 'Sofía Vargas', text: 'Te empezó a seguir en Stage', time: 'ayer' },
]

const quickActions = [
  { label: 'Explorar eventos', sub: 'Ver conferencias / meetups' },
  { label: 'Nueva publicación', sub: 'Artículo, anuncio o recap' },
  { label: 'Crear evento', sub: 'Conferencia, meetup, taller' },
  { label: 'Invitar speakers', sub: 'Añadir ponentes' },
  { label: 'Ver estadísticas', sub: 'Vistas, asistentes, clics' },
]

function PillStatus({ status }) {
  const map = { pub: 'pill-pub', draft: 'pill-draft', review: 'pill-review' }
  const labels = { pub: 'Publicado', draft: 'Borrador', review: 'En revisión' }
  return <span className={`pill ${map[status]}`}>{labels[status]}</span>
}

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="app">

      {/* TOPBAR */}
      <header className="topbar">
        <div className="topbar-brand">Eventos</div>
        <div className="topbar-center">
          <div className="topbar-greeting">BIENVENIDA, ANA</div>
          <div className="topbar-sub">Jue 19 Mar 2026 · 2 eventos próximos · 3 publicaciones activas</div>
        </div>
        <div className="topbar-right">
          <button className="btn-new" onClick={() => alert('Nueva publicación')}>+ Nueva publicación</button>
          <div className="icon-btn">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M13 13l-3.5-3.5M9.5 6a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" stroke="#888" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="icon-btn">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1a5 5 0 00-5 5v2L1.5 9.5V10h13v-.5L13 8V6a5 5 0 00-5-5zm0 13a2 2 0 002-2H6a2 2 0 002 2z" fill="#888"/>
            </svg>
            <div className="notif-dot"></div>
          </div>
          <div className="avatar">AG</div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="nav-section">Principal</div>
        <a href="#" className="nav-item active">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" fill="currentColor"/>
            <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" fill="currentColor" opacity=".35"/>
            <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" fill="currentColor" opacity=".35"/>
            <rect x="9" y="9" width="5.5" height="5.5" rx="1" fill="currentColor" opacity=".35"/>
          </svg>
          Inicio
        </a>
        <a href="#" className="nav-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M5 8h6M5 5.5h6M5 10.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
          Mis publicaciones <span className="nav-badge">3</span>
        </a>
        <a href="#" className="nav-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2a4 4 0 100 8 4 4 0 000-8zM2 14a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Mis eventos <span className="nav-badge">2</span>
        </a>

        <div className="nav-section">Explorar</div>
        <a href="#" className="nav-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13 13l-3.5-3.5M9.5 6a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Explorar eventos
        </a>
        <a href="#" className="nav-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 12l3-4 3 3 2-3 4 4H2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
          Comunidad
        </a>
        <a href="#" className="nav-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 4h10M3 8h7M3 12h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Estadísticas
        </a>

        <div className="nav-section">Cuenta</div>
        <a href="#" className="nav-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 1a5 5 0 00-5 5v2L1.5 9.5V10h13v-.5L13 8V6a5 5 0 00-5-5zm0 13a2 2 0 002-2H6a2 2 0 002 2z" fill="currentColor" opacity=".4"/>
          </svg>
          Notificaciones <span className="nav-badge">5</span>
        </a>
        <a href="#" className="nav-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Configuración
        </a>
        <a className="nav-item" style={{ marginTop: '4px', cursor: 'pointer' }}
          onClick={() => navigate('/login')}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l4-3-4-3M14 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Cerrar sesión
        </a>

        <div className="sidebar-footer">
          <div className="sf-ava">AG</div>
          <div>
            <div className="sf-name">Ana García</div>
            <div className="sf-role">Organizadora · Pro</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">

        {/* Stats */}
        <div className="stats">
          {[
            { label: 'Eventos activos', val: '2', delta: '+1 este mes', featured: true },
            { label: 'Publicaciones', val: '8', delta: '+3 esta semana' },
            { label: 'Asistentes totales', val: '342', delta: '+48 esta semana' },
            { label: 'Vistas del perfil', val: '1.2k', delta: '-6% vs anterior', down: true },
          ].map((s, i) => (
            <div key={i} className={`stat-card ${s.featured ? 'featured' : ''}`}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.val}</div>
              <div className={`stat-delta ${s.down ? 'down' : ''}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Publicaciones + Acciones rápidas */}
        <div className="two-col">
          <div className="panel">
            <div className="panel-title">
              Mis publicaciones recientes <a>Ver todas</a>
            </div>
            {posts.map(p => (
              <div className="post-item" key={p.id}>
                <div className="post-thumb" style={{ background: p.bg }}>
                  <span className="post-cat">{p.cat}</span>
                </div>
                <div className="post-body">
                  <div className="post-title">{p.title}</div>
                  <div className="post-meta">{p.meta}</div>
                  <div className="post-stats">
                    {p.stats.length === 0
                      ? <span className="ps" style={{ color: 'var(--muted)' }}>Sin publicar aún</span>
                      : p.stats.map((s, i) => <span className="ps" key={i}>{s.val}</span>)
                    }
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
                <div className="qa" key={i} onClick={() => alert(qa.label)}>
                  <div className="qa-icon">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v12M2 8h12" stroke="#C8502A" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="qa-label">{qa.label}</div>
                  <div className="qa-sub">{qa.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Eventos + Feed */}
        <div className="two-col">
          <div className="panel">
            <div className="panel-title">Próximos eventos <a>Gestionar</a></div>
            {events.map((ev, i) => (
              <div className="ev-row" key={i}>
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
            <div className="panel-title">Actividad de la comunidad <a>Ver todo</a></div>
            {feed.map(f => (
              <div className="feed-item" key={f.id}>
                <div className="feed-ava" style={{ background: f.bg }}>{f.ava}</div>
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
    </div>
  )
}