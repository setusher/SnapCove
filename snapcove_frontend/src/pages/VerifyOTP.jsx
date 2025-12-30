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
    <div className="min-h-screen flex items-center justify-center relative bg-ink overflow-hidden">
      <div className="absolute inset-0">
        <div className="blob aqua"></div>
        <div className="blob mint"></div>
      </div>

      <div className="glass-card w-full max-w-md p-10 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-2">Verify OTP</h2>
        <p className="text-center text-sm opacity-70 mb-6">
          We sent a 6-digit code to <span className="text-aqua">{email}</span>
        </p>

        <form onSubmit={submit} className="space-y-6">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="input-field text-center tracking-widest text-xl"
            required
          />
          <button
  type="button"
  onClick={async () => {
    await api.post("/auth/resend-otp/", { email })
    alert("New OTP sent")
  }}
  className="text-[#6fffe9] mt-3 text-sm hover:underline"
>
  Resend OTP
</button>

          <button
            disabled={loading}
            className="btn btn-primary w-full py-4"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  )
}
