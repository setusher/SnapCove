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
  

  const handleResendOTP = async () => {
    try {
      await api.post("/auth/resend-otp/", { email })
      alert("New OTP sent to your email")
    } catch (err) {
      alert("Failed to resend OTP. Please try again.")
    }
  }

  // Redirect to signup if no email provided
  if (!email) {
    nav("/signup")
    return null
  }

  return (
    <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--primary-bg)', padding: 'var(--space-4) var(--space-4)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: 'var(--card-padding)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 className="heading-lg" style={{ marginBottom: 'var(--space-2)' }}>Verify OTP</h2>
          <p style={{ textAlign: 'center', color: 'var(--secondary-text)', fontSize: '14px' }}>
            We sent a 6-digit code to <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{email}</span>
          </p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--form-field-gap)' }}>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="input"
            style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '18px', fontWeight: 600 }}
            required
          />
          
          <button
            type="button"
            onClick={handleResendOTP}
            className="btn btn-ghost"
            style={{ 
              width: '100%',
              fontSize: '14px',
              padding: 'var(--button-padding)'
            }}
          >
            Resend OTP
          </button>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div style={{ textAlign: 'center', paddingTop: 'var(--space-2)' }}>
            <button
              type="button"
              onClick={() => nav("/signup")}
              className="text-body"
              style={{ 
                fontWeight: 500, 
                color: 'var(--accent)', 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Back to Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

