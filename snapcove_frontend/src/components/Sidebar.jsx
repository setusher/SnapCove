import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"

export default function Sidebar({ isOpen, onClose }) {
  const nav = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const isActive = (path) => location.pathname === path

  const logout = () => {
    localStorage.clear()
    nav("/login")
  }

  const menuItems = [
    { icon: "🏠", label: "Dashboard", path: "/dashboard" },
    { icon: "📅", label: "Events", path: "/dashboard" },
  ]

  if (["admin", "coordinator"].includes(user?.role)) {
    menuItems.push({ icon: "➕", label: "Create Event", path: "/events/create" })
  }

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="p-8 border-b border-slate/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-aqua to-mint flex items-center justify-center text-2xl shadow-glow-aqua">
              📸
            </div>
            <div>
              <h1 className="text-card-title text-[#e8eaed] tracking-tight">SnapCove</h1>
              <p className="text-meta text-[#e8eaed]/50">Event Manager</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                nav(item.path)
                onClose()
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[16px] transition-all ${
                isActive(item.path)
                  ? 'bg-aqua/15 text-aqua border border-aqua/30 shadow-glow-aqua'
                  : 'text-[#e8eaed]/60 hover:bg-navy/50 hover:text-[#e8eaed] border border-transparent'
              }`}>
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium text-base">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate/20">
          <div className="flex items-center gap-4 p-4 rounded-[16px] bg-navy/50 border border-slate/20 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-aqua to-mint flex items-center justify-center font-bold text-ink text-lg shadow-glow-aqua">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#e8eaed] truncate text-base">{user?.name || 'User'}</p>
              <p className="text-meta text-[#e8eaed]/50 capitalize">{user?.role || 'member'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-[16px] bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20 hover:border-red-500/40">
            <span>🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
