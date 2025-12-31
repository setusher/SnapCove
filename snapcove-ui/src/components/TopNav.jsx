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
      className="flex-between"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: '64px',
        background: 'var(--secondary-bg)',
        borderBottom: '1px solid var(--border)',
        padding: `0 var(--space-12)`,
      }}
    >
      {/* Logo Section */}
      <div 
        className="flex items-center"
        style={{ cursor: 'pointer' }}
        onClick={() => nav("/dashboard")}
      >
        <span className="heading-md" style={{ color: 'var(--primary-text)' }}>
          SnapCove
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
        {/* Search */}
        <button
          className="flex-center"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            color: 'var(--secondary-text)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--secondary-text)'
          }}
          title="Search"
        >
          <Search size={20} strokeWidth={1.5} />
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* Profile Avatar */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex-center"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--accent)',
              color: 'white',
              fontWeight: 600,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div 
              className="card"
              style={{
                position: 'absolute',
                top: '60px',
                right: '0',
                width: '220px',
                padding: 'var(--space-2)',
                zIndex: 100
              }}
            >
              {/* User Info */}
              <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--border)' }}>
                <div className="text-body" style={{ fontWeight: 500 }}>
                  {user?.name || 'User'}
                </div>
                <div className="text-caption" style={{ marginTop: 'var(--space-1)' }}>
                  {user?.email || 'user@example.com'}
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ padding: 'var(--space-1) 0' }}>
                <button
                  className="text-body"
                  style={{ 
                    width: '100%',
                    textAlign: 'left',
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--primary-text)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  My Profile
                </button>
                <button
                  onClick={() => nav("/settings")}
                  className="text-body"
                  style={{ 
                    width: '100%',
                    textAlign: 'left',
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--primary-text)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Settings
                </button>
                <button
                  className="text-body"
                  style={{ 
                    width: '100%',
                    textAlign: 'left',
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--primary-text)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Help & Support
                </button>
              </div>

              {/* Logout */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-1)' }}>
                <button
                  onClick={logout}
                  className="btn btn-danger"
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          className="flex-center"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            color: 'var(--secondary-text)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}
          onClick={() => nav("/settings")}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--secondary-text)'
          }}
          title="Settings"
        >
          <Settings size={20} strokeWidth={1.5} />
        </button>
      </div>
    </nav>
  )
}

