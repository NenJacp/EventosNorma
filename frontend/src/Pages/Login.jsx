import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/login.css'

const EYE_OPEN = (
    <>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
)

const EYE_OFF = (
    <>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </>
)

function EyeIcon({ visible }) {
  return (
      <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        {visible ? EYE_OFF : EYE_OPEN}
      </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  // Puedes cambiar estos correos admin
  const adminEmails = ['admin@eventos.com', 'thejesus915@admin.com']

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    // Simulación de login
    setTimeout(() => {
      const isAdmin = adminEmails.includes(email.trim().toLowerCase())

      if (isAdmin) {
        navigate('/admin-dashboard')
      } else {
        navigate('/dashboard')
      }
    }, 500)
  }

  return (
      <div className="auth-wrapper">
        <div className="form-side">
          <div className="form-eyebrow">Acceso seguro</div>
          <h1 className="form-title">
            BIENVENIDO
            <br />
            DE VUELTA
          </h1>
          <p className="form-sub">Continúa donde lo dejaste. Tu comunidad te espera.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Correo electrónico</label>
              <input
                  type="email"
                  placeholder="ana@ejemplo.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>

            <div className="field">
              <label>
                Contraseña
                <a href="#">¿Olvidaste tu contraseña?</a>
              </label>
              <div className="pwd-wrap">
                <input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPwd((v) => !v)}
                >
                  <EyeIcon visible={showPwd} />
                </button>
              </div>
            </div>

            <button type="submit" className="btn-main" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión →'}
            </button>
          </form>

          <div className="divider">o continúa con</div>

          <div className="auth-link">
            ¿Sin cuenta? <Link to="/register">Regístrate gratis</Link>
          </div>
        </div>
      </div>
  )
}