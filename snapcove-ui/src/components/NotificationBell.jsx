import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Bell } from "lucide-react"
import { api } from "../api/api"
import NotificationPanel from "./NotificationPanel"
import { toast } from "react-toastify"

export default function NotificationBell(){
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef(null)
  const wsRef = useRef(null)

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

  const refetchNotifications = () => {
    fetchUnreadCount()
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
    const token = localStorage.getItem("access_token")
    if (!token) return

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("WebSocket connected")
    }

    ws.onmessage = (e) => {
      try {
        const notification = JSON.parse(e.data)
        toast(notification.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClick: () => {
            // Navigate to photo if notification has a photo
            if (notification.photo) {
              nav(`/photos/${notification.photo}`)
            }
          },
          style: {
            cursor: notification.photo ? 'pointer' : 'default'
          }
        })
        refetchNotifications()
      } catch (err) {
        console.error("Error parsing WebSocket message:", err)
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected")
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
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
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: open ? 'var(--surface)' : 'transparent',
            border: 'none',
            color: open ? 'var(--accent)' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            if (!open) {
              e.currentTarget.style.background = 'var(--surface)'
              e.currentTarget.style.color = 'var(--accent)'
            }
          }}
          onMouseLeave={(e) => {
            if (!open) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-secondary)'
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
              top: '-4px',
              right: '-4px',
              minWidth: '20px',
              height: '20px',
              borderRadius: '10px',
              background: '#E5533D',
              border: '2px solid var(--bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: count > 9 ? '0 6px' : '0',
              fontSize: '11px',
              fontWeight: 600,
              color: 'white',
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
