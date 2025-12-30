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
    <aside 
      className="fixed left-8 top-1/2 z-50 flex flex-col items-center gap-4"
      style={{
        transform: 'translateY(-50%)'
      }}
    >
      
      {/* Logo */}
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl cursor-pointer transition-all hover:scale-110"
        onClick={() => nav("/dashboard")}
        style={{
          background: 'linear-gradient(135deg, #5bc0be, #6fffe9)',
          color: '#0b132b',
          boxShadow: '0 8px 24px rgba(93, 217, 193, 0.4)'
        }}
      >
        📸
      </div>

      {/* Divider */}
      <div 
        className="w-8 h-px"
        style={{ background: 'rgba(58, 80, 107, 0.4)' }}
      />

      {/* Navigation Items */}
      {items.map(i => {
        const isActive = location.pathname === i.path
        return (
          <div
            key={i.path}
            onClick={() => nav(i.path)}
            title={i.label}
            className="w-16 h-16 flex items-center justify-center rounded-2xl cursor-pointer transition-all text-2xl"
            style={{
              background: isActive 
                ? 'rgba(93, 217, 193, 0.2)' 
                : 'rgba(26, 41, 66, 0.6)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${isActive 
                ? 'rgba(93, 217, 193, 0.4)' 
                : 'rgba(58, 80, 107, 0.3)'}`,
              color: isActive ? '#6fffe9' : 'rgba(255, 255, 255, 0.6)',
              boxShadow: isActive 
                ? '0 0 24px rgba(93, 217, 193, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)' 
                : '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(93, 217, 193, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(93, 217, 193, 0.3)';
                e.currentTarget.style.color = '#6fffe9';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(26, 41, 66, 0.6)';
                e.currentTarget.style.borderColor = 'rgba(58, 80, 107, 0.3)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {i.icon}
          </div>
        )
      })}

      {/* Divider */}
      <div 
        className="w-8 h-px"
        style={{ background: 'rgba(58, 80, 107, 0.4)' }}
      />

      {/* Notifications */}
      <NotificationBell />

      {/* Divider */}
      <div 
        className="w-8 h-px"
        style={{ background: 'rgba(58, 80, 107, 0.4)' }}
      />

      {/* User Avatar */}
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl cursor-pointer transition-all hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, #5bc0be, #6fffe9)',
          color: '#0b132b',
          boxShadow: '0 4px 16px rgba(93, 217, 193, 0.3)'
        }}
        title={user?.name || "User"}
      >
        {user?.name?.[0]?.toUpperCase() || "U"}
      </div>

      {/* Logout */}
      <div
        onClick={logout}
        className="w-16 h-16 flex items-center justify-center rounded-2xl cursor-pointer transition-all text-2xl"
        title="Logout"
        style={{
          background: 'rgba(26, 41, 66, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(58, 80, 107, 0.3)',
          color: 'rgba(239, 68, 68, 0.8)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
          e.currentTarget.style.color = '#ef4444';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(26, 41, 66, 0.6)';
          e.currentTarget.style.borderColor = 'rgba(58, 80, 107, 0.3)';
          e.currentTarget.style.color = 'rgba(239, 68, 68, 0.8)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        🚪
      </div>
    </aside>
  )
}