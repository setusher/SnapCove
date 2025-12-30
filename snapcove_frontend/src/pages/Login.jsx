import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"

export default function Login(){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden animate-pageFade" style={{ background: 'var(--ink)' }}>
      {/* Dark ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-8"
          style={{ background: 'var(--aqua)' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] rounded-full blur-[140px] opacity-6"
          style={{ background: 'var(--mint)' }}
        />
      </div>

      <div className="w-full max-w-md relative z-10 animate-slideUp">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-8">
            <div 
              className="w-16 h-16 rounded-[24px] flex items-center justify-center text-3xl shadow-glow"
              style={{
                background: 'linear-gradient(135deg, var(--aqua), var(--mint))',
                color: 'var(--ink)'
              }}
            >
              📸
            </div>
            <span 
              className="text-section"
              style={{ color: 'var(--text-primary)' }}
            >
              SnapCove
            </span>
          </div>
          <h2 
            className="text-section mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Welcome Back
          </h2>
          <p 
            className="text-meta"
            style={{ color: 'var(--text-secondary)' }}
          >
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={submit} className="glass-card p-12 space-y-10">
          <div className="space-y-3">
            <label 
              className="block text-sm font-medium mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
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

          <div className="space-y-3">
            <label 
              className="block text-sm font-medium mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
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
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full justify-center py-5 text-base"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
            <button 
              type="button"
              onClick={() => nav("/signup")}
              className="font-medium transition-colors"
              style={{ color: 'var(--aqua)' }}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
