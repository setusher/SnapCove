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
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <h1 className="text-page-title mb-2">SnapCove</h1>
          <h2 className="text-section-title mb-3">Welcome Back</h2>
          <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
            Sign in to your account
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-meta mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <input 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-meta mb-2" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
                required
                className="input-field"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  className="text-meta transition-colors"
                  style={{ color: 'var(--accent)' }}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full divider"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 text-meta" style={{ background: 'var(--surface)', color: 'var(--text-secondary)' }}>
                  Or continue with
                </span>
              </div>
            </div>

            <div ref={googleButtonRef} className="w-full flex justify-center"></div>

            <div className="text-center text-body pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
              <button 
                type="button"
                onClick={() => nav("/signup")}
                className="font-medium transition-colors"
                style={{ color: 'var(--accent)' }}
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
