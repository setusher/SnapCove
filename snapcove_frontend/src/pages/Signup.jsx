import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"

const GOOGLE_CLIENT_ID = "447171812608-0c66t6gioscl9kl3m5gqqkkj8r4ni29n.apps.googleusercontent.com"

export default function Signup(){
  const [name, setName] = useState("")
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
            text: 'signup_with',
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
      const res = await api.post("/auth/signup/", { name, email, password })
      localStorage.setItem("access_token", res.data.access)
      localStorage.setItem("refresh_token", res.data.refresh)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      nav("/dashboard")
    } catch(e){
      alert("Signup failed: " + (e.response?.data?.error || JSON.stringify(e.response?.data) || "Please try again"))
    } finally {
      setLoading(false)
    }
  }

  return(
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <h1 className="text-page-title mb-2">SnapCove</h1>
          <h2 className="text-section-title mb-3">Create Account</h2>
          <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
            Get started with your free account
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={submit} className="space-y-6">
            <div ref={googleButtonRef} className="w-full flex justify-center mb-6"></div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full divider"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 text-meta" style={{ background: 'var(--surface)', color: 'var(--text-secondary)' }}>
                  Or create with email
                </span>
              </div>
            </div>

            <div>
              <label className="block text-meta mb-2" style={{ color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <input 
                type="text"
                value={name}
                onChange={e => setName(e.target.value)} 
                placeholder="John Doe"
                required
                className="input-field"
              />
            </div>

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
                minLength={6}
                className="input-field"
              />
              <p className="text-meta mt-2" style={{ color: 'var(--text-secondary)' }}>
                Must be at least 6 characters
              </p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <div className="text-center text-body pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
              <button 
                type="button"
                onClick={() => nav("/login")}
                className="font-medium transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
