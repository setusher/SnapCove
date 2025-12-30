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
      <div className="relative">
        <button
          onClick={handleClick}
          className="w-8 h-8 flex items-center justify-center cursor-pointer transition-colors relative"
          style={{
            color: open ? 'var(--accent-primary)' : 'var(--text-muted)'
          }}
          onMouseEnter={(e) => {
            if (!open) {
              e.currentTarget.style.color = 'var(--accent-primary)'
            }
          }}
          onMouseLeave={(e) => {
            if (!open) {
              e.currentTarget.style.color = 'var(--text-muted)'
            }
          }}
          title="Notifications"
        >
          {loading ? (
            <div 
              className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}
            />
          ) : (
            <Bell size={20} strokeWidth={1.5} />
          )}
        </button>

        {count > 0 && !loading && (
          <span 
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{
              background: 'var(--error)',
              color: 'var(--bg-primary)',
            }}
          >
            {count > 99 ? '99+' : count}
          </span>
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
