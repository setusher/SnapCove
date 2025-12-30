import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"

export default function NavRail() {
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
    <nav className="nav-rail">
      {/* Logo */}
      <div 
        className="w-12 h-12 rounded-[20px] flex items-center justify-center text-xl mb-4 shadow-glow"
        style={{
          background: 'linear-gradient(135deg, var(--aqua), var(--mint))',
          color: 'var(--ink)'
        }}
      >
        📸
      </div>

      {/* Nav Items */}
      {menuItems.map((item) => (
        <div
          key={item.path}
          className={`nav-rail-item ${isActive(item.path) ? 'active' : ''}`}
          onClick={() => nav(item.path)}
          title={item.label}
        >
          {item.icon}
        </div>
      ))}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User Avatar */}
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shadow-glow"
        style={{
          background: 'linear-gradient(135deg, var(--aqua), var(--mint))',
          color: 'var(--ink)'
        }}
      >
        {user?.name?.[0]?.toUpperCase() || 'U'}
      </div>

      {/* Logout */}
      <div
        className="nav-rail-item"
        onClick={logout}
        title="Logout"
        style={{ color: 'rgba(239, 68, 68, 0.6)' }}
      >
        🚪
      </div>
    </nav>
  )
}

