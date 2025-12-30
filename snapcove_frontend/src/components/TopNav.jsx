import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"
import { Bell, Settings, Search } from "lucide-react"
import NotificationBell from "./NotificationBell"
import { useState, useRef, useEffect } from "react"

export default function TopNav() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const logout = () => {
    localStorage.clear()
    nav("/login")
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

      {/* Right Section - Icons Only */}
      <div className="flex items-center" style={{ gap: '12px' }}>
        {/* Search */}
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all"
          style={{
            color: 'var(--text-tertiary)',
            background: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(91, 192, 190, 0.1)'
            e.currentTarget.style.color = 'var(--accent-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-tertiary)'
          }}
          title="Search"
        >
          <Search size={20} strokeWidth={1.5} />
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* Profile Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all font-semibold text-sm"
            style={{
              background: 'var(--accent-primary)',
              color: 'var(--bg-primary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div 
              className="absolute"
              style={{
                top: '60px',
                right: '0',
                width: '220px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                padding: '8px',
                zIndex: 100
              }}
            >
              {/* User Info */}
              <div className="px-3 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {user?.name || 'User'}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {user?.email || 'user@example.com'}
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  className="w-full text-left px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-secondary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  My Profile
                </button>
                <button
                  onClick={() => nav("/settings")}
                  className="w-full text-left px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-secondary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  Settings
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-secondary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  Help & Support
                </button>
              </div>

              {/* Logout */}
              <div className="border-t pt-1" style={{ borderColor: 'var(--border-primary)' }}>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--error)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all"
          style={{
            color: 'var(--text-tertiary)',
            background: 'transparent'
          }}
          onClick={() => nav("/settings")}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(91, 192, 190, 0.1)'
            e.currentTarget.style.color = 'var(--accent-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-tertiary)'
          }}
          title="Settings"
        >
          <Settings size={20} strokeWidth={1.5} />
        </button>
      </div>
    </nav>
  )
}
