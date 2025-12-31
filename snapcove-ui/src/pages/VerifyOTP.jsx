import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { api } from "../api/api"

export default function VerifyOTP() {
  const nav = useNavigate()
  const { state } = useLocation()
  const email = state?.email || ""

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post("/auth/verify-otp/", { email, otp })
  
      // 🔐 LOGIN USER NOW
      localStorage.setItem("access_token", res.data.access)
      localStorage.setItem("refresh_token", res.data.refresh)
      localStorage.setItem("user", JSON.stringify(res.data.user))
  
      // now route to role or dashboard
      if (!res.data.user.role) nav("/select-role")
      else nav("/dashboard")
    } catch (err) {
      alert("Invalid OTP")
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--primary-bg)', padding: 'var(--space-12) var(--space-4)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: 'var(--space-10)' }}>
        <h2 className="heading-lg" style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>Verify OTP</h2>
        <p style={{ textAlign: 'center', color: 'var(--secondary-text)', marginBottom: 'var(--space-6)' }}>
          We sent a 6-digit code to <span style={{ color: 'var(--accent)' }}>{email}</span>
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="input"
            style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '18px', fontWeight: 600 }}
            required
          />
          <button
            type="button"
            onClick={async () => {
              await api.post("/auth/resend-otp/", { email })
              alert("New OTP sent")
            }}
            className="text-caption"
            style={{ color: 'var(--accent)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'center' }}
          >
            Resend OTP
          </button>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: 'var(--space-4)' }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  )
}

