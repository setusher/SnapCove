import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"

const GOOGLE_CLIENT_ID = "447171812608-0c66t6gioscl9kl3m5gqqkkj8r4ni29n.apps.googleusercontent.com"

export default function Login(){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const googleButtonRef = useRef(null)

  useEffect(() => {
    const initGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn
        })
        
        if (googleButtonRef.current && window.google.accounts.id.renderButton) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: googleButtonRef.current.offsetWidth || 350,
            text: 'signin_with',
            type: 'standard'
          })
        }
      } else {
        setTimeout(initGoogleSignIn, 100)
      }
    }
    initGoogleSignIn()
  }, [])

  const handleGoogleSignIn = async (response) => {
    try {
      const res = await api.post("/auth/google/", { id_token: response.credential })
      localStorage.setItem("access_token", res.data.access)
      localStorage.setItem("refresh_token", res.data.refresh)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      nav("/dashboard")
    } catch(e) {
      alert("Google sign-in failed")
      console.error(e)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post("/auth/login/", { email, password })
      localStorage.setItem("access_token", res.data.access)
      localStorage.setItem("refresh_token", res.data.refresh)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      nav("/dashboard")
    } catch(e) {
      alert("Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return(
    <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--primary-bg)', padding: 'var(--space-4) var(--space-4)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <h1 className="heading-xl" style={{ marginBottom: 'var(--space-2)' }}>SnapCove</h1>
          <h2 className="heading-lg" style={{ marginBottom: 'var(--space-2)' }}>Welcome Back</h2>
          <p className="text-body" style={{ color: 'var(--secondary-text)' }}>
            Sign in to your account
          </p>
        </div>

        <div className="card" style={{ padding: 'var(--card-padding)' }}>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--form-field-gap)' }}>
            <div>
              <label className="text-caption" style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--secondary-text)' }}>
                Email Address
              </label>
              <input 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@example.com"
                required
                className="input"
              />
            </div>

            <div>
              <label className="text-caption" style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--secondary-text)' }}>
                Password
              </label>
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
                required
                className="input"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                <button
                  type="button"
                  className="text-caption"
                  style={{ color: 'var(--accent)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div style={{ position: 'relative', margin: 'var(--form-field-gap) 0' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', height: '1px', background: 'var(--border)' }}></div>
              </div>
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <span className="text-caption" style={{ padding: '0 var(--space-3)', background: 'var(--secondary-bg)', color: 'var(--secondary-text)' }}>
                  Or continue with
                </span>
              </div>
            </div>

            <div ref={googleButtonRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>

            <div style={{ textAlign: 'center', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
              <span className="text-body" style={{ color: 'var(--secondary-text)' }}>Don't have an account? </span>
              <button 
                type="button"
                onClick={() => nav("/signup")}
                className="text-body"
                style={{ fontWeight: 500, color: 'var(--accent)', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

