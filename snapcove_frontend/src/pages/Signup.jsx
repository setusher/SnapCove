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
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 relative overflow-hidden animate-pageFade">
      {/* Soft ambient background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-aqua rounded-full blur-[100px] opacity-8"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-mint rounded-full blur-[120px] opacity-6"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slideUp">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-aqua to-mint flex items-center justify-center text-3xl shadow-glow-aqua">
              📸
            </div>
            <span className="text-section text-[#e8eaed] tracking-tight">SnapCove</span>
          </div>
          <h2 className="text-section text-[#e8eaed] mb-3 tracking-tight">Create Account</h2>
          <p className="text-meta text-[#e8eaed]/60">Get started with your free account</p>
        </div>

        <form onSubmit={submit} className="glass-card p-10 space-y-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#e8eaed]/80 mb-3">
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#e8eaed]/80 mb-3">
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#e8eaed]/80 mb-3">
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
            <p className="text-xs text-meta text-[#e8eaed]/50 mt-2">Must be at least 6 characters</p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full justify-center py-4 text-base">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="text-center text-sm">
            <span className="text-meta text-[#e8eaed]/60">Already have an account? </span>
            <button 
              type="button"
              onClick={() => nav("/login")}
              className="text-aqua hover:text-mint font-medium transition-colors">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
