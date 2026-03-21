// src/pages/Register.jsx
import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/registro.css'

const EYE_OPEN = (
  <>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </>
)

const EYE_OFF = (
  <>
    <line x1="1" y1="1" x2="23" y2="23"/>
    <path d="M9.88 9.88a3 3 0 004.24 4.24M10.73 5.08A10.43 10.43 0 0112 5c7 0 11 7 11 7a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 01-4.24-4.24M1 1s4 5.56 4 11"/>
    <path d="M17.94 17.94A10.07 10.07 0 0112 19c-7 0-11-7-11-7a18.5 18.5 0 015.06-5.94"/>
  </>
)

function EyeIcon({ visible }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round">
      {visible ? EYE_OFF : EYE_OPEN}
    </svg>
  )
}

function checkStrength(val) {
  let score = 0
  if (val.length >= 8) score++
  if (/[A-Z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[^A-Za-z0-9]/.test(val)) score++
  return score
}

const STR_LABELS = ['—', 'Débil', 'Regular', 'Buena', 'Fuerte']

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', pwd: '', pwd2: ''
  })
  const [showPwd, setShowPwd]   = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)
  const [terms, setTerms]       = useState(false)

  const strength = checkStrength(form.pwd)

  const matchStatus = (() => {
    if (!form.pwd2) return null
    return form.pwd === form.pwd2 ? 'ok' : 'err'
  })()

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit() {
    if (!terms) return alert('Acepta los términos para continuar.')
    if (matchStatus !== 'ok') return alert('Las contraseñas no coinciden.')
    navigate('/dashboard')
  }

  return (
    <div className="auth-wrapper">
      <div className="form-side">
        <div className="form-eyebrow">Nueva cuenta</div>
        <h1 className="form-title">ÚNETE A LA<br />COMUNIDAD</h1>
        <p className="form-sub">
          Crea tu perfil, publica eventos y conecta con tu audiencia en toda LATAM.
        </p>

        <div className="field-row">
          <div className="field">
            <label>Nombre</label>
            <input name="nombre" type="text" placeholder="Ana"
              autoComplete="given-name"
              value={form.nombre} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Apellido</label>
            <input name="apellido" type="text" placeholder="García"
              autoComplete="family-name"
              value={form.apellido} onChange={handleChange} />
          </div>
        </div>

        <div className="field">
          <label>Correo electrónico</label>
          <input name="email" type="email" placeholder="ana@ejemplo.com"
            autoComplete="email"
            value={form.email} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Contraseña</label>
          <div className="pwd-wrap">
            <input name="pwd" type={showPwd ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              value={form.pwd} onChange={handleChange} />
            <button type="button" className="eye-btn"
              onClick={() => setShowPwd(v => !v)}
              aria-label="Mostrar contraseña">
              <EyeIcon visible={showPwd} />
            </button>
          </div>

          {/* Barra de fortaleza */}
          {form.pwd && (
            <div className="str-wrap">
              <div className="str-bars">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`str-b ${i <= strength ? 'on' : ''}`} />
                ))}
              </div>
              <span className="str-label">{STR_LABELS[strength]}</span>
            </div>
          )}
        </div>

        <div className="field">
          <label>Confirmar contraseña</label>
          <div className="pwd-wrap">
            <input name="pwd2"
              type={showPwd2 ? 'text' : 'password'}
              placeholder="Repite tu contraseña"
              className={matchStatus === 'ok' ? 'ok' : matchStatus === 'err' ? 'error' : ''}
              value={form.pwd2} onChange={handleChange} />
            <button type="button" className="eye-btn"
              onClick={() => setShowPwd2(v => !v)}
              aria-label="Mostrar contraseña">
              <EyeIcon visible={showPwd2} />
            </button>
          </div>
          {matchStatus && (
            <div className={`field-hint ${matchStatus}`}>
              {matchStatus === 'ok' ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
            </div>
          )}
        </div>

        <div className="chk">
          <input type="checkbox" id="terms"
            checked={terms} onChange={e => setTerms(e.target.checked)} />
          <label htmlFor="terms">
            Acepto los <a href="#">Términos de uso</a> y la{' '}
            <a href="#">Política de privacidad</a> de Stage
          </label>
        </div>

        <button className="btn-main" onClick={handleSubmit}>
          Crear cuenta →
        </button>

        <div className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  )
}