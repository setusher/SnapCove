import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"
import { Home, Calendar, Plus, Bell, Settings, LogOut } from "lucide-react"
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
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Events", path: "/dashboard" }
  ]

  if (["admin","coordinator"].includes(user?.role)) {
    items.push({ icon: Plus, label: "Create", path: "/events/create" })
  }

  return (
    <aside 
      className="fixed left-0 top-0 h-full w-16 border-r flex flex-col items-center py-4"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Logo/App Icon */}
      <div 
        className="w-10 h-10 flex items-center justify-center mb-8 cursor-pointer"
        onClick={() => nav("/dashboard")}
        style={{
          color: 'var(--accent)'
        }}
      >
        <span className="text-xl font-bold">S</span>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-1 w-full">
        {items.map(i => {
          const isActive = location.pathname === i.path || 
            (i.path === "/dashboard" && location.pathname.startsWith("/events"))
          const Icon = i.icon
          return (
            <div
              key={i.path}
              onClick={() => nav(i.path)}
              title={i.label}
              className="relative flex items-center justify-center w-full h-10 cursor-pointer transition-colors"
              style={{
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'rgba(91, 192, 190, 0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-primary)'
                  e.currentTarget.style.backgroundColor = 'var(--surface)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {/* Active indicator - 2px left border */}
              {isActive && (
                <div 
                  className="absolute left-0 top-0 bottom-0 w-0.5"
                  style={{ background: 'var(--accent)' }}
                />
              )}
              <Icon size={20} strokeWidth={1.5} />
            </div>
          )
        })}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto flex flex-col gap-1 w-full">
        {/* Notifications */}
        <div className="flex items-center justify-center w-full h-10">
          <NotificationBell />
        </div>

        {/* Settings (if needed) */}
        <div
          className="flex items-center justify-center w-full h-10 cursor-pointer transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)'
            e.currentTarget.style.backgroundColor = 'var(--surface)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <Settings size={20} strokeWidth={1.5} />
        </div>

        {/* Logout */}
        <div
          onClick={logout}
          className="flex items-center justify-center w-full h-10 cursor-pointer transition-colors"
          title="Logout"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--danger)'
            e.currentTarget.style.backgroundColor = 'rgba(229, 83, 61, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <LogOut size={20} strokeWidth={1.5} />
        </div>
      </div>
    </aside>
  )
}
