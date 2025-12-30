import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"
import { Image, Users, Bell, Settings, Search } from "lucide-react"
import NotificationBell from "./NotificationBell"

export default function TopNav() {
  const nav = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const items = [
    { icon: Image, label: "Albums", path: "/albums" },
    { icon: Image, label: "Photos", path: "/photos" },
    { icon: Users, label: "Users", path: "/users" },
  ]

  const isActive = (path) => {
    return location.pathname.startsWith(path)
  }

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        height: '64px',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-primary)',
        padding: '0 48px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
      }}
    >
      {/* Logo Section */}
      <div 
        className="flex items-center cursor-pointer"
        onClick={() => nav("/dashboard")}
      >
        <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          SnapCove
        </span>
      </div>

      {/* Navigation Items (Center) */}
      <div className="flex items-center" style={{ gap: '32px' }}>
        {items.map(item => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <div
              key={item.path}
              onClick={() => nav(item.path)}
              className="flex items-center cursor-pointer transition-all"
              style={{
                height: '64px',
                padding: '0 12px',
                color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                fontWeight: active ? 500 : 400,
                borderBottom: active ? '2px solid var(--accent-primary)' : '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = 'var(--text-primary)'
                  e.currentTarget.style.backgroundColor = 'rgba(91, 192, 190, 0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = 'var(--text-tertiary)'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <span className="text-sm">{item.label}</span>
            </div>
          )
        })}
      </div>

      {/* Right Section */}
      <div className="flex items-center" style={{ gap: '16px' }}>
        {/* Search */}
        <button
          className="w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
        >
          <Search size={20} strokeWidth={1.5} />
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* Profile Avatar */}
        <div 
          className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer font-semibold text-sm"
          style={{
            background: 'var(--accent-primary)',
            color: 'var(--bg-primary)'
          }}
          onClick={() => nav("/profile")}
        >
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>

        {/* Settings */}
        <button
          className="w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onClick={() => nav("/settings")}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
        >
          <Settings size={20} strokeWidth={1.5} />
        </button>
      </div>
    </nav>
  )
}
