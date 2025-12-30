import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"

export default function Signup(){
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

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
      alert("Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return(
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden animate-pageFade" style={{ background: 'var(--ink)' }}>
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

      <div className="w-full max-w-[420px] relative z-10 animate-slideUp">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-4 mb-8">
            <div 
              className="w-16 h-16 rounded-[20px] flex items-center justify-center text-3xl shadow-glow"
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
            className="text-3xl font-bold mb-3"
            style={{ 
              color: 'var(--text-primary)',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Create Account
          </h2>
          <p 
            className="text-base"
            style={{ 
              color: 'var(--text-secondary)',
              opacity: 0.7
            }}
          >
            Get started with your free account
          </p>
        </div>

        <form onSubmit={submit} className="glass-card p-10 space-y-6">
          <div>
            <label 
              className="block text-sm font-medium mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
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
            <label 
              className="block text-sm font-medium mb-3"
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

          <div>
            <label 
              className="block text-sm font-medium mb-3"
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
              minLength={6}
              className="input-field"
            />
            <p 
              className="text-xs mt-2"
              style={{ color: 'var(--text-muted)' }}
            >
              Must be at least 6 characters
            </p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full justify-center py-4 text-base mt-6"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="text-center text-sm pt-4" style={{ borderTop: '1px solid rgba(58, 80, 107, 0.3)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
            <button 
              type="button"
              onClick={() => nav("/login")}
              className="font-medium transition-colors hover:underline"
              style={{ color: 'var(--aqua)' }}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
