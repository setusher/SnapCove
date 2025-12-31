import { useEffect, useState, useRef } from "react"
import { Bell } from "lucide-react"
import { api } from "../api/api"
import NotificationPanel from "./NotificationPanel"

export default function NotificationBell(){
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef(null)

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get("/notifications/unread-count/")
      setCount(response.data.count)
      setLoading(false)
    } catch (err) {
      console.error("Failed to fetch unread count:", err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUnreadCount()
    intervalRef.current = setInterval(() => {
      fetchUnreadCount()
    }, 30000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (open) {
      fetchUnreadCount()
    }
  }, [open])

  const handleRefresh = () => {
    fetchUnreadCount()
  }

  const handleClose = () => {
    setOpen(false)
    fetchUnreadCount()
  }

  const handleClick = (e) => {
    e.stopPropagation()
    setOpen(!open)
  }

  return (
    <>
      <div style={{ position: 'relative' }}>
        <button
          onClick={handleClick}
          className="flex-center"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            color: open ? 'var(--accent)' : 'var(--secondary-text)',
            background: open ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            if (!open) {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'
              e.currentTarget.style.color = 'var(--accent)'
            }
          }}
          onMouseLeave={(e) => {
            if (!open) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--secondary-text)'
            }
          }}
          title="Notifications"
        >
          {loading ? (
            <div 
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid var(--accent)',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}
            />
          ) : (
            <Bell size={20} strokeWidth={1.5} />
          )}
        </button>

        {count > 0 && !loading && (
          <span 
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--error)',
              border: '2px solid var(--secondary-bg)',
            }}
          />
        )}
      </div>

      {open && (
        <NotificationPanel 
          onClose={handleClose} 
          refresh={handleRefresh} 
        />
      )}
    </>
  )
}

