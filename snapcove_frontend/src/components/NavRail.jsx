import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"
import NotificationBell from "./NotificationBell"

export default function NavRail() {
  const nav = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const logout = () => {
    localStorage.clear()
    nav("/login")
  }

  const items = [
    { icon: "🏠", label: "Dashboard", path: "/dashboard" },
    { icon: "📅", label: "Events", path: "/dashboard" }
  ]

  if (["admin","coordinator"].includes(user?.role)) {
    items.push({ icon: "➕", label: "Create", path: "/events/create" })
  }

  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-4">
      
      {/* Logo */}
      <div className="w-14 h-14 rounded-[22px] flex items-center justify-center text-xl shadow-floating bg-gradient-to-br from-[#5bc0be] to-[#6fffe9] text-[#0b132b]">
        📸
      </div>

      {/* Items */}
      {items.map(i=>(
        <div
          key={i.path}
          onClick={()=>nav(i.path)}
          title={i.label}
          className={`w-14 h-14 flex items-center justify-center rounded-[22px] cursor-pointer transition-all
          ${location.pathname===i.path
            ? "bg-[#5bc0be] text-[#0b132b] shadow-glow"
            : "bg-[#1c2541]/60 text-[#6fffe9] hover:shadow-glow hover:bg-[#1c2541]"
          }`}
        >
          {i.icon}
        </div>
      ))}

      {/* Notifications */}
      <NotificationBell/>

      {/* User */}
      <div className="w-14 h-14 rounded-full flex items-center justify-center text-[#0b132b] bg-gradient-to-br from-[#5bc0be] to-[#6fffe9] font-bold">
        {user?.name?.[0]?.toUpperCase() || "U"}
      </div>

      {/* Logout */}
      <div
        onClick={logout}
        className="w-14 h-14 flex items-center justify-center rounded-[22px] cursor-pointer text-red-400 hover:bg-red-400/10 transition"
        title="Logout"
      >
        🚪
      </div>
    </aside>
  )
}
