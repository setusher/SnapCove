import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"
import { MessageCircle, Heart, Upload, Reply, CheckCircle, XCircle, Tag, X } from "lucide-react"

export default function NotificationPanel({ onClose, onRefresh }){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const nav = useNavigate()
  const panelRef = useRef(null)

  const fetchNotifications = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get("/notifications/")
      setItems(response.data)
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
      setError("Failed to load notifications. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const markAll = async () => {
    try {
      await api.post("/notifications/read-all/")
      setItems(items.map(n => ({ ...n, is_read: true })))
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error("Failed to mark all as read:", err)
    }
  }

  const mark = async (id) => {
    try {
      await api.post(`/notifications/${id}/read/`)
      setItems(items.map(n => n.id === id ? { ...n, is_read: true } : n))
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }

  const handleNotificationClick = async (notification) => {
    await mark(notification.id)
    if (notification.photo) {
      nav(`/photos/${notification.photo}`)
      onClose()
    }
  }

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'comment': return <MessageCircle size={20} />
      case 'reply': return <Reply size={20} />
      case 'like': return <Heart size={20} />
      case 'upload': return <Upload size={20} />
      case 'approved': return <CheckCircle size={20} />
      case 'rejected': return <XCircle size={20} />
      case 'tag': return <Tag size={20} />
      default: return <MessageCircle size={20} />
    }
  }

  const getNotificationTypeLabel = (type) => {
    const labels = {
      'comment': 'Comment',
      'reply': 'Reply',
      'like': 'Like',
      'upload': 'Upload',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'tag': 'Tag'
    }
    return labels[type] || 'Notification'
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        style={{
          background: 'rgba(11, 19, 43, 0.8)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          animation: 'pageFade 0.3s ease-out'
        }}
        onClick={onClose}
      />

      {/* Notification Panel */}
      <div 
        ref={panelRef}
        className="fixed right-0 top-0 h-full w-full sm:w-[480px] flex flex-col z-50"
        style={{
          background: 'rgba(26, 41, 66, 0.95)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderLeft: '1px solid rgba(58, 80, 107, 0.3)',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.4)',
          animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-8 border-b"
          style={{ borderColor: 'rgba(58, 80, 107, 0.3)' }}
        >
          <h2 
            className="text-2xl font-bold"
            style={{ color: '#ffffff' }}
          >
            Notifications
          </h2>
          <div className="flex items-center gap-4">
            {items.length > 0 && !loading && (
              <button 
                onClick={markAll} 
                className="text-sm font-medium transition-all hover:scale-105"
                style={{ color: '#5bc0be' }}
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ 
                background: 'rgba(58, 80, 107, 0.3)',
                color: 'rgba(255, 255, 255, 0.8)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(93, 217, 193, 0.2)';
                e.currentTarget.style.color = '#6fffe9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(58, 80, 107, 0.3)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div 
                className="w-12 h-12 border-4 rounded-full animate-spin mb-4"
                style={{ 
                  borderColor: '#5bc0be', 
                  borderTopColor: 'transparent' 
                }}
              />
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Loading notifications...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl"
                style={{ 
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444'
                }}
              >
                ⚠️
              </div>
              <p 
                className="text-sm mb-6"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                {error}
              </p>
              <button
                onClick={fetchNotifications}
                className="px-6 py-3 rounded-2xl font-semibold text-sm transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #5bc0be, #6fffe9)',
                  color: '#0b132b',
                  boxShadow: '0 4px 16px rgba(93, 217, 193, 0.3)'
                }}
              >
                Try Again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <div 
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl"
                style={{ 
                  background: 'rgba(58, 80, 107, 0.2)',
                  color: 'rgba(255, 255, 255, 0.4)'
                }}
              >
                🔔
              </div>
              <p 
                className="text-lg"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                No notifications yet
              </p>
            </div>
          ) : (
            items.map((n, idx) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className="cursor-pointer transition-all duration-300 opacity-0"
                style={{
                  animation: `slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.05}s forwards`
                }}
              >
                <div 
                  className="p-5 rounded-2xl"
                  style={{
                    background: n.is_read 
                      ? 'rgba(58, 80, 107, 0.15)' 
                      : 'rgba(58, 80, 107, 0.35)',
                    border: `1px solid ${n.is_read 
                      ? 'rgba(58, 80, 107, 0.2)' 
                      : 'rgba(93, 217, 193, 0.3)'}`,
                    opacity: n.is_read ? 0.7 : 1,
                    boxShadow: n.is_read 
                      ? 'none' 
                      : '0 4px 16px rgba(93, 217, 193, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(93, 217, 193, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.borderColor = n.is_read 
                      ? 'rgba(58, 80, 107, 0.2)' 
                      : 'rgba(93, 217, 193, 0.3)';
                  }}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div 
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #5bc0be, #6fffe9)',
                        color: '#0b132b'
                      }}
                    >
                      {getNotificationIcon(n.notification_type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {n.actor_detail && (
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span 
                            className="font-semibold text-sm"
                            style={{ color: '#ffffff' }}
                          >
                            {n.actor_detail.name}
                          </span>
                          <span 
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              background: 'rgba(93, 217, 193, 0.2)',
                              color: '#6fffe9'
                            }}
                          >
                            {getNotificationTypeLabel(n.notification_type)}
                          </span>
                        </div>
                      )}

                      <p 
                        className="text-sm mb-3 leading-relaxed"
                        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        {n.message}
                      </p>

                      {n.photo_url && (
                        <div className="mb-3">
                          <img 
                            src={n.photo_url} 
                            alt="Photo"
                            className="w-full h-28 object-cover rounded-xl"
                            style={{ border: '1px solid rgba(58, 80, 107, 0.3)' }}
                          />
                        </div>
                      )}

                      <span 
                        className="text-xs"
                        style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                      >
                        {new Date(n.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Unread Indicator */}
                    {!n.is_read && (
                      <div 
                        className="flex-shrink-0 w-2.5 h-2.5 rounded-full self-start mt-2"
                        style={{ 
                          background: '#6fffe9',
                          boxShadow: '0 0 12px #6fffe9'
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}