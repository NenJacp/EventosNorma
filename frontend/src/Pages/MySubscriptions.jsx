import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { getMySubscriptions, getCurrentUser, logout } from '../services/api'
import '../styles/dashboard.css'

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function SubscriptionCard({ subscription, onLeave }) {
  const statusLabel = subscription.hasExited ? 'Abandonado' : 'Activo'
  const statusClass = subscription.hasExited ? 'pill-draft' : 'pill-pub'

  return (
    <div className="ev-row">
      <div className="ev-date-box">
        <div className="ev-day">{new Date(subscription.startDate).getDate()}</div>
        <div className="ev-mon">{months[new Date(subscription.startDate).getMonth()]}</div>
      </div>
      <div className="ev-info">
        <div className="ev-name">{subscription.title}</div>
        <div className="ev-loc">{subscription.locationDetail || 'Sin ubicación'}</div>
      </div>
      <span className={`pill ${statusClass}`}>{statusLabel}</span>
    </div>
  )
}

export default function MySubscriptions() {
  const navigate = useNavigate()
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const loadSubscriptions = async () => {
    try {
      setLoading(true)
      const data = await getMySubscriptions()
      setSubscriptions(data.items || [])
    } catch (err) {
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      navigate('/login')
    }
  }

  if (loading) {
    return (
      <div className="app">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <span>Cargando inscripciones...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-brand">Eventos</div>
        <div className="topbar-center">
          <div className="topbar-greeting">MIS INSCRIPCIONES</div>
          <div className="topbar-sub">Eventos a los que me he unido</div>
        </div>
        <div className="topbar-right">
          <button className="avatar" onClick={() => navigate('/perfil')}>U</button>
        </div>
      </header>

      <aside className="sidebar">
        <Link to="/dashboard" className="nav-item">
          <span>Inicio</span>
        </Link>
        <Link to="/my-events" className="nav-item">
          <span>Mis Eventos</span>
        </Link>
        <Link to="/my-subscriptions" className="nav-item active">
          <span>Mis Inscripciones</span>
        </Link>
        <div className="nav-item logout-item" onClick={handleLogout}>
          <span>Cerrar sesión</span>
        </div>
      </aside>

      <main className="main">
        {subscriptions.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ marginBottom: '8px', color: '#0A0A0A' }}>No tienes inscripciones</h3>
            <p style={{ color: '#6B6B6B', marginBottom: '20px' }}>Explora eventos y únete a los que te interesen</p>
            <button className="btn-new" onClick={() => navigate('/dashboard')}>Explorar eventos</button>
          </div>
        ) : (
          <div className="panel">
            <div className="panel-title">
              <span>Mis inscripciones ({subscriptions.length})</span>
            </div>
            {subscriptions.map(sub => (
              <SubscriptionCard key={sub.eventId} subscription={sub} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}