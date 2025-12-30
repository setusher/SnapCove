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
    // Initial fetch
    fetchUnreadCount()

    // Poll every 30 seconds
    intervalRef.current = setInterval(() => {
      fetchUnreadCount()
    }, 30000)

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Refetch when panel opens
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
    fetchUnreadCount() // Refresh count when closing panel
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 flex items-center justify-center rounded-[22px] cursor-pointer transition-all relative"
          style={{
            background: open ? 'rgba(93, 217, 193, 0.2)' : 'rgba(28, 37, 65, 0.6)',
            color: open ? 'var(--aqua)' : 'var(--text-secondary)',
            border: `1px solid ${open ? 'rgba(93, 217, 193, 0.3)' : 'rgba(58, 80, 107, 0.3)'}`,
            boxShadow: open ? '0 0 20px rgba(93, 217, 193, 0.3)' : 'none'
          }}
          title="Notifications"
        >
          {loading ? (
            <div 
              className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: 'var(--aqua)', borderTopColor: 'transparent' }}
            />
          ) : (
            <Bell size={20} />
          )}
        </button>

        {count > 0 && !loading && (
          <span 
            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-xs font-bold animate-pulse"
            style={{
              background: 'linear-gradient(135deg, var(--mint), var(--aqua))',
              color: 'var(--ink)',
              boxShadow: '0 2px 8px rgba(111, 255, 233, 0.5)'
            }}
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>

      {open && (
        <NotificationPanel 
          onClose={handleClose} 
          onRefresh={handleRefresh} 
        />
      )}
    </>
  )
}