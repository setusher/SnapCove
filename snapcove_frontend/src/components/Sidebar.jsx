import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"
import { Home, Calendar, Image, Users, Bell, Settings, LogOut } from "lucide-react"
import NotificationBell from "./NotificationBell"

export default function Sidebar() {
  const nav = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const logout = () => {
    localStorage.clear()
    nav("/login")
  }

  const items = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Events", path: "/dashboard" },
  ]

  if (["admin","coordinator"].includes(user?.role)) {
    items.push({ icon: Calendar, label: "Create Event", path: "/events/create" })
  }

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname.startsWith("/events")
    }
    return location.pathname === path
  }

  return (
    <aside 
      className="fixed left-0 top-0 h-full w-[240px] border-r flex flex-col"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
        padding: '24px 16px'
      }}
    >
      {/* Logo */}
      <div className="mb-8">
        <div 
          className="text-xl font-semibold cursor-pointer"
          onClick={() => nav("/dashboard")}
          style={{ color: 'var(--text-primary)' }}
        >
          SnapCove
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1">
        {items.map(item => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <div
              key={item.path}
              onClick={() => nav(item.path)}
              className="flex items-center gap-3 px-3 py-2 cursor-pointer transition-all"
              style={{
                height: '40px',
                borderRadius: '6px',
                background: active ? 'var(--bg-primary)' : 'transparent',
                border: active ? '1px solid var(--border-primary)' : '1px solid transparent',
                color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                boxShadow: active ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                fontWeight: active ? 500 : 400
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'var(--surface-elevated)'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--text-tertiary)'
                }
              }}
            >
              <Icon size={18} strokeWidth={2} />
              <span className="text-sm">{item.label}</span>
            </div>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="space-y-1 border-t pt-4" style={{ borderColor: 'var(--border-primary)' }}>
        {/* Notifications */}
        <div className="flex items-center gap-3 px-3 py-2" style={{ height: '40px' }}>
          <NotificationBell />
        </div>

        {/* Settings */}
        <div
          className="flex items-center gap-3 px-3 py-2 cursor-pointer transition-all"
          style={{
            height: '40px',
            borderRadius: '6px',
            color: 'var(--text-tertiary)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-elevated)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--text-tertiary)'
          }}
        >
          <Settings size={18} strokeWidth={2} />
          <span className="text-sm">Settings</span>
        </div>

        {/* User Profile Card */}
        <div 
          className="p-3 border rounded-md"
          style={{
            background: 'var(--bg-primary)',
            borderColor: 'var(--border-primary)',
            borderRadius: '6px'
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs"
              style={{
                background: 'var(--accent-primary)',
                color: 'var(--bg-primary)'
              }}
            >
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {user?.name || 'User'}
              </div>
              <div className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                {user?.email || 'user@example.com'}
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm transition-all"
            style={{
              height: '32px',
              borderRadius: '4px',
              color: 'var(--error)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <LogOut size={16} strokeWidth={2} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

