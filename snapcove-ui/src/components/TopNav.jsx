import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"
import { Bell, Search, LogOut } from "lucide-react"
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: '64px',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '0 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Logo Section */}
      <div 
        style={{ 
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--text-primary)'
        }}
        onClick={() => nav("/dashboard")}
      >
        SnapCove
      </div>

      {/* Right Section - Icons Only */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Search */}
        <button
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--surface)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-secondary)'
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
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--accent)',
              color: 'var(--bg)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '44px',
                right: '0',
                width: '220px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '8px',
                zIndex: 100,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* User Info */}
              <div style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {user?.name || 'User'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {user?.email || 'user@example.com'}
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ padding: '4px 0' }}>
                <button
                  onClick={() => {
                    nav("/profile")
                    setProfileOpen(false)
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    transition: 'background 200ms ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  My Profile
                </button>
                <button
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    transition: 'background 200ms ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Help & Support
                </button>
              </div>

              {/* Logout */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '4px' }}>
                <button
                  onClick={logout}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: 'var(--danger)',
                    transition: 'background 200ms ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(229, 83, 61, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}
          onClick={logout}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(229, 83, 61, 0.1)'
            e.currentTarget.style.color = 'var(--danger)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
          title="Logout"
        >
          <LogOut size={20} strokeWidth={1.5} />
        </button>
      </div>
    </nav>
  )
}
