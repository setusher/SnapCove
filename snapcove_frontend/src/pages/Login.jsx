import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"

export default function Login(){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const nav = useNavigate()

  const submit = async () => {
    try {
      const res = await api.post("/auth/login/", { email, password })
      localStorage.setItem("access_token", res.data.access)
      localStorage.setItem("refresh_token", res.data.refresh)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      nav("/dashboard")
    } catch(e) {
      alert("Invalid credentials")
    }
  }

  return(
    <div className="min-h-screen flex items-center justify-center px-4 page-container"
         style={{ background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 100%)' }}>
      <div className="glow-card p-10 rounded-2xl w-full max-w-md space-y-6"
           style={{ backgroundColor: '#1c2541' }}>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold gradient-text mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to continue to your gallery</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#5bc0be' }}>
              Email Address
            </label>
            <input 
              type="email"
              onChange={e => setEmail(e.target.value)} 
              placeholder="you@example.com"
              className="glow-input w-full p-4 rounded-xl text-white"
              style={{ backgroundColor: '#0b132b' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#5bc0be' }}>
              Password
            </label>
            <input 
              type="password" 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
              className="glow-input w-full p-4 rounded-xl text-white"
              style={{ backgroundColor: '#0b132b' }}
            />
          </div>
        </div>

        <button 
          onClick={submit}
          className="glow-button w-full p-4 rounded-xl font-semibold text-lg relative z-10"
          style={{ background: 'linear-gradient(135deg, #5bc0be, #6fffe9)', color: '#0b132b' }}>
          Sign In
        </button>

        <div className="text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button 
              onClick={() => nav("/signup")}
              className="font-semibold hover:underline"
              style={{ color: '#5bc0be' }}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}